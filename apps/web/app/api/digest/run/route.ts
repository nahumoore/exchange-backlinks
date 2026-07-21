import { NextResponse } from "next/server"

import { type DigestSend, sendDigestEmails } from "@/lib/email"
import {
  DAILY_CAP,
  DIGEST_DAILY_CAP,
  reserveEmailSends,
  todaysUsage,
} from "@/lib/email-budget"
import {
  aliasEmail,
  contactAliasFor,
  createRelayThreads,
  type RelayThread,
} from "@/lib/relay"
import { SITE_URL } from "@/lib/site"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { signUnsubscribeToken } from "@/lib/unsubscribe-token"

const DIGEST_CADENCE_MS = 7 * 24 * 60 * 60 * 1000
const MAX_LISTINGS_PER_DIGEST = 5
// Fetch a multiple of the send budget since some candidates won't have a
// match yet and get skipped without consuming a send.
const CANDIDATE_OVERFETCH_FACTOR = 4

type OwnSite = { id: string; niche: string }
type Member = {
  id: string
  email: string
  last_digest_sent_at: string | null
  sites: OwnSite[] | null
}
type Candidate = {
  id: string
  member_id: string
  niche: string
  keywords: string[]
  description: string
  domain_rating: number | null
}
type Pick = { ownSiteId: string; candidate: Candidate; niche: string }

function pairKey(siteXId: string, siteYId: string) {
  return siteXId < siteYId ? `${siteXId}:${siteYId}` : `${siteYId}:${siteXId}`
}

// POST /api/digest/run — triggered by the mail worker's weekday cron. Selects
// members due for a digest, matches each of their sites against other sites
// in the same niche, creates/reuses a masked relay thread per match, and
// emails a listing that never reveals a domain or real email address.
//
// Every query below is batched across the *whole* run instead of issued per
// member/site — each one counts as a subrequest against the Cloudflare
// Worker's per-invocation limit, and a one-query-per-member version was
// silently getting cut off after ~5-7 members every single day, long before
// the digest/day cap was ever in reach.
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  const supabase = getSupabaseAdmin()
  const cap = Math.min(DIGEST_DAILY_CAP, DAILY_CAP)
  const used = await todaysUsage(supabase)
  const budget = cap - used
  if (budget <= 0) {
    return NextResponse.json({ sent: 0, skipped: 0, budgetRemaining: 0 })
  }

  const cutoff = new Date(Date.now() - DIGEST_CADENCE_MS).toISOString()
  const { data: membersData, error } = await supabase
    .from("members")
    .select("id, email, last_digest_sent_at, sites(id, niche)")
    .not("verified_at", "is", null)
    .is("unsubscribed_at", null)
    .or(`last_digest_sent_at.is.null,last_digest_sent_at.lt.${cutoff}`)
    .order("last_digest_sent_at", { ascending: true, nullsFirst: true })
    .limit(budget * CANDIDATE_OVERFETCH_FACTOR)
  if (error) {
    console.error("digest/run: member fetch failed", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  const members = (membersData ?? []) as Member[]
  const consideredMembers = members.filter((m) => (m.sites?.length ?? 0) > 0)
  const noSiteSkips = members.length - consideredMembers.length

  const ownSiteIds = consideredMembers.flatMap((m) =>
    (m.sites ?? []).map((s) => s.id)
  )
  const niches = Array.from(
    new Set(consideredMembers.flatMap((m) => (m.sites ?? []).map((s) => s.niche)))
  )

  // One query for every candidate site across every niche any due member
  // needs, instead of one query per (member, site).
  const candidatesByNiche = new Map<string, Candidate[]>()
  if (niches.length > 0) {
    const { data: candidateRows, error: candidateError } = await supabase
      .from("sites")
      .select(
        "id, member_id, niche, keywords, description, domain_rating, members!inner(unsubscribed_at)"
      )
      .in("niche", niches)
      .is("members.unsubscribed_at", null)
      .order("domain_rating", { ascending: false, nullsFirst: false })
    if (candidateError) {
      console.error("digest/run: candidate fetch failed", candidateError)
      return NextResponse.json({ error: "server_error" }, { status: 500 })
    }
    for (const row of (candidateRows ?? []) as Candidate[]) {
      const list = candidatesByNiche.get(row.niche)
      if (list) list.push(row)
      else candidatesByNiche.set(row.niche, [row])
    }
  }

  // One query for every existing thread touching any due member's own
  // sites, instead of one per member — covers both the "already matched"
  // preference and the alias lookup for pairs we don't need to create.
  const existingThreadByKey = new Map<string, RelayThread>()
  const alreadyMatchedForSite = new Map<string, Set<string>>()
  if (ownSiteIds.length > 0) {
    const { data: threadRows, error: threadError } = await supabase
      .from("relay_threads")
      .select("id, site_a_id, site_b_id, alias_a, alias_b")
      .or(
        `site_a_id.in.(${ownSiteIds.join(",")}),site_b_id.in.(${ownSiteIds.join(",")})`
      )
    if (threadError) {
      console.error("digest/run: thread fetch failed", threadError)
      return NextResponse.json({ error: "server_error" }, { status: 500 })
    }
    const addMatch = (a: string, b: string) => {
      if (!alreadyMatchedForSite.has(a)) alreadyMatchedForSite.set(a, new Set())
      alreadyMatchedForSite.get(a)!.add(b)
    }
    for (const t of (threadRows ?? []) as RelayThread[]) {
      existingThreadByKey.set(`${t.site_a_id}:${t.site_b_id}`, t)
      addMatch(t.site_a_id, t.site_b_id)
      addMatch(t.site_b_id, t.site_a_id)
    }
  }

  // Pick matches purely in memory — no DB round trips in this loop at all.
  const picksByMember = new Map<string, Pick[]>()
  const willSendMembers: Member[] = []

  for (const member of consideredMembers) {
    if (willSendMembers.length >= budget) break

    const usedCandidateIds = new Set<string>()
    const picks: Pick[] = []

    for (const site of member.sites ?? []) {
      if (picks.length >= MAX_LISTINGS_PER_DIGEST) break

      const candidates = (candidatesByNiche.get(site.niche) ?? []).filter(
        (c) => c.member_id !== member.id
      )
      if (candidates.length === 0) continue

      const matchedPartners = alreadyMatchedForSite.get(site.id)
      const pick =
        candidates.find(
          (c) => !matchedPartners?.has(c.id) && !usedCandidateIds.has(c.id)
        ) ?? candidates.find((c) => !usedCandidateIds.has(c.id))
      if (!pick) continue

      usedCandidateIds.add(pick.id)
      picks.push({ ownSiteId: site.id, candidate: pick, niche: site.niche })
    }

    if (picks.length > 0) {
      picksByMember.set(member.id, picks)
      willSendMembers.push(member)
    }
  }

  const wantCount = willSendMembers.length
  const grantedCount = await reserveEmailSends(supabase, DIGEST_DAILY_CAP, wantCount)
  const grantedMembers = willSendMembers.slice(0, grantedCount)

  // Create every new relay thread the granted members' picks need in one
  // batch, deduping pairs that two different members both picked (a mutual
  // match) so we don't attempt the same insert twice.
  const newPairsByKey = new Map<
    string,
    { siteAId: string; siteBId: string; niche: string }
  >()
  for (const member of grantedMembers) {
    for (const pick of picksByMember.get(member.id) ?? []) {
      const key = pairKey(pick.ownSiteId, pick.candidate.id)
      if (existingThreadByKey.has(key) || newPairsByKey.has(key)) continue
      const [siteAId, siteBId] =
        pick.ownSiteId < pick.candidate.id
          ? [pick.ownSiteId, pick.candidate.id]
          : [pick.candidate.id, pick.ownSiteId]
      newPairsByKey.set(key, { siteAId, siteBId, niche: pick.niche })
    }
  }
  const createdThreadByKey = await createRelayThreads(
    supabase,
    Array.from(newPairsByKey.values())
  )

  const sends: DigestSend[] = []
  const sentMemberIds: string[] = []
  for (const member of grantedMembers) {
    const picks = picksByMember.get(member.id) ?? []
    const listings = picks.flatMap((pick) => {
      const key = pairKey(pick.ownSiteId, pick.candidate.id)
      const thread = existingThreadByKey.get(key) ?? createdThreadByKey.get(key)
      if (!thread) return [] // lost race and still missing — skip, not fatal
      const contactAlias = contactAliasFor(thread, pick.ownSiteId)
      return [
        {
          niche: pick.candidate.niche,
          description: pick.candidate.description,
          domainRating: pick.candidate.domain_rating,
          keywords: pick.candidate.keywords,
          contactEmail: aliasEmail(contactAlias),
        },
      ]
    })
    if (listings.length === 0) continue

    sends.push({
      to: member.email,
      listings,
      unsubscribeUrl: `${SITE_URL}/unsubscribe?t=${signUnsubscribeToken(member.id)}`,
    })
    sentMemberIds.push(member.id)
  }

  await sendDigestEmails(sends)

  if (sentMemberIds.length > 0) {
    const { error: updateError } = await supabase
      .from("members")
      .update({ last_digest_sent_at: new Date().toISOString() })
      .in("id", sentMemberIds)
    if (updateError) {
      console.error("digest/run: last_digest_sent_at update failed", updateError)
    }
  }

  const sent = sentMemberIds.length
  return NextResponse.json({
    sent,
    skipped: consideredMembers.length - sent + noSiteSkips,
    budgetRemaining: Math.max(cap - used - sent, 0),
  })
}

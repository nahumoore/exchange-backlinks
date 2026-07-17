import { NextResponse } from "next/server"

import { type DigestListing, sendDigestEmail } from "@/lib/email"
import {
  DAILY_CAP,
  DIGEST_DAILY_CAP,
  reserveEmailSend,
  todaysUsage,
} from "@/lib/email-budget"
import { aliasEmail, contactAliasFor, getOrCreateThread } from "@/lib/relay"
import { SITE_URL } from "@/lib/site"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { signUnsubscribeToken } from "@/lib/unsubscribe-token"

const DIGEST_CADENCE_MS = 7 * 24 * 60 * 60 * 1000
const MAX_LISTINGS_PER_DIGEST = 5
// Fetch a multiple of the send budget since some candidates won't have a
// match yet and get skipped without consuming a send.
const CANDIDATE_OVERFETCH_FACTOR = 4

// POST /api/digest/run — triggered by the mail worker's weekday cron. Selects
// members due for a digest, matches each of their sites against other sites
// in the same niche, creates/reuses a masked relay thread per match, and
// emails a listing that never reveals a domain or real email address.
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
  const { data: members, error } = await supabase
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

  let sent = 0
  let skipped = 0

  for (const member of members ?? []) {
    if (sent >= budget) break

    const ownSites: { id: string; niche: string }[] = member.sites ?? []
    if (ownSites.length === 0) {
      skipped++
      continue
    }

    const listings = await buildListings(supabase, member.id, ownSites)
    if (listings.length === 0) {
      skipped++
      continue
    }

    const reserved = await reserveEmailSend(supabase, DIGEST_DAILY_CAP)
    if (!reserved) break // budget exhausted mid-run; rest roll to next weekday

    const unsubscribeUrl = `${SITE_URL}/unsubscribe?t=${signUnsubscribeToken(member.id)}`
    await sendDigestEmail({ to: member.email, listings, unsubscribeUrl })
    await supabase
      .from("members")
      .update({ last_digest_sent_at: new Date().toISOString() })
      .eq("id", member.id)
    sent++
  }

  return NextResponse.json({
    sent,
    skipped,
    budgetRemaining: Math.max(cap - used - sent, 0),
  })
}

async function buildListings(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  memberId: string,
  ownSites: { id: string; niche: string }[]
): Promise<DigestListing[]> {
  const ownSiteIds = ownSites.map((s) => s.id)

  const { data: threadRows } = await supabase
    .from("relay_threads")
    .select("site_a_id, site_b_id")
    .or(
      ownSiteIds.map((id) => `site_a_id.eq.${id},site_b_id.eq.${id}`).join(",")
    )
  const alreadyMatched = new Set(
    (threadRows ?? []).flatMap((t) => [t.site_a_id, t.site_b_id])
  )

  const listings: DigestListing[] = []
  const usedCandidateIds = new Set<string>()

  for (const site of ownSites) {
    if (listings.length >= MAX_LISTINGS_PER_DIGEST) break

    const { data: candidates } = await supabase
      .from("sites")
      .select(
        "id, niche, keywords, description, domain_rating, members!inner(unsubscribed_at)"
      )
      .eq("niche", site.niche)
      .neq("member_id", memberId)
      .is("members.unsubscribed_at", null)
      .order("domain_rating", { ascending: false, nullsFirst: false })
      .limit(20)
    if (!candidates || candidates.length === 0) continue

    const pick =
      candidates.find(
        (c) => !alreadyMatched.has(c.id) && !usedCandidateIds.has(c.id)
      ) ?? candidates.find((c) => !usedCandidateIds.has(c.id))
    if (!pick) continue
    usedCandidateIds.add(pick.id)

    const thread = await getOrCreateThread(
      supabase,
      site.id,
      pick.id,
      site.niche
    )
    const contactAlias = contactAliasFor(thread, site.id)
    listings.push({
      niche: pick.niche,
      description: pick.description,
      domainRating: pick.domain_rating,
      keywords: pick.keywords,
      contactEmail: aliasEmail(contactAlias),
    })
  }

  return listings
}

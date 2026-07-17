import { NextResponse } from "next/server"
import { z } from "zod"

import { sendRelayEmail } from "@/lib/email"
import { DAILY_CAP, reserveEmailSend } from "@/lib/email-budget"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

const bodySchema = z.object({
  to: z.string(),
  from: z.string(),
  subject: z.string().optional(),
  text: z.string().optional(),
  html: z.string().optional(),
})

// Case preserved — aliases are case-sensitive base64url, but callers that
// want to compare a real address (case-insensitive, per members.email's
// lowercase normalization) should lowercase the result themselves.
function extractEmail(value: string) {
  const match = value.match(/<([^>]+)>/)
  return (match?.[1] ?? value).trim()
}

function aliasFromAddress(address: string, relayDomain: string) {
  const email = extractEmail(address)
  const suffix = `@${relayDomain}`
  if (!email.toLowerCase().endsWith(suffix.toLowerCase())) return null
  return email.slice(0, email.length - suffix.length)
}

// POST /api/relay/inbound — called by the mail worker's Email Routing
// handler for every message addressed to a masked alias on RELAY_DOMAIN.
// Confirms the sender is the other party in the thread, then re-sends to the
// recipient's real email — this is the one-time identity reveal: the site's
// domain stays hidden forever, but the sender's real email is now surfaced
// (display name + Reply-To) so the two parties can finish the conversation
// directly instead of relaying every message from here on.
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  const relayDomain = process.env.RELAY_DOMAIN
  if (!relayDomain) {
    console.error("relay/inbound: missing RELAY_DOMAIN env variable")
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }
  const { to, from, subject, text, html } = parsed.data

  const alias = aliasFromAddress(to, relayDomain)
  if (!alias) {
    // Not addressed to a masked alias — drop without retrying.
    return NextResponse.json({ ok: true, dropped: "unknown_recipient" })
  }

  const supabase = getSupabaseAdmin()
  const { data: thread, error: threadError } = await supabase
    .from("relay_threads")
    .select("site_a_id, site_b_id, alias_a, alias_b, niche")
    .or(`alias_a.eq.${alias},alias_b.eq.${alias}`)
    .maybeSingle()
  if (threadError) {
    console.error("relay/inbound: thread lookup failed", threadError)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
  if (!thread) {
    return NextResponse.json({ ok: true, dropped: "unknown_alias" })
  }

  const inboundIsAliasA = thread.alias_a === alias
  const recipientSiteId = inboundIsAliasA ? thread.site_a_id : thread.site_b_id
  const senderSiteId = inboundIsAliasA ? thread.site_b_id : thread.site_a_id

  const { data: sites, error: sitesError } = await supabase
    .from("sites")
    .select("id, member_id, niche, keywords, description, domain_rating")
    .in("id", [recipientSiteId, senderSiteId])
  if (sitesError || !sites || sites.length !== 2) {
    console.error("relay/inbound: site lookup failed", sitesError)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
  const recipientSite = sites.find((s) => s.id === recipientSiteId)
  const senderSite = sites.find((s) => s.id === senderSiteId)
  if (!recipientSite || !senderSite) {
    console.error("relay/inbound: thread references a deleted site", {
      recipientSiteId,
      senderSiteId,
    })
    return NextResponse.json({ ok: true, dropped: "site_gone" })
  }

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, email, unsubscribed_at")
    .in("id", [recipientSite.member_id, senderSite.member_id])
  if (membersError || !members || members.length !== 2) {
    console.error("relay/inbound: member lookup failed", membersError)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
  const recipientMember = members.find((m) => m.id === recipientSite.member_id)
  const senderMember = members.find((m) => m.id === senderSite.member_id)
  const recipientEmail = recipientMember?.email
  const expectedSenderEmail = senderMember?.email
  if (!recipientEmail || !expectedSenderEmail) {
    console.error("relay/inbound: thread references a deleted member")
    return NextResponse.json({ ok: true, dropped: "member_gone" })
  }
  // Don't relay a contact to someone who's left the exchange.
  if (recipientMember?.unsubscribed_at) {
    return NextResponse.json({ ok: true, dropped: "recipient_unsubscribed" })
  }

  // The only legitimate sender to this alias is the other side of the
  // thread — anyone else is a stranger who guessed or scraped the address.
  if (extractEmail(from).toLowerCase() !== expectedSenderEmail) {
    console.warn("relay/inbound: sender mismatch, dropping", { alias, from })
    return NextResponse.json({ ok: true, dropped: "sender_mismatch" })
  }

  const reserved = await reserveEmailSend(supabase, DAILY_CAP)
  if (!reserved) {
    console.warn("relay/inbound: daily cap reached, dropping", { alias })
    return NextResponse.json({ ok: true, dropped: "over_cap" })
  }

  await sendRelayEmail({
    to: recipientEmail,
    senderEmail: expectedSenderEmail,
    niche: thread.niche,
    subject: subject?.trim() || "Backlink exchange",
    text: text ?? "(no message body)",
    html,
    senderSite: {
      niche: senderSite.niche,
      description: senderSite.description,
      domainRating: senderSite.domain_rating,
      keywords: senderSite.keywords,
    },
  })

  return NextResponse.json({ ok: true })
}

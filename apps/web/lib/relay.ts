import { randomBytes } from "node:crypto"

import type { getSupabaseAdmin } from "@/lib/supabase/admin"

// Domain-blind relay: a matched pair of sites gets one thread with two
// aliases. Mail sent TO alias_a forwards to site_a's owner, TO alias_b
// forwards to site_b's owner — so the contact address shown to A about B is
// alias_b, and B's replies to alias_a land back with A. Domains are never
// revealed by us, but the first message through the relay does surface the
// sender's real email to the recipient (see sendRelayEmail) so the two can
// finish the conversation directly instead of relaying every message.

function getRelayDomain() {
  const domain = process.env.RELAY_DOMAIN
  if (!domain) throw new Error("Missing RELAY_DOMAIN env variable")
  return domain
}

export function aliasEmail(alias: string) {
  return `${alias}@${getRelayDomain()}`
}

function newAlias() {
  return randomBytes(6).toString("base64url")
}

type Supabase = ReturnType<typeof getSupabaseAdmin>

export async function getOrCreateThread(
  supabase: Supabase,
  siteXId: string,
  siteYId: string,
  niche: string
) {
  // site_a_id is always the smaller uuid, so an unordered pair maps to
  // exactly one row regardless of which side we're matching from.
  const [siteAId, siteBId] =
    siteXId < siteYId ? [siteXId, siteYId] : [siteYId, siteXId]

  const { data: existing, error: selectError } = await supabase
    .from("relay_threads")
    .select("id, site_a_id, site_b_id, alias_a, alias_b")
    .eq("site_a_id", siteAId)
    .eq("site_b_id", siteBId)
    .maybeSingle()
  if (selectError) throw selectError
  if (existing) return existing

  const { data: created, error: insertError } = await supabase
    .from("relay_threads")
    .insert({
      site_a_id: siteAId,
      site_b_id: siteBId,
      alias_a: newAlias(),
      alias_b: newAlias(),
      niche,
    })
    .select("id, site_a_id, site_b_id, alias_a, alias_b")
    .single()
  if (!insertError) return created

  // Lost the race against a concurrent digest run matching the same pair —
  // the unique (site_a_id, site_b_id) constraint fired. Re-select instead.
  if (insertError.code === "23505") {
    const { data: retried, error: retryError } = await supabase
      .from("relay_threads")
      .select("id, site_a_id, site_b_id, alias_a, alias_b")
      .eq("site_a_id", siteAId)
      .eq("site_b_id", siteBId)
      .single()
    if (retryError) throw retryError
    return retried
  }

  throw insertError
}

/** Given a thread and which site is receiving this listing, returns the
 * alias to show as the contact address (it delivers to the *other* site). */
export function contactAliasFor(
  thread: {
    site_a_id: string
    site_b_id: string
    alias_a: string
    alias_b: string
  },
  viewerSiteId: string
) {
  return thread.site_a_id === viewerSiteId ? thread.alias_b : thread.alias_a
}

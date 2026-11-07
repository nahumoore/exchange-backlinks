export const SITE_URL = "https://exchange-backlinks.com"
export const SITE_NAME = "Exchange Backlinks"
export const SITE_TITLE =
  "Exchange Backlinks — trade backlinks in your B2B niche"
export const SITE_DESCRIPTION =
  "A 100% free backlink exchange. Submit your site and a weekly email matches it with other B2B sites in your niche — you arrange the swap. No fees, no catch."
export const GITHUB_URL = "https://github.com/nahumoore/exchange-backlinks"

export const MENTIOHUNT_URL = "https://mentiohunt.com"

/**
 * Builds a UTM-tagged Mentiohunt link. This whole site is a lead magnet for
 * Mentiohunt, so every outbound link to it must go through here — and must
 * NOT use rel="noreferrer" — so Mentiohunt's analytics can attribute the
 * traffic. `medium` is the channel (referral, email), `campaign` the
 * placement (footer, weekly_digest, …).
 */
export function mentiohuntUrl({
  medium,
  campaign,
  content,
  url = MENTIOHUNT_URL,
}: {
  medium: string
  campaign: string
  content?: string
  url?: string
}) {
  const target = new URL(url)
  target.searchParams.set("utm_source", "exchange-backlinks")
  target.searchParams.set("utm_medium", medium)
  target.searchParams.set("utm_campaign", campaign)
  if (content) target.searchParams.set("utm_content", content)
  return target.toString()
}

/** True for links pointing at mentiohunt.com (or a subdomain of it). */
export function isMentiohuntUrl(href: string) {
  try {
    const { hostname } = new URL(href)
    return hostname === "mentiohunt.com" || hostname.endsWith(".mentiohunt.com")
  } catch {
    return false
  }
}

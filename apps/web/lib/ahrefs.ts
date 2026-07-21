// Ahrefs' public Domain Rating endpoint — free, but now requires an API key
// (AHREFS_API_KEY). Per the Domain Rating License, DR shown to users must be
// attributed to Ahrefs (the submit-website form does this with an Ahrefs
// favicon + label next to the score).
const ENDPOINT = "https://api.ahrefs.com/v3/public/domain-rating-free"

/**
 * Fetches a domain's Ahrefs Domain Rating (0-100). Returns `null` on any
 * failure — DR is a nice-to-have, not something worth failing the whole
 * analyze/submit flow over, and `sites.domain_rating` is nullable.
 */
export async function getDomainRating(domain: string): Promise<number | null> {
  const apiKey = process.env.AHREFS_API_KEY
  if (!apiKey) {
    console.error("ahrefs: AHREFS_API_KEY is not set")
    return null
  }
  try {
    const url = `${ENDPOINT}?target=${encodeURIComponent(domain)}&output=json`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      console.error(`ahrefs: request failed with status ${res.status}`)
      return null
    }
    const body = (await res.json()) as {
      domain_rating?: { domain_rating?: number }
    }
    const rating = body.domain_rating?.domain_rating
    if (typeof rating !== "number" || !Number.isFinite(rating)) {
      console.error("ahrefs: unexpected response shape", body)
      return null
    }
    return Math.round(rating)
  } catch (error) {
    console.error("ahrefs: request errored", error)
    return null
  }
}

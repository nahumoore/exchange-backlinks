// Mock: deterministic pseudo-rating from the domain so repeat runs are
// stable. Shared by /api/analyze-site (shown to the user) and /api/sites
// (recomputed server-side — never trust a client-supplied metric).
// TODO(backend): replace with a real SEO metrics provider (Ahrefs / Moz /
// DataForSEO).
export function mockDomainRating(domain: string) {
  const seed = [...domain].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7)
  return 18 + (seed % 58)
}

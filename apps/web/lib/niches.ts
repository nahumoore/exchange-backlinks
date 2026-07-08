/**
 * The fixed list of B2B niches sites can register under. Single source of
 * truth for the homepage carousel and the /submit-website niche dropdown —
 * matching by niche is the whole product, so this stays a closed list.
 */
export const NICHES = [
  { name: "cloud security", members: 61 },
  { name: "devops tooling", members: 54 },
  { name: "hr tech", members: 47 },
  { name: "payroll software", members: 33 },
  { name: "sales enablement", members: 58 },
  { name: "revops", members: 41 },
  { name: "api monitoring", members: 26 },
  { name: "product analytics", members: 68 },
  { name: "observability", members: 45 },
  { name: "email deliverability", members: 38 },
  { name: "cold outreach", members: 52 },
  { name: "legal tech", members: 29 },
  { name: "compliance", members: 36 },
  { name: "fintech infrastructure", members: 64 },
  { name: "customer success", members: 49 },
  { name: "web scraping", members: 23 },
] as const

export const NICHE_NAMES = NICHES.map((n) => n.name)

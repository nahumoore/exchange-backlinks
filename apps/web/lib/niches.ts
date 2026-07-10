/**
 * The fixed list of B2B niches sites can register under. Single source of
 * truth for the homepage carousel and the /submit-website niche combobox —
 * matching by niche is the whole product, so this stays a closed list.
 * Niches are broad content topics (what a B2B blog writes about), not narrow
 * product categories — broader buckets mean more members per niche, so the
 * weekly match is more likely to find a partner.
 */
export const NICHES = [
  { name: "marketing", members: 74 },
  { name: "content marketing", members: 56 },
  { name: "seo", members: 81 },
  { name: "social media", members: 42 },
  { name: "sales", members: 63 },
  { name: "sales enablement", members: 48 },
  { name: "crm & revops", members: 39 },
  { name: "customer success", members: 51 },
  { name: "customer support", members: 37 },
  { name: "hr & recruiting", members: 46 },
  { name: "people ops", members: 28 },
  { name: "product management", members: 58 },
  { name: "product analytics", members: 44 },
  { name: "ux & design", members: 33 },
  { name: "engineering", members: 61 },
  { name: "devops", members: 47 },
  { name: "cloud infrastructure", members: 40 },
  { name: "cybersecurity", members: 55 },
  { name: "data privacy & compliance", members: 31 },
  { name: "legal tech", members: 26 },
  { name: "fintech", members: 59 },
  { name: "payments", members: 34 },
  { name: "accounting & finance", members: 38 },
  { name: "ecommerce", members: 67 },
  { name: "martech", members: 43 },
  { name: "ai & automation", members: 72 },
  { name: "no-code & low-code", members: 29 },
  { name: "project management", members: 45 },
  { name: "collaboration & productivity", members: 41 },
  { name: "email & outreach", members: 36 },
  { name: "developer tools & apis", members: 50 },
  { name: "startups & venture", members: 32 },
] as const

export const NICHE_NAMES = NICHES.map((n) => n.name)

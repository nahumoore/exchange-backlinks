import { NextResponse } from "next/server"

// POST /api/sites — adds a website under a verified member.
//
// TODO(backend):
//   1. Validate the body with zod ({ memberId, domain, niche, keywords,
//      description }) — niche must be one of NICHE_NAMES from @/lib/niches,
//      keywords is a non-empty string array, description a short string.
//   2. Look up the member by id; reject if unknown or not verified.
//   3. Normalize the domain (lowercase, strip protocol/www/path) — the client
//      does this too, but never trust it.
//   4. Re-run the /api/analyze-site pipeline server-side for the domain
//      rating — never trust a client-supplied metric.
//   5. Enforce GLOBAL domain uniqueness (a domain belongs to exactly one
//      member, ever) → 409 { error: "domain_taken" } if it exists.
//   6. Insert into sites and return the created row.
export async function POST() {
  // Frontend-only stub: accept anything so the UI flow can be exercised.
  return NextResponse.json({ ok: true })
}

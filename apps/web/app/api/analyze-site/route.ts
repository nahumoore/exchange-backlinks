import { NextResponse } from "next/server"

import { mockDomainRating } from "@/lib/analyze"

// POST /api/analyze-site — builds the site profile shown on /submit-website
// after the user enters their domain.
//
// TODO(backend):
//   1. Validate the body with zod ({ domain }) and normalize server-side.
//   2. Fetch https://<domain> (short timeout, capped redirects) and parse the
//      <title> + meta description from the homepage.
//   3. Pull the domain rating from an SEO metrics provider
//      (Ahrefs / Moz / DataForSEO).
//   4. Generate a short site description with Claude from the homepage
//      content — the user can edit it before submitting.
//   5. Unreachable site → 422 { error: "site_unreachable" }.
export async function POST(request: Request) {
  const { domain = "your-site.com" } = (await request
    .json()
    .catch(() => ({}))) as { domain?: string }

  // Mock rating (shared with /api/sites), plus a short delay so the
  // "analyzing" state is visible.
  const brand = domain.split(".")[0] ?? domain
  const name = brand.charAt(0).toUpperCase() + brand.slice(1)
  await new Promise((resolve) => setTimeout(resolve, 700))

  return NextResponse.json({
    domainRating: mockDomainRating(domain),
    description: `${name} is a B2B platform publishing product-led guides, benchmarks and tooling deep-dives for teams in its niche. Its content targets practitioners evaluating solutions, making it a natural backlink partner for adjacent B2B sites.`,
  })
}

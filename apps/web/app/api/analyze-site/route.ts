import { NextResponse } from "next/server"
import { z } from "zod"

import { getDomainRating } from "@/lib/ahrefs"
import { domainSchema } from "@/lib/domain"
import { generateSiteDescription } from "@/lib/openrouter"
import { scrapeSite, SiteUnreachableError } from "@/lib/scrape"

const bodySchema = z.object({ domain: domainSchema })

// POST /api/analyze-site — builds the site profile shown on /submit-website
// after the user enters their domain: scrapes the homepage, pulls a Domain
// Rating from Ahrefs' free public API, and has an OpenRouter model write a
// short description (identity-scrubbed so the site can't be identified from
// its listing).
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }
  const { domain } = parsed.data

  let scraped
  try {
    scraped = await scrapeSite(domain)
  } catch (error) {
    if (error instanceof SiteUnreachableError) {
      return NextResponse.json({ error: "site_unreachable" }, { status: 422 })
    }
    throw error
  }

  const [domainRating, description] = await Promise.all([
    getDomainRating(domain),
    generateSiteDescription(scraped, domain),
  ])

  return NextResponse.json({ domainRating, description })
}

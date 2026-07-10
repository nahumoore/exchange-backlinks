import { NextResponse } from "next/server"
import { z } from "zod"

import { getDomainRating } from "@/lib/ahrefs"
import { domainSchema } from "@/lib/domain"
import { NICHE_NAMES } from "@/lib/niches"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

const bodySchema = z.object({
  memberId: z.uuid(),
  domain: domainSchema,
  niche: z
    .string()
    .refine((value) => (NICHE_NAMES as readonly string[]).includes(value)),
  keywords: z.array(z.string().trim().min(1)).min(1).max(25),
  description: z.string().trim().min(1).max(2000),
})

// POST /api/sites — adds a website under a verified member. Domains are
// globally unique: a domain belongs to exactly one member, ever.
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }
  const { memberId, domain, niche, keywords, description } = parsed.data

  const supabase = getSupabaseAdmin()
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id, verified_at")
    .eq("id", memberId)
    .maybeSingle()
  if (memberError) {
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
  if (!member || member.verified_at === null) {
    return NextResponse.json({ error: "member_not_verified" }, { status: 403 })
  }

  // Re-fetched from Ahrefs here rather than trusting the analyze-site
  // response — never trust a client-supplied metric.
  const domainRating = await getDomainRating(domain)

  const { error } = await supabase.from("sites").insert({
    member_id: memberId,
    domain,
    niche,
    keywords,
    description,
    domain_rating: domainRating,
  })
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "domain_taken" }, { status: 409 })
    }
    console.error("sites: insert failed", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

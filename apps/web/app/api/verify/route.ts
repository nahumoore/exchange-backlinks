import { type NextRequest, NextResponse } from "next/server"

import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { verifyVerifyToken } from "@/lib/verify-token"

// GET /api/verify?token=… — the link inside the verification email.
// Invalid or expired token → /submit?error=expired so the form can offer to
// resend the email. Clicking twice is fine (idempotent).
export async function GET(request: NextRequest) {
  const expired = NextResponse.redirect(
    new URL("/submit?error=expired", request.url)
  )

  const token = request.nextUrl.searchParams.get("token")
  const verified = token ? verifyVerifyToken(token) : null
  if (!verified) return expired

  const supabase = getSupabaseAdmin()
  const { data: member, error } = await supabase
    .from("members")
    .select("id, verified_at")
    .eq("id", verified.memberId)
    .maybeSingle()
  if (error || !member) return expired

  if (member.verified_at === null) {
    const { error: updateError } = await supabase
      .from("members")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", member.id)
    if (updateError) return expired
  }

  return NextResponse.redirect(
    new URL(`/submit-website?id=${member.id}`, request.url)
  )
}

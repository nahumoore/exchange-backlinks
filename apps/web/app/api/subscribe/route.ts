import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { sendVerificationEmail } from "@/lib/email"
import { SITE_URL } from "@/lib/site"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { signVerifyToken } from "@/lib/verify-token"

const bodySchema = z.object({ email: z.email() })

// Skip sending if we already emailed this address within the window.
const RESEND_THROTTLE_MS = 60 * 1000

// POST /api/subscribe — registers an email and sends the verification link.
// Always returns { ok: true } — the response must not reveal whether the
// email is already registered.
export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }
  const email = parsed.data.email.toLowerCase()

  const supabase = getSupabaseAdmin()
  const { data: member, error } = await supabase
    .from("members")
    .upsert({ email }, { onConflict: "email" })
    .select("id, verified_at, last_email_sent_at")
    .single()
  if (error || !member) {
    console.error("subscribe: member upsert failed", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  // Real emails link to the canonical site URL (never the Host header); dev
  // uses the request origin so localhost works.
  const origin =
    process.env.NODE_ENV === "production" ? SITE_URL : request.nextUrl.origin
  const alreadyVerified = member.verified_at !== null
  const linkUrl = alreadyVerified
    ? `${origin}/submit-website?id=${member.id}`
    : `${origin}/api/verify?token=${signVerifyToken(member.id)}`

  const throttled =
    member.last_email_sent_at !== null &&
    Date.now() - new Date(member.last_email_sent_at).getTime() <
      RESEND_THROTTLE_MS

  if (!throttled) {
    try {
      await sendVerificationEmail({ to: email, linkUrl, alreadyVerified })
      await supabase
        .from("members")
        .update({ last_email_sent_at: new Date().toISOString() })
        .eq("id", member.id)
    } catch (err) {
      // Until the domain is verified in Resend, onboarding@resend.dev only
      // delivers to the account owner — in dev, keep going so devVerifyUrl
      // still lets the flow be clicked through without an inbox.
      console.error("subscribe: email send failed", err)
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "email_failed" }, { status: 500 })
      }
    }
  }

  return NextResponse.json({
    ok: true,
    ...(process.env.NODE_ENV !== "production" && {
      devVerifyUrl: linkUrl.slice(origin.length),
    }),
  })
}

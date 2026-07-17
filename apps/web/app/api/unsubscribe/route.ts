import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token"

const bodySchema = z.object({ token: z.string().min(1) })

// POST /api/unsubscribe — confirms a soft-disable from the /unsubscribe
// confirm page. Sets members.unsubscribed_at, which stops digests to this
// member and hides all of their sites from other members' matches. Nothing
// is deleted, and this is idempotent — re-confirming an already-unsubscribed
// member is a no-op success.
export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 })
  }

  const verified = verifyUnsubscribeToken(parsed.data.token)
  if (!verified) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  // Filtering on unsubscribed_at IS NULL makes a repeat confirm a no-op
  // instead of bumping the timestamp again — either way the response is the
  // same successful { ok: true }.
  const { error } = await supabase
    .from("members")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", verified.memberId)
    .is("unsubscribed_at", null)

  if (error) {
    console.error("unsubscribe: update failed", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

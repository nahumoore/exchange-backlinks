import type { getSupabaseAdmin } from "@/lib/supabase/admin"

// Resend account-wide cap; digests reserve against DIGEST_DAILY_CAP so relay
// forwards always keep DAILY_CAP - DIGEST_DAILY_CAP of headroom.
export const DAILY_CAP = 90
export const DIGEST_DAILY_CAP = 80

type Supabase = ReturnType<typeof getSupabaseAdmin>

/** Rough count for sizing a digest run — not the source of truth for the
 * cap itself, since concurrent sends can move it. Use reserveEmailSend to
 * actually gate each send. */
export async function todaysUsage(supabase: Supabase) {
  const { data, error } = await supabase.rpc("get_email_usage_today")
  if (error) throw error
  return data ?? 0
}

/** Atomically reserves one send against today's usage, gated by `cap`.
 * Returns false once reserving would push the shared counter past `cap`. */
export async function reserveEmailSend(supabase: Supabase, cap: number) {
  const { data, error } = await supabase.rpc("try_reserve_email_send", {
    p_cap: cap,
  })
  if (error) throw error
  return data === true
}

/** Batched counterpart to reserveEmailSend — claims up to `count` sends in a
 * single round trip (returning how many were actually granted) instead of
 * one round trip per email. Use this whenever a caller already knows how
 * many sends it wants up front, e.g. a digest run reserving its whole
 * batch at once. */
export async function reserveEmailSends(
  supabase: Supabase,
  cap: number,
  count: number
) {
  if (count <= 0) return 0
  const { data, error } = await supabase.rpc("try_reserve_email_sends", {
    p_cap: cap,
    p_count: count,
  })
  if (error) throw error
  return data ?? 0
}

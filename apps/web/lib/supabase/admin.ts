import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the secret key — RLS stays closed to the
 * public and every query runs through route handlers / server components.
 * Created per call rather than at module scope: on Cloudflare Workers the env
 * is populated per invocation.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !secretKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY env variable"
    )
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

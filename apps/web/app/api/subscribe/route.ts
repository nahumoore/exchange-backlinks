import { NextResponse } from "next/server"

// POST /api/subscribe — registers an email and sends the verification link.
//
// TODO(backend):
//   1. Validate the body with zod ({ email }).
//   2. Upsert the member in Supabase by email (service-role client; RLS stays
//      closed to the public).
//   3. Rate-limit: skip sending if we already emailed this address in the
//      last few minutes (last_email_sent_at column on members).
//   4. If unverified → send the verification email (Resend) containing a link
//      to /api/verify?token=<HMAC-signed member id + 24h expiry>.
//      If already verified → send an "add another site" email linking straight
//      to /submit-website?id=<member.id>.
//   5. Always return { ok: true } — the response must not reveal whether the
//      email is already registered.
export async function POST() {
  // Frontend-only stub: pretend the email went out. In dev we hand back the
  // verify URL so the flow can be clicked through without an inbox.
  return NextResponse.json({
    ok: true,
    ...(process.env.NODE_ENV !== "production" && {
      devVerifyUrl: "/api/verify?token=dev-token",
    }),
  })
}

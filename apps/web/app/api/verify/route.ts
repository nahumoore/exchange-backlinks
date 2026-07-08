import { type NextRequest, NextResponse } from "next/server"

// GET /api/verify?token=… — the link inside the verification email.
//
// TODO(backend):
//   1. Validate the token's HMAC signature and expiry (24h).
//   2. Set members.verified_at (idempotent — clicking twice is fine).
//   3. Redirect to /submit-website?id=<member.id>.
//   4. Invalid or expired token → redirect to /submit?error=expired so the
//      form can offer to resend the email.
export async function GET(request: NextRequest) {
  // Frontend-only stub: skip validation and redirect with a placeholder id.
  return NextResponse.redirect(
    new URL("/submit-website?id=demo-member", request.url)
  )
}

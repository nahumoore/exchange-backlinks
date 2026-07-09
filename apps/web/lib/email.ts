import { Resend } from "resend"

import { SITE_NAME } from "@/lib/site"

// Until the domain is verified in Resend, onboarding@resend.dev only delivers
// to the account owner's address — set RESEND_FROM once that's done.
const DEFAULT_FROM = "Exchange Backlinks <onboarding@resend.dev>"

export async function sendVerificationEmail({
  to,
  linkUrl,
  alreadyVerified,
}: {
  to: string
  /** Verification link, or the direct /submit-website link when already verified. */
  linkUrl: string
  alreadyVerified: boolean
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("Missing RESEND_API_KEY env variable")
  const resend = new Resend(apiKey)

  const subject = alreadyVerified
    ? `Add your websites to ${SITE_NAME}`
    : `Verify your email for ${SITE_NAME}`
  const intro = alreadyVerified
    ? "Your email is already verified — jump straight in to add another website to the exchange."
    : "Click the link below to verify your email and start adding your websites to the exchange. The link is valid for 24 hours."
  const cta = alreadyVerified ? "Add your websites" : "Verify my email"

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? DEFAULT_FROM,
    to,
    subject,
    text: `${intro}\n\n${cta}: ${linkUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <p style="font-size: 14px; color: #666;">${SITE_NAME}</p>
        <p style="font-size: 16px; line-height: 1.6;">${intro}</p>
        <p style="margin: 24px 0;">
          <a href="${linkUrl}" style="display: inline-block; background: #111; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 15px;">${cta}</a>
        </p>
        <p style="font-size: 13px; color: #888; line-height: 1.6;">If the button doesn't work, copy this link:<br /><a href="${linkUrl}">${linkUrl}</a></p>
        <p style="font-size: 13px; color: #888;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  })

  if (error) throw new Error(`Resend failed: ${error.message}`)
}

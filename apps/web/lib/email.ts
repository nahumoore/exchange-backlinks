import { Resend } from "resend"

import { SITE_NAME } from "@/lib/site"

// Until the domain is verified in Resend, onboarding@resend.dev only delivers
// to the account owner's address — set RESEND_FROM once that's done.
const DEFAULT_FROM = "Exchange Backlinks <onboarding@resend.dev>"

/** Pulls the bare address out of a "Name <addr>" From header string. */
function extractFromAddress(fromHeader: string) {
  return fromHeader.match(/<([^>]+)>/)?.[1] ?? fromHeader
}

// Mentiohunt CTA shared by every non-transactional email — the whole business
// reason this free tool exists, so it gets a real branded block rather than a
// quiet footer line, matching the brand's primary color (rgb(255, 90, 31)).
const MENTIOHUNT_FAVICON_URL =
  "https://www.google.com/s2/favicons?domain=mentiohunt.com&sz=64"

const MENTIOHUNT_FOOTER_HTML = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px; border-radius: 12px; background: rgb(255, 90, 31);">
    <tr>
      <td style="padding: 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align: middle; padding-right: 10px;">
              <img src="${MENTIOHUNT_FAVICON_URL}" width="28" height="28" alt="" style="display: block; border-radius: 6px;" />
            </td>
            <td style="vertical-align: middle;">
              <span style="font-size: 20px; font-weight: 700; color: #fff;">Mentiohunt</span>
            </td>
          </tr>
        </table>
        <p style="font-size: 15px; color: rgba(255, 255, 255, 0.92); line-height: 1.5; margin: 14px 0 18px;">
          ${SITE_NAME} is built by the Mentiohunt team — backlink acquisition
          on autopilot for B2B SaaS teams. We find prospects, run outreach,
          and land placements for you.
        </p>
        <a href="https://mentiohunt.com" style="display: inline-block; background: #fff; color: rgb(255, 90, 31); font-weight: 600; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 14px;">Try Mentiohunt →</a>
      </td>
    </tr>
  </table>
`
const MENTIOHUNT_FOOTER_TEXT = `Mentiohunt — ${SITE_NAME} is built by the Mentiohunt team: backlink acquisition on autopilot for B2B SaaS teams. https://mentiohunt.com`

// Safety valve for testing the real send paths (digest matching, relay
// forwarding) against real data without emailing real members. When on,
// every send below is rerouted to EMAIL_TEST_RECIPIENT with the intended
// recipient noted in the subject — never gate this on NODE_ENV since it's
// meant to be flipped on deliberately against a preview or even prod deploy,
// then flipped back off before going live.
const TEST_MODE = process.env.EMAIL_TEST_MODE === "true"

function resolveTestRecipient(to: string, subject: string) {
  if (!TEST_MODE) return { to, subject }
  const testRecipient = process.env.EMAIL_TEST_RECIPIENT
  if (!testRecipient) {
    throw new Error(
      "EMAIL_TEST_MODE is on but EMAIL_TEST_RECIPIENT is not set"
    )
  }
  return { to: testRecipient, subject: `[TEST → ${to}] ${subject}` }
}

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
  const recipient = resolveTestRecipient(to, subject)

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? DEFAULT_FROM,
    to: recipient.to,
    subject: recipient.subject,
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

/** Shape shared by a digest listing and the "site contacting you" summary in
 * a relayed reply — the same identity-scrubbed stats, rendered by the same
 * labeled-field block wherever a site's profile needs to show up in email. */
export type SiteStats = {
  niche: string
  description: string
  domainRating: number | null
  keywords: string[]
}

export type DigestListing = SiteStats & {
  /** Masked relay address — replying here forwards to the site owner
   * without revealing this recipient's domain. Note: the *sender's* own
   * email is surfaced to that owner once they reply (see sendRelayEmail),
   * so the two can continue directly. */
  contactEmail: string
}

function statsFieldHtml(label: string, value: string) {
  return `
    <div style="margin: 0 0 12px;">
      <p style="font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 3px;">${escapeHtml(label)}</p>
      <p style="font-size: 16px; color: #111; line-height: 1.5; margin: 0;">${value}</p>
    </div>
  `
}

/** Labeled, larger-type rendering of a site's stats — reused by digest cards
 * and by the "about the site contacting you" block in relayed replies.
 * Never renders a domain or URL. */
function statsBlockHtml(stats: SiteStats) {
  const domainRatingValue =
    stats.domainRating !== null ? `DR ${stats.domainRating}` : "Not rated"
  return [
    statsFieldHtml("Niche", escapeHtml(stats.niche)),
    statsFieldHtml("Domain Rating", domainRatingValue),
    statsFieldHtml(
      "Target keywords",
      stats.keywords.map(escapeHtml).join(", ")
    ),
    statsFieldHtml("Description", escapeHtml(stats.description)),
  ].join("")
}

function statsBlockText(stats: SiteStats) {
  const domainRatingValue =
    stats.domainRating !== null ? `DR ${stats.domainRating}` : "Not rated"
  return [
    `Niche: ${stats.niche}`,
    `Domain Rating: ${domainRatingValue}`,
    `Target keywords: ${stats.keywords.join(", ")}`,
    `Description: ${stats.description}`,
  ].join("\n")
}

export type DigestSend = {
  to: string
  listings: DigestListing[]
  unsubscribeUrl: string
}

function buildDigestEmailPayload({ to, listings, unsubscribeUrl }: DigestSend) {
  const plural = listings.length === 1 ? "" : "es"
  const subject = `${listings.length} match${plural} for you on ${SITE_NAME}`
  const intro = `We found ${listings.length} site${plural} in your niche that want to swap backlinks. Reply to any contact address below to set up a swap — you deal directly with the owner. We keep both sites hidden until you reach out.`

  const text = [
    intro,
    "",
    ...listings.flatMap((listing, i) => [
      `${i + 1}. ${listing.niche}${listing.domainRating !== null ? ` (DR ${listing.domainRating})` : ""}`,
      listing.description,
      `Keywords: ${listing.keywords.join(", ")}`,
      `Contact: ${listing.contactEmail}`,
      "",
    ]),
    MENTIOHUNT_FOOTER_TEXT,
    "",
    `Don't want these emails? Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n")

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 14px; color: #666;">${SITE_NAME}</p>
      <p style="font-size: 16px; line-height: 1.6;">${intro}</p>
      ${listings.map(digestListingCard).join("")}
      ${MENTIOHUNT_FOOTER_HTML}
      <p style="font-size: 12px; color: #aaa; margin-top: 20px;">Don't want these emails? <a href="${unsubscribeUrl}" style="color: #aaa; text-decoration: underline;">Unsubscribe</a></p>
    </div>
  `

  const recipient = resolveTestRecipient(to, subject)

  return {
    from: process.env.RESEND_FROM ?? DEFAULT_FROM,
    to: recipient.to,
    subject: recipient.subject,
    text,
    html,
  }
}

// Resend's /emails/batch endpoint accepts up to 100 emails per call.
const BATCH_CHUNK_SIZE = 100

// The weekday digest — one email per member listing the sites we matched
// them with this run. Deliberately renders no domain/URL anywhere: only the
// identity-scrubbed description, DR, keywords, and a masked contact address.
// Sent via Resend's batch endpoint so a run touching dozens of members costs
// one HTTP call per 100 recipients instead of one per recipient — each call
// out of a Cloudflare Worker counts against its per-invocation subrequest
// limit, and a send-per-member loop was quietly truncating every run.
export async function sendDigestEmails(sends: DigestSend[]) {
  if (sends.length === 0) return

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("Missing RESEND_API_KEY env variable")
  const resend = new Resend(apiKey)

  const payloads = sends.map(buildDigestEmailPayload)
  for (let i = 0; i < payloads.length; i += BATCH_CHUNK_SIZE) {
    const chunk = payloads.slice(i, i + BATCH_CHUNK_SIZE)
    const { error } = await resend.batch.send(chunk)
    if (error) throw new Error(`Resend batch failed: ${error.message}`)
  }
}

function digestListingCard(listing: DigestListing) {
  const mailtoSubject = encodeURIComponent(
    `Backlink exchange — ${listing.niche}`
  )
  const mailto = `mailto:${listing.contactEmail}?subject=${mailtoSubject}`
  return `
    <div style="border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; margin: 20px 0;">
      ${statsBlockHtml(listing)}
      <a href="${mailto}" style="display: inline-block; background: #111; color: #fff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 15px; margin-top: 4px;">Contact this site</a>
    </div>
  `
}

// Forwards the first (and, if it recurs, any later) message on a relay
// thread. Sites' domains are never revealed by us — but this is a one-time
// identity reveal for email: the display name and Reply-To surface the
// sender's real email so the recipient can hit "reply" and continue the
// conversation directly, off-platform, from here on. The From address itself
// stays on RESEND_FROM's domain rather than the alias's own RELAY_DOMAIN —
// Resend's free tier only verifies one sending domain, and since Reply-To
// already carries the real address, the alias domain never needs to be
// sendable, only receivable (handled entirely by Cloudflare Email Routing,
// which doesn't involve Resend).
export async function sendRelayEmail({
  to,
  senderEmail,
  niche,
  subject,
  text,
  html,
  senderSite,
}: {
  to: string
  senderEmail: string
  niche: string
  subject: string
  text: string
  html?: string
  /** The contacting site's own stats, so the recipient can judge the swap
   * before replying. Never includes a domain/URL. Omitted when the inbound
   * message couldn't be matched back to a site's profile. */
  senderSite?: SiteStats
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("Missing RESEND_API_KEY env variable")
  const resend = new Resend(apiKey)

  const notice = `Relayed by ${SITE_NAME} — this site's URL stays hidden, but replying goes straight to ${senderEmail} so you can continue directly.`

  const recipient = resolveTestRecipient(to, subject)
  // In test mode the Reply-To must also be neutralized — otherwise hitting
  // "reply" on a test email would message a real stranger directly.
  const replyTo = TEST_MODE ? recipient.to : senderEmail

  // Quoted — an "@" in a display name is only valid RFC 5322 syntax inside
  // a quoted-string; unquoted, it's a malformed From header.
  const displayName = `${senderEmail} (a ${niche} site, via ${SITE_NAME})`.replace(
    /(["\\])/g,
    "\\$1"
  )

  const fromAddress = extractFromAddress(process.env.RESEND_FROM ?? DEFAULT_FROM)

  const senderSiteHtml = senderSite
    ? `
      <div style="border: 1px solid #e5e5e5; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <p style="font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 12px;">About the site contacting you</p>
        ${statsBlockHtml(senderSite)}
      </div>
    `
    : ""
  const senderSiteText = senderSite
    ? `About the site contacting you:\n${statsBlockText(senderSite)}\n\n`
    : ""

  const { error } = await resend.emails.send({
    from: `"${displayName}" <${fromAddress}>`,
    to: recipient.to,
    replyTo,
    subject: recipient.subject,
    text: `${notice}\n\n${senderSiteText}${text}`,
    html: `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif;">
        <p style="font-size: 12px; color: #888; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px; margin-bottom: 16px;">${escapeHtml(notice)}</p>
        ${senderSiteHtml}
        ${html ?? `<p style="font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(text)}</p>`}
      </div>
    `,
  })

  if (error) throw new Error(`Resend failed: ${error.message}`)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

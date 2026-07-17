import { createHmac, timingSafeEqual } from "node:crypto"

// Signed unsubscribe links: base64url("unsubscribe.<memberId>.<expiresAtMs>")
// + "." + base64url(HMAC-SHA256(payload)). No DB state needed — the link is
// valid until its embedded expiry. Reuses VERIFY_TOKEN_SECRET, but the
// "unsubscribe." namespace prefix keeps a verify-email token from being
// replayed here (and vice versa).

const NAMESPACE = "unsubscribe"
const DEFAULT_TTL_MS = 365 * 24 * 60 * 60 * 1000 // 1 year — link lives in an inbox

function getSecret() {
  const secret = process.env.VERIFY_TOKEN_SECRET
  if (!secret) throw new Error("Missing VERIFY_TOKEN_SECRET env variable")
  return secret
}

function hmac(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest()
}

export function signUnsubscribeToken(memberId: string, ttlMs = DEFAULT_TTL_MS) {
  const payload = `${NAMESPACE}.${memberId}.${Date.now() + ttlMs}`
  const signature = hmac(payload).toString("base64url")
  return `${Buffer.from(payload).toString("base64url")}.${signature}`
}

export function verifyUnsubscribeToken(
  token: string
): { memberId: string } | null {
  const [encodedPayload, signature, ...rest] = token.split(".")
  if (!encodedPayload || !signature || rest.length > 0) return null

  let payload: string
  let provided: Buffer
  try {
    payload = Buffer.from(encodedPayload, "base64url").toString()
    provided = Buffer.from(signature, "base64url")
  } catch {
    return null
  }

  const expected = hmac(payload)
  if (provided.length !== expected.length) return null
  if (!timingSafeEqual(provided, expected)) return null

  if (!payload.startsWith(`${NAMESPACE}.`)) return null
  const rest2 = payload.slice(NAMESPACE.length + 1)
  const separator = rest2.lastIndexOf(".")
  if (separator === -1) return null
  const memberId = rest2.slice(0, separator)
  const expiresAtMs = Number(rest2.slice(separator + 1))
  if (!memberId || !Number.isFinite(expiresAtMs)) return null
  if (Date.now() > expiresAtMs) return null

  return { memberId }
}

import { createHmac, timingSafeEqual } from "node:crypto"

// Signed email-verification tokens: base64url("<memberId>.<expiresAtMs>") +
// "." + base64url(HMAC-SHA256(payload)). No DB state needed — the link is
// valid until its embedded expiry.

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000

function getSecret() {
  const secret = process.env.VERIFY_TOKEN_SECRET
  if (!secret) throw new Error("Missing VERIFY_TOKEN_SECRET env variable")
  return secret
}

function hmac(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest()
}

export function signVerifyToken(memberId: string, ttlMs = DEFAULT_TTL_MS) {
  const payload = `${memberId}.${Date.now() + ttlMs}`
  const signature = hmac(payload).toString("base64url")
  return `${Buffer.from(payload).toString("base64url")}.${signature}`
}

export function verifyVerifyToken(token: string): { memberId: string } | null {
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

  const separator = payload.lastIndexOf(".")
  if (separator === -1) return null
  const memberId = payload.slice(0, separator)
  const expiresAtMs = Number(payload.slice(separator + 1))
  if (!memberId || !Number.isFinite(expiresAtMs)) return null
  if (Date.now() > expiresAtMs) return null

  return { memberId }
}

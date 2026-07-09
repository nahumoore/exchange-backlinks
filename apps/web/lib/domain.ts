import { z } from "zod"

/** Strip protocol, www. and any path so "https://www.Acme.com/blog" → "acme.com". */
export function normalizeDomain(input: string) {
  const bare = input
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .replace(/^www\./, "")
  return (bare.split(/[/?#]/)[0] ?? "").replace(/\.$/, "")
}

export const domainSchema = z
  .string()
  .transform(normalizeDomain)
  .pipe(
    z
      .string()
      .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/)
  )

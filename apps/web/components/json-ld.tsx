/**
 * Renders a JSON-LD <script> tag for structured data. Centralizes the
 * XSS-safe escaping (Next.js/React docs recommend escaping "<" so a
 * "</script>" inside stringified data can't break out of the tag).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

import { ImageResponse } from "next/og"

export const OG_SIZE = {
  width: 1200,
  height: 630,
}

function words(text?: string) {
  return text ? text.split(/\s+/).filter(Boolean) : []
}

/**
 * Shared Open Graph card (warm neutral background, blaze-orange accent).
 * `title` is rendered large; wrap the part to highlight in `accent`.
 */
export function renderOgImage({
  eyebrow,
  title,
  accent,
  titleAfter,
  titleSize = 88,
}: {
  eyebrow: string
  title: string
  accent?: string
  titleAfter?: string
  titleSize?: number
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: "#f7f7f5",
        color: "#1f1f1f",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#4a4946",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          fontSize: titleSize,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}
      >
        {/* Satori can't wrap mixed inline spans, so lay the title out word
            by word in a wrapping flex row. */}
        {[
          ...words(title).map((word) => ({ word, accent: false })),
          ...words(accent).map((word) => ({ word, accent: true })),
          ...words(titleAfter).map((word) => ({ word, accent: false })),
        ].map(({ word, accent: isAccent }, i) => (
          <span
            key={i}
            style={{
              marginRight: "0.25em",
              color: isAccent ? "#e8480f" : undefined,
            }}
          >
            {word}
          </span>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 28,
        }}
      >
        <span style={{ color: "#1f1f1f", fontWeight: 600 }}>
          exchange<span style={{ color: "#e8480f" }}>backlinks</span>
        </span>
        <span style={{ color: "#73726e" }}>Free forever · Open source</span>
      </div>
    </div>,
    {
      ...OG_SIZE,
    }
  )
}

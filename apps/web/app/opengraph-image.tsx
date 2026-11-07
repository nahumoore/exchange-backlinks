import { ImageResponse } from "next/og"

import { SITE_NAME } from "@/lib/site"

export const alt = `${SITE_NAME} — a 100% free backlink exchange for B2B sites`

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function Image() {
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
        Free backlink exchange for B2B sites
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 88,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}
      >
        <span>Good backlinks are</span>
        <span>
          <span
            style={{
              color: "#e8480f",
            }}
          >
            traded
          </span>
          {", not bought."}
        </span>
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
      ...size,
    }
  )
}

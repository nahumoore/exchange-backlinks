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
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0f0e0d",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#a3a3a3" }}>
          {"// a free backlink exchange for b2b sites"}
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
                color: "#e05d38",
                textDecoration: "underline",
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
          <span style={{ color: "#fafafa" }}>
            exchange<span style={{ color: "#e05d38" }}>-</span>backlinks.com
          </span>
          <span style={{ color: "#a3a3a3" }}>free forever</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

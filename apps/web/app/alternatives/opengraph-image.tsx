import { OG_SIZE, renderOgImage } from "@/components/og-image"
import { SITE_NAME } from "@/lib/site"

export const alt = `${SITE_NAME} — free alternatives to paid backlink tools`
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return renderOgImage({
    eyebrow: "Backlink tool alternatives",
    title: "Free alternatives to paid backlink tools, ",
    accent: "compared honestly.",
    titleSize: 72,
  })
}

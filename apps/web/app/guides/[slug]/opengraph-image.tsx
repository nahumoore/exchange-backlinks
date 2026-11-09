import { notFound } from "next/navigation"

import { OG_SIZE, renderOgImage } from "@/components/og-image"
import { GUIDES, getGuide } from "@/lib/guides"
import { SITE_NAME } from "@/lib/site"

export const alt = `${SITE_NAME} guide`
export const size = OG_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  // "Reciprocal links: are they bad for SEO?" → title + orange accent.
  const [lead = guide.title, ...rest] = guide.title.split(": ")
  const title = `${lead.charAt(0).toUpperCase()}${lead.slice(1)}${rest.length ? ": " : ""}`

  return renderOgImage({
    eyebrow: `${guide.topic} guide`,
    title,
    accent: rest.join(": "),
    titleSize: 72,
  })
}

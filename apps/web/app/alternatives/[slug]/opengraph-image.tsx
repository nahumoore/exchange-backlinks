import { notFound } from "next/navigation"

import { OG_SIZE, renderOgImage } from "@/components/og-image"
import { ALTERNATIVES, getAlternative } from "@/lib/alternatives"
import { SITE_NAME } from "@/lib/site"

export const alt = `${SITE_NAME} — a free alternative to paid backlink tools`
export const size = OG_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
  return ALTERNATIVES.map((alternative) => ({ slug: alternative.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const alternative = getAlternative(slug)
  if (!alternative) notFound()

  return renderOgImage({
    eyebrow: `${alternative.category} alternative`,
    title: `The best ${alternative.name} alternative, `,
    accent: "free",
    titleSize: 76,
  })
}

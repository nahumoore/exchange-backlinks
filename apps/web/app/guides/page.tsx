import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowRight, IconBook2 } from "@tabler/icons-react"

import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { GUIDES, formatGuideDate } from "@/lib/guides"
import { SITE_URL } from "@/lib/site"

const TITLE = "Link Building Guides for B2B Sites"
const DESCRIPTION =
  "Practical, honest guides to link exchanges and link building for B2B teams: what Google actually says, what's worth your time, and how to do it without the risk."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/guides",
    type: "website",
  },
}

export default function GuidesPage() {
  const url = `${SITE_URL}/guides`
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: url },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: TITLE,
        description: DESCRIPTION,
        url,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: {
          "@type": "ItemList",
          itemListElement: GUIDES.map((guide, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: guide.title,
            url: `${SITE_URL}/guides/${guide.slug}`,
          })),
        },
      },
    ],
  }

  return (
    <div className="flex min-h-svh flex-col">
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-hairline bg-surface px-4 pt-[116px] pb-16 sm:px-6">
          <div className="mx-auto max-w-[1120px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-strong">
              <IconBook2 className="size-4" aria-hidden="true" />
              <span>Guides</span>
            </div>
            <h1 className="mt-4 max-w-4xl font-heading text-[40px] leading-[1.06] font-bold tracking-[-0.03em] text-balance text-ink sm:text-[52px]">
              Link building guides,{" "}
              <span className="text-brand">without the spin.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
              {DESCRIPTION}
            </p>
          </div>
        </section>

        <div className="px-4 py-14 sm:px-6">
          <ul className="mx-auto grid max-w-[1120px] gap-5 lg:grid-cols-2">
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-colors duration-200 hover:border-brand-border"
                >
                  <span className="text-xs font-semibold text-ink-muted">
                    {guide.topic}
                  </span>
                  <h2 className="mt-2 font-heading text-xl font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-brand-strong first-letter:uppercase">
                    {guide.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-ink-muted">
                    {guide.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-medium">
                    <span className="text-ink-muted">
                      {formatGuideDate(guide.updated)} · {guide.readingMinutes}{" "}
                      min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-brand-strong transition-all duration-200 group-hover:gap-1.5">
                      Read guide
                      <IconArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

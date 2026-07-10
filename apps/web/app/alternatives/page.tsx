import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { ALTERNATIVES } from "@/lib/alternatives"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const TITLE = "Free alternatives to backlink & link-building tools"
const DESCRIPTION =
  "Comparisons of paid backlink exchanges, AI content platforms, link marketplaces, and source-request tools — and why B2B teams switch to a free, direct exchange instead."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/alternatives",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/alternatives",
    type: "website",
  },
}

const CATEGORY_ORDER = [
  "backlink exchange platform",
  "AI content platform",
  "link building marketplace",
  "source-request platform",
]

function groupByCategory() {
  const groups = new Map<string, typeof ALTERNATIVES>()
  for (const alternative of ALTERNATIVES) {
    const list = groups.get(alternative.category) ?? []
    list.push(alternative)
    groups.set(alternative.category, list)
  }
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: groups.get(category) ?? [],
  })).filter((group) => group.items.length > 0)
}

export default function AlternativesPage() {
  const groups = groupByCategory()
  const url = `${SITE_URL}/alternatives`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Alternatives",
            item: url,
          },
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
          itemListElement: ALTERNATIVES.map((alternative, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${alternative.name} alternative`,
            url: `${SITE_URL}/alternatives/${alternative.slug}`,
          })),
        },
      },
    ],
  }

  return (
    <div className="flex min-h-svh flex-col">
      <JsonLd data={jsonLd} />
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          exchange<span className="text-primary">-</span>backlinks.com
        </Link>
        <Button size="sm" nativeButton={false} render={<Link href="/submit" />}>
          Submit your site
        </Button>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 pt-16 pb-8">
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">
            {"// alternatives"}
          </p>
          <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Free alternatives to paid{" "}
            <span className="text-primary underline decoration-3 underline-offset-8">
              backlink tools
            </span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">
            {`${SITE_NAME} matches you directly with other B2B sites in your niche for a free, reciprocal backlink trade — no fees, no marketplace, no automated placements. Here's how it compares to the paid tools and free digests teams usually try first.`}
          </p>
        </section>

        <section className="border-border mx-auto w-full max-w-3xl border-t px-6 py-12">
          {groups.map((group) => (
            <div key={group.category} className="mb-10 last:mb-0">
              <h2 className="font-heading text-xl font-semibold tracking-tight capitalize sm:text-2xl">
                {group.category}
              </h2>
              <ul className="border-border mt-4 divide-y">
                {group.items.map((alternative) => (
                  <li key={alternative.slug} className="py-4">
                    <Link
                      href={`/alternatives/${alternative.slug}`}
                      className="text-foreground font-medium underline underline-offset-4"
                    >
                      {alternative.name} alternative
                    </Link>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                      {alternative.tagline}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="border-border border-t">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 px-6 py-16">
            <h2 className="font-heading max-w-xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Your next backlink is a trade away.
            </h2>
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/submit" />}
            >
              Submit your site
              <IconArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

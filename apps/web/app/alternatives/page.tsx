import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowRight, IconScale } from "@tabler/icons-react"

import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ALTERNATIVES, ALTERNATIVES_UPDATED } from "@/lib/alternatives"
import { SITE_NAME, SITE_URL } from "@/lib/site"

// Search Console shows this page outranking the homepage for list-intent
// queries ("backlink exchange free / sites / marketplace / platform"), so it
// leads with "link exchange sites". The root layout's brand suffix stays on
// purpose: the brand name is itself the keyword ("exchange backlinks").
const YEAR = ALTERNATIVES_UPDATED.slice(0, 4)
const TITLE = `Best Link Exchange Sites in ${YEAR}`
const DESCRIPTION =
  "The best link exchange sites and backlink exchange platforms, free and paid — exchange networks, AI content tools, link marketplaces, and source-request sites, compared honestly."

const HOW_TO_CHOOSE = [
  {
    title: "Same niche, or don't bother",
    body: "A link from a site in your topic is worth trading for. A link from an unrelated site is noise at best, and exactly the pattern Google's spam policies call out at worst.",
  },
  {
    title: "See the partner before anything goes live",
    body: "Prefer one-for-one swaps with a site you can vet. Credit pools and three-way schemes put your links on sites you never chose.",
  },
  {
    title: "Keep control of placement",
    body: "Editorial links placed where they help the reader age well. Tools that auto-insert links into generated articles trade control for convenience.",
  },
  {
    title: "Know what you're paying for",
    body: "Many link exchange sites are subscriptions or marketplaces with an exchange bolted on. Free should mean free: no credits, tiers, or per-link fees.",
  },
]

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

/** "AI content platform" → "AI content platforms" for group headings. */
function pluralize(category: string) {
  return `${category.charAt(0).toUpperCase()}${category.slice(1)}s`
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
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-hairline bg-surface px-4 pt-[116px] pb-16 sm:px-6">
          <div className="mx-auto max-w-[1120px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-strong">
              <IconScale className="size-4" aria-hidden="true" />
              <span>Link exchange sites & alternatives</span>
            </div>
            <h1 className="mt-4 max-w-4xl font-heading text-[40px] leading-[1.06] font-bold tracking-[-0.03em] text-balance text-ink sm:text-[52px]">
              The best link exchange sites,{" "}
              <span className="text-brand">compared honestly.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
              Backlink exchange platforms, AI content tools with a link exchange
              bundled in, link marketplaces, and source-request sites — what
              each one actually gives you, what it costs, and where it still
              wins. {SITE_NAME} is the{" "}
              <Link
                href="/"
                className="font-medium text-ink underline decoration-input underline-offset-4 transition-colors hover:decoration-current"
              >
                free backlink exchange
              </Link>{" "}
              that matches you directly with B2B sites in your niche: no fees,
              no marketplace, no automated placements.
            </p>
          </div>
        </section>

        <div className="px-4 py-14 sm:px-6">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-14">
            {groups.map((group) => (
              <section
                key={group.category}
                aria-labelledby={`group-${group.category}`}
              >
                <h2
                  id={`group-${group.category}`}
                  className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink"
                >
                  {pluralize(group.category)}
                </h2>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  {group.items.map((alternative) => (
                    <Link
                      key={alternative.slug}
                      href={`/alternatives/${alternative.slug}`}
                      className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-colors duration-200 hover:border-brand-border"
                    >
                      <span className="text-xs font-semibold text-ink-muted">
                        Alternative
                      </span>
                      <h3 className="mt-2 font-heading text-xl font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-brand-strong">
                        {alternative.name} alternative
                      </h3>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-ink-muted">
                        {alternative.tagline}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs font-medium text-ink-muted capitalize">
                          {alternative.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-strong transition-all duration-200 group-hover:gap-1.5">
                          Full comparison
                          <IconArrowRight
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

            <section aria-labelledby="how-to-choose">
              <h2
                id="how-to-choose"
                className="font-heading text-2xl font-bold tracking-[-0.02em] text-ink"
              >
                How to choose a link exchange site
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
                Most link exchange sites look alike from the outside. These four
                questions separate the ones worth your links from the ones that
                put them at risk. For where Google draws the line, read{" "}
                <Link
                  href="/guides/reciprocal-links"
                  className="font-medium text-ink underline decoration-input underline-offset-4 transition-colors hover:decoration-current"
                >
                  are reciprocal links bad for SEO?
                </Link>
              </p>
              <ol className="mt-6 grid gap-5 sm:grid-cols-2">
                {HOW_TO_CHOOSE.map((item, i) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-border bg-card p-6 shadow-card"
                  >
                    <span className="text-xs font-semibold text-brand-strong">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-heading text-lg font-semibold tracking-[-0.02em] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

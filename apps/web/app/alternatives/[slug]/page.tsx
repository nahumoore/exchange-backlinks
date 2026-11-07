import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconScale,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { ArticleToc } from "@/components/article-toc"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ALTERNATIVES, getAlternative } from "@/lib/alternatives"
import { GITHUB_URL, SITE_NAME, SITE_URL, mentiohuntUrl } from "@/lib/site"

const AT_A_GLANCE = [
  { label: "Price", value: "Free forever" },
  { label: "Matching", value: "Same B2B niche only" },
  { label: "Cadence", value: "One email a week" },
  { label: "Your URL", value: "Hidden until both agree" },
  { label: "Placement", value: "You decide, directly" },
]

export function generateStaticParams() {
  return ALTERNATIVES.map((alternative) => ({ slug: alternative.slug }))
}

export const dynamicParams = false

export async function generateMetadata(
  props: PageProps<"/alternatives/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params
  const alternative = getAlternative(slug)
  if (!alternative) return {}

  const title = `${alternative.name} alternative (free)`
  const description = `Looking for a ${alternative.name} alternative? Exchange Backlinks matches you with sites in your B2B niche for a free, direct backlink trade — no fees, no marketplace.`
  const url = `/alternatives/${alternative.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
  }
}

export default async function AlternativePage(
  props: PageProps<"/alternatives/[slug]">
) {
  const { slug } = await props.params
  const alternative = getAlternative(slug)
  if (!alternative) notFound()

  const { default: Content } = await import(
    `@/content/alternatives/${slug}.mdx`
  )

  const url = `${SITE_URL}/alternatives/${alternative.slug}`
  const title = `${alternative.name} alternative (free)`
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
            item: `${SITE_URL}/alternatives`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: url,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description: alternative.tagline,
        url,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          sameAs: [GITHUB_URL],
        },
        author: {
          "@type": "Organization",
          name: SITE_NAME,
        },
      },
    ],
  }

  return (
    <div className="flex min-h-svh flex-col">
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-hairline bg-surface">
          <div className="mx-auto max-w-[1180px] px-4 pt-[100px] pb-14 sm:px-6">
            <Link
              href="/alternatives"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
            >
              <IconArrowLeft className="size-4" aria-hidden="true" />
              Back to alternatives
            </Link>
            <div className="mt-9 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[13px] font-medium text-ink-secondary">
                  <IconScale
                    className="size-4 text-brand-strong"
                    aria-hidden="true"
                  />
                  <span className="first-letter:uppercase">
                    {alternative.category} alternative
                  </span>
                </div>
                <h1 className="mt-[18px] font-heading text-[2rem] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-ink sm:text-[2.6rem] lg:text-[2.875rem]">
                  The best {alternative.name} alternative,{" "}
                  <span className="text-brand">free</span>
                </h1>
                <p className="mt-[18px] text-lg leading-[1.6] text-pretty text-ink-secondary sm:text-[1.1875rem]">
                  {alternative.tagline}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Button
                    size="lg"
                    nativeButton={false}
                    render={<Link href="/submit" />}
                  >
                    Submit your site
                    <IconArrowRight data-icon="inline-end" />
                  </Button>
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted">
                    <IconCircleCheck
                      className="size-3.5 text-success"
                      aria-hidden="true"
                    />
                    Free forever, no credit card
                  </span>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-border bg-card px-6 py-5 text-sm shadow-lifted">
                <p className="pb-2 text-xs font-medium text-ink-muted">
                  {SITE_NAME} at a glance
                </p>
                <dl className="flex flex-col">
                  {AT_A_GLANCE.map((row, i) => (
                    <div
                      key={row.label}
                      className={
                        i < AT_A_GLANCE.length - 1
                          ? "flex items-center justify-between gap-4 border-b border-hairline py-3"
                          : "flex items-center justify-between gap-4 py-3"
                      }
                    >
                      <dt className="text-ink-muted">{row.label}</dt>
                      <dd className="inline-flex items-center gap-1.5 text-right font-medium text-ink">
                        <IconCircleCheck
                          className="size-4 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,720px)] lg:items-start lg:gap-14">
            <aside className="hidden lg:block lg:self-stretch">
              <div className="sticky top-24 flex flex-col gap-7 pb-4">
                <ArticleToc />
                <div className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <p className="font-heading text-base leading-snug font-bold text-ink">
                    Rather not trade links?
                  </p>
                  <p className="mt-1.5 text-[13px] leading-5 text-ink-secondary">
                    Mentiohunt finds sites where your content belongs and runs
                    the outreach for you.
                  </p>
                  {/* No noreferrer on purpose: Mentiohunt needs the referrer +
                      UTMs to attribute this traffic. noopener still applies. */}
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a
                    href={mentiohuntUrl({
                      medium: "referral",
                      campaign: "alternatives_sidebar",
                      content: alternative.slug,
                    })}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-strong"
                  >
                    Try Mentiohunt
                    <IconArrowRight className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </aside>

            <article data-article-body className="min-w-0">
              <Content />
            </article>
          </div>
        </div>
      </main>

      <SiteFooter currentSlug={alternative.slug} />
    </div>
  )
}

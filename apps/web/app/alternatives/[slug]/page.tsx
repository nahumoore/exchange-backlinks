import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { ALTERNATIVES, getAlternative } from "@/lib/alternatives"
import { GITHUB_URL, SITE_NAME, SITE_URL } from "@/lib/site"

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
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          exchange<span className="text-primary">-</span>backlinks.com
        </Link>
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href="/submit" />}
        >
          Submit your site
        </Button>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 pt-16 pb-8">
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">
            {`// alternatives — ${alternative.category}`}
          </p>
          <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            The best {alternative.name} alternative,{" "}
            <span className="text-primary underline decoration-3 underline-offset-8">
              free
            </span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">
            {alternative.tagline}
          </p>
          <div className="mt-8">
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

        <section className="border-border mx-auto w-full max-w-3xl border-t px-6 py-12">
          <Content />
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

      <SiteFooter currentSlug={alternative.slug} />
    </div>
  )
}

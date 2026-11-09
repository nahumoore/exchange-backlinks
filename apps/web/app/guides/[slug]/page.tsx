import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook2,
  IconBrandX,
  IconClock,
} from "@tabler/icons-react"

import { ArticleToc } from "@/components/article-toc"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { authorAboutUrl, getAuthor, type Author } from "@/lib/authors"
import { GUIDES, formatGuideDate, getGuide, type FaqItem } from "@/lib/guides"
import { GITHUB_URL, SITE_NAME, SITE_URL, mentiohuntUrl } from "@/lib/site"

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }))
}

export const dynamicParams = false

export async function generateMetadata(
  props: PageProps<"/guides/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params
  const guide = getGuide(slug)
  if (!guide) return {}
  const url = `/guides/${guide.slug}`
  const author = getAuthor(guide.author)

  return {
    // Absolute: the brand suffix would push the title past what Google shows.
    title: { absolute: guide.seoTitle },
    description: guide.description,
    authors: [{ name: author.name, url: author.url }],
    alternates: { canonical: url },
    openGraph: {
      title: guide.seoTitle,
      description: guide.description,
      url,
      type: "article",
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      authors: [author.name],
    },
  }
}

function AuthorAvatar({ author, size }: { author: Author; size: number }) {
  return (
    <Image
      src={author.image}
      alt={author.name}
      width={size}
      height={size}
      unoptimized
      className="shrink-0 rounded-full border border-border object-cover"
    />
  )
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const { default: Content, faq } = (await import(
    `@/content/guides/${slug}.mdx`
  )) as { default: React.ComponentType; faq?: FaqItem[] }

  const author = getAuthor(guide.author)
  const aboutUrl = authorAboutUrl(author, "guide_byline")
  const url = `${SITE_URL}/guides/${guide.slug}`

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
            name: "Guides",
            item: `${SITE_URL}/guides`,
          },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: guide.seoTitle,
        description: guide.description,
        url,
        datePublished: guide.published,
        dateModified: guide.updated,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: {
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          url: author.url,
          image: `${SITE_URL}${author.image}`,
          sameAs: author.profiles.map((p) => p.href),
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          sameAs: [GITHUB_URL],
        },
      },
      ...(faq && faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <div className="flex min-h-svh flex-col">
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-hairline bg-surface">
          <div className="mx-auto max-w-[1180px] px-4 pt-[100px] pb-12 sm:px-6">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
            >
              <IconArrowLeft className="size-4" aria-hidden="true" />
              All guides
            </Link>
            <div className="mt-9 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[13px] font-medium text-ink-secondary">
                <IconBook2
                  className="size-4 text-brand-strong"
                  aria-hidden="true"
                />
                {guide.topic} guide
              </div>
              <h1 className="mt-[18px] font-heading text-[2rem] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-ink first-letter:uppercase sm:text-[2.6rem] lg:text-[2.875rem]">
                {guide.title}
              </h1>
              <p className="mt-[18px] text-lg leading-[1.6] text-pretty text-ink-secondary sm:text-[1.1875rem]">
                {guide.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-2.5">
                  <AuthorAvatar author={author} size={36} />
                  <span className="flex flex-col leading-tight">
                    <span>
                      By{" "}
                      {/* No noreferrer on purpose: Mentiohunt needs the
                          referrer + UTMs to attribute this traffic. */}
                      {/* eslint-disable-next-line react/jsx-no-target-blank */}
                      <a
                        href={aboutUrl}
                        target="_blank"
                        rel="noopener author"
                        className="font-semibold text-ink hover:underline"
                      >
                        {author.name}
                      </a>
                    </span>
                    <span className="text-[13px]">{author.role}</span>
                  </span>
                </span>
                <span>
                  Updated{" "}
                  <time dateTime={guide.updated}>
                    {formatGuideDate(guide.updated)}
                  </time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconClock className="size-4" aria-hidden="true" />
                  {guide.readingMinutes} min read
                </span>
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
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a
                    href={mentiohuntUrl({
                      medium: "referral",
                      campaign: "guides_sidebar",
                      content: guide.slug,
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

              <section
                aria-label="About the author"
                className="mt-14 flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-start"
              >
                <AuthorAvatar author={author} size={64} />
                <div>
                  <p className="text-xs font-medium text-ink-muted">
                    Written by
                  </p>
                  <p className="mt-0.5 font-heading text-lg font-bold text-ink">
                    {author.name}
                  </p>
                  <p className="text-sm text-ink-secondary">{author.role}</p>
                  <p className="mt-3 text-[15px] leading-6 text-foreground">
                    {author.bio}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a
                      href={authorAboutUrl(author, "guide_author_box")}
                      target="_blank"
                      rel="noopener author"
                      className="inline-flex items-center gap-1 font-medium text-brand-strong"
                    >
                      About {author.name.split(" ")[0]}
                      <IconArrowRight className="size-3.5" aria-hidden="true" />
                    </a>
                    {author.profiles.map((profile) => (
                      <a
                        key={profile.href}
                        href={profile.href}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="inline-flex items-center gap-1 font-medium text-ink-secondary hover:text-ink"
                      >
                        <IconBrandX className="size-3.5" aria-hidden="true" />
                        {profile.label}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

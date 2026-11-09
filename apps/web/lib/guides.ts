/**
 * Data for /guides/[slug] pages — informational articles from the topical
 * maps in docs/topical-maps/. The article body lives in
 * content/guides/<slug>.mdx, which also exports its `faq` (rendered in the
 * body and reused for the FAQPage schema). Bump `updated` only when the
 * guide is meaningfully revised, never automatically.
 */
export type Guide = {
  slug: string
  /** On-page H1. */
  title: string
  /** SEO title, used as an absolute <title> (keep it under ~60 chars). */
  seoTitle: string
  description: string
  /** Short topic label for the hero kicker and the index cards. */
  topic: string
  /** Author id from lib/authors.ts. */
  author: string
  published: string
  updated: string
  readingMinutes: number
}

export const GUIDES: Guide[] = [
  {
    slug: "reciprocal-links",
    title: "Reciprocal links: are they bad for SEO?",
    seoTitle: "Reciprocal Links: Are They Bad for SEO? (What Google Says)",
    description:
      "Reciprocal links aren't automatically bad, but link deals are. What Google has actually said, a 5-question test for any link, and how B2B sites can swap links without the risk.",
    topic: "Link exchange",
    author: "nicolas-more",
    published: "2026-11-08",
    updated: "2026-11-08",
    readingMinutes: 13,
  },
  {
    slug: "link-exchange-seo",
    title: "Link exchange in SEO: what it is and how to do it safely",
    seoTitle: "Link Exchange in SEO: What It Is & How to Do It Safely",
    description:
      "What a link exchange is, the types and how risky each one is, and a step-by-step process to find, vet, and track link exchange partners without breaking Google's rules.",
    topic: "Link exchange",
    author: "nicolas-more",
    published: "2026-11-09",
    updated: "2026-11-09",
    readingMinutes: 13,
  },
]

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug)
}

/** "2026-11-08" → "November 8, 2026". */
export function formatGuideDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export type FaqItem = { question: string; answer: string }

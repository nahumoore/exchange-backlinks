/**
 * Data for /alternatives/[slug] pages — competitor names, one-line
 * positioning, and pricing notes used in page metadata and the shared
 * hero. The long-form comparison for each lives in the matching MDX file
 * under content/alternatives/. Keep pricing notes factual and dated in the
 * MDX body (SaaS pricing changes) rather than hardcoding numbers here.
 */
export type Alternative = {
  slug: string
  name: string
  category: string
  tagline: string
}

export const ALTERNATIVES: Alternative[] = [
  {
    slug: "distribb",
    name: "Distribb",
    category: "AI content platform",
    tagline:
      "AI blog-content subscription with a backlink exchange bundled in.",
  },
  {
    slug: "outrank",
    name: "Outrank",
    category: "AI content platform",
    tagline:
      "AI content automation tool whose subscribers can also swap backlinks.",
  },
  {
    slug: "karmalinks",
    name: "KarmaLinks",
    category: "backlink exchange platform",
    tagline: "A karma-point backlink exchange club for B2B SaaS companies.",
  },
  {
    slug: "rankchase",
    name: "RankChase",
    category: "backlink exchange platform",
    tagline: "Automated niche-matched backlink exchange with a paid tier.",
  },
  {
    slug: "arvow",
    name: "Arvow",
    category: "AI content platform",
    tagline:
      "AI content and autoblogging suite with an automatic backlink exchange feature.",
  },
  {
    slug: "ranklytics",
    name: "Ranklytics",
    category: "AI content platform",
    tagline:
      "AI SEO content tool that also automates backlink exchange matching.",
  },
  {
    slug: "collaborator",
    name: "Collaborator.pro",
    category: "link building marketplace",
    tagline:
      "A pay-per-placement guest post and PR marketplace, not a link trade.",
  },
  {
    slug: "authority-exchange",
    name: "Authority Exchange",
    category: "backlink exchange platform",
    tagline: "A credit-based link exchange marketplace with a paid tier.",
  },
  {
    slug: "help-a-b2b-writer",
    name: "Help a B2B Writer",
    category: "source-request platform",
    tagline:
      "Matches B2B writers with expert sources for quotes, not backlinks.",
  },
  {
    slug: "featured",
    name: "Featured.com",
    category: "source-request platform",
    tagline:
      "Expert-quote marketplace (formerly Terkel) with free and paid tiers.",
  },
  {
    slug: "haro",
    name: "HARO",
    category: "source-request platform",
    tagline:
      "Free journalist-source matching by email digest — quotes, not links.",
  },
]

export function getAlternative(slug: string): Alternative | undefined {
  return ALTERNATIVES.find((a) => a.slug === slug)
}

import { mentiohuntUrl } from "@/lib/site"

/**
 * Bylines for /guides. A named, real author matters for "will this hurt my
 * SEO?"-type queries, so every guide links to a Person with a bio and
 * profiles (also emitted as the Article schema's author).
 */
export type Author = {
  id: string
  name: string
  role: string
  /** Path under /public. Square image. */
  image: string
  bio: string
  /** Canonical "about" page for the Person schema. */
  url: string
  /** Public profiles, used for sameAs and the author box. */
  profiles: { label: string; href: string }[]
}

export const AUTHORS: Record<string, Author> = {
  "nicolas-more": {
    id: "nicolas-more",
    name: "Nicolas More",
    role: "Founder of Mentiohunt and Exchange Backlinks",
    image: "/authors/nicolas-more.webp",
    bio: "Nicolas is a bootstrapped founder who built backlinks by hand for his own product before automating the prospecting and outreach with Mentiohunt. He started Exchange Backlinks as a free way for B2B teams to meet relevant sites in their niche.",
    url: "https://mentiohunt.com/about",
    profiles: [{ label: "X (Twitter)", href: "https://x.com/nicolasmore_" }],
  },
}

export function getAuthor(id: string): Author {
  const author = AUTHORS[id]
  if (!author) throw new Error(`Unknown author: ${id}`)
  return author
}

/** The author's about page, UTM-tagged like every other Mentiohunt link. */
export function authorAboutUrl(author: Author, campaign: string) {
  return mentiohuntUrl({ medium: "referral", campaign, url: author.url })
}

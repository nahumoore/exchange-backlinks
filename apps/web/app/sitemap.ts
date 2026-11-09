import type { MetadataRoute } from "next"

import { ALTERNATIVES, ALTERNATIVES_UPDATED } from "@/lib/alternatives"
import { GUIDES } from "@/lib/guides"
import { SITE_URL } from "@/lib/site"

// Bump when the homepage or /submit copy changes meaningfully.
const PAGES_UPDATED = "2026-11-07"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: PAGES_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/submit`,
      lastModified: PAGES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/alternatives`,
      lastModified: ALTERNATIVES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...ALTERNATIVES.map((alternative) => ({
      url: `${SITE_URL}/alternatives/${alternative.slug}`,
      lastModified: ALTERNATIVES_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE_URL}/guides`,
      // The index changes whenever a guide is added or revised.
      lastModified: GUIDES.map((g) => g.updated)
        .sort()
        .at(-1),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...GUIDES.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastModified: guide.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}

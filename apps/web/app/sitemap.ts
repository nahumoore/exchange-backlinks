import type { MetadataRoute } from "next"

import { ALTERNATIVES } from "@/lib/alternatives"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/submit`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/alternatives`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...ALTERNATIVES.map((alternative) => ({
      url: `${SITE_URL}/alternatives/${alternative.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}

import type { Metadata } from "next"
import Link from "next/link"
import {
  IconArrowRight,
  IconArrowsExchange,
  IconCircleCheck,
  IconFilter,
  IconTarget,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { JsonLd } from "@/components/json-ld"
import { NicheCarousel } from "@/components/niche-carousel"
import {
  DigestEmailPreview,
  DigestVisual,
  ExchangeVisual,
  SubmitVisual,
} from "@/components/product-visuals"
import { HeroBackdrop, SectionHeading } from "@/components/section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { GITHUB_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      sameAs: [GITHUB_URL],
    },
  ],
}

const STEPS = [
  {
    label: "Step 1 · Submit your site",
    title: "Tell us your domain and niche. Your URL stays hidden.",
    body: "Add your domain and the B2B niche you publish in. We build an anonymous profile — niche, Domain Rating, keywords — and your URL stays hidden, always, until both sides agree to collaborate.",
    visual: <SubmitVisual />,
  },
  {
    label: "Step 2 · Get your weekly matches",
    title: "One email a week with relevant sites in your niche.",
    body: "Once a week, we send one email with sites matched to your B2B niche — described by niche and profile, URLs still hidden. Your site shows up in their email the same way.",
    visual: <DigestVisual />,
  },
  {
    label: "Step 3 · Agree on the swap",
    title: "Both agree, URLs are revealed, you trade links.",
    body: "Once both parties agree to the exchange, URLs are revealed and you talk directly. How and where each link lands is 100% up to you — no middleman, no placement rules.",
    visual: <ExchangeVisual />,
  },
]

const RULES = [
  {
    keyword: "Real sites only",
    body: "Sites that exist to hold links — PBNs, link farms, AI content mills — don't get matched.",
    icon: IconFilter,
    tone: "light",
  },
  {
    keyword: "Same niche or nothing",
    body: "Your site is only shared with members in your B2B niche. An off-topic link helps no one's SEO.",
    icon: IconTarget,
    tone: "tint",
  },
  {
    keyword: "One for one",
    body: "Every exchange is reciprocal: one relevant link each, out in the open.",
    icon: IconArrowsExchange,
    tone: "dark",
  },
] as const

const TRUST = [
  "100% free, no credit card",
  "Same-niche matches only",
  "Open source",
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <JsonLd data={JSON_LD} />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section
          aria-labelledby="hero-title"
          className="relative px-4 pt-[124px] sm:px-6 sm:pt-[140px] lg:pt-[156px]"
        >
          <HeroBackdrop />
          <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center">
            <p className="m-0 flex items-center gap-3.5 text-xs font-semibold tracking-[0.16em] text-ink-secondary uppercase">
              <span className="h-px w-8 bg-input" aria-hidden="true" />
              Free backlink exchange for B2B sites
              <span className="h-px w-8 bg-input" aria-hidden="true" />
            </p>
            <h1
              id="hero-title"
              className="mt-5 font-heading text-[40px] leading-[1.06] font-bold tracking-[-0.03em] text-balance text-ink sm:text-[56px] lg:text-[72px]"
            >
              Good backlinks are <span className="text-brand">traded</span>, not
              bought.
            </h1>
            <p className="mt-5 max-w-[640px] text-lg leading-7 text-pretty text-ink-secondary">
              Submit your site and every week we share it with other B2B sites
              in your niche. You agree on a swap — one link each, on your terms.
              No fees, no marketplace, no catch.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-[18px] gap-y-2.5">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/submit" />}
              >
                Submit your site
                <IconArrowRight data-icon="inline-end" />
              </Button>
              <Link
                href="#how-it-works"
                className="inline-flex min-h-11 items-center gap-1.5 font-medium text-ink"
              >
                See how it works
                <IconArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-[18px] flex flex-wrap justify-center gap-x-3.5 gap-y-1 text-[13px] text-ink-muted">
              {TRUST.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <IconCircleCheck
                    className="size-3.5 text-success"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto mt-14 max-w-[880px]">
            <DigestEmailPreview />
          </div>
        </section>

        {/* Members per niche */}
        <section
          aria-labelledby="niches-title"
          className="px-4 pt-16 pb-4 sm:px-6 sm:pt-20"
        >
          <h2
            id="niches-title"
            className="text-center text-[13px] font-medium text-ink-muted"
          >
            Sites already in the exchange, by niche
          </h2>
          <div className="mx-auto mt-4 max-w-[1120px]">
            <NicheCarousel />
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          aria-labelledby="how-it-works-title"
          className="mt-14 scroll-mt-[60px] border-y border-hairline bg-surface px-4 py-20 sm:mt-16 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-[1120px]">
            <SectionHeading
              id="how-it-works-title"
              eyebrow="How it works"
              title={
                <>
                  Three steps.{" "}
                  <span className="text-ink-muted">One weekly email.</span>
                </>
              }
              description="Same mechanic as Help a B2B Writer or HARO — except instead of matching journalists with sources, we match B2B sites in the same niche so they can trade backlinks."
            />
            <div className="mt-14 flex flex-col">
              {STEPS.map((step) => (
                <div
                  key={step.label}
                  className="grid items-center gap-x-16 gap-y-7 border-t border-border py-12 md:grid-cols-2"
                >
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[13px] font-semibold text-brand-strong">
                      {step.label}
                    </span>
                    <h3 className="font-heading text-[26px] leading-8 font-semibold tracking-[-0.01em] text-balance text-ink">
                      {step.title}
                    </h3>
                    <p className="text-[15px] leading-6 text-pretty text-ink-secondary">
                      {step.body}
                    </p>
                  </div>
                  {step.visual}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* House rules */}
        <section
          id="house-rules"
          aria-labelledby="house-rules-title"
          className="scroll-mt-[60px] px-4 pt-20 sm:px-6 sm:pt-28 lg:pt-32"
        >
          <div className="mx-auto max-w-[1120px]">
            <SectionHeading
              id="house-rules-title"
              eyebrow="House rules"
              title={
                <>
                  Every link worth having.{" "}
                  <span className="text-ink-muted">
                    Nothing that isn&apos;t.
                  </span>
                </>
              }
              description="An exchange is only worth joining if every link in it is worth having. Three rules keep it that way."
            />
            <ul className="mt-12 grid gap-3.5 md:grid-cols-3">
              {RULES.map((rule) => (
                <li
                  key={rule.keyword}
                  className={cn(
                    "flex flex-col gap-3.5 rounded-xl border p-[22px]",
                    rule.tone === "light" &&
                      "border-border bg-card shadow-card",
                    rule.tone === "tint" && "border-brand-border bg-brand-tint",
                    rule.tone === "dark" &&
                      "border-transparent bg-[#1f1f1f] text-[#f2f2f0]"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-lg",
                      rule.tone === "dark"
                        ? "bg-white/10 text-[#ff8a5a]"
                        : "bg-brand-soft text-brand-strong"
                    )}
                  >
                    <rule.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3
                    className={cn(
                      "font-heading text-xl font-bold tracking-[-0.01em]",
                      rule.tone === "dark" ? "text-white" : "text-ink"
                    )}
                  >
                    {rule.keyword}
                  </h3>
                  <p
                    className={cn(
                      "text-[15px] leading-6 text-pretty",
                      rule.tone === "dark"
                        ? "text-[#c9c9c5]"
                        : "text-ink-secondary"
                    )}
                  >
                    {rule.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

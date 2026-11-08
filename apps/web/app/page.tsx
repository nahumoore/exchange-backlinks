import type { Metadata } from "next"
import Link from "next/link"
import {
  IconArrowRight,
  IconArrowsExchange,
  IconCircleCheck,
  IconFilter,
  IconPlus,
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
import {
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  mentiohuntUrl,
} from "@/lib/site"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
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

// Answers target the "backlink exchange" / "free link exchange" queries the
// homepage already gets impressions for in Search Console.
const FAQ = [
  {
    slug: "what",
    question: "What is a backlink exchange?",
    answer:
      "A backlink exchange is when two websites agree to link to each other — one relevant link each. Exchange Backlinks makes that easy for B2B sites: you submit your site once, and every week we match it with other sites in the same niche so you can arrange the swap directly.",
  },
  {
    slug: "free",
    question: "Is Exchange Backlinks really free?",
    answer:
      "Yes. There are no fees, credits, paid tiers, or per-link charges, and no credit card is ever asked for. The project is open source, so you can read every line of code on GitHub.",
  },
  {
    slug: "safe",
    question: "Are link exchanges against Google's guidelines?",
    answer:
      "Google's spam policies target excessive link exchanges — swapping links at scale purely for cross-linking. An occasional, editorial link between two real sites in the same niche is normal on the web. That's why we only match same-niche sites, keep every swap one for one, and leave placement up to you so each link fits the content.",
  },
  {
    slug: "matching",
    question: "How are sites matched?",
    answer:
      "By B2B niche. Your site is only shared with members publishing in your topic, described by niche and Domain Rating with the URL hidden. Once both sides agree, URLs are revealed and you talk directly about where each link goes.",
  },
  {
    slug: "vs-sites",
    question: "How is this different from other free link exchange sites?",
    answer:
      "Most link exchange sites are open directories or credit marketplaces where anyone can trade with anyone. Here there's no marketplace, no credits, and no automated placements — just one weekly email with relevant sites in your niche, and you decide every link yourself.",
  },
  {
    slug: "no-trade",
    question: "What if I'd rather not trade links?",
    answer:
      "Mentiohunt, from the team behind this exchange, finds sites where your content genuinely belongs and runs the outreach for you — no reciprocal link needed.",
  },
] as const

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      // The brand is an exact-match domain for "exchange backlinks"; help
      // Google tie every spelling of it to this site name.
      alternateName: ["exchange-backlinks.com", "ExchangeBacklinks"],
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
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
}

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
            {/* The eyebrow is the H1 on purpose: it carries the query this
                page ranks for ("free backlink exchange"); the big slogan
                is a visual headline only. */}
            <h1
              id="hero-title"
              className="m-0 flex items-center gap-3.5 text-xs font-semibold tracking-[0.16em] text-ink-secondary uppercase"
            >
              <span className="h-px w-8 bg-input" aria-hidden="true" />
              Free backlink exchange for B2B sites
              <span className="h-px w-8 bg-input" aria-hidden="true" />
            </h1>
            <p className="mt-5 font-heading text-[40px] leading-[1.06] font-bold tracking-[-0.03em] text-balance text-ink sm:text-[56px] lg:text-[72px]">
              Good backlinks are <span className="text-brand">traded</span>, not
              bought.
            </p>
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

        {/* FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="scroll-mt-[60px] px-4 pt-20 sm:px-6 sm:pt-28 lg:pt-32"
        >
          <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              title="Backlink exchange, answered."
              description="What a free link exchange is, how matching works, and how to keep every swap safe for SEO."
            />
            <div className="flex flex-col border-t border-hairline">
              {FAQ.map((item) => (
                <details
                  key={item.question}
                  className="group border-b border-hairline py-5"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-heading text-lg leading-snug font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    <h3>{item.question}</h3>
                    <IconPlus
                      className="mt-1 size-4 shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-45"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 max-w-2xl text-[15px] leading-6 text-pretty text-ink-secondary">
                    {item.answer}
                    {item.slug === "no-trade" && (
                      <>
                        {" "}
                        {/* No noreferrer on purpose: Mentiohunt needs the
                            referrer + UTMs to attribute this traffic. */}
                        {/* eslint-disable-next-line react/jsx-no-target-blank */}
                        <a
                          href={mentiohuntUrl({
                            medium: "referral",
                            campaign: "home_faq",
                          })}
                          target="_blank"
                          rel="noopener"
                          className="font-medium text-ink underline decoration-primary/60 decoration-[1.5px] underline-offset-[3px] hover:decoration-primary"
                        >
                          Try Mentiohunt
                        </a>
                        .
                      </>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

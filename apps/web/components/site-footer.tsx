import Link from "next/link"
import {
  IconArrowRight,
  IconArrowUp,
  IconBrandGithub,
  IconCheck,
} from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { Logo } from "@/components/logo"
import { Eyebrow } from "@/components/section"
import { ALTERNATIVES } from "@/lib/alternatives"
import { GUIDES } from "@/lib/guides"
import { GITHUB_URL, mentiohuntUrl } from "@/lib/site"

const PERKS = [
  { title: "Free forever", body: "No fees, credits, or paid tier." },
  { title: "Same niche only", body: "Matched with B2B sites in your topic." },
  { title: "One email a week", body: "Your matches, nothing else." },
  { title: "Open source", body: "Every line of code is on GitHub." },
]

const FOOTER_LINK =
  "text-ink-secondary hover:text-ink leading-5 transition-colors"

function FooterNav({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <nav
      aria-label={label}
      className="flex flex-[1_1_160px] flex-col gap-[7px]"
    >
      <p className="mb-1 text-[13px] font-semibold text-ink">{label}</p>
      {children}
    </nav>
  )
}

export function SiteFooter({
  currentSlug,
  cta = true,
}: {
  currentSlug?: string
  /** Show the closing "Submit your site" call-to-action block. */
  cta?: boolean
}) {
  const alternatives = ALTERNATIVES.filter((a) => a.slug !== currentSlug)

  return (
    <footer>
      {cta && (
        <div className="px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto grid max-w-[1120px] items-center gap-x-16 gap-y-10 lg:grid-cols-[1fr_minmax(0,28rem)]">
            <div className="flex max-w-xl flex-col gap-3.5">
              <Eyebrow>Get started</Eyebrow>
              <h2 className="font-heading text-[34px] leading-[1.08] font-bold tracking-[-0.025em] text-balance text-ink sm:text-[44px] lg:text-[52px]">
                Your next backlink is{" "}
                <span className="text-brand">a trade away.</span>
              </h2>
              <p className="text-[17px] leading-[27px] text-pretty text-ink-secondary">
                Submit your site once. Every week we match it with other B2B
                sites in your niche — you agree on the swap directly, on your
                own terms.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-[18px] gap-y-2.5">
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/submit" />}
                >
                  Submit your site
                  <IconArrowRight data-icon="inline-end" />
                </Button>
                <Link
                  href="/#how-it-works"
                  className="inline-flex min-h-11 items-center gap-1.5 font-medium text-ink"
                >
                  See how it works
                  <IconArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <ul className="flex flex-col rounded-xl border border-border bg-card px-6 py-2 shadow-lifted">
              {PERKS.map((perk, i) => (
                <li
                  key={perk.title}
                  className={
                    i < PERKS.length - 1
                      ? "flex gap-3.5 border-b border-hairline py-4"
                      : "flex gap-3.5 py-4"
                  }
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand-strong">
                    <IconCheck
                      className="size-4"
                      stroke={2.5}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[15px] font-semibold text-ink">
                      {perk.title}
                    </span>
                    <span className="text-sm text-ink-muted">{perk.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="border-t border-hairline bg-surface px-4 pt-14 pb-7 text-sm sm:px-6">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-10">
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            <div className="flex flex-[2_1_280px] flex-col gap-3">
              <Logo />
              <p className="max-w-[340px] leading-[22px] text-ink-secondary">
                A 100% free backlink exchange for B2B sites. One weekly email
                matches you with sites in your niche — you arrange the swap.
              </p>
              <p className="max-w-[340px] text-[13px] leading-5 text-ink-muted">
                Built by the team behind{" "}
                {/* No noreferrer on purpose: Mentiohunt needs the referrer +
                    UTMs to attribute this traffic. noopener still applies. */}
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a
                  href={mentiohuntUrl({
                    medium: "referral",
                    campaign: "footer",
                  })}
                  target="_blank"
                  rel="noopener"
                  className="font-medium text-ink underline decoration-primary/60 decoration-[1.5px] underline-offset-[3px] hover:decoration-primary"
                >
                  Mentiohunt
                </a>{" "}
                — backlink acquisition on autopilot.
              </p>
            </div>

            <FooterNav label="Exchange">
              <Link href="/#how-it-works" className={FOOTER_LINK}>
                How it works
              </Link>
              <Link href="/#house-rules" className={FOOTER_LINK}>
                House rules
              </Link>
              <Link href="/submit" className={FOOTER_LINK}>
                Submit your site
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${FOOTER_LINK} inline-flex items-center gap-1.5`}
              >
                <IconBrandGithub className="size-3.5" aria-hidden="true" />
                Star on GitHub
              </a>
            </FooterNav>

            <FooterNav label="Guides">
              <Link href="/guides" className={FOOTER_LINK}>
                All guides
              </Link>
              {GUIDES.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className={`${FOOTER_LINK} first-letter:uppercase`}
                >
                  {guide.title}
                </Link>
              ))}
            </FooterNav>

            <FooterNav label="Alternatives">
              <Link href="/alternatives" className={FOOTER_LINK}>
                All alternatives
              </Link>
              {alternatives.map((alternative) => (
                <Link
                  key={alternative.slug}
                  href={`/alternatives/${alternative.slug}`}
                  className={FOOTER_LINK}
                >
                  {alternative.name} alternative
                </Link>
              ))}
            </FooterNav>
          </div>

          <div className="flex flex-wrap justify-between gap-x-4 gap-y-2 border-t border-border pt-5 text-[13px] text-ink-muted">
            <p>© 2026 Exchange Backlinks · Free forever · Open source</p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-ink-secondary transition-colors hover:text-ink"
            >
              <IconArrowUp className="size-3.5" aria-hidden="true" />
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

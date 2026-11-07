import {
  IconArrowsExchange,
  IconCheck,
  IconLock,
  IconMail,
} from "@tabler/icons-react"

import { cn } from "@workspace/ui/lib/utils"

/*
 * Small product mock-ups in the Mentiohunt style: white cards with hairline
 * rows and a 1px shadow. All data shown is illustrative — every site is
 * described by niche/profile only, exactly as the weekly email does it.
 */

const CARD =
  "border-border bg-card text-foreground shadow-card rounded-[10px] border text-sm"

function DrBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium text-ink-secondary tabular-nums">
      DR {value}
    </span>
  )
}

/** Step 1 — your submitted site, URL locked. */
export function SubmitVisual() {
  return (
    <div className={cn(CARD, "flex flex-col px-5 py-[18px]")}>
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-medium text-ink-muted">Your site</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2 py-0.5 text-xs font-medium text-brand-strong">
          <IconLock className="size-3" aria-hidden="true" />
          Hidden from members
        </span>
      </div>
      <Row label="Domain">
        <span className="tracking-[0.2em] text-ink">••••••••.com</span>
      </Row>
      <Row label="Niche">
        <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-ink">
          seo
        </span>
      </Row>
      <Row label="Domain Rating">
        <span className="flex items-center gap-1.5 font-medium text-ink tabular-nums">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.google.com/s2/favicons?domain=ahrefs.com&sz=32"
            alt=""
            width={14}
            height={14}
            loading="lazy"
            className="rounded-[3px]"
          />
          34
        </span>
      </Row>
      <Row label="Keywords" last>
        <span className="truncate text-ink-secondary">
          link building, saas seo
        </span>
      </Row>
    </div>
  )
}

function Row({
  label,
  children,
  last,
}: {
  label: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <span
      className={cn(
        "flex items-center justify-between gap-4 py-2.5",
        !last && "border-b border-hairline"
      )}
    >
      <span className="shrink-0 text-ink-muted">{label}</span>
      {children}
    </span>
  )
}

const MATCHES = [
  {
    initial: "A",
    description: "B2B analytics blog for SaaS marketers",
    dr: 41,
    keywords: "seo reporting, attribution",
  },
  {
    initial: "C",
    description: "Content ops guides for lean marketing teams",
    dr: 28,
    keywords: "content briefs, topic clusters",
  },
  {
    initial: "L",
    description: "Link-building playbooks for founders",
    dr: 36,
    keywords: "digital pr, outreach",
  },
]

/** Step 2 — the weekly email of matched sites. */
export function DigestVisual() {
  return (
    <div className={cn(CARD, "flex flex-col overflow-hidden")}>
      <div className="flex items-center gap-2.5 border-b border-hairline bg-surface px-5 py-3">
        <IconMail className="size-4 text-brand-strong" aria-hidden="true" />
        <span className="font-medium text-ink">This week in seo</span>
        <span className="ml-auto text-xs text-ink-muted">Monday</span>
      </div>
      <ul className="flex flex-col px-5">
        {MATCHES.map((match, i) => (
          <li
            key={match.initial}
            className={cn(
              "flex items-center gap-3 py-3",
              i < MATCHES.length - 1 && "border-b border-hairline"
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-xs font-bold text-brand-strong">
              {match.initial}
            </span>
            <span className="min-w-0 flex-1 truncate">{match.description}</span>
            <DrBadge value={match.dr} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Step 3 — both sides agree and the URLs are revealed. */
export function ExchangeVisual() {
  return (
    <div className={cn(CARD, "flex flex-col gap-4 px-5 py-[18px]")}>
      <div className="flex items-center gap-3">
        <SiteChip domain="yoursite.com" />
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <IconArrowsExchange className="size-4" aria-hidden="true" />
        </span>
        <SiteChip domain="partnerblog.io" />
      </div>
      <div className="rounded-lg border border-brand-border bg-brand-tint px-4 py-3 leading-6 text-ink">
        <span className="font-semibold">Both of you agreed.</span> URLs are
        revealed — reply to each other and decide where each link goes.
      </div>
    </div>
  )
}

function SiteChip({ domain }: { domain: string }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2">
      <IconCheck
        className="size-4 shrink-0 text-success"
        stroke={2.5}
        aria-hidden="true"
      />
      <span className="truncate font-medium text-ink">{domain}</span>
    </span>
  )
}

const HERO_MATCHES = [
  {
    initial: "A",
    niche: "seo",
    description: "B2B analytics blog for SaaS marketers",
    dr: 41,
    keywords: ["seo reporting", "attribution"],
    primary: true,
  },
  {
    initial: "C",
    niche: "seo",
    description: "Content ops guides for lean marketing teams",
    dr: 28,
    keywords: ["content briefs", "topic clusters"],
    primary: false,
  },
  {
    initial: "L",
    niche: "seo",
    description: "Link-building playbooks for bootstrapped founders",
    dr: 36,
    keywords: ["digital pr", "outreach"],
    primary: false,
  },
]

/** Large "weekly email" mock-up shown under the homepage hero. */
export function DigestEmailPreview() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-card text-left shadow-[0_1px_2px_rgba(15,15,15,0.04),0_24px_64px_rgba(15,15,15,0.12)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-hairline bg-surface px-4 py-3">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 truncate text-xs font-medium text-ink-muted">
          Inbox — Weekly backlink matches
        </span>
      </div>

      <div className="px-5 py-5 sm:px-8 sm:py-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink-muted">
              From Exchange Backlinks · to you
            </p>
            <p className="mt-1.5 font-heading text-lg leading-snug font-bold tracking-[-0.01em] text-ink sm:text-xl">
              3 matches for you in <span className="text-brand">seo</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-xs font-medium text-brand-strong">
            <IconLock className="size-3" aria-hidden="true" />
            URLs hidden until you both agree
          </span>
        </div>

        <ul className="mt-5 flex flex-col border-t border-hairline">
          {HERO_MATCHES.map((match) => (
            <li
              key={match.initial}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-hairline py-4 sm:flex-nowrap"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-sm font-bold text-brand-strong">
                {match.initial}
              </span>
              {/* On phones the text takes the full row; badge + button wrap below. */}
              <span className="flex min-w-0 flex-[1_1_calc(100%-56px)] flex-col gap-1 sm:flex-1">
                <span className="text-[15px] font-semibold text-ink sm:truncate">
                  {match.description}
                </span>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-muted">
                  <span>{match.niche}</span>
                  <span aria-hidden="true">·</span>
                  <span>Ranks for {match.keywords.join(", ")}</span>
                </span>
              </span>
              <span className="ml-14 flex shrink-0 items-center gap-3 sm:ml-0">
                <DrBadge value={match.dr} />
                <span
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center rounded-lg border px-3 text-[13px] font-semibold",
                    match.primary
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-input text-ink shadow-card"
                  )}
                >
                  Contact this site
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[13px] text-ink-muted">
          One email a week. Contact a match and agree on the swap directly — no
          middleman, no rules on placement.
        </p>
      </div>
    </div>
  )
}

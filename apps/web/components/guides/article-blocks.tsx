import Image from "next/image"
import Link from "next/link"
import { IconArrowRight, IconBulb, IconMail } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import type { FaqItem } from "@/lib/guides"

/**
 * Building blocks for /guides MDX articles. Registered globally in
 * mdx-components.tsx so the content files can use them without imports.
 */

/** Screenshot or image with a caption and an optional source link. */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  source,
  sourceHref,
}: {
  src: string
  alt: string
  width: number
  height: number
  caption: React.ReactNode
  source?: string
  sourceHref?: string
}) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-card">
        {/* Unoptimized: the Cloudflare deploy has no image optimizer, and
            these are already compressed WebP at 2x. */}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-ink-muted">
        {caption}
        {source && sourceHref && (
          <>
            {" "}
            Source:{" "}
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-secondary underline decoration-input underline-offset-2 hover:text-ink"
            >
              {source}
            </a>
            .
          </>
        )}
      </figcaption>
    </figure>
  )
}

/** Highlighted box: the short answer up top, or a note mid-article. */
export function Callout({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <aside className="my-8 rounded-xl border border-brand-border bg-brand-tint p-6">
      <p className="flex items-center gap-2 font-heading text-base font-bold text-ink">
        <IconBulb className="size-5 text-brand-strong" aria-hidden="true" />
        {title}
      </p>
      <div className="mt-3 [&>ol]:mt-3 [&>p]:mt-3 [&>p:first-child]:mt-0 [&>ul]:mt-3">
        {children}
      </div>
    </aside>
  )
}

/** Dated list of statements from Google, oldest first. */
export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <ol className="my-8 flex flex-col border-l-2 border-hairline">
      {children}
    </ol>
  )
}

export function TimelineItem({
  date,
  who,
  source,
  href,
  children,
}: {
  date: string
  who: string
  source: string
  href: string
  children: React.ReactNode
}) {
  return (
    <li className="relative pb-8 pl-6 last:pb-0">
      <span
        className="absolute top-1.5 -left-[7px] size-3 rounded-full border-2 border-background bg-brand"
        aria-hidden="true"
      />
      <p className="text-[13px] font-semibold text-brand-strong">{date}</p>
      <p className="mt-0.5 text-sm font-medium text-ink-secondary">{who}</p>
      <div className="mt-2 [&>p]:mt-3 [&>p:first-child]:mt-0">{children}</div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-[13px] text-ink-muted underline decoration-input underline-offset-2 hover:text-ink"
      >
        {source}
      </a>
    </li>
  )
}

/** Numbered question cards (the 5-question test). */
export function QuestionCards({
  items,
}: {
  items: { question: string; detail: string }[]
}) {
  return (
    <ol className="my-8 grid gap-3">
      {items.map((item, i) => (
        <li
          key={item.question}
          className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-tint font-heading text-sm font-bold text-brand-strong">
            {i + 1}
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-[17px] leading-snug font-bold text-ink">
              {item.question}
            </span>
            <span className="mt-1.5 text-[15px] leading-6 text-ink-secondary">
              {item.detail}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}

/** A copy-ready outreach email. */
export function EmailTemplate({
  subject,
  body,
}: {
  subject: string
  body: string
}) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <figcaption className="flex items-center gap-2 border-b border-hairline bg-surface px-5 py-3 text-sm text-ink-secondary">
        <IconMail className="size-4 text-brand-strong" aria-hidden="true" />
        <span className="font-semibold text-ink">Subject:</span> {subject}
      </figcaption>
      <p className="px-5 py-4 text-[15px] leading-7 whitespace-pre-wrap text-foreground">
        {body}
      </p>
    </figure>
  )
}

/** Mid-article call to action for the exchange. */
export function GuideCta({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <aside className="my-10 flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-heading text-lg font-bold text-ink">{title}</p>
        <div className="mt-1.5 text-[15px] leading-6 text-ink-secondary">
          {children}
        </div>
      </div>
      <Button
        size="lg"
        nativeButton={false}
        render={<Link href="/submit" />}
        className="shrink-0"
      >
        Submit your site
        <IconArrowRight data-icon="inline-end" />
      </Button>
    </aside>
  )
}

/** FAQ list. Questions are h3s so they stay out of the h2-only TOC. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-6 flex flex-col divide-y divide-hairline rounded-xl border border-border bg-card px-6 shadow-card">
      {items.map((item) => (
        <div key={item.question} className="py-5">
          <h3 className="font-heading text-[17px] leading-snug font-bold text-ink">
            {item.question}
          </h3>
          <p className="mt-2 text-[15px] leading-7 text-ink-secondary">
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  )
}

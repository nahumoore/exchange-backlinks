import type { MDXComponents } from "mdx/types"
import { isValidElement } from "react"
import Link from "next/link"

import {
  Callout,
  EmailTemplate,
  Faq,
  Figure,
  GuideCta,
  QuestionCards,
  Timeline,
  TimelineItem,
} from "@/components/guides/article-blocks"
import {
  ExchangeProcessDiagram,
  ExchangeTypesDiagram,
} from "@/components/guides/exchange-diagrams"
import { LinkPatternsDiagram } from "@/components/guides/link-patterns-diagram"
import { YouTube } from "@/components/guides/youtube-embed"
import { isMentiohuntUrl, mentiohuntUrl } from "@/lib/site"

/** Flattens MDX heading children to plain text. */
function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (isValidElement<{ children?: React.ReactNode }>(node))
    return textOf(node.props.children)
  return ""
}

/** Stable anchor id for headings, used by the "On this page" sidebar. */
function slugify(node: React.ReactNode) {
  return textOf(node)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// Article typography mirrors Mentiohunt's comparison pages.
const components: MDXComponents = {
  h2: ({ children }) => (
    <h2
      id={slugify(children)}
      className="mt-14 mb-5 scroll-mt-24 font-heading text-[1.7rem] leading-tight font-bold tracking-[-0.02em] text-ink first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={slugify(children)}
      className="mt-10 mb-3 scroll-mt-24 font-heading text-xl font-bold tracking-[-0.01em] text-ink"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 text-[17px] leading-[1.75] text-foreground first:mt-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[17px] leading-[1.7] text-foreground marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 list-decimal space-y-2.5 pl-5 text-[17px] leading-[1.7] text-foreground marker:font-semibold marker:text-ink-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  a: ({ href, children }) => {
    const external = href?.startsWith("http") ?? false
    // Mentiohunt links get UTMs and keep the referrer so the traffic is
    // attributable; other external links stay noreferrer.
    const mentiohunt = href ? isMentiohuntUrl(href) : false
    return (
      <Link
        href={
          mentiohunt && href
            ? mentiohuntUrl({
                medium: "referral",
                campaign: "content",
                url: href,
              })
            : (href ?? "#")
        }
        target={external ? "_blank" : undefined}
        rel={
          external
            ? mentiohunt
              ? "noopener"
              : "noopener noreferrer"
            : undefined
        }
        className="font-medium [overflow-wrap:anywhere] text-ink underline decoration-primary/60 decoration-[1.5px] underline-offset-[3px] transition-colors hover:decoration-primary"
      >
        {children}
      </Link>
    )
  },
  table: ({ children }) => (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-border shadow-card">
      <table className="w-full border-collapse text-left text-[0.9375rem] leading-[1.55]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border bg-surface">{children}</thead>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-hairline transition-colors last:border-b-0 hover:bg-surface/60">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 align-middle text-sm font-semibold text-ink">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="p-4 align-top text-foreground">{children}</td>
  ),
  hr: () => <hr className="my-10 border-hairline" />,
  code: ({ children }) => (
    <code className="rounded-md border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-ink">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-[3px] border-brand pl-5 text-ink-secondary italic [&>p:first-child]:mt-0">
      {children}
    </blockquote>
  ),
  // Guide building blocks (components/guides/), usable without imports.
  Callout,
  EmailTemplate,
  Faq,
  ExchangeProcessDiagram,
  ExchangeTypesDiagram,
  Figure,
  GuideCta,
  LinkPatternsDiagram,
  QuestionCards,
  Timeline,
  TimelineItem,
  YouTube,
}

export function useMDXComponents(): MDXComponents {
  return components
}

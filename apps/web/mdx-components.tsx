import type { MDXComponents } from "mdx/types"
import Link from "next/link"

import { isMentiohuntUrl, mentiohuntUrl } from "@/lib/site"

const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="font-heading mt-12 text-2xl font-semibold tracking-tight sm:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-lg font-semibold">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-muted-foreground mt-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5 leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-muted-foreground mt-4 list-decimal space-y-2 pl-5 leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
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
        className="text-primary underline underline-offset-4"
      >
        {children}
      </Link>
    )
  },
  table: ({ children }) => (
    <div className="border-border mt-6 overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/30 border-border border-b">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 font-medium">{children}</th>
  ),
  td: ({ children }) => (
    <td className="text-muted-foreground border-border border-t px-4 py-3">
      {children}
    </td>
  ),
  hr: () => <hr className="border-border my-10" />,
}

export function useMDXComponents(): MDXComponents {
  return components
}

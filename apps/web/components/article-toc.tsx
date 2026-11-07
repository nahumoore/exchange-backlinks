"use client"

import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

type Heading = { id: string; text: string }

/**
 * "On this page" sidebar. Reads the h2[id]s rendered inside the element with
 * `data-article-body` (ids come from mdx-components.tsx) and highlights the
 * section currently in view.
 */
export function ArticleToc() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(
        "[data-article-body] h2[id]"
      )
    )
    // Headings live in server-rendered MDX, so read them once the DOM is
    // painted rather than synchronously inside the effect.
    const frame = requestAnimationFrame(() =>
      setHeadings(nodes.map((n) => ({ id: n.id, text: n.textContent ?? "" })))
    )
    if (nodes.length === 0) return () => cancelAnimationFrame(frame)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-80px 0px -65% 0px" }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <nav aria-label="On this page" className="flex flex-col">
      <p className="px-3 pb-2 text-xs font-medium text-ink-muted">
        On this page
      </p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          aria-current={active === heading.id ? "location" : undefined}
          className={cn(
            "rounded-md py-1.5 pr-3 pl-3 text-sm leading-[1.45] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            active === heading.id
              ? "bg-surface-hover font-semibold text-ink"
              : "text-ink-secondary hover:bg-surface hover:text-ink"
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
}

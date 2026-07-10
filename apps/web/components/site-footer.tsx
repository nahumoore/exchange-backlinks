import Link from "next/link"
import { IconBrandGithub } from "@tabler/icons-react"

import { ALTERNATIVES } from "@/lib/alternatives"
import { GITHUB_URL } from "@/lib/site"

export function SiteFooter({ currentSlug }: { currentSlug?: string }) {
  const links = ALTERNATIVES.filter((a) => a.slug !== currentSlug)

  return (
    <footer className="border-border border-t">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-xs">
          <span className="text-foreground">alternatives:</span>
          {links.map((alternative, i) => (
            <span key={alternative.slug}>
              <Link
                href={`/alternatives/${alternative.slug}`}
                className="hover:text-foreground underline underline-offset-4"
              >
                {alternative.name}
              </Link>
              {i < links.length - 1 && <span>,</span>}
            </span>
          ))}
        </div>

        <div className="text-muted-foreground mt-6 flex flex-col gap-2 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 exchange-backlinks.com</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1.5 underline underline-offset-4"
          >
            <IconBrandGithub className="size-3.5" />
            Star on GitHub
          </a>
          <span>
            built by the team behind{" "}
            <a
              href="https://mentiohunt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              Mentiohunt
            </a>{" "}
            — backlink acquisition on autopilot
          </span>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconBrandGithub } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Logo } from "@/components/logo"
import { GITHUB_URL } from "@/lib/site"

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#house-rules", label: "House rules" },
  { href: "/alternatives", label: "Alternatives" },
  { href: "/guides", label: "Guides" },
]

const NAV_LINK =
  "text-foreground hover:bg-surface-hover hover:text-ink inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors"

/**
 * Fixed header that sits transparent over the hero and gains a white
 * background + hairline once the page scrolls (same behavior as
 * mentiohunt.com). Pages must leave ~60px of top space for it.
 */
export function SiteHeader({ cta = true }: { cta?: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-hairline bg-background/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center gap-2 px-4 sm:px-6 lg:px-10">
        <Logo className="sm:mr-3" />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={NAV_LINK}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(NAV_LINK, "hidden sm:inline-flex")}
          >
            <IconBrandGithub className="size-4" aria-hidden="true" />
            GitHub
          </a>
          {cta && (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/submit" />}
            >
              Submit your site
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

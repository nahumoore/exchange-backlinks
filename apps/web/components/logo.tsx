import Link from "next/link"
import { IconArrowsExchange } from "@tabler/icons-react"

import { cn } from "@workspace/ui/lib/utils"

/** Brand mark + wordmark, styled after the Mentiohunt logo lockup. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center gap-2.5", className)}
      aria-label="Exchange Backlinks home"
    >
      <IconArrowsExchange
        aria-hidden="true"
        stroke={2.6}
        className="size-[26px] -rotate-12 text-primary drop-shadow-[0_4px_12px_rgba(255,96,0,0.24)]"
      />
      <span className="font-heading text-lg font-semibold tracking-[-0.01em] text-ink sm:text-xl">
        exchange<span className="text-brand">backlinks</span>
      </span>
    </Link>
  )
}

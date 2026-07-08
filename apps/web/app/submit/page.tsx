import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Submit your site — Backlinks Exchange",
}

export default function SubmitPage() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col items-start justify-center gap-4 px-6">
      <p className="text-muted-foreground font-mono text-xs sm:text-sm">
        {"// coming soon"}
      </p>
      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        Submit your site
      </h1>
      <p className="text-muted-foreground max-w-xl leading-relaxed">
        The submission form isn&apos;t live yet. Check back soon.
      </p>
      <Link
        href="/"
        className="text-primary font-mono text-sm underline underline-offset-4"
      >
        ← back to the exchange
      </Link>
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"

import { SubmitEmailForm } from "@/components/submit-email-form"

export const metadata: Metadata = {
  title: "Submit your site",
  description:
    "Register your B2B site for free. Every week we match it with other sites in your niche so you can trade backlinks on your own terms.",
  alternates: {
    canonical: "/submit",
  },
}

export default async function SubmitPage(props: PageProps<"/submit">) {
  const { error } = await props.searchParams
  const linkExpired = error === "expired"

  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center px-6 py-5">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          exchange<span className="text-primary">-</span>backlinks.com
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <p className="text-muted-foreground font-mono text-xs sm:text-sm">
          {"// step 1 of 2 — verify your email"}
        </p>
        <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Submit your site
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
          First, your email. We&apos;ll send you a verification link — one
          verified email can hold unlimited websites, and your address is never
          shown to other members.
        </p>
        {linkExpired && (
          <p className="text-destructive mt-4 max-w-xl text-sm leading-relaxed">
            That verification link expired. Enter your email and we&apos;ll
            send a fresh one.
          </p>
        )}
        <SubmitEmailForm />
      </main>
    </div>
  )
}

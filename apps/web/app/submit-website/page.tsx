import type { Metadata } from "next"
import Link from "next/link"
import { z } from "zod"

import { SubmitWebsiteForm } from "@/components/submit-website-form"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

export const metadata: Metadata = {
  title: "Add your websites",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function SubmitWebsitePage(
  props: PageProps<"/submit-website">
) {
  const { id } = await props.searchParams
  let memberId =
    typeof id === "string" && z.uuid().safeParse(id).success ? id : undefined

  // Unknown id or unverified member → render the invalid-link state below.
  if (memberId) {
    const { data: member } = await getSupabaseAdmin()
      .from("members")
      .select("id, verified_at")
      .eq("id", memberId)
      .maybeSingle()
    if (!member || member.verified_at === null) memberId = undefined
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center px-6 py-5">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          exchange<span className="text-primary">-</span>backlinks.com
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        {memberId ? (
          <>
            <p className="text-muted-foreground font-mono text-xs sm:text-sm">
              {"// step 2 of 2 — add your sites"}
            </p>
            <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Add your websites
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              Your email is verified. Add as many sites as you like — each one
              stays hidden from other members until you both agree to swap.
            </p>
            <SubmitWebsiteForm memberId={memberId} />
          </>
        ) : (
          <>
            <p className="text-muted-foreground font-mono text-xs sm:text-sm">
              {"// link invalid"}
            </p>
            <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              This link doesn&apos;t work
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              We couldn&apos;t match this link to a verified member — it may
              have been cut off by your email client or expired. Re-enter your
              email and we&apos;ll send you a fresh one.
            </p>
            <Link
              href="/submit"
              className="text-primary mt-6 inline-block font-mono text-sm underline underline-offset-4"
            >
              ← back to submit
            </Link>
          </>
        )}
      </main>
    </div>
  )
}

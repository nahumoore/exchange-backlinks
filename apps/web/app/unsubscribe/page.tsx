import type { Metadata } from "next"
import Link from "next/link"

import { UnsubscribeForm } from "@/components/unsubscribe-form"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token"

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function UnsubscribePage(
  props: PageProps<"/unsubscribe">
) {
  const { t } = await props.searchParams
  const token = typeof t === "string" ? t : undefined
  const verified = token ? verifyUnsubscribeToken(token) : null

  let member: {
    id: string
    email: string
    unsubscribed_at: string | null
    sites: { domain: string }[]
  } | null = null
  if (verified) {
    const { data } = await getSupabaseAdmin()
      .from("members")
      .select("id, email, unsubscribed_at, sites(domain)")
      .eq("id", verified.memberId)
      .maybeSingle()
    member = data
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center px-6 py-5">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          exchange<span className="text-primary">-</span>backlinks.com
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        {!member ? (
          <>
            <p className="text-muted-foreground font-mono text-xs sm:text-sm">
              {"// link invalid"}
            </p>
            <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              This link doesn&apos;t work
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              We couldn&apos;t match this link to a member — it may have been
              cut off by your email client, or the account no longer exists.
            </p>
            <Link
              href="/"
              className="text-primary mt-6 inline-block font-mono text-sm underline underline-offset-4"
            >
              ← back home
            </Link>
          </>
        ) : member.unsubscribed_at ? (
          <>
            <p className="text-muted-foreground font-mono text-xs sm:text-sm">
              {"// already unsubscribed"}
            </p>
            <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              You&apos;re already unsubscribed
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              {member.email} isn&apos;t receiving digests, and its sites are
              hidden from other members. Submit again anytime to rejoin.
            </p>
            <Link
              href="/submit"
              className="text-primary mt-6 inline-block font-mono text-sm underline underline-offset-4"
            >
              ← back to submit
            </Link>
          </>
        ) : (
          <>
            <p className="text-muted-foreground font-mono text-xs sm:text-sm">
              {"// unsubscribe"}
            </p>
            <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Leave the exchange?
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              Confirming will stop weekly emails to{" "}
              <span className="text-foreground font-medium">
                {member.email}
              </span>{" "}
              and hide{" "}
              {member.sites.length === 1
                ? "your site"
                : `all ${member.sites.length} of your sites`}{" "}
              from other members. Nothing is deleted — you can submit again
              anytime to rejoin.
            </p>
            <UnsubscribeForm token={token!} />
          </>
        )}
      </main>
    </div>
  )
}

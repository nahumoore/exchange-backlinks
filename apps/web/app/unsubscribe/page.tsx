import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { FormPageHeading, FormPageShell } from "@/components/form-page-shell"
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

  if (!member) {
    return (
      <FormPageShell>
        <FormPageHeading eyebrow="Link invalid" title="This link doesn't work">
          We couldn&apos;t match this link to a member — it may have been cut
          off by your email client, or the account no longer exists.
        </FormPageHeading>
        <BackButton href="/" label="Back home" />
      </FormPageShell>
    )
  }

  if (member.unsubscribed_at) {
    return (
      <FormPageShell>
        <FormPageHeading
          eyebrow="Already unsubscribed"
          title="You're already unsubscribed"
        >
          {member.email} isn&apos;t receiving digests, and its sites are hidden
          from other members. Submit again anytime to rejoin.
        </FormPageHeading>
        <BackButton href="/submit" label="Back to submit" />
      </FormPageShell>
    )
  }

  return (
    <FormPageShell>
      <FormPageHeading eyebrow="Unsubscribe" title="Leave the exchange?">
        Confirming will stop weekly emails to{" "}
        <span className="font-semibold text-ink">{member.email}</span> and hide{" "}
        {member.sites.length === 1
          ? "your site"
          : `all ${member.sites.length} of your sites`}{" "}
        from other members. Nothing is deleted — you can submit again anytime to
        rejoin.
      </FormPageHeading>
      <UnsubscribeForm token={token!} />
    </FormPageShell>
  )
}

function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Button
      size="lg"
      variant="outline"
      className="mt-8"
      nativeButton={false}
      render={<Link href={href} />}
    >
      <IconArrowLeft data-icon="inline-start" />
      {label}
    </Button>
  )
}

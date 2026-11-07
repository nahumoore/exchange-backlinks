import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft, IconCircleCheck } from "@tabler/icons-react"
import { z } from "zod"

import { Button } from "@workspace/ui/components/button"
import { FormPageHeading, FormPageShell } from "@/components/form-page-shell"
import { SubmitVisual } from "@/components/product-visuals"
import { Eyebrow } from "@/components/section"
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

  if (!memberId) {
    return (
      <FormPageShell>
        <FormPageHeading eyebrow="Link invalid" title="This link doesn't work">
          We couldn&apos;t match this link to a verified member — it may have
          been cut off by your email client or expired. Re-enter your email and
          we&apos;ll send you a fresh one.
        </FormPageHeading>
        <Button
          size="lg"
          variant="outline"
          className="mt-8"
          nativeButton={false}
          render={<Link href="/submit" />}
        >
          <IconArrowLeft data-icon="inline-start" />
          Back to submit
        </Button>
      </FormPageShell>
    )
  }

  return (
    <FormPageShell width="xl" aside={<PrivacyAside />}>
      <FormPageHeading
        eyebrow="Step 2 of 2 · Add your sites"
        title={
          <>
            Add your <span className="text-brand">websites</span>
          </>
        }
      >
        Your email is verified. Add as many sites as you like — each one stays
        hidden from other members until you both agree to swap.
      </FormPageHeading>
      <SubmitWebsiteForm memberId={memberId} />
    </FormPageShell>
  )
}

const PRIVACY_POINTS = [
  "Members only see your niche, Domain Rating, keywords, and description.",
  "Your URL is revealed only after you both agree to a swap.",
  "Leave anytime from the unsubscribe link in your weekly email.",
]

function PrivacyAside() {
  return (
    <div className="flex flex-col gap-3.5">
      <Eyebrow>What members see</Eyebrow>
      <p className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-ink">
        Your URL stays hidden.{" "}
        <span className="text-ink-muted">Until you both agree.</span>
      </p>
      <div className="mt-3">
        <SubmitVisual />
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
        {PRIVACY_POINTS.map((point) => (
          <li
            key={point}
            className="flex gap-2.5 text-sm leading-6 text-ink-secondary"
          >
            <IconCircleCheck
              className="mt-1 size-4 shrink-0 text-success"
              aria-hidden="true"
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}

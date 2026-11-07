import type { Metadata } from "next"

import {
  FormPageHeading,
  FormPageShell,
  Notice,
  StepList,
} from "@/components/form-page-shell"
import { Eyebrow } from "@/components/section"
import { SubmitEmailForm } from "@/components/submit-email-form"

export const metadata: Metadata = {
  title: "Submit your site",
  description:
    "Register your B2B site for free. Every week we match it with other sites in your niche so you can trade backlinks on your own terms.",
  alternates: {
    canonical: "/submit",
  },
}

const NEXT_STEPS = [
  {
    title: "Verify your email",
    body: "Click the link we send you. One verified email can hold unlimited websites.",
  },
  {
    title: "Add your sites",
    body: "Domain, niche, and a few keywords. Your URL stays hidden from other members.",
  },
  {
    title: "Get your weekly matches",
    body: "One email a week with sites in your niche. Agree on a swap directly — on your terms.",
  },
]

export default async function SubmitPage(props: PageProps<"/submit">) {
  const { error } = await props.searchParams
  const linkExpired = error === "expired"

  return (
    <FormPageShell
      aside={
        <div className="flex flex-col gap-3.5">
          <Eyebrow>What happens next</Eyebrow>
          <p className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-ink">
            Two minutes to join.{" "}
            <span className="text-ink-muted">One email a week after.</span>
          </p>
          <div className="mt-3">
            <StepList steps={NEXT_STEPS} />
          </div>
        </div>
      }
    >
      <FormPageHeading
        eyebrow="Step 1 of 2 · Verify your email"
        title={
          <>
            Submit your <span className="text-brand">site</span>
          </>
        }
      >
        First, your email. We&apos;ll send you a verification link — one
        verified email can hold unlimited websites, and your address is never
        shown to other members.
      </FormPageHeading>
      {linkExpired && (
        <Notice className="mt-6">
          That verification link expired. Enter your email and we&apos;ll send a
          fresh one.
        </Notice>
      )}
      <SubmitEmailForm />
    </FormPageShell>
  )
}

"use client"

import { useState } from "react"
import { IconArrowRight, IconMailCheck } from "@tabler/icons-react"
import { z } from "zod"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

const emailSchema = z.email()

export function SubmitEmailForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)
  const [devVerifyUrl, setDevVerifyUrl] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = emailSchema.safeParse(email.trim())
    if (!parsed.success) {
      setError("Enter a valid email address.")
      return
    }
    setError(null)
    setStatus("sending")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data }),
      })
      if (!res.ok) throw new Error()
      const data: { devVerifyUrl?: string } = await res.json()
      setDevVerifyUrl(data.devVerifyUrl ?? null)
      setStatus("sent")
    } catch {
      setStatus("idle")
      setError("Something went wrong sending the email. Try again.")
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="mt-8 w-full rounded-xl border border-border bg-card p-6 shadow-lifted"
      >
        <span className="flex size-11 items-center justify-center rounded-lg bg-brand-tint text-brand-strong">
          <IconMailCheck className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-heading text-xl font-bold tracking-[-0.01em] text-ink">
          Check your inbox
        </h2>
        <p className="mt-1.5 text-[15px] leading-6 text-ink-secondary">
          We sent a verification link to{" "}
          <span className="font-semibold text-ink">{email.trim()}</span>. Click
          it to start adding your sites — it&apos;s valid for 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-ink-secondary underline decoration-input underline-offset-4 transition-colors hover:text-ink"
        >
          Wrong address? Use a different email
        </button>
        {devVerifyUrl && (
          <p className="mt-4 border-t border-hairline pt-4">
            <a
              href={devVerifyUrl}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-strong"
            >
              Dev only: simulate clicking the email link
              <IconArrowRight className="size-3.5" aria-hidden="true" />
            </a>
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 w-full">
      <Label htmlFor="email">Your email</Label>
      <div className="mt-2.5 flex flex-col gap-3">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          className="h-11"
        />
        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className="w-full"
        >
          {status === "sending" ? "Sending…" : "Send verification link"}
          {status !== "sending" && <IconArrowRight data-icon="inline-end" />}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <p className="mt-3 text-center text-xs text-ink-muted">
        Free forever · No password · Unsubscribe anytime
      </p>
    </form>
  )
}

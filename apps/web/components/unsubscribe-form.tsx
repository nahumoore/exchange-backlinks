"use client"

import { useState } from "react"

import { IconCircleCheck } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"

export function UnsubscribeForm({ token }: { token: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setError(null)
    setStatus("sending")
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error()
      setStatus("done")
    } catch {
      setStatus("idle")
      setError("Something went wrong. Try again.")
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="mt-8 w-full rounded-xl border border-border bg-card p-6 shadow-lifted"
      >
        <span className="flex size-11 items-center justify-center rounded-lg bg-brand-tint text-brand-strong">
          <IconCircleCheck className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-heading text-xl font-bold tracking-[-0.01em] text-ink">
          You&apos;re out
        </h2>
        <p className="mt-1.5 text-[15px] leading-6 text-ink-secondary">
          Your sites are hidden from other members and the weekly emails have
          stopped. Submit again anytime to rejoin.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <Button
        type="button"
        size="lg"
        variant="destructive"
        onClick={handleConfirm}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Unsubscribing…" : "Confirm unsubscribe"}
      </Button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}

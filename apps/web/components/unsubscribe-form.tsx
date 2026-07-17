"use client"

import { useState } from "react"

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
      <div className="border-border mt-10 w-full max-w-md rounded-xl border p-6">
        <p className="text-primary font-mono text-xs">{"// unsubscribed"}</p>
        <h2 className="mt-3 text-lg font-semibold">You&apos;re out</h2>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Your sites are hidden from other members and the weekly emails have
          stopped. Submit again anytime to rejoin.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <Button
        type="button"
        variant="destructive"
        onClick={handleConfirm}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Unsubscribing…" : "Confirm unsubscribe"}
      </Button>
      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
    </div>
  )
}

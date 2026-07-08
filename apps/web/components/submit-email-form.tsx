"use client"

import { useState } from "react"
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
      <div className="border-border mt-10 w-full max-w-md rounded-xl border p-6">
        <p className="text-primary font-mono text-xs">{"// email sent"}</p>
        <h2 className="mt-3 text-lg font-semibold">Check your inbox</h2>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          We sent a verification link to{" "}
          <span className="text-foreground font-medium">{email.trim()}</span>.
          Click it to start adding your sites — it&apos;s valid for 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-muted-foreground hover:text-foreground mt-4 text-sm underline underline-offset-4"
        >
          Wrong address? Use a different email
        </button>
        {devVerifyUrl && (
          <p className="mt-4">
            <a
              href={devVerifyUrl}
              className="text-primary font-mono text-xs underline underline-offset-4"
            >
              {"// dev: simulate clicking the email link →"}
            </a>
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10 w-full max-w-md">
      <Label htmlFor="email">Your email</Label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          className="sm:flex-1"
        />
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send verification link"}
        </Button>
      </div>
      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
    </form>
  )
}

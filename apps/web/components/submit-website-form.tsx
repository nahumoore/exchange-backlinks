"use client"

import { useState } from "react"
import Link from "next/link"
import { IconCircleCheck, IconLock, IconLoader2 } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@workspace/ui/components/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { domainSchema } from "@/lib/domain"
import { NICHE_NAMES } from "@/lib/niches"

type Analysis = { domainRating: number | null; description: string }

export function SubmitWebsiteForm({ memberId }: { memberId: string }) {
  const [phase, setPhase] = useState<
    "domain" | "analyzing" | "details" | "submitting"
  >("domain")
  const [domainInput, setDomainInput] = useState("")
  const [domain, setDomain] = useState("")
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [niche, setNiche] = useState<string | null>(null)
  const [keywords, setKeywords] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submittedDomain, setSubmittedDomain] = useState<string | null>(null)

  function resetToDomain() {
    setPhase("domain")
    setAnalysis(null)
    setNiche(null)
    setKeywords("")
    setDescription("")
    setError(null)
  }

  async function handleAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = domainSchema.safeParse(domainInput)
    if (!parsed.success) {
      setError("Enter a valid domain, like acme.com.")
      return
    }
    setError(null)
    setPhase("analyzing")
    try {
      const res = await fetch("/api/analyze-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: parsed.data }),
      })
      if (!res.ok) throw new Error()
      const data: Analysis = await res.json()
      setDomain(parsed.data)
      setAnalysis(data)
      setDescription(data.description)
      setPhase("details")
    } catch {
      setPhase("domain")
      setError("We couldn't reach that site. Check the domain and try again.")
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!niche) {
      setError("Pick the niche your site publishes in.")
      return
    }
    const keywordList = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
    if (keywordList.length === 0) {
      setError("Add at least one keyword you want to rank for.")
      return
    }
    if (description.trim().length === 0) {
      setError("Add a short description of your site.")
      return
    }
    setError(null)
    setPhase("submitting")
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          domain,
          niche,
          keywords: keywordList,
          description: description.trim(),
        }),
      })
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}))
        if (res.status === 409 && data.error === "domain_taken") {
          setPhase("details")
          setError(
            "That domain is already in the exchange — each domain can only belong to one member."
          )
          return
        }
        throw new Error()
      }
      setSubmittedDomain(domain)
      setDomainInput("")
      resetToDomain()
    } catch {
      setPhase("details")
      setError("Something went wrong submitting the site. Try again.")
    }
  }

  return (
    <div className="mt-8">
      {phase === "domain" || phase === "analyzing" ? (
        <form onSubmit={handleAnalyze} noValidate>
          <Label htmlFor="domain">Domain</Label>
          <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
            <Input
              id="domain"
              name="domain"
              placeholder="acme.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              disabled={phase === "analyzing"}
              aria-invalid={error ? true : undefined}
              className="h-11 sm:flex-1"
            />
            <Button
              type="submit"
              disabled={phase === "analyzing"}
              className="h-11 px-5"
            >
              {phase === "analyzing" && (
                <IconLoader2
                  data-icon="inline-start"
                  className="animate-spin"
                />
              )}
              {phase === "analyzing" ? "Analyzing…" : "Continue"}
            </Button>
          </div>
          {phase === "analyzing" && (
            <p className="mt-3 text-[13px] text-ink-muted">
              Fetching your homepage to build the site profile…
            </p>
          )}
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-hidden rounded-xl border border-border bg-card shadow-lifted"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline bg-surface px-6 py-4">
            <IconCircleCheck
              className="size-4 shrink-0 text-success"
              aria-hidden="true"
            />
            <span className="text-[15px] font-semibold text-ink">{domain}</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-ink-secondary tabular-nums">
              DR {analysis?.domainRating ?? "—"}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-ink-muted">
              <img
                src="https://www.google.com/s2/favicons?domain=ahrefs.com&sz=32"
                alt=""
                width={14}
                height={14}
                className="rounded-sm"
              />
              Domain Rating via Ahrefs
            </span>
            <button
              type="button"
              onClick={resetToDomain}
              className="ml-auto text-sm font-medium text-ink-secondary underline decoration-input underline-offset-4 transition-colors hover:text-ink"
            >
              Change domain
            </button>
          </div>

          <div className="grid gap-5 px-6 pt-6">
            <div>
              <Label htmlFor="niche">Niche</Label>
              <Combobox
                items={NICHE_NAMES}
                value={niche}
                onValueChange={(value) => setNiche(value)}
              >
                <ComboboxInput
                  id="niche"
                  placeholder="Search niches…"
                  className="mt-2.5 w-full"
                />
                <ComboboxContent>
                  <ComboboxEmpty>No matching niche</ComboboxEmpty>
                  <ComboboxList>
                    <ComboboxCollection>
                      {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div>
              <Label htmlFor="keywords">Keywords you want to rank for</Label>
              <Input
                id="keywords"
                name="keywords"
                placeholder="b2b link building, backlink outreach, seo for saas"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="mt-2.5"
              />
              <p className="mt-2 text-xs text-ink-muted">
                Separate with commas — these help members pick the right anchor
                text for your links.
              </p>
            </div>

            <div>
              <Label htmlFor="description">Site description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2.5"
              />
              <p className="mt-2 text-xs text-ink-muted">
                AI-generated from your homepage — your site name stays hidden.
                Edit freely.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-hairline px-6 py-4">
            <Button
              type="submit"
              disabled={phase === "submitting"}
              className="h-11 px-5"
            >
              {phase === "submitting" ? "Submitting…" : "Submit website"}
            </Button>
            <span className="flex items-center gap-1.5 text-xs text-ink-muted">
              <IconLock className="size-3.5" aria-hidden="true" />
              Hidden from members until you both agree
            </span>
          </div>
        </form>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <Dialog
        open={submittedDomain !== null}
        onOpenChange={(open) => {
          if (!open) setSubmittedDomain(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-brand-tint text-brand-strong">
              <IconCircleCheck className="size-5" aria-hidden="true" />
            </span>
            <DialogTitle>Thanks for submitting!</DialogTitle>
            <DialogDescription>
              <span className="font-semibold text-ink">{submittedDomain}</span>{" "}
              is now in the exchange. Expect new backlink opportunities in your
              inbox soon — we&apos;ll email you sites in your niche that are
              ready to swap.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Back to home
            </Button>
            <Button onClick={() => setSubmittedDomain(null)}>
              Add another website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

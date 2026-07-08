"use client"

import { useState } from "react"
import Link from "next/link"
import { IconLock } from "@tabler/icons-react"
import { z } from "zod"

import { Button } from "@workspace/ui/components/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { NICHE_NAMES } from "@/lib/niches"

type Analysis = { domainRating: number; description: string }

/** Strip protocol, www. and any path so "https://www.Acme.com/blog" → "acme.com". */
function normalizeDomain(input: string) {
  const bare = input
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .replace(/^www\./, "")
  return (bare.split(/[/?#]/)[0] ?? "").replace(/\.$/, "")
}

const domainSchema = z
  .string()
  .transform(normalizeDomain)
  .pipe(
    z
      .string()
      .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/)
  )

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
      // TODO(backend): handle a 409 { error: "domain_taken" } response with
      // an "already in the exchange" message — domains are globally unique.
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
      if (!res.ok) throw new Error()
      setSubmittedDomain(domain)
      setDomainInput("")
      resetToDomain()
    } catch {
      setPhase("details")
      setError("Something went wrong submitting the site. Try again.")
    }
  }

  return (
    <div className="mt-10 max-w-2xl">
      {phase === "domain" || phase === "analyzing" ? (
        <form onSubmit={handleAnalyze} noValidate>
          <Label htmlFor="domain">Domain</Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Input
              id="domain"
              name="domain"
              placeholder="acme.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              disabled={phase === "analyzing"}
              aria-invalid={error ? true : undefined}
              className="sm:max-w-sm sm:flex-1"
            />
            <Button type="submit" disabled={phase === "analyzing"}>
              {phase === "analyzing" ? "Analyzing…" : "Continue"}
            </Button>
          </div>
          {phase === "analyzing" && (
            <p className="text-muted-foreground mt-3 font-mono text-xs">
              {"// fetching your homepage to build the site profile…"}
            </p>
          )}
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="border-border rounded-xl border p-6"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono text-sm font-medium">{domain}</span>
            <span className="border-primary/40 text-primary rounded-full border px-3 py-1 font-mono text-xs">
              dr {analysis?.domainRating}
            </span>
            <button
              type="button"
              onClick={resetToDomain}
              className="text-muted-foreground hover:text-foreground ml-auto text-sm underline underline-offset-4"
            >
              Change domain
            </button>
          </div>

          <div className="mt-6 grid gap-5">
            <div>
              <Label htmlFor="niche">Niche</Label>
              <Select value={niche} onValueChange={(value) => setNiche(value)}>
                <SelectTrigger id="niche" className="mt-2 h-9 w-full sm:max-w-xs">
                  <SelectValue placeholder="Select a niche" />
                </SelectTrigger>
                <SelectContent>
                  {NICHE_NAMES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keywords">Keywords you want to rank for</Label>
              <Input
                id="keywords"
                name="keywords"
                placeholder="b2b link building, backlink outreach, seo for saas"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="mt-2"
              />
              <p className="text-muted-foreground mt-2 text-xs">
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
                className="mt-2"
              />
              <p className="text-muted-foreground mt-2 font-mono text-xs">
                {"// generated from your homepage — edit freely"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={phase === "submitting"}>
              {phase === "submitting" ? "Submitting…" : "Submit website"}
            </Button>
            <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
              <IconLock className="size-3.5" />
              hidden from members until you both agree
            </span>
          </div>
        </form>
      )}
      {error && <p className="text-destructive mt-3 text-sm">{error}</p>}

      <Dialog
        open={submittedDomain !== null}
        onOpenChange={(open) => {
          if (!open) setSubmittedDomain(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <p className="text-primary font-mono text-xs">{"// submitted"}</p>
            <DialogTitle>Thanks for submitting!</DialogTitle>
            <DialogDescription>
              <span className="text-foreground font-mono">
                {submittedDomain}
              </span>{" "}
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

import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { ExchangeTicker } from "@/components/exchange-ticker"

const STEPS = [
  {
    number: "1",
    title: "Submit your site",
    body: "Tell us your domain and the B2B niche you publish in. That's the whole ask.",
  },
  {
    number: "2",
    title: "Get a weekly intro email",
    body: "Once a week, we send one email listing your site to other members in your niche — and theirs to you.",
  },
  {
    number: "3",
    title: "Arrange the swap together",
    body: "You and the other member discuss how and where each link gets placed. 100% freedom — no middleman, no rules on placement.",
  },
]

const RULES = [
  {
    keyword: "real sites only",
    body: "Sites that exist to hold links — PBNs, link farms, AI content mills — don't get matched.",
  },
  {
    keyword: "same niche or nothing",
    body: "Your site is only shared with members in your B2B niche. An off-topic link helps no one's SEO.",
  },
  {
    keyword: "one for one",
    body: "Every exchange is reciprocal: one relevant link each, out in the open.",
  },
]

function AnchorSnippet({ label, domain }: { label: string; domain: string }) {
  return (
    <div className="min-w-0">
      <div className="text-muted-foreground mb-2 text-[0.7rem] tracking-widest uppercase">
        {label}
      </div>
      <code className="text-muted-foreground block truncate text-sm sm:text-base">
        {'<a href="'}
        <span className="text-foreground font-semibold">{domain}</span>
        {'">'}
      </code>
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          backlinks<span className="text-primary">.</span>exchange
        </Link>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<Link href="/submit" />}
        >
          Submit your site
        </Button>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-20 pb-24 sm:pt-28">
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">
            {"// a free backlink exchange for b2b sites"}
          </p>
          <h1 className="font-heading mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl">
            Good backlinks are{" "}
            <span className="text-primary underline decoration-3 underline-offset-8">
              traded
            </span>
            , not bought.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
            Submit your site and every week we share it with other B2B sites
            in your niche. You agree on a swap — one link each, on your terms.
            No fees, no marketplace, no catch.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/submit" />}
            >
              Submit your site
              <IconArrowRight data-icon="inline-end" />
            </Button>
            <span className="text-muted-foreground font-mono text-xs">
              free forever
            </span>
          </div>

          {/* Signature: the anchor-tag exchange */}
          <div className="border-border mt-16 rounded-xl border font-mono">
            <div className="grid grid-cols-1 items-center gap-6 p-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-8 sm:p-8">
              <AnchorSnippet label="on their site" domain="yoursite.com" />
              <div
                aria-hidden
                className="text-primary text-center text-3xl sm:text-4xl"
              >
                ⇄
              </div>
              <AnchorSnippet label="on your site" domain="their-site.com" />
            </div>
            <div className="border-border text-muted-foreground flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t px-6 py-4 text-xs sm:px-8 sm:text-sm">
              <span>matching niches like</span>
              <ExchangeTicker />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-border border-t">
          <div className="mx-auto w-full max-w-5xl px-6 py-20">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {STEPS.map((step) => (
                <div key={step.number}>
                  <div className="text-primary font-mono text-sm">
                    {step.number}.
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* House rules */}
        <section className="border-border border-t">
          <div className="mx-auto w-full max-w-5xl px-6 py-20">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              House rules
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              An exchange is only worth joining if every link in it is worth
              having.
            </p>
            <ul className="border-border mt-10 divide-y">
              {RULES.map((rule) => (
                <li
                  key={rule.keyword}
                  className="grid gap-2 py-5 sm:grid-cols-[220px_1fr] sm:gap-8"
                >
                  <span className="text-foreground font-mono text-sm">
                    {rule.keyword}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {rule.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-border border-t">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 py-20">
            <h2 className="font-heading max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Your next backlink is a trade away.
            </h2>
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/submit" />}
            >
              Submit your site
              <IconArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-8 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 backlinks.exchange</span>
          <span>
            built by the team behind{" "}
            <a
              href="https://mentiohunt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              Mentiohunt
            </a>{" "}
            — backlink acquisition on autopilot
          </span>
        </div>
      </footer>
    </div>
  )
}

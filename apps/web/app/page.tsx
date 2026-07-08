import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { NicheCarousel } from "@/components/niche-carousel"
import {
  IllustrationDigest,
  IllustrationExchange,
  IllustrationSubmit,
} from "@/components/step-illustrations"

const STEPS = [
  {
    number: "1",
    title: "Submit your site",
    body: "Tell us your domain and the B2B niche you publish in. Your URL stays hidden — always — until both sides agree to collaborate.",
    illustration: <IllustrationSubmit />,
  },
  {
    number: "2",
    title: "Receive relevant sites in your niche",
    body: "Once a week, we send one email with sites matched to your B2B niche — described by niche and profile, URLs still hidden.",
    illustration: <IllustrationDigest />,
  },
  {
    number: "3",
    title: "Both agree, URLs revealed",
    body: "Once both parties agree to the exchange, URLs are revealed and you talk directly — how and where each link lands is 100% up to you.",
    illustration: <IllustrationExchange />,
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

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          exchange<span className="text-primary">-</span>backlinks.com
        </Link>
        <Button
          size="sm"
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

          {/* Signature: members per niche, double marquee */}
          <div className="mt-16">
            <NicheCarousel />
          </div>
        </section>

        {/* How it works */}
        <section className="border-border border-t">
          <div className="mx-auto w-full max-w-5xl px-6 py-20">
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <div className="divide-border mt-6 divide-y">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="grid items-center gap-6 py-10 sm:grid-cols-[240px_1fr] sm:gap-12"
                >
                  <div className="border-border bg-muted/30 rounded-xl border px-6 py-5">
                    {step.illustration}
                  </div>
                  <div>
                    <div className="text-primary font-mono text-sm">
                      {step.number}.
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground border-border border-t pt-6 font-mono text-xs">
              {"// same functionality as Help a B2B Writer / HARO"}
            </p>
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
          <span>© 2026 exchange-backlinks.com</span>
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

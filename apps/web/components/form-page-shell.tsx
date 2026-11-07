import { cn } from "@workspace/ui/lib/utils"
import { Eyebrow } from "@/components/section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

/**
 * Layout for the signup / account flows (/submit, /submit-website,
 * /unsubscribe). Mirrors Mentiohunt's signup: the form on a white column,
 * and — when `aside` is given — a warm-grey panel with supporting context.
 */
export function FormPageShell({
  children,
  aside,
  width = "md",
}: {
  children: React.ReactNode
  aside?: React.ReactNode
  /** Max width of the form column content. */
  width?: "md" | "xl"
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader cta={false} />
      <main
        className={cn(
          "grid flex-1",
          aside && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
        )}
      >
        <div className="relative flex flex-col justify-center px-4 pt-[120px] pb-16 sm:px-6 lg:pb-24">
          <div
            className={cn(
              "mx-auto w-full",
              width === "md" ? "max-w-md" : "max-w-xl",
              !aside && "max-w-xl"
            )}
          >
            {children}
          </div>
        </div>
        {aside && (
          <aside className="relative hidden overflow-hidden border-l border-hairline bg-surface lg:flex lg:flex-col lg:justify-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--dot-grid)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_20%,transparent_100%)] bg-[size:20px_20px]"
            />
            <div className="relative mx-auto w-full max-w-md px-10 pt-[120px] pb-24">
              {aside}
            </div>
          </aside>
        )}
      </main>
      <SiteFooter cta={false} />
    </div>
  )
}

/** Eyebrow + h1 + lead paragraph for form pages. */
export function FormPageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: React.ReactNode
  title: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-heading text-[34px] leading-[1.08] font-bold tracking-[-0.025em] text-balance text-ink sm:text-[42px]">
        {title}
      </h1>
      {children && (
        <p className="text-[17px] leading-[27px] text-pretty text-ink-secondary">
          {children}
        </p>
      )}
    </div>
  )
}

/** Inline notice box (errors, expired links). */
export function Notice({
  children,
  tone = "error",
  className,
}: {
  children: React.ReactNode
  tone?: "error" | "info"
  className?: string
}) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "rounded-lg border px-3.5 py-2.5 text-sm leading-6",
        tone === "error"
          ? "border-destructive/30 bg-destructive/5 text-destructive"
          : "border-brand-border bg-brand-tint text-ink",
        className
      )}
    >
      {children}
    </p>
  )
}

/** Numbered "what happens next" list used in form-page asides. */
export function StepList({
  steps,
}: {
  steps: { title: string; body: string }[]
}) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={cn(
            "flex gap-4 py-4",
            i < steps.length - 1 && "border-b border-border"
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm font-bold text-brand-strong tabular-nums shadow-card">
            {i + 1}
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold text-ink">
              {step.title}
            </span>
            <span className="text-sm leading-6 text-ink-secondary">
              {step.body}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}

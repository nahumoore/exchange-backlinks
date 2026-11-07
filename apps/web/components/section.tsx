import { cn } from "@workspace/ui/lib/utils"

/** Small "● label" kicker above section headings (Mentiohunt pattern). */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[13px] font-medium text-ink-muted",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
      {children}
    </span>
  )
}

/** Eyebrow + large Figtree heading + lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "left",
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  id?: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-3.5",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className="font-heading text-[32px] leading-[1.1] font-bold tracking-[-0.025em] text-balance text-ink sm:text-[40px] lg:text-[48px]"
      >
        {title}
      </h2>
      {description && (
        <p className="text-[17px] leading-[27px] text-pretty text-ink-secondary">
          {description}
        </p>
      )}
    </div>
  )
}

/** Dotted grid + soft orange glow used behind hero areas. */
export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-[1100px] overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(var(--dot-grid)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_30%,transparent_100%)] bg-[size:20px_20px] bg-[position:center_top]" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(255,90,31,0.07),transparent_70%)]" />
    </div>
  )
}

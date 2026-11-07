import { cn } from "@workspace/ui/lib/utils"
import { NICHES } from "@/lib/niches"

const HALF = Math.ceil(NICHES.length / 2)
const ROWS = [NICHES.slice(0, HALF), NICHES.slice(HALF)]

function NicheChip({
  name,
  members,
  hidden,
}: {
  name: string
  members: number
  hidden?: boolean
}) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className="mr-3 flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm whitespace-nowrap shadow-card"
    >
      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
      <span className="font-medium text-ink">{name}</span>
      <span className="text-ink-muted tabular-nums">{members} sites</span>
    </li>
  )
}

export function NicheCarousel() {
  return (
    <div className="flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] py-1">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="overflow-hidden">
          <ul
            className={cn(
              "flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none",
              rowIndex === 0 ? "animate-marquee-left" : "animate-marquee-right"
            )}
          >
            {[...row, ...row].map((niche, i) => (
              <NicheChip
                key={i}
                name={niche.name}
                members={niche.members}
                hidden={i >= row.length}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

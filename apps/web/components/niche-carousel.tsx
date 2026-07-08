import { cn } from "@workspace/ui/lib/utils"
import { NICHES } from "@/lib/niches"

const ROWS = [NICHES.slice(0, 8), NICHES.slice(8)]

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
      className="mr-3 flex shrink-0 items-baseline gap-2 rounded-full border border-border px-4 py-2 font-mono text-xs whitespace-nowrap sm:text-sm"
    >
      <span className="text-foreground">{name}</span>
      <span className="text-primary">{members} websites</span>
    </li>
  )
}

export function NicheCarousel() {
  return (
    <div className="flex flex-col gap-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
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

import { cn } from "@workspace/ui/lib/utils"

const ROWS: Array<Array<{ name: string; members: number }>> = [
  [
    { name: "cloud security", members: 61 },
    { name: "devops tooling", members: 54 },
    { name: "hr tech", members: 47 },
    { name: "payroll software", members: 33 },
    { name: "sales enablement", members: 58 },
    { name: "revops", members: 41 },
    { name: "api monitoring", members: 26 },
    { name: "product analytics", members: 68 },
  ],
  [
    { name: "observability", members: 45 },
    { name: "email deliverability", members: 38 },
    { name: "cold outreach", members: 52 },
    { name: "legal tech", members: 29 },
    { name: "compliance", members: 36 },
    { name: "fintech infrastructure", members: 64 },
    { name: "customer success", members: 49 },
    { name: "web scraping", members: 23 },
  ],
]

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

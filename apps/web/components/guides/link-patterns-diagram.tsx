/**
 * Original diagram of the three link patterns (one-way, reciprocal, 3-way).
 * Inline SVG on the design tokens so it follows light/dark mode. Each panel
 * is its own small SVG so the labels stay readable when they stack on phones.
 */

const NODE_W = 64
const NODE_H = 40

function Node({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={10}
        className="fill-card stroke-border"
        strokeWidth={1.5}
      />
      <text
        x={x + NODE_W / 2}
        y={y + NODE_H / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[13px] font-semibold"
      >
        {label}
      </text>
    </g>
  )
}

function Arrow({
  id,
  x1,
  y1,
  x2,
  y2,
}: {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className="stroke-brand"
      strokeWidth={2}
      markerEnd={`url(#${id})`}
    />
  )
}

function ArrowHead({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX={9}
        refY={5}
        markerWidth={7}
        markerHeight={7}
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" className="fill-brand" />
      </marker>
    </defs>
  )
}

const PANELS = [
  {
    key: "one-way",
    title: "One-way link",
    body: "A links to B. Nothing comes back. The cleanest signal there is.",
    svg: (
      <svg viewBox="0 0 220 110" role="img" aria-labelledby="lp-one-way">
        <title id="lp-one-way">Site A links to site B</title>
        <ArrowHead id="lp-ah-1" />
        <Node x={24} y={35} label="Site A" />
        <Node x={132} y={35} label="Site B" />
        <Arrow id="lp-ah-1" x1={90} y1={55} x2={129} y2={55} />
      </svg>
    ),
  },
  {
    key: "reciprocal",
    title: "Reciprocal link",
    body: "A links to B and B links back. Normal, unless a deal is the only reason.",
    svg: (
      <svg viewBox="0 0 220 110" role="img" aria-labelledby="lp-reciprocal">
        <title id="lp-reciprocal">Site A and site B link to each other</title>
        <ArrowHead id="lp-ah-2" />
        <Node x={24} y={35} label="Site A" />
        <Node x={132} y={35} label="Site B" />
        <Arrow id="lp-ah-2" x1={90} y1={47} x2={129} y2={47} />
        <Arrow id="lp-ah-2" x1={130} y1={63} x2={91} y2={63} />
      </svg>
    ),
  },
  {
    key: "three-way",
    title: "Three-way (ABC) exchange",
    body: "B links to A; A pays it back with a link to C, a site B also owns. Still a swap.",
    svg: (
      <svg viewBox="0 0 220 180" role="img" aria-labelledby="lp-three-way">
        <title id="lp-three-way">
          Site B links to site A, and site A links to site C, which has the same
          owner as site B
        </title>
        <ArrowHead id="lp-ah-3" />
        <rect
          x={120}
          y={14}
          width={88}
          height={140}
          rx={14}
          className="fill-brand-tint stroke-brand-border"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text
          x={164}
          y={170}
          textAnchor="middle"
          className="fill-ink-muted text-[11px] font-medium"
        >
          same owner
        </text>
        <Node x={24} y={24} label="Site A" />
        <Node x={132} y={24} label="Site B" />
        <Node x={132} y={104} label="Site C" />
        <Arrow id="lp-ah-3" x1={130} y1={44} x2={91} y2={44} />
        <Arrow id="lp-ah-3" x1={74} y1={66} x2={129} y2={118} />
      </svg>
    ),
  },
]

export function LinkPatternsDiagram() {
  return (
    <figure className="my-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {PANELS.map((panel) => (
          <div
            key={panel.key}
            className="flex flex-col rounded-xl border border-border bg-surface p-4 shadow-card"
          >
            <div className="flex flex-1 items-center">
              <div className="mx-auto w-full max-w-[260px]">{panel.svg}</div>
            </div>
            <p className="mt-1 font-heading text-[15px] font-bold text-ink">
              {panel.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink-secondary">
              {panel.body}
            </p>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-ink-muted">
        The three link patterns. Only the intent behind the second and third
        decides whether they are a problem.
      </figcaption>
    </figure>
  )
}

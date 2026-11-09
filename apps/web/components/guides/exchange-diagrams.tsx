import { IconCornerDownRight } from "@tabler/icons-react"

import {
  Arrow,
  ArrowHead,
  Node,
} from "@/components/guides/link-patterns-diagram"

/**
 * Original diagrams for /guides/link-exchange-seo: the kinds of link
 * exchange with their risk, and the safe exchange process. Inline SVG/HTML
 * on the design tokens so they follow light/dark mode.
 */

type Risk = "low" | "medium" | "high"

const RISK_STYLES: Record<Risk, { label: string; className: string }> = {
  low: {
    label: "Low risk",
    className: "border-success/30 bg-success/10 text-success",
  },
  medium: {
    label: "Medium risk",
    className: "border-brand-border bg-brand-tint text-brand-strong",
  },
  high: {
    label: "High risk",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
}

function RiskTag({ risk }: { risk: Risk }) {
  const style = RISK_STYLES[risk]
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.className}`}
    >
      {style.label}
    </span>
  )
}

/** Small round node for the hub and ring diagrams. */
function Dot({ cx, cy, label }: { cx: number; cy: number; label?: string }) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={label ? 14 : 9}
        className="fill-card stroke-border"
        strokeWidth={1.5}
      />
      {label && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-ink text-[11px] font-semibold"
        >
          {label}
        </text>
      )}
    </g>
  )
}

/** Arrow from (x1, y1) toward (x2, y2), trimmed at both ends. */
function TrimmedArrow({
  id,
  x1,
  y1,
  x2,
  y2,
  trimStart,
  trimEnd,
}: {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  trimStart: number
  trimEnd: number
}) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  return (
    <Arrow
      id={id}
      x1={x1 + ux * trimStart}
      y1={y1 + uy * trimStart}
      x2={x2 - ux * trimEnd}
      y2={y2 - uy * trimEnd}
    />
  )
}

const HUB = { x: 110, y: 75 }
const HUB_SPOKES = [
  [24, 22],
  [110, 14],
  [196, 22],
  [24, 128],
  [110, 136],
  [196, 128],
] as const

const RING = Array.from({ length: 5 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5
  return {
    x: 110 + Math.cos(angle) * 58,
    y: 78 + Math.sin(angle) * 58,
    label: String.fromCharCode(65 + i),
  }
})

const TYPE_PANELS: {
  key: string
  title: string
  body: string
  risk: Risk
  svg: React.ReactNode
}[] = [
  {
    key: "direct",
    title: "Direct swap",
    body: "A links to B because B links to A. Fine now and then between relevant sites; a problem as a habit.",
    risk: "low",
    svg: (
      <svg viewBox="0 0 220 150" role="img" aria-labelledby="ex-direct">
        <title id="ex-direct">Site A and site B link to each other</title>
        <ArrowHead id="ex-ah-1" />
        <Node x={24} y={55} label="Site A" />
        <Node x={132} y={55} label="Site B" />
        <Arrow id="ex-ah-1" x1={90} y1={67} x2={129} y2={67} />
        <Arrow id="ex-ah-1" x1={130} y1={83} x2={91} y2={83} />
      </svg>
    ),
  },
  {
    key: "guest-post",
    title: "Guest post swap",
    body: "Each side writes an article for the other, with a link back to the author's site. Only as good as the posts.",
    risk: "medium",
    svg: (
      <svg viewBox="0 0 220 150" role="img" aria-labelledby="ex-guest">
        <title id="ex-guest">
          Site A hosts a post written by site B that links to B, and site B
          hosts a post by site A that links to A
        </title>
        <ArrowHead id="ex-ah-2" />
        {[
          { x: 10, label: "Site A", chip: "B's post" },
          { x: 126, label: "Site B", chip: "A's post" },
        ].map((site) => (
          <g key={site.label}>
            <rect
              x={site.x}
              y={28}
              width={84}
              height={92}
              rx={12}
              className="fill-card stroke-border"
              strokeWidth={1.5}
            />
            <text
              x={site.x + 42}
              y={48}
              textAnchor="middle"
              className="fill-ink text-[13px] font-semibold"
            >
              {site.label}
            </text>
            <rect
              x={site.x + 10}
              y={74}
              width={64}
              height={30}
              rx={7}
              className="fill-brand-tint stroke-brand-border"
              strokeWidth={1.2}
            />
            <text
              x={site.x + 42}
              y={89}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-brand-strong text-[11px] font-semibold"
            >
              {site.chip}
            </text>
          </g>
        ))}
        <Arrow id="ex-ah-2" x1={84} y1={80} x2={125} y2={50} />
        <Arrow id="ex-ah-2" x1={136} y1={80} x2={95} y2={50} />
      </svg>
    ),
  },
  {
    key: "partner-page",
    title: "Partner or links page",
    body: "A page that exists to hold swapped links. Google's spam policy names it explicitly.",
    risk: "high",
    svg: (
      <svg viewBox="0 0 220 150" role="img" aria-labelledby="ex-hub">
        <title id="ex-hub">
          One links page pointing to six unrelated sites
        </title>
        <ArrowHead id="ex-ah-3" />
        {HUB_SPOKES.map(([x, y]) => (
          <TrimmedArrow
            key={`${x}-${y}`}
            id="ex-ah-3"
            x1={HUB.x}
            y1={HUB.y}
            x2={x}
            y2={y}
            trimStart={0}
            trimEnd={11}
          />
        ))}
        <rect
          x={HUB.x - 44}
          y={HUB.y - 20}
          width={88}
          height={40}
          rx={10}
          className="fill-card stroke-border"
          strokeWidth={1.5}
        />
        <text
          x={HUB.x}
          y={HUB.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-ink text-[13px] font-semibold"
        >
          Links page
        </text>
        {HUB_SPOKES.map(([x, y]) => (
          <Dot key={`dot-${x}-${y}`} cx={x} cy={y} />
        ))}
      </svg>
    ),
  },
  {
    key: "network",
    title: "Credit network or loop",
    body: "Sites in a pool pass links around for credits, so nobody swaps directly. The pattern link spam systems look for.",
    risk: "high",
    svg: (
      <svg viewBox="0 0 220 150" role="img" aria-labelledby="ex-ring">
        <title id="ex-ring">
          Five sites linking to each other in a loop, managed through a credit
          pool
        </title>
        <ArrowHead id="ex-ah-4" />
        {RING.map((node, i) => {
          const next = RING[(i + 1) % RING.length]!
          return (
            <TrimmedArrow
              key={node.label}
              id="ex-ah-4"
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              trimStart={16}
              trimEnd={17}
            />
          )
        })}
        {RING.map((node) => (
          <Dot
            key={`n-${node.label}`}
            cx={node.x}
            cy={node.y}
            label={node.label}
          />
        ))}
        <text
          x={110}
          y={80}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-ink-muted text-[11px] font-medium"
        >
          credit pool
        </text>
      </svg>
    ),
  },
]

export function ExchangeTypesDiagram() {
  return (
    <figure className="my-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {TYPE_PANELS.map((panel) => (
          <div
            key={panel.key}
            className="flex flex-col rounded-xl border border-border bg-surface p-4 shadow-card"
          >
            <div className="mx-auto w-full max-w-[260px]">{panel.svg}</div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="font-heading text-[15px] font-bold text-ink">
                {panel.title}
              </p>
              <RiskTag risk={panel.risk} />
            </div>
            <p className="mt-1.5 text-sm leading-6 text-ink-secondary">
              {panel.body}
            </p>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-ink-muted">
        Four shapes a link exchange can take. The risk grows as the links get
        less editorial and the deal gets harder to see.
      </figcaption>
    </figure>
  )
}

const STEPS = [
  { title: "Offer", detail: "A page of yours worth citing" },
  { title: "Find", detail: "Same-niche sites, similar audience" },
  { title: "Vet", detail: "Real business, real traffic" },
  { title: "Propose", detail: "One specific placement" },
  { title: "Place", detail: "In body copy, where it helps" },
  { title: "Track", detail: "Live, followed, indexed" },
]

export function ExchangeProcessDiagram() {
  return (
    <figure className="my-8 rounded-xl border border-border bg-surface p-5 shadow-card">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex flex-col rounded-lg border border-border bg-card p-3"
          >
            <span className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-tint font-heading text-xs font-bold text-brand-strong">
                {i + 1}
              </span>
              <span className="font-heading text-[15px] font-bold text-ink">
                {step.title}
              </span>
            </span>
            <span className="mt-1.5 text-[13px] leading-5 text-ink-secondary">
              {step.detail}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="flex gap-2 rounded-lg border border-brand-border bg-brand-tint p-3 text-[13px] leading-5 text-ink-secondary">
          <IconCornerDownRight
            className="mt-0.5 size-4 shrink-0 text-brand-strong"
            aria-hidden="true"
          />
          <span>
            <span className="font-semibold text-ink">
              Anything conditional or paid?
            </span>{" "}
            Qualify the link with{" "}
            <code className="font-mono text-[12px] text-ink">
              rel=&quot;nofollow&quot;
            </code>{" "}
            or{" "}
            <code className="font-mono text-[12px] text-ink">
              rel=&quot;sponsored&quot;
            </code>
            .
          </span>
        </p>
        <p className="flex gap-2 rounded-lg border border-brand-border bg-brand-tint p-3 text-[13px] leading-5 text-ink-secondary">
          <IconCornerDownRight
            className="mt-0.5 size-4 shrink-0 text-brand-strong"
            aria-hidden="true"
          />
          <span>
            <span className="font-semibold text-ink">Link removed later?</span>{" "}
            Ask once, then decide if your link still helps your readers.
          </span>
        </p>
      </div>
      <figcaption className="mt-4 text-sm leading-6 text-ink-muted">
        The safe link exchange process. Steps 1 to 3 decide whether an exchange
        is worth doing at all.
      </figcaption>
    </figure>
  )
}

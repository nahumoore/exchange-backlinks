"use client"

import { useEffect, useState } from "react"

const PAIRS: Array<[string, string]> = [
  ["cloud security", "devops tooling"],
  ["payroll software", "hr tech"],
  ["sales enablement", "revops"],
  ["api monitoring", "observability"],
  ["email deliverability", "cold outreach"],
  ["legal tech", "compliance"],
]

export function ExchangeTicker() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PAIRS.length)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  const [left, right] = PAIRS[index] ?? PAIRS[0]!

  return (
    <span
      key={index}
      className="animate-in fade-in inline-flex items-baseline gap-2 duration-700"
    >
      <span className="text-foreground">{left}</span>
      <span aria-hidden className="text-primary">
        ⇄
      </span>
      <span className="text-foreground">{right}</span>
    </span>
  )
}

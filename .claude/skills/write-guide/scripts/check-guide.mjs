/**
 * Render check for a guide against a running dev server.
 *
 *   (repo/apps/web) pnpm exec next dev -p 3123      # in the background
 *   (scratch dir with playwright installed)
 *   node <repo>/.claude/skills/write-guide/scripts/check-guide.mjs <slug> [outDir] [baseUrl]
 *
 * Reports HTTP status, article word count, horizontal overflow at 390px
 * and 1280px, console errors, broken in-page / sibling-guide anchors, and
 * saves a screenshot of every <figure> (diagrams, screenshots, videos) to
 * outDir so you can eyeball them.
 */
import { createRequire } from "node:module"
import { readFileSync, mkdirSync } from "node:fs"
import { pathToFileURL } from "node:url"

const require = createRequire(pathToFileURL(`${process.cwd()}/`))
const { chromium } = require("playwright")

const slug = process.argv[2]
if (!slug) throw new Error("usage: check-guide.mjs <slug> [outDir] [baseUrl]")
const outDir = process.argv[3] ?? `${process.cwd()}/check-${slug}`
const base = process.argv[4] ?? "http://localhost:3123"
mkdirSync(outDir, { recursive: true })

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => {
  try {
    readFileSync(p, { flag: "r" })
    return true
  } catch {
    return false
  }
})
const browser = await chromium.launch(
  CHROME ? { executablePath: CHROME } : undefined
)

for (const width of [1280, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
  const res = await page.goto(`${base}/guides/${slug}`, {
    waitUntil: "networkidle",
    timeout: 120000,
  })
  const report = await page.evaluate(() => ({
    words: document.querySelector("article")?.innerText.split(/\s+/).length,
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    anchors: [...document.querySelectorAll("article a[href*='#']")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h.startsWith("/") || h.startsWith("#")),
    figures: document.querySelectorAll("article figure").length,
  }))
  console.log(
    `[${width}px] status ${res.status()} · words ${report.words} · figures ${report.figures} · overflow ${report.overflow}`
  )
  if (errors.length)
    console.log(`[${width}px] console errors:`, errors.slice(0, 5))

  if (width === 1280) {
    // Check every #anchor link resolves on its target page.
    const cache = new Map()
    for (const href of new Set(report.anchors)) {
      const [path, id] = href.split("#")
      const target = path || `/guides/${slug}`
      if (!cache.has(target)) {
        const r = await fetch(`${base}${target}`)
        cache.set(target, { status: r.status, html: await r.text() })
      }
      const { status, html } = cache.get(target)
      const ok = status === 200 && html.includes(`id="${id}"`)
      console.log(
        `  anchor ${ok ? "ok     " : "BROKEN "} ${href}${status === 200 ? "" : ` (HTTP ${status})`}`
      )
    }
  }

  const figures = page.locator("article figure")
  const count = await figures.count()
  for (let i = 0; i < count; i++) {
    const fig = figures.nth(i)
    await fig.scrollIntoViewIfNeeded()
    await fig.screenshot({ path: `${outDir}/figure-${i + 1}-${width}.png` })
  }
  await page.close()
}

console.log(`figure screenshots: ${outDir}`)
await browser.close()

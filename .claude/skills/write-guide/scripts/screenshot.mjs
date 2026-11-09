/**
 * Screenshot primary sources (e.g. Google docs) for a guide: 2x capture,
 * highlighted paragraphs, cropped, saved as WebP.
 *
 * Run from a directory where `playwright` and `sharp` are installed
 * (modules resolve from the current working directory):
 *   npm i playwright@1.49.1 sharp@0.33.5
 *   node <repo>/.claude/skills/write-guide/scripts/screenshot.mjs shots.json
 *
 * shots.json:
 * {
 *   "outDir": "C:/.../apps/web/public/guides/<slug>",
 *   "shots": [
 *     {
 *       "url": "https://developers.google.com/search/blog/...",
 *       "file": "some-name.webp",
 *       "top": "h1",                        // crop starts at this element
 *       "bottom": ".devsite-article-body",  // ...and ends at this one (default: top)
 *       "highlight": ["phrase inside a <p> or <li> to highlight"],
 *       "hideCss": "devsite-snackbar,devsite-toc{display:none!important}",
 *       "click": "a.zippy.index7",          // optional: open an accordion first
 *       "trim": { "top": 0, "bottom": 0 },  // optional: px to cut after capture (2x px)
 *       "width": 900,                       // viewport width (default 900)
 *       "probe": false                      // true: only list headings/containers
 *     }
 *   ]
 * }
 *
 * Prints "<file> <width> <height>" so you can put the real pixel size in
 * <Figure width height>. Always Read the resulting image and adjust.
 */
import { createRequire } from "node:module"
import { readFileSync } from "node:fs"
import { pathToFileURL } from "node:url"

const require = createRequire(pathToFileURL(`${process.cwd()}/`))
const { chromium } = require("playwright")
const sharp = require("sharp")
sharp.cache(false) // avoid Windows file locks when overwriting

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

const config = JSON.parse(readFileSync(process.argv[2], "utf8"))
const browser = await chromium.launch(
  CHROME ? { executablePath: CHROME } : undefined
)

// Wrap the whole paragraph or list item containing each phrase in a
// highlighter mark. Whole blocks, because links split text nodes.
const highlight = (phrases) => {
  for (const phrase of phrases) {
    const blocks = [...document.querySelectorAll("p, li")].filter((el) =>
      el.textContent.replace(/\s+/g, " ").includes(phrase)
    )
    const el = blocks[blocks.length - 1]
    if (!el) {
      console.warn(`highlight not found: ${phrase}`)
      continue
    }
    const mark = document.createElement("mark")
    mark.style.cssText =
      "background:#ffe08a;color:inherit;padding:2px 0;box-decoration-break:clone;-webkit-box-decoration-break:clone"
    while (el.firstChild) mark.appendChild(el.firstChild)
    el.appendChild(mark)
  }
}

for (const shot of config.shots) {
  const page = await browser.newPage({
    viewport: { width: shot.width ?? 900, height: 1200 },
    deviceScaleFactor: 2,
  })
  await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 60000 })
  await page.waitForTimeout(4000)

  if (shot.probe) {
    const list = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          "h1,h2,h3,article,main,[class*=article],[class*=zippy],[class*=accordion]"
        ),
      ]
        .slice(0, 80)
        .map(
          (el) =>
            `${el.tagName}.${String(el.className).slice(0, 50)} :: ${el.textContent
              .trim()
              .replace(/\s+/g, " ")
              .slice(0, 70)}`
        )
        .join("\n")
    )
    console.log(`--- ${shot.url}\n${list}`)
    await page.close()
    continue
  }

  if (shot.hideCss) await page.addStyleTag({ content: shot.hideCss })
  if (shot.click) {
    await page.locator(shot.click).first().click()
    await page.waitForTimeout(800)
  }
  await page.evaluate(highlight, shot.highlight ?? [])
  await page.waitForTimeout(500)

  // Page coordinates (not viewport), so clicks that scroll don't break it.
  const pageBox = (sel) =>
    page
      .locator(sel)
      .first()
      .evaluate((el) => {
        const r = el.getBoundingClientRect()
        return {
          x: r.x + scrollX,
          y: r.y + scrollY,
          width: r.width,
          height: r.height,
        }
      })
  const a = await pageBox(shot.top)
  const b = await pageBox(shot.bottom ?? shot.top)
  const pad = 24
  const x = Math.max(0, Math.min(a.x, b.x) - pad)
  const right = Math.max(a.x + a.width, b.x + b.width) + pad
  const png = await page.screenshot({
    clip: {
      x,
      y: Math.max(0, a.y - pad),
      width: right - x,
      height: b.y + b.height - a.y + pad * 2,
    },
    fullPage: true,
  })

  let img = sharp(png)
  const meta = await img.metadata()
  const trimTop = shot.trim?.top ?? 0
  const trimBottom = shot.trim?.bottom ?? 0
  const height = meta.height - trimTop - trimBottom
  if (trimTop || trimBottom) {
    img = img.extract({ left: 0, top: trimTop, width: meta.width, height })
  }
  await img.webp({ quality: 82 }).toFile(`${config.outDir}/${shot.file}`)
  console.log(shot.file, meta.width, height)
  await page.close()
}

await browser.close()

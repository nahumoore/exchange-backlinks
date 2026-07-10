// Zero-dependency homepage scraper. Uses plain fetch + regex instead of an
// HTML parser lib (no cheerio/HTMLRewriter) so this behaves identically in
// `next dev` (Node) and in production (Cloudflare Workers via OpenNext).

export class SiteUnreachableError extends Error {
  constructor(domain: string, cause?: unknown) {
    super(`Could not reach https://${domain}`)
    this.name = "SiteUnreachableError"
    this.cause = cause
  }
}

export type ScrapedContent = {
  title: string | null
  metaDescription: string | null
  headings: string[]
  /** Plain-text sample of the body, tags stripped, truncated for the LLM prompt. */
  textSample: string
}

const MAX_HEADINGS = 6
const MAX_TEXT_SAMPLE = 3000

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
}

function extractTitle(html: string) {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)
  return match ? decodeEntities(match[1]!).trim() || null : null
}

function extractMetaContent(html: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = pattern.exec(html)
    if (match?.[1]) return decodeEntities(match[1]).trim()
  }
  return null
}

function extractHeadings(html: string) {
  const headings: string[] = []
  const pattern = /<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi
  let match: RegExpExecArray | null
  while ((match = pattern.exec(html)) && headings.length < MAX_HEADINGS) {
    const text = decodeEntities(match[1]!.replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim()
    if (text) headings.push(text)
  }
  return headings
}

function extractTextSample(html: string) {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
  const text = decodeEntities(withoutNoise.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
  return text.slice(0, MAX_TEXT_SAMPLE)
}

/** Fetches and lightly parses a domain's homepage for LLM-description input. */
export async function scrapeSite(domain: string): Promise<ScrapedContent> {
  let res: Response
  try {
    res = await fetch(`https://${domain}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; ExchangeBacklinksBot/1.0; +https://exchange-backlinks.com)",
        accept: "text/html,application/xhtml+xml",
      },
    })
  } catch (error) {
    throw new SiteUnreachableError(domain, error)
  }

  if (!res.ok) throw new SiteUnreachableError(domain)

  const contentType = res.headers.get("content-type") ?? ""
  if (!contentType.includes("html")) throw new SiteUnreachableError(domain)

  const html = await res.text()

  return {
    title: extractTitle(html),
    metaDescription: extractMetaContent(html, [
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
      /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i,
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i,
      /<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/i,
    ]),
    headings: extractHeadings(html),
    textSample: extractTextSample(html),
  }
}

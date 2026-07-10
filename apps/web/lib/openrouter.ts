import type { ScrapedContent } from "@/lib/scrape"

// Plain fetch against OpenRouter's chat completions endpoint rather than
// @openrouter/sdk — the SDK's streaming example relies on Node's
// process.stdout, which isn't available on Cloudflare Workers (this app
// deploys via OpenNext). A single non-streaming request does the same job
// with zero extra dependency/bundling risk.
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
const MODEL = "openrouter/free"

const FALLBACK_DESCRIPTION =
  "A B2B site publishing content for practitioners in its niche — a fit for exchanging backlinks with adjacent B2B sites."

function buildPrompt(scraped: ScrapedContent, domain: string, brand: string) {
  const facts = [
    scraped.title && `Page title: ${scraped.title}`,
    scraped.metaDescription && `Meta description: ${scraped.metaDescription}`,
    scraped.headings.length && `Headings: ${scraped.headings.join(" | ")}`,
    scraped.textSample && `Homepage text sample: ${scraped.textSample}`,
  ]
    .filter(Boolean)
    .join("\n")

  return `You are writing a short, anonymous description of a website for a backlink-exchange directory. Other members will read this description to decide whether the site is a good fit for a backlink swap — they must NOT be able to identify or guess the site.

Homepage content:
${facts || "(no content could be extracted — write a generic but plausible description based on the domain's likely niche.)"}

Write 1-2 sentences (max ~40 words) describing: the site's niche/topic, who it's for, and why it'd make a good backlink partner for an adjacent B2B site. Sound specific and genuine, not generic filler.

Strict rules:
- Never write the brand/company name ("${brand}"), the domain ("${domain}"), or any other proper noun that would let a reader identify or search for this exact site.
- Do not use quotation marks around the site name or refer to "this website" by name.
- Output ONLY the description text, nothing else (no preamble, no quotes).`
}

/** Case-insensitively strips the domain and brand token from generated text. */
function scrubIdentity(text: string, domain: string, brand: string) {
  let scrubbed = text
  for (const needle of [domain, brand]) {
    if (!needle || needle.length < 3) continue
    scrubbed = scrubbed.replace(new RegExp(needle, "gi"), "this site")
  }
  return scrubbed.replace(/\s+/g, " ").trim()
}

/**
 * Generates a short, identity-scrubbed site description from scraped
 * homepage content. Falls back to the scraped meta description (also
 * scrubbed) or a generic sentence if the model call fails — description is
 * required (NOT NULL) downstream, so this must never throw.
 */
export async function generateSiteDescription(
  scraped: ScrapedContent,
  domain: string
): Promise<string> {
  const brand = domain.split(".")[0] ?? domain
  const fallback = scrubIdentity(
    scraped.metaDescription || FALLBACK_DESCRIPTION,
    domain,
    brand
  )

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error("openrouter: missing OPENROUTER_API_KEY env variable")
    return fallback
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "user", content: buildPrompt(scraped, domain, brand) },
        ],
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(20000),
    })

    if (!res.ok) {
      console.error(`openrouter: request failed with status ${res.status}`)
      return fallback
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = body.choices?.[0]?.message?.content?.trim()
    if (!content) {
      console.error("openrouter: empty completion", body)
      return fallback
    }

    const scrubbed = scrubIdentity(content, domain, brand)
    return scrubbed || fallback
  } catch (error) {
    console.error("openrouter: request errored", error)
    return fallback
  }
}

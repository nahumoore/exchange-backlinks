import PostalMime from "postal-mime"

// CRON_SECRET is a dashboard Secret (wrangler secret put), so it's not in
// wrangler.jsonc `vars` and isn't picked up by the generated CloudflareEnv —
// this merges it in. APP_URL comes from the generated interface.
declare global {
  interface CloudflareEnv {
    CRON_SECRET: string
  }
}

// This Worker owns the two Cloudflare-native triggers the main
// OpenNext-built Worker can't expose (scheduled + inbound email) and does
// nothing else — all matching/relay/DB logic stays in the Next app.
export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runDigest(env))
  },

  async email(message, env, ctx) {
    ctx.waitUntil(relayInbound(message, env))
  },
} satisfies ExportedHandler<CloudflareEnv>

async function runDigest(env: CloudflareEnv) {
  try {
    const res = await fetch(`${env.APP_URL}/api/digest/run`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.CRON_SECRET}` },
    })
    if (!res.ok) {
      console.error(`digest/run failed: ${res.status} ${await res.text()}`)
    }
  } catch (error) {
    console.error("digest/run request errored", error)
  }
}

async function relayInbound(message: ForwardableEmailMessage, env: CloudflareEnv) {
  try {
    const buffer = await new Response(message.raw).arrayBuffer()
    const parsed = await PostalMime.parse(buffer)

    const res = await fetch(`${env.APP_URL}/api/relay/inbound`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CRON_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: message.to,
        from: message.from,
        subject: parsed.subject,
        text: parsed.text,
        html: parsed.html,
      }),
    })
    if (!res.ok) {
      console.error(`relay/inbound failed: ${res.status} ${await res.text()}`)
    }
  } catch (error) {
    // Never bounce a message just because our app is unreachable — the
    // sender would get a confusing delivery-failure notice.
    console.error("relay/inbound request errored", error)
  }
}

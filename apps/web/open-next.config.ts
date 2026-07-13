// Cloudflare adapter config — https://opennext.js.org/cloudflare
//
// All routes on this site are static (generateStaticParams, no revalidate),
// so the incremental cache only needs to read prerendered pages back out of
// the Workers static assets bundle — without this, statically generated
// dynamic routes (e.g. /alternatives/[slug]) 404 in production because
// there's no cache for Next to read the prerendered output from. If we ever
// add ISR/revalidation, switch to the R2 incremental cache per the docs.
import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache"

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
})

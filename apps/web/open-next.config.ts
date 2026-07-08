// Cloudflare adapter config — https://opennext.js.org/cloudflare
// Minimal setup: no incremental cache. If we later rely on ISR /
// revalidation, add the R2 incremental cache per the docs.
import { defineCloudflareConfig } from "@opennextjs/cloudflare"

export default defineCloudflareConfig()

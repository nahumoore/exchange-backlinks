import type { NextConfig } from "next"
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
}

const withMDX = createMDX({
  options: {
    // Plugin names as strings (not imported functions) — required for Turbopack.
    remarkPlugins: ["remark-gfm"],
  },
})

export default withMDX(nextConfig)

// Makes Cloudflare bindings available in `next dev`
initOpenNextCloudflareForDev()

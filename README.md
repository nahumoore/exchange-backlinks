# exchange-backlinks.com

**A 100% free backlink exchange for B2B sites.** Submit your site, and once a week we email you other members in your B2B niche who want to trade links. You agree on a swap — one link each, on your terms. No fees, no marketplace, no catch.

**Live site:** [exchange-backlinks.com](https://exchange-backlinks.com)

## How it works

1. **Submit your site** — tell us your domain and the B2B niche you publish in. Your URL stays hidden until both sides agree to collaborate.
2. **Receive relevant sites in your niche** — once a week, one email with sites matched to your B2B niche, described by niche and profile.
3. **Both agree, URLs revealed** — you talk directly and decide how and where each link lands. 100% up to you.

Think [Help a B2B Writer](https://helpab2bwriter.com) / HARO, but for niche-matched backlink exchanges instead of journalist–source matching.

### House rules

- **Real sites only** — PBNs, link farms, and AI content mills don't get matched.
- **Same niche or nothing** — your site is only shared with members in your B2B niche.
- **One for one** — every exchange is reciprocal: one relevant link each, out in the open.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React 19
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com)
- pnpm workspaces + [Turborepo](https://turborepo.com)
- Deployed to Cloudflare via [OpenNext](https://opennext.js.org/cloudflare)

## Repo layout

```
apps/web/               # the Next.js site
packages/ui/            # shared shadcn/ui components, hooks, global styles
packages/eslint-config/ # shared ESLint flat configs
packages/typescript-config/
```

## Local development

Requires Node ≥ 20 and pnpm 10.

```bash
pnpm install
pnpm dev        # start the dev server
pnpm build      # build all workspaces
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
```

### Adding UI components

Add shadcn/ui components from the repo root — they land in `packages/ui/src/components/`:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Import them from the workspace package:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Contributing

Issues and PRs are welcome. If you're proposing a product change (new pages, matching rules, email cadence), open an issue first so we can discuss it.

## Who's behind this

Built by the team behind [Mentiohunt](https://mentiohunt.com) — backlink acquisition on autopilot for B2B SaaS teams. The exchange is free forever; Mentiohunt is how we keep the lights on.

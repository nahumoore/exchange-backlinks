<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# exchange-backlinks.com

## What this is

A **100% free backlink exchange system** for SEOs, founders, and small marketing teams. Think "Help a B2B Writer" / HARO, but instead of journalist–source matching, it matches **sites in the same B2B niche** so they can exchange backlinks with each other.

This is an **open-source project**: https://github.com/nahumoore/exchange-backlinks (the site footer links to it with a "Star on GitHub" CTA).

**Business purpose:** this is a free lead magnet whose entire job is lead generation for [Mentiohunt](https://mentiohunt.com) — a paid SaaS ($49–99/mo) that puts backlink acquisition on autopilot for B2B SaaS teams (discovery, outreach, placement coordination). The exchange attracts the exact ICP (founder-led and lean B2B teams doing their own link building), then nudges them toward Mentiohunt.

Keep that framing in mind for every product/copy decision: free, low-friction, genuinely useful — with tasteful Mentiohunt attribution/CTAs, never paywalls.

## Product shape (v1)

- **`/` homepage** — simple landing page explaining the exchange; primary CTA redirects to `/submit`.
- **`/submit`** — signup form where users register their site to participate in exchanges.
- **Matching mechanic (decided):** once a member submits their site, we send **one weekly email** listing their site to other members in the same niche (and theirs to them). Members then discuss directly how and where each link gets swapped — **100% freedom**, no middleman, no rules on placement.
- Everything else (dashboards, member management) is TBD — ask the user before inventing scope.

## Backend (decided)

- **Database:** Supabase Postgres — schema in `supabase/schema.sql` (run manually in the SQL editor). RLS is enabled on every table with **no policies**; all access goes through the server-side secret key via `getSupabaseAdmin()` in `apps/web/lib/supabase/admin.ts`. No `@supabase/ssr`, no browser client, no proxy/middleware — there are no Supabase Auth sessions.
- **Auth:** email-only. `/api/subscribe` emails an HMAC-signed 24h link (`apps/web/lib/verify-token.ts`, `VERIFY_TOKEN_SECRET`); `/api/verify` sets `members.verified_at` and redirects to `/submit-website?id=<memberId>`.
- **Email:** Resend (`apps/web/lib/email.ts`). Until the domain is verified in Resend, `onboarding@resend.dev` only delivers to the account owner — set `RESEND_FROM` once verified.
- **Env:** `apps/web/.env.local` for dev (gitignored); production values live in the Cloudflare Worker's Variables and Secrets. Declare new env vars in `turbo.json` `globalEnv`.
- `/api/analyze-site` is still a mock (`mockDomainRating` in `apps/web/lib/analyze.ts`); the weekly digest is not built yet.

## Tech stack

- **Monorepo:** pnpm workspaces + Turborepo (Node ≥ 20, pnpm 10)
- **App:** Next.js **16.2.6** (App Router) + React 19 in `apps/web` — see the warning block at the top; the local docs live at `apps/web/node_modules/next/dist/docs/`
- **UI:** shared `@workspace/ui` package — shadcn/ui built on **@base-ui/react** (not Radix), Tailwind CSS **v4** (no `tailwind.config` file; CSS-first config in `packages/ui/src/styles/globals.css`)
- **Icons:** `@tabler/icons-react`
- **Validation:** zod v4
- **Lint/format:** ESLint 9 (flat config) + Prettier with the Tailwind plugin, shared configs in `packages/eslint-config` and `packages/typescript-config`

## Repo layout

```
apps/web/               # the Next.js site (App Router in apps/web/app)
packages/ui/            # shared shadcn/ui components, hooks, lib, global styles
packages/eslint-config/ # shared ESLint flat configs
packages/typescript-config/
```

## Commands

Run from the repo root (Turborepo fans out to workspaces):

```bash
pnpm dev        # start dev servers
pnpm build      # build all
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
pnpm format     # Prettier write
```

## Conventions

- Add shadcn components from the repo root with `pnpm dlx shadcn@latest add <component> -c apps/web` — they land in `packages/ui/src/components/`, not in the app.
- Import shared UI from the workspace package: `import { Button } from "@workspace/ui/components/button"` (also `@workspace/ui/lib/*`, `@workspace/ui/hooks/*`, `@workspace/ui/globals.css`).
- App-specific components live in `apps/web/components/`; only reusable primitives go in `packages/ui`.
- Theming is handled by `next-themes` via `apps/web/components/theme-provider.tsx`.
- TypeScript everywhere; validate any user input (forms, API routes) with zod.

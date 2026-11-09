# Topical maps

SEO content plans for exchange-backlinks.com. Each map groups the pages we want to rank with into clusters, ties every page to a target query, and tracks what has shipped. Everything we publish exists to bring Mentiohunt's ICP (founder-led and lean B2B teams doing their own link building) to a genuinely useful free tool, so every cluster should end up pointing either at the exchange (`/submit`) or at [Mentiohunt](https://mentiohunt.com).

## How we work

- **Data sources:** Google Search Console first (what we already rank for). DataForSEO only with explicit approval for a specific set of calls (see `AGENTS.md` → SEO research). Record the source and date next to every number.
- **One query, one page.** Before adding a page, check that no existing page (homepage, `/alternatives`, an `/alternatives/[slug]` page) already targets the same query. If one does, improve that page instead.
- **Lean on the domain.** "exchange backlinks" is an exact-match domain, and the brand name _is_ the keyword. Use "Exchange Backlinks" consistently as the site name, link to the homepage with keyword-rich anchors, and earn brand mentions.
- **Keep it honest.** Link exchanges sit close to Google's "excessive link exchanges" spam policy. Content explains the safe way to do it (same niche, one-for-one, editorial placement). We never promise rankings and never promote link schemes.
- **Where content lives:** informational articles go in `/guides/[slug]` (`apps/web/lib/guides.ts` for metadata, `apps/web/content/guides/<slug>.mdx` for the body and its `faq` export). Outlines go in `outlines/<slug>.md`. Images go in `apps/web/public/guides/<slug>/` as WebP with a source credit in the caption; prefer original diagrams and screenshots of primary sources (e.g. Google's docs) over stock images, and never use images we don't have the right to.
- **New maps:** add a file named `YYYY-MM-<topic>.md` and link it in the index below. Update the status column as pages ship.

## Index

| Map                                             | Created    | Status                 |
| ----------------------------------------------- | ---------- | ---------------------- |
| [Backlink exchange (v1)](#backlink-exchange-v1) | 2026-11-07 | Quick wins in progress |

---

## Backlink exchange (v1)

**Data:** GSC from 2026-02-07 to 2026-11-07 (about 46 clicks and 3,000 impressions). US search volume and keyword difficulty (KD) come from DataForSEO, pulled 2026-11-07. "—" means no data was returned.

### What GSC showed

- The homepage gets most impressions for "backlink(s) exchange" (positions 30–50). Its only real click driver is the exact-match "exchange backlinks" (position 17, 16% CTR).
- `/alternatives` outranks the homepage for list-intent modifiers ("backlink exchange free / marketplace / sites / platform"). Google treats these queries as wanting a list, so `/alternatives` is the page for them.
- The comparison pages rank on page 1–2 for long-tail queries, some of them unexpected: ranklytics (8.7), rankchase (14), authority exchange (9–12), help a b2b writer (9–20), featured.com alternative (15.5, 0 clicks).
- `/alternatives/collaborator` and `/alternatives/distribb` were "Discovered – currently not indexed" (checked 2026-11-07).

### Cluster 0: Quick wins on existing pages

| Page                                                   | Target query                                                                                                       | Change                                                                               | Status                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------- |
| `/alternatives`                                        | link exchange sites (20, KD 15), link exchange websites list (20, KD 7), backlink exchange sites / platform / free | Reframe as "Best Link Exchange Sites & Platforms"                                    | Done 2026-11-07       |
| `/alternatives/featured`                               | featured.com alternative, terkel (260, KD 11)                                                                      | Title mentions Terkel; add a list of other alternatives                              | Done 2026-11-07       |
| `/alternatives/collaborator`, `/alternatives/distribb` | collaborator.pro, distribb                                                                                         | More contextual internal links. **Manual "Request indexing" in GSC is still needed** | Links done 2026-11-07 |
| Homepage                                               | exchange backlinks (brand)                                                                                         | `alternateName` on WebSite schema                                                    | Done 2026-11-07       |

### Cluster 1: Link exchange, explained (informational; low KD, builds topical authority)

Each article links up to the homepage with the anchor "backlink exchange" or "free backlink exchange", and ends with a `/submit` CTA.

| Planned page                                             | Target query                                                             | Vol.          | KD    | Status                                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------------ | ------------- | ----- | ------------------------------------------------------------------------------ |
| Reciprocal links: are they safe for SEO?                 | reciprocal links, reciprocal link exchange, link exchange google penalty | 110 + 40 + 10 | 1     | Written 2026-11-08: [`/guides/reciprocal-links`](outlines/reciprocal-links.md) |
| Link exchange in SEO: what it is and how to do it safely | link exchange seo, what is a link exchange                               | 90 + 30       | 3 / 9 | Written 2026-11-09: `/guides/link-exchange-seo`                                |
| ABC (3-way) link exchange explained                      | abc link exchange, 3 way link exchange                                   | 20 + 10       | —     | Planned                                                                        |
| Link exchange email templates                            | link exchange email template, link exchange outreach                     | —             | —     | Planned (GSC-only bet)                                                         |

### Cluster 2: Source-request platform alternatives (most demand, low KD)

These are brand-name searches. We can't rank for the bare brand, so we target "X alternatives" and "X review" pages instead. Volumes below are for the bare brand and serve as a demand proxy.

| Planned page                                         | Brand demand                               | KD  | Status  |
| ---------------------------------------------------- | ------------------------------------------ | --- | ------- |
| Qwoted alternatives                                  | qwoted 9,900                               | 9   | Planned |
| Connectively (HARO) alternatives                     | connectively 590                           | 25  | Planned |
| Source of Sources alternatives                       | source of sources 390                      | 15  | Planned |
| SourceBottle alternatives                            | sourcebottle 260                           | 5   | Planned |
| Existing: HARO, Featured (Terkel), Help a B2B Writer | haro alternatives 90, help a b2b writer 90 | —   | Live    |

### Cluster 3: Link building for B2B SaaS (bridge to Mentiohunt)

This is where Mentiohunt CTAs fit most naturally (use `mentiohuntUrl()`).

| Planned page                              | Target query                               | Vol.      | KD      | Status  |
| ----------------------------------------- | ------------------------------------------ | --------- | ------- | ------- |
| How to get free backlinks                 | how to get free backlinks                  | 70        | 6       | Planned |
| SaaS link building guide                  | saas link building, link building for saas | 210 + 90  | —       | Planned |
| B2B link building                         | b2b link building                          | 110       | —       | Planned |
| How to get backlinks (pillar; build last) | how to get backlinks, free backlinks       | 590 + 480 | 31 / 37 | Later   |

### Cluster 4: Backlink exchange tools (existing comparison pages)

These already rank for long-tail queries with no measurable volume (outrank, arvow, rankchase, ranklytics, karmalinks, authority exchange, collaborator, distribb). Keep them updated. Add PPOExchange or Backlinkseller only if GSC impressions keep growing.

### Notes

- Plain "link exchange" (320/mo) is mostly unrelated intent (FarmVille, forex bureaus, DC Health Link). Don't target it head-on.
- Volumes are US-only. GSC also shows meaningful India and UK traffic.
- Re-check GSC 4–8 weeks after each batch ships and compare against this baseline.

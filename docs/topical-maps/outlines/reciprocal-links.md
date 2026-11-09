# Outline: Reciprocal links

- **Map / cluster:** Backlink exchange (v1) → Cluster 1 (link exchange, explained)
- **Primary query:** reciprocal links (110/mo, KD 1)
- **Secondary queries:** are reciprocal links bad for seo, reciprocal link exchange (40), link exchange google penalty (10), reciprocal backlinks, 3 way link exchange
- **Search intent:** informational. The searcher wants a verdict ("will this hurt me?") and then a safe way to do it.
- **URL:** `/guides/reciprocal-links` (written 2026-11-08: `apps/web/content/guides/reciprocal-links.mdx`).
- **Target length:** 2,000–2,500 words. The top results run about 2,000–2,500, and Semrush's thin 1,100-word page ranks lowest of the set.
- **Research date:** 2026-11-08. Sources: WebSearch SERP check, the top-ranking pages, Google docs, and forum threads. No DataForSEO calls were made.

## SERP snapshot (2026-11-08)

| Page                         | Updated | Words  | Angle                                         | Notable                                                                  |
| ---------------------------- | ------- | ------ | --------------------------------------------- | ------------------------------------------------------------------------ |
| Ahrefs: "Will They Hurt..."  | 2020    | ~2,000 | Original study                                | 73.6% of 140k sites have reciprocal links (2019 data, survivorship bias) |
| Semrush                      | 2024-04 | ~1,100 | Best practices                                | Thin; tool screenshots                                                   |
| Backlinko                    | 2025-12 | ~2,400 | Pros/cons, safe use, alternatives             | Best partner-vetting list, link-velocity heuristic                       |
| Respona                      | 2026-05 | ~2,500 | Leans "avoid", sells outsourced link building | 14-question FAQ, only one to define 3-way exchanges                      |
| Bluehost                     | 2026-02 | ~2,200 | "Still a good strategy in 2026?"              | One-way vs reciprocal vs paid table; some factual errors                 |
| Glossaries (Ahrefs, Respona) | —       | short  | Definition                                    | Ahrefs ranks with both a glossary entry and a blog post                  |

**What every page covers (table stakes):** a definition, the verdict "it depends", "excessive" equals risk, relevance matters, Google's spam policy as the reason, alternatives, and anchor text variety.

**Gaps we can own:**

1. **No page quotes Google directly.** None names a Googler or cites the current spam-policy text verbatim. We will, with dates.
2. **No usable test** for "natural reciprocity vs. link scheme". Pages only say "be relevant".
3. **Ignored vs. penalized is never explained.** Google's stated behavior is that it ignores the links by default and may take manual action if they're the majority.
4. **3-way / ABC exchanges** get a one-line definition at most. Forum users still believe they're "safer".
5. **No outreach script** that avoids the "link to me and I'll link to you" pattern.
6. **No audit of existing reciprocal links** (how to find them, then keep, qualify or remove).
7. **No B2B angle**: integration partners, customers, co-marketing, and resource pages.
8. **Stale data presented as current.** Everyone repeats the 73.6% stat without saying it comes from 2019 data.

## Google statements we can cite (verified 2026-11-08)

- **Spam policy (current):** "Excessive link exchanges ("Link to me and I'll link to you") or partner pages exclusively for the sake of cross-linking" is listed as link spam. The policy also lists "Exchanging goods or services for links". https://developers.google.com/search/docs/essentials/spam-policies
- **Mueller, Jan 22, 2020 (Twitter):** "Reciprocal links aren't necessarily bad." Natural links between peers are fine, and link schemes are "pretty obvious to our systems". https://www.seroundtable.com/google-reciprocal-links-28880.html
- **Mueller, Jul 2021 (office hours):** systematic link exchanges are "essentially against our webmaster guidelines". Algorithms "try to ignore those links". If they make up most of a site's links, Google "might apply manual action". "It doesn't matter if it's like topically relevant." https://seroundtable.com/google-link-exchanges-against-guidelines-31733.html, https://www.searchenginejournal.com/google-policy-link-exchange/413049/
- **Mueller, Jan 28, 2022 (office hours):** on linking back to sites that link to you: "That's perfectly fine. It's also kind of natural." The caveat is not "making weird deals, behind the scenes". https://www.searchenginejournal.com/google-affirms-reciprocal-linking-is-natural-in-many-cases/435923/
- **Qualifying links:** paid placements get `rel="sponsored"`, and `nofollow` is still acceptable. https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links

Before publishing, check the exact 2021 quote wording against the video, because the two write-ups differ slightly. Don't claim anything Google never said about 3-way links or SpamBrain.

## Positioning (read before writing)

Mueller's 2021 answer says relevance alone doesn't make a link _deal_ OK. So the article can't claim "same-niche exchanges are safe". The honest position, and the one that fits our product, is:

- Reciprocity isn't the problem. **The deal is.** A link that only exists because of a return-link obligation is the risk, even between relevant sites.
- Exchange Backlinks is framed as **an introduction to relevant B2B peers**. Each side places a link only where it would help their readers anyway, chooses the placement freely, and nobody is owed anything.
- Never promise rankings. Never recommend link exchanges as your main source of links.

## Outline

**H1:** Reciprocal Links: Are They Bad for SEO? (What Google Actually Says)

**Meta title:** Reciprocal Links: Are They Bad for SEO? What Google Says (the layout template appends "— Exchange Backlinks")
**Meta description:** Reciprocal links aren't automatically bad, but link deals are. Google's actual statements, a 5-question test, and how to swap links in B2B without risk.

**Intro + TL;DR box** (answer first, about 120 words)

- Reciprocal links are normal: most sites have some. They become a problem when they exist because of a deal rather than because they help readers.
- By default, Google ignores links it sees as an exchange. A manual action is possible when exchanges make up most of your links.
- The safe version: a few links with relevant peers, placed editorially, that you'd add even without the return link.

### H2: What is a reciprocal link?

- Definition: site A links to site B, and B links back to A. Give one plain B2B example (e.g. a CRM and an email tool linking to each other's integration docs).
- **H3: Natural reciprocity vs. a link exchange.** Two sites can link to each other with no agreement, or because of one. Same links, different intent.
- **H3: Types you'll run into** (table):

  | Type                   | How it works                              | Risk                                           |
  | ---------------------- | ----------------------------------------- | ---------------------------------------------- |
  | One-way (earned)       | B links to A, nothing back                | None                                           |
  | Natural reciprocal     | Both link because each is useful, no deal | None                                           |
  | Direct exchange (A↔B)  | "I'll link to you if you link to me"      | Links may be ignored; risky at scale           |
  | 3-way / ABC exchange   | A→C, B→A, so no direct swap is visible    | Same as an exchange, plus it looks like hiding |
  | Partner / "links" page | A page of swapped links                   | Named in Google's spam policy                  |
  | Paid / goods-for-links | Money, products or services for a link    | Link spam unless marked `sponsored`/`nofollow` |

### H2: What Google actually says about reciprocal links

- A dated timeline of quotes: 2020 tweet, then 2021 office hours, then 2022 office hours, then the current spam policy text. Link each one.
- One takeaway sentence: Google is against _deals_, not against two sites linking to each other.

### H2: Are reciprocal links bad for SEO?

- **H3: What happens to exchanged links: ignored, not "penalized".** Ignoring is the default. A manual action is the exception, when exchanges are the majority of your links. Explain what a manual action is and where it shows up (the Search Console → Manual actions report).
- **H3: What the data says (and how old it is).** Ahrefs found 73.6% of 140k sites had reciprocal links and 43.7% of top-10 pages had some. The study used 2019-era data and suffers from survivorship bias. Conclusion: reciprocal links are common among sites that rank, which shows they don't automatically hurt. It doesn't show they help.
- **H3: The real cost: wasted effort.** If Google ignores exchanged links, the time spent on them is lost. This is the honest reason to keep exchanges small and selective.

### H2: The 5-question test: natural link or link scheme?

Our original framework. Each question gets a yes/no and one example.

1. Would you link to this page even if they never linked back?
2. Does the link help _your_ reader at that exact spot in the content?
3. Is there a condition attached ("only if you link back", "within 7 days")?
4. Would exchanges become a large share of your backlinks?
5. Does the link sit in editorial content rather than a links page, footer, or sitewide block?

Scoring: one bad answer on questions 1 or 3 means don't do it, or qualify the link with `nofollow`.

### H2: How many reciprocal links is too many?

- Google publishes no number. Say so clearly, and don't invent a percentage. (Some blogs cite "under 10%"; mention that it's folklore, not Google guidance.)
- What raises risk instead: exchanges as your _main_ link source (Mueller's "majority"), a sudden jump in link velocity, unrelated partners, identical anchor text, and sitewide or footer placements.

### H2: Are 3-way (ABC) link exchanges safer?

- How they work (A→C, B→A), and why people think they're invisible.
- Why they aren't safer: there's still a deal behind the links, and the structure itself looks like an attempt to hide it. This busts a forum myth.
- A short section only. The full article comes later in cluster 1 (ABC link exchange explained). Link to it once it exists.

### H2: How to exchange links safely (the B2B way)

- **H3: Pick partners you'd recommend anyway.** A vetting checklist: same or adjacent B2B niche, a real audience (traffic trend, not just DR), indexed pages that rank for something, no "write for us / link exchange" pages, a clean outbound link profile, and a real person behind the site.
- **H3: Place links editorially.** In body content, on a relevant page, with descriptive and varied anchors. No footers, sidebars or "partners" pages.
- **H3: Keep it occasional.** Exchanges are a supplement to earned links, never the strategy.
- **H3: When to use `nofollow` or `sponsored`.** If there's any condition or compensation attached, qualify the link.
- **H3: Where B2B reciprocity happens naturally.** Integration partners, customers and case studies, co-marketing, podcast swaps, and expert quotes. Link to /alternatives/haro and /alternatives/help-a-b2b-writer for the expert-quote route.

### H2: How to ask without sounding like link spam (template)

- Why "I'll link to you if you link to me" emails get deleted, and why they describe exactly what the spam policy names.
- A template that leads with a specific page you'd cite, offers it unconditionally, and suggests only a page of theirs that fits. No quid pro quo.
- Red flags in inbound requests: gmail addresses, a generic "your site", "we have a DA 70 site", a paid offer, or a 3-way offer.

### H2: How to audit your existing reciprocal links

- Find them: compare Search Console → Links → Top linking sites against the domains you link out to (a crawler export or a site search). Note that free tools are enough.
- Decide for each one: keep it (passes the 5-question test), qualify it (`nofollow`/`sponsored`), or remove it (links page, irrelevant partner, conditional deal).
- When disavow is (rarely) needed: only for a manual action or a known paid scheme.

### H2: Alternatives to link exchanges

Keep this brief, since every competitor covers it. Expert quotes (HARO, Featured, Help a B2B Writer: link /alternatives), linkable assets, integration and partner pages, and digital PR. Then the Mentiohunt CTA for teams that want this on autopilot (use `mentiohuntUrl()`).

### H2: Frequently asked questions

Taken from the forums (WebmasterWorld, Warrior Forum, Reddit r/EntrepreneurRideAlong) and the competitors' FAQs. Two to four sentences per answer.

1. Do reciprocal links still work in 2026?
2. Will Google penalize me for reciprocal links?
3. Do reciprocal links cancel each other out?
4. Are one-way links better than reciprocal links?
5. Is it OK to link back to a site that linked to me?
6. Can I link my own two sites to each other?
7. Should reciprocal links be nofollow?
8. Is it OK to point an exchanged link at an inner page instead of the homepage?
9. Are link exchange sites and communities (Slack, Discord, platforms) safe to use?
10. What should I do with link exchange request emails?

### CTA (end + one mid-article)

Exchange Backlinks: a free weekly intro to B2B sites in your niche. You decide whether and where a link makes sense. Links go to `/submit`. Link the homepage once with the anchor "free backlink exchange".

## Internal links

- Out: `/` (anchor "free backlink exchange"), `/alternatives` ("link exchange sites"), `/alternatives/haro`, `/alternatives/help-a-b2b-writer`, `/submit`, Mentiohunt via `mentiohuntUrl({ medium: "guide", campaign: "reciprocal-links" })`.
- In: add a link from `/alternatives` (the "How to choose" section, card 1 or 2) and from the homepage FAQ if it has a related question.

## Schema

`Article` (with author, datePublished, dateModified), `BreadcrumbList`, and `FAQPage` for the FAQ section.

## Open questions

- ~~**Route:**~~ Decided: `/guides/[slug]` with MDX (`lib/guides.ts` + `content/guides/`).
- ~~**Author:**~~ Decided: Nicolas More (`lib/authors.ts`, bio from mentiohunt.com/about).
- **Media used:** two screenshots of Google's docs (spam policy, qualify outbound links), an original link-pattern diagram, and two YouTube embeds (Google Search Central office hours 2021-07-09 at 9:28, Ahrefs' study video). The 2022-01-28 office hours video has no confirmed timestamp, so it's cited but not embedded.
- **Original data:** if Exchange Backlinks has member data later (e.g. how many matches result in a link), add a stat. That would be the only fresh number on the SERP.
- **Not covered by this research:** Reddit and Quora blocked automated fetches, so the user questions come from WebmasterWorld, Warrior Forum, a Reddit mirror, and competitor FAQs. A quick manual pass on r/SEO, r/bigseo and Quora could add questions.

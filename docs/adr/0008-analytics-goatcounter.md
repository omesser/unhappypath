# ADR-0008: GoatCounter for on-site analytics, consoles for everything else

- **Date:** 2026-07-30
- **Status:** Accepted
- **Supersedes:** the spec §7 line "Analytics: none in v1. If curiosity strikes, flip on
  Cloudflare Web Analytics."

## Context

The site's stated goal (§8) is being findable *and citable* — by Google/Bing and by answer
engines. That makes one measurement question load-bearing: **is the AEO bet paying off?** It also
constrains the answer, because §2.3 ships zero client-side JS and the site has no server to log
from (static Astro on Cloudflare Pages).

The two questions worth money are not the same question, and no single tool answers both:

1. *Am I found and cited?* — search queries, impressions, indexing state, and whether
   `OAI-SearchBot` / `Claude-SearchBot` / `PerplexityBot` are actually fetching pages.
2. *Which posts land, and who sent the reader?* — per-path pageviews and referrers.

Question 1 is answered entirely by free consoles that ship nothing to the browser. Question 2
requires something on the page, which is the only real decision here.

The decisive constraint surfaced late: **referrers are the AEO signal.** `chatgpt.com` and
`perplexity.ai` in a referrer list is the only observable evidence that an answer engine cited the
site and a human followed through. Search Console does not report AI-assistant referrals. Any
option that drops referrers fails the one job.

## Decision

Two layers.

**Layer 1 — consoles, zero code.** Google Search Console, Bing Webmaster Tools, and the
Cloudflare dashboard + AI Crawl Control. Free, nothing shipped to the browser, and the AI Crawl
Control audit was already a launch-blocking checklist item for §8 reasons.

**Layer 2 — GoatCounter**, hosted free tier (personal, non-commercial; donation-funded). One
async 3.5 KB script in `BaseLayout.astro`. No cookies, no `localStorage`, no personal data
retained, therefore no consent banner. It is included in production builds and omitted from
Cloudflare branch previews. Yields pageviews per path, referrers, country, browser.

The script does not violate §8. That rule is *all content in the initial HTML so non-JS-executing
crawlers see everything* — it is not a byte budget. Async, content-free, and invisible to
crawlers either way.

## Alternatives

**GoatCounter's no-JS tracking pixel** (`<img src=".../count?p=/path">`, ~500 bytes, preserves
§2.3 absolutely) — **rejected.** The pixel cannot record the referrer, which discards the single
metric that makes §8 falsifiable. It also inflates counts with bot requests. Zero-JS purity here
buys nothing a reader can perceive and costs the only number worth reading. Kept in mind as the
fallback if the script is ever a problem; swapping is a one-line change against the same account
and history.

**Cloudflare Web Analytics** (what the spec previously named; free, unlimited, and literally a
dashboard toggle that auto-injects the beacon) — **rejected.** `static.cloudflareinsights.com` is
on common adblock lists, so it systematically undercounts precisely the developer audience this
site is written for. Its dashboard is also the thinnest of the three. Zero-code setup was not
worth structurally-wrong numbers.

**Plausible** (~$9/mo for 10k pageviews) — **rejected for v1, deferred with a trigger.** The best
product of the set: explicit AI-traffic reporting, Search Console integration in-dashboard, 1 KB
script. It costs money to answer questions a site with no readers yet does not have. Self-hosted
Community Edition is free but needs a VM plus ClickHouse — the opposite of low-touch, and a
standing ops burden for a personal blog.

**Umami Cloud** (free tier, open source, self-hostable) — a genuine peer to GoatCounter. Lost on
operator posture: GoatCounter is a single Go binary with SQLite and one maintainer with a decade
of not enshittifying it, which is a better bet for a decade-long personal site than a
VC-shaped-hosted-tier product.

**Counterscale** (Cloudflare Workers + Analytics Engine, near-free on the existing account) —
**rejected.** Deploying and operating a Worker to count pageviews on an eight-page static site is
more machinery than the data justifies.

**Nothing on-site** (consoles only) — **rejected.** It answers question 1 and abandons question 2,
including the AEO referral evidence.

## Consequences

- Adblocked visitors go uncounted. Accepted: the numbers are directional, not accounting.
- Two dashboards to check instead of one. Accepted, since they answer different questions.
- One third-party origin (`gc.zgo.at`) enters the page, after ADR-0002 deliberately eliminated
  all of them for fonts. This is the only one, and it carries no content — if a CSP is ever
  added, it needs an allowance (`https://gc.zgo.at`, `https://unhappypath.goatcounter.com`).
- §2.3 now reads "zero client-side JS *for rendering*" in practice. If a second script is ever
  proposed, that is a new decision and this ADR is not precedent for it.
- Vendor risk is bounded: GoatCounter is open source, so the failure mode is a migration to
  self-hosting, not data loss.

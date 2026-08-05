# SEO + AEO research for unhappypath.dev (July 2026)

Scope: a ~5-page static Astro site + Markdown blog on Cloudflare Pages, written by an
engineering leader. Goal: be findable, readable, and citable by BOTH human search
(Google/Bing) and AI consumers (LLM crawlers, ChatGPT/Perplexity/AI Overviews, agents).

Confidence labels used throughout:
- **[first-party]** — official docs/spec/announcement by the org that owns the behavior
- **[measured]** — large-scale measurement by a credible third party
- **[consensus]** — widely repeated industry practice, no first-party confirmation
- **[speculative]** — plausible, unproven

---

## TL;DR — do's and don'ts ranked by impact

**Do:**

1. **Ship server-rendered HTML (Astro static output already does this).** None of the major
   AI crawlers execute JavaScript; content not in the initial HTML is invisible to them.
   Highest-leverage single fact in this doc. [measured — Vercel/MERJ]
2. **robots.txt: allow everything you want cited** — explicitly allow `OAI-SearchBot`,
   `PerplexityBot`, `Claude-SearchBot`, and never block `Googlebot`/`Bingbot`. Blocking
   `OAI-SearchBot` removes you from ChatGPT search answers. [first-party — OpenAI]
3. **Check Cloudflare's AI-crawler settings.** Cloudflare defaults new zones to blocking AI
   crawlers and can serve a managed robots.txt with `ai-train=no` on your behalf. If you WANT
   AI discoverability, verify AI Crawl Control / bot-blocking / managed robots.txt are not
   silently blocking the bots you care about. [first-party — Cloudflare]
4. **One clean `<title>` + meta description per page; unique, descriptive.** [first-party — Google]
5. **JSON-LD: `BlogPosting` (with `author` → `Person` + `url`), plus `Person`/`WebSite` on the
   home/about page.** JSON-LD is Google's recommended format. [first-party]
6. **Author byline + a real About page.** Google's E-E-A-T guidance explicitly asks "is it
   self-evident who authored your content? do bylines lead to further information?" — this is
   also the entity-establishment play for answer engines. [first-party — Google]
7. **Real dates: visible publish/updated dates, `<time datetime>`, `datePublished`/`dateModified`
   in JSON-LD, accurate `lastmod` in the sitemap** (Google uses `lastmod` only if verifiably
   accurate; ignores `priority`/`changefreq`). [first-party — Google]
8. **`@astrojs/sitemap` + `@astrojs/rss` (full-content feed).** Both are free in Astro. Submit
   the sitemap in Google Search Console AND Bing Webmaster Tools (Bing matters: it feeds the
   ChatGPT ecosystem). [first-party Astro; Bing→ChatGPT is consensus + historical first-party]
9. **Minimal OG tags on every page (`og:title`, `og:type`, `og:image`, `og:url`,
   `og:description`) + `twitter:card`.** 1200×630 og:image. [first-party — ogp.me/Meta]
10. **Answer-shaped writing:** clear H1→H2 hierarchy, a direct answer/summary near the top,
    headings that match questions people ask. Google: no special optimization exists for AI
    Overviews — fundamentals are the optimization. [first-party for fundamentals; heading/Q&A
    shape is consensus]
11. **Pick one URL form (trailing slash or not) and be consistent everywhere** — canonical tag,
    sitemap, RSS (`trailingSlash` in both Astro config and the rss() helper), internal links.
    [first-party — Google canonicalization + Astro docs]

**Don't:**

12. **Don't add `meta keywords`** — Google has ignored it since 2009. [first-party]
13. **Don't ship an llms.txt expecting results** — no major answer engine honors it (Google
    explicitly says no special AI files are needed; measured data shows ~97% of llms.txt files
    get zero AI-bot requests). Fine as a cheap experiment; not a lever. [first-party + measured]
14. **Don't block AI training bots reflexively if discoverability is the goal** — but know the
    trade: GPTBot/ClaudeBot/Google-Extended/Applebot-Extended are *training* opt-outs that do
    NOT affect search/answer visibility, so you can block training and stay citable. [first-party]
15. **Don't build thin tag pages, keyword-stuff, chase word counts, or buy links** — Google
    explicitly lists meta keywords, keyword stuffing, content length, and PageRank-sculpting as
    things not to focus on; keyword stuffing violates spam policy. [first-party]

---

## 1. Human search (Google / Bing)

### What Google says actually matters (first-party)

- **SEO Starter Guide** (https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
  [first-party]: descriptive titles, good link/anchor text, crawlable `<a href>` links,
  descriptive alt text, logical URL structure, and letting Google find the site (links +
  sitemap). Explicitly *de-prioritized by Google in the same doc*: meta keywords ("Google
  Search doesn't use the keywords meta tag", linking to the 2009 post
  https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag),
  keyword stuffing (spam policy violation), keywords in domain/URL, content length ("no magical
  word count target"), TLD choice.
- **E-E-A-T / helpful content**
  (https://developers.google.com/search/docs/fundamentals/creating-helpful-content) [first-party]:
  E-E-A-T is *not* a direct ranking factor; Google's systems use "a mix of factors that can
  identify content with good E-E-A-T", trust being most important. Concretely actionable for a
  personal blog: bylines where expected, bylines linking to author background (About page),
  first-hand experience on display. The "Who/How/Why" self-assessment: make authorship
  self-evident; if AI substantially generated content, disclosure is recommended where a reader
  would reasonably ask "how was this created?".
- **AI-generated content**
  (https://developers.google.com/search/blog/2023/02/google-search-and-ai-content) [first-party]:
  Google rewards quality "however it is produced"; AI-assisted writing is not penalized per se,
  but automation used primarily to manipulate rankings is spam.
- **Core Web Vitals / page experience**
  (https://developers.google.com/search/docs/appearance/page-experience) [first-party]: "Core
  Web Vitals are used by our ranking systems", but Google warns that chasing perfect scores
  "just for SEO reasons may not be the best use of your time." A static Astro site on
  Cloudflare's edge will pass CWV essentially for free — do nothing beyond not shipping huge
  images/fonts.
- **Canonical URLs**
  (https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
  [first-party]: use `rel="canonical"` link element OR HTTP header (pick one, not both);
  annotations must be absolute URLs; Google also prefers HTTPS as a canonicalization signal.
  For a 5-page site the only real duplicate-URL risks are trailing-slash inconsistency and the
  `*.pages.dev` preview domain — set `<link rel="canonical">` to the `unhappypath.dev` URL on
  every page (Astro: derive from `Astro.url` + `site` config).
- **Sitemaps**
  (https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
  [first-party]: absolute UTF-8 URLs at site root; Google **ignores `<priority>` and
  `<changefreq>`**; uses `<lastmod>` only "if it's consistently and verifiably accurate"
  (significant content updates, not copyright-year bumps). Google's sitemap overview also notes
  sites of ~500 pages or fewer that are well-linked may not strictly need one
  (https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) [first-party]
  — but it's free via `@astrojs/sitemap`, so ship it. The sitemap "ping" endpoint was
  deprecated in 2023; submit via Search Console instead
  (https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping) [first-party].
- **Meta tags Google supports**
  (https://developers.google.com/search/docs/crawling-indexing/special-tags) [first-party]:
  `description` (snippet candidate), `robots`, `googlebot`, `google-site-verification`,
  charset, viewport. Nothing else — no keywords, no author meta for ranking.

### Bing / IndexNow

- **IndexNow** (https://www.indexnow.org/documentation) [first-party]: push-based URL
  notification; host a `{key}.txt` at the root, POST changed URLs; participating engines share
  submissions (Bing, Yandex, Naver, Seznam — see https://www.indexnow.org/searchengines).
  **Google does not participate** — it said it would "test" IndexNow in 2021 and never adopted
  it [consensus, no first-party Google adoption; e.g.
  https://www.indexernow.com/google-indexnow]. For a low-frequency personal blog this is
  optional; a Cloudflare Pages deploy hook or manual Bing Webmaster Tools submission covers it.
  Value: faster Bing indexation → faster availability to Bing-fed answer engines.
- **Register in Bing Webmaster Tools** (https://www.bing.com/webmasters) and submit the
  sitemap. Rationale under AEO below. [consensus]

---

## 2. AI / agentic discoverability (AEO)

### The crawler landscape (what each bot actually does)

| Bot | Operator | Purpose | Blocking it means |
|---|---|---|---|
| `GPTBot` | OpenAI | Training foundation models | Content excluded from future training; **no effect on ChatGPT search visibility** [first-party https://platform.openai.com/docs/bots] |
| `OAI-SearchBot` | OpenAI | ChatGPT search index | "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers" [first-party, same page] |
| `ChatGPT-User` | OpenAI | On-demand fetch when a user/agent asks for your page | Users' live requests fail [first-party, same page] |
| `ClaudeBot` | Anthropic | Training data collection | Excluded from future Claude training [first-party https://support.claude.com/en/articles/8896518] |
| `Claude-SearchBot` | Anthropic | Improving Claude search results | Reduced visibility in Claude's search citations [first-party, same page] |
| `Claude-User` | Anthropic | User-directed fetches from Claude | Live retrieval of your pages fails [first-party, same page] |
| `Google-Extended` | Google | **Not a crawler** — a robots token controlling use of Googlebot-crawled data for Gemini training + grounding | "Does not impact a site's inclusion in Google Search nor is it used as a ranking signal" — and it does NOT control AI Overviews [first-party https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers] |
| `Googlebot` | Google | Search AND AI Overviews/AI Mode (AI is "integral to how Search functions") | Gone from Google + its AI features [first-party https://developers.google.com/search/docs/appearance/ai-features] |
| `PerplexityBot` | Perplexity | Perplexity search index, "not used to crawl content for AI foundation models" | Not surfaced in Perplexity results [first-party https://docs.perplexity.ai/guides/bots] |
| `Perplexity-User` | Perplexity | User-triggered page visits | User answers can't cite your live page [first-party, same page] |
| `CCBot` | Common Crawl | Open crawl corpus, widely used for LLM training | Out of Common Crawl-derived training sets [first-party https://commoncrawl.org/ccbot] |
| `Applebot` / `Applebot-Extended` | Apple | Applebot: Siri/Spotlight/Safari search + context for Apple AI answers. Applebot-Extended: training opt-out only, "does not crawl webpages" | Extended-block keeps you in Apple search but out of Apple foundation-model training [first-party https://support.apple.com/en-us/119829] |
| `Bytespider` | ByteDance | Training crawler; historically poor robots.txt compliance | [consensus; no official ByteDance docs exist] |

Key structural fact: **every major vendor now separates "training" bots from "search/answer"
bots and from "user-triggered fetchers"**, and states the settings are independent
[first-party — OpenAI, Anthropic, Apple, Google above]. So a personal blogger can have it both
ways: block training, stay citable.

### Recommended robots.txt posture (wants to be discovered/cited)

Maximal discoverability version — allow everything, which is also what an empty/permissive
robots.txt does:

```robots
# https://unhappypath.dev/robots.txt
User-agent: *
Allow: /

Sitemap: https://unhappypath.dev/sitemap.xml
```

If you want "cite me, don't train on me" (defensible for a writer; costs you nothing in
answer-engine visibility per the vendors' own docs):

```robots
User-agent: *
Allow: /

# --- opt out of model training only; search/answer/user-fetch bots stay allowed ---
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

Sitemap: https://unhappypath.dev/sitemap.xml
```

Trade-off to be honest about [speculative but reasoned]: being in training corpora may make
models "know about" you in parametric memory (unattributed), while search/answer bots get you
*cited with links*. Blocking training loses the former, keeps the latter. For an engineering
leader building a public identity, a case exists for allowing everything — training data is
how a model comes to complete "unhappypath.dev is …" without searching. Both postures are
legitimate; the file above encodes the conservative one. Recommendation for this site's goals:
**start fully open; revisit if scraping-without-attribution starts to rankle.**

Note on compliance: robots.txt is honored voluntarily. OpenAI, Anthropic, Google, Apple, and
Perplexity all document compliance for the bots above [first-party]; Bytespider historically
does not [consensus]. Cloudflare AI Crawl Control can show you compliance per crawler and
hard-block at the network level [first-party https://developers.cloudflare.com/ai-crawl-control/].

### Cloudflare specifics (this site is on Cloudflare Pages)

- **AI Crawl Control** (formerly AI Audit) is on all plans: per-crawler allow/block, robots.txt
  compliance monitoring, and **pay-per-crawl (private beta)** — HTTP 402 + `crawler-price`
  negotiation headers [first-party https://developers.cloudflare.com/ai-crawl-control/ and
  https://blog.cloudflare.com/introducing-pay-per-crawl/]. Pay-per-crawl is irrelevant for a
  personal blog wanting reach — do not enable.
- **Cloudflare blocks AI crawlers by default for new zones** (announced July 1, 2025)
  [first-party https://blog.cloudflare.com/content-independence-day/]. **Action: audit your
  zone.** If "Block AI Bots" / managed robots.txt is on, your own robots.txt intentions are
  moot. This is the most likely silent misconfiguration for this site.
- **Content Signals Policy** (Sept 2025): Cloudflare's robots.txt extension adding
  `Content-Signal: search=yes, ai-input=yes, ai-train=no` style lines, framed as an express
  reservation of rights (EU CDSM Art. 4). Cloudflare's managed robots.txt serves
  `search=yes, ai-train=no` for 3.8M+ domains [first-party
  https://blog.cloudflare.com/content-signals-policy/]. No AI vendor has publicly committed to
  honoring content signals [consensus — absence of any first-party vendor statement]. If you
  want to be maximally welcoming: `Content-Signal: search=yes, ai-input=yes` (and your chosen
  ai-train value) is a cheap, harmless declaration.

### llms.txt — adoption verdict

- **The proposal** (https://llmstxt.org/) [first-party to the proposal]: `/llms.txt` = a
  Markdown index (H1 + blockquote summary + H2 link lists) to help LLMs find LLM-friendly
  content; companion idea: serve `page.md` next to each page. Authored by Jeremy Howard
  (Answer.AI), Sept 2024. It is a *proposal*, not a standard — no standards body, no vendor
  ratification.
- **Google: explicit no.** The AI-features doc says: "**You don't need to create new machine
  readable files, AI text files, or markup to appear in these features**" [first-party
  https://developers.google.com/search/docs/appearance/ai-features]. Gary Illyes and John
  Mueller have said Google doesn't use it and compared it to the keywords meta tag
  [third-party reporting of first-party statements, e.g.
  https://www.webyes.com/blogs/does-llms-txt-improve-rankings/].
- **OpenAI**: crawler docs point site owners at robots.txt only; no llms.txt support statement
  exists [first-party absence — https://platform.openai.com/docs/bots]. (OpenAI publishing an
  llms.txt for its *own* docs site is tooling convenience, not crawler policy.)
- **Anthropic / Perplexity**: no public commitment to fetch llms.txt as a crawl policy
  [first-party absence]. Claims that they "respect" it circulate in SEO blogs without vendor
  backing [consensus-level hype, treat as unverified].
- **Measured reality**: ppc.land server-log analysis — adoption grew 8.8×, but **97% of
  llms.txt files received zero AI-crawler requests** (May 2026)
  [measured https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/].
- **Verdict:** not adopted by any major answer engine as of mid-2026. Where it *does* get used:
  developer tools (IDE agents, MCP-style doc lookups) fetching documentation indexes. For a
  5-page personal blog: **skip it, or ship a 10-line one for fun — expect nothing.** If you
  want to serve machine-friendly content, the higher-value move is clean semantic HTML (which
  all these bots already parse) and optionally Markdown source availability.

### What actually correlates with being cited by answer engines

- **Being fetchable and server-rendered.** The MERJ/Vercel study
  (https://vercel.com/blog/the-rise-of-the-ai-crawler) [measured]: "none of the major AI
  crawlers currently render JavaScript" — OpenAI (GPTBot/OAI-SearchBot/ChatGPT-User),
  Anthropic (ClaudeBot), Perplexity, Meta, Bytespider, CCBot. They fetch JS files but don't
  execute them. Exceptions: Gemini (rides Googlebot's rendering) and Applebot. Astro static
  output = fully legible to all of them. Keep any interactive islands non-essential to content.
- **Bing indexation → ChatGPT.** OpenAI's browsing has used Bing since the "Browse with Bing"
  era [first-party historical, 2023 OpenAI announcement]; current ChatGPT search blends its own
  OAI-SearchBot index with third-party providers [consensus — OpenAI does not document the mix;
  e.g. https://www.stackmatix.com/blog/bing-webmaster-tools-chatgpt]. Practical: verify site in
  Bing Webmaster Tools, submit sitemap, optionally IndexNow.
- **Google AI Overviews/AI Mode eligibility = normal Google indexing + snippet eligibility**,
  full stop: "no additional requirements to appear in AI Overviews or AI Mode." Their "query
  fan-out" surfaces pages beyond the top blue links [first-party
  https://developers.google.com/search/docs/appearance/ai-features and
  https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search]. Controls if ever
  needed: `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex` — these also limit AI-feature
  usage [first-party]. Don't use any of them on this site.
- **Traditional rank is a weakening predictor of AI citation**: Ahrefs measured AI Overview
  citations from top-10 organic results falling from ~76% (mid-2025) to ~38% (early 2026);
  BrightEdge as low as 17%; ChatGPT and Perplexity citation domains overlap only ~11%
  [measured, third-party studies — see
  https://everything-pr.com/how-ai-engines-cite-the-web-the-six-studies-that-define-the-2026-evidence-base and
  https://otterly.ai/blog/the-ai-citations-report-2026/]. Implication: niche, specific,
  answer-shaped pages can be cited without ranking #1.
- **Content shape** [consensus, aligned with first-party fundamentals]: direct answers near the
  top, question-shaped H2s, extractable facts/lists, one topic per page, dates and bylines.
  Google's own advice for AI experiences is "unique, non-commodity content" that satisfies
  "longer and more specific questions" [first-party — succeeding-in-ai-search blog].
- **Entity establishment** [consensus]: consistent author name, About page, `Person` JSON-LD
  with `sameAs` to LinkedIn/GitHub, so engines can resolve "who is this author". Google's
  author-markup best practices explicitly recommend `author.url`/`sameAs` for disambiguation
  [first-party — Article structured data doc].
- **Freshness**: visible dates + accurate `dateModified`/`lastmod` [first-party for Google's
  lastmod usage; effect on answer-engine citation is consensus].

---

## 3. Machine-legible markup

### JSON-LD (Google-recommended format [first-party])

Per Google: JSON-LD recommended; Article/BlogPosting has **no required properties** — add the
recommended ones that apply; complete-and-accurate beats many-and-sloppy; markup must match
visible content [first-party
https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data,
https://developers.google.com/search/docs/appearance/structured-data/article].

Types worth having on this site (all schema.org, validated with
https://search.google.com/test/rich-results):

**Every blog post** — `BlogPosting`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post title",
  "datePublished": "2026-07-29T08:00:00+03:00",
  "dateModified": "2026-07-29T08:00:00+03:00",
  "image": ["https://unhappypath.dev/og/post-slug.png"],
  "author": {
    "@type": "Person",
    "name": "Oded Messer",
    "url": "https://unhappypath.dev/about/"
  },
  "mainEntityOfPage": "https://unhappypath.dev/blog/post-slug/"
}
</script>
```

**Home page** — `WebSite` (+ publisher `Person`); **About page** — `Person` with `sameAs`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Oded Messer",
  "url": "https://unhappypath.dev/about/",
  "jobTitle": "Engineering leader",
  "sameAs": [
    "https://www.linkedin.com/in/...",
    "https://github.com/omesser"
  ]
}
</script>
```

Notes: `author.name` = name only (no titles/prefixes — Google's explicit best practice)
[first-party]. Google also supports `ProfilePage` structured data for the about page —
optional nice-to-have [first-party — linked from the Article doc]. `BreadcrumbList`: skip; a
5-page site has no breadcrumb trail worth marking up (Google's gallery lists it, but it buys
nothing here) [first-party gallery
https://developers.google.com/search/docs/appearance/structured-data/search-gallery; skip
recommendation is my judgment].

### Open Graph + X cards

Required OG per ogp.me [first-party https://ogp.me/]: `og:title`, `og:type` (`article` for
posts, `website` for pages), `og:image`, `og:url` (set to the canonical). Add
`og:description`, `og:site_name`, and for posts `article:published_time`/`article:author`
(ogp.me article type) [first-party]. og:image at 1200×630 px renders well everywhere
[first-party — Meta sharing docs https://developers.facebook.com/docs/sharing/webmasters/images/].

X/Twitter: `<meta name="twitter:card" content="summary_large_image">` is the only tag you
strictly need — X falls back to `og:title`/`og:description`/`og:image` for the rest
[first-party X docs (developer.x.com cards markup; page now requires auth), widely mirrored;
consensus-safe].

### RSS

- Ship `/rss.xml` via `@astrojs/rss` [first-party Astro https://docs.astro.build/en/recipes/rss/].
- **Full-content feed** (`content` key, rendered from Markdown, sanitize-html per Astro docs):
  serves human subscribers AND gives any bot/agent a single clean, JS-free, chronological,
  full-text endpoint for the whole blog — which is exactly the artifact llms.txt wishes it were
  [first-party for mechanics; the AI-ingestion value is consensus/speculative but the human
  value alone justifies it].
- Match `trailingSlash` between `astro.config` and the `rss()` helper so feed URLs equal
  canonical URLs [first-party Astro docs].
- Add autodiscovery in `<head>`:
  `<link rel="alternate" type="application/rss+xml" title="unhappypath.dev" href="/rss.xml">`
  [first-party spec https://www.rssboard.org/rss-autodiscovery].

### Semantic HTML as machine legibility

- One `<h1>` per page, hierarchical `<h2>`/`<h3>` that describe sections — Google's starter
  guide ties headings and descriptive anchor text directly to understanding content
  [first-party]. Non-rendering crawlers parse the DOM as structure; heading hierarchy is the
  document outline they get.
- `<article>`, `<nav>`, `<main>`, `<time datetime="2026-07-29">` per WHATWG semantics
  [first-party spec https://html.spec.whatwg.org/multipage/sections.html]; direct evidence that
  answer engines weight landmarks is lacking [speculative], but it's zero-cost, is what
  readability extractors key on, and doubles as accessibility.
- Descriptive `alt` text and crawlable `<a href>` links [first-party — Google starter guide].
- Content in text, not images/canvas/JS: Google lists "making sure that important content is
  available in textual form" among its AI-features best practices [first-party — ai-features doc].

---

## 4. Wasted effort / actively harmful (for THIS site)

| Item | Verdict | Backing |
|---|---|---|
| `meta keywords` | Dead since 2009 | [first-party https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag] |
| Keyword stuffing | Spam-policy violation | [first-party https://developers.google.com/search/docs/essentials/spam-policies#keyword-stuffing] |
| Word-count targets | "No magical word count target" | [first-party — starter guide] |
| `<priority>`/`<changefreq>` in sitemap | Ignored by Google | [first-party — sitemap doc] |
| Sitemap ping endpoints | Deprecated 2023 | [first-party https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping] |
| Thin tag/category pages, doorway pages | Nothing to aggregate on a 5-page site; doorway = spam policy | [first-party spam policies; sizing judgment mine] |
| Aggressive internal interlinking / anchor-text sculpting | Starter guide asks for natural, descriptive links only | [first-party] |
| llms.txt as a ranking/citation lever | No engine honors it; 97% get zero bot hits | [first-party Google "no AI text files needed" + measured ppc.land] |
| Blocking everything in robots.txt "for safety" | Directly removes you from ChatGPT search answers, Perplexity, Google | [first-party — each vendor's docs] |
| Client-side-rendered content, JS-dependent text | Invisible to all major AI crawlers (no JS execution) | [measured — Vercel/MERJ] |
| Chasing perfect Lighthouse/CWV scores | Google: "may not be the best use of your time"; static Astro already passes | [first-party — page-experience FAQ] |
| Pay-per-crawl / blocking-by-default on Cloudflare | Opposite of this site's goal | [first-party Cloudflare docs; goal-fit judgment mine] |
| `BreadcrumbList`, `FAQPage`, `Speakable`, etc. | FAQPage rich results restricted to gov/health sites since 2023; breadcrumbs pointless at this scale | [first-party https://developers.google.com/search/docs/appearance/structured-data/faqpage; judgment mine] |
| Separate "AEO tool" subscriptions / GEO agencies | The measured levers are the free ones above | [consensus; my judgment] |

---

## 5. Concrete checklist for unhappypath.dev (Astro)

1. `astro.config.mjs`: set `site: "https://unhappypath.dev"`, pick `trailingSlash` policy, add
   `@astrojs/sitemap`.
2. Base layout `<head>`: canonical link, title, meta description, OG block, `twitter:card`,
   RSS autodiscovery link, JSON-LD component (WebSite/Person or BlogPosting by page type).
3. `public/robots.txt` (or keep Cloudflare-managed robots.txt OFF): posture from §2, with
   `Sitemap:` line.
4. Cloudflare dashboard: AI Crawl Control → confirm the search/user bots you want are allowed;
   disable default AI-bot blocking; don't enable pay-per-crawl.
5. `src/pages/rss.xml.ts` with full `content`; sanitize-html.
6. Blog post frontmatter: `pubDate`, `updatedDate` → rendered `<time>` + JSON-LD + sitemap
   `lastmod`.
7. About page: bio, photo, `Person` JSON-LD with `sameAs` links; every post byline links to it.
8. Verify in Google Search Console + Bing Webmaster Tools; submit sitemap to both. Optional:
   IndexNow key + ping on deploy (Cloudflare Pages deploy hook).
9. Canonicalize the `*.pages.dev` domain away (canonical tags cover it; optionally a bulk
   redirect from pages.dev to the custom domain).
10. Write posts with a one-paragraph answer up top and question-shaped H2s where natural.

---

## Source index

Google (first-party):
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/blog/2023/02/google-search-and-ai-content
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/special-tags
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://developers.google.com/search/docs/appearance/page-experience
- https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers (Google-Extended)
- https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag
- https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping

AI vendors (first-party):
- https://platform.openai.com/docs/bots
- https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- https://docs.perplexity.ai/guides/bots
- https://support.apple.com/en-us/119829
- https://commoncrawl.org/ccbot

Cloudflare (first-party):
- https://developers.cloudflare.com/ai-crawl-control/
- https://blog.cloudflare.com/introducing-pay-per-crawl/
- https://blog.cloudflare.com/content-signals-policy/
- https://blog.cloudflare.com/content-independence-day/

Specs & protocols (first-party to the spec):
- https://llmstxt.org/
- https://ogp.me/
- https://www.indexnow.org/documentation
- https://www.rssboard.org/rss-autodiscovery
- https://html.spec.whatwg.org/multipage/sections.html

Astro (first-party):
- https://docs.astro.build/en/guides/integrations-guide/sitemap/
- https://docs.astro.build/en/recipes/rss/

Measured studies / third-party:
- https://vercel.com/blog/the-rise-of-the-ai-crawler (MERJ + Vercel, Dec 2024)
- https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/
- https://everything-pr.com/how-ai-engines-cite-the-web-the-six-studies-that-define-the-2026-evidence-base
- https://otterly.ai/blog/the-ai-citations-report-2026/
- https://www.webyes.com/blogs/does-llms-txt-improve-rankings/ (reporting Mueller/Illyes statements)
- https://www.stackmatix.com/blog/bing-webmaster-tools-chatgpt (Bing→ChatGPT plumbing, consensus-grade)

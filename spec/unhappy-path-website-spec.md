# unhappy path — Website Specification

**Version:** 2.0 (merged review decisions from 2026-07-29 interview)
**Date:** 2026-07-29
**Site Name:** unhappy path
**Domain:** unhappypath.dev
**Design Direction:** #2 — Clean classic light (lethain.com / jvns.ca hybrid)
**Theme:** Light mode default. Dark mode follows OS preference (`prefers-color-scheme`), no toggle.

Precedence: this spec > `implementation-hints.md` > wireframes.

---

## 1. Goals & Constraints

- Low maintenance (static site, Markdown content, Git-based)
- Easy on the eyes, optimized for long-form reading
- Contains:
  - Short "About me" / bio
  - Links to GitHub projects
  - Bunch of prose (timeless writing, converted from LinkedIn posts)
  - Fun Links / Rabbit Holes section
  - Contact page ("how to direct to me")
- Senior engineering leader voice: direct, no corporate fluff, geeky & practical
- Single source of truth for personal brand + writing home
- **Site identity leads, not the person:** no personal name in big letters anywhere.
  Name appears once, small, in the footer.

**Stack (decided):** Astro 7 (Node 22+), content in Markdown, deploy to
**Cloudflare Pages** (domain already in Oded's Cloudflare account). Zero runtime cost.
See `implementation-hints.md` for stack/infra details.

---

## 2. Design Principles

1. **Reading first.** Max prose width ~65–70 characters. Excellent typography, generous line-height, high contrast.
2. **Light mode default.** Soft off-white / light gray background, dark slate text. Dark mode via CSS `prefers-color-scheme` only (high-contrast inverted palette) — no JS toggle, no persistence code.
3. **Minimal chrome.** No hero banners, no animations, no stock photos, no glassmorphism, no heavy JS. Target: zero client-side JS.
4. **Clear hierarchy without visual noise.** Sections separated by whitespace or subtle dividers. Easy scanning.
5. **Low maintenance forever.** All content in Markdown or simple data files. No CMS, no comments system, no database, no contact form.
6. **Accessible.** Semantic HTML, good contrast (WCAG AA+), keyboard friendly, reduced-motion friendly.
7. **Timeless aesthetic.** Neutral palette. Looks intentional in 2026 and still good in 2030+.

---

## 3. Global Elements

### Header / Navbar
- **Logo (left):** Text "unhappy path" (simple, no fancy icon required)
- **Navigation (right on desktop):** About · Notes · Projects · Fun Links · Contact
  (first four are homepage anchors; Contact is a page)
- **No theme toggle** (dark mode follows OS preference)
- **Mobile:** No hamburger. The same links wrap onto a second line — no JS, no menu state.

### Footer
- Small print only: © [Year] Oded Messer — unhappypath.dev
- Links: RSS Feed (for Notes)
- Optional: small "Built with …" note
- Minimal, no clutter

---

## 4. Content Structure

### Homepage (`/`)
Vertical flow: About → Notes → Projects → Fun Links. Single primary column, with a light grid
for projects only.

#### 4.1 Hero / About Section
- **Heading:** the site, not the person — **"unhappy path | Software engineering hijinks"**.
  Fun to look at, appeals to engineers.
- **Desktop:** Profile photo/avatar on left + text on right. **Mobile:** photo on top, then text.
- **Content:**
  - Bio: 150–350 words max. Honest, direct. Cover:
    - Who you are + current focus
    - Relevant past experience (no fluff)
    - What you're currently obsessed with (e.g. systems, AI-native orgs, engineering leadership, "unhappy paths")
  - Social links row: **GitHub · LinkedIn** only. No X. Email lives on `/contact` only.
    - GitHub: https://github.com/omesser
    - LinkedIn: https://www.linkedin.com/in/odedmesser/

#### 4.2 Projects Section
- **Heading:** "Projects"
- **Optional one-line intro:** "A few things I've built or contributed to."
- **Layout:**
  - Desktop: **2-column** grid of cards (not 3, not the wireframe's 4 — reading width is ~65ch)
  - Mobile: Single-column stack
- **Per project card:**
  - Title (linked to GitHub repo or demo)
  - 1–2 sentence description
  - Tech tags (small pills)
  - Action links: GitHub · Live (if applicable)
- Curate **3–8** best projects only. Everything else lives on your GitHub profile.

#### 4.3 Notes Section
- **Heading:** "Notes"
- **Intro line (optional):** "Notes on engineering, systems, and leadership."
- **Layout:** Vertical chronological list, **5 most recent** posts
- **Per post item:**
  - Date (e.g. Jul 2025)
  - Title (linked to full post)
  - 1–2 line teaser / excerpt
- "Browse all notes →" link to `/notes`
- Clear RSS / subscribe option

#### 4.4 Fun Links / Rabbit Holes Section
- **Heading:** "Fun Links" or "Rabbit Holes"
- **Layout:** Simple bulleted list or light cards
- **Per item:** Title + short reason why it's interesting + link
- 5–10 curated items. Easy to update manually.
- Optional light grouping (Books · Tools · Deep Dives · Misc)

### Supporting Pages

| Path              | Purpose                              | Notes |
|-------------------|--------------------------------------|-------|
| `/`               | Homepage (all core sections)        | Main entry |
| `/notes`           | Full archive of posts               | Chronological list |
| `/notes/[slug]`    | Individual post                     | Clean reading view |
| `/contact`        | How to direct to me                 | See below |
| `404`             | Custom error page                   | "404 — you have reached the unhappy path. (Working as intended.)" |

No `/about`, `/projects`, or `/fun` pages — homepage sections cover them.
Bring one back only if a section outgrows the homepage.

### Contact Page (`/contact`)
- "How to direct to me" guidance: what to reach out about, and where (DMs vs email).
- **Personal email** (not work) — appears ONLY on this page (`CONTACT_EMAIL` in `src/consts.ts`).
- LinkedIn link(s).
- No form (backend + spam + vendor; `mailto:` is zero-maintenance).

### Individual Post Page (`/notes/[slug]`)
- Clean, focused reading layout
- Title
- Date (+ optional reading time)
- Full Markdown content
- "← Back to Notes"
- No share buttons, no related posts, no tag display. Keep `tags:` in frontmatter
  (render nothing until ~20+ posts make the archive hard to scan).

---

## 5. Content Strategy

- **Notes:** Convert your best timeless LinkedIn posts into proper long-form Markdown articles. Prioritize evergreen topics over news.
- **Projects:** Hand-curated from GitHub. Signal over quantity.
- **Fun Links:** Personal curation. Update whenever something genuinely interesting appears.
- **Voice:** Senior engineering leader — direct, practical, no fluff, geeky curiosity welcome. Wry-but-warm, not bitter.
- **Update cadence:** Low. Add when ready. No publishing schedule required.
- **v1 ships with real public content:** bio, profile photo, three curated projects, Fun Links,
  and the first note are in.

---

## 6. Wireframes

Two visual wireframes are provided (see `implementation-hints.md` for filename mapping):

1. **Desktop Homepage Wireframe** (`2Lhuw.jpg`) — light mode, full section flow
2. **Mobile Homepage Wireframe** (`iebYd.jpg`) — light mode, stacked single column

**Do NOT implement the JPGs literally — spec text wins.** Known wireframe drift:
- Desktop shows a 4-column project grid → build 2 columns (§4.2)
- Mobile shows Facebook/YouTube/Instagram icons → AI noise, ignore (§4.1 lists the real row)
- Both show a theme toggle and hamburger → cut (§3)
- Hero shows "Hey, I'm [Your Name]" → replaced by site-identity heading (§4.1)

**Dark mode:** Same structure and hierarchy. Only colors invert. No separate wireframe needed.

---

## 7. Additional Spec Notes

- **Performance:** Fast by default (static). Optimize any images.
- **Font:** One self-hosted variable font — **Inter** via `@fontsource-variable/inter`. No font CDN.
- **SEO / AEO:** See §8 — Discoverability.
- **RSS:** Full feed for the Notes section is required.
- **Accessibility:** Semantic markup, sufficient contrast, focus states, alt text for any images.
- **Analytics:** Two layers from day 0, both free, both privacy-preserving by construction.
  Rationale and rejected alternatives: `docs/adr/0008-analytics-goatcounter.md`.
  - **Layer 1 — consoles (zero code, zero bytes shipped).** Google Search Console + Bing
    Webmaster Tools answer *what did people search to reach me, and is the site indexed*.
    Cloudflare's dashboard + AI Crawl Control answer *are answer-engine bots actually fetching
    pages* (§8). Highest-signal layer for an AEO-first site; already in the §9 checklist.
  - **Layer 2 — on-site counter.** **GoatCounter**, hosted free tier, one async 3.5 KB script
    in `BaseLayout.astro` before `</body>`:
    ```html
    <script data-goatcounter="https://unhappypath.goatcounter.com/count"
            async src="//gc.zgo.at/count.js"></script>
    ```
    No cookies, no `localStorage`, no personal data retained — so no consent banner, because
    there is nothing to consent to. Yields pageviews per path, **referrers**, country, browser.
  - **Why referrers are the point:** `chatgpt.com` / `perplexity.ai` appearing in the referrer
    list is the only place §8's AEO bet becomes visible. Search Console does not report it.
    GoatCounter's no-JS tracking-pixel variant cannot record referrers, which is why the script
    won over the pixel despite §2.3.
  - **This does not weaken §8.** The script is async, non-blocking, and carries no content. All
    content remains in the initial HTML; non-JS-executing crawlers see exactly what they saw
    before. The §8 rule is *content in the initial HTML* — not *zero bytes of JS*.
  - **Escape hatch:** GoatCounter is open source (single Go binary + SQLite). If the hosted
    service disappears or starts charging, self-host it; the `data-goatcounter` endpoint URL is
    the only thing that changes.
- **Domain & Hosting:** unhappypath.dev (purchased, Cloudflare Registrar) → **Cloudflare Pages** free tier.

### Deferred (with bring-back triggers)
| Deferred | Bring back when |
|---|---|
| Dark-mode toggle + persistence | Someone actually misses it |
| Tag rendering | ~20+ posts |
| Related posts | Same |
| Newsletter | Buttondown embed is the sanctioned path (not v1) |
| Share buttons, contact form | Never, probably |
| Richer analytics (Plausible $9/mo, funnels, GSC-in-dashboard) | GoatCounter's numbers stop answering a question you actually have |
| Self-hosted GoatCounter | The hosted free tier goes away or starts charging |

---

## 8. Discoverability — SEO & AEO

Goal: findable, readable, and **citable** by human search (Google/Bing) and AI consumers
(ChatGPT/Perplexity/AI Overviews, agent fetches) alike. Full cited research with confidence
labels: `seo-aeo-research.md`. The distilled rules:

### The one structural fact
Major AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot) do **not**
execute JavaScript. Astro's static HTML output already makes the whole site legible to
them — **keep all content in the initial HTML, never behind client-side islands.** This
falls out of the zero-JS principle (§2.3) for free; don't break it later.

### robots.txt posture (wants-to-be-cited personal blogger)
- Allow everything by default. **Never block** `Googlebot`, `Bingbot`, or the answer-engine
  bots: `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` (blocking OAI-SearchBot removes
  the site from ChatGPT search answers).
- Training bots (`GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`) are
  a separate, personal call — blocking them does NOT affect search/answer citability.
  Default for v1: allow all; revisit if it starts to bother.
- **Gotcha — Cloudflare silently blocks AI crawlers on new zones** and can serve a managed
  robots.txt (`ai-train=no`) on your behalf. Auditing **AI Crawl Control / bot settings /
  managed robots.txt** in the Cloudflare dashboard is a launch-checklist item, or the whole
  AEO story fails invisibly.
- Skip `llms.txt`: it's a proposal, not a standard — Google explicitly says no special AI
  files are needed, and measured data shows ~97% of llms.txt files get zero AI-bot traffic.

### Machine-legible markup
- **JSON-LD** (Google's recommended format): `BlogPosting` on each post (with `author` →
  `Person` + `url`, `datePublished`/`dateModified`), `Person` + `WebSite` on the homepage.
  No `FAQPage` (restricted by Google since 2023), no other schema-gallery tourism.
- **Per page:** one unique, descriptive `<title>` + meta description; canonical URL.
- **OG tags everywhere:** `og:title`, `og:type`, `og:description`, `og:url`, `og:image` +
  `twitter:card`. **Amends §7's "no OG images":** ship ONE site-wide static 1200×630
  `og:image` (site name + tagline). Per-post generated images stay out of v1.
- **Dates for real:** visible publish/updated dates on posts, `<time datetime>`, accurate
  sitemap `lastmod` (Google uses `lastmod` only if truthful; ignores `priority`/`changefreq`).
- **Semantic HTML:** one H1 per page, logical H1→H2 hierarchy, landmarks, descriptive alt
  text, crawlable `<a href>` links — already required by §2.6; it's also the AEO play.

### Authorship / E-E-A-T (reconciled with the "no big name" rule, §1)
Google's guidance explicitly asks whether authorship is self-evident and where bylines lead.
The site-identity-first branding stays, but:
- Each post carries a **small byline** ("Oded Messer") linking to the homepage About section.
- `Person` JSON-LD carries the entity data (name, `sameAs`: GitHub + LinkedIn URLs) so
  machines get full authorship without the humans seeing a billboard.

### Plumbing
- Hand-rolled sitemap (ADR-0004) + `@astrojs/rss` — **full-content** feed, not summaries
  (feeds both human subscribers and AI ingestion).
- Pick one URL form (trailing slash or not) and enforce it everywhere: Astro `trailingSlash`
  config, rss() helper, canonicals, sitemap, internal links.
- Ensure `*.pages.dev` preview domain doesn't get indexed as a duplicate (canonical to
  unhappypath.dev).
- Register in **Google Search Console AND Bing Webmaster Tools** (Bing feeds the ChatGPT
  ecosystem; Google still doesn't support IndexNow). Submit the sitemap to both. Oded's task.

### Answer-shaped writing (content guideline, not code)
Direct answer/summary near the top of a post; headings that match questions people actually
ask. Google's own line: there is no special optimization for AI Overviews — fundamentals are
the optimization.

### Wasted effort — explicitly skipped
`meta keywords` (dead since 2009) · llms.txt (see above) · sitemap `priority`/`changefreq` ·
word-count targets · thin tag pages · FAQPage markup · chasing perfect Core Web Vitals scores
on an already-static site · keyword stuffing (spam-policy violation, not just useless).

---

## 9. File Checklist for Implementation

You will need:
- This specification (the present file)
- `implementation-hints.md` (stack/infra decisions)
- `seo-aeo-research.md` (cited sources behind §8)
- Wireframe images (with §6 drift warnings in mind)
- Markdown content for bio, projects data, notes, fun links

Open TODOs (Oded):
- [x] Personal email address for `/contact`
- [ ] Cloudflare dashboard: audit AI Crawl Control / bot-blocking / managed robots.txt (§8 — else AEO silently fails; also §7 analytics layer 1)
- [ ] Register site in Google Search Console + Bing Webmaster Tools, submit sitemap (§8, post-launch; §7 analytics layer 1) — steps: `docs/register-search-consoles.md`
- [x] Create GoatCounter account, confirm the site code (`GOATCOUNTER_CODE = 'unhappypath'` in `src/consts.ts`) (§7 analytics layer 2)
- [x] GoatCounter → Settings: enable "ignore my own pageviews" so local/dev traffic stays out of the numbers
- [x] Pick hero tagline (`Software engineering hijinks`)
- [x] Bio text (homepage About)
- [x] Profile photo file (`public/avatar.jpg`)
- [x] First note from LinkedIn conversion (`staff-archetypes-and-ai`)
- [x] Three projects curated and Fun Links polished
- [ ] More notes (wave 2)
- [ ] Confirm git remote URL under "crd" before any push (do not push unasked)

---

**Ready to implement.**
Follow the section order and content rules above, and keep everything Markdown-driven.

— End of Specification —

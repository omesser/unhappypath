# CONTEXT — unhappy path

Personal site of Oded Messer. Static Astro 7, Markdown content,
Cloudflare Pages, zero client-side JS for rendering (one async analytics beacon is the
sole exception — ADR-0008). Site identity leads; the person's name is deliberately
small and rare.

**Spec precedence:** `spec/unhappy-path-website-spec.md` > `spec/implementation-hints.md` >
the wireframe JPGs. ADRs in `docs/adr/` record the build decisions neither spec file made,
and a few that overrule the spec once Oded had used the thing — ADR-0010 (the section is
"notes", not "writing") and ADR-0011 (sticky header, scroll rail) are both of that kind.

## Glossary

Use these words. The synonyms listed as wrong are wrong on purpose — they drift the brand
or the routing.

| Term | Meaning | Not |
|---|---|---|
| **unhappy path** | The site identity. Lowercase, two words, in prose and in the logo. | "Unhappy Path", "UnhappyPath". `unhappypath` is only the domain and repo name. |
| **site identity leads** | The rule from spec §1: no personal name in large type anywhere. Name appears in the footer and in per-post bylines only. | A hero that says "Hi, I'm …" |
| **notes** | The prose collection. Route `/notes`, collection `notes`, heading "Notes". | "writing" (the old name — ADR-0010), "blog", "posts" (as a section name), "articles" |
| **post** | One entry inside notes. Fine in code (`post.data.title`) and in `/notes/[slug]`. | "article", "entry" |
| **projects** | 4–8 hand-curated cards, one Markdown file each. Signal over quantity. | "portfolio", "work" |
| **fun links** | The curated rabbit-holes list; one Markdown file, hand-written bullets. Heading "Fun Links". | "resources", "bookmarks", "links" (too generic) |
| **stub** | Clearly-marked TODO placeholder content shipped in v1 and swapped out later. | "lorem", "dummy data" |
| **measure** | The prose line-length limit, ~65–70ch. Exposed as CSS `--measure`. | "container width", "max-width" |
| **SEO** | Findability in Google/Bing. | — |
| **AEO** | Being *citable* by answer engines (ChatGPT, Perplexity, AI Overviews). Overlaps SEO but is a separate goal with its own rules (spec §8). | using "SEO" for both |
| **answer engines** | `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`. **Never blocked** — blocking removes the site from AI answers. | lumping with training crawlers |
| **training crawlers** | `GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`. Blocking them does not affect citability; it's a personal call. v1 allows all. | — |
| **byline** | The small "Oded Messer" on each post, linking to the homepage About section. Exists for E-E-A-T, reconciled with site-identity-leads. | a big author card |
| **deferred** | Spec §7's table of things cut from v1 *with a named bring-back trigger*. | "won't do", "out of scope" |

## Where things live

| Path | What |
|---|---|
| `spec/` | The authored specification, implementation hints, wireframes, SEO research |
| `docs/adr/` | Build decisions (this session's output) |
| `docs/register-search-consoles.md` | How to register Google Search Console + Bing Webmaster |
| `src/content/notes/` | Posts — one folder per post, `index.md` + colocated images |
| `src/content/projects/` | One `.md` per project card |
| `src/content/fun-links.md` | The whole Fun Links list, hand-written |
| `src/styles/global.css` | Palette custom properties, typography, light + dark |
| `src/components/` | The shared bits — currently just `PostList.astro` |
| `src/utils.ts` | Date formatting, `postPath()`, `cleanPath()`, the `Person` JSON-LD node |
| `src/consts.ts` | Tagline, contact email, analytics code, nav — remaining `TODO(oded)` knob is tagline |
| `scripts/` | `check-urls.mjs` (runs in `npm run check`), `contrast.mjs`, `render-assets.mjs` |
| `public/og.png` | The single site-wide social card, rendered from `spec/og.svg` |

## Open TODOs owned by Oded

Tracked in spec §9. Live ones: tagline pick, project curation, first posts, fun links,
Cloudflare **AI Crawl Control** audit (else AEO fails silently), Google Search Console +
Bing Webmaster registration (see `docs/register-search-consoles.md`). Contact email, bio,
GoatCounter (`unhappypath`), and profile photo (`public/avatar.jpg`) are set.

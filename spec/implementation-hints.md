# Implementation Hints — decisions from the planning session (2026-07-16)

Companion to `unhappy-path-website-spec.md`. The spec defines WHAT to build;
this file pins down the decisions the spec left open, plus context and gotchas
from the research session. Where the two conflict, the spec wins on design,
this file wins on stack/infra.

## Wireframe asset mapping

The spec references wireframes by descriptive name; the actual files here are:

- `2Lhuw.jpg` — desktop homepage wireframe (light mode)
- `iebYd.jpg` — mobile homepage wireframe (light mode)

## Stack (decided)

- **Astro 7** (7.0.x is current, released June 2026). Requires **Node 22+**.
- Start from the **official Astro blog skeleton** (`npm create astro -- --template blog`)
  for the plumbing only: content collections, RSS, sitemap. Adapt collection
  name to `notes` per spec routes (`/notes/[slug]`) — renamed from `writing` by ADR-0010.
- **Hand-craft the design** from the spec + wireframes. Explicitly do NOT use a
  theme from template galleries (statichunt/Dante/AstroPaper etc.) — Oded
  reviewed that path and found it generic ("lacks character"). The wireframes
  and spec §2 are the design authority.
- Content: Markdown; use **MDX** only if/when a post needs embedded components.
  Images inside articles: co-locate with the post and let **astro:assets**
  handle optimization/lazy-loading — "easy embedded images" was a top-3
  priority.
- Fonts: per spec §7, system stack or ONE variable font (Inter/Geist). If a
  webfont is used, self-host via `@fontsource-variable/*` — no external font CDN.
- Animations: spec §2 says none, and that wins for v1. (Oded rated animations
  "nice to have" only. Astro View Transitions are the sanctioned upgrade path
  later; respect `prefers-reduced-motion`.)

## Hosting & domain (decided, partially done)

- **Domain: unhappypath.dev — ALREADY PURCHASED** (2026-07-16, Cloudflare
  Registrar, ~$12/yr). Lives in Oded's Cloudflare account.
- **Hosting: Cloudflare Pages free tier** (unlimited bandwidth; 500 builds/mo,
  irrelevant here). Rejected: Netlify (free tier squeezed in Apr 2026 pricing
  change), Vercel (Hobby is non-commercial + credit card), GitHub Pages (fine
  fallback, fewer batteries).
- Deploy flow: push repo to remote → Cloudflare dashboard → Workers & Pages →
  import Git repo (auto-detects Astro; build `npm run build`, output `dist/`) →
  add custom domain `unhappypath.dev`. DNS + SSL are automatic since the domain
  is in the same Cloudflare account. These dashboard clicks are Oded's to do.
- Git repo is already initialized locally (no commits yet). The remote will
  live under **"crd"** (Oded's account/org — confirm exact remote URL with him
  before pushing; do not create or push a remote unasked).

## Priorities (Oded's ranking, verbatim intent)

1. Minimum hassle to edit/add content
2. Well supported / maintained stack
3. Looks good, nice to read, easy embedded images in articles
4. Flexible & extendable
5. Site animations — nice to have only

## Reference sites & tone

- Role models (essay-first engineering-leadership sites): archive.lethain.com
  (Will Larson), blog.pragmaticengineer.com, deanondelivery.com, aihero.dev
  (Matt Pocock). Fingerprinted: they run Buttondown / Ghost 6 / WordPress /
  Next.js+Kit respectively — i.e., newsletter-first writing platforms. The
  static-Astro choice is deliberate anyway (free, git-native, no intrusions).
- **Future newsletter**: the sanctioned path is a Buttondown embed (what
  Larson uses; free ≤100 subscribers, $9/mo at 1k). Not in v1 scope.
- Voice/register: wry-but-warm engineering humor, not bitter. The name is a
  testing/error-branch pun; the site self-deprecates, the content stays
  sincere. Runner-up domain candidates, usable as in-joke material (404 page,
  taglines): "out of scope", "eventually consistent", "off by one",
  "cannot reproduce". 404 page idea from the session: "404 — you have reached
  the unhappy path. (Working as intended.)"
- Anti-goals: ads, trackers (analytics only if privacy-friendly, per spec),
  dirty URLs, gallery-theme genericness, corporate fluff.

## Gotchas learned this session

- **Astro 7 breaking changes**: new Rust compiler parses HTML strictly — it no
  longer silently fixes invalid markup. Node 22 minimum.
- **.dev is HSTS-preloaded**: browsers force HTTPS on the whole TLD. Local dev
  on localhost is unaffected, but never emit `http://` links to .dev domains.
- Domain-availability checks via RDAP lie (registry endpoint 404s ≠ available,
  premium tiers invisible) — irrelevant now the domain is bought, but don't
  re-derive availability claims from RDAP if more domains come up.

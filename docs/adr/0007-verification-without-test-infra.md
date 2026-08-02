# ADR-0007: Verification without test infrastructure

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

The site has zero client-side JS and no application logic — no branches, no parsers, no money
or auth paths. What it does have are correctness requirements that are invisible unless
checked: WCAG AA contrast (spec §2.6), keyboard focus states, all content present in the
initial HTML for non-JS-executing AI crawlers (spec §8), and valid RSS/sitemap/canonicals.

## Decision

`npm run check` = `astro check && astro build && node scripts/check-urls.mjs`, and it must pass
with zero errors. `astro check` covers TypeScript and the content-collection schemas, so a
malformed project frontmatter or a broken content reference fails there.

`scripts/check-urls.mjs` was added during implementation — a ~65-line, zero-dependency script
that asserts the output invariants which fail *silently*: every canonical/`og:url`/sitemap/feed
URL is in the one canonical form (ADR-0004), every page has a canonical, and every feed item
carries full content (spec §8). It earned its place immediately by catching two real defects
the rendered pages looked fine with. This is not the CI browser automation rejected below; it
reads `dist/` and needs no browser.

`scripts/contrast.mjs` is the other one: it computes the WCAG ratio for every colour pair the
stylesheet actually uses, so the palette claim below is arithmetic rather than an opinion.

Hand-verified before the PR, and re-verified whenever the palette or layout changes:

- contrast ratios **computed** (not eyeballed) for every foreground/background pair, ≥4.5:1 for
  body text, in light **and** dark
- keyboard tab order across all pages, with a visible focus ring on every interactive element
- both `prefers-color-scheme` states render correctly
- every internal link resolves
- view-source confirms all content is in the initial HTML — nothing behind a client island
- RSS validates and carries full content (not summaries); sitemap `lastmod` values are truthful;
  canonicals point at `unhappypath.dev` with no trailing slash

Rejected: axe-core plus a link crawler in CI (pulls in Playwright and config to guard eight
static pages), and Lighthouse CI budgets (spec §8 names chasing Core Web Vitals on an
already-static site as wasted effort).

## Consequences

- No test dependencies, no test config, no fixture upkeep.
- Accessibility and AEO correctness rest on a disciplined manual pass; the checklist above is
  the record of what that pass covers.
- Bring back automation if client-side JS or genuine logic ever enters the site.

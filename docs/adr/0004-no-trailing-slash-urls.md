# ADR-0004: URLs carry no trailing slash

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

Spec §8 requires one URL form enforced across the Astro config, canonical tags, the sitemap,
the RSS feed and every internal link — inconsistency here creates duplicate-content
ambiguity for both search and answer engines — but it does not pick which form.

## Decision

`trailingSlash: 'never'` with `build.format: 'file'`.

```js
// astro.config.mjs
site: 'https://unhappypath.dev',
trailingSlash: 'never',
build: { format: 'file' },
```

Output is `contact.html`, `writing.html`, `writing/<slug>.html`, served as `/contact`,
`/writing`, `/writing/<slug>`.

A side benefit decided it: `src/pages/404.astro` compiles to a root **`404.html`**, which is
exactly the filename Cloudflare Pages looks for. Astro's default `directory` format emits
`404/index.html` instead.

## Implementation notes

Two things fought this decision and both were caught by building and inspecting `dist/`:

1. **`build.format: 'file'` makes `Astro.url.pathname` carry the output filename**, so
   canonicals and `og:url` came out as `/writing/foo.html` while the sitemap and JSON-LD used
   the clean form — exactly the duplicate-content ambiguity this ADR exists to prevent. Fixed
   with `cleanPath()` in `src/utils.ts`; every emitted URL goes through it.
2. **`@astrojs/rss` appends a trailing slash** to item links unless passed
   `trailingSlash: false`.

Because both failures are invisible in a rendered page, `scripts/check-urls.mjs` runs after
every build (part of `npm run check`) and fails on any `.html` or trailing-slash URL in a
canonical, `og:url`, the sitemap or the feed.

**Sitemap:** hand-rolled at `src/pages/sitemap.xml.ts` rather than `@astrojs/sitemap`, which
spec §8 named. The integration cannot see content dates, and spec §8 also requires truthful
`<lastmod>` — the endpoint reads the collection directly and emits `updatedDate ?? pubDate`.
25 lines, one fewer dependency, and exact control over the URL form. `priority`/`changefreq`
are omitted deliberately: Google ignores them.

## Consequences

- Canonicals, sitemap entries, RSS `link`s and internal `href`s are all written without a
  trailing slash. `postPath()` in `src/utils.ts` is the single place a post URL is built —
  pages, feed and sitemap all call it, so the form cannot drift between them. Anything new that
  builds a URL goes there too, or `check-urls.mjs` fails the build.
- The 404 page carries `noindex` and no canonical: an error page is not a destination, and
  canonicalising it invites indexing a soft 404.
- The `*.pages.dev` preview domain must canonical back to `unhappypath.dev` so previews are
  not indexed as duplicates (spec §8).
- `.dev` is HSTS-preloaded: never emit an `http://` URL for this domain.

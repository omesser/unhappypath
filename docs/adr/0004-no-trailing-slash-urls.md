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

## Consequences

- Canonicals, sitemap entries, RSS `link`s and internal `href`s are all written without a
  trailing slash. Any future helper that builds URLs must match.
- The `*.pages.dev` preview domain must canonical back to `unhappypath.dev` so previews are
  not indexed as duplicates (spec §8).
- `.dev` is HSTS-preloaded: never emit an `http://` URL for this domain.

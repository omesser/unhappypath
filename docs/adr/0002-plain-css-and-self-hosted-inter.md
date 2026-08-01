# ADR-0002: Plain CSS with custom properties, and self-hosted Inter

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

The spec pins the design precisely (a ~65–70ch measure, one variable font, light default with
`prefers-color-scheme` dark, zero client-side JS) but never says how to author the CSS. The
whole site is roughly eight static pages with no interactive state.

Spec §7 pins Inter via `@fontsource-variable/inter`; `implementation-hints.md` had left the
door open to a system font stack.

## Decision

**Plain CSS.** One `src/styles/global.css` holding the palette as custom properties — a light
`:root` block and a `@media (prefers-color-scheme: dark)` override — plus Astro's built-in
scoped `<style>` blocks in each component for layout local to that component.

**Self-hosted Inter**, latin subset, one preloaded `woff2`. No font CDN.

*Mechanism revised during implementation:* Astro 7 has a first-party `fonts:` config with
`fontProviders.fontsource()` and a `<Font preload />` component. It downloads the font at
build time and serves it from our own origin, emits the `@font-face` and the preload link,
and generates metric-matched fallbacks. Same decision, one fewer dependency than
`@fontsource-variable/inter` — the platform feature beats the package. The build now needs
network access to fetch the font (Cloudflare and Actions both have it); an offline build
would need `fontProviders.local()` with the `woff2` committed.

Tailwind was rejected: it adds a dependency and a build step, needs a second dependency
(`@tailwindcss/typography`) just to satisfy the spec's reading rules, and utility-dense markup
works against the "still looks intentional in 2030" goal.

The system font stack was rejected despite costing zero bytes: when typography *is* the design,
having macOS, Windows and Android readers each see different line lengths and vertical rhythm
undermines the point.

## Consequences

- Zero styling dependencies; nothing in the CSS pipeline to upgrade or migrate.
- Palette values are chosen by computing contrast ratios against WCAG AA (≥4.5:1 body text),
  not by eye — in both light and dark.
- Dark mode has no toggle and no JS, per spec §2.2. Bring-back trigger is in spec §7.
- One same-origin font request. No third-party dependency, no privacy exposure.

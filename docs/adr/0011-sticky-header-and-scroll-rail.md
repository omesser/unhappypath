# ADR-0011: Sticky header and a CSS-only scroll rail

- **Date:** 2026-08-03
- **Status:** Accepted
- **Amends:** spec §2.3's "no animations" and §3's minimal-chrome rule. Does **not** amend
  §2.3's zero-JS rule — neither change ships a byte of script.

## Context

The homepage is one long single column whose five sections are nav anchors, not pages
(spec §4, §3). Two problems fall out of that shape, both reported by Oded from actually
using the site:

1. The header scrolled away with the content. Following a nav link therefore jumped you
   into the middle of the page *and* took the menu with it, so the next section needed a
   scroll back to the top. The nav is the only way between sections; losing it after one
   use makes it close to single-use.
2. Nothing told you where you were. On a page with no pagination and no visible structure
   past the current viewport, there is no cue for how much is left.

## Decision

**Sticky header.** `position: sticky; top: 0` with an opaque `background: var(--bg)` and
`z-index: 2`, plus `scroll-margin-top: 5.5rem` on `section` so an anchor jump lands the
heading below the header rather than underneath it. `.skip:focus` moves to `z-index: 3`,
or the first Tab would land behind the header.

The header is only as wide as `--measure`, so its background does not span the viewport —
which does not matter, because the band it sits in is the page background in the same
colour, and nothing on the site renders outside the measure column (tables and code blocks
scroll inside it). A `border-bottom` would expose the seam; there isn't one.

**Scroll rail.** A 3px `position: fixed` hairline on the right edge that fills top-to-bottom
as the page scrolls, driven by `animation-timeline: scroll(root block)` — a CSS scroll-driven
animation. No JS, no scroll listener, no layout thrash, and it runs off the main thread.

Wrapped in `@supports (animation-timeline: scroll())` with the element `display: none` by
default. Without the gate, a browser lacking scroll timelines drops the
`animation-timeline` declaration, falls back to the document timeline, and paints a
permanently full bar — an indicator that lies is worse than no indicator. No support, no
rail.

`aria-hidden="true"`: it duplicates the scrollbar's information for sighted users and has
nothing to say to a screen reader.

It is exempted from the `prefers-reduced-motion` animation reset. The rail is scroll-linked,
not autonomous — it moves only as far as the reader scrolls, which is not the motion that
query guards against. The exemption is required because the blanket
`animation-duration: 0.01ms !important` would otherwise snap it to full.

## Alternatives

**A section rail with the current section highlighted** — the richer orientation cue, and
achievable without JS via per-section `view-timeline`s. Rejected for now: five sections'
worth of timeline plumbing to replace a cue the progress bar already gives, on a page that
is not yet long enough to get lost in. Bring it back if the homepage grows past its current
five sections.

**JS scroll listener / IntersectionObserver** — rejected outright. ADR-0008 admitted exactly
one script and said in writing that it is not precedent for a second.

**Nothing at all** — the honest lazy answer, and it was overruled: the request came from
using the page, not from imagining a feature.

## Consequences

- Spec §2.3's "no animations" now has one exception, and it is scroll-linked rather than
  autonomous or decorative. A second animation is a new decision; this ADR is not
  precedent for it, on the same terms ADR-0008 set for scripts.
- The rail has a browser support floor (scroll-driven animations). Below it the site is
  unchanged, not broken — which is why the `@supports` gate is load-bearing rather than
  belt-and-braces.
- `scroll-margin-top` is a magic number tied to the header's height. If the header's
  padding or font size changes, it needs changing too; the comment in `global.css` says so.
  When the nav wraps to a second line on narrow screens the header grows past 5.5rem, and
  the section's own 2.25rem top padding absorbs the difference.
- Still zero client-side JS for rendering. The GoatCounter beacon remains the only script.

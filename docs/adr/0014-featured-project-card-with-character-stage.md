# ADR-0014: Featured project card with a character stage

- **Date:** 2026-09-28
- **Status:** Accepted
- **Amends:** spec §2.3's "no animations" (a second exception after ADR-0011) and §4.2's
  uniform 2-column card grid. Does **not** amend §2.3's zero-JS rule.

## Context

Oded asked for the Fidget card, his latest active project, to be presented in "an exciting
way", and then for its characters to move inside the card and take turns. Fidget is a
desktop mascot engine with eight shipped characters. Showing them is more convincing than
describing them, and it costs no script.

## Decision

A project may list `sprites` in its frontmatter, colocated at `src/content/projects/<slug>/`.
Each sprite is `{ src, walks }`. A card with sprites is the featured card:

- It spans both grid columns (`grid-column: 1 / -1`).
- A stage strip inside the card, above the tags, gives each sprite one six-second turn per
  cycle. A `walks` sprite crosses the stage left to right, so its GIF must face right. The
  others fade in, perform in the middle, and fade out.
- A keyframe percentage cannot be a CSS variable, and a turn's share of the cycle depends on
  the cast size. `index.astro` emits the two keyframes (`walk`, `perform`) inline for the
  card's sprite count, and each sprite's `animation-delay` is its turn's start.
- Hover or keyboard focus inside the card pauses the show (WCAG 2.2.2 Pause, Stop, Hide).
- Under `prefers-reduced-motion: reduce`, the animations are `animation: none`, and only the
  first sprite shows, swapped by a `<picture>` source for the committed `still` PNG. The
  global reset alone is not enough: it shortens the duration but keeps the infinite
  iteration, so the cast would flicker. The still is a committed file because `getImage()`
  on an animated GIF keeps every frame, stacked into one tall image.
- The stage is decorative (`aria-hidden`, `alt=""`). The card text carries the meaning.

## Consequences

- Spec §2.3 now has two animation exceptions. This one is autonomous and decorative, so it is
  held to one card. A third animation is a new decision; this ADR is not a precedent.
- Featured is inferred from `sprites`, not a separate flag. Only one card should carry
  sprites. If two ever do, both span the grid, which is the moment to add an explicit field.
- The cast is about 140 KB of GIFs, loaded lazily. Characters other than Buddy Bot, Nim, and
  Timber Wolf adapt third-party art that declares no license. Fidget's own README shows the
  same art, and Oded chose to include all eight.
- Revert by deleting `sprites` and `still` from the project's frontmatter; the card falls back
  to a normal grid cell.

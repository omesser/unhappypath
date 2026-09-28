# ADR-0014: Featured project card with a walking sprite

- **Date:** 2026-09-28
- **Status:** Accepted
- **Amends:** spec §2.3's "no animations" (a second exception after ADR-0011) and §4.2's
  uniform 2-column card grid. Does **not** amend §2.3's zero-JS rule.

## Context

Oded asked for the Fidget card — his latest active project — to be presented in "an exciting
way". Fidget is a desktop mascot that walks along the top edges of windows. A plain card
describes that; showing it is more convincing and costs no script.

## Decision

A project may set an optional `sprite` image in its frontmatter, colocated at
`src/content/projects/<slug>/`. A card with a sprite is the featured card:

- It spans both grid columns (`grid-column: 1 / -1`).
- The sprite perches on the card's top border and paces left and right with a CSS keyframe
  animation, mirrored on the walk back. The card is the "window" it perches on.
- Hover or keyboard focus inside the card pauses the walk (WCAG 2.2.2 Pause, Stop, Hide).
- Under `prefers-reduced-motion: reduce`, the walk is `animation: none` and a `<picture>`
  source swaps the GIF for a still PNG of its first frame, built at build time by
  `getImage()`. The global reset alone is not enough: it shortens the duration but keeps the
  infinite iteration, so the sprite would teleport.
- The sprite is decorative (`alt=""`, `aria-hidden`). The card text carries the meaning.

## Consequences

- Spec §2.3 now has two animation exceptions. This one is autonomous and decorative, so it is
  held to one card. A third animation is a new decision; this ADR is not a precedent.
- Featured is inferred from `sprite`, not a separate flag. Only one card should carry a
  sprite. If two ever do, both span the grid, which is the moment to add an explicit field.
- Revert by deleting the `sprite` line from the project's frontmatter; the card falls back to
  a normal grid cell.

# ADR-0003: Markdown-only content model

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

Oded's #1 stated priority is "minimum hassle to edit/add content", and he requires the ability
to do real Markdown work when dropping in new prose: structure, formatting, inline links,
embedded media.

Posts were never in question. The open part was the two *structured lists*: Projects (4–8
cards, ~5 fields each) and Fun Links (5–10 items, each a title + a reason + a URL). YAML data
files with Zod schemas were proposed and rejected — "content should be markdown files, not
YAML".

## Decision

Everything is Markdown.

| Content | Shape |
|---|---|
| Posts | `src/content/notes/<slug>/index.md` — frontmatter + full Markdown body, images colocated in the same folder |
| Projects | `src/content/projects/<slug>.md` — frontmatter (`title`, `github`, `live`, `tags`, `order`), body is the card description, so it can carry inline links and emphasis |
| Fun Links | `src/content/fun-links.md` — one hand-written Markdown file; `###` headings group, bullets are the items. No schema. |

Fun Links uses `###`, not `##`: the file renders inside the homepage's "Fun Links" `<h2>`, so
`##` would emit sibling h2s and break the H1→H2→H3 hierarchy spec §8 requires.

Fun Links gets no per-item schema because spec §4.4 asks for "a simple bulleted list" — a file
per bullet would be ten files for ten lines.

**MDX is not installed.** Plain `.md` already covers headings, lists, tables, code fences,
inline links, `astro:assets`-optimized colocated images, and raw HTML (so a YouTube `<iframe>`
or `<video>` works inline). MDX is a one-line integration and the collection accepts both
extensions, so the day a post genuinely needs an Astro component, adding it breaks nothing.

## Consequences

- Project frontmatter is Zod-validated; a missing URL or a typo'd field fails the build rather
  than rendering a broken card.
- Card descriptions render through the Markdown pipeline, so they are inline HTML, not strings.
- Ordering is explicit via an `order` field, not implicit from filenames or dates.
- `tags:` stays in post frontmatter but renders nowhere until ~20+ posts (spec §4, deferred).
- Reading time is **not** implemented — spec §4 marks it optional.
- A `draft:` frontmatter flag is **not** implemented. Unfinished posts live on a branch, which
  gets a Cloudflare preview deploy — so a WIP post is readable in the real layout at a real URL,
  which a filtered-out draft would not be. Note the consequence: Cloudflare builds `main` on
  every push, so `main` *is* production and cannot hold unfinished content. Merging a batch
  while holding one post back is therefore not possible; that post waits on its own branch.
  Per-post folders mean those branches do not conflict with each other.

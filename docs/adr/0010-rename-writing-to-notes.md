# ADR-0010: The prose section is "notes", not "writing"

- **Date:** 2026-08-03
- **Status:** Accepted
- **Supersedes:** the `writing` glossary entry in `CONTEXT.md`; the section name and
  routes in spec §3, §4.3, §4 (routes table), §5; ADR-0001's note that the template's
  `blog` collection was renamed `writing`.

## Context

"Writing" names the author's activity, not the reader's. Oded's objection, verbatim:
*"I'm writing, the reader is reading."* A section label is read by visitors, so it should
name the thing they are about to read rather than the work that produced it.

He floated "thoughts" and "short-reads" and asked for a recommendation.

## Decision

**"Notes"** — route `/notes`, collection `notes`, heading "Notes", nav label "Notes".

Rejected, both proposed:

- **"Thoughts"** fails the same test that sank "Writing": thoughts are the author's, not
  the reader's. It is also vaguer — a thought promises less than a note delivers.
- **"Short Reads"** is genuinely reader-framed, and that is its problem: it is a promise
  about length. The first 3,000-word piece makes the label a lie, and renaming a section
  after publication costs redirects.

"Notes" won on three counts: it names the artifact rather than either party's activity;
it is already the word the site uses for this content in `SITE_DESCRIPTION` and in the
homepage section intro ("Timeless notes on engineering, systems, and leadership"), so the
vocabulary converges instead of adding a fourth synonym; and it carries no promise about
length, register or cadence that future content could break.

## Consequences

- Renamed together, because ADR-0004's URL invariant means these cannot drift apart:
  `src/content/notes/`, `src/pages/notes.astro`, `src/pages/notes/[slug].astro`, the
  collection key in `content.config.ts`, `postPath()`, the sitemap and feed queries, the
  nav entry, and the `#notes` homepage anchor.
- **The rename is free exactly once — now.** Nothing is deployed, so no `/writing` URL has
  ever been served, indexed, or cited. After launch this would need permanent redirects
  and a period of split link equity, and spec §8's whole argument is about being citable.
  If the name is going to change again, it changes before the first push.
- `CONTEXT.md` lists "writing" in the *wrong-word* column, since the risk now is drifting
  back to the name that is all over this repo's git history.
- "Writing" stays correct as an ordinary English word — ADR-0009 licenses "the writing",
  and spec §1 still calls the site a writing home. Only the *section* is renamed.
- Post slugs are unchanged, so the two stub posts keep their filenames.

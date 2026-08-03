# ADR-0009: Split licensing — MIT for code, CC BY 4.0 for writing

- **Date:** 2026-07-30
- **Status:** Accepted

## Context

The repository holds two different kinds of work: the site implementation (Astro components,
CSS, config) and Oded's prose. MIT is a software license; applying it to essays would grant
permission to republish them verbatim, uncredited and commercially.

Spec §8's goal is to be *citable* — by other writers and by answer engines. Citation is
attribution, so an attribution-requiring content license is aligned with the goal rather than
in tension with it.

## Decision

- `LICENSE` — MIT, covering code. Copyright holder: Oded Messer.
- `LICENSE-CONTENT` — CC BY 4.0, covering everything under `src/content/` (posts, projects,
  links) and the wireframes/spec prose. Short file pointing at the canonical license deed
  rather than inlining the full legal code.
- `README.md` states the split in one line so it is discoverable without reading either file.

CC BY-NC-SA was rejected: it would block a paid newsletter from quoting at length, which is
precisely the kind of citation the site wants. All-rights-reserved was rejected for the same
reason. MIT-for-everything was rejected because it licenses away authorship of the prose.

## Consequences

- Anyone may quote, translate or repost the writing with credit and a link; nobody may strip
  the byline.
- Two license files instead of one, and the README must keep explaining which covers what.
- The per-post byline and `Person` JSON-LD (spec §8) are what make attribution practical.

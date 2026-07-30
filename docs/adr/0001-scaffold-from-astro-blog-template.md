# ADR-0001: Scaffold from the official Astro blog template

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

Astro 7.1.6 is current and requires Node ≥22.12.0, confirming the spec's stack choice.
Two starting points were considered: `--template minimal` plus hand-added plumbing
(content collections, RSS, sitemap — roughly 30 lines total), or `--template blog`, which
wires that plumbing but also ships a full design: example posts, `about`/`blog` pages, a
component set (BaseHead, Header, Footer, HeaderLink, FormattedDate), its own palette, and
placeholder images. Every one of those design artifacts contradicts the spec and would be
deleted.

`implementation-hints.md` explicitly decided the blog skeleton "for the plumbing only".

## Decision

Use the **official Astro blog template**, then strip its design down to the spec.

The minimal template was recommended on the grounds that deleting a design costs more than
writing 30 lines of plumbing. Oded overruled it: the hints file is the standing decision on
stack, and re-litigating it here is not worth the divergence.

## Consequences

- The template's RSS, sitemap and content-collection wiring is inherited rather than authored.
- A deliberate strip-out pass is required: its components, CSS, example content and images go.
- Its `blog` collection is renamed `writing` to match spec routes (`/writing/[slug]`).
- The design is hand-crafted from spec §2–§4 and the wireframes. No gallery theme (hints).

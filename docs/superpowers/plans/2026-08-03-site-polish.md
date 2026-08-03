# Site Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clarify the site hierarchy and prose, consistently handle external links, and close
the highest-impact deployment and documentation gaps without adding runtime complexity.

**Architecture:** Preserve the static Astro structure. Add one server-rendered external-link
component for Astro templates and one dependency-free rehype transform for Markdown links.
Use the existing generated-output checker as the regression surface.

**Tech Stack:** Astro 7, TypeScript, Markdown, Node 22, Cloudflare Pages.

## Global Constraints

- Keep the existing “Software engineering hijinks” tagline.
- Keep the About/landing section first with title and portrait.
- Keep Contact separate and keep the prose collection named Notes.
- Add no client JavaScript, CMS, Dockerfile, or external-link package.
- Preserve the user's unstaged project-link change as part of the final implementation.

---

### Task 1: Enforce external-link behavior

**Files:**
- Modify: `scripts/check-urls.mjs`
- Create: `src/components/ExternalLink.astro`
- Modify: `astro.config.mjs`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/styles/global.css`

- [x] Extend `check-urls.mjs` to fail when an off-site HTTP(S) anchor lacks `_blank`,
  `noopener noreferrer`, or the screen-reader cue.
- [x] Run the check against the current build and confirm it fails on existing links.
- [x] Add `ExternalLink.astro` and the local Markdown Sätteri transform.
- [x] Replace template-owned external anchors and add visually-hidden styling.
- [x] Rebuild and confirm the external-link assertions pass.

### Task 2: Clarify hierarchy and finish public copy

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/notes.astro`
- Modify: `src/consts.ts`
- Modify: `src/content/notes/staff-archetypes-and-ai/index.md`
- Modify: `src/content/fun-links.md`
- Modify: `src/content/projects/ai-goodies.md`
- Modify: `src/content/projects/stateseparator.md`
- Modify: `src/content/projects/coding-tasks.md`
- Delete: `src/content/projects/pmp-examples.md`
- Delete: `src/content/projects/dockerfiles.md`

- [x] Keep About first and label its section accessibly.
- [x] Move Notes above Projects and align the nav order and “Fun Links” wording.
- [x] Apply the approved copy edits without changing the tagline.
- [x] Remove public TODO text, humanize project titles, and retain only three projects.
- [x] Build and inspect the generated homepage, archive, note, and contact pages.

### Task 3: Harden build, analytics, media metadata, and runbooks

**Files:**
- Modify: `package.json`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/content.config.ts`
- Modify: `src/pages/notes/[slug].astro`
- Modify: `README.md`
- Modify: `docs/register-search-consoles.md`
- Modify: `spec/seo-aeo-research.md`
- Modify: `docs/adr/0007-verification-without-test-infra.md`
- Modify: `CONTEXT.md`
- Modify: `spec/unhappy-path-website-spec.md`

- [x] Make `npm run build` execute the complete quality gate and include contrast checks.
- [x] Gate GoatCounter out of Cloudflare preview builds.
- [x] Require `heroImageAlt` when `heroImage` exists and render it.
- [x] Replace every operator-facing `/sitemap-index.xml` reference with `/sitemap.xml`.
- [x] Update README and project-status documentation to match the implementation.
- [x] Run a preview-style build and confirm GoatCounter is absent.
- [x] Run the complete Node 22 build and confirm all checks pass.

## Self-review

- Every approved requirement maps to a task.
- No tagline change, separate About page, client script, or new dependency is included.
- External-link behavior is verified through generated HTML rather than source inspection.
- No commit step is included because the user did not request a commit.

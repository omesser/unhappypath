# ADR-0013: markdownlint for what a formatter cannot see

- **Date:** 2026-08-03
- **Status:** Accepted
- **Builds on:** ADR-0012 (Prettier in `npm run check`, not pre-commit)

## Context

ADR-0012 added Prettier, which *formats* Markdown — and only under `src/content/`, since
`docs/`, `spec/`, `CONTEXT.md` and `README.md` are deliberately excluded. Oded asked whether
Markdown was actually linted, and it was not. A formatter and a linter answer different
questions: Prettier will repad a table forever and never notice that a post jumped from `##`
to `####`, or that a code fence carries no language so Shiki cannot highlight it.

The requirement was explicit: JS-native, no second toolchain. `markdownlint-cli2` is that.

Run against the repo with stock rules it reported **711 violations**, which is why the rule
set below is the whole decision rather than an afterthought:

| Rule | Hits | Verdict |
|---|---|---|
| MD013 line-length | 553 | Off. Default is 80; prose here is hand-wrapped at ~95 |
| MD034 no-bare-urls | 56 | Off. All 56 are citations in `spec/seo-aeo-research.md` |
| MD060 table-column-style | 52 | Off. The hand-aligned pipes are the thing ADR-0012 kept |
| MD032/MD022/MD031/MD058 blanks-around-* | 42 | Off. Pure whitespace; Prettier owns it where it runs |
| MD029 ol-prefix | 4 | Off. Cosmetic |
| MD040 fenced-code-language | 2 | **On** — a fence with no language gets no highlighting |
| MD033 no-inline-html | 1 | Off. The `<iframe>` is a feature (ADR-0003) |
| MD041 first-line-heading | 1 | Off. Content bodies have no H1 by design |
| MD059 descriptive-link-text | 1 | **On** — fixed the one hit |
| **MD001 heading-increment** | **0** | **On** — free today, and it guards a defect already hit once |

## Decision

`markdownlint-cli2` as a devDependency, in `npm run check` beside `prettier --check`, with
`markdownlint-cli2 --fix` joining `npm run format`. Config in `.markdownlint-cli2.jsonc`,
where every disabled rule carries the reason inline.

**The split is: Prettier owns cosmetics, markdownlint owns semantics.** Every cosmetic rule
is off, because either Prettier already normalizes it or ADR-0012 decided the hand-aligned
version stays. What remains on are the rules that catch a *bug* — a broken heading ladder, an
unlabelled fence, an empty or reversed link, a duplicate heading, a dead fragment link.

**It lints everything, including `docs/` and `spec/`, which Prettier does not touch.** That
asymmetry is deliberate and is the point: a linter reports and does not rewrite, so covering
the authored documents costs no reformatting and no blame sweep. The objection in ADR-0012 was
to Prettier *editing* those files, not to anything reading them.

`MD001` is the rule worth the whole exercise. The heading-hierarchy defect it describes was
found by hand on `/notes` earlier in this session — `h1` followed by `h3` — and spec §8
requires a logical H1→H2→H3 ladder for exactly the AEO reasons the rest of §8 is about. It
reports zero violations today, so it is free, and it is the one guard that pays off on the
first real post.

## Consequences

- Three real violations were fixed to get to zero: two unlabelled `robots.txt` fences in
  `spec/seo-aeo-research.md` (now ```` ```robots ````) and one `[link]` in the kitchen-sink
  stub post, now descriptive.
- Verified by injecting a skipped heading level into a post and confirming
  `markdownlint-cli2` exits non-zero on it — the same way ADR-0007's link check was proven.
- A third devDependency, and the second linter in `npm run check`. Still one entry point:
  `npm run check` is the whole gate and CI runs exactly it.
- The disabled-rule list is the maintenance burden. If Prettier's scope ever widens to
  `docs/` and `spec/`, the cosmetic rules could come back on — they are off because of who
  formats what, not because they are wrong.
- `*.jsonc` joined the JSON override in `.prettierrc.json`, so config files stay at two
  spaces rather than the tabs the code uses.

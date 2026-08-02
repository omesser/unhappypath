# ADR-0012: Prettier inside `npm run check`, not pre-commit

- **Date:** 2026-08-03
- **Status:** Accepted

## Context

Oded is used to `pre-commit` from Python repos and missed having linters here — for shell,
line endings, YAML, JSON and so on. The question he asked was the right one: add
`pre-commit`, or wrap the same job in npm so the repo does not grow a second entry point?

What the repo actually contains, counted rather than assumed:

| Surface | Files | State |
|---|---|---|
| Shell scripts | **0** | nothing for `shellcheck` to lint |
| YAML | 1 | already Prettier-clean |
| JSON | 3 | already Prettier-clean |
| Markdown | 25 | 14 would change |
| `.astro` / `.ts` / `.js` / `.mjs` / `.css` | 13 | 7 would change |
| Line endings | all tracked files | already LF |

## Decision

**No `pre-commit`.** It is a Python toolchain on a Node-only repo, so it needs Python plus a
venv or pipx before it can run, and `.pre-commit-config.yaml`'s pinned `rev`s become a second
dependency set to bump beside `package-lock.json`. More decisively, **it would not run in
CI** — Actions runs `npm run check` and Cloudflare runs the build, so pre-commit would be
local-only enforcement that `--no-verify` walks past and the PR never sees. And its
distinctive value is the curated hook zoo, which has close to nothing to eat here: no shell
scripts, one YAML file, three JSON files, and not a single CRLF.

**Prettier as a devDependency, folded into `npm run check`.** One tool covers `.astro`,
`.ts`, `.js`, `.mjs`, `.css`, `.json`, `.yml` and Markdown. It is deliberately *not* a new
entry point: `npm run check` is already the one command (ADR-0007), the README documents it,
and CI already runs it on every PR — so this lands where pre-commit could not.
`npm run format` writes.

**Scope: code, config and site content — not the authored documents.** `.prettierignore`
excludes `docs/`, `spec/`, `CONTEXT.md` and `README.md`. Prettier does not rewrap prose
(`proseWrap: preserve` is the default), so the risk was never mangled sentences; what it does
is swap `*italic*` for `_italic_` and repad table pipes, with no option to disable the
former. Across 11 ADRs, both spec files and CONTEXT.md's glossary that is a blame sweep
buying a uniform emphasis character. `src/content/` **is** formatted: it is edited constantly
and benefits from the consistency, and `singleQuote: true` leaves its frontmatter alone.

**`.gitattributes` with `* text=auto eol=lf`** for line endings — the layer that *fixes* the
problem instead of a hook that reports it, and it costs one line and no tooling.

**No git hook.** CI failing the PR is the enforcement. If pre-commit-time feedback is ever
wanted, `core.hooksPath` plus a three-line script beats husky and lint-staged, which is two
more dependencies to guard forty files.

**No ESLint.** `astro check` already does the TypeScript pass, and there is no application
logic for lint rules to find. Revisit if real logic lands.

## Consequences

- `printWidth: 100` matches the house style but has no zero-churn setting: at 100 Prettier
  splits three long lines, and widening to 120 instead *joins* lines in `sitemap.xml.ts` and
  `rss.xml.js`. Adoption was one reformat commit either way.
- `scripts/contrast.mjs` carries two `// prettier-ignore` comments. The two palettes are one
  line each so they can be read as a pair; exploded to a property per line they stop lining
  up, which is the only thing they are for.
- `prettier-plugin-astro` reformats `{/* comment */}` in `.astro` files into a four-line
  expression block. Ugly, and left alone: the built output was compared byte for byte before
  and after formatting and is identical, so it is cosmetic.
- Two dependencies where ADR-0002 took pride in zero. Justified by a different problem than
  ADR-0002 was solving: this repo is edited across many sessions by several hands, and a
  formatter is the cheap way to keep style out of review.
- The authored documents are now formatted by hand and nothing checks them. Accepted — they
  are prose, and the build does not depend on their whitespace.

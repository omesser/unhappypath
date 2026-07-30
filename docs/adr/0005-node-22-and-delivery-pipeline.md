# ADR-0005: Node 22, Cloudflare Pages deploys, PR checks in Actions

- **Date:** 2026-07-29
- **Status:** Accepted

## Context

Environment facts as of this session:

- Astro 7.1.6 declares `engines.node >= 22.12.0`.
- The shell resolves to Node **v20.19.2** — too old. nvm has `22.13.0` (Jan 2025) available
  locally, Homebrew has `26.5.0`.
- Cloudflare Pages reads `.nvmrc` / `.node-version` from the repo, so one file pins local and
  CI together.
- The git remote **already exists**: `git@github.com:omesser/unhappypath.git`. This supersedes
  the spec §9 / hints TODO to "confirm the remote under crd". `gh` is authenticated as `omesser`.

## Decision

**Node:** `.nvmrc` contains `22` — the major line the spec documents, in maintenance LTS until
April 2027, floating to the newest 22.x patch so security fixes arrive without a bump.
`package.json` declares `"engines": { "node": ">=22.12.0" }`. Requires one local
`nvm install 22`. Pinning the already-installed `22.13.0` exactly was rejected as freezing an
18-month-old patch level.

**Deploys:** Cloudflare Pages Git integration. Push to `main` → build → `unhappypath.dev`.
Branches get preview deployments. Connecting the repo and adding the custom domain are
dashboard actions Oded performs.

**Checks:** a GitHub Actions workflow runs `npm run check` on pull requests. Cloudflare still
owns deployment; Actions never deploys. Running checks only in Cloudflare's build was proposed
as sufficient, but PR-time feedback was preferred.

**Branching:** work lands on `build/v1-site` and reaches `main` through a PR that Oded merges.
That is what makes the PR workflow and the preview deploy meaningful.

## Consequences

- Cloudflare's build environment and local dev resolve the same Node major.
- Two builds run per PR (Actions check + Cloudflare preview). Accepted for the earlier signal.
- No Cloudflare API token is stored in GitHub secrets; Actions has no deploy rights.
- The spec's "confirm remote under crd" TODO is closed by the fact recorded above.

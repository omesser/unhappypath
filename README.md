# unhappypath.dev

The Unhappy Path website. Static [Astro](https://astro.build), Markdown
content, deployed on Cloudflare Pages.

## Running it

Node 22+ (`.nvmrc` pins the major; `nvm use`).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site → dist/
npm run preview  # serve dist/ locally
npm run check    # prettier + markdownlint + astro check + build + URL/link check
npm run format   # apply formatting and auto-fixable lint
npm run assets   # re-render public/og.png from spec/og.svg (only after a tagline change)
```

There is no pre-commit hook and no second entry point: `npm run check` is the whole gate, and
CI runs exactly that on every PR.

Two tools split the job. **Prettier** formats code, config and `src/content/`; the ADRs, the
spec, `CONTEXT.md` and this file are hand-written and deliberately left alone (ADR-0012).
**markdownlint** lints *all* Markdown including `docs/` and `spec/` — it reports without
rewriting, so it costs those files nothing. It only enforces semantics: heading ladders, code
fences with a language, links that go somewhere (ADR-0013).

## Build

`npm run build` runs Astro's static build. Output is `dist/` (`build.format: 'file'` — see
ADR-0004), so pages land as `index.html`, `notes.html`, `notes/<slug>.html`, etc.

Cloudflare Pages project settings (Git integration):

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | from `.nvmrc` (`22`) |

No Wrangler config and no Cloudflare credentials in this repo — Pages builds from Git.

## Deploy

Cloudflare Pages owns deployment (ADR-0005). GitHub Actions only runs `npm run check` on
PRs; it never deploys.

| Event | What happens |
| --- | --- |
| Push / merge to `main` | Production deploy → [unhappypath.dev](https://unhappypath.dev) |
| Push to any other branch / open a PR | Preview deploy (Cloudflare gives a `*.pages.dev` URL) |

`main` is production. There is no `draft:` flag for posts — keep unfinished work on a
branch. Custom domain and the first Pages ↔ GitHub connect are dashboard one-time setup
in the Cloudflare account that holds `unhappypath.dev`.

## Adding content

| Want to add            | Do this                                                                        |
| ---------------------- | ------------------------------------------------------------------------------ |
| A post                 | `src/content/notes/<slug>/index.md`, images alongside it in the same folder   |
| A project card         | `src/content/projects/<slug>.md` — frontmatter + a one-line body                |
| A fun link             | Add a bullet to `src/content/fun-links.md`                                      |
| A draft                | Keep it on a branch — `main` is production, and there is no `draft:` flag       |

Everything else — bio, tagline, contact email, analytics code — lives in
`src/consts.ts`. Grep for `TODO(oded)` to find what still needs real content.

## Docs

- `CONTEXT.md` — glossary and layout
- `docs/adr/` — why the stack is what it is
- `docs/register-search-consoles.md` — Google Search Console + Bing Webmaster setup
- `spec/` — the specification the site was built from

## Licensing

Two licenses, because this repo holds two kinds of work:

- **Code** (components, styles, config) — MIT, see [`LICENSE`](./LICENSE).
- **Writing** (`src/content/`, `spec/`) — CC BY 4.0, see
  [`LICENSE-CONTENT`](./LICENSE-CONTENT). Quote it, translate it, republish it —
  with credit and a link.

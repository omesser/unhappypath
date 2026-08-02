# unhappypath.dev

Personal site of Oded Messer. Static [Astro](https://astro.build), Markdown
content, deployed on Cloudflare Pages.

## Running it

Node 22+ (`.nvmrc` pins the major; `nvm use`).

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # astro check && astro build — must pass before pushing
npm run assets   # re-render public/og.png from spec/og.svg (only after a tagline change)
```

## Adding content

| Want to add            | Do this                                                                        |
| ---------------------- | ------------------------------------------------------------------------------ |
| A post                 | `src/content/writing/<slug>/index.md`, images alongside it in the same folder   |
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

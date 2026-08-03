# Site polish design

## Goal

Keep the site lightweight while making its primary purpose, prose, and navigation clearer.
Preserve the current top-of-homepage About/landing section, existing tagline, portrait, and title.

## Information architecture

The homepage order becomes About → Notes → Projects → Fun Links. About remains the landing
section, not a separate `/about` page. Contact remains a short separate page. The prose
collection remains “Notes.”

## Content

- Keep “Software engineering hijinks.”
- Make the About and Contact copy warmer and less corporate.
- Make the Notes intro direct rather than calling the work “timeless.”
- Edit the first note from LinkedIn-feed rhythm into calmer web prose.
- Keep AI Goodies, Quantum State Separator, and Coding Tasks; remove PMP Examples and
  Dockerfiles.
- Replace visible TODO copy in Fun Links and humanize project titles.

## External links

Every off-site HTTP(S) link opens in a new tab. Astro templates use one `ExternalLink`
component. Markdown output gets the same behavior through a local rehype transform. Both add
`target="_blank"`, `rel="noopener noreferrer"`, and a screen-reader-only “opens in a new tab”
cue. Internal links and `mailto:` remain in the current tab.

## Quality and operations

- Extend the generated-output check to enforce external-link behavior.
- Make `npm run build` the complete production gate: formatting, Astro diagnostics, static
  build, URL/feed/link checks, and contrast checks.
- Exclude Cloudflare preview builds from GoatCounter.
- Correct operator docs to submit `/sitemap.xml`.
- Require alternative text whenever note frontmatter includes a hero image.

## Constraints

No new page, CMS, client-side JavaScript, Docker image, or external-link dependency. No git
commit is created unless explicitly requested.

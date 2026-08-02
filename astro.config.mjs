// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://unhappypath.dev',

	// ADR-0004: one URL form, no trailing slash. `format: 'file'` also emits a root
	// 404.html, which is the filename Cloudflare Pages looks for.
	trailingSlash: 'never',
	build: { format: 'file' },

	// ADR-0002: self-hosted Inter. Astro downloads and serves the font from our own
	// origin at build time — no font CDN at runtime, and no @fontsource dependency.
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			cssVariable: '--font-inter',
			weights: ['400 700'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
	],

	// Code blocks get a theme per colour scheme; Shiki emits --shiki-dark-* custom
	// properties that global.css switches on. Without this, every code block is
	// github-dark — a dark slab on a light page.
	markdown: {
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
		},
	},

	// Tooling dirs are gitignored but Vite still watches the project root; changes
	// there shouldn't trigger HMR during `astro dev`.
	vite: {
		server: {
			watch: {
				ignored: ['**/.claude/**', '**/.idea/**', '**/.cursor/**'],
			},
		},
	},

	// ponytail: sitemap is hand-rolled at src/pages/sitemap.xml.ts instead of
	// @astrojs/sitemap — see ADR-0004. The integration cannot know post dates, and
	// spec §8 requires truthful <lastmod>.
});

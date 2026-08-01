// Guards the two output invariants that fail silently and cost real traffic:
//   1. ADR-0004 — every URL we emit is extensionless and slash-free (canonicals,
//      og:url, sitemap, feed). Mixed forms read as duplicate content.
//   2. spec §8 — the feed carries full content, not summaries.
// Runs on dist/ after the build, so it catches a regression anywhere, not just in
// cleanPath(). Part of `npm run check`.
import { readdir, readFile } from 'node:fs/promises';

const SITE = 'https://unhappypath.dev';
const problems = [];

const badForm = (url) => {
	if (url.endsWith('.html')) return 'ends in .html';
	if (url !== `${SITE}/` && url.endsWith('/')) return 'has a trailing slash';
	return null;
};

const pages = (await readdir('dist', { recursive: true })).filter((f) => f.endsWith('.html'));
if (pages.length === 0) problems.push('dist/ has no HTML — did the build run?');

for (const page of pages) {
	const html = await readFile(`dist/${page}`, 'utf8');

	const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
	if (!canonical) problems.push(`${page}: no canonical URL`);
	else if (badForm(canonical)) problems.push(`${page}: canonical ${badForm(canonical)} — ${canonical}`);

	const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
	if (!ogUrl) problems.push(`${page}: no og:url`);
	else if (badForm(ogUrl)) problems.push(`${page}: og:url ${badForm(ogUrl)} — ${ogUrl}`);

	// Preview deploys must not be indexed as duplicates of the real domain (spec §8).
	if (canonical && !canonical.startsWith(SITE)) problems.push(`${page}: canonical off-site — ${canonical}`);
}

const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const feed = await readFile('dist/rss.xml', 'utf8');

for (const [label, xml, tag] of [
	['sitemap', sitemap, 'loc'],
	['feed', feed, 'link'],
]) {
	const urls = [...xml.matchAll(new RegExp(`<${tag}>([^<]+)</${tag}>`, 'g'))].map((m) => m[1]);
	if (urls.length === 0) problems.push(`${label}: no <${tag}> entries`);
	for (const url of urls) {
		if (badForm(url)) problems.push(`${label}: ${badForm(url)} — ${url}`);
	}
}

// Full-content feed, not summaries.
const encoded = (feed.match(/<content:encoded>/g) ?? []).length;
const items = (feed.match(/<item>/g) ?? []).length;
if (items === 0) problems.push('feed: no items');
else if (encoded < items) problems.push(`feed: ${encoded}/${items} items carry full content`);

if (problems.length > 0) {
	console.error(`URL/feed check failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
	process.exit(1);
}
console.log(`URL/feed check passed: ${pages.length} pages, ${items} feed items, all URLs canonical-form.`);

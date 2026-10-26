// Guards the output invariants that fail silently and cost real traffic:
//   1. ADR-0004 — every URL we emit is extensionless and slash-free (canonicals,
//      og:url, sitemap, feed). Mixed forms read as duplicate content.
//   2. spec §8 — the feed carries full content, not summaries.
//   3. Every internal link resolves. Added after the rename to `/notes` left a
//      dead `/writing` link inside a post body — prose is the one place a route
//      change cannot be found by renaming a file, and a 404 from your own page
//      is worse than one from someone else's.
//   4. Every page carries the site-wide work-in-progress notice.
//   5. The four removed starter notes are 410s from exact-path Pages Functions,
//      and nothing else invokes a Function. A 301 of a deleted post to /notes
//      is the soft 404 Search Console was flagging.
//   6. X-Robots-Tag: noindex applies to pages.dev hosts only. A path-only rule
//      would deindex unhappypath.dev.
// Runs on dist/ after the build, and on the /functions routes Pages compiles
// outside that output. Part of `npm run check`.
import { readdir, readFile } from 'node:fs/promises';

const SITE = 'https://unhappypath.dev';
const problems = [];

const badForm = (url) => {
	if (url.endsWith('.html')) return 'ends in .html';
	if (url !== `${SITE}/` && url.endsWith('/')) return 'has a trailing slash';
	return null;
};

const files = await readdir('dist', { recursive: true });
const pages = files.filter((f) => f.endsWith('.html'));
if (pages.length === 0) problems.push('dist/ has no HTML — did the build run?');

// What an internal href is allowed to point at: a built route (extensionless, per
// ADR-0004) or a real file such as /rss.xml, /og.png, /_astro/*.
const targets = new Set([
	...pages.map((p) => (p === 'index.html' ? '/' : `/${p.replace(/\.html$/, '')}`)),
	...files.map((f) => `/${f}`),
]);

for (const page of pages) {
	const html = await readFile(`dist/${page}`, 'utf8');

	if (!/class="construction-banner"/.test(html))
		problems.push(`${page}: missing under-construction banner`);
	if (!/UNDER CONSTRUCTION[\s\S]*This site is a work in progress\./.test(html))
		problems.push(`${page}: under-construction banner copy has drifted`);

	// Error pages carry noindex instead of a canonical (nothing should treat them
	// as a destination), so they are exempt from the canonical requirement only.
	const noindex = /name="robots" content="noindex"/.test(html);

	const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
	if (!canonical && !noindex) problems.push(`${page}: no canonical URL and no noindex`);
	else if (canonical && noindex) problems.push(`${page}: has both a canonical and noindex`);
	else if (canonical && badForm(canonical))
		problems.push(`${page}: canonical ${badForm(canonical)} — ${canonical}`);

	const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
	if (!ogUrl) problems.push(`${page}: no og:url`);
	else if (badForm(ogUrl)) problems.push(`${page}: og:url ${badForm(ogUrl)} — ${ogUrl}`);

	// Preview deploys must not be indexed as duplicates of the real domain (spec §8).
	if (canonical && new URL(canonical).origin !== SITE)
		problems.push(`${page}: canonical off-site — ${canonical}`);

	// Root-relative links only; external ones are not ours to verify. The fragment
	// and query are stripped, so `/#about` checks the `/` route.
	for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
		const path = href.split(/[#?]/)[0] || '/';
		if (!targets.has(path)) problems.push(`${page}: dead internal link — ${href}`);
	}

	// External HTTP(S) links deliberately open away from the site. Enforce the
	// behavior in generated HTML so links authored in Astro and Markdown cannot
	// drift apart.
	for (const match of html.matchAll(
		/<a\b([^>]*)href="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g,
	)) {
		const [, before, href, after, body] = match;
		if (new URL(href).origin === SITE) continue;

		const attrs = `${before} ${after}`;
		if (!/target="_blank"/.test(attrs))
			problems.push(`${page}: external link does not open in a new tab — ${href}`);

		const rel = attrs.match(/rel="([^"]+)"/)?.[1]?.split(/\s+/) ?? [];
		if (!rel.includes('noopener') || !rel.includes('noreferrer'))
			problems.push(`${page}: external link lacks noopener noreferrer — ${href}`);

		if (!/opens in (?:a )?new tab/i.test(body))
			problems.push(`${page}: external link lacks a screen-reader new-tab cue — ${href}`);
	}
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

// Removed bootstrap notes. Each path is listed with and without a trailing
// slash: file routing treats those as one route, and a strict _routes.json
// matcher would not. Wrangler's matcher also makes the slash optional.
const removedNotes = [
	'/notes/hello-unhappy-path',
	'/notes/markdown-kitchen-sink',
	'/writing/hello-unhappy-path',
	'/writing/markdown-kitchen-sink',
];

const redirects = parseRedirects(await readFile('dist/_redirects', 'utf8'));
const expectedRedirects = [
	{ source: '/writing', destination: '/notes', status: '301' },
	{ source: '/writing/*', destination: '/notes', status: '301' },
];
if (JSON.stringify(redirects) !== JSON.stringify(expectedRedirects))
	problems.push(
		`_redirects: expected only the /writing -> /notes 301s, got ${JSON.stringify(redirects)}`,
	);

const routes = JSON.parse(await readFile('dist/_routes.json', 'utf8'));
const expectedInclude = removedNotes.flatMap((path) => [path, `${path}/`]);
if (routes.version !== 1 || !Array.isArray(routes.exclude) || routes.exclude.length !== 0)
	problems.push('_routes.json: version must be 1 and exclude must be empty');
if (JSON.stringify(routes.include) !== JSON.stringify(expectedInclude))
	problems.push(
		`_routes.json: include must be only the removed notes, got ${JSON.stringify(routes.include)}`,
	);

const functionFiles = (await readdir('functions', { recursive: true })).filter((file) =>
	file.endsWith('.js'),
);
const expectedFunctions = removedNotes.map((path) => `${path.slice(1)}.js`);
if (JSON.stringify([...functionFiles].sort()) !== JSON.stringify([...expectedFunctions].sort()))
	problems.push(
		`functions/: expected only the four removed-note routes, got ${functionFiles.join(', ')}`,
	);

for (const path of removedNotes) {
	const mod = await import(`../functions${path}.js`);
	const response = await mod.onRequest();
	if (response.status !== 410) problems.push(`${path}: Pages Function status ${response.status}`);
	if (response.headers.get('location'))
		problems.push(`${path}: 410 must not redirect (Location is a soft 404)`);
	if (response.headers.get('x-robots-tag'))
		problems.push(
			`${path}: 410 must not set X-Robots-Tag (that header is host-scoped in _headers)`,
		);
	const body = await response.text();
	if (body !== 'This page has been removed.\n')
		problems.push(`${path}: unexpected 410 body ${JSON.stringify(body)}`);
}

// Pages _headers: protocol and port are ignored, a :placeholder is one label,
// and a single * is greedy. A pattern with no host matches every host, which
// is how a path-only noindex would take the apex out of Google.
const headerRules = parseHeaders(await readFile('dist/_headers', 'utf8'));
const noindexRules = headerRules.filter((rule) =>
	rule.headers.some((header) => header.toLowerCase() === 'x-robots-tag: noindex'),
);
const expectedNoindex = ['https://:project.pages.dev/*', 'https://:version.:project.pages.dev/*'];
if (JSON.stringify(noindexRules.map((rule) => rule.pattern)) !== JSON.stringify(expectedNoindex))
	problems.push(
		`_headers: X-Robots-Tag rules must be exactly the pages.dev hosts, got ${JSON.stringify(noindexRules)}`,
	);
if (headerRules.length !== noindexRules.length)
	problems.push('_headers: unexpected extra header rules');

const indexed = (host) => noindexRules.some((rule) => headerMatches(rule.pattern, host, '/notes'));
for (const host of [
	'unhappypath.pages.dev',
	'preview.unhappypath.pages.dev',
	'373f31e2.unhappypath.pages.dev',
]) {
	if (!indexed(host)) problems.push(`_headers: ${host} would not get noindex`);
}
for (const host of ['unhappypath.dev', 'www.unhappypath.dev']) {
	if (indexed(host)) problems.push(`_headers: ${host} would get noindex`);
}

if (problems.length > 0) {
	console.error(`URL/feed check failed:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
	process.exit(1);
}
console.log(
	`URL/feed check passed: ${pages.length} pages, ${items} feed items, URLs and links valid.`,
);

function parseRedirects(text) {
	return text
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.map((line) => {
			const [source, destination, status = '302'] = line.split(/\s+/);
			return { source, destination, status };
		});
}

function parseHeaders(text) {
	const rules = [];
	for (const line of text.split('\n')) {
		if (!line.trim() || line.trim().startsWith('#')) continue;
		if (/^\s/.test(line)) rules.at(-1)?.headers.push(line.trim());
		else rules.push({ pattern: line.trim(), headers: [] });
	}
	return rules;
}

function headerMatches(pattern, host, path) {
	const absolute = pattern.match(/^https:\/\/([^/]+)(\/.*)?$/);
	if (pattern.includes('://') && !absolute) return true;
	const hostPattern = absolute ? absolute[1] : null;
	const pathPattern = absolute ? absolute[2] || '/*' : pattern;
	const hostOk = hostPattern === null || globMatches(hostPattern, host);
	return hostOk && globMatches(pathPattern, path);
}

// One splat, greedy. :placeholder is a single host label (stops at "." or "/").
function globMatches(pattern, value) {
	const parts = pattern.split('*');
	if (parts.length > 2) return false;
	const escape = (part) =>
		part
			.split(/(:[A-Za-z]\w*)/g)
			.map((piece) =>
				piece.startsWith(':') ? '[^.]+' : piece.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
			)
			.join('');
	return new RegExp(`^${parts.map(escape).join('.*')}$`).test(value);
}

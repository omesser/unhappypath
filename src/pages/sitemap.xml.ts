import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { byNewest, isoDate, postPath } from '../utils';

// Hand-rolled instead of @astrojs/sitemap (ADR-0004): spec §8 wants truthful
// <lastmod>, and the integration cannot see post dates. Google ignores
// priority/changefreq, so neither is emitted.
export const GET: APIRoute = async ({ site }) => {
	const base = new URL(site!).origin;
	const posts = (await getCollection('writing')).sort(byNewest);

	// `/` and `/writing` both list posts, so the newest post's date is their real
	// last-modified. /contact has no honest date, so it carries no lastmod —
	// Google ignores lastmod it does not trust, and a made-up one is worse than none.
	const newest = posts[0] ? isoDate(posts[0].data.updatedDate ?? posts[0].data.pubDate) : undefined;

	const entries: Array<{ loc: string; lastmod?: string }> = [
		{ loc: `${base}/`, lastmod: newest },
		{ loc: `${base}/writing`, lastmod: newest },
		{ loc: `${base}/contact` },
		...posts.map((post) => ({
			loc: `${base}${postPath(post)}`,
			lastmod: isoDate(post.data.updatedDate ?? post.data.pubDate),
		})),
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		({ loc, lastmod }) =>
			`\t<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isoDate } from '../utils';

// Hand-rolled instead of @astrojs/sitemap (ADR-0004): spec §8 wants truthful
// <lastmod>, and the integration cannot see post dates. Google ignores
// priority/changefreq, so neither is emitted.
export const GET: APIRoute = async ({ site }) => {
	const base = new URL(site!).origin;
	const posts = await getCollection('writing');

	const entries: Array<{ loc: string; lastmod?: string }> = [
		{ loc: `${base}/` },
		{ loc: `${base}/writing` },
		{ loc: `${base}/contact` },
		...posts.map((post) => ({
			loc: `${base}/writing/${post.id}`,
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

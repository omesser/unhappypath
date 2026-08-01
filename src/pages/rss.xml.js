import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

// Full-content feed, not summaries — it feeds human subscribers and AI ingestion
// alike (spec §8). The rendered HTML comes straight from the content layer, so no
// markdown-it/sanitize-html pair is needed.
const absolutize = (html, site) =>
	html.replaceAll('href="/', `href="${site}`).replaceAll('src="/', `src="${site}`);

export async function GET(context) {
	const site = context.site.href; // ends with '/'
	const posts = (await getCollection('writing')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		// The helper appends a trailing slash unless told otherwise (ADR-0004).
		trailingSlash: false,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/writing/${post.id}`,
			content: post.rendered?.html ? absolutize(post.rendered.html, site) : post.data.description,
		})),
	});
}

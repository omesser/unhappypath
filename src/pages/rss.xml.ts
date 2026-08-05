import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, render } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { byNewest, postPath } from '../utils';

// Full-content feed, not summaries — it feeds human subscribers and AI ingestion
// alike (spec §8).
//
// The content is rendered through Astro's container rather than read from
// `post.rendered.html`: the stored HTML is pre-asset-processing, so images are
// still `<img __ASTRO_IMAGE_="{...}">` placeholders. Shipping those leaks internal
// markup into the feed and gives subscribers a broken image.
const absolutize = (html: string, site: string) =>
	html.replaceAll('href="/', `href="${site}`).replaceAll('src="/', `src="${site}`);

export const GET: APIRoute = async (context) => {
	const site = context.site!.href; // ends with '/'
	const container = await AstroContainer.create();
	const posts = (await getCollection('notes')).sort(byNewest);

	const items = await Promise.all(
		posts.map(async (post) => {
			const { Content } = await render(post);
			const html = await container.renderToString(Content);
			return {
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: postPath(post),
				content: absolutize(html, site),
			};
		}),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site!,
		// The helper appends a trailing slash unless told otherwise (ADR-0004).
		trailingSlash: false,
		items,
	});
};

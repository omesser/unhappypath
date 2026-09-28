import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per post so images sit next to the prose they belong to
// (src/content/notes/<slug>/index.md). ADR-0003.
const notes = defineCollection({
	loader: glob({
		base: './src/content/notes',
		pattern: '**/index.md',
		generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
	}),
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				description: z.string(),
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				// Captured but deliberately not rendered until ~20+ posts (spec §4, deferred).
				tags: z.array(z.string()).default([]),
				heroImage: image().optional(),
				heroImageAlt: z.string().min(1).optional(),
			})
			.refine((data) => !data.heroImage || data.heroImageAlt, {
				message: 'heroImageAlt is required when heroImage is set',
				path: ['heroImageAlt'],
			}),
});

// One file per project card; the Markdown body is the description, so it can
// carry inline links. ADR-0003. A card with sprites is the featured one: it
// spans the grid and its sprites take turns on a stage inside it (ADR-0014).
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '*.md' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			github: z.url(),
			live: z.url().optional(),
			tags: z.array(z.string()).default([]),
			order: z.number(),
			// `walks` sprites cross the stage facing right; the rest perform in place.
			sprites: z.array(z.object({ src: image(), walks: z.boolean().default(false) })).default([]),
			// Shown in place of the first sprite under reduced motion.
			still: image().optional(),
		}),
});

export const collections = { notes, projects };

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per post so images sit next to the prose they belong to
// (src/content/writing/<slug>/index.md). ADR-0003.
const writing = defineCollection({
	loader: glob({
		base: './src/content/writing',
		pattern: '**/index.md',
		generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Captured but deliberately not rendered until ~20+ posts (spec §4, deferred).
			tags: z.array(z.string()).default([]),
			heroImage: z.optional(image()),
		}),
});

// One file per project card; the Markdown body is the description, so it can
// carry inline links. ADR-0003.
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '*.md' }),
	schema: z.object({
		title: z.string(),
		github: z.string().url(),
		live: z.string().url().optional(),
		tags: z.array(z.string()).default([]),
		order: z.number(),
	}),
});

export const collections = { writing, projects };

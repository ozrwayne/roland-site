import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string().min(1).optional(),
    lang: z.enum(['zh', 'en']).default('zh'),
    pubDate: z.coerce.date(),
    siteDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    sourceViews: z.number().int().positive().optional(),
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

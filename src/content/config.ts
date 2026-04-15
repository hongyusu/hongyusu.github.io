import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional().default('Untitled'),
    description: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().nullable().optional(),
    date: z.coerce.date().optional(),
    excerpt: z.string().optional(),
    location: z.string().optional(),
    tagline: z.string().optional(),
    feed: z.string().optional(),
    keywords: z.string().optional(),
    section: z.string().optional(),
    top: z.string().optional(),
  }),
});

export const collections = { blog };

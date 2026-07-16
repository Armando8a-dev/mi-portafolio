// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en', 'es']),
    project: z.string(), // URL slug; named 'project' because 'slug' is reserved by the glob loader
    order: z.number(),
    summary: z.string(),
    securityTag: z.string(),
    stack: z.array(z.string()),
    repo: z.string().url(),
    demo: z.string().url().optional(),
    etherscan: z.string().url().optional(),
  }),
});

export const collections = { work };

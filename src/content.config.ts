import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

export const articleCategories = [
  'protecao-digital',
  'decisoes-digitais',
  'rotina-digital',
  'ferramentas-e-ia',
  'produtos-digitais',
] as const;

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
  }),
  schema: z.object({
    title: z.string().min(10).max(110),
    description: z.string().min(40).max(180),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(articleCategories),
    themes: z.array(z.string().min(2)).min(1).max(8),
    author: z.string().default('Estúdio Escrita Planejada'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    seoTitle: z.string().max(70).optional(),
  }),
});

export const collections = { articles };

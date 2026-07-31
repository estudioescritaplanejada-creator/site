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
    video: z
      .object({
        id: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
        title: z.string().min(10).max(160),
        source: z.string().min(2).max(120),
      })
      .optional(),
    seoTitle: z.string().max(70).optional(),
    socialTitle: z.string().max(90).optional(),
    socialDescription: z.string().max(200).optional(),
    faqQuestions: z
      .array(z.string().min(8).max(180))
      .min(1)
      .max(12)
      .optional(),
    faqAnswers: z
      .array(z.string().min(20).max(1200))
      .min(1)
      .max(12)
      .optional(),
    leadMagnet: z
      .object({
        id: z.string().min(3).max(100),
        title: z.string().min(10).max(120),
        description: z.string().min(30).max(260),
        href: z.string().startsWith('/'),
        fileLabel: z.string().min(3).max(80),
        note: z.string().max(160).optional(),
      })
      .optional(),
    promotion: z
      .enum(['sistema-criador-digital', 'afiliados'])
      .default('sistema-criador-digital'),
  }),
});

export const collections = { articles };

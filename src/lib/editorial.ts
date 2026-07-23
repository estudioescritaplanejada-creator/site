import type { CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'articles'>;

export const categoryOrder = [
  'protecao-digital',
  'decisoes-digitais',
  'rotina-digital',
  'ferramentas-e-ia',
  'produtos-digitais',
] as const;

export type ArticleCategory = (typeof categoryOrder)[number];

export const categoryInfo: Record<
  ArticleCategory,
  { label: string; shortLabel: string; description: string; number: string }
> = {
  'protecao-digital': {
    label: 'Proteção digital',
    shortLabel: 'Não caia nessa',
    description:
      'Acessos, golpes, perdas, backups e verificações para manter o negócio funcionando.',
    number: '01',
  },
  'decisoes-digitais': {
    label: 'Decisões digitais',
    shortLabel: 'Vale a pena pagar?',
    description:
      'Critérios para escolher ferramentas, planos e serviços sem desperdiçar dinheiro.',
    number: '02',
  },
  'rotina-digital': {
    label: 'Rotina digital',
    shortLabel: 'Resolva agora',
    description:
      'Organização prática de mensagens, cobranças, arquivos, clientes e tarefas repetitivas.',
    number: '03',
  },
  'ferramentas-e-ia': {
    label: 'Ferramentas e IA',
    shortLabel: 'Use sem complicação',
    description:
      'Aplicações claras de tecnologia para escrever, produzir, organizar e atender melhor.',
    number: '04',
  },
  'produtos-digitais': {
    label: 'Produtos digitais',
    shortLabel: 'Transforme seu conhecimento',
    description:
      'Estrutura, conteúdo e apresentação para criar materiais úteis e comercializáveis.',
    number: '05',
  },
};

export function isPublished(
  article: ArticleEntry,
  now = new Date(),
  includeDrafts = import.meta.env.DEV,
): boolean {
  if (includeDrafts) return true;
  return !article.data.draft && article.data.publishedAt <= now;
}

export function sortArticles(articles: ArticleEntry[]): ArticleEntry[] {
  return [...articles].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export function getReadingMinutes(body: string): number {
  const plainText = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_\-[\]()]/g, ' ');

  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 210));
}

export function formatArticleDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function articlePath(article: ArticleEntry): string {
  return `/guias/${article.id}/`;
}

export function categoryPath(category: ArticleCategory): string {
  return `/guias/tema/${category}/`;
}

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { articlePath, isPublished, sortArticles } from '../lib/editorial';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ?? new URL('https://www.estudioescritaplanejada.com.br');
  const articles = sortArticles(
    await getCollection('articles', (article) => isPublished(article)),
  );

  const items = articles
    .map((article) => {
      const link = new URL(articlePath(article), baseUrl).toString();
      return `
    <item>
      <title>${escapeXml(article.data.title)}</title>
      <description>${escapeXml(article.data.description)}</description>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${article.data.publishedAt.toUTCString()}</pubDate>
      <author>estudioescritaplanejada@gmail.com (${escapeXml(article.data.author)})</author>
      <category>${escapeXml(article.data.category)}</category>
    </item>`;
    })
    .join('');

  const lastBuildDate = articles[0]?.data.updatedAt ?? articles[0]?.data.publishedAt ?? new Date();
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Estúdio Escrita Planejada — Guias</title>
    <description>Vida digital prática para autônomos e pequenos negócios.</description>
    <link>${escapeXml(new URL('/guias/', baseUrl).toString())}</link>
    <atom:link href="${escapeXml(new URL('/rss.xml', baseUrl).toString())}" rel="self" type="application/rss+xml" />
    <language>pt-BR</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};

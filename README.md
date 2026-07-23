# Estúdio Escrita Planejada

Projeto de ampliação editorial e comercial do Estúdio Escrita Planejada.

## Arquitetura em desenvolvimento

- Astro com saída estática;
- Markdown e Astro Content Collections;
- GitHub;
- Cloudflare Pages;
- branch de desenvolvimento `ampliacao-astro`;
- build publicado a partir de `dist`.

## Comandos

```bash
npm ci
npm run check
npm run build
npm run dev
npm run preview
npm run preflight
```

## Rotas atuais

- `/`: home editorial do Estúdio Escrita Planejada;
- `/site-profissional/`: landing comercial migrada para Astro;
- `/enquanto/`: página estática preservada do projeto Enquanto Ele Age;
- `/enquanto.html`: endereço legado redirecionado para `/enquanto/` no Cloudflare Pages;
- `/404.html`: página de erro.

## Estrutura principal

- `src/pages`: rotas geradas pelo Astro;
- `src/layouts`: layouts HTML;
- `src/components`: componentes de SEO, home editorial e landing comercial;
- `src/styles`: tokens, estilos globais, home editorial e landing comercial;
- `src/scripts`: JavaScript específico das páginas;
- `src/assets/fonts`: fontes processadas pelo Astro;
- `public/assets/img`: imagens públicas da landing comercial;
- `public/enquanto`: página estática preservada;
- `public/assets/enquanto-ele-age`: arquivos públicos do projeto Enquanto Ele Age;
- `public/assets/email`: imagens públicas utilizadas em e-mails já enviados;
- `public/_headers` e `public/_redirects`: regras da Cloudflare Pages.

## Arquivos internos e legados

- `emails/` contém arquivos de produção e prévia de e-mails, mas não é copiada para o build;
- os arquivos estáticos antigos na raiz permanecem temporariamente como fonte de referência e migração;
- somente o conteúdo de `src` e `public` é publicado pelo Astro.

## Produção

O domínio oficial permanece publicado pelo projeto anterior até a conclusão da ampliação. O ambiente Astro utiliza um projeto separado no Cloudflare Pages.

## Estrutura editorial

- `src/content.config.ts`: schema tipado da coleção `articles`;
- `src/content/articles/`: artigos em Markdown ou MDX;
- `/guias/`: índice editorial;
- `/guias/[id]/`: rota estática de cada artigo;
- `/guias/tema/[category]/`: páginas dos cinco territórios editoriais;
- `/rss.xml`: feed RSS dos artigos publicados;
- artigos com `draft: true` não geram rota, sitemap ou item no RSS em produção.

O frontmatter mínimo de um artigo deve informar `title`, `description`, `publishedAt`, `category` e `themes`. Autor, estado de rascunho e destaque possuem valores padrão definidos no schema.

## Fluxo operacional de publicação

O Módulo 8 adiciona um comando editorial próprio:

```bash
npm run eep -- new <slug>
npm run eep -- check
npm run eep -- publish <slug>
npm run eep -- verify [URL-base]
```

Atalhos equivalentes estão disponíveis como `eep:new`, `eep:check`, `eep:publish` e `eep:verify`.

- `templates/article-template.md`: modelo oficial de artigo;
- `scripts/eep.mjs`: criação, validação, promoção e verificação;
- `docs/FLUXO_PUBLICACAO_EDITORIAL.md`: procedimento completo;
- `public/assets/editorial/<slug>/`: convenção para imagens editoriais;
- rascunhos continuam fora do build de produção, RSS e sitemap.

## Auditoria pré-publicação

O Módulo 9 adiciona uma auditoria automática do build:

```bash
npm run preflight
npm run audit
npm run eep -- audit
```

- `npm run preflight`: valida artigos, Astro, build, auditoria e Git;
- `npm run audit`: audita um diretório `dist` já gerado;
- `npm run eep -- audit`: reconstrói e audita o build.

Documentos de referência:

- `docs/AUDITORIA_PRE_PUBLICACAO.md`;
- `docs/PLANO_MIGRACAO_PRODUCAO.md`;
- `docs/MODULO_9_AUDITORIA_PRE_PUBLICACAO.md`.

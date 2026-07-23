# Módulo 7 — Estrutura editorial de artigos

## Objetivo

Criar um fluxo de publicação estático e validado para que novos conteúdos sejam adicionados em Markdown sem editar manualmente páginas HTML.

## Estrutura implementada

- Astro Content Collections com loader `glob`;
- schema editorial em `src/content.config.ts`;
- conteúdos em `src/content/articles/`;
- índice público em `/guias/`;
- páginas individuais em `/guias/[id]/`;
- páginas de categoria em `/guias/tema/[category]/`, geradas quando o tema possui artigo publicado;
- leitura estimada calculada pelo corpo do Markdown;
- metadados de autor, publicação, atualização, categoria e temas;
- canonical, Open Graph de artigo e JSON-LD `Article`;
- artigos relacionados por categoria ou tema;
- exclusão de rascunhos e publicações futuras;
- feed em `/rss.xml` sem dependência externa;
- home integrada às rotas editoriais reais.

## Categorias aceitas

- `protecao-digital`;
- `decisoes-digitais`;
- `rotina-digital`;
- `ferramentas-e-ia`;
- `produtos-digitais`.

## Modelo de frontmatter

```yaml
---
title: "Título do artigo"
description: "Resumo entre 40 e 180 caracteres."
publishedAt: 2026-07-23
updatedAt: 2026-07-23
category: protecao-digital
themes:
  - acessos
  - segurança
author: Estúdio Escrita Planejada
draft: false
featured: false
seoTitle: "Título opcional para busca"
---
```

## Regras de publicação

1. O nome do arquivo define o endereço final do artigo.
2. `draft: true` impede a geração da rota em produção.
3. Datas futuras também ficam fora das páginas, sitemap e RSS em produção.
4. Rascunhos e conteúdos futuros podem ser visualizados no ambiente local de desenvolvimento.
5. Uma página de categoria só é criada quando houver conteúdo publicável naquele território.
6. A categoria deve usar um dos cinco valores validados.
7. Cada artigo deve ter ao menos um tema.
8. O build falha quando o frontmatter não respeita o schema.

## Artigo-piloto

O fluxo foi inaugurado com:

`organize-os-acessos-digitais-do-seu-negocio.md`

Rota esperada:

`/guias/organize-os-acessos-digitais-do-seu-negocio/`

O artigo valida tabela, listas, títulos, bloco de destaque, metadados, leitura estimada, categoria, RSS e dados estruturados.

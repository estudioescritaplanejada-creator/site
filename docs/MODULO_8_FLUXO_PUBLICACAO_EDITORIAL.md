# Módulo 8 — Fluxo operacional de publicação

## Objetivo

Transformar a infraestrutura editorial do Módulo 7 em um processo repetível, validável e simples para criar, revisar tecnicamente, promover e verificar novos artigos.

## Implementação

- comando central `scripts/eep.mjs`;
- criação de rascunho com `eep new`;
- validação editorial e técnica com `eep check`;
- promoção segura de rascunho com `eep publish`;
- verificação remota com `eep verify`;
- atalhos equivalentes no `package.json`;
- modelo oficial em `templates/article-template.md`;
- guia completo em `docs/FLUXO_PUBLICACAO_EDITORIAL.md`;
- convenção de imagens em `public/assets/editorial/<slug>/`;
- segundo artigo de validação mantido como `draft: true`.

## Princípios operacionais

- rascunhos não entram no build de produção;
- o comando de publicação não executa commit nem push automaticamente;
- qualquer falha interrompe a publicação;
- o artigo volta para `draft: true` quando a validação após promoção falha;
- o deploy só é considerado concluído após `eep verify`;
- imagens declaradas no frontmatter precisam existir em `public/`;
- a validação editorial complementa, mas não substitui, o schema do Astro.

## Segundo artigo de teste

Arquivo:

```text
src/content/articles/separe-o-whatsapp-pessoal-do-comercial.md
```

Estado:

```yaml
draft: true
```

O conteúdo é completo o suficiente para validar o fluxo local, mas permanece fora de rotas de produção, RSS e sitemap até uma decisão editorial de publicação.

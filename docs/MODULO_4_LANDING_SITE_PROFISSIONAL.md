# Módulo 4 — Migração da landing comercial

## Objetivo

Migrar a landing comercial originalmente publicada na raiz para a rota Astro:

```text
/site-profissional/
```

## Preservado

- copy comercial integral;
- identidade visual;
- tipografia;
- paleta;
- estrutura responsiva;
- navegação interna;
- CTAs para WhatsApp;
- FAQ;
- lightbox;
- política de privacidade;
- termos do serviço;
- valor inicial de R$ 490;
- dados estruturados comerciais.

## Alterações técnicas

- canonical atualizado para `/site-profissional/`;
- `WebPage`, `Service` e `Offer` atualizados para a nova URL;
- CSS separado em `src/styles/site-profissional.css`;
- JavaScript separado em `src/scripts/site-profissional.js`;
- conteúdo migrado para componente Astro;
- imagens públicas copiadas para `public/assets/img`;
- metadados sociais centralizados em `SeoHead.astro`;
- fontes continuam processadas e versionadas pelo Astro.

## Arquivos principais

```text
src/pages/site-profissional/index.astro
src/layouts/CommercialLandingLayout.astro
src/components/site-profissional/LandingContent.astro
src/styles/site-profissional.css
src/scripts/site-profissional.js
public/assets/img/
```

## Validação necessária após instalação

```bash
npm ci
npm run check
npm run build
npm run preview
```

Verificar localmente:

```text
http://localhost:4321/site-profissional/
```

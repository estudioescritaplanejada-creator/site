# Estúdio Escrita Planejada

Projeto de ampliação editorial e comercial do Estúdio Escrita Planejada.

## Arquitetura em desenvolvimento

- Astro com saída estática;
- Markdown e Content Collections em módulos posteriores;
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
```

## Rotas Astro atuais

- `/`: home provisória de desenvolvimento;
- `/site-profissional/`: landing comercial migrada;
- `/404.html`: página de erro.

## Estrutura principal

- `src/pages`: rotas;
- `src/layouts`: layouts HTML;
- `src/components`: componentes reutilizáveis;
- `src/styles`: tokens, estilos globais e estilos da landing;
- `src/scripts`: JavaScript específico das páginas;
- `src/assets/fonts`: fontes processadas pelo Astro;
- `public/assets/img`: imagens públicas da landing comercial;
- `public/_headers` e `public/_redirects`: regras da Cloudflare Pages.

## Arquivos legados

Os arquivos estáticos antigos permanecem temporariamente na raiz para referência e migração controlada. O build do Astro utiliza somente `src` e `public`.

## Produção

O domínio oficial permanece publicado pelo projeto anterior até a conclusão da ampliação. O ambiente Astro utiliza um projeto separado no Cloudflare Pages.

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

## Rotas atuais

- `/`: home provisória de desenvolvimento, com `noindex`;
- `/site-profissional/`: landing comercial migrada para Astro;
- `/enquanto/`: página estática preservada do projeto Enquanto Ele Age;
- `/enquanto.html`: endereço legado redirecionado para `/enquanto/` no Cloudflare Pages;
- `/404.html`: página de erro.

## Estrutura principal

- `src/pages`: rotas geradas pelo Astro;
- `src/layouts`: layouts HTML;
- `src/components`: componentes reutilizáveis;
- `src/styles`: tokens, estilos globais e estilos da landing;
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

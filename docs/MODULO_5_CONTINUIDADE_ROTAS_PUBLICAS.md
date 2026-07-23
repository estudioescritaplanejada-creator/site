# Módulo 5 — Continuidade das rotas públicas

## Objetivo

Preservar, durante a migração para Astro, as rotas e os arquivos públicos que já são utilizados fora do site principal.

## Entregas

### Página Enquanto Ele Age

- página preservada em `public/enquanto/index.html`;
- endereço público principal: `/enquanto/`;
- canonical, Open Graph e dados estruturados atualizados para `/enquanto/`;
- endereço legado `/enquanto.html` redirecionado com status 301 para `/enquanto/`;
- imagens, ícones e favicon mantidos nos mesmos caminhos públicos em `/assets/enquanto-ele-age/`.

A página permanece isolada e integralmente estática. Sua identidade visual, conteúdo e JavaScript não foram incorporados ao design editorial do Estúdio.

### Imagens utilizadas em e-mails

Os arquivos de imagem foram preservados nos mesmos caminhos absolutos já utilizados em mensagens enviadas:

- `/assets/email/pet/`;
- `/assets/email/canais-cristaos/`.

Esses arquivos são publicados porque e-mails antigos dependem deles para exibir suas imagens.

### Arquivos internos de e-mail

A pasta de trabalho `emails/` continua no repositório, mas permanece fora de `public/`. Portanto, os arquivos HTML de envio, prévia e arquivo histórico não entram no build e não ficam acessíveis como páginas do site.

### Sitemap

A página estática `/enquanto/` foi adicionada ao sitemap por `customPages`. A home provisória, que está com `noindex`, e a página `404.html` foram excluídas do sitemap.

## Critérios de validação

1. `npm run check` sem erros;
2. `npm run build` concluído;
3. `/enquanto/` com HTTP 200;
4. `/enquanto.html` redirecionando para `/enquanto/` no Cloudflare Pages;
5. todos os arquivos locais referenciados por `/enquanto/` presentes em `dist`;
6. imagens dos e-mails presentes em `dist/assets/email`;
7. nenhum arquivo HTML de `emails/` presente em `dist`;
8. sitemap contendo `/site-profissional/` e `/enquanto/`, sem a home provisória e sem `404.html`.

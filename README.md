# Estúdio Escrita Planejada

Landing page estática de uma única página, preparada para publicação no Cloudflare Pages.

## Publicação

- Diretório de build: não utilizar.
- Comando de build: não utilizar.
- Diretório raiz publicado: a própria raiz do projeto.

## Estrutura

- `index.html`: landing page e pop-ups legais.
- `404.html`: exceção técnica para endereços inexistentes.
- `assets/img`: imagens otimizadas.
- `assets/fontes`: fontes hospedadas localmente.
- `robots.txt` e `sitemap.xml`: descoberta pelo Google.
- `_headers` e `_redirects`: regras para Cloudflare Pages.

## Antes de publicar

Confirme se o domínio principal utiliza `www`. Caso contrário, ajuste a canonical, o sitemap, os dados estruturados e `_redirects`.

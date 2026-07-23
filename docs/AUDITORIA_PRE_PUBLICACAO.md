# Auditoria pré-publicação — Estúdio Escrita Planejada

## Finalidade

Esta auditoria define os critérios técnicos obrigatórios antes da migração da versão Astro para o domínio oficial.

O processo não substitui a validação visual humana. Ele combina:

1. validação editorial;
2. verificação do Astro e do TypeScript;
3. build estático;
4. auditoria automática dos arquivos gerados;
5. teste local em navegador;
6. validação remota no Cloudflare Pages;
7. conferência final do Git.

## Comando principal

```bash
npm run preflight
```

Esse comando executa o fluxo completo já integrado ao `eep check`:

- valida os artigos;
- executa `astro check`;
- gera o build de produção;
- executa `scripts/audit.mjs`;
- executa `git diff --check` quando o repositório Git estiver presente.

Para reconstruir e auditar somente o build:

```bash
npm run eep -- audit
```

Para auditar um `dist` já gerado:

```bash
npm run audit
```

## Escopo da auditoria automática

### Estrutura do build

A auditoria exige a presença de:

- home;
- página 404;
- índice de guias;
- landing comercial;
- página Enquanto Ele Age;
- RSS;
- sitemap;
- `robots.txt`;
- `_headers`;
- `_redirects`.

### SEO

Em cada página HTML pública, a auditoria verifica:

- idioma `pt-BR`;
- título;
- descrição;
- canonical alinhado à rota oficial;
- meta robots;
- um único `h1`;
- JSON-LD válido quando presente.

A página 404 deve:

- conter `noindex`;
- não declarar canonical artificial.

### Acessibilidade estrutural

São verificados:

- presença de um único elemento `main`;
- IDs duplicados;
- imagens sem atributo `alt`;
- links em nova aba sem `noopener noreferrer`;
- âncoras internas inexistentes;
- links internos sem destino no build.

A navegação por teclado, os diálogos, o menu e o lightbox continuam exigindo teste manual em navegador.

### Publicação editorial

A auditoria compara os artigos Markdown com o build e exige que:

- artigos publicados tenham rota;
- artigos publicados apareçam no sitemap e no RSS;
- rascunhos e artigos futuros não tenham rota;
- rascunhos e artigos futuros não apareçam no sitemap nem no RSS.

### Segurança e Cloudflare

São exigidos no `_headers`:

- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `X-Frame-Options`;
- `Strict-Transport-Security`;
- `Content-Security-Policy`.

Também são validados:

- redirecionamento de `/enquanto.html` para `/enquanto/`;
- redirecionamento do domínio sem `www` para a versão principal;
- desindexação das imagens públicas de e-mail.

### Exposição indevida

O diretório `dist` não pode conter:

- `.env`;
- `.git`;
- arquivos Markdown ou MDX;
- diretório `src`;
- diretório `templates`;
- HTMLs internos de e-mail;
- source maps.

### Orçamentos técnicos

Limites operacionais definidos:

- HTML: até 250 KB por arquivo;
- CSS: até 350 KB por arquivo;
- JavaScript: até 250 KB por arquivo;
- imagem pública: até 1 MB por arquivo.

Os limites são barreiras de prevenção. Uma necessidade real acima deles deve ser analisada, documentada e ajustada conscientemente.

## Teste manual obrigatório

Após a aprovação automática, validar no navegador:

1. home em desktop e celular;
2. `/guias/`;
3. artigo publicado;
4. página de categoria;
5. `/site-profissional/`;
6. `/enquanto/`;
7. menu móvel;
8. navegação por teclado;
9. foco visível;
10. FAQ, diálogos e lightbox;
11. CTAs do WhatsApp;
12. imagens públicas usadas nos e-mails;
13. URL inexistente com status 404 real.

## Validação remota

Depois do deploy:

```bash
npm run eep -- verify https://endereco-do-deploy.pages.dev
```

No domínio oficial, executar novamente:

```bash
npm run eep -- verify https://www.estudioescritaplanejada.com.br
```

## Critério de aprovação

A versão só pode avançar para produção quando:

- `npm run preflight` terminar sem falhas;
- teste local estiver aprovado;
- Git estiver limpo;
- deploy de prévia estiver aprovado;
- plano de rollback estiver registrado;
- o domínio oficial ainda não tiver sido alterado prematuramente.

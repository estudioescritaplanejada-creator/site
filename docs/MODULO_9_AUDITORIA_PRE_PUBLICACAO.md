# Módulo 9 — Auditoria pré-publicação

## Objetivo

Preparar a versão Astro para a migração ao domínio oficial com controles automáticos, correções técnicas e um plano de rollback.

## Implementações

- auditoria automática em `scripts/audit.mjs`;
- comando `npm run audit`;
- comando `npm run preflight`;
- comando `npm run eep -- audit`;
- auditoria incorporada ao `eep check`;
- validação de SEO, HTML, links, ativos, rascunhos, RSS, sitemap, Cloudflare e arquivos proibidos;
- política de segurança e cache ampliada em `_headers`;
- remoção do canonical artificial da página 404;
- hierarquia de títulos corrigida nos cards editoriais;
- links de e-mail tornados acionáveis;
- dimensões explícitas na imagem do lightbox;
- documentação de auditoria e migração.

## Correções preventivas

### Página 404

A página permanece com `noindex`, mas deixa de declarar uma URL canonical inexistente.

### Estrutura de títulos

Cards internos passam a usar `h3`, subordinados aos títulos `h2` das respectivas seções.

### Segurança

A configuração inclui:

- HSTS sem expansão automática para subdomínios;
- CSP compatível com os scripts locais, miniaturas e reprodutor do YouTube;
- bloqueio de objetos incorporados;
- restrição de enquadramento;
- política de permissões reduzida.

### Cache

Foram definidas políticas específicas para:

- arquivos processados pelo Astro;
- imagens institucionais;
- imagens editoriais;
- ativos do Enquanto Ele Age;
- imagens usadas nos e-mails;
- favicons;
- RSS, sitemap e robots.

## Arquivos principais

- `scripts/audit.mjs`;
- `docs/AUDITORIA_PRE_PUBLICACAO.md`;
- `docs/PLANO_MIGRACAO_PRODUCAO.md`;
- `docs/MODULO_9_AUDITORIA_PRE_PUBLICACAO.md`;
- `public/_headers`;
- `package.json`;
- `scripts/eep.mjs`.

## Validação esperada

```bash
npm ci
npm run preflight
```

A validação deve terminar com:

```text
APROVADO: build estático auditado e pronto para a validação remota.
```

Depois, o usuário deve executar o preview local e repetir as validações visuais das rotas críticas.

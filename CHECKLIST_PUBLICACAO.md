# Checklist de publicação

## Conteúdo comercial

- Confirmar texto “projetos a partir de R$ 490”.
- Confirmar que o orçamento final depende do escopo do projeto.
- Não apresentar parcelas fixas sem condição comercial vigente.
- Confirmar prazo comercial de até 7 dias úteis.
- Confirmar WhatsApp `+55 11 96450-2997`.
- Confirmar CNPJ e e-mail.
- Revisar os termos comerciais antes do lançamento.

## Landing de site profissional

- Confirmar rota `/site-profissional/`.
- Confirmar canonical da própria rota.
- Validar dados estruturados de `Service` e `Offer`.
- Abrir todos os botões de WhatsApp.
- Testar menu, FAQ, galeria, política e termos.
- Testar em celular real.

## Domínio

- Manter a versão principal com `www`.
- Fazer a versão sem `www` redirecionar com status 301.
- Confirmar canonical e sitemap depois da migração do domínio.

## Google

- Enviar `sitemap-index.xml` após o lançamento.
- Inspecionar a home e a landing comercial.
- Executar o teste de resultados avançados.
- Executar PageSpeed Insights em celular e computador.

## Validação técnica

- Executar `npm run check`.
- Executar `npm run build`.
- Confirmar HTTP 200 em `/site-profissional/`.
- Confirmar que uma URL inexistente retorna a página 404 com status 404.
- Confirmar ausência de recursos 404 no console do navegador.

## Auditoria pré-publicação Astro

- Executar `npm ci`.
- Executar `npm run preflight`.
- Confirmar auditoria sem falhas.
- Confirmar que a página 404 possui `noindex` e não possui canonical.
- Confirmar que rascunhos não geram rota, RSS ou sitemap.
- Confirmar ausência de HTMLs internos de e-mail no `dist`.
- Confirmar HTTP 200 nas imagens públicas já usadas em e-mails.
- Confirmar políticas de segurança e cache em `_headers`.
- Validar home, guias, artigo, landing e Enquanto Ele Age em desktop e celular.
- Validar teclado, foco, menu, diálogos, FAQ e lightbox.
- Registrar commit da versão aprovada e URL do deploy de prévia.

## Migração para produção

- Seguir `docs/PLANO_MIGRACAO_PRODUCAO.md`.
- Criar tag do estado legado antes da integração em `main`.
- Integrar `ampliacao-astro` sem reescrever histórico.
- Configurar o projeto oficial com `npm run build` e saída `dist`.
- Validar a URL técnica da implantação antes do domínio.
- Executar `npm run eep -- verify` no domínio oficial.
- Manter uma implantação anterior disponível para rollback.

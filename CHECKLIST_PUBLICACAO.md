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

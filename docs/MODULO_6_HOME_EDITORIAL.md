# Módulo 6 — Home editorial

## Objetivo

Substituir a página provisória da raiz por uma home editorial completa para o Estúdio Escrita Planejada, sem alterar as rotas já validadas `/site-profissional/` e `/enquanto/`.

## Posicionamento aplicado

A home apresenta a promessa central aprovada:

> Vida digital prática para quem trabalha por conta própria e administra pequenos negócios.

O conteúdo foi organizado para atender autônomos, prestadores de serviço, pequenos comerciantes, criadores e outros profissionais que utilizam ferramentas digitais sem necessariamente dominar tecnologia.

## Estrutura da página

- barra editorial e cabeçalho responsivo;
- hero com proposta de valor e painel prático;
- cinco territórios editoriais;
- diagnóstico por problema;
- área de ferramentas e materiais gratuitos;
- apresentação dos serviços profissionais;
- destaque para a landing `/site-profissional/`;
- chamada final para atendimento pelo WhatsApp;
- rodapé institucional.

## Territórios editoriais

1. golpes, acessos e riscos;
2. decisões digitais e desperdício de dinheiro;
3. soluções para a rotina de trabalho;
4. ferramentas e IA aplicadas sem jargão;
5. transformação de conhecimento em produtos digitais.

## Direção visual

A página reutiliza o sistema visual da landing comercial:

- Archivo Black nos títulos;
- IBM Plex Sans nos textos;
- fundo creme;
- preto estrutural;
- laranja nos CTAs;
- azul profundo nas áreas editoriais;
- verde ácido em alertas e destaques;
- bordas marcadas, sombras sólidas e composição editorial.

## Técnica

- rota Astro estática em `src/pages/index.astro`;
- layout próprio em `src/layouts/EditorialLayout.astro`;
- componente da home em `src/components/home/EditorialHome.astro`;
- estilos em `src/styles/home.css`;
- navegação móvel sem JavaScript, usando `details` e `summary`;
- dados estruturados `Organization`, `WebSite` e `WebPage`;
- canonical na raiz;
- home incluída no sitemap;
- imagem principal da landing carregada apenas na seção de serviço e com `loading="lazy"`.

## Escopo desta etapa

Os cartões editoriais e materiais apresentam os territórios e recursos previstos, mas não criam rotas de artigos ou ferramentas ainda inexistentes. Essas rotas serão desenvolvidas em módulos posteriores, evitando links quebrados ou conteúdo fictício publicado como final.

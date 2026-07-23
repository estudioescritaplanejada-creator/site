# Configuração de produção — Cloudflare Pages

## Estado vigente

A versão Astro do Estúdio Escrita Planejada está publicada no domínio oficial desde 23 de julho de 2026.

## Projeto oficial

- Projeto: `estudio-escrita-planejada`
- Repositório: `estudioescritaplanejada-creator/site`
- Branch de produção: `main`
- URL técnica: `https://estudio-escrita-planejada.pages.dev`
- Domínio oficial: `https://www.estudioescritaplanejada.com.br`

O domínio oficial deve permanecer associado ao projeto `estudio-escrita-planejada`.

## Configuração obrigatória

| Campo | Valor |
|---|---|
| Predefinição da estrutura | `Nenhum` |
| Comando de build | `npm run build` |
| Diretório de saída | `dist` |
| Diretório raiz | vazio |
| Branch de produção | `main` |

A Cloudflare deve executar o build Astro e publicar exclusivamente o conteúdo da pasta `dist`.

A raiz do repositório não deve ser usada diretamente como diretório publicado.

## Caminho no painel

Cloudflare → Workers & Pages → estudio-escrita-planejada → Configurações → Configuração do build

## Fluxo normal de publicação

```bash
cd /home/roberto/epp/Projetos/site
npm run preflight
git push origin main
```

Após o deploy:

```bash
npm run eep -- verify https://www.estudioescritaplanejada.com.br
```

## Ambiente de homologação

O projeto `estudio-escrita-planejada-astro` foi utilizado para validação da migração.

URL:

`https://estudio-escrita-planejada-astro.pages.dev`

Esse projeto não hospeda o domínio oficial.

## Ponto de retorno

A versão anterior à migração está preservada pela tag:

`pre-astro-producao`

Commit protegido:

`45dd6bb991241f542e01da18ff15c85b5ec8c1ce`

## Incidente registrado

O primeiro deploy Astro no projeto oficial continuou exibindo a página estática antiga porque o comando de build e o diretório de saída estavam vazios.

A correção aplicada foi:

- comando de build: `npm run build`;
- diretório de saída: `dist`;
- diretório raiz: vazio;
- predefinição: `Nenhum`;
- branch de produção: `main`.

Depois da correção, o deploy foi repetido e validado no domínio oficial.

## Regras operacionais

- não remover o comando `npm run build`;
- não substituir `dist` pela raiz do repositório;
- manter `main` como branch de produção;
- não mover o domínio oficial para o projeto de homologação;
- executar `npm run preflight` antes de cada publicação;
- executar a verificação remota após cada deploy.

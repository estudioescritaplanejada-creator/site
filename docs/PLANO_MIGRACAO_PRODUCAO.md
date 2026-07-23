# Plano seguro de migração para produção

## Objetivo

Substituir a publicação estática legada pela versão Astro sem quebrar o domínio, as rotas preservadas ou as imagens já utilizadas em e-mails.

## Estado anterior à migração

- branch de produção: `main`;
- branch Astro: `ampliacao-astro`;
- projeto Cloudflare Pages atual do domínio oficial ainda publica os arquivos estáticos da raiz;
- projeto temporário `estudio-escrita-planejada-astro` publica o build Astro da branch de ampliação;
- domínio oficial permanece ligado ao projeto anterior.

## Princípio de segurança

A mudança de código e a mudança da configuração de build não devem ocorrer simultaneamente sem um ponto de retorno.

A raiz legada permanece temporariamente no repositório para que, após a integração do código Astro em `main`, o projeto antigo continue entregando a página anterior até a alteração consciente da configuração do Cloudflare Pages.

## Etapa 1 — Congelamento e registro

Antes de qualquer alteração:

```bash
cd /home/roberto/epp/Projetos/site-ampliacao
npm run preflight
git status -sb
git log -1 --oneline
```

Registrar:

- commit final aprovado da branch `ampliacao-astro`;
- último commit da branch `main` ainda em produção;
- URL da implantação Astro aprovada;
- data e horário da migração.

## Etapa 2 — Ponto de retorno

Na árvore de trabalho da branch `main`, criar uma tag do estado legado imediatamente antes da integração:

```bash
git checkout main
git pull --ff-only origin main
git tag -a pre-astro-producao -m "Versao anterior a migracao Astro"
git push origin pre-astro-producao
```

A tag deve ser criada apenas depois de confirmar que `main` corresponde ao site oficial ainda publicado.

## Etapa 3 — Integração controlada

Integrar a branch Astro em `main` por merge normal ou pull request, sem apagar o histórico:

```bash
git checkout main
git merge --no-ff ampliacao-astro -m "feat: integrar ampliacao Astro"
git push origin main
```

Nesse momento, a configuração antiga do projeto Cloudflare ainda pode continuar publicando os arquivos estáticos legados da raiz. A alteração do domínio ainda não deve ser feita.

## Etapa 4 — Configuração do projeto oficial

No projeto Cloudflare Pages ligado ao domínio oficial, configurar:

- branch de produção: `main`;
- framework: Astro;
- comando de build: `npm run build`;
- diretório de saída: `dist`;
- diretório raiz: vazio;
- versão do Node compatível com `package.json`.

Salvar e acompanhar o primeiro deploy Astro do projeto oficial.

Não mover o domínio para o projeto temporário. O projeto temporário permanece apenas como ambiente de validação.

## Etapa 5 — Validação do deploy oficial antes do domínio

Na URL técnica da implantação oficial, conferir:

- home;
- `/site-profissional/`;
- `/enquanto/`;
- `/enquanto.html`;
- `/guias/`;
- artigo publicado;
- RSS;
- sitemap;
- 404;
- imagens públicas dos e-mails.

Executar:

```bash
npm run eep -- verify https://URL-TECNICA-DO-DEPLOY
```

## Etapa 6 — Validação no domínio

Quando o deploy Astro estiver marcado como produção no mesmo projeto oficial, validar:

```bash
npm run eep -- verify https://www.estudioescritaplanejada.com.br
```

Depois conferir manualmente:

- raiz sem `www` redirecionando para `www`;
- HTTPS;
- canonical;
- cabeçalhos;
- Search Console;
- sitemap;
- imagens em e-mails já enviados.

## Rollback

Diante de falha crítica:

1. usar o rollback de implantação no Cloudflare Pages para retornar à versão anterior disponível;
2. restaurar a configuração antiga de build, se necessário;
3. reverter o merge em `main` com um novo commit, sem reescrever histórico;
4. usar a tag `pre-astro-producao` apenas como referência imutável do estado anterior.

Não apagar implantações anteriores até a estabilização completa.

## Critério de encerramento

A migração só estará concluída quando:

- domínio oficial entregar a home Astro;
- rotas antigas continuarem funcionando;
- imagens públicas dos e-mails retornarem HTTP 200;
- rascunhos permanecerem fora do site;
- sitemap e RSS estiverem corretos;
- Search Console reconhecer o sitemap;
- Git estiver limpo e sincronizado;
- o projeto temporário puder permanecer como homologação ou ser desativado de forma consciente.

# Fluxo operacional de publicação editorial

## Objetivo

Publicar novos guias sem editar páginas HTML, mantendo validação de conteúdo, build estático, SEO, sitemap, RSS e histórico no Git.

## 1. Criar um rascunho

Escolha um slug curto, descritivo, em minúsculas e sem acentos:

```bash
npm run eep -- new como-organizar-cobrancas-no-whatsapp
```

O comando cria:

```text
src/content/articles/como-organizar-cobrancas-no-whatsapp.md
```

O arquivo nasce com `draft: true`, portanto não aparece no build de produção, sitemap ou RSS.

## 2. Preencher o frontmatter

Campos obrigatórios:

- `title`: 10 a 110 caracteres;
- `description`: 40 a 180 caracteres;
- `publishedAt`: data em `AAAA-MM-DD`;
- `category`: uma das cinco categorias oficiais;
- `themes`: de 1 a 8 temas.

Campos opcionais:

- `updatedAt`;
- `author`;
- `featured`;
- `image` e `imageAlt`;
- `seoTitle` com até 70 caracteres.

## 3. Categorias oficiais

```text
protecao-digital
decisoes-digitais
rotina-digital
ferramentas-e-ia
produtos-digitais
```

## 4. Convenção de imagens

Quando o artigo precisar de capa ou ilustração, use:

```text
public/assets/editorial/<slug>/capa.webp
```

No frontmatter:

```yaml
image: /assets/editorial/<slug>/capa.webp
imageAlt: "Descrição objetiva do conteúdo visível na imagem"
```

Regras:

- formato preferencial: WebP;
- nome em minúsculas, sem espaço e sem acento;
- não usar texto essencial dentro da imagem;
- informar largura e composição adequadas ao uso editorial;
- `image` e `imageAlt` devem ser usados juntos;
- a validação falha quando o arquivo informado não existe em `public/`.

## 5. Validar durante a redação

```bash
npm run eep -- check
```

O comando executa:

1. validação editorial dos arquivos Markdown;
2. `astro check`;
3. build de produção;
4. `git diff --check`.

A validação editorial verifica slug, campos obrigatórios, limites de texto, datas, categoria, temas, imagem, texto alternativo, extensão mínima e presença de subtítulos.

## 6. Visualizar um rascunho

Use o servidor de desenvolvimento, porque rascunhos aparecem apenas em modo local:

```bash
npm run dev
```

Abra:

```text
http://localhost:4321/guias/<slug>/
```

O build de produção exclui `draft: true` e publicações futuras.

## 7. Promover o artigo para publicação

```bash
npm run eep -- publish <slug>
```

O comando:

- altera `draft: true` para `draft: false`;
- atualiza `publishedAt` e `updatedAt` para o dia atual;
- executa a validação completa;
- volta o artigo para rascunho quando a validação falha;
- informa os comandos de Git, sem fazer push automaticamente.

## 8. Versionar e publicar

Após a validação:

```bash
git add src/content/articles/<slug>.md
git commit -m "feat: publicar guia <slug>"
git push origin ampliacao-astro
```

Se houver imagens, documentação ou outras alterações relacionadas, inclua apenas esses arquivos no `git add`.

## 9. Verificar o deploy

No ambiente atual de desenvolvimento:

```bash
npm run eep -- verify https://estudio-escrita-planejada-astro.pages.dev
```

O comando verifica:

- home;
- índice de guias;
- artigos publicados;
- categorias ativas;
- RSS;
- sitemap;
- canonical de cada artigo.

Depois da migração definitiva, informe o domínio oficial ou defina:

```bash
export EEP_VERIFY_BASE="https://www.estudioescritaplanejada.com.br"
```

## 10. Agendamento

Para preparar um artigo futuro:

```yaml
draft: false
publishedAt: 2026-08-15
```

Ele fica fora do build até a data chegar. Como o Cloudflare Pages só reconstrói o site após um deploy, será necessário provocar um novo build na data programada. Até existir automação de deploy agendado, prefira manter `draft: true` e publicar no dia previsto.

## 11. Checklist antes do commit

- título específico e coerente com o conteúdo;
- descrição útil entre 40 e 180 caracteres;
- problema apresentado antes da explicação;
- ações práticas e verificáveis;
- categoria e temas corretos;
- links revisados;
- imagem existente e texto alternativo, quando usada;
- nenhum dado sensível, credencial ou afirmação não sustentada;
- `npm run eep -- check` aprovado;
- teste visual em desktop e celular;
- somente arquivos relacionados preparados para commit.

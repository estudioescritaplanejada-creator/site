#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import process from 'node:process';

const ROOT = resolve(import.meta.dirname, '..');
const ARTICLES_DIR = join(ROOT, 'src/content/articles');
const TEMPLATE_PATH = join(ROOT, 'templates/article-template.md');
const DEFAULT_VERIFY_BASE = 'https://estudio-escrita-planejada-astro.pages.dev';
const CATEGORIES = new Set([
  'protecao-digital',
  'decisoes-digitais',
  'rotina-digital',
  'ferramentas-e-ia',
  'produtos-digitais',
]);

function fail(message) {
  throw new Error(message);
}

function note(message) {
  console.log(`• ${message}`);
}

function heading(message) {
  console.log(`\n=== ${message} ===`);
}

function run(command, args, options = {}) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  execFileSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
    ...options,
  });
}

function articleFiles() {
  if (!existsSync(ARTICLES_DIR)) return [];
  return readdirSync(ARTICLES_DIR)
    .filter((name) => ['.md', '.mdx'].includes(extname(name)))
    .sort()
    .map((name) => join(ARTICLES_DIR, name));
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (/^(true|false)$/.test(trimmed)) return trimmed === 'true';
  if (/^null$/.test(trimmed)) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(filePath) {
  const source = readFileSync(filePath, 'utf8');
  if (!source.startsWith('---\n')) {
    return { data: {}, body: source, errors: ['frontmatter ausente'] };
  }

  const end = source.indexOf('\n---\n', 4);
  if (end === -1) {
    return { data: {}, body: source, errors: ['frontmatter não foi fechado com ---'] };
  }

  const block = source.slice(4, end);
  const body = source.slice(end + 5);
  const data = {};
  const errors = [];
  let currentArray = null;

  for (const [index, rawLine] of block.split('\n').entries()) {
    const lineNumber = index + 2;
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) continue;

    const listMatch = rawLine.match(/^\s+-\s+(.+)$/);
    if (listMatch && currentArray) {
      data[currentArray].push(parseScalar(listMatch[1]));
      continue;
    }

    const fieldMatch = rawLine.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!fieldMatch) {
      errors.push(`linha ${lineNumber} do frontmatter não reconhecida`);
      currentArray = null;
      continue;
    }

    const [, key, rawValue] = fieldMatch;
    if (rawValue === '') {
      data[key] = [];
      currentArray = key;
    } else {
      data[key] = parseScalar(rawValue);
      currentArray = null;
    }
  }

  return { data, body, errors };
}

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function dateValue(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return date;
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function validateArticle(filePath) {
  const name = basename(filePath);
  const slug = name.replace(/\.(md|mdx)$/, '');
  const { data, body, errors } = parseFrontmatter(filePath);
  const issues = [...errors];

  if (!isValidSlug(slug)) issues.push('nome do arquivo deve ser um slug em minúsculas, sem acentos');

  for (const field of ['title', 'description', 'publishedAt', 'category', 'themes']) {
    if (data[field] === undefined || data[field] === '') issues.push(`campo obrigatório ausente: ${field}`);
  }

  if (typeof data.title === 'string' && (data.title.length < 10 || data.title.length > 110)) {
    issues.push('title deve ter entre 10 e 110 caracteres');
  }

  if (
    typeof data.description === 'string' &&
    (data.description.length < 40 || data.description.length > 180)
  ) {
    issues.push('description deve ter entre 40 e 180 caracteres');
  }

  if (data.seoTitle && (typeof data.seoTitle !== 'string' || data.seoTitle.length > 70)) {
    issues.push('seoTitle deve ter no máximo 70 caracteres');
  }

  const publishedAt = dateValue(data.publishedAt);
  if (!publishedAt) issues.push('publishedAt deve usar o formato AAAA-MM-DD');

  if (data.updatedAt !== undefined && !dateValue(data.updatedAt)) {
    issues.push('updatedAt deve usar o formato AAAA-MM-DD');
  }

  if (!CATEGORIES.has(data.category)) {
    issues.push(`category inválida: ${String(data.category ?? '')}`);
  }

  if (!Array.isArray(data.themes) || data.themes.length < 1 || data.themes.length > 8) {
    issues.push('themes deve conter de 1 a 8 itens');
  }

  if (data.draft !== undefined && typeof data.draft !== 'boolean') {
    issues.push('draft deve ser true ou false');
  }

  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    issues.push('featured deve ser true ou false');
  }

  if (data.image && !data.imageAlt) issues.push('imageAlt é obrigatório quando image é informado');
  if (data.imageAlt && !data.image) issues.push('image é obrigatório quando imageAlt é informado');

  if (typeof data.image === 'string') {
    if (!data.image.startsWith('/')) issues.push('image deve começar com /');
    const localImage = join(ROOT, 'public', data.image.replace(/^\//, ''));
    if (!existsSync(localImage) || !statSync(localImage).isFile()) {
      issues.push(`imagem não encontrada em public: ${data.image}`);
    }
  }

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 350) issues.push(`corpo muito curto: ${wordCount} palavras; mínimo operacional: 350`);
  if (!/^##\s+/m.test(body)) issues.push('o artigo precisa de pelo menos um subtítulo de nível 2 (##)');

  return {
    filePath,
    name,
    slug,
    data,
    body,
    issues,
    wordCount,
    isDraft: data.draft === true,
    isFuture: publishedAt ? publishedAt > new Date(`${todayUtc()}T23:59:59.999Z`) : false,
  };
}

function validateAllArticles() {
  const files = articleFiles();
  if (files.length === 0) fail('nenhum artigo encontrado em src/content/articles');

  const results = files.map(validateArticle);
  let hasErrors = false;

  heading('VALIDAÇÃO EDITORIAL');
  for (const result of results) {
    if (result.issues.length === 0) {
      const status = result.isDraft ? 'rascunho' : result.isFuture ? 'agendado' : 'publicável';
      console.log(`OK  ${result.name} — ${result.wordCount} palavras — ${status}`);
    } else {
      hasErrors = true;
      console.log(`FALHA  ${result.name}`);
      for (const issue of result.issues) console.log(`  - ${issue}`);
    }
  }

  if (hasErrors) fail('a validação editorial encontrou problemas');
  return results;
}

function checkCommand() {
  validateAllArticles();
  heading('VALIDAÇÃO ASTRO');
  run('npm', ['run', 'check']);
  heading('BUILD DE PRODUÇÃO');
  run('npm', ['run', 'build']);
  heading('AUDITORIA DO BUILD');
  run('node', ['scripts/audit.mjs']);
  heading('FORMATAÇÃO GIT');
  if (existsSync(join(ROOT, '.git'))) run('git', ['diff', '--check']);
  else note('verificação Git ignorada no pacote sem diretório .git');
  heading('RESULTADO');
  note('conteúdo, Astro, build e diff validados');
}


function auditCommand() {
  heading('BUILD DE PRODUÇÃO');
  run('npm', ['run', 'build']);
  heading('AUDITORIA DO BUILD');
  run('node', ['scripts/audit.mjs']);
  heading('RESULTADO');
  note('build reconstruído e auditoria pré-publicação aprovada');
}

function newCommand(slug) {
  if (!slug) fail('informe o slug: npm run eep -- new meu-artigo');
  if (!isValidSlug(slug)) fail('o slug deve usar apenas letras minúsculas, números e hífens');

  const target = join(ARTICLES_DIR, `${slug}.md`);
  if (existsSync(target)) fail(`já existe um artigo com o slug ${slug}`);
  if (!existsSync(TEMPLATE_PATH)) fail('modelo templates/article-template.md não encontrado');

  const template = readFileSync(TEMPLATE_PATH, 'utf8')
    .replaceAll('{{DATE}}', todayUtc())
    .replaceAll('{{SLUG}}', slug);
  writeFileSync(target, template, 'utf8');

  heading('RASCUNHO CRIADO');
  note(`arquivo: src/content/articles/${slug}.md`);
  note('estado: draft: true');
  note('edite o título, descrição, categoria, temas e conteúdo antes de publicar');
}

function publishCommand(slug) {
  if (!slug) fail('informe o slug: npm run eep -- publish meu-artigo');
  const filePath = join(ARTICLES_DIR, `${slug}.md`);
  if (!existsSync(filePath)) fail(`artigo não encontrado: ${slug}`);

  const originalSource = readFileSync(filePath, 'utf8');
  let source = originalSource;
  const parsed = parseFrontmatter(filePath);
  if (parsed.errors.length) fail(parsed.errors.join('; '));

  if (!/^draft:\s*true\s*$/m.test(source) && !/^draft:\s*false\s*$/m.test(source)) {
    fail('o artigo precisa declarar draft: true ou draft: false');
  }

  source = source.replace(/^draft:\s*true\s*$/m, 'draft: false');
  source = source.replace(/^publishedAt:\s*\d{4}-\d{2}-\d{2}\s*$/m, `publishedAt: ${todayUtc()}`);
  source = source.replace(/^updatedAt:\s*\d{4}-\d{2}-\d{2}\s*$/m, `updatedAt: ${todayUtc()}`);
  writeFileSync(filePath, source, 'utf8');

  heading('ARTIGO PROMOVIDO PARA PUBLICAÇÃO');
  note(`slug: ${slug}`);
  note(`data: ${todayUtc()}`);
  note('executando validação completa antes de permitir o versionamento');

  try {
    checkCommand();
  } catch (error) {
    writeFileSync(filePath, originalSource, 'utf8');
    throw new Error(`a validação falhou e o arquivo original foi restaurado: ${error.message}`);
  }

  heading('PRONTO PARA VERSIONAR');
  note(`git add src/content/articles/${slug}.md`);
  note(`git commit -m "feat: publicar guia ${slug}"`);
  note('git push origin main');
}

function normalizeBase(value) {
  return value.replace(/\/+$/, '');
}

async function fetchChecked(url, options = {}) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000),
    ...options,
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response;
}

async function verifyCommand(baseArg) {
  const base = normalizeBase(baseArg || process.env.EEP_VERIFY_BASE || DEFAULT_VERIFY_BASE);
  const validated = validateAllArticles();
  const articles = validated.filter((article) => !article.isDraft && !article.isFuture);
  const hiddenArticles = validated.filter((article) => article.isDraft || article.isFuture);
  const paths = [
    '/',
    '/guias/',
    '/site-profissional/',
    '/enquanto/',
    '/rss.xml',
    '/sitemap-index.xml',
    '/robots.txt',
  ];

  for (const article of articles) paths.push(`/guias/${article.slug}/`);
  for (const category of [...new Set(articles.map((article) => article.data.category))]) {
    paths.push(`/guias/tema/${category}/`);
  }

  heading(`VERIFICAÇÃO REMOTA — ${base}`);
  for (const path of [...new Set(paths)]) {
    try {
      const response = await fetchChecked(`${base}${path}`);
      console.log(`OK  ${response.status}  ${path}`);
    } catch (error) {
      fail(`${path}: ${error.message}`);
    }
  }

  const homeResponse = await fetchChecked(`${base}/`);
  const requiredHeaders = [
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy',
    'x-frame-options',
    'strict-transport-security',
    'content-security-policy',
  ];
  for (const header of requiredHeaders) {
    if (!homeResponse.headers.get(header)) fail(`cabeçalho remoto ausente: ${header}`);
  }
  note('cabeçalhos de segurança verificados');

  const canonicalChecks = [
    ['/', 'https://www.estudioescritaplanejada.com.br/'],
    ['/guias/', 'https://www.estudioescritaplanejada.com.br/guias/'],
    ['/site-profissional/', 'https://www.estudioescritaplanejada.com.br/site-profissional/'],
    ['/enquanto/', 'https://www.estudioescritaplanejada.com.br/enquanto/'],
  ];
  for (const [path, officialUrl] of canonicalChecks) {
    const html = await (await fetchChecked(`${base}${path}`)).text();
    if (!html.includes(`rel="canonical" href="${officialUrl}"`)) {
      fail(`canonical incorreto ou ausente em ${path}`);
    }
  }
  note('canonicals das rotas principais verificados');

  const legacyRedirect = await fetch(`${base}/enquanto.html`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  });
  const legacyLocation = legacyRedirect.headers.get('location');
  if (legacyRedirect.status !== 301 || legacyLocation !== '/enquanto/') {
    fail(`/enquanto.html deveria retornar 301 para /enquanto/; recebido ${legacyRedirect.status} ${legacyLocation ?? ''}`);
  }
  note('redirecionamento legado verificado');

  const missingResponse = await fetch(`${base}/pagina-inexistente-auditoria`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  });
  const missingHtml = await missingResponse.text();
  if (missingResponse.status !== 404) fail(`URL inexistente deveria retornar 404; recebido ${missingResponse.status}`);
  if (!missingHtml.includes('noindex, nofollow')) fail('página 404 remota sem noindex');
  if (missingHtml.includes('rel="canonical"')) fail('página 404 remota declara canonical');
  note('status e metadados da página 404 verificados');

  const criticalAssets = [
    '/assets/email/pet/pet-hero.jpg',
    '/assets/email/pet/pet-page-preview.jpg',
    '/assets/email/canais-cristaos/canais-cristaos-mockup.jpg',
    '/assets/enquanto-ele-age/img/hero.webp',
  ];
  for (const path of criticalAssets) {
    await fetchChecked(`${base}${path}`);
    console.log(`OK  ativo crítico  ${path}`);
  }

  const internalEmail = await fetch(`${base}/emails/pet/email-pet-envio.html`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  });
  if (internalEmail.status !== 404) fail(`HTML interno de e-mail exposto: status ${internalEmail.status}`);
  note('HTML interno de e-mail permanece indisponível');

  const sitemap = await (await fetchChecked(`${base}/sitemap-0.xml`)).text();
  const rss = await (await fetchChecked(`${base}/rss.xml`)).text();

  for (const article of articles) {
    const officialUrl = `https://www.estudioescritaplanejada.com.br/guias/${article.slug}/`;
    const html = await (await fetchChecked(`${base}/guias/${article.slug}/`)).text();
    if (!html.includes(`rel="canonical" href="${officialUrl}"`)) {
      fail(`canonical incorreto ou ausente no artigo ${article.slug}`);
    }
    if (!sitemap.includes(officialUrl)) fail(`artigo ausente do sitemap: ${article.slug}`);
    if (!rss.includes(officialUrl)) fail(`artigo ausente do RSS: ${article.slug}`);
  }

  for (const article of hiddenArticles) {
    const response = await fetch(`${base}/guias/${article.slug}/`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status !== 404) fail(`rascunho ou agendado exposto: ${article.slug} (${response.status})`);
    if (sitemap.includes(article.slug) || rss.includes(article.slug)) {
      fail(`rascunho ou agendado presente no sitemap ou RSS: ${article.slug}`);
    }
  }

  heading('RESULTADO');
  note('rotas, segurança, canonicals, redirecionamentos, ativos, 404, sitemap, RSS e rascunhos verificados');
}

function help() {
  console.log(`
EEP — fluxo editorial

Comandos:
  npm run eep -- new <slug>       cria um rascunho pelo modelo oficial
  npm run eep -- check            valida artigos, Astro, build e diff
  npm run eep -- publish <slug>   remove o estado de rascunho, data e valida
  npm run eep -- audit            reconstrói e audita o build estático
  npm run eep -- verify [base]    verifica o deploy remoto

Atalhos:
  npm run eep:new -- <slug>
  npm run eep:check
  npm run eep:publish -- <slug>
  npm run eep:audit
  npm run eep:verify -- [base]
`);
}

const [command, ...args] = process.argv.slice(2);

try {
  if (!command || ['help', '--help', '-h'].includes(command)) help();
  else if (command === 'new') newCommand(args[0]);
  else if (command === 'check') checkCommand();
  else if (command === 'publish') publishCommand(args[0]);
  else if (command === 'audit') auditCommand();
  else if (command === 'verify') await verifyCommand(args[0]);
  else fail(`comando desconhecido: ${command}`);
} catch (error) {
  console.error(`\nERRO: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

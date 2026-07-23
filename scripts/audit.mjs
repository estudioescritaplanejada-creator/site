#!/usr/bin/env node

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import process from 'node:process';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const PUBLIC = join(ROOT, 'public');
const ARTICLES = join(ROOT, 'src/content/articles');
const OFFICIAL_ORIGIN = 'https://www.estudioescritaplanejada.com.br';
const MAX_HTML_BYTES = 250_000;
const MAX_CSS_BYTES = 350_000;
const MAX_JS_BYTES = 250_000;
const MAX_IMAGE_BYTES = 1_000_000;

const failures = [];
const warnings = [];
let checks = 0;

function pass(message) {
  checks += 1;
  console.log(`OK  ${message}`);
}

function fail(message) {
  checks += 1;
  failures.push(message);
  console.log(`FALHA  ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.log(`AVISO  ${message}`);
}

function heading(message) {
  console.log(`\n=== ${message} ===`);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(fullPath));
    else results.push(fullPath);
  }
  return results;
}

function text(path) {
  return readFileSync(path, 'utf8');
}

function rel(path) {
  return relative(DIST, path).split(sep).join('/');
}

function routeForHtml(filePath) {
  const path = rel(filePath);
  if (path === 'index.html') return '/';
  if (path === '404.html') return '/404.html';
  if (path.endsWith('/index.html')) return `/${path.slice(0, -'index.html'.length)}`;
  return `/${path}`;
}

function htmlFileForPath(pathname) {
  let clean = pathname.split('?')[0].split('#')[0];
  try {
    clean = decodeURIComponent(clean);
  } catch {
    return null;
  }
  if (!clean.startsWith('/')) return null;
  if (clean === '/') return join(DIST, 'index.html');
  if (clean.endsWith('/')) return join(DIST, clean.slice(1), 'index.html');
  const exact = join(DIST, clean.slice(1));
  if (existsSync(exact) && statSync(exact).isFile()) return exact;
  const directoryIndex = join(DIST, clean.slice(1), 'index.html');
  if (existsSync(directoryIndex)) return directoryIndex;
  return exact;
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match ? (match[1] ?? match[2] ?? '') : null;
}

function extractTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
}

function idsIn(html) {
  return [...html.matchAll(/\sid=(?:"([^"]+)"|'([^']+)')/gi)].map(
    (match) => match[1] ?? match[2],
  );
}

function publishedArticleSlugs() {
  if (!existsSync(ARTICLES)) return { published: [], drafts: [] };
  const published = [];
  const drafts = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const filename of readdirSync(ARTICLES).filter((name) => /\.mdx?$/.test(name))) {
    const source = text(join(ARTICLES, filename));
    const slug = filename.replace(/\.mdx?$/, '');
    const draft = /^draft:\s*true\s*$/m.test(source);
    const date = source.match(/^publishedAt:\s*(\d{4}-\d{2}-\d{2})\s*$/m)?.[1];
    if (draft || (date && date > today)) drafts.push(slug);
    else published.push(slug);
  }
  return { published, drafts };
}

function checkRequiredFiles() {
  heading('ESTRUTURA DO BUILD');
  const required = [
    'index.html',
    '404.html',
    'guias/index.html',
    'site-profissional/index.html',
    'enquanto/index.html',
    'rss.xml',
    'sitemap-index.xml',
    '_headers',
    '_redirects',
    'robots.txt',
  ];

  for (const file of required) {
    const path = join(DIST, file);
    if (existsSync(path) && statSync(path).isFile()) pass(`${file} presente`);
    else fail(`${file} ausente`);
  }
}

function checkHtmlPages() {
  heading('HTML, SEO E ACESSIBILIDADE ESTRUTURAL');
  const htmlFiles = walk(DIST).filter((path) => extname(path) === '.html');
  if (htmlFiles.length === 0) {
    fail('nenhum arquivo HTML encontrado no build');
    return;
  }

  for (const filePath of htmlFiles) {
    const html = text(filePath);
    const route = routeForHtml(filePath);
    const label = route;

    if (/^<!doctype html>/i.test(html.trimStart())) pass(`${label}: doctype HTML`);
    else fail(`${label}: doctype ausente`);

    if (/<html\b[^>]*\blang="pt-BR"/i.test(html)) pass(`${label}: idioma pt-BR`);
    else fail(`${label}: atributo lang="pt-BR" ausente`);

    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    if (title && title.length >= 10 && title.length <= 120) pass(`${label}: title válido`);
    else fail(`${label}: title ausente ou fora do limite operacional`);

    const description = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i)?.[1]
      ?? html.match(/<meta\b[^>]*content="([^"]+)"[^>]*name="description"[^>]*>/i)?.[1];
    if (description && description.length >= 40 && description.length <= 200) {
      pass(`${label}: meta description válida`);
    } else {
      fail(`${label}: meta description ausente ou fora do limite operacional`);
    }

    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    if (h1Count === 1) pass(`${label}: um único h1`);
    else fail(`${label}: esperado 1 h1, encontrado ${h1Count}`);

    const mainCount = (html.match(/<main\b/gi) ?? []).length;
    if (mainCount === 1) pass(`${label}: um único main`);
    else fail(`${label}: esperado 1 main, encontrado ${mainCount}`);

    const ids = idsIn(html);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    if (duplicates.length === 0) pass(`${label}: IDs únicos`);
    else fail(`${label}: IDs duplicados: ${duplicates.join(', ')}`);

    const robots = html.match(/<meta\b[^>]*name="robots"[^>]*content="([^"]+)"[^>]*>/i)?.[1]
      ?? html.match(/<meta\b[^>]*content="([^"]+)"[^>]*name="robots"[^>]*>/i)?.[1];

    if (route === '/404.html') {
      if (robots?.includes('noindex')) pass(`${label}: noindex presente`);
      else fail(`${label}: noindex ausente`);
      if (!/<link\b[^>]*rel="canonical"/i.test(html)) pass(`${label}: sem canonical artificial`);
      else fail(`${label}: página 404 não deve declarar canonical`);
    } else {
      const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/i)?.[1]
        ?? html.match(/<link\b[^>]*href="([^"]+)"[^>]*rel="canonical"[^>]*>/i)?.[1];
      const expected = `${OFFICIAL_ORIGIN}${route}`;
      if (canonical === expected) pass(`${label}: canonical correto`);
      else fail(`${label}: canonical esperado ${expected}, encontrado ${canonical ?? 'ausente'}`);
      if (robots?.includes('index')) pass(`${label}: indexação declarada`);
      else fail(`${label}: meta robots index ausente`);
    }

    for (const script of [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]) {
      try {
        JSON.parse(script[1]);
        pass(`${label}: JSON-LD válido`);
      } catch (error) {
        fail(`${label}: JSON-LD inválido — ${error.message}`);
      }
    }

    const imageTags = extractTags(html, 'img');
    for (const [index, tag] of imageTags.entries()) {
      const alt = attribute(tag, 'alt');
      if (alt === null) fail(`${label}: imagem ${index + 1} sem atributo alt`);
      const src = attribute(tag, 'src');
      if (!src) fail(`${label}: imagem ${index + 1} sem src`);
      if (src?.startsWith('/')) {
        const localPath = join(DIST, src.split('?')[0].slice(1));
        if (!existsSync(localPath)) fail(`${label}: imagem local ausente ${src}`);
      }
      const width = attribute(tag, 'width');
      const height = attribute(tag, 'height');
      if (!width || !height) warn(`${label}: imagem ${src ?? index + 1} sem width/height explícitos`);
    }

    for (const tag of extractTags(html, 'script')) {
      const src = attribute(tag, 'src');
      if (!src || !src.startsWith('/')) continue;
      const localPath = join(DIST, src.split('?')[0].slice(1));
      if (existsSync(localPath)) pass(`${label}: script local resolvido ${src}`);
      else fail(`${label}: script local ausente ${src}`);
    }

    for (const tag of extractTags(html, 'link')) {
      const href = attribute(tag, 'href');
      const relValue = attribute(tag, 'rel') ?? '';
      if (!href?.startsWith('/') || relValue === 'canonical' || relValue === 'alternate') continue;
      const localPath = join(DIST, href.split('?')[0].slice(1));
      if (existsSync(localPath)) pass(`${label}: recurso link resolvido ${href}`);
      else fail(`${label}: recurso link ausente ${href}`);
    }

    for (const tag of extractTags(html, 'a')) {
      const target = attribute(tag, 'target');
      const href = attribute(tag, 'href');
      const relValue = attribute(tag, 'rel') ?? '';
      if (target === '_blank' && (!relValue.includes('noopener') || !relValue.includes('noreferrer'))) {
        fail(`${label}: link target=_blank sem noopener noreferrer (${href ?? 'sem href'})`);
      }
      if (!href || /^(https?:|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
      const [pathPart, fragment] = href.split('#');
      const targetPath = pathPart || route;
      const targetFile = htmlFileForPath(targetPath.startsWith('/') ? targetPath : new URL(targetPath, `${OFFICIAL_ORIGIN}${route}`).pathname);
      if (!targetFile || !existsSync(targetFile)) {
        fail(`${label}: link interno sem destino ${href}`);
        continue;
      }
      if (fragment && extname(targetFile) === '.html') {
        const targetHtml = text(targetFile);
        if (!idsIn(targetHtml).includes(fragment)) fail(`${label}: âncora inexistente ${href}`);
      }
    }

    if (/\bhttp:\/\//i.test(html)) fail(`${label}: referência HTTP insegura encontrada`);

    const size = statSync(filePath).size;
    if (size <= MAX_HTML_BYTES) pass(`${label}: HTML dentro do orçamento (${size} bytes)`);
    else fail(`${label}: HTML acima de ${MAX_HTML_BYTES} bytes (${size})`);
  }
}

function checkAssets() {
  heading('ATIVOS E ORÇAMENTOS');
  const files = walk(DIST);
  const budgets = new Map([
    ['.css', MAX_CSS_BYTES],
    ['.js', MAX_JS_BYTES],
    ['.png', MAX_IMAGE_BYTES],
    ['.jpg', MAX_IMAGE_BYTES],
    ['.jpeg', MAX_IMAGE_BYTES],
    ['.webp', MAX_IMAGE_BYTES],
    ['.avif', MAX_IMAGE_BYTES],
  ]);

  for (const filePath of files) {
    const extension = extname(filePath).toLowerCase();
    const budget = budgets.get(extension);
    if (budget) {
      const size = statSync(filePath).size;
      if (size > budget) fail(`${rel(filePath)} excede orçamento de ${budget} bytes (${size})`);
    }

    if (extension === '.css') {
      const css = text(filePath);
      for (const match of css.matchAll(/url\((?:"([^"]+)"|'([^']+)'|([^)'"\s]+))\)/gi)) {
        const value = match[1] ?? match[2] ?? match[3] ?? '';
        if (!value || /^(data:|https?:|#)/i.test(value)) continue;
        const clean = value.split('?')[0].split('#')[0];
        const target = clean.startsWith('/')
          ? join(DIST, clean.slice(1))
          : resolve(filePath, '..', clean);
        if (!existsSync(target)) fail(`${rel(filePath)}: recurso CSS ausente ${value}`);
      }
    }
  }

  if (failures.every((item) => !item.includes('excede orçamento'))) {
    pass('CSS, JavaScript e imagens dentro dos orçamentos definidos');
  }

  const forbiddenPatterns = [
    /(^|\/)\.env(?:\.|$)/,
    /(^|\/)\.git(\/|$)/,
    /(^|\/)emails(\/|$)/,
    /email-pet.*\.html$/,
    /(^|\/)templates(\/|$)/,
    /(^|\/)src(\/|$)/,
    /\.mdx?$/,
    /\.map$/,
  ];
  const forbidden = files.map(rel).filter((path) => forbiddenPatterns.some((pattern) => pattern.test(path)));
  if (forbidden.length === 0) pass('nenhum arquivo interno, segredo, fonte Markdown ou source map no build');
  else fail(`arquivos proibidos no build: ${forbidden.join(', ')}`);
}

function checkEditorialPublication() {
  heading('PUBLICAÇÃO EDITORIAL');
  const { published, drafts } = publishedArticleSlugs();
  const sitemapPath = join(DIST, 'sitemap-0.xml');
  const rssPath = join(DIST, 'rss.xml');
  const sitemap = existsSync(sitemapPath) ? text(sitemapPath) : '';
  const rss = existsSync(rssPath) ? text(rssPath) : '';

  for (const slug of published) {
    const route = `/guias/${slug}/`;
    const file = join(DIST, 'guias', slug, 'index.html');
    const official = `${OFFICIAL_ORIGIN}${route}`;
    if (existsSync(file)) pass(`${slug}: rota publicada`);
    else fail(`${slug}: rota publicada ausente`);
    if (sitemap.includes(official)) pass(`${slug}: presente no sitemap`);
    else fail(`${slug}: ausente do sitemap`);
    if (rss.includes(official)) pass(`${slug}: presente no RSS`);
    else fail(`${slug}: ausente do RSS`);
  }

  for (const slug of drafts) {
    if (!existsSync(join(DIST, 'guias', slug, 'index.html'))) pass(`${slug}: rascunho fora das rotas`);
    else fail(`${slug}: rascunho gerou rota`);
    if (!sitemap.includes(slug) && !rss.includes(slug)) pass(`${slug}: rascunho fora do sitemap e RSS`);
    else fail(`${slug}: rascunho exposto no sitemap ou RSS`);
  }
}

function checkCloudflareFiles() {
  heading('CLOUDFLARE, CACHE E SEGURANÇA');
  const headersPath = join(DIST, '_headers');
  const redirectsPath = join(DIST, '_redirects');
  if (!existsSync(headersPath) || !existsSync(redirectsPath)) return;

  const headers = text(headersPath);
  const redirects = text(redirectsPath);
  const requiredHeaders = [
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Permissions-Policy:',
    'X-Frame-Options: SAMEORIGIN',
    'Strict-Transport-Security:',
    'Content-Security-Policy:',
  ];
  for (const header of requiredHeaders) {
    if (headers.includes(header)) pass(`cabeçalho configurado: ${header}`);
    else fail(`cabeçalho ausente: ${header}`);
  }

  if (/\/enquanto\.html\s+\/enquanto\/\s+301/.test(redirects)) pass('redirecionamento legado /enquanto.html correto');
  else fail('redirecionamento legado /enquanto.html ausente ou incorreto');

  if (redirects.includes('https://estudioescritaplanejada.com.br/* https://www.estudioescritaplanejada.com.br/:splat 301')) {
    pass('redirecionamento do domínio sem www configurado');
  } else {
    fail('redirecionamento do domínio sem www ausente');
  }

  if (headers.includes('/assets/email/*') && headers.includes('X-Robots-Tag: noindex')) {
    pass('imagens públicas de e-mail preservadas e desindexadas');
  } else {
    fail('regra de desindexação das imagens de e-mail ausente');
  }
}

function checkPublicParity() {
  heading('ATIVOS PÚBLICOS CRÍTICOS');
  const critical = [
    'assets/email/pet/pet-hero.jpg',
    'assets/email/pet/pet-page-preview.jpg',
    'assets/email/canais-cristaos/canais-cristaos-mockup.jpg',
    'assets/email/canais-cristaos/canais-cristaos-pagina-completa.jpg',
    'assets/enquanto-ele-age/img/hero.webp',
    'assets/enquanto-ele-age/img/logo.png',
  ];
  for (const file of critical) {
    const source = join(PUBLIC, file);
    const built = join(DIST, file);
    if (existsSync(source) && existsSync(built) && statSync(source).size === statSync(built).size) {
      pass(`${file}: preservado no build`);
    } else {
      fail(`${file}: ausente ou divergente no build`);
    }
  }
}

if (!existsSync(DIST)) {
  console.error('\nERRO: diretório dist ausente. Execute npm run build antes da auditoria.');
  process.exit(1);
}

checkRequiredFiles();
checkHtmlPages();
checkAssets();
checkEditorialPublication();
checkCloudflareFiles();
checkPublicParity();

heading('RESULTADO DA AUDITORIA');
console.log(`• verificações executadas: ${checks}`);
console.log(`• avisos informativos: ${warnings.length}`);
console.log(`• falhas: ${failures.length}`);

if (warnings.length > 0) {
  console.log('\nAvisos:');
  for (const item of warnings) console.log(`  - ${item}`);
}

if (failures.length > 0) {
  console.log('\nFalhas:');
  for (const item of failures) console.log(`  - ${item}`);
  process.exit(1);
}

console.log('\nAPROVADO: build estático auditado e pronto para a validação remota.');

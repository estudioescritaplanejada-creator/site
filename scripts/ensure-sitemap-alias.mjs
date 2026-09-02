import { copyFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('dist/sitemap-index.xml');
const target = resolve('dist/sitemap.xml');

try {
  await access(source, constants.R_OK);
} catch {
  console.error('ERRO: dist/sitemap-index.xml não foi gerado.');
  process.exit(1);
}

await copyFile(source, target);

console.log('OK: dist/sitemap.xml criado a partir de dist/sitemap-index.xml');

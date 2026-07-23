// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.estudioescritaplanejada.com.br',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap(),
  ],
});

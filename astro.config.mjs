// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://www.estudioescritaplanejada.com.br';

export default defineConfig({
  site,
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      customPages: [`${site}/enquanto/`],
      filter: (page) => page !== `${site}/` && !page.endsWith('/404.html'),
    }),
  ],
});

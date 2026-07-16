// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.armandoochoa.com',
  base: '/',
  server: {
    port: 4200,
  },
  integrations: [sitemap()],
  redirects: {
    '/blockchain': '/#work',
    '/web-developer': '/#more-work',
    '/data-analyst': '/#more-work',
    '/en': '/',
    '/en/blockchain': '/#work',
    '/en/web-developer': '/#more-work',
    '/en/data-analyst': '/#more-work',
  },
});

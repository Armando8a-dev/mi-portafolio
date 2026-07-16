// astro.config.mjs
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.armandoochoa.com',
  base: '/',
  server: {
    port: 4200,
  },
  integrations: [icon(), sitemap()],
});

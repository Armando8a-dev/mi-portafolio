import { defineConfig } from 'astro/config';
import icon from "astro-icon";

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.armandoochoa.com',

  base: '/',

  server: {
    port: 4200,
  },

  integrations: [icon()],

  vite: {
    plugins: [tailwindcss()]
  }
});
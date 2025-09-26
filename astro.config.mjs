import { defineConfig } from 'astro/config';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // 👇 Asegúrate de que estas dos líneas existan y sean correctas
  site: 'https://www.armandoochoa.com',
  base: '/',
  server: {
    port: 4200,
  },
  integrations: [icon()]
});
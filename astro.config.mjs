import { defineConfig } from 'astro/config';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 4200,
  },
  integrations: [icon()]
});
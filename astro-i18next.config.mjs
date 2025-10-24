// astro-i18next.config.mjs
export default {
  defaultLocale: "es",
  locales: ["es", "en"],
  routes: {
    en: {
      "data-analyst": "data-analyst",
      "web-developer": "web-developer",
    }
  },
  showDefaultLocale: false,
};

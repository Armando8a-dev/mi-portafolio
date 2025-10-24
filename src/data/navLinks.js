// src/data/navLinks.js

export const getNavLinks = (lang = 'es') => {
  const links = {
    es: [
      { href: '/#hero', label: 'Inicio' },
      { href: '/#about', label: 'Sobre Mí' },
      { href: '/#portfolios', label: 'Desarrollador Web' },
      { href: '/#portfolios', label: 'Analista de Datos' },
      { href: '/#contact', label: 'Contacto' },
    ],
    en: [
      { href: '/en#hero', label: 'Home' },
      { href: '/en#about', label: 'About' },
      { href: '/en#portfolios', label: 'Web Developer' },
      { href: '/en#portfolios', label: 'Data Analyst' },
      { href: '/en#contact', label: 'Contact' },
    ]
  };

  return links[lang] || links.es;
};

// Mantener compatibilidad con código existente
export const NAV_LINKS = getNavLinks('es');


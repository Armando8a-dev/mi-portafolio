// src/i18n/ui.ts — single source of truth for all UI copy (EN/ES)
export type Lang = 'en' | 'es';

export interface JourneyNode {
  year: string;
  org: string;
  role: string;
  summary: string;
  bullets: string[];
  metrics: string[]; // slot: fill when Banregio numbers are available
}

export interface ExternalProject {
  title: string;
  description: string;
  url?: string;
  thumb?: string;
  tags: string[];
}

const en = {
  nav: { work: 'Work', journey: 'Journey', skills: 'Skills', contact: 'Contact' },
  hero: {
    eyebrow: 'Armando Ochoa — Full Stack Web3 Developer',
    title: 'I spent 6+ years building banking software. Now I build DeFi.',
    subtitle:
      'Solidity and Smart Contracts with a security-first mindset: CEI patterns, reentrancy guards and fuzz testing on every contract. Frontend in Next.js, wagmi and viem.',
    meta: ['Cofounder @ ALFA 3', "Blockchain Accelerator '26", '6+ yrs fintech'],
    ctaWork: 'View work',
    ctaGithub: 'GitHub',
  },
  journey: {
    label: '01 / Journey',
    title: 'From fintech to DeFi',
    nodes: [
      {
        year: '2019',
        org: 'Banregio / Hey Banco',
        role: 'Full Stack Web Developer · Aug 2019 — Present',
        summary: '6+ years shipping banking platforms used daily by thousands of customers.',
        bullets: [
          'Digital Onboarding — built the platform that lets customers open accounts and contract financial products 100% online, no branch visit. Angular + TypeScript frontend, Java/Spring Boot microservices, SQL, bank API integrations.',
          'Business Banking — features companies run their money on: national transfers, payroll, bulk payments and dispersals, user and permission management.',
        ],
        metrics: [],
      },
      {
        year: '2025',
        org: 'TripleTen',
        role: 'Data Analytics Certification',
        summary: 'Python, Pandas, NumPy, SQL, Tableau, Power BI, applied statistics.',
        bullets: [
          'Capstone projects: customer churn prediction, customer segmentation via clustering, video-game market analysis, interactive Tableau dashboards.',
        ],
        metrics: [],
      },
      {
        year: '2026',
        org: 'Blockchain Accelerator',
        role: 'Web3 Engineering Program',
        summary: 'Deep-dive into the on-chain stack.',
        bullets: [
          'Solidity, smart contracts, Ethereum L1/L2, dApps, DeFi, oracles and smart-contract security.',
        ],
        metrics: [],
      },
      {
        year: '2026',
        org: 'ALFA 3',
        role: 'Cofounder',
        summary: 'Software consultancy: modern web builds, deployments, data automation.',
        bullets: [
          "Built Dolovibes' full infrastructure: domain setup, Vercel frontend, Railway backend, and a Python/Pandas pipeline for marketing data.",
        ],
        metrics: [],
      },
    ] as JourneyNode[],
  },
  work: {
    label: '02 / Selected work',
    title: 'Smart contracts, end to end',
    sub: 'Four contracts built with Foundry — security-first, fuzz-tested, documented.',
    caseCta: 'Case study',
    repoCta: 'Repo',
  },
  moreWork: {
    label: '03 / Also shipped',
    title: 'Web & data work',
    webGroup: 'Web',
    dataGroup: 'Data',
    web: [
      {
        title: 'Landing Kit',
        description: 'Customizable landing template for independent professionals.',
        url: 'https://landing-fisio-ui.netlify.app',
        tags: ['Next.js', 'Tailwind', 'shadcn/ui'],
      },
      {
        title: 'Wedding Invitation',
        description: 'Interactive digital wedding invitation with RSVP.',
        url: 'https://invitation-wedding-ui.netlify.app',
        tags: ['React', 'Tailwind'],
      },
      {
        title: 'Dolovibes (ALFA 3)',
        description: 'Full infrastructure: domain, Vercel frontend, Railway backend, Pandas data pipeline.',
        tags: ['Vercel', 'Railway', 'Python'],
      },
    ] as ExternalProject[],
    data: [
      {
        title: 'Customer Segmentation',
        description: 'Customer segmentation using clustering techniques.',
        url: 'https://public.tableau.com/app/profile/armando.ochoa/viz/Segmentaciondeclientes_17635115660200/DashboardPrincipal',
        thumb: '/thumbs/customer-segmentation-data-ss.png',
        tags: ['Python', 'Tableau'],
      },
      {
        title: 'Customer Churn Analysis',
        description: 'Churn prediction with machine learning.',
        url: 'https://armando8a-dev.github.io/customer-churn-analysis/demo.html',
        thumb: '/thumbs/customer-churn-analysis-ss.png',
        tags: ['Python', 'Sklearn'],
      },
      {
        title: 'Video Games Market',
        description: 'Market trends, sales and platform analysis.',
        url: 'https://public.tableau.com/app/profile/armando.ochoa/viz/VideoGamesMarket_17630827368000/VideoGamesMarketDashboard',
        thumb: '/thumbs/videogames-market-ss.png',
        tags: ['Python', 'Tableau'],
      },
    ] as ExternalProject[],
  },
  skills: {
    label: '04 / Skills',
    title: 'Stack',
    groups: [
      { name: 'Blockchain', items: ['Solidity', 'Foundry', 'OpenZeppelin', 'Ethereum', 'wagmi', 'viem', 'RainbowKit'] },
      { name: 'Web', items: ['Angular', 'TypeScript', 'JavaScript', 'Java', 'Spring Boot', 'React', 'Next.js', 'Astro', 'Node.js', 'HTML', 'CSS', 'SQL', 'REST APIs'] },
      { name: 'Data', items: ['Python', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'PostgreSQL'] },
    ],
  },
  contact: {
    label: '05 / Contact',
    title: "Let's talk",
    sub: "Looking for a Web3 engineer with production fintech experience? I'm open to smart-contract and full-stack Web3 roles.",
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send message',
  },
  footer: {
    rights: 'All rights reserved',
    builtWith: 'Built with Astro — view source',
  },
  caseStudy: {
    back: '← All work',
    stack: 'Stack',
    links: 'Links',
    repo: 'Repository',
    demo: 'Live demo',
    next: 'Next project',
  },
  seo: {
    title: 'Armando Ochoa — Full Stack Web3 Developer',
    description:
      'Full Stack Web3 Developer — Solidity, Smart Contracts & DeFi. 6+ years of fintech engineering experience.',
  },
};

const es: typeof en = {
  nav: { work: 'Proyectos', journey: 'Trayectoria', skills: 'Skills', contact: 'Contacto' },
  hero: {
    eyebrow: 'Armando Ochoa — Full Stack Web3 Developer',
    title: 'Pasé 6+ años construyendo software bancario. Ahora construyo DeFi.',
    subtitle:
      'Solidity y Smart Contracts con mentalidad de seguridad primero: patrones CEI, reentrancy guards y fuzz testing en cada contrato. Frontend en Next.js, wagmi y viem.',
    meta: ['Cofundador @ ALFA 3', "Blockchain Accelerator '26", '6+ años fintech'],
    ctaWork: 'Ver proyectos',
    ctaGithub: 'GitHub',
  },
  journey: {
    label: '01 / Trayectoria',
    title: 'De fintech a DeFi',
    nodes: [
      {
        year: '2019',
        org: 'Banregio / Hey Banco',
        role: 'Desarrollador Web Full Stack · Ago 2019 — Actualidad',
        summary: 'Más de 6 años construyendo plataformas bancarias usadas a diario por miles de clientes.',
        bullets: [
          'Onboarding Digital — construí la plataforma que permite abrir cuentas y contratar productos financieros 100% en línea, sin ir a sucursal. Frontend Angular + TypeScript, microservicios Java/Spring Boot, SQL, integración con APIs bancarias.',
          'Banca Empresarial — funcionalidades con las que las empresas operan su dinero: transferencias nacionales, nómina, pagos y dispersiones, administración de usuarios y permisos.',
        ],
        metrics: [],
      },
      {
        year: '2025',
        org: 'TripleTen',
        role: 'Certificación en Análisis de Datos',
        summary: 'Python, Pandas, NumPy, SQL, Tableau, Power BI, estadística aplicada.',
        bullets: [
          'Proyectos finales: predicción de abandono de clientes (churn), segmentación de clientes con clustering, análisis del mercado de videojuegos, dashboards interactivos en Tableau.',
        ],
        metrics: [],
      },
      {
        year: '2026',
        org: 'Blockchain Accelerator',
        role: 'Programa de Ingeniería Web3',
        summary: 'Inmersión profunda en el stack on-chain.',
        bullets: [
          'Solidity, smart contracts, Ethereum L1/L2, dApps, DeFi, oráculos y seguridad de contratos inteligentes.',
        ],
        metrics: [],
      },
      {
        year: '2026',
        org: 'ALFA 3',
        role: 'Cofundador',
        summary: 'Consultoría de software: sitios web modernos, despliegues, automatización de datos.',
        bullets: [
          'Construí la infraestructura completa de Dolovibes: dominio, frontend en Vercel, backend en Railway y un pipeline de datos con Python/Pandas para marketing.',
        ],
        metrics: [],
      },
    ],
  },
  work: {
    label: '02 / Proyectos destacados',
    title: 'Smart contracts, de punta a punta',
    sub: 'Cuatro contratos construidos con Foundry — seguridad primero, fuzz testing, documentados.',
    caseCta: 'Caso de estudio',
    repoCta: 'Repo',
  },
  moreWork: {
    label: '03 / También construí',
    title: 'Trabajo web y de datos',
    webGroup: 'Web',
    dataGroup: 'Datos',
    web: [
      {
        title: 'Landing Kit',
        description: 'Plantilla de landing personalizable para profesionales independientes.',
        url: 'https://landing-fisio-ui.netlify.app',
        tags: ['Next.js', 'Tailwind', 'shadcn/ui'],
      },
      {
        title: 'Invitación de Boda',
        description: 'Invitación de boda digital e interactiva con confirmación de asistencia.',
        url: 'https://invitation-wedding-ui.netlify.app',
        tags: ['React', 'Tailwind'],
      },
      {
        title: 'Dolovibes (ALFA 3)',
        description: 'Infraestructura completa: dominio, frontend en Vercel, backend en Railway, pipeline de datos con Pandas.',
        tags: ['Vercel', 'Railway', 'Python'],
      },
    ],
    data: [
      {
        title: 'Segmentación de Clientes',
        description: 'Segmentación de clientes usando técnicas de clustering.',
        url: 'https://public.tableau.com/app/profile/armando.ochoa/viz/Segmentaciondeclientes_17635115660200/DashboardPrincipal',
        thumb: '/thumbs/customer-segmentation-data-ss.png',
        tags: ['Python', 'Tableau'],
      },
      {
        title: 'Análisis de Cancelación de Clientes',
        description: 'Predicción de cancelaciones con machine learning.',
        url: 'https://armando8a-dev.github.io/customer-churn-analysis/demo.html',
        thumb: '/thumbs/customer-churn-analysis-ss.png',
        tags: ['Python', 'Sklearn'],
      },
      {
        title: 'Video Games Market',
        description: 'Tendencias del mercado, ventas y análisis de plataformas.',
        url: 'https://public.tableau.com/app/profile/armando.ochoa/viz/VideoGamesMarket_17630827368000/VideoGamesMarketDashboard',
        thumb: '/thumbs/videogames-market-ss.png',
        tags: ['Python', 'Tableau'],
      },
    ],
  },
  skills: {
    label: '04 / Skills',
    title: 'Stack',
    groups: [
      { name: 'Blockchain', items: ['Solidity', 'Foundry', 'OpenZeppelin', 'Ethereum', 'wagmi', 'viem', 'RainbowKit'] },
      { name: 'Web', items: ['Angular', 'TypeScript', 'JavaScript', 'Java', 'Spring Boot', 'React', 'Next.js', 'Astro', 'Node.js', 'HTML', 'CSS', 'SQL', 'REST APIs'] },
      { name: 'Datos', items: ['Python', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'PostgreSQL'] },
    ],
  },
  contact: {
    label: '05 / Contacto',
    title: 'Hablemos',
    sub: '¿Buscas un ingeniero Web3 con experiencia fintech en producción? Estoy abierto a roles de smart contracts y full-stack Web3.',
    name: 'Nombre',
    email: 'Correo',
    message: 'Mensaje',
    send: 'Enviar mensaje',
  },
  footer: {
    rights: 'Todos los derechos reservados',
    builtWith: 'Hecho con Astro — ver código',
  },
  caseStudy: {
    back: '← Todos los proyectos',
    stack: 'Stack',
    links: 'Links',
    repo: 'Repositorio',
    demo: 'Demo en vivo',
    next: 'Siguiente proyecto',
  },
  seo: {
    title: 'Armando Ochoa — Full Stack Web3 Developer',
    description:
      'Full Stack Web3 Developer — Solidity, Smart Contracts y DeFi. 6+ años de experiencia en desarrollo fintech.',
  },
};

export const ui = { en, es } as const;

export function useTranslations(lang: Lang) {
  return ui[lang];
}

/** Maps a path to its equivalent in the other language. */
export function getAltPath(path: string, target: Lang): string {
  const clean = path.replace(/\/+$/, '') || '/';
  if (target === 'es') {
    if (clean === '/') return '/es/';
    if (clean.startsWith('/es')) return path;
    return `/es${clean}/`;
  }
  if (clean === '/es') return '/';
  if (clean.startsWith('/es/')) return `${clean.slice(3)}/`;
  return path;
}

export const SOCIAL = {
  github: 'https://github.com/Armando8a-dev',
  linkedin: 'https://www.linkedin.com/in/armando-ochoa-dev',
  repo: 'https://github.com/Armando8a-dev/mi-portafolio',
  formspree: 'https://formspree.io/f/mblzlndn',
} as const;

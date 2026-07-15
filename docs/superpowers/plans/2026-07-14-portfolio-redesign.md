# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a single dark-fintech narrative site (EN at `/`, ES at `/es/`) with a one-pager home + 4 Web3 case-study pages, replacing the two conflicting legacy design systems.

**Architecture:** One `BaseLayout` + one token system in `global.css`. All copy lives in a typed i18n dictionary (`src/i18n/ui.ts`). Web3 projects live in an Astro Content Collection (markdown per project per language) consumed by both the home cards and the case-study pages. Legacy pages/components/deps are deleted at the end, with redirects covering old URLs.

**Tech Stack:** Astro 5.13.11 (static output), Content Collections v5 (`glob` loader), Fontsource (Archivo Variable + IBM Plex Mono), @astrojs/sitemap, sharp (dev-only, OG image).

**Spec:** `docs/superpowers/specs/2026-07-14-portfolio-redesign-design.md` — read it first.

## Global Constraints

- **Branch:** all work happens on branch `redesign-v2`. Never push to `mi-portafolio-v1` (every push there auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`).
- **Colors (exact, no others):** bg `#0A0E16`, surface `#111726`, surface-2 `#161D30`, border `rgba(232,236,244,0.08)`, text `#E8ECF4`, text-secondary `#94A3B8`, accent `#8C6CFF`, accent-dim `rgba(140,108,255,0.12)`, accent-strong `#A78BFA`. **One accent only** — introducing per-section accent colors is a spec violation.
- **Fonts:** Archivo Variable (all UI; headings use `font-stretch: 125%`) + IBM Plex Mono (numbers, dates, labels, code). Self-hosted via Fontsource. No Google Fonts CDN.
- **Forbidden:** glassmorphism, glow effects, decorative gradients, icon grids for skills. Old hexes `#0062b9`, `#4299e1`, `#8c52ff` and fonts Poppins / Source Sans Pro must not appear in final `dist/` HTML/CSS.
- **Copy:** all UI strings come from `src/i18n/ui.ts` — no hardcoded language strings inside components. Case-study prose lives in `src/content/work/*.md`.
- **i18n routes:** EN at `/`, ES at `/es/...`. Every page emits canonical + reciprocal hreflang.
- **Commits:** each task commits **only the files it created/modified/deleted** (exact paths in each commit step). The working tree contains pre-existing uncommitted changes the user chose not to commit — never `git add -A` or `git add .`.
- **Verification:** every task must end with `npm run build` exiting 0. `npm run preview` serves on port 4321.
- **Keep:** Formspree endpoint `https://formspree.io/f/mblzlndn`, `public/thumbs/*`, `src/assets/images/profile.jpg`, GitHub `https://github.com/Armando8a-dev`, LinkedIn `https://www.linkedin.com/in/armando-ochoa-dev`, `site: 'https://www.armandoochoa.com'` in astro.config.
- **Pending content slots (do NOT invent):** official Blockchain Accelerator program name (use "Blockchain Accelerator"), Banregio metrics (the `metrics` field stays an empty array), demo/Etherscan links (optional frontmatter, omit).

---

### Task 0: Branch + baseline

**Files:** none created.

- [ ] **Step 1: Create the working branch and unstage pre-existing index entries**

The index has stale staged files from earlier sessions. `git reset` unstages without touching the working tree (safe).

```bash
cd /Users/armandoochoa/Documents/GitHub/Front/mi-portafolio
git checkout -b redesign-v2
git reset
git status --short
```

Expected: branch `redesign-v2` created; `git status` shows only ` M`/`??` entries (nothing staged).

- [ ] **Step 2: Baseline build**

```bash
npm run build
```

Expected: exit 0, "8 page(s) built".

---

### Task 1: Dependencies + astro.config

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`, `package-lock.json` (via npm)

**Interfaces:**
- Produces: installed packages `@fontsource-variable/archivo`, `@fontsource/ibm-plex-mono`, `@astrojs/sitemap`, `sharp` (dev). Sitemap integration active.
- Note: `astro-icon` and `@iconify-json/simple-icons` are still needed by legacy pages — they are removed in Task 10, not here.

- [ ] **Step 1: Install new deps, remove unused ones**

```bash
npm install @fontsource-variable/archivo @fontsource/ibm-plex-mono @astrojs/sitemap
npm install -D sharp
npm uninstall astro-i18next i18next tailwindcss @tailwindcss/vite
```

Expected: all commands exit 0. (`astro-i18next`, `i18next`, `tailwindcss` are installed but referenced nowhere in `src/` — verified dead.)

- [ ] **Step 2: Rewrite astro.config.mjs**

```js
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
```

(Tailwind vite plugin removed; `icon()` stays until Task 10.)

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: exit 0; `dist/sitemap-index.xml` exists (`ls dist/sitemap-index.xml`).

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "chore: swap deps for redesign (fontsource, sitemap, sharp; drop unused tailwind/i18next)"
```

---

### Task 2: Design tokens — rewrite global.css

**Files:**
- Modify: `src/styles/global.css` (full rewrite)

**Interfaces:**
- Produces: CSS custom props (`--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--text-secondary`, `--accent`, `--accent-dim`, `--accent-strong`, `--font-sans`, `--font-mono`); classes `.container`, `.section`, `.section-label`, `.section-title`, `.section-sub`, `.mono`, `.chip`, `.tag-security`, `.card`, `.btn`, `.btn-ghost`, `.reveal`, `.prose`. Every later component relies on these.
- Note: the OLD home pages reference now-deleted vars (`--color-fondo` etc.) and will look broken until Task 9 — that is expected; only the build passing matters until then.

- [ ] **Step 1: Replace the entire content of `src/styles/global.css`**

```css
/* src/styles/global.css — design tokens & base system (dark fintech) */
@import '@fontsource-variable/archivo/wdth.css';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/500.css';

:root {
  --bg: #0A0E16;
  --surface: #111726;
  --surface-2: #161D30;
  --border: rgba(232, 236, 244, 0.08);
  --text: #E8ECF4;
  --text-secondary: #94A3B8;
  --accent: #8C6CFF;
  --accent-dim: rgba(140, 108, 255, 0.12);
  --accent-strong: #A78BFA;
  --font-sans: 'Archivo Variable', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'Cascadia Mono', monospace;
  --container: 1080px;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
h1, h2, h3 { margin: 0; font-weight: 700; line-height: 1.12; letter-spacing: -0.01em; font-stretch: 125%; }
p { margin: 0; }
a { color: inherit; }
img { max-width: 100%; display: block; }
ul { margin: 0; padding: 0; list-style: none; }

.container { max-width: var(--container); margin: 0 auto; padding: 0 1.5rem; }
.section { padding: 6rem 0; }
.section + .section { border-top: 1px solid var(--border); }
.section-label {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}
.section-title { font-size: clamp(1.8rem, 4vw, 2.6rem); margin-top: 0.75rem; }
.section-sub { color: var(--text-secondary); margin-top: 1rem; max-width: 620px; }

.mono { font-family: var(--font-mono); }
.chip {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-secondary);
  white-space: nowrap;
}
.tag-security {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-strong);
  background: var(--accent-dim);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.75rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.card:hover { border-color: rgba(140, 108, 255, 0.35); transform: translateY(-3px); }

.btn {
  display: inline-block;
  font-weight: 600;
  padding: 0.8rem 1.6rem;
  border-radius: 8px;
  text-decoration: none;
  background: var(--accent);
  color: #0A0E16;
  border: 1px solid transparent;
  transition: background 0.2s ease;
}
.btn:hover { background: var(--accent-strong); }
.btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
.btn-ghost:hover { background: transparent; border-color: var(--accent); color: var(--accent-strong); }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }

label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
}
input, textarea {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.85rem 1rem;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 1rem;
}
input:focus, textarea:focus { outline: none; border-color: var(--accent); }

/* Scroll-reveal (activated by IntersectionObserver in BaseLayout) */
.reveal { opacity: 0; transform: translateY(14px); transition: opacity 0.5s ease, transform 0.5s ease; }
.reveal.is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .card, .btn { transition: none; }
}

/* Markdown prose (case studies) */
.prose h2 { font-size: 1.4rem; margin: 2.5rem 0 1rem; }
.prose p { margin: 0 0 1rem; color: var(--text-secondary); }
.prose strong { color: var(--text); }
.prose ul { list-style: disc; padding-left: 1.25rem; margin: 0 0 1rem; color: var(--text-secondary); }
.prose li { margin-bottom: 0.4rem; }
.prose pre {
  background: #0D1220;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
  overflow-x: auto;
  font-size: 0.85rem;
  margin: 0 0 1rem;
}
.prose code { font-family: var(--font-mono); }
.prose :not(pre) > code {
  background: var(--accent-dim);
  color: var(--accent-strong);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-size: 0.85em;
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: exit 0. (Old pages render with missing vars — expected until Task 9/10.)

**If the build fails resolving `@fontsource-variable/archivo/wdth.css`:** replace that import with `@import '@fontsource-variable/archivo';` (weight-only variant). Headings then simply render without the width variation — everything else is unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: dark fintech design tokens and base system in global.css"
```

---

### Task 3: i18n dictionary and helpers

**Files:**
- Create: `src/i18n/ui.ts`

**Interfaces:**
- Produces (consumed by every component/page):
  - `type Lang = 'en' | 'es'`
  - `const ui: Record<Lang, Dict>` — full copy tree (shape below)
  - `function useTranslations(lang: Lang)` → returns `ui[lang]`
  - `function getAltPath(path: string, target: Lang): string` — maps `/work/x/` ⇄ `/es/work/x/`, `/` ⇄ `/es/`

- [ ] **Step 1: Create `src/i18n/ui.ts` with this exact content**

```ts
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
```

- [ ] **Step 2: Type-check via build**

```bash
npm run build
```

Expected: exit 0 (the `es: typeof en` annotation enforces both languages have identical shape — a missing key fails the build).

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "feat: typed bilingual i18n dictionary with full site copy"
```

---

### Task 4: BaseLayout + favicon

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `public/favicon.svg` (replace content)

**Interfaces:**
- Consumes: `Lang`, `getAltPath` from `src/i18n/ui.ts`; `global.css`.
- Produces: `<BaseLayout lang={Lang} title={string} description={string} path={string}>` — `path` is the route path with trailing slash (e.g. `/`, `/es/`, `/work/bestswap/`). Emits canonical, reciprocal hreflang, OG/twitter meta, reveal-on-scroll script.

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
import { getAltPath, type Lang } from '../i18n/ui';

interface Props {
  lang: Lang;
  title: string;
  description: string;
  path: string; // e.g. '/', '/es/', '/work/bestswap/'
}

const { lang, title, description, path } = Astro.props;
const site = Astro.site!.href.replace(/\/$/, '');
const canonical = `${site}${path}`;
const altLang: Lang = lang === 'en' ? 'es' : 'en';
const altUrl = `${site}${getAltPath(path, altLang)}`;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" hreflang={lang} href={canonical} />
    <link rel="alternate" hreflang={altLang} href={altUrl} />
    <link rel="alternate" hreflang="x-default" href={lang === 'en' ? canonical : altUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={`${site}/og-default.png`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <slot />
    <script>
      const els = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
              }
            }
          },
          { threshold: 0.15 }
        );
        els.forEach((el) => io.observe(el));
      } else {
        els.forEach((el) => el.classList.add('is-visible'));
      }
    </script>
  </body>
</html>
```

- [ ] **Step 2: Replace `public/favicon.svg` content**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0A0E16"/><text x="32" y="43" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#8C6CFF" text-anchor="middle">AO</text></svg>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro public/favicon.svg
git commit -m "feat: BaseLayout with SEO/hreflang/OG meta and new favicon"
```

---

### Task 5: SiteNav + SiteFooter

**Files:**
- Create: `src/components/SiteNav.astro`
- Create: `src/components/SiteFooter.astro`

**Interfaces:**
- Consumes: `useTranslations`, `getAltPath`, `SOCIAL`, `type Lang` from `src/i18n/ui.ts`.
- Produces: `<SiteNav lang={Lang} path={string} />` and `<SiteFooter lang={Lang} />`. Anchor links point to `{home}#work`, `#journey`, `#skills`, `#contact` where `home` is `/` (en) or `/es/` (es).

- [ ] **Step 1: Create `src/components/SiteNav.astro`**

```astro
---
// src/components/SiteNav.astro
import { useTranslations, getAltPath, type Lang } from '../i18n/ui';

interface Props {
  lang: Lang;
  path: string;
}
const { lang, path } = Astro.props;
const t = useTranslations(lang);
const home = lang === 'en' ? '/' : '/es/';
const altLang: Lang = lang === 'en' ? 'es' : 'en';
const altPath = getAltPath(path, altLang);
const links = [
  { href: `${home}#work`, label: t.nav.work },
  { href: `${home}#journey`, label: t.nav.journey },
  { href: `${home}#skills`, label: t.nav.skills },
  { href: `${home}#contact`, label: t.nav.contact },
];
---

<header class="nav">
  <div class="container nav-inner">
    <a href={home} class="brand mono">armando.ochoa</a>
    <nav class="links" aria-label="Main">
      {links.map((l) => <a href={l.href} class="nav-link">{l.label}</a>)}
      <a href={altPath} class="lang mono" aria-label={altLang === 'es' ? 'Versión en español' : 'English version'}>
        {altLang.toUpperCase()}
      </a>
    </nav>
    <button id="nav-toggle" class="toggle" aria-label="Menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </div>
  <div id="nav-mobile" class="mobile">
    {links.map((l) => <a href={l.href} class="mobile-link">{l.label}</a>)}
    <a href={altPath} class="mobile-link mono">{altLang.toUpperCase()}</a>
  </div>
</header>

<script>
  const btn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-mobile');
  btn?.addEventListener('click', () => {
    const open = menu?.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(!!open));
  });
  menu?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn?.setAttribute('aria-expanded', 'false');
    })
  );
</script>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(10, 14, 22, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .brand {
    text-decoration: none;
    font-size: 0.9rem;
    color: var(--text);
    font-weight: 500;
  }
  .links {
    display: flex;
    align-items: center;
    gap: 1.75rem;
  }
  .nav-link {
    text-decoration: none;
    font-size: 0.9rem;
    color: var(--text-secondary);
    transition: color 0.2s;
  }
  .nav-link:hover { color: var(--text); }
  .lang {
    text-decoration: none;
    font-size: 0.75rem;
    color: var(--accent-strong);
    border: 1px solid var(--border);
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
  }
  .lang:hover { border-color: var(--accent); }
  .toggle { display: none; }
  .mobile { display: none; }

  @media (max-width: 768px) {
    .links { display: none; }
    .toggle {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }
    .toggle span {
      width: 22px;
      height: 2px;
      background: var(--text);
      display: block;
    }
    .mobile.open {
      display: flex;
      flex-direction: column;
      padding: 1rem 1.5rem 1.5rem;
      gap: 1rem;
      border-top: 1px solid var(--border);
      background: var(--bg);
    }
    .mobile-link {
      text-decoration: none;
      color: var(--text);
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
</style>
```

- [ ] **Step 2: Create `src/components/SiteFooter.astro`**

```astro
---
// src/components/SiteFooter.astro
import { useTranslations, SOCIAL, type Lang } from '../i18n/ui';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
const t = useTranslations(lang);
const year = new Date().getFullYear();
---

<footer class="footer">
  <div class="container inner">
    <p class="mono copyright">© {year} Armando Ochoa · {t.footer.rights}</p>
    <div class="social">
      <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.18-.02-2.14-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
      </a>
      <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z"/></svg>
      </a>
    </div>
    <a href={SOCIAL.repo} target="_blank" rel="noopener noreferrer" class="mono src">{t.footer.builtWith}</a>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--border);
    padding: 2.5rem 0;
  }
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .copyright { font-size: 0.8rem; color: var(--text-secondary); }
  .social { display: flex; gap: 1.25rem; }
  .social a { color: var(--text-secondary); transition: color 0.2s; }
  .social a:hover { color: var(--accent-strong); }
  .src {
    font-size: 0.8rem;
    color: var(--text-secondary);
    text-decoration: none;
  }
  .src:hover { color: var(--accent-strong); }
</style>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/SiteNav.astro src/components/SiteFooter.astro
git commit -m "feat: SiteNav (sticky, bilingual switch) and SiteFooter"
```

---

### Task 6: Hero + Journey sections

**Files:**
- Create: `src/components/sections/Hero.astro`
- Create: `src/components/sections/Journey.astro`

**Interfaces:**
- Consumes: `useTranslations`, `SOCIAL`, `type Lang`.
- Produces: `<Hero lang={Lang} />`, `<Journey lang={Lang} />` (renders `id="journey"`).

- [ ] **Step 1: Create `src/components/sections/Hero.astro`**

```astro
---
// src/components/sections/Hero.astro
import { useTranslations, SOCIAL, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
const t = useTranslations(lang);
const home = lang === 'en' ? '/' : '/es/';
---

<section class="hero">
  <div class="container">
    <p class="mono eyebrow">{t.hero.eyebrow}</p>
    <h1 class="title">{t.hero.title}</h1>
    <p class="subtitle">{t.hero.subtitle}</p>
    <ul class="meta mono">
      {t.hero.meta.map((m) => <li>{m}</li>)}
    </ul>
    <div class="ctas">
      <a href={`${home}#work`} class="btn">{t.hero.ctaWork}</a>
      <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">{t.hero.ctaGithub} ↗</a>
    </div>
  </div>
</section>

<style>
  .hero { padding: 7.5rem 0 6rem; }
  .eyebrow {
    font-size: 0.85rem;
    color: var(--accent);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .title {
    font-size: clamp(2.2rem, 6vw, 4rem);
    max-width: 820px;
    margin-top: 1.25rem;
  }
  .subtitle {
    color: var(--text-secondary);
    max-width: 640px;
    margin-top: 1.5rem;
    font-size: 1.1rem;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.75rem;
    margin-top: 2rem;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
  .meta li::before { content: '▸ '; color: var(--accent); }
  .ctas { display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
</style>
```

- [ ] **Step 2: Create `src/components/sections/Journey.astro`**

```astro
---
// src/components/sections/Journey.astro
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
const t = useTranslations(lang);
---

<section id="journey" class="section">
  <div class="container">
    <p class="section-label">{t.journey.label}</p>
    <h2 class="section-title">{t.journey.title}</h2>

    <ol class="timeline">
      {t.journey.nodes.map((node) => (
        <li class="node reveal">
          <div class="marker" aria-hidden="true">
            <span class="dot"></span>
          </div>
          <div class="content">
            <p class="mono year">{node.year}</p>
            <h3 class="org">{node.org}</h3>
            <p class="mono role">{node.role}</p>
            <p class="summary">{node.summary}</p>
            <ul class="bullets">
              {node.bullets.map((b) => <li>{b}</li>)}
            </ul>
            {node.metrics.length > 0 && (
              <ul class="metrics">
                {node.metrics.map((m) => <li class="chip">{m}</li>)}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  </div>
</section>

<style>
  .timeline { margin-top: 3.5rem; }
  .node {
    display: grid;
    grid-template-columns: 24px 1fr;
    gap: 1.5rem;
    padding-bottom: 3rem;
    position: relative;
  }
  .marker { position: relative; }
  .dot {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent);
    margin-top: 6px;
  }
  .node:not(:last-child) .marker::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 24px;
    bottom: -6px;
    width: 2px;
    background: var(--border);
  }
  .year { font-size: 0.8rem; color: var(--accent-strong); }
  .org { font-size: 1.3rem; margin-top: 0.35rem; }
  .role { font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.35rem; }
  .summary { margin-top: 0.85rem; color: var(--text); }
  .bullets { margin-top: 0.75rem; }
  .bullets li {
    color: var(--text-secondary);
    padding-left: 1.1rem;
    position: relative;
    margin-bottom: 0.5rem;
  }
  .bullets li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--accent);
  }
  .metrics { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
</style>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.astro src/components/sections/Journey.astro
git commit -m "feat: Hero and Journey timeline sections"
```

---

### Task 7: Content collection + 8 case-study markdown files

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/work/bestswap-en.md`, `src/content/work/bestswap-es.md`, `src/content/work/yieldgarden-en.md`, `src/content/work/yieldgarden-es.md`, `src/content/work/goalfund-en.md`, `src/content/work/goalfund-es.md`, `src/content/work/proofpass-en.md`, `src/content/work/proofpass-es.md`

**Interfaces:**
- Produces: collection `work`. Frontmatter schema: `{ title: string; lang: 'en'|'es'; project: string; order: number; summary: string; securityTag: string; stack: string[]; repo: url; demo?: url; etherscan?: url }`. Query with `getCollection('work', e => e.data.lang === lang)`, sort by `data.order`. **The URL-slug field is named `project` (NOT `slug`) on purpose:** Astro 5's glob loader treats a frontmatter `slug` field as an entry-id override, and the EN/ES pairs share the same slug — naming it `slug` would create duplicate entry ids and break the build.
- Note on Solidity snippets: each md file contains a representative snippet matching the project's described mechanics. **Before finalizing, check the real repo (e.g. `https://github.com/Armando8a-dev/best-swap`) and replace the snippet with the actual code if it differs.** If a repo is unreachable, keep the provided snippet — it is complete and consistent with the project description.

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en', 'es']),
    project: z.string(), // URL slug; named 'project' because 'slug' is reserved by the glob loader
    order: z.number(),
    summary: z.string(),
    securityTag: z.string(),
    stack: z.array(z.string()),
    repo: z.string().url(),
    demo: z.string().url().optional(),
    etherscan: z.string().url().optional(),
  }),
});

export const collections = { work };
```

- [ ] **Step 2: Create the 8 markdown files**

`src/content/work/bestswap-en.md`:

````markdown
---
title: BestSwap
lang: en
project: bestswap
order: 1
summary: Uniswap V2 swap wrapper with on-chain slippage protection.
securityTag: on-chain slippage
stack: [Solidity, Foundry, Next.js, wagmi]
repo: https://github.com/Armando8a-dev/best-swap
---

**TL;DR** — A swap wrapper on Uniswap V2 that computes slippage protection on-chain via `getAmountsOut`, instead of trusting minimum-out values calculated by a frontend against stale price data.

## Problem

Most swap UIs compute the minimum acceptable output off-chain and pass it to the router. Between quote and execution, prices move — users either get sandwiched or their transaction reverts with confusing errors. The protection depends entirely on how fresh the frontend's data was.

## Approach

BestSwap quotes the trade **at execution time**, inside the contract: it calls `getAmountsOut` on the Uniswap V2 router and derives the minimum output from a user-supplied tolerance in basis points. The user expresses intent ("at most 0.5% slippage"); the chain enforces it against the actual reserves in the same transaction.

## Security

Checks-effects-interactions ordering throughout, a single external call path to the router, and Foundry fuzz tests over tolerance bounds, token paths and amounts.

```solidity
uint256[] memory amounts = router.getAmountsOut(amountIn, path);
uint256 minOut = (amounts[amounts.length - 1] * (BPS - maxSlippageBps)) / BPS;
uint256 received = _executeSwap(amountIn, minOut, path, msg.sender);
require(received >= minOut, "BestSwap: slippage exceeded");
```

The frontend (Next.js + wagmi) reads quotes for display only — it never participates in enforcement.
````

`src/content/work/bestswap-es.md`:

````markdown
---
title: BestSwap
lang: es
project: bestswap
order: 1
summary: Wrapper de swap sobre Uniswap V2 con protección de slippage on-chain.
securityTag: slippage on-chain
stack: [Solidity, Foundry, Next.js, wagmi]
repo: https://github.com/Armando8a-dev/best-swap
---

**TL;DR** — Un wrapper de swap sobre Uniswap V2 que calcula la protección de slippage on-chain vía `getAmountsOut`, en lugar de confiar en mínimos calculados por un frontend con precios desactualizados.

## Problema

La mayoría de las UIs de swap calculan el mínimo aceptable off-chain y lo pasan al router. Entre la cotización y la ejecución los precios se mueven — el usuario termina sandwicheado o su transacción revierte con errores confusos. La protección depende de qué tan frescos eran los datos del frontend.

## Enfoque

BestSwap cotiza el intercambio **al momento de ejecutar**, dentro del contrato: llama a `getAmountsOut` del router de Uniswap V2 y deriva el mínimo de salida a partir de una tolerancia en puntos base que define el usuario. El usuario expresa intención ("máximo 0.5% de slippage"); la cadena la hace cumplir contra las reservas reales en la misma transacción.

## Seguridad

Orden checks-effects-interactions en todo el contrato, una sola ruta de llamada externa al router, y fuzz tests en Foundry sobre límites de tolerancia, rutas de tokens y montos.

```solidity
uint256[] memory amounts = router.getAmountsOut(amountIn, path);
uint256 minOut = (amounts[amounts.length - 1] * (BPS - maxSlippageBps)) / BPS;
uint256 received = _executeSwap(amountIn, minOut, path, msg.sender);
require(received >= minOut, "BestSwap: slippage exceeded");
```

El frontend (Next.js + wagmi) lee cotizaciones solo para mostrarlas — nunca participa en la protección.
````

`src/content/work/yieldgarden-en.md`:

````markdown
---
title: YieldGarden
lang: en
project: yieldgarden
order: 2
summary: ERC-20 staking protocol with per-second reward accrual.
securityTag: gas-efficient checkpoints
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/yield-garden
---

**TL;DR** — An ERC-20 staking protocol where rewards accrue per second, using a checkpoint model that keeps every operation O(1) regardless of how many stakers exist.

## Problem

Naive staking implementations iterate over stakers or recompute each user's rewards from full history — costs grow with users and time until the contract becomes unusable.

## Approach

YieldGarden tracks a single global accumulator, `rewardPerTokenStored`, updated lazily whenever stake changes. Each user stores the accumulator value at their last interaction (`userRewardPerTokenPaid`); pending rewards are the difference times their balance. Two storage slots per user, constant gas.

## Security

The `updateReward` checkpoint runs before any state-changing action, stake/withdraw/claim follow checks-effects-interactions, and Foundry fuzz tests cover accrual across arbitrary time windows, including the `totalSupply == 0` edge case that traps many implementations.

```solidity
modifier updateReward(address account) {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = block.timestamp;
    if (account != address(0)) {
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
    }
    _;
}
```
````

`src/content/work/yieldgarden-es.md`:

````markdown
---
title: YieldGarden
lang: es
project: yieldgarden
order: 2
summary: Protocolo de staking ERC-20 con acumulación de recompensas por segundo.
securityTag: checkpoints eficientes en gas
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/yield-garden
---

**TL;DR** — Un protocolo de staking ERC-20 donde las recompensas se acumulan por segundo, usando un modelo de checkpoints que mantiene cada operación en O(1) sin importar cuántos stakers existan.

## Problema

Las implementaciones ingenuas de staking iteran sobre los stakers o recalculan las recompensas de cada usuario desde el historial completo — el costo crece con los usuarios y el tiempo hasta volver el contrato inusable.

## Enfoque

YieldGarden mantiene un solo acumulador global, `rewardPerTokenStored`, actualizado de forma perezosa cada vez que cambia el stake. Cada usuario guarda el valor del acumulador en su última interacción (`userRewardPerTokenPaid`); su recompensa pendiente es la diferencia por su balance. Dos slots de storage por usuario, gas constante.

## Seguridad

El checkpoint `updateReward` corre antes de cualquier acción que cambie estado, stake/withdraw/claim siguen checks-effects-interactions, y los fuzz tests de Foundry cubren la acumulación en ventanas de tiempo arbitrarias, incluyendo el caso borde `totalSupply == 0` que rompe muchas implementaciones.

```solidity
modifier updateReward(address account) {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = block.timestamp;
    if (account != address(0)) {
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
    }
    _;
}
```
````

`src/content/work/goalfund-en.md`:

````markdown
---
title: GoalFund
lang: en
project: goalfund
order: 3
summary: Trustless crowdfunding with reentrancy-safe automatic refunds.
securityTag: reentrancy-safe refunds
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/goal-fund
---

**TL;DR** — A crowdfunding contract with no intermediary: the creator withdraws only if the goal is met by the deadline; otherwise donors reclaim their funds — with refund logic hardened against reentrancy.

## Problem

Crowdfunding requires trust that the platform will actually refund donors when a campaign fails. Refund flows that transfer ETH are also the classic reentrancy target: a malicious contract re-enters `refund()` and drains funds.

## Approach

Two mutually exclusive end states enforced by the deadline: goal met → only the creator can withdraw, once; goal missed → each donor pulls their own refund (pull-payment pattern, no loops over donors).

## Security

The donor's recorded balance is zeroed **before** the transfer (checks-effects-interactions), so a re-entrant call finds nothing to claim. Foundry fuzz tests run arbitrary contribution distributions through both end states, and a malicious re-entering contract is part of the test suite.

```solidity
function refund() external {
    require(block.timestamp >= deadline, "GoalFund: campaign active");
    require(totalRaised < goal, "GoalFund: goal was met");
    uint256 amount = contributions[msg.sender];
    require(amount > 0, "GoalFund: nothing to refund");
    contributions[msg.sender] = 0; // effects before interaction
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "GoalFund: refund failed");
}
```
````

`src/content/work/goalfund-es.md`:

````markdown
---
title: GoalFund
lang: es
project: goalfund
order: 3
summary: Crowdfunding sin intermediarios con reembolsos automáticos reentrancy-safe.
securityTag: reembolsos reentrancy-safe
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/goal-fund
---

**TL;DR** — Un contrato de crowdfunding sin intermediarios: el creador retira solo si se cumple la meta antes de la fecha límite; si no, los donantes recuperan sus fondos — con lógica de reembolso endurecida contra reentrancy.

## Problema

El crowdfunding exige confiar en que la plataforma realmente reembolsará cuando una campaña falle. Los flujos de reembolso que transfieren ETH son además el objetivo clásico de reentrancy: un contrato malicioso reingresa a `refund()` y drena los fondos.

## Enfoque

Dos estados finales mutuamente excluyentes definidos por la fecha límite: meta cumplida → solo el creador retira, una vez; meta no cumplida → cada donante reclama su propio reembolso (patrón pull-payment, sin loops sobre donantes).

## Seguridad

El balance registrado del donante se pone en cero **antes** de la transferencia (checks-effects-interactions), así que una llamada reentrante no encuentra nada que reclamar. Los fuzz tests de Foundry ejecutan distribuciones arbitrarias de contribuciones por ambos estados finales, y un contrato malicioso reentrante forma parte de la suite.

```solidity
function refund() external {
    require(block.timestamp >= deadline, "GoalFund: campaign active");
    require(totalRaised < goal, "GoalFund: goal was met");
    uint256 amount = contributions[msg.sender];
    require(amount > 0, "GoalFund: nothing to refund");
    contributions[msg.sender] = 0; // effects before interaction
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "GoalFund: refund failed");
}
```
````

`src/content/work/proofpass-en.md`:

````markdown
---
title: ProofPass
lang: en
project: proofpass
order: 4
summary: Soulbound ERC-721 credentials with owner-controlled revocation.
securityTag: soulbound ERC-721
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/proof-pass
---

**TL;DR** — A soulbound (non-transferable) ERC-721 credential system for issuing verifiable on-chain badges, with revoke and re-issue controlled by the contract owner.

## Problem

Certificates and badges only mean something if they can't be bought. A standard NFT credential can be sold or transferred, destroying its value as proof of achievement.

## Approach

ProofPass overrides the ERC-721 transfer hook so tokens can be minted and burned, but never moved between wallets. The issuer can revoke (burn) a credential and re-issue it — covering lost wallets and mistaken issuance — while holders can prove ownership on-chain forever.

## Security

Transfer blocking lives in a single choke point (`_update`, OpenZeppelin v5), so no code path can bypass it. Foundry tests assert that every transfer variant reverts, that only the owner can mint/revoke, and that re-issuance preserves credential metadata.

```solidity
function _update(address to, uint256 tokenId, address auth)
    internal
    override
    returns (address)
{
    address from = _ownerOf(tokenId);
    if (from != address(0) && to != address(0)) {
        revert ProofPass__Soulbound(); // mint and burn only
    }
    return super._update(to, tokenId, auth);
}
```
````

`src/content/work/proofpass-es.md`:

````markdown
---
title: ProofPass
lang: es
project: proofpass
order: 4
summary: Credenciales ERC-721 soulbound con revocación controlada por el emisor.
securityTag: ERC-721 soulbound
stack: [Solidity, Foundry]
repo: https://github.com/Armando8a-dev/proof-pass
---

**TL;DR** — Un sistema de credenciales ERC-721 soulbound (no transferibles) para emitir insignias verificables on-chain, con revocación y re-emisión controladas por el owner del contrato.

## Problema

Los certificados e insignias solo valen si no se pueden comprar. Una credencial NFT estándar puede venderse o transferirse, destruyendo su valor como prueba de logro.

## Enfoque

ProofPass sobreescribe el hook de transferencia del ERC-721 para que los tokens puedan mintearse y quemarse, pero nunca moverse entre wallets. El emisor puede revocar (quemar) una credencial y re-emitirla — cubriendo wallets perdidas y emisiones por error — mientras el titular puede probar su credencial on-chain para siempre.

## Seguridad

El bloqueo de transferencias vive en un solo punto de control (`_update`, OpenZeppelin v5), así que ninguna ruta de código puede saltárselo. Los tests de Foundry verifican que toda variante de transferencia revierte, que solo el owner puede mintear/revocar, y que la re-emisión preserva los metadatos.

```solidity
function _update(address to, uint256 tokenId, address auth)
    internal
    override
    returns (address)
{
    address from = _ownerOf(tokenId);
    if (from != address(0) && to != address(0)) {
        revert ProofPass__Soulbound(); // solo mint y burn
    }
    return super._update(to, tokenId, auth);
}
```
````

- [ ] **Step 3: Build (validates schema)**

```bash
npm run build
```

Expected: exit 0, no content collection warnings.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/work/
git commit -m "feat: work content collection with 8 bilingual case studies"
```

---

### Task 8: FeaturedWork + MoreWork + Skills + Contact sections

**Files:**
- Create: `src/components/sections/FeaturedWork.astro`
- Create: `src/components/sections/MoreWork.astro`
- Create: `src/components/sections/SkillsSection.astro`
- Create: `src/components/sections/ContactSection.astro`

**Interfaces:**
- Consumes: collection `work` (Task 7), i18n (Task 3), `.card`/`.chip`/`.tag-security` classes (Task 2).
- Produces: `<FeaturedWork lang={Lang} />` (id `work`), `<MoreWork lang={Lang} />` (id `more-work`), `<SkillsSection lang={Lang} />` (id `skills`), `<ContactSection lang={Lang} />` (id `contact`).

- [ ] **Step 1: Create `src/components/sections/FeaturedWork.astro`**

```astro
---
// src/components/sections/FeaturedWork.astro
import { getCollection } from 'astro:content';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
const t = useTranslations(lang);
const entries = (await getCollection('work', (e) => e.data.lang === lang)).sort(
  (a, b) => a.data.order - b.data.order
);
const caseBase = lang === 'en' ? '/work' : '/es/work';
---

<section id="work" class="section">
  <div class="container">
    <p class="section-label">{t.work.label}</p>
    <h2 class="section-title">{t.work.title}</h2>
    <p class="section-sub">{t.work.sub}</p>

    <div class="grid">
      {entries.map((entry) => (
        <article class="card reveal">
          <div class="head">
            <h3 class="name">{entry.data.title}</h3>
            <span class="tag-security">{entry.data.securityTag}</span>
          </div>
          <p class="summary">{entry.data.summary}</p>
          <ul class="stack">
            {entry.data.stack.map((s) => <li class="chip">{s}</li>)}
          </ul>
          <div class="links">
            <a href={`${caseBase}/${entry.data.project}/`} class="case-link">{t.work.caseCta} →</a>
            <a href={entry.data.repo} target="_blank" rel="noopener noreferrer" class="repo-link mono">{t.work.repoCta} ↗</a>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
  }
  @media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; }
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .name { font-size: 1.3rem; }
  .summary { color: var(--text-secondary); margin-top: 0.85rem; }
  .stack { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.25rem; }
  .links {
    display: flex;
    gap: 1.5rem;
    margin-top: 1.5rem;
    align-items: center;
  }
  .case-link {
    color: var(--accent-strong);
    text-decoration: none;
    font-weight: 600;
  }
  .case-link:hover { text-decoration: underline; }
  .repo-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.85rem;
  }
  .repo-link:hover { color: var(--text); }
</style>
```

- [ ] **Step 2: Create `src/components/sections/MoreWork.astro`**

```astro
---
// src/components/sections/MoreWork.astro
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
const t = useTranslations(lang);
const groups = [
  { name: t.moreWork.webGroup, items: t.moreWork.web },
  { name: t.moreWork.dataGroup, items: t.moreWork.data },
];
---

<section id="more-work" class="section">
  <div class="container">
    <p class="section-label">{t.moreWork.label}</p>
    <h2 class="section-title">{t.moreWork.title}</h2>

    {groups.map((group) => (
      <div class="group">
        <h3 class="mono group-name">{group.name}</h3>
        <div class="grid">
          {group.items.map((item) => {
            const Tag = item.url ? 'a' : 'div';
            return (
              <Tag
                class="card item reveal"
                {...(item.url
                  ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {item.thumb && <img src={item.thumb} alt={item.title} class="thumb" loading="lazy" />}
                <h4 class="item-title">{item.title}{item.url && <span class="ext"> ↗</span>}</h4>
                <p class="item-desc">{item.description}</p>
                <ul class="tags">
                  {item.tags.map((tag) => <li class="chip">{tag}</li>)}
                </ul>
              </Tag>
            );
          })}
        </div>
      </div>
    ))}
  </div>
</section>

<style>
  .group { margin-top: 3rem; }
  .group-name {
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 1.25rem;
  }
  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr; }
  }
  .item { text-decoration: none; display: block; }
  .thumb {
    border-radius: 8px;
    margin-bottom: 1.1rem;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    width: 100%;
    border: 1px solid var(--border);
  }
  .item-title { font-size: 1.05rem; margin: 0; }
  .ext { color: var(--accent-strong); font-weight: 400; }
  .item-desc {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
</style>
```

- [ ] **Step 3: Create `src/components/sections/SkillsSection.astro`**

```astro
---
// src/components/sections/SkillsSection.astro
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
const t = useTranslations(lang);
---

<section id="skills" class="section">
  <div class="container">
    <p class="section-label">{t.skills.label}</p>
    <h2 class="section-title">{t.skills.title}</h2>

    <div class="groups">
      {t.skills.groups.map((group) => (
        <div class="group reveal">
          <h3 class="mono group-name">{group.name}</h3>
          <ul class="chips">
            {group.items.map((item) => <li class="chip">{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .groups {
    display: grid;
    gap: 2.25rem;
    margin-top: 3rem;
  }
  .group-name {
    font-size: 0.85rem;
    color: var(--accent-strong);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1rem;
  }
</style>
```

- [ ] **Step 4: Create `src/components/sections/ContactSection.astro`**

```astro
---
// src/components/sections/ContactSection.astro
import { useTranslations, SOCIAL, type Lang } from '../../i18n/ui';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
const t = useTranslations(lang);
---

<section id="contact" class="section">
  <div class="container narrow">
    <p class="section-label">{t.contact.label}</p>
    <h2 class="section-title">{t.contact.title}</h2>
    <p class="section-sub">{t.contact.sub}</p>

    <form action={SOCIAL.formspree} method="POST" class="form">
      <div class="field">
        <label for="name">{t.contact.name}</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div class="field">
        <label for="email">{t.contact.email}</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div class="field">
        <label for="message">{t.contact.message}</label>
        <textarea id="message" name="message" rows="6" required></textarea>
      </div>
      <button type="submit" class="btn">{t.contact.send}</button>
    </form>
  </div>
</section>

<style>
  .narrow { max-width: 640px; }
  .form { margin-top: 2.5rem; }
  .field { margin-bottom: 1.5rem; }
  button.btn { cursor: pointer; font-size: 1rem; font-family: var(--font-sans); }
</style>
```

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/FeaturedWork.astro src/components/sections/MoreWork.astro src/components/sections/SkillsSection.astro src/components/sections/ContactSection.astro
git commit -m "feat: FeaturedWork, MoreWork, Skills and Contact sections"
```

---

### Task 9: Pages — home (EN/ES) + case studies (EN/ES)

**Files:**
- Modify: `src/pages/index.astro` (full rewrite — becomes the EN home)
- Create: `src/pages/es/index.astro`
- Create: `src/pages/work/[slug].astro`
- Create: `src/pages/es/work/[slug].astro`

**Interfaces:**
- Consumes: everything from Tasks 3–8.
- Produces: routes `/`, `/es/`, `/work/{bestswap,yieldgarden,goalfund,proofpass}/`, `/es/work/*/`.

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
// src/pages/index.astro — EN home
import BaseLayout from '../layouts/BaseLayout.astro';
import SiteNav from '../components/SiteNav.astro';
import SiteFooter from '../components/SiteFooter.astro';
import Hero from '../components/sections/Hero.astro';
import Journey from '../components/sections/Journey.astro';
import FeaturedWork from '../components/sections/FeaturedWork.astro';
import MoreWork from '../components/sections/MoreWork.astro';
import SkillsSection from '../components/sections/SkillsSection.astro';
import ContactSection from '../components/sections/ContactSection.astro';
import { useTranslations } from '../i18n/ui';

const lang = 'en';
const t = useTranslations(lang);
---

<BaseLayout lang={lang} title={t.seo.title} description={t.seo.description} path="/">
  <SiteNav lang={lang} path="/" />
  <main>
    <Hero lang={lang} />
    <Journey lang={lang} />
    <FeaturedWork lang={lang} />
    <MoreWork lang={lang} />
    <SkillsSection lang={lang} />
    <ContactSection lang={lang} />
  </main>
  <SiteFooter lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/es/index.astro`**

```astro
---
// src/pages/es/index.astro — ES home
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteNav from '../../components/SiteNav.astro';
import SiteFooter from '../../components/SiteFooter.astro';
import Hero from '../../components/sections/Hero.astro';
import Journey from '../../components/sections/Journey.astro';
import FeaturedWork from '../../components/sections/FeaturedWork.astro';
import MoreWork from '../../components/sections/MoreWork.astro';
import SkillsSection from '../../components/sections/SkillsSection.astro';
import ContactSection from '../../components/sections/ContactSection.astro';
import { useTranslations } from '../../i18n/ui';

const lang = 'es';
const t = useTranslations(lang);
---

<BaseLayout lang={lang} title={t.seo.title} description={t.seo.description} path="/es/">
  <SiteNav lang={lang} path="/es/" />
  <main>
    <Hero lang={lang} />
    <Journey lang={lang} />
    <FeaturedWork lang={lang} />
    <MoreWork lang={lang} />
    <SkillsSection lang={lang} />
    <ContactSection lang={lang} />
  </main>
  <SiteFooter lang={lang} />
</BaseLayout>
```

- [ ] **Step 3: Create `src/pages/work/[slug].astro`**

```astro
---
// src/pages/work/[slug].astro — EN case study
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import SiteNav from '../../components/SiteNav.astro';
import SiteFooter from '../../components/SiteFooter.astro';
import { useTranslations } from '../../i18n/ui';

export async function getStaticPaths() {
  const entries = await getCollection('work', (e) => e.data.lang === 'en');
  const sorted = entries.sort((a, b) => a.data.order - b.data.order);
  return sorted.map((entry, i) => ({
    params: { slug: entry.data.project },
    props: { entry, next: sorted[(i + 1) % sorted.length] },
  }));
}

const lang = 'en';
const t = useTranslations(lang);
const { entry, next } = Astro.props;
const { Content } = await render(entry);
const path = `/work/${entry.data.project}/`;
---

<BaseLayout
  lang={lang}
  title={`${entry.data.title} — Armando Ochoa`}
  description={entry.data.summary}
  path={path}
>
  <SiteNav lang={lang} path={path} />
  <main class="container case">
    <a href="/#work" class="mono back">{t.caseStudy.back}</a>

    <header class="head">
      <h1 class="title">{entry.data.title}</h1>
      <span class="tag-security">{entry.data.securityTag}</span>
    </header>

    <ul class="meta mono">
      <li>{t.caseStudy.stack}: {entry.data.stack.join(' · ')}</li>
    </ul>

    <article class="prose">
      <Content />
    </article>

    <div class="links">
      <a href={entry.data.repo} target="_blank" rel="noopener noreferrer" class="btn">{t.caseStudy.repo} ↗</a>
      {entry.data.demo && (
        <a href={entry.data.demo} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">{t.caseStudy.demo} ↗</a>
      )}
    </div>

    <a href={`/work/${next.data.project}/`} class="next">
      <span class="mono next-label">{t.caseStudy.next}</span>
      <span class="next-title">{next.data.title} →</span>
    </a>
  </main>
  <SiteFooter lang={lang} />
</BaseLayout>

<style>
  .case { padding: 4rem 1.5rem 6rem; max-width: 760px; }
  .back {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.85rem;
  }
  .back:hover { color: var(--accent-strong); }
  .head {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  .title { font-size: clamp(2rem, 5vw, 3rem); }
  .meta {
    margin-top: 1.25rem;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
  .prose { margin-top: 2.5rem; }
  .links { display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
  .next {
    display: block;
    margin-top: 4rem;
    padding: 1.5rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    text-decoration: none;
    transition: border-color 0.2s;
  }
  .next:hover { border-color: rgba(140, 108, 255, 0.35); }
  .next-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .next-title {
    display: block;
    margin-top: 0.4rem;
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--accent-strong);
  }
</style>
```

- [ ] **Step 4: Create `src/pages/es/work/[slug].astro`**

Same as Step 3 with these exact differences: import paths gain one `../` level; `lang = 'es'`; the collection filter is `e.data.lang === 'es'`; `path` is `` `/es/work/${entry.data.project}/` ``; the back link href is `/es/#work`; the next link href is `` `/es/work/${next.data.project}/` ``. Full content:

```astro
---
// src/pages/es/work/[slug].astro — ES case study
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import SiteNav from '../../../components/SiteNav.astro';
import SiteFooter from '../../../components/SiteFooter.astro';
import { useTranslations } from '../../../i18n/ui';

export async function getStaticPaths() {
  const entries = await getCollection('work', (e) => e.data.lang === 'es');
  const sorted = entries.sort((a, b) => a.data.order - b.data.order);
  return sorted.map((entry, i) => ({
    params: { slug: entry.data.project },
    props: { entry, next: sorted[(i + 1) % sorted.length] },
  }));
}

const lang = 'es';
const t = useTranslations(lang);
const { entry, next } = Astro.props;
const { Content } = await render(entry);
const path = `/es/work/${entry.data.project}/`;
---

<BaseLayout
  lang={lang}
  title={`${entry.data.title} — Armando Ochoa`}
  description={entry.data.summary}
  path={path}
>
  <SiteNav lang={lang} path={path} />
  <main class="container case">
    <a href="/es/#work" class="mono back">{t.caseStudy.back}</a>

    <header class="head">
      <h1 class="title">{entry.data.title}</h1>
      <span class="tag-security">{entry.data.securityTag}</span>
    </header>

    <ul class="meta mono">
      <li>{t.caseStudy.stack}: {entry.data.stack.join(' · ')}</li>
    </ul>

    <article class="prose">
      <Content />
    </article>

    <div class="links">
      <a href={entry.data.repo} target="_blank" rel="noopener noreferrer" class="btn">{t.caseStudy.repo} ↗</a>
      {entry.data.demo && (
        <a href={entry.data.demo} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">{t.caseStudy.demo} ↗</a>
      )}
    </div>

    <a href={`/es/work/${next.data.project}/`} class="next">
      <span class="mono next-label">{t.caseStudy.next}</span>
      <span class="next-title">{next.data.title} →</span>
    </a>
  </main>
  <SiteFooter lang={lang} />
</BaseLayout>

<style>
  .case { padding: 4rem 1.5rem 6rem; max-width: 760px; }
  .back {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.85rem;
  }
  .back:hover { color: var(--accent-strong); }
  .head {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  .title { font-size: clamp(2rem, 5vw, 3rem); }
  .meta {
    margin-top: 1.25rem;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
  .prose { margin-top: 2.5rem; }
  .links { display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
  .next {
    display: block;
    margin-top: 4rem;
    padding: 1.5rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    text-decoration: none;
    transition: border-color 0.2s;
  }
  .next:hover { border-color: rgba(140, 108, 255, 0.35); }
  .next-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .next-title {
    display: block;
    margin-top: 0.4rem;
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--accent-strong);
  }
</style>
```

- [ ] **Step 5: Build and verify new routes**

```bash
npm run build
ls dist/index.html dist/es/index.html dist/work/bestswap/index.html dist/es/work/proofpass/index.html
```

Expected: build exit 0; all four files exist. Note: legacy pages (`/blockchain`, `/en/*`, etc.) still build — they die in Task 10.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/es/ src/pages/work/
git commit -m "feat: new home (EN/ES) and bilingual case-study pages"
```

---

### Task 10: Delete legacy + redirects + drop icon deps

**Files:**
- Delete: legacy pages, layouts, components, utils, data, public assets (exact list below)
- Modify: `astro.config.mjs` (add redirects, remove icon integration)
- Modify: `package.json`, `package-lock.json` (remove icon deps)

- [ ] **Step 1: Delete legacy files**

```bash
cd /Users/armandoochoa/Documents/GitHub/Front/mi-portafolio
git rm -r --cached --ignore-unmatch src/pages/en src/pages/blockchain src/pages/web-developer src/pages/data-analyst 2>/dev/null
rm -rf src/pages/en src/pages/blockchain src/pages/web-developer src/pages/data-analyst
rm -f src/layouts/Layout.astro src/layouts/PortfolioLayout.astro
rm -f src/components/Hero.astro src/components/About.astro src/components/PortfolioCards.astro \
      src/components/Contact.astro src/components/Footer.astro src/components/Navbar.astro \
      src/components/SkillIcon.astro src/components/LanguageSelector.astro \
      src/components/PortfolioHeader.astro src/components/PortfolioFooter.astro \
      src/components/PortfolioSkillIcon.astro src/components/SiteSEO.astro \
      src/components/ProjectCard.astro src/components/ProjectDevCard.astro \
      src/components/ProjectGalleryCard.astro src/components/DataProjectCard.astro \
      src/components/DataProyectGallery.astro src/components/Projects.astro \
      src/components/Welcome.astro src/components/HeaderLink.astro src/components/Header.astro \
      src/components/Web3ProjectCard.astro
rm -f src/utils/translations.js src/data/navLinks.js
rm -rf public/styles public/locales
rm -f public/index.js
```

(Note: `src/components/Web3ProjectCard.astro` was an uncommitted work-in-progress file superseded by this redesign — it goes too. `rmdir` empty dirs `src/utils`/`src/data` if nothing remains: `rmdir src/utils src/data 2>/dev/null || true`.)

- [ ] **Step 2: Remove icon deps (nothing references them now)**

```bash
grep -rn "astro-icon\|iconify" src/ && echo "STOP: still referenced" || echo "safe to remove"
npm uninstall astro-icon @iconify-json/simple-icons
```

Expected: "safe to remove", then npm exit 0.

- [ ] **Step 3: Rewrite `astro.config.mjs` with redirects**

```js
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
```

- [ ] **Step 4: Build + verify legacy is gone**

```bash
npm run build
grep -rli "0062b9\|4299e1\|8c52ff\|poppins\|source sans" dist/ --include="*.html" --include="*.css" | wc -l
ls dist/blockchain/index.html dist/en/index.html
```

Expected: build exit 0; grep count `0`; the two `ls` paths exist but contain only redirect meta-refresh pages (verify: `grep -o 'http-equiv="refresh"' dist/blockchain/index.html` → matches).

- [ ] **Step 5: Commit**

```bash
git add -u src/
git add -u public/styles public/locales public/index.js
git add astro.config.mjs package.json package-lock.json
git status --short
git commit -m "refactor: remove legacy design system, pages and deps; add redirects"
```

**Never `git add -u public/` as a whole** — `public/thumbs/` has pre-existing uncommitted changes the user chose not to commit. Before committing, confirm the staged list contains ONLY the Step-1 deletions plus the three modified files — nothing from `public/thumbs/`.

---

### Task 11: OG image + final verification

**Files:**
- Create: `scripts/generate-og.mjs`
- Create (generated): `public/og-default.png`

- [ ] **Step 1: Create `scripts/generate-og.mjs`**

```js
// scripts/generate-og.mjs — run once: node scripts/generate-og.mjs
import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0A0E16"/>
  <rect x="0" y="0" width="8" height="630" fill="#8C6CFF"/>
  <text x="80" y="240" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#E8ECF4">Armando Ochoa</text>
  <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#8C6CFF">Full Stack Web3 Developer</text>
  <text x="80" y="400" font-family="Courier New, monospace" font-size="24" fill="#94A3B8">Solidity · Smart Contracts · DeFi · 6+ yrs fintech</text>
  <text x="80" y="560" font-family="Courier New, monospace" font-size="20" fill="#94A3B8">www.armandoochoa.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-default.png');
console.log('OK public/og-default.png');
```

- [ ] **Step 2: Generate**

```bash
node scripts/generate-og.mjs
ls -la public/og-default.png
```

Expected: "OK public/og-default.png"; file exists, > 10KB.

- [ ] **Step 3: Full verification (spec §11)**

```bash
npm run build
npm run preview &
sleep 3
for p in / /es/ /work/bestswap/ /work/yieldgarden/ /work/goalfund/ /work/proofpass/ /es/work/bestswap/ /blockchain /web-developer /data-analyst /en; do
  curl -s -o /dev/null -w "$p: %{http_code}\n" "http://localhost:4321$p"
done
kill %1
```

Expected: every route `200`.

```bash
grep -rli "0062b9\|4299e1\|8c52ff\|poppins\|source sans" dist/ --include="*.html" --include="*.css" | wc -l
grep -c 'hreflang' dist/index.html
grep -o '<html lang="es"' dist/es/index.html
```

Expected: `0`; hreflang count ≥ 3; `<html lang="es"` matches.

- [ ] **Step 4: Visual pass**

Open `http://localhost:4321/` and `/es/` in a browser (or screenshot tool): check 375px and desktop widths for: sticky nav, hero hierarchy, timeline line/dots, card hover, thumbnails in Data group, form styling, footer. Check one case study (`/work/goalfund/`) — code block renders with mono font and dark panel.

- [ ] **Step 5: Commit + wrap up**

```bash
git add scripts/generate-og.mjs public/og-default.png
git commit -m "feat: OG image + final verification"
git log --oneline mi-portafolio-v1..redesign-v2
```

Expected: ~11 commits on the branch. **Do not merge or push** — the user reviews the preview first; merging `redesign-v2` → `mi-portafolio-v1` triggers the GitHub Pages deploy.

---

## Post-plan notes for the user

- Fill when available: Accelerator official name (`src/i18n/ui.ts` → `journey.nodes[2].org`), Banregio metrics (`journey.nodes[0].metrics`), demo/etherscan URLs (case-study frontmatter).
- The plan intentionally leaves `public/thumbs/*` and `src/assets/images/profile.jpg` untouched; the profile photo is not used in the new design (the hero is typographic) — re-add later if desired.
- Deploy = merge `redesign-v2` into `mi-portafolio-v1` and push.

# Rediseño del portafolio — "De sistemas bancarios a smart contracts"

**Fecha:** 2026-07-14
**Estado:** Aprobado por Armando (diseño validado en sesión de brainstorming)
**Repo:** `mi-portafolio` (Astro, output estático)

---

## 1. Contexto y problema

El sitio actual son 4 mini-sitios con 2 sistemas de diseño en conflicto:

- **Home** (`/`, `/en`): `Layout.astro` + `global.css` — Poppins, fondo crema `#f8f7f4`, azul `#4299e1`, contenido vía `src/utils/translations.js`.
- **Subpáginas** (`/blockchain`, `/web-developer`, `/data-analyst` y sus espejos `/en/*`): `PortfolioLayout.astro` + `public/styles/style.css` (plantilla vieja) — Source Sans Pro, azul `#0062b9`, contenido hardcodeado y duplicado por idioma.
- La sección Blockchain agregó un tercer acento (`#8c52ff`) que no armoniza con ninguno de los dos sistemas.

Además hay código muerto verificado (sin importarse en ninguna página): `SiteSEO.astro`, `ProjectCard.astro`, `DataProjectCard.astro`, `Projects.astro`, `DataProyectGallery.astro`, `Welcome.astro`, `HeaderLink.astro`, `Header.astro`, `public/locales/{es,en}/translation.json`.

## 2. Decisiones de diseño (validadas con el usuario)

| Decisión | Elección |
|---|---|
| Estructura | Un solo sitio narrativo (la carrera se cuenta como historia fintech → web → data → Web3) |
| Estética | Fintech oscuro premium (vibe Stripe/Linear; nada de estética cripto genérica) |
| Idiomas | Bilingüe con **EN primario en `/`** y ES en `/es/` (invierte el orden actual) |
| Trayectoria | Timeline visual con fechas y logros + secciones de proyectos |
| Arquitectura | One-pager narrativo + páginas de case study por proyecto Web3 |

## 3. Identidad visual

### 3.1 Tokens de color (un solo sistema, en `src/styles/global.css`)

```css
:root {
  /* Fondos */
  --bg: #0A0E16;            /* azul-carbón profundo, NO negro puro */
  --surface: #111726;       /* cards, superficies elevadas */
  --surface-2: #161D30;     /* hover de superficies */
  --border: rgba(232, 236, 244, 0.08);

  /* Texto */
  --text: #E8ECF4;
  --text-secondary: #94A3B8;

  /* Acento — UNO SOLO, usado con disciplina */
  --accent: #8C6CFF;              /* violeta familia Ethereum, contraste AA sobre --bg */
  --accent-dim: rgba(140, 108, 255, 0.12);  /* fondos de tags/chips */
  --accent-strong: #A78BFA;       /* hover / texto acento sobre superficies */
}
```

Reglas de uso del acento: links, CTAs, nodo activo del timeline, tags de seguridad, focus rings. **Prohibido** introducir acentos adicionales por sección — esa fue la causa raíz del problema de armonía.

### 3.2 Tipografía

- **Archivo** (variable, ejes weight + width) — todo el UI. Títulos en Archivo **Expanded Bold** (look institucional-fintech distintivo). Body en Archivo regular.
- **IBM Plex Mono** — números, fechas, labels de sección, metadatos, código.
- Self-hosted vía Fontsource (`@fontsource-variable/archivo`, `@fontsource/ibm-plex-mono`), `font-display: swap`. Sin CDN de Google Fonts.

### 3.3 Motivos y personalidad

- Labels de sección numerados en mono: `01 / JOURNEY`, `02 / WORK`…
- Metadatos estilo block-explorer en case studies (fechas, red, dirección de contrato cuando exista) como decoración funcional.
- **Prohibido**: glassmorphism, glow, gradientes morados decorativos, iconitos de stack en cuadrícula. La personalidad sale de la tipografía, la estructura y los datos reales.
- Animaciones: reveal sutil al scroll en timeline y cards; siempre respetando `prefers-reduced-motion`.

## 4. Estructura del Home (`/` EN, `/es/` ES)

Orden de secciones:

1. **Nav** — sticky, minimal: nombre/logo texto, links (Work, Journey, Skills, Contact), switch EN⇄ES que preserva la ruta actual.
2. **Hero** — posicionamiento: *"Full Stack Web3 Developer — Solidity & Smart Contracts. 6+ years building banking software. Now building DeFi."* (ES equivalente). Fila de metadatos en mono: ubicación · Cofounder @ ALFA 3 · Blockchain Accelerator '26. CTAs: "View work" (ancla) + GitHub.
3. **Journey** (`#journey`) — timeline vertical de 4 nodos. Copy orientado a impacto/problema resuelto, no a responsabilidades (criterio explícito del usuario). Cada nodo admite campo opcional `metrics` para agregar números después sin tocar diseño:
   - **2019 — Banregio / Hey Banco** · Desarrollador Web Full Stack (enfoque Frontend). Más de 6 años construyendo plataformas financieras usadas a diario por miles de clientes. Dos proyectos destacables:
     - *Onboarding Digital*: contratación 100% digital de productos financieros — abrir cuentas y solicitar productos sin ir a sucursal. Angular/TypeScript, microservicios Java/Spring Boot, SQL, integración con APIs bancarias.
     - *Banca Empresarial*: portal de operaciones financieras para empresas — transferencias nacionales, nómina, pagos y dispersiones, administración de usuarios y permisos.
   - **2025 — TripleTen** · Certificación en Análisis de Datos. Python, Pandas, NumPy, SQL, Tableau, Power BI, estadística aplicada. Proyectos: churn, segmentación, mercado de videojuegos.
   - **2026 — Blockchain Accelerator** · (nombre oficial pendiente; usar "Blockchain Accelerator" mientras). Solidity, smart contracts, Ethereum L1/L2, dApps, DeFi, oráculos, seguridad de contratos.
   - **2026 — ALFA 3** · Cofundador. Consultoría de desarrollo de software: sitios web modernos, despliegue Vercel/Railway, automatización de datos con Python. Proyecto Dolovibes: infraestructura completa (dominio, frontend Vercel, backend Railway, pipeline de datos con Pandas para marketing).
4. **Featured Web3 Work** (`#work`) — 4 cards, cada una: nombre, one-liner del problema, tag de seguridad, badges de stack, links (case study interno + GitHub):

   | Proyecto | Tag de seguridad | Stack | Repo |
   |---|---|---|---|
   | BestSwap | slippage on-chain | Solidity · Foundry · Next.js · wagmi | github.com/Armando8a-dev/best-swap |
   | YieldGarden | gas-efficient checkpoints | Solidity · Foundry | github.com/Armando8a-dev/yield-garden |
   | GoalFund | reentrancy-safe refunds | Solidity · Foundry | github.com/Armando8a-dev/goal-fund |
   | ProofPass | soulbound ERC-721 | Solidity · Foundry | github.com/Armando8a-dev/proof-pass |

5. **More Work** (`#more-work`) — dos grupos compactos con cards pequeñas de link externo:
   - *Web*: Landing Kit (landing-fisio-ui.netlify.app · Next.js/Tailwind/shadcn), Invitación de Boda (invitation-wedding-ui.netlify.app · React/Tailwind), Dolovibes (infra full-stack; link opcional si existe).
   - *Data*: Segmentación de Clientes, Customer Churn Analysis, Video Games Market — con los thumbnails actuales de `public/thumbs/` y sus URLs actuales de Tableau/GitHub Pages.
6. **Skills** (`#skills`) — chips de texto en mono con borde sutil, agrupados: **Blockchain** (Solidity, Foundry, OpenZeppelin, Ethereum, wagmi, viem, RainbowKit), **Web** (Angular, TypeScript, JavaScript, Java, Spring Boot, React, Next.js, Astro, Node.js, HTML, CSS, SQL, REST APIs), **Data** (Python, Pandas, NumPy, Tableau, Power BI, PostgreSQL). Sin iconos.
7. **Contact** (`#contact`) — pitch corto + form Formspree existente (`https://formspree.io/f/mblzlndn`) + email/LinkedIn/GitHub.
8. **Footer** — minimal: © año dinámico, links sociales (GitHub `Armando8a-dev`, LinkedIn `armando-ochoa-dev`), nota "Built with Astro — view source" al repo.

## 5. Case studies (`/work/<slug>/` EN, `/es/work/<slug>/` ES)

Slugs: `bestswap`, `yieldgarden`, `goalfund`, `proofpass`. Un template único; contenido en **Astro Content Collections** (`src/content/work/`), un markdown por proyecto por idioma (8 archivos), frontmatter:

```yaml
title, slug, lang, summary, problem_tag, stack: [], repo, demo?, etherscan?, order
```

Secciones del template: TL;DR (2 líneas) → Problema → Solución/arquitectura → **Seguridad** (CEI, reentrancy guards, fuzz testing — con snippet de código Solidity real del repo) → Stack → Links → nav "próximo proyecto". Metadatos mono arriba (fecha, red, estado).

Contenido base por proyecto (descripciones ya redactadas EN/ES, expandir con detalle de seguridad al implementar):

- **BestSwap** — Wrapper de swap sobre Uniswap V2 con protección de slippage on-chain vía `getAmountsOut`, en lugar de depender de precios off-chain desactualizados.
- **YieldGarden** — Staking ERC-20 con acumulación de recompensas por segundo y modelo de checkpoints eficiente en gas.
- **GoalFund** — Crowdfunding sin intermediarios: retiro del creador si se cumple la meta, reembolso automático si no; lógica de reembolso reentrancy-safe.
- **ProofPass** — Credenciales ERC-721 soulbound con revocación y re-emisión controlada por el owner.

## 6. i18n

- Diccionario tipado único en `src/i18n/ui.ts` + helpers (`getLangFromUrl`, `useTranslations`). Muere `src/utils/translations.js` y todo contenido duplicado hardcodeado.
- EN default en `/`; ES espejo en `/es/`. El switcher mapea ruta actual ⇄ equivalente en el otro idioma.
- `hreflang` recíproco en `<head>` de cada página.

## 7. Rutas y redirects (en `astro.config.mjs`)

| Ruta vieja | Destino |
|---|---|
| `/blockchain` | `/#work` |
| `/web-developer` | `/#more-work` |
| `/data-analyst` | `/#more-work` |
| `/en` | `/` |
| `/en/blockchain` | `/#work` |
| `/en/web-developer` | `/#more-work` |
| `/en/data-analyst` | `/#more-work` |

Nota: la raíz pasa de ES a EN; los visitantes hispanohablantes tienen el switch visible en el nav (sin banner de auto-detección — YAGNI).

## 8. Limpieza técnica

**Eliminar:** `src/layouts/PortfolioLayout.astro`, `src/components/{PortfolioHeader,PortfolioFooter,PortfolioSkillIcon,SiteSEO,ProjectCard,ProjectDevCard,ProjectGalleryCard,DataProjectCard,DataProyectGallery,Projects,Welcome,HeaderLink,Header}.astro`, `public/styles/style.css`, `public/index.js`, `public/locales/`, `src/utils/translations.js`, `src/data/navLinks.js`, páginas viejas (`src/pages/{blockchain,web-developer,data-analyst}/`, `src/pages/en/`), y los componentes home actuales que se reescriben (`Hero`, `About`, `PortfolioCards`, `Contact`, `Footer`, `Navbar`, `SkillIcon`, `LanguageSelector` — se reemplazan por los nuevos).

**Conservar:** endpoint Formspree, `public/thumbs/*`, `src/assets/images/profile.jpg`, URLs sociales (GitHub `Armando8a-dev`, LinkedIn `armando-ochoa-dev`).

**Dependencias:** evaluar si `astro-icon`/`@iconify-json/simple-icons` siguen siendo necesarios (solo íconos sociales del footer; pueden ser SVG inline y eliminar ambas dependencias). Agregar `@astrojs/sitemap`, `@fontsource-variable/archivo`, `@fontsource/ibm-plex-mono`.

## 9. SEO y meta

- Componente SEO real usado por el layout único: title, description, canonical, OG (title/description/type/image), twitter card, hreflang.
- Title: "Armando Ochoa — Full Stack Web3 Developer".
- Description EN: "Full Stack Web3 Developer — Solidity, Smart Contracts & DeFi. 6+ years of fintech engineering experience." / ES: "Full Stack Web3 Developer — Solidity, Smart Contracts y DeFi. 6+ años de experiencia en desarrollo fintech."
- Imagen OG estática oscura (`public/og-default.png`) coherente con la identidad.
- Sitemap con `@astrojs/sitemap`.

## 10. Accesibilidad y performance

- Contraste AA en todo el tema oscuro (verificar `--text-secondary` sobre `--surface`).
- `:focus-visible` con anillo `--accent` en todos los interactivos.
- `prefers-reduced-motion` desactiva reveals y transiciones no esenciales.
- Fuentes self-hosted con `font-display: swap`; imágenes con `loading="lazy"` fuera del viewport inicial.
- Objetivo: Lighthouse ≥95 en las 4 categorías.

## 11. Criterios de verificación

1. `npm run build` sin errores; `npm run preview` con todas las rutas 200: `/`, `/es/`, `/work/{bestswap,yieldgarden,goalfund,proofpass}/`, `/es/work/*`, y redirects viejos funcionando.
2. Cero referencias a `#0062b9`, `#4299e1`, `#8c52ff`, Poppins o Source Sans Pro en el output final.
3. Ambos idiomas con contenido completo y equivalente (sin strings hardcodeados de un solo idioma en componentes).
4. Revisión visual en móvil (375px) y desktop de home + un case study en ambos idiomas.

## 12. Contenido pendiente del usuario (slots, no bloquean)

- Nombre oficial del programa Blockchain Accelerator.
- Métricas de Banregio (usuarios, equipo, releases) — el timeline las admite como campo opcional.
- Links de demo/Etherscan de los proyectos Web3 cuando existan (frontmatter opcional ya previsto).

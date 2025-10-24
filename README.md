# 🚀 Portafolio de Armando Ochoa

Portafolio personal bilingüe (Español/Inglés) que combina mis dos especialidades profesionales: **Desarrollo Web** y **Análisis de Datos**. Diseñado para ser rápido, responsivo y mostrar mis habilidades de forma profesional.

## 🌐 Demo en Vivo

**[Ver Portafolio](https://armando8a-dev.github.io/mi-portafolio/)**

---

## ✨ Características Principales

### 🌍 Internacionalización (i18n)
- ✅ **Soporte bilingüe** completo (Español/Inglés)
- ✅ **Selector de idioma** intuitivo en el navbar
- ✅ **URLs localizadas** (`/` para español, `/en` para inglés)
- ✅ **Traducciones dinámicas** en todos los componentes

### 🎨 Diseño Moderno
- ✅ **Diseño minimalista** con alternancia de fondos (blanco/beige)
- ✅ **Componentes modulares** reutilizables
- ✅ **Totalmente responsivo** (móvil, tablet, desktop)
- ✅ **Animaciones suaves** y efectos hover
- ✅ **Paleta de colores** profesional y accesible

### 📱 Secciones del Portafolio
1. **Hero** - Presentación con llamado a la acción
2. **Sobre Mí** - Descripción profesional y habilidades técnicas
3. **Portafolios** - Dos tarjetas para acceder a portafolios especializados:
   - 📊 **Analista de Datos** → `/data-analyst`
   - 💻 **Desarrollador Web** → `/web-developer`
4. **Contacto** - Formulario funcional integrado con Formspree

### 🔧 Funcionalidades Técnicas
- ✅ **Navegación dinámica** según idioma
- ✅ **SEO optimizado** con meta tags
- ✅ **Rendimiento ultra-rápido** gracias a Astro
- ✅ **Formulario de contacto** funcional
- ✅ **Favicon personalizado** con iniciales "AO"
- ✅ **Foto de perfil** en el navbar

---

## 🛠️ Tecnologías Utilizadas

### Core
- **[Astro 5.13.11](https://astro.build/)** - Framework para sitios web ultra-rápidos
- **JavaScript/TypeScript** - Lenguaje de programación
- **CSS3** - Estilos con variables CSS y diseño responsive

### Librerías y Herramientas
- **[astro-i18next](https://github.com/yassinedoghri/astro-i18next)** - Sistema de internacionalización
- **[i18next](https://www.i18next.com/)** - Framework de traducciones
- **[Astro Icon](https://github.com/natemoo-re/astro-icon)** - Gestión de iconos SVG
- **[Formspree](https://formspree.io/)** - Backend para formulario de contacto

### Despliegue
- **GitHub Pages** - Hosting gratuito y confiable

---

## 📁 Estructura del Proyecto

```
mi-portafolio/
├── public/
│   ├── favicon.svg                 # Icono del sitio
│   └── locales/                    # Archivos de traducción JSON
│       ├── es/translation.json
│       └── en/translation.json
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── profile.jpg         # Foto de perfil
│   ├── components/
│   │   ├── About.astro             # Sección "Sobre Mí"
│   │   ├── Contact.astro           # Formulario de contacto
│   │   ├── DataProjectCard.astro   # Tarjeta de proyecto de datos
│   │   ├── DataProyectGallery.astro
│   │   ├── Footer.astro            # Pie de página
│   │   ├── Header.astro
│   │   ├── Hero.astro              # Sección principal
│   │   ├── LanguageSelector.astro  # Selector de idioma
│   │   ├── Navbar.astro            # Barra de navegación
│   │   ├── PortfolioCards.astro    # Tarjetas de portafolios
│   │   ├── ProjectCard.astro       # Tarjeta de proyecto web
│   │   ├── Projects.astro          # Galería de proyectos
│   │   ├── SiteSEO.astro
│   │   ├── SkillIcon.astro         # Icono de habilidad
│   │   └── Welcome.astro
│   ├── data/
│   │   └── navLinks.js             # Enlaces de navegación dinámicos
│   ├── layouts/
│   │   └── Layout.astro            # Layout principal
│   ├── pages/
│   │   ├── index.astro             # Página principal (ES)
│   │   ├── data-analyst.astro      # Portafolio de análisis de datos
│   │   ├── web-developer.astro     # Portafolio de desarrollo web
│   │   └── en/
│   │       └── index.astro         # Página principal (EN)
│   ├── styles/
│   │   └── global.css              # Estilos globales y variables
│   └── utils/
│       └── translations.js         # Sistema de traducciones
├── astro-i18next.config.mjs        # Configuración i18n
├── astro.config.mjs                # Configuración de Astro
├── package.json
└── README.md
```

---

## 🎨 Paleta de Colores

```css
--color-fondo: #f8f7f4;              /* Beige claro */
--color-fondo-secundario: #ffffff;   /* Blanco */
--color-texto-principal: #2d3748;    /* Gris oscuro */
--color-texto-secundario: #718096;   /* Gris medio */
--color-primario: #4299e1;           /* Azul (Web Dev) */
--color-data: #667eea;               /* Morado (Data Analyst) */
```

---

## 🏃‍♂️ Instalación y Uso

### Prerrequisitos
- Node.js 18+ instalado
- npm o pnpm

### Pasos

1. **Clona el repositorio:**
```bash
git clone https://github.com/Armando8a-dev/mi-portafolio.git
cd mi-portafolio
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Ejecuta el servidor de desarrollo:**
```bash
npm run dev
```

4. **Abre tu navegador en:**
```
http://localhost:4321
```

### Comandos Disponibles

| Comando | Acción |
|---------|--------|
| `npm run dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build` | Construye el sitio para producción en `./dist/` |
| `npm run preview` | Vista previa del build localmente |
| `npm run astro` | Ejecuta comandos CLI de Astro |

---

## 🌍 Sistema de Internacionalización

### Estructura de Traducciones

El sistema de i18n está implementado en `src/utils/translations.js`:

```javascript
export const translations = {
  es: { /* traducciones en español */ },
  en: { /* traducciones en inglés */ }
};
```

### Cómo Agregar Nuevas Traducciones

1. Edita `src/utils/translations.js`
2. Añade la clave en ambos idiomas (es/en)
3. Usa en tus componentes:

```astro
---
import { getTranslations } from '../utils/translations';
const currentLang = Astro.url.pathname.startsWith('/en') ? 'en' : 'es';
const t = getTranslations(currentLang);
---
<h1>{t.hero.greeting}</h1>
```

---

## 📊 Características de los Portafolios Especializados

### Portafolio de Desarrollo Web (`/web-developer`)
- Proyectos con **React**, **Angular**, **Astro**
- Enfoque en **Frontend** moderno
- Muestra de aplicaciones interactivas

### Portafolio de Análisis de Datos (`/data-analyst`)
- Proyectos con **Python**, **SQL**, **Tableau**
- Visualizaciones de datos
- Insights y storytelling con datos

---

## 🚀 Despliegue

Este portafolio está configurado para desplegarse en **GitHub Pages**:

1. Asegúrate de tener configurado `base` en `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://Armando8a-dev.github.io',
  base: '/mi-portafolio'
});
```

2. Ejecuta el build:
```bash
npm run build
```

3. Despliega en GitHub Pages (configurado en el repositorio)

---

## 📝 Personalización

### Cambiar Información Personal

1. **Hero y About**: Edita `src/utils/translations.js`
2. **Foto de perfil**: Reemplaza `src/assets/images/profile.jpg`
3. **Favicon**: Actualiza `public/favicon.svg`
4. **Enlaces sociales**: Modifica `src/components/Footer.astro`
5. **Formulario**: Cambia el endpoint en `src/components/Contact.astro`

### Agregar Nuevos Proyectos

**Para Web Developer:**
Edita `src/components/Projects.astro` y agrega un nuevo `<ProjectCard>`

**Para Data Analyst:**
Edita `src/components/DataProyectGallery.astro` y agrega un nuevo `<DataProjectCard>`

---

## 🤝 Contribuciones

Las sugerencias y mejoras son bienvenidas. Si encuentras algún error o tienes ideas:

1. Abre un **Issue**
2. Envía un **Pull Request**

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

**Armando Ochoa**
- 🌐 [Portafolio](https://armando8a-dev.github.io/mi-portafolio/)
- 💼 [LinkedIn](https://www.linkedin.com/in/armando-ochoa-dev)
- 🐙 [GitHub](https://github.com/Armando8a-dev)

---

## 🙏 Agradecimientos

- **Astro** por su increíble framework
- **GitHub** por el hosting gratuito
- **Formspree** por la integración de formularios
- La comunidad de desarrollo web por la inspiración

---

**⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!**

3.  **Instala las dependencias:**
    ```sh
    npm install
    ```

4.  **Inicia el servidor de desarrollo:**
    ```sh
    npm run dev
    ```

¡Y listo! Abre [http://localhost:4321](http://localhost:4321) (o el puerto que hayas configurado) en tu navegador para ver el proyecto.

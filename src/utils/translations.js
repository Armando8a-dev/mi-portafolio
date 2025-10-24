// src/utils/translations.js

export const translations = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre Mí",
      portfolios: "Portafolios",
      contact: "Contacto"
    },
    hero: {
      greeting: "HOLA, SOY ARMANDO OCHOA",
      description: "Apasionado por crear aplicaciones y sitios web funcionales, optimizados y orientados a resultados. Busco combinar mi experiencia en desarrollo con el análisis de datos para impulsar la toma de decisiones y el crecimiento de los productos digitales."
    },
    about: {
      title: "Sobre Mí",
      subtitle: "Aquí encontrarás más información sobre mí, lo que hago y mis habilidades.",
      knowMe: "¡Conóceme!",
      description: "Soy <strong>Desarrollador Full Stack</strong> con especial enfoque en <strong>Frontend</strong>. Me motiva construir interfaces accesibles, atractivas y de alto rendimiento que generen valor en cada proyecto. Actualmente, complemento mi trayectoria con formación como <strong>Analista de datos</strong>, lo que me permite proponer soluciones basadas en información objetiva para optimizar productos digitales y procesos.",
      skills: "Mis Habilidades",
      contactBtn: "Contáctame"
    },
    portfolios: {
      title: "Mis Portafolios",
      subtitle: "Explora mis dos especialidades profesionales: análisis de datos y desarrollo web.",
      dataAnalyst: {
        title: "Analista de Datos",
        description: "Descubre mis proyectos de análisis de datos, visualización e insights que transforman información en decisiones estratégicas.",
        button: "Ver Portfolio"
      },
      webDeveloper: {
        title: "Desarrollador Web",
        description: "Explora mis proyectos de desarrollo web, aplicaciones interactivas y soluciones digitales creativas.",
        button: "Ver Portfolio"
      }
    },
    contact: {
      title: "Contacto",
      subtitle: "Si estás interesado en trabajar conmigo o tienes alguna pregunta, no dudes en contactarme.",
      form: {
        name: "Nombre",
        email: "Correo Electrónico",
        message: "Mensaje",
        submit: "Enviar Mensaje"
      }
    },
    footer: {
      description: "Desarrollador Frontend y Analista de Datos. Creo experiencias web y soluciones basadas en datos que impulsan el éxito del proyecto.",
      social: "Social",
      madeBy: "Hecho por Armando Ochoa"
    },
    pages: {
      webDeveloper: {
        title: "DESARROLLADOR WEB",
        description: "Creando experiencias digitales modernas, funcionales y optimizadas. Especializado en desarrollo frontend con React, Angular, Astro y tecnologías web modernas.",
        backHome: "← Volver al Inicio"
      },
      dataAnalyst: {
        title: "ANALISTA DE DATOS",
        description: "Transformo datos en insights accionables mediante Python, SQL, Tableau y storytelling efectivo para impulsar decisiones estratégicas.",
        backHome: "← Volver al Inicio"
      }
    }
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      portfolios: "Portfolios",
      contact: "Contact"
    },
    hero: {
      greeting: "HI, I'M ARMANDO OCHOA",
      description: "Passionate about creating functional, optimized, and results-driven applications and websites. I seek to combine my development experience with data analysis to drive decision-making and digital product growth."
    },
    about: {
      title: "About Me",
      subtitle: "Here you'll find more information about me, what I do, and my skills.",
      knowMe: "Get to Know Me!",
      description: "I'm a <strong>Full Stack Developer</strong> with a special focus on <strong>Frontend</strong>. I'm motivated to build accessible, attractive, and high-performance interfaces that generate value in every project. Currently, I complement my career with training as a <strong>Data Analyst</strong>, which allows me to propose objective information-based solutions to optimize digital products and processes.",
      skills: "My Skills",
      contactBtn: "Contact Me"
    },
    portfolios: {
      title: "My Portfolios",
      subtitle: "Explore my two professional specialties: data analysis and web development.",
      dataAnalyst: {
        title: "Data Analyst",
        description: "Discover my data analysis projects, visualizations, and insights that transform information into strategic decisions.",
        button: "View Portfolio"
      },
      webDeveloper: {
        title: "Web Developer",
        description: "Explore my web development projects, interactive applications, and creative digital solutions.",
        button: "View Portfolio"
      }
    },
    contact: {
      title: "Contact",
      subtitle: "If you're interested in working with me or have any questions, feel free to contact me.",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        submit: "Send Message"
      }
    },
    footer: {
      description: "Frontend Developer and Data Analyst. I create web experiences and data-driven solutions that drive project success.",
      social: "Social",
      madeBy: "Made by Armando Ochoa"
    },
    pages: {
      webDeveloper: {
        title: "WEB DEVELOPER",
        description: "Creating modern, functional, and optimized digital experiences. Specialized in frontend development with React, Angular, Astro, and modern web technologies.",
        backHome: "← Back to Home"
      },
      dataAnalyst: {
        title: "DATA ANALYST",
        description: "Transforming data into actionable insights through Python, SQL, Tableau, and effective storytelling to drive strategic decisions.",
        backHome: "← Back to Home"
      }
    }
  }
};

export function getTranslations(lang = 'es') {
  return translations[lang] || translations.es;
}

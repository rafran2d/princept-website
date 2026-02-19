/**
 * Script pour remplir le site avec du contenu pour une agence web
 * Spécialisée en : création de sites web, e-commerce, applications mobiles, IA
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:3004';

// Contenu multilingue pour l'agence web
const agencyContent = {
  // Paramètres du site
  siteSettings: {
    siteName: {
      fr: 'WebAgency Pro',
      en: 'WebAgency Pro',
      es: 'WebAgency Pro',
      it: 'WebAgency Pro',
      de: 'WebAgency Pro'
    },
    siteTagline: {
      fr: 'Votre partenaire digital pour des solutions web innovantes',
      en: 'Your digital partner for innovative web solutions',
      es: 'Su socio digital para soluciones web innovadoras',
      it: 'Il tuo partner digitale per soluzioni web innovative',
      de: 'Ihr digitaler Partner für innovative Web-Lösungen'
    },
    siteDescription: {
      fr: 'Agence web spécialisée dans la création de sites web sur mesure, e-commerce, applications mobiles et solutions IA. Nous transformons vos idées en réalité digitale avec expertise et innovation.',
      en: 'Web agency specialized in custom website creation, e-commerce, mobile applications and AI solutions. We transform your ideas into digital reality with expertise and innovation.',
      es: 'Agencia web especializada en la creación de sitios web personalizados, comercio electrónico, aplicaciones móviles y soluciones de IA. Transformamos sus ideas en realidad digital con experiencia e innovación.',
      it: 'Agenzia web specializzata nella creazione di siti web personalizzati, e-commerce, applicazioni mobili e soluzioni IA. Trasformiamo le tue idee in realtà digitale con competenza e innovazione.',
      de: 'Web-Agentur spezialisiert auf maßgeschneiderte Websites, E-Commerce, mobile Anwendungen und KI-Lösungen. Wir verwandeln Ihre Ideen mit Expertise und Innovation in digitale Realität.'
    },
    copyrightText: {
      fr: '© 2025 WebAgency Pro. Tous droits réservés.',
      en: '© 2025 WebAgency Pro. All rights reserved.',
      es: '© 2025 WebAgency Pro. Todos los derechos reservados.',
      it: '© 2025 WebAgency Pro. Tutti i diritti riservati.',
      de: '© 2025 WebAgency Pro. Alle Rechte vorbehalten.'
    },
    email: 'contact@webagency-pro.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Avenue des Champs-Élysées, 75008 Paris, France'
  },

  // Sections
  sections: {
    hero: {
      title: {
        fr: 'Solutions Digitales sur Mesure',
        en: 'Custom Digital Solutions',
        es: 'Soluciones Digitales Personalizadas',
        it: 'Soluzioni Digitali Personalizzate',
        de: 'Maßgeschneiderte Digitale Lösungen'
      },
      subtitle: {
        fr: 'De l\'idée à la réalisation',
        en: 'From idea to reality',
        es: 'De la idea a la realidad',
        it: 'Dall\'idea alla realtà',
        de: 'Von der Idee zur Realität'
      },
      description: {
        fr: 'Nous créons des expériences digitales exceptionnelles qui transforment votre présence en ligne. Sites web, e-commerce, applications mobiles et solutions IA - tout ce dont vous avez besoin pour réussir dans le digital.',
        en: 'We create exceptional digital experiences that transform your online presence. Websites, e-commerce, mobile applications and AI solutions - everything you need to succeed in the digital world.',
        es: 'Creamos experiencias digitales excepcionales que transforman su presencia en línea. Sitios web, comercio electrónico, aplicaciones móviles y soluciones de IA: todo lo que necesita para tener éxito en el mundo digital.',
        it: 'Creiamo esperienze digitali eccezionali che trasformano la tua presenza online. Siti web, e-commerce, applicazioni mobili e soluzioni IA: tutto ciò di cui hai bisogno per avere successo nel mondo digitale.',
        de: 'Wir schaffen außergewöhnliche digitale Erlebnisse, die Ihre Online-Präsenz transformieren. Websites, E-Commerce, mobile Anwendungen und KI-Lösungen - alles, was Sie brauchen, um in der digitalen Welt erfolgreich zu sein.'
      },
      buttonText: {
        fr: 'Découvrir nos services',
        en: 'Discover our services',
        es: 'Descubra nuestros servicios',
        it: 'Scopri i nostri servizi',
        de: 'Entdecken Sie unsere Dienstleistungen'
      }
    },
    about: {
      title: {
        fr: 'À Propos de Nous',
        en: 'About Us',
        es: 'Acerca de Nosotros',
        it: 'Chi Siamo',
        de: 'Über Uns'
      },
      description: {
        fr: 'WebAgency Pro est une agence digitale moderne spécialisée dans la création de solutions web innovantes. Avec plus de 10 ans d\'expérience, nous accompagnons les entreprises dans leur transformation digitale avec expertise et créativité.',
        en: 'WebAgency Pro is a modern digital agency specialized in creating innovative web solutions. With over 10 years of experience, we support businesses in their digital transformation with expertise and creativity.',
        es: 'WebAgency Pro es una agencia digital moderna especializada en la creación de soluciones web innovadoras. Con más de 10 años de experiencia, acompañamos a las empresas en su transformación digital con experiencia y creatividad.',
        it: 'WebAgency Pro è un\'agenzia digitale moderna specializzata nella creazione di soluzioni web innovative. Con oltre 10 anni di esperienza, supportiamo le aziende nella loro trasformazione digitale con competenza e creatività.',
        de: 'WebAgency Pro ist eine moderne digitale Agentur, die sich auf die Erstellung innovativer Web-Lösungen spezialisiert hat. Mit über 10 Jahren Erfahrung unterstützen wir Unternehmen bei ihrer digitalen Transformation mit Expertise und Kreativität.'
      },
      features: [
        {
          title: { fr: 'Expertise Technique', en: 'Technical Expertise', es: 'Experiencia Técnica', it: 'Competenza Tecnica', de: 'Technische Expertise' },
          description: { fr: 'Maîtrise des dernières technologies web et mobiles', en: 'Mastery of the latest web and mobile technologies', es: 'Dominio de las últimas tecnologías web y móviles', it: 'Padronanza delle ultime tecnologie web e mobili', de: 'Beherrschung der neuesten Web- und Mobiltechnologien' },
          icon: 'Code'
        },
        {
          title: { fr: 'Design Innovant', en: 'Innovative Design', es: 'Diseño Innovador', it: 'Design Innovativo', de: 'Innovatives Design' },
          description: { fr: 'Créations visuelles modernes et impactantes', en: 'Modern and impactful visual creations', es: 'Creaciones visuales modernas e impactantes', it: 'Creazioni visive moderne e impattanti', de: 'Moderne und wirkungsvolle visuelle Kreationen' },
          icon: 'Palette'
        },
        {
          title: { fr: 'Solutions IA', en: 'AI Solutions', es: 'Soluciones IA', it: 'Soluzioni IA', de: 'KI-Lösungen' },
          description: { fr: 'Intégration d\'intelligence artificielle dans vos projets', en: 'AI integration in your projects', es: 'Integración de inteligencia artificial en sus proyectos', it: 'Integrazione dell\'intelligenza artificiale nei tuoi progetti', de: 'KI-Integration in Ihre Projekte' },
          icon: 'Brain'
        },
        {
          title: { fr: 'Support Continu', en: 'Ongoing Support', es: 'Soporte Continuo', it: 'Supporto Continuo', de: 'Laufender Support' },
          description: { fr: 'Accompagnement et maintenance 24/7', en: '24/7 support and maintenance', es: 'Soporte y mantenimiento 24/7', it: 'Supporto e manutenzione 24/7', de: '24/7 Support und Wartung' },
          icon: 'Headphones'
        }
      ]
    },
    services: {
      title: {
        fr: 'Nos Services',
        en: 'Our Services',
        es: 'Nuestros Servicios',
        it: 'I Nostri Servizi',
        de: 'Unsere Dienstleistungen'
      },
      description: {
        fr: 'Des solutions complètes pour tous vos besoins digitaux',
        en: 'Complete solutions for all your digital needs',
        es: 'Soluciones completas para todas sus necesidades digitales',
        it: 'Soluzioni complete per tutte le tue esigenze digitali',
        de: 'Vollständige Lösungen für alle Ihre digitalen Bedürfnisse'
      },
      services: [
        {
          title: { fr: 'Création de Sites Web', en: 'Website Creation', es: 'Creación de Sitios Web', it: 'Creazione Siti Web', de: 'Website-Erstellung' },
          description: { fr: 'Sites web sur mesure, responsives et optimisés pour tous les appareils. De la vitrine simple au portail complexe.', en: 'Custom, responsive and optimized websites for all devices. From simple showcase to complex portal.', es: 'Sitios web personalizados, responsivos y optimizados para todos los dispositivos. Desde vitrina simple hasta portal complejo.', it: 'Siti web personalizzati, responsive e ottimizzati per tutti i dispositivi. Dalla vetrina semplice al portale complesso.', de: 'Maßgeschneiderte, responsive und optimierte Websites für alle Geräte. Vom einfachen Schaufenster bis zum komplexen Portal.' },
          icon: 'Globe'
        },
        {
          title: { fr: 'E-Commerce', en: 'E-Commerce', es: 'Comercio Electrónico', it: 'E-Commerce', de: 'E-Commerce' },
          description: { fr: 'Boutiques en ligne performantes avec gestion de commandes, paiements sécurisés et intégration logistique.', en: 'High-performance online stores with order management, secure payments and logistics integration.', es: 'Tiendas en línea de alto rendimiento con gestión de pedidos, pagos seguros e integración logística.', it: 'Negozi online performanti con gestione ordini, pagamenti sicuri e integrazione logistica.', de: 'Leistungsstarke Online-Shops mit Bestellverwaltung, sicheren Zahlungen und Logistik-Integration.' },
          icon: 'ShoppingCart'
        },
        {
          title: { fr: 'Applications Mobiles', en: 'Mobile Applications', es: 'Aplicaciones Móviles', it: 'Applicazioni Mobili', de: 'Mobile Anwendungen' },
          description: { fr: 'Apps iOS et Android natives ou cross-platform. Interfaces intuitives et performances optimales.', en: 'Native or cross-platform iOS and Android apps. Intuitive interfaces and optimal performance.', es: 'Aplicaciones iOS y Android nativas o multiplataforma. Interfaces intuitivas y rendimiento óptimo.', it: 'App iOS e Android native o cross-platform. Interfacce intuitive e prestazioni ottimali.', de: 'Native oder plattformübergreifende iOS- und Android-Apps. Intuitive Benutzeroberflächen und optimale Leistung.' },
          icon: 'Smartphone'
        },
        {
          title: { fr: 'Solutions IA', en: 'AI Solutions', es: 'Soluciones IA', it: 'Soluzioni IA', de: 'KI-Lösungen' },
          description: { fr: 'Intégration d\'IA dans vos processus : chatbots intelligents, analyse de données, automatisation et machine learning.', en: 'AI integration in your processes: intelligent chatbots, data analysis, automation and machine learning.', es: 'Integración de IA en sus procesos: chatbots inteligentes, análisis de datos, automatización y aprendizaje automático.', it: 'Integrazione dell\'IA nei tuoi processi: chatbot intelligenti, analisi dei dati, automazione e machine learning.', de: 'KI-Integration in Ihre Prozesse: intelligente Chatbots, Datenanalyse, Automatisierung und maschinelles Lernen.' },
          icon: 'Brain'
        },
        {
          title: { fr: 'SEO & Marketing Digital', en: 'SEO & Digital Marketing', es: 'SEO y Marketing Digital', it: 'SEO e Marketing Digitale', de: 'SEO & Digitales Marketing' },
          description: { fr: 'Optimisation pour les moteurs de recherche, campagnes publicitaires et stratégies de contenu pour maximiser votre visibilité.', en: 'Search engine optimization, advertising campaigns and content strategies to maximize your visibility.', es: 'Optimización para motores de búsqueda, campañas publicitarias y estrategias de contenido para maximizar su visibilidad.', it: 'Ottimizzazione per i motori di ricerca, campagne pubblicitarie e strategie di contenuto per massimizzare la tua visibilità.', de: 'Suchmaschinenoptimierung, Werbekampagnen und Content-Strategien zur Maximierung Ihrer Sichtbarkeit.' },
          icon: 'TrendingUp'
        },
        {
          title: { fr: 'Conseil & Stratégie', en: 'Consulting & Strategy', es: 'Consultoría y Estrategia', it: 'Consulenza e Strategia', de: 'Beratung & Strategie' },
          description: { fr: 'Accompagnement stratégique pour définir votre roadmap digitale et optimiser vos processus métier.', en: 'Strategic support to define your digital roadmap and optimize your business processes.', es: 'Apoyo estratégico para definir su hoja de ruta digital y optimizar sus procesos comerciales.', it: 'Supporto strategico per definire la tua roadmap digitale e ottimizzare i tuoi processi aziendali.', de: 'Strategische Unterstützung zur Definition Ihrer digitalen Roadmap und Optimierung Ihrer Geschäftsprozesse.' },
          icon: 'Target'
        }
      ]
    },
    contact: {
      title: {
        fr: 'Contactez-Nous',
        en: 'Contact Us',
        es: 'Contáctenos',
        it: 'Contattaci',
        de: 'Kontaktieren Sie Uns'
      },
      description: {
        fr: 'Discutons de votre projet et trouvons ensemble la meilleure solution pour vos besoins.',
        en: 'Let\'s discuss your project and find together the best solution for your needs.',
        es: 'Hablemos de su proyecto y encontremos juntos la mejor solución para sus necesidades.',
        it: 'Parliamo del tuo progetto e troviamo insieme la soluzione migliore per le tue esigenze.',
        de: 'Lassen Sie uns über Ihr Projekt sprechen und gemeinsam die beste Lösung für Ihre Bedürfnisse finden.'
      }
    }
  }
};

// Fonction pour mettre à jour les paramètres du site
async function updateSiteSettings() {
  console.log('📝 Mise à jour des paramètres du site...');
  
  const settings = agencyContent.siteSettings;
  
  const updates = {
    siteName: JSON.stringify(settings.siteName),
    siteTagline: JSON.stringify(settings.siteTagline),
    siteDescription: JSON.stringify(settings.siteDescription),
    copyrightText: JSON.stringify(settings.copyrightText),
    email: settings.email,
    phone: settings.phone,
    address: settings.address
  };

  try {
    for (const [key, value] of Object.entries(updates)) {
      const response = await fetch(`${API_BASE_URL}/api/site-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setting_key: key,
          setting_value: typeof value === 'string' ? value : JSON.stringify(value),
          setting_type: typeof value === 'string' && !value.startsWith('{') ? 'string' : 'json'
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.warn(`⚠️ Erreur mise à jour ${key}:`, error);
      } else {
        console.log(`✅ ${key} mis à jour`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur mise à jour paramètres:', error);
  }
}

// Fonction pour mettre à jour une section
async function updateSection(sectionId, sectionType, content) {
  try {
    // Récupérer la section existante
    const getResponse = await fetch(`${API_BASE_URL}/api/sections/${sectionId}`);
    
    if (!getResponse.ok) {
      console.warn(`⚠️ Section ${sectionId} non trouvée, création...`);
      // Créer la section si elle n'existe pas
      const createResponse = await fetch(`${API_BASE_URL}/api/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sectionId,
          section_type: sectionType,
          section_data: content,
          is_enabled: 1,
          sort_order: 0,
          language_id: 'fr'
        })
      });
      
      if (createResponse.ok) {
        console.log(`✅ Section ${sectionId} créée`);
      } else {
        const error = await createResponse.text();
        console.error(`❌ Erreur création section ${sectionId}:`, error);
      }
      return;
    }

    const existingSection = await getResponse.json();
    const existingData = existingSection.data?.section_data || {};

    // Fusionner avec les nouvelles données
    const updatedData = {
      ...existingData,
      ...content
    };

    // Mettre à jour la section
    const updateResponse = await fetch(`${API_BASE_URL}/api/sections/${sectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section_data: updatedData
      })
    });

    if (updateResponse.ok) {
      console.log(`✅ Section ${sectionId} mise à jour`);
    } else {
      const error = await updateResponse.text();
      console.error(`❌ Erreur mise à jour section ${sectionId}:`, error);
    }
  } catch (error) {
    console.error(`❌ Erreur section ${sectionId}:`, error.message);
  }
}

// Fonction principale
async function fillContent() {
  console.log('🚀 Démarrage du remplissage du contenu...\n');

  // 1. Mettre à jour les paramètres du site
  await updateSiteSettings();
  console.log('');

  // 2. Mettre à jour les sections
  console.log('📝 Mise à jour des sections...');

  // Hero section
  const heroSectionId = 'hero-default';
  await updateSection(heroSectionId, 'hero', {
    title: agencyContent.sections.hero.title,
    subtitle: agencyContent.sections.hero.subtitle,
    description: agencyContent.sections.hero.description,
    buttonText: agencyContent.sections.hero.buttonText,
    buttonLink: '#services',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    textColor: '#ffffff',
    backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
    navigationMode: 'onepage'
  });

  // About section
  const aboutSectionId = 'about-default';
  await updateSection(aboutSectionId, 'about', {
    title: agencyContent.sections.about.title,
    description: agencyContent.sections.about.description,
    features: agencyContent.sections.about.features.map((feature, index) => ({
      id: `feature-${index}`,
      title: feature.title,
      description: feature.description,
      icon: feature.icon
    })),
    backgroundColor: '#ffffff',
    textColor: '#374151',
    navigationMode: 'onepage'
  });

  // Services section
  const servicesSectionId = 'services-default';
  await updateSection(servicesSectionId, 'services', {
    title: agencyContent.sections.services.title,
    description: agencyContent.sections.services.description,
    services: agencyContent.sections.services.services.map((service, index) => ({
      id: `service-${index}`,
      title: service.title,
      description: service.description,
      icon: service.icon
    })),
    backgroundColor: '#f8fafc',
    textColor: '#374151',
    navigationMode: 'onepage'
  });

  // Contact section
  const contactSectionId = 'contact-default';
  await updateSection(contactSectionId, 'contact', {
    title: agencyContent.sections.contact.title,
    description: agencyContent.sections.contact.description,
    email: agencyContent.siteSettings.email,
    phone: agencyContent.siteSettings.phone,
    address: agencyContent.siteSettings.address,
    backgroundColor: '#ffffff',
    textColor: '#374151',
    navigationMode: 'onepage'
  });

  console.log('\n✅ Remplissage terminé !');
  console.log('\n📋 Résumé:');
  console.log('  - Paramètres du site mis à jour');
  console.log('  - Section Hero mise à jour');
  console.log('  - Section À Propos mise à jour');
  console.log('  - Section Services mise à jour');
  console.log('  - Section Contact mise à jour');
  console.log('\n💡 Rechargez votre site pour voir les changements !');
}

// Exécuter le script
if (require.main === module) {
  fillContent().catch(console.error);
}

module.exports = { fillContent, agencyContent };

import React, { useState } from 'react';
import { Database, Loader, CheckCircle, AlertCircle, Sparkles, Award, Handshake, Users, Settings, Brain, FileText } from 'lucide-react';
import apiService from '../../services/apiService';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';
import sectionStore from '../../store/SectionStoreAPI';

const ContentFiller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const { message, showSuccess, showError, hideMessage } = useFlashMessage();

  // Contenu multilingue pour l'agence web
  const agencyContent = {
    siteSettings: {
      siteName: {
        fr: 'Princept i-web',
        en: 'Princept i-web',
        es: 'Princept i-web',
        it: 'Princept i-web',
        de: 'Princept i-web'
      },
      siteTagline: {
        fr: 'Votre partenaire digital pour des solutions web innovantes',
        en: 'Your digital partner for innovative web solutions',
        es: 'Su socio digital para soluciones web innovadoras',
        it: 'Il tuo partner digitale per soluzioni web innovative',
        de: 'Ihr digitaler Partner für innovative Web-Lösungen'
      },
      siteDescription: {
        fr: 'Entreprise innovante en informatique basée à Madagascar, spécialisée dans le développement de solutions numériques. Développement web et mobile, e-commerce, applications mobiles natives et hybrides, recrutement IT en régie.',
        en: 'Innovative IT company based in Madagascar, specialized in digital solutions development. Web and mobile development, e-commerce, native and hybrid mobile applications, IT recruitment in outsourcing.',
        es: 'Empresa innovadora de informática con sede en Madagascar, especializada en el desarrollo de soluciones digitales. Desarrollo web y móvil, comercio electrónico, aplicaciones móviles nativas e híbridas, reclutamiento IT en régimen.',
        it: 'Azienda innovativa di informatica con sede in Madagascar, specializzata nello sviluppo di soluzioni digitali. Sviluppo web e mobile, e-commerce, applicazioni mobili native e ibride, reclutamento IT in outsourcing.',
        de: 'Innovatives IT-Unternehmen mit Sitz in Madagaskar, spezialisiert auf die Entwicklung digitaler Lösungen. Web- und Mobile-Entwicklung, E-Commerce, native und hybride mobile Anwendungen, IT-Rekrutierung im Outsourcing.'
      },
      copyrightText: {
        fr: '© 2025 Princept i-web. Tous droits réservés.',
        en: '© 2025 Princept i-web. All rights reserved.',
        es: '© 2025 Princept i-web. Todos los derechos reservados.',
        it: '© 2025 Princept i-web. Tutti i diritti riservati.',
        de: '© 2025 Princept i-web. Alle Rechte vorbehalten.'
      },
      email: 'princept.iweb@gmail.com',
      phone: '+261341908517',
      address: 'Mahazoarivo, Lot VR 26 MAA Mahazoarivo, Antananarivo 101, Madagascar'
    },
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
          fr: 'Fondée en 2021 à Antananarivo, Madagascar, Princept i-web est une entreprise innovante spécialisée dans la conception et le développement de systèmes informatiques. Nous nous concentrons sur le développement web et mobile, avec une expertise reconnue dans la création de solutions numériques sur mesure.',
          en: 'Founded in 2021 in Antananarivo, Madagascar, Princept i-web is an innovative company specialized in the design and development of IT systems. We focus on web and mobile development, with recognized expertise in creating custom digital solutions.',
          es: 'Fundada en 2021 en Antananarivo, Madagascar, Princept i-web es una empresa innovadora especializada en el diseño y desarrollo de sistemas informáticos. Nos enfocamos en el desarrollo web y móvil, con experiencia reconocida en la creación de soluciones digitales personalizadas.',
          it: 'Fondata nel 2021 ad Antananarivo, Madagascar, Princept i-web è un\'azienda innovativa specializzata nella progettazione e nello sviluppo di sistemi informatici. Ci concentriamo sullo sviluppo web e mobile, con competenza riconosciuta nella creazione di soluzioni digitali personalizzate.',
          de: 'Gegründet 2021 in Antananarivo, Madagaskar, ist Princept i-web ein innovatives Unternehmen, das sich auf die Gestaltung und Entwicklung von IT-Systemen spezialisiert hat. Wir konzentrieren uns auf Web- und Mobile-Entwicklung mit anerkannter Expertise in der Erstellung maßgeschneiderter digitaler Lösungen.'
        },
        features: [
          {
            title: { fr: 'L\'Expertise', en: 'Expertise', es: 'Experiencia', it: 'Competenza', de: 'Expertise' },
            description: { fr: 'Nos ingénieurs experts maîtrisent plus de 30 langages, outils et technologies. Nous avons réussi à mener à bien cinq projets significatifs, démontrant notre engagement envers l\'excellence.', en: 'Our expert engineers master over 30 languages, tools and technologies. We have successfully completed five significant projects, demonstrating our commitment to excellence.', es: 'Nuestros ingenieros expertos dominan más de 30 lenguajes, herramientas y tecnologías. Hemos completado con éxito cinco proyectos significativos, demostrando nuestro compromiso con la excelencia.', it: 'I nostri ingegneri esperti padroneggiano oltre 30 linguaggi, strumenti e tecnologie. Abbiamo completato con successo cinque progetti significativi, dimostrando il nostro impegno per l\'eccellenza.', de: 'Unsere Experten-Ingenieure beherrschen über 30 Sprachen, Tools und Technologien. Wir haben erfolgreich fünf bedeutende Projekte abgeschlossen und zeigen unser Engagement für Exzellenz.' },
            icon: 'Code'
          },
          {
            title: { fr: 'L\'Innovation', en: 'Innovation', es: 'Innovación', it: 'Innovazione', de: 'Innovation' },
            description: { fr: 'Nous aspirons à devenir la référence dans l\'exploitation des nouvelles technologies. L\'innovation est le moteur de notre amélioration continue.', en: 'We aspire to become the reference in exploiting new technologies. Innovation is the engine of our continuous improvement.', es: 'Aspiramos a convertirnos en la referencia en la explotación de nuevas tecnologías. La innovación es el motor de nuestra mejora continua.', it: 'Aspiriamo a diventare il riferimento nello sfruttamento delle nuove tecnologie. L\'innovazione è il motore del nostro miglioramento continuo.', de: 'Wir streben danach, die Referenz bei der Nutzung neuer Technologien zu werden. Innovation ist der Motor unserer kontinuierlichen Verbesserung.' },
            icon: 'Sparkles'
          },
          {
            title: { fr: 'L\'Excellence', en: 'Excellence', es: 'Excelencia', it: 'Eccellenza', de: 'Exzellenz' },
            description: { fr: 'L\'excellence technique est le pilier de notre entreprise. Nous remettons continuellement en question nos processus pour garantir une quête constante de qualité.', en: 'Technical excellence is the pillar of our company. We continuously question our processes to ensure a constant pursuit of quality.', es: 'La excelencia técnica es el pilar de nuestra empresa. Cuestionamos continuamente nuestros procesos para garantizar una búsqueda constante de calidad.', it: 'L\'eccellenza tecnica è il pilastro della nostra azienda. Mettiamo continuamente in discussione i nostri processi per garantire una ricerca costante della qualità.', de: 'Technische Exzellenz ist die Säule unseres Unternehmens. Wir hinterfragen kontinuierlich unsere Prozesse, um eine ständige Qualitätssuche zu gewährleisten.' },
            icon: 'Award'
          },
          {
            title: { fr: 'L\'Engagement', en: 'Commitment', es: 'Compromiso', it: 'Impegno', de: 'Engagement' },
            description: { fr: 'Notre engagement envers nos clients repose sur l\'honnêteté et le respect. Leurs défis deviennent les nôtres, et nos succès sont partagés.', en: 'Our commitment to our clients is based on honesty and respect. Their challenges become ours, and our successes are shared.', es: 'Nuestro compromiso con nuestros clientes se basa en la honestidad y el respeto. Sus desafíos se convierten en los nuestros, y nuestros éxitos se comparten.', it: 'Il nostro impegno verso i nostri clienti si basa sull\'onestà e sul rispetto. Le loro sfide diventano le nostre, e i nostri successi sono condivisi.', de: 'Unser Engagement gegenüber unseren Kunden basiert auf Ehrlichkeit und Respekt. Ihre Herausforderungen werden zu unseren, und unsere Erfolge werden geteilt.' },
            icon: 'Handshake'
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
            title: { fr: 'Développement Web & E-Commerce sur Mesure', en: 'Web Development & Custom E-Commerce', es: 'Desarrollo Web y Comercio Electrónico Personalizado', it: 'Sviluppo Web ed E-Commerce Personalizzato', de: 'Web-Entwicklung & Maßgeschneiderter E-Commerce' },
            description: { fr: 'Conception et développement de sites professionnels, vitrines et e-commerce sur mesure (PrestaShop, Magento, Drupal, WordPress).', en: 'Design and development of professional, showcase and custom e-commerce websites (PrestaShop, Magento, Drupal, WordPress).', es: 'Diseño y desarrollo de sitios web profesionales, vitrinas y comercio electrónico personalizados (PrestaShop, Magento, Drupal, WordPress).', it: 'Progettazione e sviluppo di siti web professionali, vetrine ed e-commerce personalizzati (PrestaShop, Magento, Drupal, WordPress).', de: 'Gestaltung und Entwicklung von professionellen Websites, Schaufenstern und maßgeschneiderten E-Commerce-Websites (PrestaShop, Magento, Drupal, WordPress).' },
            details: { fr: 'Design responsive, chartes graphiques, logos et interfaces UI/UX innovantes. Nous créons des sites web et boutiques en ligne sur mesure adaptés à vos besoins spécifiques. Solutions e-commerce complètes avec gestion de stock, catalogues produits avancés, systèmes de paiement sécurisés et intégration logistique. Une attention particulière à l\'expérience utilisateur et à l\'optimisation pour tous les appareils.', en: 'Responsive design, graphic charters, logos and innovative UI/UX interfaces. We create custom websites and online stores tailored to your specific needs. Complete e-commerce solutions with inventory management, advanced product catalogs, secure payment systems and logistics integration. Particular attention to user experience and optimization for all devices.', es: 'Diseño responsive, cartas gráficas, logotipos e interfaces UI/UX innovadoras. Creamos sitios web y tiendas en línea personalizados adaptados a sus necesidades específicas. Soluciones de comercio electrónico completas con gestión de inventario, catálogos de productos avanzados, sistemas de pago seguros e integración logística. Especial atención a la experiencia del usuario y la optimización para todos los dispositivos.', it: 'Design responsive, carte grafiche, loghi e interfacce UI/UX innovative. Creiamo siti web e negozi online personalizzati adattati alle tue esigenze specifiche. Soluzioni e-commerce complete con gestione inventario, cataloghi prodotti avanzati, sistemi di pagamento sicuri e integrazione logistica. Particolare attenzione all\'esperienza utente e all\'ottimizzazione per tutti i dispositivi.', de: 'Responsives Design, Grafikrichtlinien, Logos und innovative UI/UX-Schnittstellen. Wir erstellen maßgeschneiderte Websites und Online-Shops, die auf Ihre spezifischen Bedürfnisse zugeschnitten sind. Vollständige E-Commerce-Lösungen mit Bestandsverwaltung, erweiterten Produktkatalogen, sicheren Zahlungssystemen und Logistik-Integration. Besonderes Augenmerk auf Benutzererfahrung und Optimierung für alle Geräte.' },
            icon: 'Globe'
          },
          {
            title: { fr: 'Applications Mobiles', en: 'Mobile Applications', es: 'Aplicaciones Móviles', it: 'Applicazioni Mobili', de: 'Mobile Anwendungen' },
            description: { fr: 'Développement d\'applications mobiles natives et hybrides pour Android, iOS et Windows Phone.', en: 'Development of native and hybrid mobile applications for Android, iOS and Windows Phone.', es: 'Desarrollo de aplicaciones móviles nativas e híbridas para Android, iOS y Windows Phone.', it: 'Sviluppo di applicazioni mobili native e ibride per Android, iOS e Windows Phone.', de: 'Entwicklung nativer und hybrider mobiler Anwendungen für Android, iOS und Windows Phone.' },
            details: { fr: 'Applications BtoC et BtoB avec interfaces ergonomiques et fonctionnalités innovantes. Nous créons des applications mobiles performantes intégrées à vos systèmes d\'information existants, offrant une expérience utilisateur complète et intuitive sur toutes les plateformes.', en: 'BtoC and BtoB applications with ergonomic interfaces and innovative features. We create high-performance mobile applications integrated with your existing information systems, offering a complete and intuitive user experience across all platforms.', es: 'Aplicaciones BtoC y BtoB con interfaces ergonómicas y funcionalidades innovadoras. Creamos aplicaciones móviles de alto rendimiento integradas con sus sistemas de información existentes, ofreciendo una experiencia de usuario completa e intuitiva en todas las plataformas.', it: 'Applicazioni BtoC e BtoB con interfacce ergonomiche e funzionalità innovative. Creiamo applicazioni mobili ad alte prestazioni integrate con i tuoi sistemi informativi esistenti, offrendo un\'esperienza utente completa e intuitiva su tutte le piattaforme.', de: 'BtoC- und BtoB-Anwendungen mit ergonomischen Benutzeroberflächen und innovativen Funktionen. Wir erstellen leistungsstarke mobile Anwendungen, die in Ihre bestehenden Informationssysteme integriert sind und eine vollständige und intuitive Benutzererfahrung auf allen Plattformen bieten.' },
            icon: 'Smartphone'
          },
          {
            title: { fr: 'Design & Identité Visuelle', en: 'Design & Visual Identity', es: 'Diseño e Identidad Visual', it: 'Design e Identità Visiva', de: 'Design & Visuelle Identität' },
            description: { fr: 'Création de chartes graphiques, logos et conception d\'interfaces utilisateur (UI) et d\'expériences utilisateur (UX) innovantes.', en: 'Creation of graphic charters, logos and design of user interfaces (UI) and innovative user experiences (UX).', es: 'Creación de cartas gráficas, logotipos y diseño de interfaces de usuario (UI) y experiencias de usuario (UX) innovadoras.', it: 'Creazione di carte grafiche, loghi e progettazione di interfacce utente (UI) ed esperienze utente (UX) innovative.', de: 'Erstellung von Grafikrichtlinien, Logos und Gestaltung von Benutzeroberflächen (UI) und innovativen Benutzererlebnissen (UX).' },
            details: { fr: 'Design responsive pour tous les appareils. Nous développons des identités visuelles complètes qui reflètent votre marque, avec des interfaces utilisateur modernes et intuitives qui optimisent l\'engagement et la conversion.', en: 'Responsive design for all devices. We develop complete visual identities that reflect your brand, with modern and intuitive user interfaces that optimize engagement and conversion.', es: 'Diseño responsive para todos los dispositivos. Desarrollamos identidades visuales completas que reflejan su marca, con interfaces de usuario modernas e intuitivas que optimizan el compromiso y la conversión.', it: 'Design responsive per tutti i dispositivi. Sviluppiamo identità visive complete che riflettono il tuo brand, con interfacce utente moderne e intuitive che ottimizzano l\'engagement e la conversione.', de: 'Responsives Design für alle Geräte. Wir entwickeln vollständige visuelle Identitäten, die Ihre Marke widerspiegeln, mit modernen und intuitiven Benutzeroberflächen, die Engagement und Conversion optimieren.' },
            icon: 'Palette'
          },
          {
            title: { fr: 'Recrutement IT en Régie', en: 'IT Recruitment & Outsourcing', es: 'Reclutamiento IT en Régimen', it: 'Reclutamento IT in Outsourcing', de: 'IT-Rekrutierung & Outsourcing' },
            description: { fr: 'Recrutement et mise en place de professionnels qualifiés en informatique pour des missions en régie.', en: 'Recruitment and placement of qualified IT professionals for outsourcing missions.', es: 'Reclutamiento y colocación de profesionales cualificados en informática para misiones en régimen.', it: 'Reclutamento e collocamento di professionisti IT qualificati per missioni in outsourcing.', de: 'Rekrutierung und Vermittlung qualifizierter IT-Fachkräfte für Outsourcing-Missionen.' },
            details: { fr: 'Solution flexible pour vos besoins en personnel technique. Nous identifions et recrutons des experts IT qualifiés adaptés à vos projets spécifiques, puis les mettons en place auprès de vos équipes pour des missions en régie, offrant flexibilité et expertise à la demande.', en: 'Flexible solution for your technical staffing needs. We identify and recruit qualified IT experts suited to your specific projects, then place them with your teams for outsourcing missions, offering flexibility and expertise on demand.', es: 'Solución flexible para sus necesidades de personal técnico. Identificamos y reclutamos expertos en TI cualificados adaptados a sus proyectos específicos, luego los colocamos con sus equipos para misiones en régimen, ofreciendo flexibilidad y experiencia bajo demanda.', it: 'Soluzione flessibile per le tue esigenze di personale tecnico. Identifichiamo e reclutiamo esperti IT qualificati adatti ai tuoi progetti specifici, poi li collochiamo con i tuoi team per missioni in outsourcing, offrendo flessibilità e competenza su richiesta.', de: 'Flexible Lösung für Ihren technischen Personalbedarf. Wir identifizieren und rekrutieren qualifizierte IT-Experten, die zu Ihren spezifischen Projekten passen, und stellen sie dann Ihren Teams für Outsourcing-Missionen zur Verfügung, mit Flexibilität und Expertise nach Bedarf.' },
            icon: 'Users'
          },
          {
            title: { fr: 'Intégration Systèmes', en: 'Systems Integration', es: 'Integración de Sistemas', it: 'Integrazione di Sistemi', de: 'Systemintegration' },
            description: { fr: 'Intégration d\'applications mobiles avec des systèmes d\'information existants.', en: 'Integration of mobile applications with existing information systems.', es: 'Integración de aplicaciones móviles con sistemas de información existentes.', it: 'Integrazione di applicazioni mobili con sistemi informativi esistenti.', de: 'Integration mobiler Anwendungen mit bestehenden Informationssystemen.' },
            details: { fr: 'Solutions complètes pour une expérience utilisateur optimale sur toutes les plateformes. Nous connectons vos applications mobiles à vos systèmes d\'information existants (ERP, CRM, bases de données) pour créer un écosystème numérique unifié et performant.', en: 'Complete solutions for optimal user experience across all platforms. We connect your mobile applications to your existing information systems (ERP, CRM, databases) to create a unified and high-performance digital ecosystem.', es: 'Soluciones completas para una experiencia de usuario óptima en todas las plataformas. Conectamos sus aplicaciones móviles con sus sistemas de información existentes (ERP, CRM, bases de datos) para crear un ecosistema digital unificado y de alto rendimiento.', it: 'Soluzioni complete per un\'esperienza utente ottimale su tutte le piattaforme. Colleghiamo le tue applicazioni mobili ai tuoi sistemi informativi esistenti (ERP, CRM, database) per creare un ecosistema digitale unificato e ad alte prestazioni.', de: 'Komplette Lösungen für optimale Benutzererfahrung auf allen Plattformen. Wir verbinden Ihre mobilen Anwendungen mit Ihren bestehenden Informationssystemen (ERP, CRM, Datenbanken), um ein einheitliches und leistungsstarkes digitales Ökosystem zu schaffen.' },
            icon: 'Settings'
          },
          {
            title: { fr: 'Solutions d\'Intelligence Artificielle', en: 'Artificial Intelligence Solutions', es: 'Soluciones de Inteligencia Artificial', it: 'Soluzioni di Intelligenza Artificiale', de: 'Künstliche Intelligenz Lösungen' },
            description: { fr: 'Intégration d\'IA dans vos processus métier : chatbots intelligents, analyse de données, automatisation et machine learning.', en: 'AI integration in your business processes: intelligent chatbots, data analysis, automation and machine learning.', es: 'Integración de IA en sus procesos comerciales: chatbots inteligentes, análisis de datos, automatización y aprendizaje automático.', it: 'Integrazione dell\'IA nei tuoi processi aziendali: chatbot intelligenti, analisi dei dati, automazione e machine learning.', de: 'KI-Integration in Ihre Geschäftsprozesse: intelligente Chatbots, Datenanalyse, Automatisierung und maschinelles Lernen.' },
            details: { fr: 'Solutions d\'IA sur mesure pour optimiser vos opérations. Nous développons des systèmes intelligents adaptés à vos besoins spécifiques : assistants virtuels, prédictions basées sur les données, automatisation de processus métier et outils d\'aide à la décision pour améliorer votre productivité.', en: 'Custom AI solutions to optimize your operations. We develop intelligent systems tailored to your specific needs: virtual assistants, data-driven predictions, business process automation and decision support tools to improve your productivity.', es: 'Soluciones de IA personalizadas para optimizar sus operaciones. Desarrollamos sistemas inteligentes adaptados a sus necesidades específicas: asistentes virtuales, predicciones basadas en datos, automatización de procesos comerciales y herramientas de apoyo a la decisión para mejorar su productividad.', it: 'Soluzioni IA personalizzate per ottimizzare le tue operazioni. Sviluppiamo sistemi intelligenti adattati alle tue esigenze specifiche: assistenti virtuali, previsioni basate sui dati, automazione dei processi aziendali e strumenti di supporto alle decisioni per migliorare la tua produttività.', de: 'Maßgeschneiderte KI-Lösungen zur Optimierung Ihrer Abläufe. Wir entwickeln intelligente Systeme, die auf Ihre spezifischen Bedürfnisse zugeschnitten sind: virtuelle Assistenten, datengestützte Vorhersagen, Geschäftsprozessautomatisierung und Entscheidungsunterstützungstools zur Verbesserung Ihrer Produktivität.' },
            icon: 'Brain'
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

  const updateSiteSettings = async () => {
    const settings = agencyContent.siteSettings;
    
    // Préparer les mises à jour avec sérialisation JSON pour les objets multilingues
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
      // Utiliser setSiteSettings qui accepte un objet avec des valeurs déjà sérialisées
      // Mais setSiteSettings détecte automatiquement le type, donc on doit passer les objets directement
      const updatesWithTypes = {
        siteName: { value: settings.siteName, type: 'json' },
        siteTagline: { value: settings.siteTagline, type: 'json' },
        siteDescription: { value: settings.siteDescription, type: 'json' },
        copyrightText: { value: settings.copyrightText, type: 'json' },
        email: { value: settings.email, type: 'string' },
        phone: { value: settings.phone, type: 'string' },
        address: { value: settings.address, type: 'string' }
      };

      // Mettre à jour chaque paramètre individuellement
      const promises = Object.entries(updatesWithTypes).map(([key, { value, type }]) => {
        return apiService.setSiteSetting(key, typeof value === 'object' ? JSON.stringify(value) : value, type);
      });

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Erreur mise à jour paramètres:', error);
      throw error;
    }
  };

  const updateSection = async (sectionId, sectionType, content) => {
    try {
      console.log(`🔄 Mise à jour section ${sectionId} (${sectionType})`, content);
      
      // Récupérer toutes les sections
      const sections = await apiService.getSections();

      // Pour hero-slider et blog, chercher toutes les sections de ce type, pas seulement par ID
      let existingSection = null;
      if (sectionType === 'hero-slider' || sectionType === 'blog') {
        // Chercher la première section de ce type existante
        existingSection = sections.find(s => s.section_type === sectionType);
      if (existingSection) {
          console.log(`✅ Section ${sectionType} existante trouvée (ID: ${existingSection.id}):`, existingSection);
        } else {
          console.log(`ℹ️ Aucune section ${sectionType} existante trouvée, recherche par ID...`);
          // Si aucune trouvée par type, chercher par ID
          existingSection = sections.find(s => s.id === sectionId);
        }
      } else {
        // Pour les autres types, chercher par ID
        existingSection = sections.find(s => s.id === sectionId);
      }

      if (existingSection) {
        console.log(`✅ Section existante trouvée:`, existingSection);
        // Mettre à jour - section_data est déjà parsé en JSON par l'API
        const currentData = existingSection.section_data || {};
        const updatedData = {
          ...currentData,
          ...content
        };
        
        console.log(`📝 Données mises à jour:`, updatedData);
        
        // Utiliser l'ID de la section existante (qui peut être différent de sectionId)
        const actualSectionId = existingSection.id;
        
        // updateSection attend un objet avec section_data
        // S'assurer que la section est activée
        const result = await apiService.updateSection(actualSectionId, {
          section_data: updatedData,
          is_enabled: 1  // S'assurer que la section est activée
        });
        console.log(`✅ Section mise à jour (ID: ${actualSectionId}):`, result);
        return actualSectionId; // Retourner l'ID réel utilisé
      } else {
        console.log(`➕ Création nouvelle section ${sectionId}`);
        // Créer une nouvelle section
        const result = await apiService.createSection({
          id: sectionId,
          section_type: sectionType,
          section_data: content,
          is_enabled: 1,
          sort_order: 0,
          language_id: 'fr'
        });
        console.log(`✅ Section créée:`, result);
        return sectionId;
      }
      
      // Attendre un peu pour que la base de données soit à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error(`❌ Erreur section ${sectionId}:`, error);
      throw error;
    }
  };

  const createLegalPages = async () => {
    const legalPages = [
      {
        title: {
          fr: 'Mentions légales',
          en: 'Legal Notice',
          es: 'Aviso Legal',
          it: 'Note Legali',
          de: 'Impressum'
        },
        slug: 'mentions-legales',
        content: {
          fr: `<h2>Mentions Légales</h2>
<p><strong>Éditeur du site</strong></p>
<p>Princept i-web<br />
Mahazoarivo, Lot VR 26 MAA Mahazoarivo<br />
Antananarivo 101, Madagascar</p>

<p><strong>Directeur de publication</strong></p>
<p>Princept i-web</p>

<p><strong>Hébergement</strong></p>
<p>Les informations concernant l'hébergement du site sont disponibles sur demande.</p>

<p><strong>Propriété intellectuelle</strong></p>
<p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>

<p><strong>Protection des données personnelles</strong></p>
<p>Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.</p>

<p><strong>Contact</strong></p>
<p>Pour toute question concernant ces mentions légales, vous pouvez nous contacter à : princept.iweb@gmail.com</p>`,
          en: `<h2>Legal Notice</h2>
<p><strong>Website Publisher</strong></p>
<p>Princept i-web<br />
Mahazoarivo, Lot VR 26 MAA Mahazoarivo<br />
Antananarivo 101, Madagascar</p>

<p><strong>Publication Director</strong></p>
<p>Princept i-web</p>

<p><strong>Hosting</strong></p>
<p>Information regarding website hosting is available upon request.</p>

<p><strong>Intellectual Property</strong></p>
<p>This entire website is subject to French and international legislation on copyright and intellectual property. All reproduction rights are reserved, including for downloadable documents and iconographic and photographic representations.</p>

<p><strong>Personal Data Protection</strong></p>
<p>In accordance with the "Data Protection and Freedom of Information" law of January 6, 1978, as amended, and the General Data Protection Regulation (GDPR), you have the right to access, rectify, delete and object to personal data concerning you.</p>

<p><strong>Contact</strong></p>
<p>For any questions regarding this legal notice, you can contact us at: princept.iweb@gmail.com</p>`,
          es: `<h2>Aviso Legal</h2>
<p><strong>Editor del sitio</strong></p>
<p>Princept i-web<br />
Mahazoarivo, Lot VR 26 MAA Mahazoarivo<br />
Antananarivo 101, Madagascar</p>

<p><strong>Director de publicación</strong></p>
<p>Princept i-web</p>

<p><strong>Alojamiento</strong></p>
<p>La información sobre el alojamiento del sitio está disponible bajo solicitud.</p>

<p><strong>Propiedad intelectual</strong></p>
<p>Todo este sitio está sujeto a la legislación francesa e internacional sobre derechos de autor y propiedad intelectual. Todos los derechos de reproducción están reservados, incluidos los documentos descargables y las representaciones iconográficas y fotográficas.</p>

<p><strong>Protección de datos personales</strong></p>
<p>De acuerdo con la ley "Informática y Libertades" del 6 de enero de 1978 modificada y el Reglamento General de Protección de Datos (RGPD), usted tiene derecho a acceder, rectificar, eliminar y oponerse a los datos personales que le conciernen.</p>

<p><strong>Contacto</strong></p>
<p>Para cualquier pregunta sobre este aviso legal, puede contactarnos en: princept.iweb@gmail.com</p>`,
          it: `<h2>Note Legali</h2>
<p><strong>Editore del sito</strong></p>
<p>Princept i-web<br />
Mahazoarivo, Lot VR 26 MAA Mahazoarivo<br />
Antananarivo 101, Madagascar</p>

<p><strong>Direttore della pubblicazione</strong></p>
<p>Princept i-web</p>

<p><strong>Hosting</strong></p>
<p>Le informazioni sull'hosting del sito sono disponibili su richiesta.</p>

<p><strong>Proprietà intellettuale</strong></p>
<p>L'intero sito è soggetto alla legislazione francese e internazionale sul diritto d'autore e la proprietà intellettuale. Tutti i diritti di riproduzione sono riservati, inclusi i documenti scaricabili e le rappresentazioni iconografiche e fotografiche.</p>

<p><strong>Protezione dei dati personali</strong></p>
<p>Conformemente alla legge "Informatica e Libertà" del 6 gennaio 1978 modificata e al Regolamento Generale sulla Protezione dei Dati (RGPD), avete il diritto di accedere, rettificare, eliminare e opporvi ai dati personali che vi riguardano.</p>

<p><strong>Contatto</strong></p>
<p>Per qualsiasi domanda riguardo a queste note legali, potete contattarci a: princept.iweb@gmail.com</p>`,
          de: `<h2>Impressum</h2>
<p><strong>Website-Herausgeber</strong></p>
<p>Princept i-web<br />
Mahazoarivo, Lot VR 26 MAA Mahazoarivo<br />
Antananarivo 101, Madagaskar</p>

<p><strong>Verantwortlicher Redakteur</strong></p>
<p>Princept i-web</p>

<p><strong>Hosting</strong></p>
<p>Informationen zum Hosting der Website sind auf Anfrage erhältlich.</p>

<p><strong>Geistiges Eigentum</strong></p>
<p>Diese gesamte Website unterliegt der französischen und internationalen Gesetzgebung zum Urheberrecht und geistigen Eigentum. Alle Vervielfältigungsrechte sind vorbehalten, einschließlich für herunterladbare Dokumente und ikonografische und fotografische Darstellungen.</p>

<p><strong>Schutz personenbezogener Daten</strong></p>
<p>Gemäß dem Gesetz "Informatik und Freiheiten" vom 6. Januar 1978 in geänderter Fassung und der Datenschutz-Grundverordnung (DSGVO) haben Sie das Recht auf Zugang, Berichtigung, Löschung und Widerspruch zu personenbezogenen Daten, die Sie betreffen.</p>

<p><strong>Kontakt</strong></p>
<p>Bei Fragen zu diesem Impressum können Sie uns unter folgender E-Mail-Adresse kontaktieren: princept.iweb@gmail.com</p>`
        },
        isPublished: true
      },
      {
        title: {
          fr: 'Politique de confidentialité',
          en: 'Privacy Policy',
          es: 'Política de Privacidad',
          it: 'Politica sulla Privacy',
          de: 'Datenschutzerklärung'
        },
        slug: 'politique-confidentialite',
        content: {
          fr: `<h2>Politique de Confidentialité</h2>
<p>Princept i-web s'engage à protéger la confidentialité de vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.</p>

<h3>1. Collecte des données</h3>
<p>Nous collectons les données personnelles que vous nous fournissez volontairement lorsque vous :</p>
<ul>
<li>Remplissez un formulaire de contact</li>
<li>Vous abonnez à notre newsletter</li>
<li>Utilisez nos services</li>
</ul>

<h3>2. Utilisation des données</h3>
<p>Vos données personnelles sont utilisées pour :</p>
<ul>
<li>Répondre à vos demandes et questions</li>
<li>Vous fournir nos services</li>
<li>Vous envoyer des informations sur nos services (avec votre consentement)</li>
<li>Améliorer notre site web et nos services</li>
</ul>

<h3>3. Conservation des données</h3>
<p>Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, conformément à la réglementation en vigueur.</p>

<h3>4. Vos droits</h3>
<p>Conformément au RGPD, vous disposez des droits suivants :</p>
<ul>
<li>Droit d'accès à vos données personnelles</li>
<li>Droit de rectification</li>
<li>Droit à l'effacement</li>
<li>Droit à la limitation du traitement</li>
<li>Droit à la portabilité</li>
<li>Droit d'opposition</li>
</ul>

<h3>5. Cookies</h3>
<p>Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies.</p>

<h3>6. Contact</h3>
<p>Pour exercer vos droits ou pour toute question concernant cette politique, contactez-nous à : princept.iweb@gmail.com</p>`,
          en: `<h2>Privacy Policy</h2>
<p>Princept i-web is committed to protecting the confidentiality of your personal data. This policy explains how we collect, use and protect your information.</p>

<h3>1. Data Collection</h3>
<p>We collect personal data that you voluntarily provide to us when you:</p>
<ul>
<li>Fill out a contact form</li>
<li>Subscribe to our newsletter</li>
<li>Use our services</li>
</ul>

<h3>2. Use of Data</h3>
<p>Your personal data is used to:</p>
<ul>
<li>Respond to your requests and questions</li>
<li>Provide you with our services</li>
<li>Send you information about our services (with your consent)</li>
<li>Improve our website and services</li>
</ul>

<h3>3. Data Retention</h3>
<p>We retain your personal data only for the duration necessary for the purposes for which it was collected, in accordance with applicable regulations.</p>

<h3>4. Your Rights</h3>
<p>In accordance with GDPR, you have the following rights:</p>
<ul>
<li>Right of access to your personal data</li>
<li>Right to rectification</li>
<li>Right to erasure</li>
<li>Right to restriction of processing</li>
<li>Right to data portability</li>
<li>Right to object</li>
</ul>

<h3>5. Cookies</h3>
<p>Our website uses cookies to improve your browsing experience. You can configure your browser to refuse cookies.</p>

<h3>6. Contact</h3>
<p>To exercise your rights or for any questions regarding this policy, contact us at: princept.iweb@gmail.com</p>`,
          es: `<h2>Política de Privacidad</h2>
<p>Princept i-web se compromete a proteger la confidencialidad de sus datos personales. Esta política explica cómo recopilamos, utilizamos y protegemos su información.</p>

<h3>1. Recopilación de datos</h3>
<p>Recopilamos datos personales que usted nos proporciona voluntariamente cuando:</p>
<ul>
<li>Completa un formulario de contacto</li>
<li>Se suscribe a nuestro boletín</li>
<li>Utiliza nuestros servicios</li>
</ul>

<h3>2. Uso de datos</h3>
<p>Sus datos personales se utilizan para:</p>
<ul>
<li>Responder a sus solicitudes y preguntas</li>
<li>Proporcionarle nuestros servicios</li>
<li>Enviarle información sobre nuestros servicios (con su consentimiento)</li>
<li>Mejorar nuestro sitio web y servicios</li>
</ul>

<h3>3. Conservación de datos</h3>
<p>Conservamos sus datos personales solo durante el tiempo necesario para los fines para los que fueron recopilados, de acuerdo con la normativa vigente.</p>

<h3>4. Sus derechos</h3>
<p>De acuerdo con el RGPD, usted tiene los siguientes derechos:</p>
<ul>
<li>Derecho de acceso a sus datos personales</li>
<li>Derecho de rectificación</li>
<li>Derecho al borrado</li>
<li>Derecho a la limitación del tratamiento</li>
<li>Derecho a la portabilidad</li>
<li>Derecho de oposición</li>
</ul>

<h3>5. Cookies</h3>
<p>Nuestro sitio utiliza cookies para mejorar su experiencia de navegación. Puede configurar su navegador para rechazar las cookies.</p>

<h3>6. Contacto</h3>
<p>Para ejercer sus derechos o para cualquier pregunta sobre esta política, contáctenos en: princept.iweb@gmail.com</p>`,
          it: `<h2>Politica sulla Privacy</h2>
<p>Princept i-web si impegna a proteggere la riservatezza dei vostri dati personali. Questa politica spiega come raccogliamo, utilizziamo e proteggiamo le vostre informazioni.</p>

<h3>1. Raccolta dei dati</h3>
<p>Raccogliamo dati personali che ci fornite volontariamente quando:</p>
<ul>
<li>Compilate un modulo di contatto</li>
<li>Vi abbonate alla nostra newsletter</li>
<li>Utilizzate i nostri servizi</li>
</ul>

<h3>2. Utilizzo dei dati</h3>
<p>I vostri dati personali sono utilizzati per:</p>
<ul>
<li>Rispondere alle vostre richieste e domande</li>
<li>Fornirvi i nostri servizi</li>
<li>Inviarvi informazioni sui nostri servizi (con il vostro consenso)</li>
<li>Migliorare il nostro sito web e i nostri servizi</li>
</ul>

<h3>3. Conservazione dei dati</h3>
<p>Conserviamo i vostri dati personali solo per la durata necessaria alle finalità per le quali sono stati raccolti, conformemente alla normativa vigente.</p>

<h3>4. I vostri diritti</h3>
<p>Conformemente al RGPD, avete i seguenti diritti:</p>
<ul>
<li>Diritto di accesso ai vostri dati personali</li>
<li>Diritto di rettifica</li>
<li>Diritto alla cancellazione</li>
<li>Diritto alla limitazione del trattamento</li>
<li>Diritto alla portabilità</li>
<li>Diritto di opposizione</li>
</ul>

<h3>5. Cookie</h3>
<p>Il nostro sito utilizza cookie per migliorare la vostra esperienza di navigazione. Potete configurare il vostro browser per rifiutare i cookie.</p>

<h3>6. Contatto</h3>
<p>Per esercitare i vostri diritti o per qualsiasi domanda riguardo a questa politica, contattateci a: princept.iweb@gmail.com</p>`,
          de: `<h2>Datenschutzerklärung</h2>
<p>Princept i-web verpflichtet sich, die Vertraulichkeit Ihrer persönlichen Daten zu schützen. Diese Richtlinie erklärt, wie wir Ihre Informationen sammeln, verwenden und schützen.</p>

<h3>1. Datenerfassung</h3>
<p>Wir erfassen personenbezogene Daten, die Sie uns freiwillig zur Verfügung stellen, wenn Sie:</p>
<ul>
<li>Ein Kontaktformular ausfüllen</li>
<li>Unseren Newsletter abonnieren</li>
<li>Unsere Dienstleistungen nutzen</li>
</ul>

<h3>2. Verwendung der Daten</h3>
<p>Ihre personenbezogenen Daten werden verwendet, um:</p>
<ul>
<li>Auf Ihre Anfragen und Fragen zu antworten</li>
<li>Ihnen unsere Dienstleistungen zur Verfügung zu stellen</li>
<li>Ihnen Informationen über unsere Dienstleistungen zu senden (mit Ihrer Zustimmung)</li>
<li>Unsere Website und Dienstleistungen zu verbessern</li>
</ul>

<h3>3. Datenspeicherung</h3>
<p>Wir speichern Ihre personenbezogenen Daten nur für die Dauer, die für die Zwecke, für die sie erfasst wurden, erforderlich ist, gemäß den geltenden Vorschriften.</p>

<h3>4. Ihre Rechte</h3>
<p>Gemäß der DSGVO haben Sie folgende Rechte:</p>
<ul>
<li>Recht auf Zugang zu Ihren personenbezogenen Daten</li>
<li>Recht auf Berichtigung</li>
<li>Recht auf Löschung</li>
<li>Recht auf Einschränkung der Verarbeitung</li>
<li>Recht auf Datenübertragbarkeit</li>
<li>Widerspruchsrecht</li>
</ul>

<h3>5. Cookies</h3>
<p>Unsere Website verwendet Cookies, um Ihr Browsing-Erlebnis zu verbessern. Sie können Ihren Browser so konfigurieren, dass Cookies abgelehnt werden.</p>

<h3>6. Kontakt</h3>
<p>Um Ihre Rechte auszuüben oder bei Fragen zu dieser Richtlinie kontaktieren Sie uns unter: princept.iweb@gmail.com</p>`
        },
        isPublished: true
      },
      {
        title: {
          fr: 'Conditions Générales d\'Utilisation',
          en: 'Terms of Use',
          es: 'Términos de Uso',
          it: 'Termini di Utilizzo',
          de: 'Nutzungsbedingungen'
        },
        slug: 'conditions-generales-utilisation',
        content: {
          fr: `<h2>Conditions Générales d'Utilisation</h2>
<p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site web de Princept i-web.</p>

<h3>1. Acceptation des conditions</h3>
<p>En accédant et en utilisant ce site, vous acceptez d'être lié par ces CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.</p>

<h3>2. Utilisation du site</h3>
<p>Vous vous engagez à utiliser ce site de manière légale et conforme à ces CGU. Il est interdit :</p>
<ul>
<li>D'utiliser le site à des fins illégales</li>
<li>De tenter d'accéder de manière non autorisée au site</li>
<li>De perturber le fonctionnement du site</li>
<li>De reproduire ou copier le contenu sans autorisation</li>
</ul>

<h3>3. Propriété intellectuelle</h3>
<p>Tous les contenus présents sur ce site (textes, images, logos, etc.) sont la propriété de Princept i-web ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle.</p>

<h3>4. Limitation de responsabilité</h3>
<p>Princept i-web ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser ce site.</p>

<h3>5. Modification des CGU</h3>
<p>Princept i-web se réserve le droit de modifier ces CGU à tout moment. Les modifications prennent effet dès leur publication sur le site.</p>

<h3>6. Droit applicable</h3>
<p>Ces CGU sont régies par le droit malgache. Tout litige relatif à ces CGU relève de la compétence des tribunaux malgaches.</p>

<h3>7. Contact</h3>
<p>Pour toute question concernant ces CGU, contactez-nous à : princept.iweb@gmail.com</p>`,
          en: `<h2>Terms of Use</h2>
<p>These Terms of Use govern the use of the Princept i-web website.</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing and using this site, you agree to be bound by these Terms. If you do not accept these terms, please do not use this site.</p>

<h3>2. Use of the Site</h3>
<p>You agree to use this site in a legal manner and in accordance with these Terms. It is prohibited to:</p>
<ul>
<li>Use the site for illegal purposes</li>
<li>Attempt to access the site in an unauthorized manner</li>
<li>Disrupt the operation of the site</li>
<li>Reproduce or copy content without authorization</li>
</ul>

<h3>3. Intellectual Property</h3>
<p>All content on this site (texts, images, logos, etc.) is the property of Princept i-web or its partners and is protected by intellectual property laws.</p>

<h3>4. Limitation of Liability</h3>
<p>Princept i-web cannot be held liable for direct or indirect damages resulting from the use or inability to use this site.</p>

<h3>5. Modification of Terms</h3>
<p>Princept i-web reserves the right to modify these Terms at any time. Modifications take effect upon their publication on the site.</p>

<h3>6. Applicable Law</h3>
<p>These Terms are governed by Malagasy law. Any dispute relating to these Terms falls under the jurisdiction of Malagasy courts.</p>

<h3>7. Contact</h3>
<p>For any questions regarding these Terms, contact us at: princept.iweb@gmail.com</p>`,
          es: `<h2>Términos de Uso</h2>
<p>Estos Términos de Uso rigen el uso del sitio web de Princept i-web.</p>

<h3>1. Aceptación de los términos</h3>
<p>Al acceder y utilizar este sitio, acepta estar vinculado por estos Términos. Si no acepta estos términos, no utilice este sitio.</p>

<h3>2. Uso del sitio</h3>
<p>Se compromete a utilizar este sitio de manera legal y conforme a estos Términos. Está prohibido:</p>
<ul>
<li>Utilizar el sitio con fines ilegales</li>
<li>Intentar acceder al sitio de manera no autorizada</li>
<li>Perturbar el funcionamiento del sitio</li>
<li>Reproducir o copiar el contenido sin autorización</li>
</ul>

<h3>3. Propiedad intelectual</h3>
<p>Todo el contenido presente en este sitio (textos, imágenes, logos, etc.) es propiedad de Princept i-web o de sus socios y está protegido por las leyes de propiedad intelectual.</p>

<h3>4. Limitación de responsabilidad</h3>
<p>Princept i-web no puede ser considerado responsable de los daños directos o indirectos resultantes del uso o la imposibilidad de usar este sitio.</p>

<h3>5. Modificación de los términos</h3>
<p>Princept i-web se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones entran en vigor desde su publicación en el sitio.</p>

<h3>6. Ley aplicable</h3>
<p>Estos Términos se rigen por la ley malgache. Cualquier disputa relativa a estos Términos corresponde a la jurisdicción de los tribunales malgaches.</p>

<h3>7. Contacto</h3>
<p>Para cualquier pregunta sobre estos Términos, contáctenos en: princept.iweb@gmail.com</p>`,
          it: `<h2>Termini di Utilizzo</h2>
<p>Questi Termini di Utilizzo regolano l'uso del sito web di Princept i-web.</p>

<h3>1. Accettazione dei termini</h3>
<p>Accedendo e utilizzando questo sito, accettate di essere vincolati da questi Termini. Se non accettate questi termini, non utilizzate questo sito.</p>

<h3>2. Utilizzo del sito</h3>
<p>Vi impegnate a utilizzare questo sito in modo legale e conforme a questi Termini. È vietato:</p>
<ul>
<li>Utilizzare il sito per scopi illegali</li>
<li>Tentare di accedere al sito in modo non autorizzato</li>
<li>Perturbare il funzionamento del sito</li>
<li>Riprodurre o copiare il contenuto senza autorizzazione</li>
</ul>

<h3>3. Proprietà intellettuale</h3>
<p>Tutti i contenuti presenti su questo sito (testi, immagini, loghi, ecc.) sono di proprietà di Princept i-web o dei suoi partner e sono protetti dalle leggi sulla proprietà intellettuale.</p>

<h3>4. Limitazione della responsabilità</h3>
<p>Princept i-web non può essere ritenuto responsabile dei danni diretti o indiretti risultanti dall'uso o dall'impossibilità di utilizzare questo sito.</p>

<h3>5. Modifica dei termini</h3>
<p>Princept i-web si riserva il diritto di modificare questi Termini in qualsiasi momento. Le modifiche entrano in vigore dalla loro pubblicazione sul sito.</p>

<h3>6. Legge applicabile</h3>
<p>Questi Termini sono regolati dalla legge malgascia. Qualsiasi controversia relativa a questi Termini rientra nella giurisdizione dei tribunali malgasci.</p>

<h3>7. Contatto</h3>
<p>Per qualsiasi domanda riguardo a questi Termini, contattateci a: princept.iweb@gmail.com</p>`,
          de: `<h2>Nutzungsbedingungen</h2>
<p>Diese Nutzungsbedingungen regeln die Nutzung der Website von Princept i-web.</p>

<h3>1. Annahme der Bedingungen</h3>
<p>Durch den Zugriff auf und die Nutzung dieser Website erklären Sie sich damit einverstanden, an diese Bedingungen gebunden zu sein. Wenn Sie diese Bedingungen nicht akzeptieren, verwenden Sie diese Website bitte nicht.</p>

<h3>2. Nutzung der Website</h3>
<p>Sie verpflichten sich, diese Website auf legale Weise und in Übereinstimmung mit diesen Bedingungen zu nutzen. Es ist verboten:</p>
<ul>
<li>Die Website für illegale Zwecke zu nutzen</li>
<li>Unbefugt auf die Website zuzugreifen</li>
<li>Den Betrieb der Website zu stören</li>
<li>Inhalte ohne Genehmigung zu reproduzieren oder zu kopieren</li>
</ul>

<h3>3. Geistiges Eigentum</h3>
<p>Alle Inhalte auf dieser Website (Texte, Bilder, Logos usw.) sind Eigentum von Princept i-web oder seinen Partnern und sind durch Gesetze zum geistigen Eigentum geschützt.</p>

<h3>4. Haftungsbeschränkung</h3>
<p>Princept i-web kann nicht für direkte oder indirekte Schäden haftbar gemacht werden, die aus der Nutzung oder der Unmöglichkeit der Nutzung dieser Website resultieren.</p>

<h3>5. Änderung der Bedingungen</h3>
<p>Princept i-web behält sich das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen treten mit ihrer Veröffentlichung auf der Website in Kraft.</p>

<h3>6. Anwendbares Recht</h3>
<p>Diese Bedingungen unterliegen madagassischem Recht. Alle Streitigkeiten bezüglich dieser Bedingungen unterliegen der Gerichtsbarkeit der madagassischen Gerichte.</p>

<h3>7. Kontakt</h3>
<p>Bei Fragen zu diesen Bedingungen kontaktieren Sie uns unter: princept.iweb@gmail.com</p>`
        },
        isPublished: true
      }
    ];

    try {
      // Vérifier si les pages existent déjà
      const existingPages = await apiService.getPages();
      
      for (const legalPage of legalPages) {
        const existingPage = existingPages.find(
          p => p.slug === legalPage.slug
        );
        
        if (existingPage) {
          // Mettre à jour la page existante
          await apiService.updatePage(existingPage.id, {
            title: legalPage.title,
            slug: legalPage.slug,
            content: legalPage.content,
            isPublished: legalPage.isPublished
          });
        } else {
          // Créer une nouvelle page
          await apiService.createPage({
            title: legalPage.title,
            slug: legalPage.slug,
            content: legalPage.content,
            isPublished: legalPage.isPublished
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erreur création pages légales:', error);
      throw error;
    }
  };

  const fillContent = async () => {
    setIsLoading(true);
    setProgress('');

    try {
      // 1. Paramètres du site
      setProgress('Mise à jour des paramètres du site...');
      await updateSiteSettings();
      setProgress('✅ Paramètres du site mis à jour');

      // 2. Sections
      setProgress('Mise à jour des sections...');

      // Hero
      await updateSection('hero-default', 'hero', {
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
      setProgress('✅ Section Hero mise à jour');

      // About
      await updateSection('about-default', 'about', {
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
      setProgress('✅ Section À Propos mise à jour');

      // Services
      await updateSection('services-default', 'services', {
        title: agencyContent.sections.services.title,
        description: agencyContent.sections.services.description,
        services: agencyContent.sections.services.services.map((service, index) => ({
          id: `service-${index}`,
          title: service.title,
          description: service.description,
          details: service.details,
          icon: service.icon
        })),
        backgroundColor: '#f8fafc',
        textColor: '#374151',
        navigationMode: 'onepage'
      });
      setProgress('✅ Section Services mise à jour');

      // Contact
      await updateSection('contact-default', 'contact', {
        title: agencyContent.sections.contact.title,
        description: agencyContent.sections.contact.description,
        email: agencyContent.siteSettings.email,
        phone: agencyContent.siteSettings.phone,
        address: agencyContent.siteSettings.address,
        backgroundColor: '#ffffff',
        textColor: '#374151',
        navigationMode: 'onepage'
      });
      setProgress('✅ Section Contact mise à jour');

      // Hero Slider
      setProgress('Mise à jour du Hero Slider...');
      await updateSection('hero-slider-default', 'hero-slider', {
        slides: [
          {
            id: 1,
            title: {
              fr: 'Solutions Digitales sur Mesure',
              en: 'Custom Digital Solutions'
            },
            subtitle: {
              fr: 'De l\'idée à la réalisation',
              en: 'From idea to reality'
            },
            description: {
              fr: 'Nous créons des expériences digitales exceptionnelles qui transforment votre présence en ligne. Sites web, e-commerce, applications mobiles et solutions IA.',
              en: 'We create exceptional digital experiences that transform your online presence. Websites, e-commerce, mobile applications and AI solutions.'
            },
            buttonText: {
              fr: 'Découvrir nos services',
              en: 'Discover our services'
            },
            buttonLink: '#services',
            secondaryButtonText: {
              fr: 'En savoir plus',
              en: 'Learn more'
            },
            secondaryButtonLink: '#about',
            backgroundImage: null
          },
          {
            id: 2,
            title: {
              fr: 'Développement Web & E-Commerce',
              en: 'Web Development & E-Commerce'
            },
            subtitle: {
              fr: 'Solutions sur mesure',
              en: 'Custom solutions'
            },
            description: {
              fr: 'Conception et développement de sites professionnels, vitrines et e-commerce sur mesure. Design responsive et interfaces UI/UX innovantes.',
              en: 'Design and development of professional, showcase and custom e-commerce websites. Responsive design and innovative UI/UX interfaces.'
            },
            buttonText: {
              fr: 'Voir nos réalisations',
              en: 'See our work'
            },
            buttonLink: '#services',
            secondaryButtonText: {
              fr: 'Nous contacter',
              en: 'Contact us'
            },
            secondaryButtonLink: '#contact',
            backgroundImage: null
          },
          {
            id: 3,
            title: {
              fr: 'Applications Mobiles',
              en: 'Mobile Applications'
            },
            subtitle: {
              fr: 'Native et hybride',
              en: 'Native and hybrid'
            },
            description: {
              fr: 'Développement d\'applications mobiles natives et hybrides pour Android, iOS et Windows Phone. Applications BtoC et BtoB avec interfaces ergonomiques.',
              en: 'Development of native and hybrid mobile applications for Android, iOS and Windows Phone. BtoC and BtoB applications with ergonomic interfaces.'
            },
            buttonText: {
              fr: 'Découvrir nos apps',
              en: 'Discover our apps'
            },
            buttonLink: '#services',
            secondaryButtonText: {
              fr: 'En savoir plus',
              en: 'Learn more'
            },
            secondaryButtonLink: '#services',
            backgroundImage: null
          },
          {
            id: 4,
            title: {
              fr: 'Solutions d\'Intelligence Artificielle',
              en: 'Artificial Intelligence Solutions'
            },
            subtitle: {
              fr: 'Innovation technologique',
              en: 'Technological innovation'
            },
            description: {
              fr: 'Intégration d\'IA dans vos processus métier : chatbots intelligents, analyse de données, automatisation et machine learning.',
              en: 'AI integration in your business processes: intelligent chatbots, data analysis, automation and machine learning.'
            },
            buttonText: {
              fr: 'Explorer l\'IA',
              en: 'Explore AI'
            },
            buttonLink: '#services',
            secondaryButtonText: {
              fr: 'En savoir plus',
              en: 'Learn more'
            },
            secondaryButtonLink: '#services',
            backgroundImage: null
          }
        ],
        autoPlayDelay: 5000,
        enableAutoPlay: true,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        textColor: '#ffffff',
        navigationMode: 'onepage'
      });
      setProgress('✅ Hero Slider mis à jour');

      // 3. Pages légales
      setProgress('Création des pages légales...');
      await createLegalPages();
      setProgress('✅ Pages légales créées');

      // Recharger les sections depuis le store
      try {
        await sectionStore.refresh();
        console.log('✅ Sections rechargées');
      } catch (reloadError) {
        console.warn('⚠️ Erreur rechargement sections:', reloadError);
      }
      
      // Déclencher un événement pour forcer le rechargement
      window.dispatchEvent(new CustomEvent('sectionsUpdated'));

      setIsLoading(false);
      showSuccess('Contenu rempli avec succès ! Rechargez votre site pour voir les changements.');
      setProgress('');
    } catch (error) {
      setIsLoading(false);
      showError(`Erreur lors du remplissage: ${error.message}`);
      setProgress('');
    }
  };

  return (
    <div className="admin-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
        <h2 className="text-2xl font-bold">Générateur de Contenu</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Remplir le site avec du contenu d'agence web</strong>
        </p>
        <p className="text-xs text-gray-600">
          Ce générateur va remplir automatiquement votre site avec du contenu professionnel pour une agence web spécialisée en :
        </p>
        <ul className="text-xs text-gray-600 mt-2 ml-4 list-disc">
          <li>Développement web & E-commerce sur mesure</li>
          <li>Applications mobiles</li>
          <li>Design & Identité visuelle</li>
          <li>Solutions IA</li>
          <li>Recrutement IT en régie</li>
          <li>Intégration systèmes</li>
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          Le contenu sera multilingue (FR, EN, ES, IT, DE) et remplira les paramètres du site ainsi que toutes les sections principales.
        </p>
      </div>

      {isLoading && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader className="w-5 h-5 animate-spin" />
            <span className="text-sm">{progress || 'Traitement en cours...'}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={fillContent}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Remplissage en cours...</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>Remplir le site avec le contenu d'agence web</span>
            </>
          )}
        </button>

        <div className="border-t pt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Hero Slider</h3>
            <p className="text-xs text-gray-600 mb-3">
              Remplir le Hero Slider avec 4 slides contenant des images gratuites (FR et EN uniquement).
            </p>
            <button
              onClick={async () => {
                setIsLoading(true);
                setProgress('');
                try {
                  setProgress('Mise à jour du Hero Slider...');
                  await updateSection('hero-slider-default', 'hero-slider', {
                    title: {
                      fr: 'Solutions Digitales sur Mesure',
                      en: 'Custom Digital Solutions'
                    },
                    subtitle: {
                      fr: 'De l\'idée à la réalisation',
                      en: 'From idea to reality'
                    },
                    description: {
                      fr: 'Nous créons des expériences digitales exceptionnelles qui transforment votre présence en ligne',
                      en: 'We create exceptional digital experiences that transform your online presence'
                    },
                    slides: [
                      {
                        id: 1,
                        title: {
                          fr: 'Solutions Digitales sur Mesure',
                          en: 'Custom Digital Solutions'
                        },
                        subtitle: {
                          fr: 'De l\'idée à la réalisation',
                          en: 'From idea to reality'
                        },
                        description: {
                          fr: 'Nous créons des expériences digitales exceptionnelles qui transforment votre présence en ligne. Sites web, e-commerce, applications mobiles et solutions IA.',
                          en: 'We create exceptional digital experiences that transform your online presence. Websites, e-commerce, mobile applications and AI solutions.'
                        },
                        buttonText: {
                          fr: 'Découvrir nos services',
                          en: 'Discover our services'
                        },
                        buttonLink: '#services',
                        secondaryButtonText: {
                          fr: 'En savoir plus',
                          en: 'Learn more'
                        },
                        secondaryButtonLink: '#about',
                        backgroundImage: null
                      },
                      {
                        id: 2,
                        title: {
                          fr: 'Développement Web & E-Commerce',
                          en: 'Web Development & E-Commerce'
                        },
                        subtitle: {
                          fr: 'Solutions sur mesure',
                          en: 'Custom solutions'
                        },
                        description: {
                          fr: 'Conception et développement de sites professionnels, vitrines et e-commerce sur mesure. Design responsive et interfaces UI/UX innovantes.',
                          en: 'Design and development of professional, showcase and custom e-commerce websites. Responsive design and innovative UI/UX interfaces.'
                        },
                        buttonText: {
                          fr: 'Voir nos réalisations',
                          en: 'See our work'
                        },
                        buttonLink: '#services',
                        secondaryButtonText: {
                          fr: 'Nous contacter',
                          en: 'Contact us'
                        },
                        secondaryButtonLink: '#contact',
                        backgroundImage: null
                      },
                      {
                        id: 3,
                        title: {
                          fr: 'Applications Mobiles & Solutions IA',
                          en: 'Mobile Apps & AI Solutions'
                        },
                        subtitle: {
                          fr: 'Innovation technologique',
                          en: 'Technological innovation'
                        },
                        description: {
                          fr: 'Développement d\'applications mobiles natives et hybrides, intégration d\'IA dans vos processus métier pour optimiser vos opérations.',
                          en: 'Development of native and hybrid mobile applications, AI integration in your business processes to optimize your operations.'
                        },
                        buttonText: {
                          fr: 'Découvrir nos solutions',
                          en: 'Discover our solutions'
                        },
                        buttonLink: '#services',
                        secondaryButtonText: {
                          fr: 'Portfolio',
                          en: 'Portfolio'
                        },
                        secondaryButtonLink: '#gallery',
                        backgroundImage: null
                      },
                      {
                        id: 4,
                        title: {
                          fr: 'Solutions d\'Intelligence Artificielle',
                          en: 'Artificial Intelligence Solutions'
                        },
                        subtitle: {
                          fr: 'Automatisation intelligente',
                          en: 'Smart automation'
                        },
                        description: {
                          fr: 'Intégration d\'IA dans vos processus métier : chatbots intelligents, analyse de données, automatisation et machine learning pour améliorer votre productivité.',
                          en: 'AI integration in your business processes: intelligent chatbots, data analysis, automation and machine learning to improve your productivity.'
                        },
                        buttonText: {
                          fr: 'Explorer l\'IA',
                          en: 'Explore AI'
                        },
                        buttonLink: '#services',
                        secondaryButtonText: {
                          fr: 'En savoir plus',
                          en: 'Learn more'
                        },
                        secondaryButtonLink: '#services',
                        backgroundImage: null
                      }
                    ],
                    autoPlayDelay: 5000,
                    enableAutoPlay: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    textColor: '#ffffff',
                    navigationMode: 'onepage'
                  });
                  
                  setProgress('✅ Hero Slider mis à jour');
                  
                  // Attendre un peu pour que la base de données soit à jour
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                  // Recharger les sections depuis le store
                  try {
                    console.log('🔄 Rechargement des sections...');
                    await sectionStore.refresh();
                    console.log('✅ Sections rechargées');
                  } catch (reloadError) {
                    console.warn('⚠️ Erreur rechargement sections:', reloadError);
                  }
                  
                  // Déclencher un événement pour forcer le rechargement
                  window.dispatchEvent(new CustomEvent('sectionsUpdated'));
                  
                  // Vérifier que la section a bien été créée/mise à jour
                  const verifySections = await apiService.getSections();
                  // Chercher toutes les sections hero-slider (peu importe l'ID)
                  const heroSliderSections = verifySections.filter(s => s.section_type === 'hero-slider');
                  if (heroSliderSections.length > 0) {
                    const heroSliderSection = heroSliderSections[0];
                    console.log(`✅ Section hero-slider trouvée (ID: ${heroSliderSection.id}):`, heroSliderSection);
                    console.log('📊 Nombre de slides:', heroSliderSection.section_data?.slides?.length || 0);
                    console.log('🔘 Section activée:', heroSliderSection.is_enabled);
                    if (heroSliderSections.length > 1) {
                      console.warn(`⚠️ Attention: ${heroSliderSections.length} sections hero-slider trouvées. La première a été mise à jour.`);
                    }
                  } else {
                    console.warn('⚠️ Aucune section hero-slider trouvée après création/mise à jour');
                  }
                  
                  showSuccess('Hero Slider rempli avec succès ! 4 slides avec images gratuites (FR et EN). Ouvrez la console (F12) pour voir les logs détaillés. Si les changements ne sont pas visibles, rechargez la page frontend.');
                  setProgress('');
                } catch (error) {
                  console.error('❌ Erreur détaillée Hero Slider:', error);
                  setIsLoading(false);
                  showError(`Erreur lors du remplissage du Hero Slider : ${error.message}. Vérifiez la console pour plus de détails.`);
                  setProgress('');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Remplissage en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Remplir le Hero Slider</span>
                </>
              )}
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Nos activités récentes</h3>
            <p className="text-xs text-gray-600 mb-3">
              Remplir la section Blog avec 6 activités récentes contenant des images gratuites (FR et EN uniquement).
            </p>
            <button
              onClick={async () => {
                setIsLoading(true);
                setProgress('');
                try {
                  setProgress('Mise à jour de la section Blog...');
                  await updateSection('blog-default', 'blog', {
                    title: {
                      fr: 'Nos activités récentes',
                      en: 'Our recent activities'
                    },
                    subtitle: {
                      fr: '',
                      en: ''
                    },
                    description: {
                      fr: 'Suivez nos dernières actions et événements pour rester informé de nos activités.',
                      en: 'Follow our latest actions and events to stay informed about our activities.'
                    },
                    postsPerPage: 6,
                    posts: [
                      {
                        id: 'post-1',
                        title: {
                          fr: 'Lancement de notre nouveau site web',
                          en: 'Launch of our new website'
                        },
                        summary: {
                          fr: 'Nous sommes fiers d\'annoncer le lancement de notre nouveau site web avec une interface moderne et intuitive.',
                          en: 'We are proud to announce the launch of our new website with a modern and intuitive interface.'
                        },
                        content: {
                          fr: 'Notre nouveau site web offre une expérience utilisateur améliorée avec des fonctionnalités avancées et un design responsive. Nous avons travaillé dur pour créer une plateforme qui reflète nos valeurs et notre engagement envers l\'excellence.',
                          en: 'Our new website offers an improved user experience with advanced features and responsive design. We have worked hard to create a platform that reflects our values and our commitment to excellence.'
                        },
                        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        author: {
                          fr: 'Équipe Princept',
                          en: 'Princept Team'
                        },
                        category: {
                          fr: 'Développement',
                          en: 'Development'
                        },
                        featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        images: [
                          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ],
                        videos: []
                      },
                      {
                        id: 'post-2',
                        title: {
                          fr: 'Formation en développement web',
                          en: 'Web development training'
                        },
                        summary: {
                          fr: 'Organisation d\'une session de formation intensive sur les technologies web modernes pour nos membres.',
                          en: 'Organization of an intensive training session on modern web technologies for our members.'
                        },
                        content: {
                          fr: 'Cette formation a permis à nos membres de se familiariser avec les dernières technologies web, notamment React, Node.js et les architectures cloud. Les participants ont pu mettre en pratique leurs connaissances sur des projets concrets.',
                          en: 'This training allowed our members to familiarize themselves with the latest web technologies, including React, Node.js and cloud architectures. Participants were able to put their knowledge into practice on concrete projects.'
                        },
                        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        author: {
                          fr: 'Équipe Formation',
                          en: 'Training Team'
                        },
                        category: {
                          fr: 'Formation',
                          en: 'Training'
                        },
                        featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        images: [
                          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ],
                        videos: []
                      },
                      {
                        id: 'post-3',
                        title: {
                          fr: 'Projet e-commerce pour client',
                          en: 'E-commerce project for client'
                        },
                        summary: {
                          fr: 'Finalisation d\'un projet e-commerce complet avec gestion de stock et système de paiement sécurisé.',
                          en: 'Completion of a complete e-commerce project with inventory management and secure payment system.'
                        },
                        content: {
                          fr: 'Nous avons développé une solution e-commerce sur mesure qui répond aux besoins spécifiques de notre client. Le projet inclut une interface d\'administration complète, un système de gestion des commandes et une intégration avec plusieurs modes de paiement.',
                          en: 'We developed a custom e-commerce solution that meets our client\'s specific needs. The project includes a complete administration interface, an order management system and integration with multiple payment methods.'
                        },
                        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        author: {
                          fr: 'Équipe Projets',
                          en: 'Projects Team'
                        },
                        category: {
                          fr: 'Projets',
                          en: 'Projects'
                        },
                        featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        images: [
                          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ],
                        videos: []
                      },
                      {
                        id: 'post-4',
                        title: {
                          fr: 'Application mobile native iOS',
                          en: 'Native iOS mobile application'
                        },
                        summary: {
                          fr: 'Développement d\'une application mobile native pour iOS avec des fonctionnalités innovantes.',
                          en: 'Development of a native mobile application for iOS with innovative features.'
                        },
                        content: {
                          fr: 'Notre équipe a créé une application mobile native iOS qui offre une expérience utilisateur fluide et intuitive. L\'application utilise les dernières fonctionnalités d\'iOS pour offrir des performances optimales.',
                          en: 'Our team created a native iOS mobile application that offers a smooth and intuitive user experience. The application uses the latest iOS features to deliver optimal performance.'
                        },
                        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        author: {
                          fr: 'Équipe Mobile',
                          en: 'Mobile Team'
                        },
                        category: {
                          fr: 'Mobile',
                          en: 'Mobile'
                        },
                        featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        images: [
                          'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ],
                        videos: []
                      },
                      {
                        id: 'post-5',
                        title: {
                          fr: 'Intégration d\'IA dans processus métier',
                          en: 'AI integration in business processes'
                        },
                        summary: {
                          fr: 'Mise en place d\'un système d\'intelligence artificielle pour automatiser certains processus métier.',
                          en: 'Implementation of an artificial intelligence system to automate certain business processes.'
                        },
                        content: {
                          fr: 'Nous avons intégré des solutions d\'IA pour améliorer l\'efficacité de nos processus internes. Les chatbots intelligents et l\'analyse de données automatisée permettent de gagner du temps et d\'améliorer la qualité de nos services.',
                          en: 'We have integrated AI solutions to improve the efficiency of our internal processes. Intelligent chatbots and automated data analysis save time and improve the quality of our services.'
                        },
                        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        author: {
                          fr: 'Équipe IA',
                          en: 'AI Team'
                        },
                        category: {
                          fr: 'Intelligence Artificielle',
                          en: 'Artificial Intelligence'
                        },
                        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        images: [
                          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ],
                        videos: []
                      },
                      {
                        id: 'post-6',
                        title: {
                          fr: 'Design et identité visuelle',
                          en: 'Design and visual identity'
                        },
                        summary: {
                          fr: 'Création d\'une nouvelle identité visuelle pour un client avec charte graphique complète.',
                          en: 'Creation of a new visual identity for a client with a complete graphic charter.'
                        },
                        content: {
                          fr: 'Notre équipe de design a développé une identité visuelle complète qui reflète les valeurs et la personnalité de notre client. La charte graphique inclut logo, couleurs, typographie et guidelines pour une utilisation cohérente sur tous les supports.',
                          en: 'Our design team developed a complete visual identity that reflects our client\'s values and personality. The graphic charter includes logo, colors, typography and guidelines for consistent use across all media.'
                        },
                        date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        author: {
                          fr: 'Équipe Design',
                          en: 'Design Team'
                        },
                        category: {
                          fr: 'Design',
                          en: 'Design'
                        },
                        featuredImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        images: [
                          'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        ],
                        videos: []
                      }
                    ],
                    backgroundColor: '#ffffff',
                    textColor: '#1F2937',
                    navigationMode: 'onepage'
                  });
                  
                  setProgress('✅ Section Blog mise à jour');
                  
                  // Attendre un peu pour que la base de données soit à jour
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                  // Recharger les sections depuis le store
                  try {
                    console.log('🔄 Rechargement des sections...');
                    await sectionStore.refresh();
                    console.log('✅ Sections rechargées');
                  } catch (reloadError) {
                    console.warn('⚠️ Erreur rechargement sections:', reloadError);
                  }
                  
                  // Déclencher un événement pour forcer le rechargement
                  window.dispatchEvent(new CustomEvent('sectionsUpdated'));
                  
                  showSuccess('Section "Nos activités récentes" remplie avec succès ! 6 posts avec images gratuites (FR et EN). Si les changements ne sont pas visibles, rechargez la page frontend.');
                  setProgress('');
                } catch (error) {
                  console.error('❌ Erreur détaillée Blog:', error);
                  setIsLoading(false);
                  showError(`Erreur lors du remplissage de la section Blog : ${error.message}. Vérifiez la console pour plus de détails.`);
                  setProgress('');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Remplissage en cours...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Remplir Nos activités récentes</span>
                </>
              )}
            </button>
          </div>

          <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-700">Pages légales</h3>
          <p className="text-xs text-gray-600 mb-3">
            Créez automatiquement les pages légales essentielles : Mentions légales, Politique de confidentialité et CGU.
          </p>
          <button
            onClick={async () => {
              setIsLoading(true);
              setProgress('');
              try {
                setProgress('Création des pages légales...');
                await createLegalPages();
                setProgress('✅ Pages légales créées');
                showSuccess('Pages légales créées avec succès ! Elles apparaîtront dans le footer.');
                setProgress('');
              } catch (error) {
                setIsLoading(false);
                showError(`Erreur lors de la création des pages légales : ${error.message}`);
                setProgress('');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Création en cours...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Créer les pages légales</span>
              </>
            )}
          </button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>⚠️ <strong>Attention :</strong> Le bouton principal va remplacer le contenu existant des sections et des paramètres du site.</p>
      </div>

      <FlashMessage message={message} onClose={hideMessage} />
    </div>
  );
};

export default ContentFiller;

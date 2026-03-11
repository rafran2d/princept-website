import { v4 as uuidv4 } from 'uuid';
import apiService from '../services/apiService';

class SectionStoreAPI {
  constructor() {
    this.sections = [];
    this.listeners = [];
    this.initialized = false;
    this.isLoading = false;
    this.error = null;
    
    this.initialize();
  }

  async initialize() {
    try {

      this.isLoading = true;
      this.error = null;
      
      // Vérifier si l'API est accessible
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        await this.loadFromAPI();
      } else {

        await this.initializeDefaultSections();
      }
      
      this.initialized = true;
      this.isLoading = false;
      this.notify();
      

    } catch (error) {

      this.error = error.message;
      this.isLoading = false;
      await this.initializeDefaultSections();
      this.initialized = true;
      this.notify();
    }
  }

  async loadFromAPI() {
    try {

      const apiSections = await apiService.getSections();
      
      // Convertir les sections API au format attendu par l'interface
      this.sections = apiSections.map(section => this.convertFromAPIFormat(section));
      
      if (this.sections.length === 0) {

        await this.initializeDefaultSections();
      }
      

    } catch (error) {

      throw error;
    }
  }

  async initializeDefaultSections() {
    try {

      
      const defaultSections = [
        {
          id: 'hero-default',
          section_type: 'hero',
          section_data: {
            title: 'We Are Princept',
            subtitle: 'Creative & Professional Team',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            buttonText: 'Get Started',
            buttonLink: '#about',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            textColor: '#ffffff',
            backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            navigationMode: 'onepage'
          },
          is_enabled: 1,
          sort_order: 0,
          language_id: 'fr'
        },
        {
          id: 'about-default',
          section_type: 'about',
          section_data: {
            title: 'About Us',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
            features: [
              { id: uuidv4(), title: 'Professional', description: 'We provide professional services', icon: 'Award' },
              { id: uuidv4(), title: 'Responsive', description: 'Perfect on every screen size', icon: 'Smartphone' },
              { id: uuidv4(), title: 'Fast', description: 'Optimized for speed and performance', icon: 'Zap' },
              { id: uuidv4(), title: 'Secure', description: 'Your data is safe with us', icon: 'Shield' }
            ],
            backgroundColor: '#ffffff',
            textColor: '#374151',
            navigationMode: 'onepage'
          },
          is_enabled: 1,
          sort_order: 1,
          language_id: 'fr'
        },
        {
          id: 'services-default',
          section_type: 'services',
          section_data: {
            title: 'Our Services',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            services: [
              { id: uuidv4(), title: 'Web Development', description: 'Modern, responsive websites built with the latest technologies', icon: 'Code' },
              { id: uuidv4(), title: 'UI/UX Design', description: 'Beautiful and intuitive user interfaces that convert', icon: 'Palette' },
              { id: uuidv4(), title: 'SEO Optimization', description: 'Improve your search engine rankings and visibility', icon: 'TrendingUp' },
              { id: uuidv4(), title: 'Technical Support', description: '24/7 technical support for all your needs', icon: 'Headphones' }
            ],
            backgroundColor: '#f8fafc',
            textColor: '#374151',
            navigationMode: 'onepage'
          },
          is_enabled: 1,
          sort_order: 2,
          language_id: 'fr'
        },
        {
          id: 'contact-default',
          section_type: 'contact',
          section_data: {
            title: 'Contact Us',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            email: 'hello@princept.com',
            phone: '+33 1 23 45 67 89',
            address: '123 Rue Princept, 75001 Paris, France',
            backgroundColor: '#ffffff',
            textColor: '#374151',
            navigationMode: 'onepage'
          },
          is_enabled: 1,
          sort_order: 3,
          language_id: 'fr'
        }
      ];

      // Créer les sections par défaut via API si possible
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        for (const section of defaultSections) {
          try {
            await apiService.createSection(section);
          } catch (error) {
            if (!error.message.includes('duplicate') && !error.message.includes('exists')) {

            }
          }
        }
        
        // Recharger depuis l'API
        await this.loadFromAPI();
      } else {
        // Mode dégradé : utiliser les données localement
        this.sections = defaultSections.map(section => ({
          ...section,
          // Convertir le format API vers le format legacy pour compatibilité
          type: section.section_type,
          enabled: section.is_enabled === 1,
          position: section.sort_order,
          ...section.section_data
        }));
      }
      

    } catch (error) {

    }
  }

  // Convertir format legacy vers format API (préserve le format multilingue)
  convertToAPIFormat(sectionData) {
    // Extraire les champs système
    const { id, type, enabled, position, language_id, section_data, ...contentData } = sectionData;

    // Si section_data existe déjà (donnée déjà dans le bon format), l'utiliser directement
    // Sinon, utiliser contentData (format legacy où tout est au niveau racine)
    const finalSectionData = section_data || contentData;

    return {
      id,
      section_type: type || sectionData.section_type,
      section_data: finalSectionData, // Préserver toutes les données de contenu telles quelles (multilingue ou non)
      is_enabled: enabled !== undefined ? (enabled ? 1 : 0) : (sectionData.is_enabled !== undefined ? sectionData.is_enabled : 1),
      sort_order: position !== undefined ? position : (sectionData.sort_order !== undefined ? sectionData.sort_order : 0),
      language_id: language_id || sectionData.language_id || 'fr'
    };
  }

  // Convertir format API vers format legacy
  convertFromAPIFormat(apiSection) {
    return {
      id: apiSection.id,
      type: apiSection.section_type,
      enabled: apiSection.is_enabled === 1,
      position: apiSection.sort_order,
      language_id: apiSection.language_id,
      // Étaler toutes les données de section_data au niveau racine
      ...apiSection.section_data
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.sections, this.isLoading, this.initialized));
  }

  getLoadingState() {
    return {
      isLoading: this.isLoading,
      initialized: this.initialized,
      error: this.error
    };
  }

  getSections() {
    return [...this.sections]
      .sort((a, b) => (a.position || a.sort_order || 0) - (b.position || b.sort_order || 0))
      .map(section => {
        // S'assurer de la compatibilité avec le format legacy
        if (section.section_type) {
          return this.convertFromAPIFormat(section);
        }
        return section;
      });
  }

  getEnabledSections() {
    return this.getSections().filter(section => 
      section.enabled || section.is_enabled === 1
    );
  }

  async addSection(sectionData) {
    try {
      const newSection = {
        id: sectionData.id || uuidv4(),
        section_type: sectionData.type,
        section_data: {
          title: sectionData.title || '',
          description: sectionData.description || '',
          backgroundColor: sectionData.backgroundColor || '#ffffff',
          textColor: sectionData.textColor || '#374151',
          navigationMode: sectionData.navigationMode || 'onepage',
          ...sectionData
        },
        is_enabled: sectionData.enabled !== false ? 1 : 0,
        sort_order: sectionData.position !== undefined ? sectionData.position : this.sections.length,
        language_id: sectionData.language_id || 'fr'
      };

      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        const created = await apiService.createSection(newSection);
        this.sections.push(created);
      } else {
        // Mode dégradé
        const legacySection = this.convertFromAPIFormat(newSection);
        this.sections.push(legacySection);
      }

      this.notify();
      return newSection;
    } catch (error) {

      throw error;
    }
  }

  async updateSection(id, updates) {
    try {


      const isApiAvailable = await apiService.isApiReachable();

      if (isApiAvailable) {
        // Récupérer la section existante pour la merger avec les updates
        const existingSection = this.sections.find(s => s.id === id);
        if (!existingSection) {
          throw new Error(`Section ${id} non trouvée`);
        }

        // Merge profond des section_data si nécessaire
        let mergedSection;
        if (updates.section_data && existingSection.section_data) {
          // Merge profond de section_data pour préserver les champs non modifiés
          mergedSection = {
            ...existingSection,
            ...updates,
            section_data: {
              ...existingSection.section_data,
              ...updates.section_data
            }
          };
        } else {
          // Merge simple pour les autres cas
          mergedSection = { ...existingSection, ...updates };
        }

        const apiData = this.convertToAPIFormat(mergedSection);


        const updated = await apiService.updateSection(id, apiData);
        const index = this.sections.findIndex(section => section.id === id);
        if (index !== -1) {
          // Convertir les données API au format attendu par l'interface
          this.sections[index] = this.convertFromAPIFormat(updated);

        }
      } else {
        // Mode dégradé
        const index = this.sections.findIndex(section => section.id === id);
        if (index !== -1) {
          this.sections[index] = { ...this.sections[index], ...updates };

        }
      }

      this.notify();
    } catch (error) {

      throw error;
    }
  }

  async deleteSection(id) {
    try {
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        await apiService.deleteSection(id);
      }
      
      this.sections = this.sections.filter(section => section.id !== id);
      this.reorderPositions();
      this.notify();
    } catch (error) {

      throw error;
    }
  }

  async toggleSection(id) {
    try {
      const section = this.sections.find(s => s.id === id);
      if (section) {
        // Déterminer l'état actuel correctement
        const currentEnabled = section.enabled || section.is_enabled === 1;
        const newEnabled = !currentEnabled;
        

        
        await this.updateSection(id, { 
          enabled: newEnabled,
          is_enabled: newEnabled ? 1 : 0
        });
      }
    } catch (error) {

      throw error;
    }
  }

  async reorderSections(newOrder) {
    try {
      const promises = newOrder.map((id, index) => {
        return this.updateSection(id, { 
          position: index,
          sort_order: index 
        });
      });
      
      await Promise.all(promises);
      this.notify();
    } catch (error) {

      throw error;
    }
  }

  reorderPositions() {
    this.sections
      .sort((a, b) => (a.position || a.sort_order || 0) - (b.position || b.sort_order || 0))
      .forEach((section, index) => {
        if (section.position !== undefined) {
          section.position = index;
        }
        if (section.sort_order !== undefined) {
          section.sort_order = index;
        }
      });
  }

  getSectionTemplates() {
    return [
      {
        type: 'hero',
        name: 'Hero Section',
        description: 'Section d\'accueil avec titre, sous-titre et bouton d\'action',
        defaultData: {
          title: 'Votre Titre Principal',
          subtitle: 'Votre sous-titre attractif',
          description: 'Description de votre activité ou message principal.',
          buttonText: 'En savoir plus',
          buttonLink: '#about',
          backgroundImage: ''
        }
      },
      {
        type: 'hero-slider',
        name: 'Hero Slider',
        description: 'Section Hero avec carrousel de slides (images, titres, boutons)',
        defaultData: {
          title: { fr: 'Solutions Digitales sur Mesure', en: 'Custom Digital Solutions' },
          subtitle: { fr: 'De l\'idée à la réalisation', en: 'From idea to reality' },
          description: { fr: 'Nous créons des expériences digitales exceptionnelles qui transforment votre présence en ligne', en: 'We create exceptional digital experiences that transform your online presence' },
          buttonText: { fr: 'Découvrir nos services', en: 'Discover our services' },
          buttonLink: '#services',
          secondaryButtonText: { fr: 'En savoir plus', en: 'Learn more' },
          secondaryButtonLink: '#about',
          backgroundImage: null,
          enableAutoPlay: true,
          autoPlayDelay: 5000,
          slides: [
            {
              id: 1,
              title: { fr: 'Solutions Digitales sur Mesure', en: 'Custom Digital Solutions' },
              subtitle: { fr: 'De l\'idée à la réalisation', en: 'From idea to reality' },
              description: { fr: 'Nous créons des expériences digitales exceptionnelles qui transforment votre présence en ligne. Sites web, e-commerce, applications mobiles et solutions IA.', en: 'We create exceptional digital experiences that transform your online presence. Websites, e-commerce, mobile applications and AI solutions.' },
              buttonText: { fr: 'Découvrir nos services', en: 'Discover our services' },
              buttonLink: '#services',
              secondaryButtonText: { fr: 'En savoir plus', en: 'Learn more' },
              secondaryButtonLink: '#about',
              backgroundImage: null
            },
            {
              id: 2,
              title: { fr: 'Développement Web & E-Commerce', en: 'Web Development & E-Commerce' },
              subtitle: { fr: 'Solutions sur mesure', en: 'Custom solutions' },
              description: { fr: 'Conception et développement de sites professionnels, vitrines et e-commerce sur mesure. Design responsive et interfaces UI/UX innovantes.', en: 'Design and development of professional, showcase and custom e-commerce websites. Responsive design and innovative UI/UX interfaces.' },
              buttonText: { fr: 'Voir nos réalisations', en: 'See our work' },
              buttonLink: '#services',
              secondaryButtonText: { fr: 'Nous contacter', en: 'Contact us' },
              secondaryButtonLink: '#contact',
              backgroundImage: null
            },
            {
              id: 3,
              title: { fr: 'Applications Mobiles & Solutions IA', en: 'Mobile Apps & AI Solutions' },
              subtitle: { fr: 'Innovation technologique', en: 'Technological innovation' },
              description: { fr: 'Développement d\'applications mobiles natives et hybrides, intégration d\'IA dans vos processus métier pour optimiser vos opérations.', en: 'Development of native and hybrid mobile applications, AI integration in your business processes to optimize your operations.' },
              buttonText: { fr: 'Découvrir nos solutions', en: 'Discover our solutions' },
              buttonLink: '#services',
              secondaryButtonText: { fr: 'Portfolio', en: 'Portfolio' },
              secondaryButtonLink: '#gallery',
              backgroundImage: null
            }
          ]
        }
      },
      {
        type: 'about',
        name: 'À Propos',
        description: 'Section de présentation avec fonctionnalités',
        defaultData: {
          title: 'À Propos',
          description: 'Présentez votre entreprise et vos valeurs.',
          features: [
            { id: uuidv4(), title: 'Fonctionnalité 1', description: 'Description', icon: 'Star' },
            { id: uuidv4(), title: 'Fonctionnalité 2', description: 'Description', icon: 'Shield' }
          ]
        }
      },
      {
        type: 'services',
        name: 'Services',
        description: 'Grille de services avec icônes',
        defaultData: {
          title: 'Nos Services',
          description: 'Découvrez nos services et expertises.',
          services: [
            { id: uuidv4(), title: 'Service 1', description: 'Description du service', icon: 'Settings' },
            { id: uuidv4(), title: 'Service 2', description: 'Description du service', icon: 'Globe' }
          ]
        }
      },
      {
        type: 'contact',
        name: 'Contact',
        description: 'Section de contact avec informations',
        defaultData: {
          title: 'Contactez-nous',
          description: 'N\'hésitez pas à nous contacter.',
          email: 'contact@example.com',
          phone: '+33 1 23 45 67 89',
          address: '123 Rue Example, 75001 Paris, France'
        }
      },
      {
        type: 'gallery',
        name: 'Galerie',
        description: 'Galerie d\'images avec lightbox',
        defaultData: {
          title: 'Notre Galerie',
          description: 'Découvrez nos réalisations.',
          images: []
        }
      },
      {
        type: 'testimonials',
        name: 'Témoignages',
        description: 'Témoignages clients avec photos',
        defaultData: {
          title: 'Ce que disent nos clients',
          description: 'Témoignages de nos clients satisfaits.',
          testimonials: []
        }
      },
      {
        type: 'cta',
        name: 'Call to Action',
        description: 'Section d\'appel à l\'action',
        defaultData: {
          title: 'Prêt à commencer ?',
          description: 'Rejoignez-nous dès aujourd\'hui.',
          buttonText: 'Commencer',
          buttonLink: '#contact'
        }
      },
      {
        type: 'blog',
        name: 'Blog / Actualités',
        description: 'Section blog avec articles, images et vidéos',
        defaultData: {
          title: 'Nos activités récentes',
          subtitle: '',
          description: 'Suivez nos dernières actions et événements pour rester informé de nos activités.',
          postsPerPage: 6,
          posts: []
        }
      }
    ];
  }

  // Méthodes pour compatibilité et debugging
  getStatus() {
    return {
      initialized: this.initialized,
      isLoading: this.isLoading,
      error: this.error,
      sectionsCount: this.sections.length,
      apiAvailable: apiService.isApiReachable()
    };
  }

  async refresh() {
    this.initialized = false;
    await this.initialize();
  }
}

const sectionStoreAPIInstance = new SectionStoreAPI();
export default sectionStoreAPIInstance;
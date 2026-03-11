import { v4 as uuidv4 } from 'uuid';
import dataStorage from '../utils/dataStorage';

class SectionStore {
  constructor() {
    this.sections = this.loadFromStorage();
    this.listeners = [];
    this.storageKey = 'onepress-sections';
    this.initialized = false;
    this.initializeDefaultSections();
    this.initialized = true;
  }

  initializeDefaultSections() {
    if (this.sections.length === 0) {
      const defaultSections = [
        {
          id: uuidv4(),
          type: 'hero',
          position: 0,
          title: 'We Are Princept',
          subtitle: 'Creative & Professional Team',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          buttonText: 'Get Started',
          buttonLink: '#about',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          textColor: '#ffffff',
          backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
          enabled: true,
          navigationMode: 'onepage' // 'onepage' ou 'newpage'
        },
        {
          id: uuidv4(),
          type: 'about',
          position: 1,
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
          enabled: true,
          navigationMode: 'onepage'
        },
        {
          id: uuidv4(),
          type: 'services',
          position: 2,
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
          enabled: true,
          navigationMode: 'onepage'
        },
        {
          id: uuidv4(),
          type: 'contact',
          position: 3,
          title: 'Contact Us',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          email: 'hello@onepress.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, State 12345',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          enabled: true,
          navigationMode: 'onepage'
        }
      ];

      this.sections = defaultSections;
      this.saveToStorage();
    }
  }

  loadFromStorage() {
    try {
      const sections = dataStorage.loadFromLocalStorage(this.storageKey) || [];

      return sections;
    } catch (error) {

      return [];
    }
  }

  saveToStorage() {
    try {
      dataStorage.saveToLocalStorage(this.storageKey, this.sections);
    } catch (error) {

    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.sections));
  }

  getSections() {
    return [...this.sections].sort((a, b) => a.position - b.position);
  }

  getEnabledSections() {
    return this.getSections().filter(section => section.enabled);
  }

  addSection(sectionData) {
    const newSection = {
      id: uuidv4(),
      position: this.sections.length,
      enabled: true,
      backgroundColor: '#ffffff',
      textColor: '#374151',
      navigationMode: 'onepage',
      ...sectionData
    };

    this.sections.push(newSection);
    this.saveToStorage();
    this.notify();
    return newSection;
  }

  updateSection(id, updates) {
    const index = this.sections.findIndex(section => section.id === id);
    if (index !== -1) {
      this.sections[index] = { ...this.sections[index], ...updates };
      this.saveToStorage();
      this.notify();
    }
  }

  deleteSection(id) {
    this.sections = this.sections.filter(section => section.id !== id);
    this.reorderPositions();
    this.saveToStorage();
    this.notify();
  }

  toggleSection(id) {
    const index = this.sections.findIndex(section => section.id === id);
    if (index !== -1) {
      this.sections[index].enabled = !this.sections[index].enabled;
      this.saveToStorage();
      this.notify();
    }
  }

  reorderSections(newOrder) {
    newOrder.forEach((id, index) => {
      const section = this.sections.find(s => s.id === id);
      if (section) {
        section.position = index;
      }
    });
    this.saveToStorage();
    this.notify();
  }

  reorderPositions() {
    this.sections
      .sort((a, b) => a.position - b.position)
      .forEach((section, index) => {
        section.position = index;
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
      }
    ];
  }
}

const sectionStoreInstance = new SectionStore();
export default sectionStoreInstance;
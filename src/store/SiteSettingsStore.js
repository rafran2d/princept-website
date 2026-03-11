import dataStorage from '../utils/dataStorage';

class SiteSettingsStore {
  constructor() {
    this.settings = {};
    this.listeners = [];
    this.storageKey = 'princept-site-settings';
    this.initialized = false;
    this.initializeStore();
  }

  async initializeStore() {
    await this.loadFromStorage();
    this.initializeDefaultSettings();
    this.initialized = true;
  }

  initializeDefaultSettings() {
    const defaultSettings = {
      siteName: '',
      siteTagline: '',
      siteDescription: '',
      logoUrl: '',
      logoText: '',
      favicon: '/favicon.ico',
      
      // Contact Information
      email: '',
      phone: '',
      address: '',
      officeHours: {
        monday: { open: '09:00', close: '18:00', closed: false, isHoliday: false, holidayName: '', holidayOpen: '', holidayClose: '' },
        tuesday: { open: '09:00', close: '18:00', closed: false, isHoliday: false, holidayName: '', holidayOpen: '', holidayClose: '' },
        wednesday: { open: '09:00', close: '18:00', closed: false, isHoliday: false, holidayName: '', holidayOpen: '', holidayClose: '' },
        thursday: { open: '09:00', close: '18:00', closed: false, isHoliday: false, holidayName: '', holidayOpen: '', holidayClose: '' },
        friday: { open: '09:00', close: '18:00', closed: false, isHoliday: false, holidayName: '', holidayOpen: '', holidayClose: '' },
        saturday: { open: '10:00', close: '16:00', closed: false, isHoliday: false, holidayName: '', holidayOpen: '', holidayClose: '' },
        sunday: { open: '', close: '', closed: true, isHoliday: false, holidayName: '', holidayOpen: '', holidayClose: '' }
      },
      
      // Contact Section Display Options
      showContactEmail: true,
      showContactPhone: true,
      showContactAddress: true,
      showOfficeHours: true,
      
      // Map Configuration
      showMap: false,
      mapLatitude: 48.8566,
      mapLongitude: 2.3522,
      mapZoom: 13,
      mapTitle: 'Notre localisation',
      mapDescription: 'Venez nous rendre visite',
      
      // Social Networks with visibility
      social: {
        facebook: {
          url: '',
          visible: false,
          label: 'Facebook'
        },
        twitter: {
          url: '',
          visible: false,
          label: 'Twitter'
        },
        instagram: {
          url: '',
          visible: false,
          label: 'Instagram'
        },
        linkedin: {
          url: '',
          visible: false,
          label: 'LinkedIn'
        },
        youtube: {
          url: '',
          visible: false,
          label: 'YouTube'
        },
        tiktok: {
          url: '',
          visible: false,
          label: 'TikTok'
        },
        github: {
          url: '',
          visible: false,
          label: 'GitHub'
        }
      },
      
      // Legacy social links (for backward compatibility)
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      
      // Footer
      footerText: '',
      copyrightText: '',
      showSocialLinks: true,
      showQuickLinks: true,
      
      // SEO
      metaKeywords: '',
      metaDescription: '',
      googleAnalytics: '',
      googleSearchConsole: '',
      
      // Theme
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      
      // Email Configuration
      emailConfig: {
        // Type de service email
        provider: 'smtp', // 'smtp', 'mailjet', 'emailjs', ou 'api'
        
        // Configuration SMTP
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        smtpSecure: false,
        
        // Configuration Mailjet
        mailjetApiKey: '',
        mailjetSecretKey: '',
        mailjetSandboxMode: false,
        
        // Configuration EmailJS
        emailjsServiceId: '',
        emailjsTemplateId: '', // Template par défaut (optionnel)
        emailjsPublicKey: '',
        
        // Templates EmailJS multilingues
        emailjsTemplates: {
          contact: {}, // { fr: 'template_fr_contact', en: 'template_en_contact', ar: 'template_ar_contact' }
          contactConfirmation: {} // { fr: 'template_fr_confirm', en: 'template_en_confirm', ar: 'template_ar_confirm' }
        },
        
        // Configuration API Backend
        apiEndpoint: '/api/send-email',
        
        // Configuration commune
        senderEmail: '',
        senderName: '',
        replyToEmail: '',
        templates: {
          contact: {
            subject: 'Nouveau message de contact',
            enabled: true,
            template: `
Nouveau message de contact reçu depuis le site web.

Nom : {{name}}
Email : {{email}}
Téléphone : {{phone}}
Sujet : {{subject}}

Message :
{{message}}

---
Envoyé depuis {{siteName}}
Date : {{date}}
            `.trim()
          },
          contactConfirmation: {
            subject: 'Merci pour votre message',
            enabled: true,
            template: `
Bonjour {{name}},

Merci pour votre message. Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.

Votre message :
{{message}}

Cordialement,
L'équipe {{siteName}}

---
{{siteName}}
{{email}}
{{phone}}
            `.trim()
          },
          newsletter: {
            subject: 'Inscription à la newsletter',
            enabled: false,
            template: `
Nouvelle inscription à la newsletter.

Email : {{email}}
Date : {{date}}

---
Envoyé depuis {{siteName}}
            `.trim()
          }
        }
      }
    };

    // Merge with existing settings, keeping user changes
    this.settings = { ...defaultSettings, ...this.settings };
    
    // Migration: Convert old socialUrls to new social structure
    this.migrateSocialUrls();
    
    // Ensure social object exists and is properly structured
    if (!this.settings.social || typeof this.settings.social !== 'object') {
      this.settings.social = defaultSettings.social;
    } else {
      // Merge each social network to ensure all properties exist
      Object.keys(defaultSettings.social).forEach(network => {
        if (!this.settings.social[network]) {
          this.settings.social[network] = defaultSettings.social[network];
        } else {
          this.settings.social[network] = {
            ...defaultSettings.social[network],
            ...this.settings.social[network]
          };
        }
      });
    }
    
    this.saveToStorage();
  }

  async loadFromStorage() {
    try {
      const settings = await dataStorage.load(this.storageKey) || {};
      this.settings = settings;
      return settings;
    } catch (error) {

      this.settings = {};
      return {};
    }
  }

  async saveToStorage() {
    try {
      await dataStorage.save(this.storageKey, this.settings);
      this.updateFavicon();
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
    this.listeners.forEach(listener => listener(this.settings));
  }

  getSettings() {
    return { ...this.settings };
  }

  async updateSettings(updates) {
    this.settings = { ...this.settings, ...updates };
    await this.saveToStorage();
    this.notify();
  }

  async updateSetting(key, value) {
    this.settings[key] = value;
    await this.saveToStorage();
    this.notify();
  }

  // Migration method to convert old socialUrls structure to new social structure
  migrateSocialUrls() {
    const legacyUrls = {
      facebookUrl: 'facebook',
      twitterUrl: 'twitter', 
      linkedinUrl: 'linkedin',
      instagramUrl: 'instagram'
    };

    let hasMigration = false;

    // Check for legacy URL fields and migrate them
    Object.entries(legacyUrls).forEach(([oldKey, network]) => {
      if (this.settings[oldKey]) {
        if (!this.settings.social) this.settings.social = {};
        if (!this.settings.social[network]) this.settings.social[network] = {};
        
        this.settings.social[network] = {
          ...this.settings.social[network],
          url: this.settings[oldKey],
          visible: true
        };
        
        // Remove old key
        delete this.settings[oldKey];
        hasMigration = true;
      }
    });

    if (hasMigration) {

    }
  }

  // Update favicon dynamically
  updateFavicon() {
    if (this.settings.favicon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = this.settings.favicon;
    }
  }

  // Update document title
  updateTitle() {
    if (this.settings.siteName) {
      document.title = this.settings.siteName;
    }
  }

  // Update meta description
  updateMetaDescription() {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    meta.content = this.settings.metaDescription || this.settings.siteDescription;
  }

  // Update meta keywords
  updateMetaKeywords() {
    let meta = document.querySelector('meta[name="keywords"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'keywords';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    meta.content = this.settings.metaKeywords;
  }

  // Apply all meta updates
  applyMetaUpdates() {
    this.updateTitle();
    this.updateMetaDescription();
    this.updateMetaKeywords();
    this.updateFavicon();
  }

  // Reset to defaults
  async resetToDefaults() {
    this.settings = {};
    this.initializeDefaultSettings();
    await this.saveToStorage();
    this.notify();
  }
}

const siteSettingsStoreInstance = new SiteSettingsStore();

// Apply meta updates on initialization
siteSettingsStoreInstance.applyMetaUpdates();

export default siteSettingsStoreInstance;
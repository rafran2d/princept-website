import apiService from '../services/apiService';

class SiteSettingsStoreAPI {
  constructor() {
    this.settings = {};
    this.listeners = [];
    this.initialized = false;
    this.isLoading = false;
    this.error = null;
    
    this.initialize();
  }

  async initialize() {
    try {
      console.log('🔄 SiteSettingsStoreAPI - Initialisation...');
      this.isLoading = true;
      this.error = null;
      
      // Vérifier si l'API est accessible
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        await this.loadFromAPI();
      } else {
        console.warn('⚠️ API non accessible, utilisation des paramètres par défaut');
        this.initializeDefaultSettings();
      }
      
      this.initialized = true;
      this.isLoading = false;
      this.applyMetaUpdates();
      this.notify();
      
      console.log('✅ SiteSettingsStoreAPI initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation SiteSettingsStoreAPI:', error);
      this.error = error.message;
      this.isLoading = false;
      this.initializeDefaultSettings();
      this.initialized = true;
      this.applyMetaUpdates();
      this.notify();
    }
  }

  async loadFromAPI() {
    try {
      console.log('📡 Chargement paramètres site depuis API...');
      const apiSettings = await apiService.getSiteSettings();
      
      // Debug pour site_title
      if (apiSettings.site_title) {
        console.log('🔍 Chargé depuis API site_title:', apiSettings.site_title);
      }
      
      // Convertir les paramètres API vers le format du store
      this.settings = this.convertFromAPIFormat(apiSettings);
      
      // Debug pour siteName après conversion
      if (this.settings.siteName) {
        console.log('🔍 Après conversion siteName:', this.settings.siteName);
      }
      
      // S'assurer que les paramètres par défaut sont présents
      this.mergeWithDefaults();
      
      // Debug pour siteName après merge
      if (this.settings.siteName) {
        console.log('🔍 Après merge siteName:', this.settings.siteName);
      }
      
      console.log('✅ Paramètres site chargés depuis API');
      
      // Notifier tous les composants des nouveaux paramètres
      this.notify();
    } catch (error) {
      console.error('❌ Erreur chargement API site settings:', error);
      throw error;
    }
  }

  initializeDefaultSettings() {
    const defaultSettings = {
      siteName: 'Princept CMS',
      siteTagline: 'Système de gestion de contenu moderne',
      siteDescription: 'CMS moderne avec haute disponibilité',
      logoUrl: '',
      logoText: 'Princept',
      favicon: '/favicon.ico',
      
      // Contact Information
      email: 'contact@princept.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Rue Princept, 75001 Paris, France',
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
      
      // Contact Section Text Options
      contactFormTitle: 'Contactez-nous',
      officeHoursTitle: 'Horaires d\'ouverture',
      
      // Form Labels
      contactFormNameLabel: 'Nom complet',
      contactFormEmailLabel: 'Adresse email',
      contactFormSubjectLabel: 'Sujet',
      contactFormMessageLabel: 'Message',
      contactFormButtonLabel: 'Envoyer le message',
      
      // Office Hours Text
      officeHoursSubtitle: 'Nos horaires d\'ouverture',
      officeHoursCurrentStatusOpen: 'Nous sommes ouverts jusqu\'à',
      officeHoursCurrentStatusClosed: 'Nous sommes fermés',
      officeHoursCurrentStatusOpening: 'Nous ouvrons à',
      
      // Days of the week (default French values)
      dayMonday: 'Lundi',
      dayTuesday: 'Mardi',
      dayWednesday: 'Mercredi',
      dayThursday: 'Jeudi',
      dayFriday: 'Vendredi',
      daySaturday: 'Samedi',
      daySunday: 'Dimanche',
      
      // Map Configuration
      showMap: false,
      mapLatitude: 48.8566,
      mapLongitude: 2.3522,
      mapZoom: 13,
      mapTitle: '',
      mapDescription: '',
      
      // Social Networks
      social: {
        facebook: { url: '', visible: false, label: 'Facebook' },
        twitter: { url: '', visible: false, label: 'Twitter' },
        instagram: { url: '', visible: false, label: 'Instagram' },
        linkedin: { url: '', visible: false, label: 'LinkedIn' },
        youtube: { url: '', visible: false, label: 'YouTube' },
        tiktok: { url: '', visible: false, label: 'TikTok' },
        github: { url: '', visible: false, label: 'GitHub' }
      },
      
      // Footer
      footerText: 'Propulsé par Princept CMS',
      copyrightText: `© ${new Date().getFullYear()} Princept CMS. Tous droits réservés.`,
      showSocialLinks: true,
      showQuickLinks: true,
      
      // SEO
      metaKeywords: 'cms, react, nodejs, mysql, sqlite',
      metaDescription: 'CMS moderne avec haute disponibilité',
      googleAnalytics: '',
      googleSearchConsole: '',
      
      // Theme
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      
      // Email Configuration
      emailConfig: {
        provider: 'smtp',
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        smtpSecure: false,
        senderEmail: 'contact@princept.com',
        senderName: 'Princept CMS',
        replyToEmail: 'contact@princept.com',
        templates: {
          contact: {
            subject: {
              fr: 'Nouveau message de contact de {{name}}',
              en: 'New contact message from {{name}}'
            },
            template: {
              fr: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
        .message { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #3b82f6; }
        .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Nouveau message de contact</h2>
    </div>
    
    <div class="content">
        <p><strong>Nom :</strong> {{name}}</p>
        <p><strong>Email :</strong> {{email}}</p>
        <p><strong>Sujet :</strong> {{subject}}</p>
        
        <div class="message">
            <h4>Message :</h4>
            <p>{{message}}</p>
        </div>
        
        <p><small>Message reçu le {{date}} à {{time}}</small></p>
    </div>
    
    <div class="footer">
        <p>Ce message a été envoyé depuis votre site web</p>
    </div>
</body>
</html>`,
              en: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
        .message { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #3b82f6; }
        .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Contact Message</h2>
    </div>
    
    <div class="content">
        <p><strong>Name:</strong> {{name}}</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        
        <div class="message">
            <h4>Message:</h4>
            <p>{{message}}</p>
        </div>
        
        <p><small>Message received on {{date}} at {{time}}</small></p>
    </div>
    
    <div class="footer">
        <p>This message was sent from your website</p>
    </div>
</body>
</html>`
            }
          },
          contactConfirmation: {
            subject: {
              fr: 'Confirmation de réception de votre message',
              en: 'Confirmation: Your message has been received'
            },
            template: {
              fr: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de réception</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
        .summary { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #28a745; }
        .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>✓ Message reçu</h2>
    </div>
    
    <div class="content">
        <p>Bonjour <strong>{{name}}</strong>,</p>
        
        <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.</p>
        
        <div class="summary">
            <h4>Résumé de votre message :</h4>
            <p><strong>Sujet :</strong> {{subject}}</p>
            <p><strong>Message :</strong> {{message}}</p>
            <p><strong>Date d'envoi :</strong> {{date}} à {{time}}</p>
        </div>
        
        <p>Notre équipe reviendra vers vous dans les plus brefs délais.</p>
        
        <p>Cordialement,<br>L'équipe Princept</p>
    </div>
    
    <div class="footer">
        <p>Ceci est un message automatique, merci de ne pas y répondre</p>
    </div>
</body>
</html>`,
              en: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
        .summary { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #28a745; }
        .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>✓ Message Received</h2>
    </div>
    
    <div class="content">
        <p>Hello <strong>{{name}}</strong>,</p>
        
        <p>We have received your message and thank you for contacting us.</p>
        
        <div class="summary">
            <h4>Summary of your message:</h4>
            <p><strong>Subject:</strong> {{subject}}</p>
            <p><strong>Message:</strong> {{message}}</p>
            <p><strong>Sent on:</strong> {{date}} at {{time}}</p>
        </div>
        
        <p>Our team will get back to you as soon as possible.</p>
        
        <p>Best regards,<br>The Princept Team</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message, please do not reply</p>
    </div>
</body>
</html>`
            }
          },
          newsletter: {
            subject: {
              fr: 'Nouvelle inscription à la newsletter',
              en: 'New newsletter subscription'
            },
            template: {
              fr: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription newsletter</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8b5cf6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
        .highlight { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #8b5cf6; }
        .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Nouvelle inscription newsletter</h2>
    </div>
    
    <div class="content">
        <p>Une nouvelle personne s'est inscrite à votre newsletter :</p>
        
        <div class="highlight">
            <p><strong>Email :</strong> {{email}}</p>
            <p><strong>Nom :</strong> {{name}}</p>
            <p><strong>Date d'inscription :</strong> {{date}} à {{time}}</p>
        </div>
        
        <p>Total d'abonnés : <strong>{{subscriberCount}}</strong></p>
    </div>
    
    <div class="footer">
        <p>Notification automatique de votre CMS</p>
    </div>
</body>
</html>`,
              en: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter Subscription</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8b5cf6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
        .highlight { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #8b5cf6; }
        .footer { background-color: #6c757d; color: white; padding: 10px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Newsletter Subscription</h2>
    </div>
    
    <div class="content">
        <p>A new person has subscribed to your newsletter:</p>
        
        <div class="highlight">
            <p><strong>Email:</strong> {{email}}</p>
            <p><strong>Name:</strong> {{name}}</p>
            <p><strong>Subscription date:</strong> {{date}} at {{time}}</p>
        </div>
        
        <p>Total subscribers: <strong>{{subscriberCount}}</strong></p>
    </div>
    
    <div class="footer">
        <p>Automatic notification from your CMS</p>
    </div>
</body>
</html>`
            }
          }
        }
      }
    };

    this.settings = defaultSettings;
  }

  mergeWithDefaults() {
    // Créer une copie temporaire des settings actuels
    const currentSettings = { ...this.settings };
    
    // Réinitialiser avec les defaults
    this.initializeDefaultSettings();
    const defaultSettings = this.settings;

    // Fusionner avec les valeurs actuelles par-dessus les defaults
    // IMPORTANT: Préserver explicitement les valeurs false pour les flags d'affichage
    this.settings = { ...defaultSettings, ...currentSettings };
    
    // S'assurer que les flags d'affichage false sont bien préservés (pas écrasés par undefined)
    const displayFlags = ['showContactEmail', 'showContactPhone', 'showContactAddress', 'showOfficeHours', 'showMap', 'showSocialLinks', 'showQuickLinks'];
    displayFlags.forEach(flag => {
      if (currentSettings.hasOwnProperty(flag)) {
        // Si la clé existe dans currentSettings (même si false), on la préserve
        this.settings[flag] = currentSettings[flag];
      }
    });
    
    // Migration spéciale pour les réseaux sociaux
    this.migrateSocialNetworks();
    
    // Migration pour les champs multilingues de contact
    this.migrateContactTextFields();
  }
  
  // Fonction pour créer un objet multilingue avec une valeur par défaut
  createMultilingualObject(defaultValue = '', existingValue = null) {
    // Si on a déjà un objet multilingue, préserver les valeurs existantes
    if (existingValue && typeof existingValue === 'object' && existingValue !== null) {
      // S'assurer que les langues manquantes sont ajoutées sans écraser les existantes
      return {
        fr: existingValue.fr || '',
        en: existingValue.en || ''
      };
    }
    
    // Sinon créer un objet vide (ne pas mettre defaultValue partout)
    return {
      fr: '',
      en: ''
    };
  }
  
  // Migrer les champs textuels de contact vers le format multilingue
  migrateContactTextFields() {
    const contactTextFields = [
      'siteName',
      'siteTagline',
      'siteDescription',
      'logoText',
      'copyrightText',
      'footerText',
      'contactFormTitle',
      'officeHoursTitle', 
      'contactFormNameLabel',
      'contactFormEmailLabel',
      'contactFormSubjectLabel', 
      'contactFormMessageLabel',
      'contactFormButtonLabel',
      'officeHoursSubtitle',
      'officeHoursCurrentStatusOpen',
      'officeHoursCurrentStatusClosed',
      'officeHoursCurrentStatusOpening',
      'mapTitle',
      'mapDescription',
      // Jours de la semaine
      'dayMonday',
      'dayTuesday',
      'dayWednesday',
      'dayThursday',
      'dayFriday',
      'daySaturday',
      'daySunday'
    ];

    // Champs de templates d'email (gestion spéciale pour les nested objects)
    const emailTemplateFields = [
      'emailConfig.templates.contact.subject',
      'emailConfig.templates.contact.template', 
      'emailConfig.templates.contactConfirmation.subject',
      'emailConfig.templates.contactConfirmation.template',
      'emailConfig.templates.newsletter.subject',
      'emailConfig.templates.newsletter.template'
    ];
    
    contactTextFields.forEach(field => {
      if (!this.settings[field]) {
        // Si le champ n'existe pas, créer un objet multilingue vide
        this.settings[field] = this.createMultilingualObject('');
      } else if (typeof this.settings[field] === 'string') {
        // Vérifier si c'est déjà un JSON serialisé (objet multilingue)
        try {
          const parsed = JSON.parse(this.settings[field]);
          if (parsed && typeof parsed === 'object' && (parsed.fr || parsed.en)) {
            // C'est déjà un objet multilingue sérialisé, le garder tel quel mais nettoyer
            this.settings[field] = this.createMultilingualObject('', parsed);
          } else {
            // C'est une simple chaîne, ne pas l'assigner partout - créer un objet vide
            this.settings[field] = this.createMultilingualObject('');
          }
        } catch (e) {
          // Erreur de parsing, c'est une simple chaîne - ne pas l'assigner partout
          this.settings[field] = this.createMultilingualObject('');
        }
      } else if (typeof this.settings[field] === 'object' && this.settings[field] !== null) {
        // Vérifier si c'est déjà un objet multilingue correct
        const keys = Object.keys(this.settings[field]);
        const isValidMultilingualObject = keys.includes('fr') || keys.includes('en');
        const hasOnlyLanguageCodes = keys.every(key => ['fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'ch', 'jp', 'kr'].includes(key));
        
        if (isValidMultilingualObject && hasOnlyLanguageCodes) {
          // C'est déjà un objet multilingue valide, ne pas le toucher
          console.log(`✅ Objet multilingue valide pour ${field}, ignoré`);
          return;
        }
        
        // Vérifier si c'est un objet avec des indices numériques (format corrompu)
        const hasNumericKeys = keys.some(key => !isNaN(key));
        const hasFrKey = keys.includes('fr');
        
        if (hasNumericKeys) {
          console.log(`🔧 Détection corruption extrême pour ${field}:`, this.settings[field]);
          
          // Cas 1: Corruption avec clé 'fr' vide - préserver les autres langues
          if (hasFrKey && this.settings[field].fr === '') {
            console.log(`🔧 Réinitialisation ${field} à vide (fr vide détecté)`);
            this.settings[field] = this.createMultilingualObject('', this.settings[field]);
          }
          // Cas 2: Format doublement corrompu détecté
          else if (keys.length > 50) {
            console.log(`🔧 Corruption extrême détectée pour ${field} (${keys.length} clés), réinitialisation`);
            this.settings[field] = this.createMultilingualObject('');
          }
          // Cas 3: Format corrompu normal avec valeur 'fr' - préserver les autres langues
          else if (hasFrKey && this.settings[field].fr) {
            console.log(`🔧 Correction format corrompu pour ${field}, préservation valeurs existantes`);
            this.settings[field] = this.createMultilingualObject('', this.settings[field]);
          }
          // Cas 4: Reconstruction depuis indices numériques
          else if (!hasFrKey) {
            const reconstructed = keys
              .filter(key => !isNaN(key))
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map(key => this.settings[field][key])
              .join('');
            // Créer un objet avec la valeur reconstruite en français seulement
            this.settings[field] = { fr: reconstructed, en: '' };
            console.log(`🔧 Reconstruction depuis indices pour ${field}:`, reconstructed);
          }
          // Cas 5: Autres corruptions - réinitialiser
          else {
            console.log(`🔧 Corruption non reconnue pour ${field}, réinitialisation`);
            this.settings[field] = this.createMultilingualObject('');
          }
        }
      }
      // Si c'est déjà un objet multilingue correct, ne rien faire
    });

    // Migrer les templates d'email vers le format multilingue
    emailTemplateFields.forEach(fieldPath => {
      const keys = fieldPath.split('.');
      let current = this.settings;
      
      // Naviguer jusqu'au parent
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      const finalKey = keys[keys.length - 1];
      const currentValue = current[finalKey];
      
      if (typeof currentValue === 'string') {
        // Convertir la chaîne en objet multilingue
        current[finalKey] = this.createMultilingualObject(currentValue);
        console.log(`🔧 Migration template email ${fieldPath} vers multilingue`);
      } else if (!currentValue) {
        // Créer un objet multilingue vide si n'existe pas
        current[finalKey] = this.createMultilingualObject('');
      }
    });

    // Vérifier et créer les champs manquants en base
    this.ensureMapFieldsExist();
  }

  async ensureMapFieldsExist() {
    try {
      console.log('🔍 Vérification existence champs carte en base...');
      
      const isApiAvailable = await apiService.isApiReachable();
      if (!isApiAvailable) {
        console.log('⚠️ API non accessible, impossible de créer les champs');
        return;
      }

      // Vérifier si les champs existent déjà
      const currentSettings = await apiService.getSiteSettings();
      
      const fieldsToCreate = [];
      if (!currentSettings.mapTitle) {
        fieldsToCreate.push(['mapTitle', this.createMultilingualObject('')]);
      }
      if (!currentSettings.mapDescription) {
        fieldsToCreate.push(['mapDescription', this.createMultilingualObject('')]);
      }

      if (fieldsToCreate.length > 0) {
        console.log(`🔧 Création de ${fieldsToCreate.length} champs carte manquants...`);
        
        for (const [key, value] of fieldsToCreate) {
          await apiService.setSiteSetting(key, JSON.stringify(value), 'json');
          console.log(`✅ Champ ${key} créé en base`);
        }
        
        console.log('✅ Tous les champs carte sont maintenant en base');
      } else {
        console.log('✅ Champs carte déjà présents en base');
      }
      
    } catch (error) {
      console.error('❌ Erreur création champs carte:', error);
    }
  }

  migrateSocialNetworks() {
    if (!this.settings.social) {
      return;
    }

    // Vérifier et corriger les réseaux sociaux
    Object.keys(this.settings.social).forEach(network => {
      const socialData = this.settings.social[network];
      
      // Si c'est une chaîne simple, convertir en objet
      if (typeof socialData === 'string') {
        console.log(`🔄 Migration réseau social ${network}: "${socialData}" -> objet`);
        this.settings.social[network] = {
          url: socialData,
          visible: socialData.length > 0, // Visible si URL existe
          label: network.charAt(0).toUpperCase() + network.slice(1)
        };
      } 
      // Si c'est un objet mais sans structure complète
      else if (typeof socialData === 'object' && socialData !== null) {
        if (!socialData.hasOwnProperty('visible')) {
          this.settings.social[network].visible = false;
        }
        if (!socialData.hasOwnProperty('label')) {
          this.settings.social[network].label = network.charAt(0).toUpperCase() + network.slice(1);
        }
        if (!socialData.hasOwnProperty('url')) {
          this.settings.social[network].url = '';
        }
      }
    });
  }

  // Convertir format API vers format du store
  convertFromAPIFormat(apiSettings) {
    const converted = {};
    
    // Mapping des clés API vers les clés du store
    const keyMapping = {
      'site_title': 'siteName',
      'site_description': 'siteDescription',
      'site_tagline': 'siteTagline',
      'contact_phone': 'phone',
      'contact_address': 'address',
      'social_links': 'social',
      'seo_settings': 'seoSettings',
      'email_config': 'emailConfig',
      'primary_color': 'primaryColor',
      'secondary_color': 'secondaryColor'
    };

    // Appliquer le mapping
    Object.entries(apiSettings).forEach(([key, value]) => {
      const mappedKey = keyMapping[key] || key;
      
      // Debug pour détecter les conflits sur siteName
      if (mappedKey === 'siteName' || key === 'siteName') {
        console.log('🔍 Traitement clé qui affecte siteName:', { key, mappedKey, value });
      }
      
      // Éviter les doublons : si une clé est déjà mappée, ignorer la clé directe
      if (key === 'siteName' && apiSettings.site_title) {
        console.log('🚫 Ignoré siteName direct car site_title existe');
        return;
      }
      if (key === 'siteDescription' && apiSettings.site_description) {
        console.log('🚫 Ignoré siteDescription direct car site_description existe');
        return;
      }
      if (key === 'siteTagline' && apiSettings.site_tagline) {
        console.log('🚫 Ignoré siteTagline direct car site_tagline existe');
        return;
      }
      
      // Cas spécial pour contact_email: garder les deux clés
      if (key === 'contact_email') {
        // Parser le JSON si c'est une string
        let parsedValue = value;
        if (typeof value === 'string') {
          try {
            parsedValue = JSON.parse(value);
          } catch {
            parsedValue = value;
          }
        }
        converted['contact_email'] = parsedValue;  // Clé originale pour le service email
        converted['email'] = parsedValue.config?.senderEmail || parsedValue.senderEmail || value;  // Clé mappée pour compatibilité
        return;
      }
      
      // Cas spécial pour office_hours: parser le JSON et créer officeHours
      if (key === 'office_hours') {
        try {
          const parsedOfficeHours = typeof value === 'string' ? JSON.parse(value) : value;
          converted['office_hours'] = value;  // Garder l'original
          converted['officeHours'] = parsedOfficeHours;  // Version objet pour l'interface
          return;
        } catch (error) {
          console.error('❌ Erreur parsing office_hours:', error);
          converted[mappedKey] = value;
          return;
        }
      }
      
      // Parser les objets JSON - inclure les champs multilingues
      if (typeof value === 'string' && (
        key.includes('_settings') || 
        key.includes('_config') || 
        key.includes('_links') ||
        key === 'site_title' ||
        key === 'site_description' ||
        key === 'site_tagline' ||
        key === 'copyright_text' ||
        key === 'footer_text' ||
        key === 'logo_text' ||
        key.startsWith('contact_form_') ||
        key.startsWith('office_hours_') ||
        key.startsWith('map_') ||
        key.startsWith('day')
      )) {
        try {
          const parsed = JSON.parse(value);
          // Debug pour siteName
          if (key === 'site_title') {
            console.log('🔍 Parsing site_title:', { original: value, parsed });
          }
          // Vérifier si c'est bien un objet multilingue
          if (parsed && typeof parsed === 'object' && (parsed.fr || parsed.en || Object.keys(parsed).length > 0)) {
            converted[mappedKey] = parsed;
            if (key === 'site_title') {
              console.log('🔍 Assigné siteName:', converted[mappedKey]);
            }
          } else {
            converted[mappedKey] = value;
          }
        } catch {
          converted[mappedKey] = value;
        }
      } else {
        converted[mappedKey] = value;
      }
    });

    return converted;
  }

  // Convertir format du store vers format API
  convertToAPIFormat(storeSettings) {
    const converted = {};
    
    // Mapping inverse
    const keyMapping = {
      'siteName': 'site_title',
      'siteDescription': 'site_description', 
      'siteTagline': 'site_tagline',
      'email': 'contact_email',
      'phone': 'contact_phone',
      'address': 'contact_address',
      'social': 'social_links',
      'primaryColor': 'primary_color',
      'secondaryColor': 'secondary_color'
    };

    // Paramètres complexes à traiter spécialement
    const complexSettings = {
      'emailConfig': 'email_config',
      'officeHours': 'office_hours',
      'seoSettings': 'seo_settings'
    };

    Object.entries(storeSettings).forEach(([key, value]) => {
      const mappedKey = keyMapping[key] || complexSettings[key] || key;
      
      // Cas spécial pour contact_email: garder la clé directement
      if (key === 'contact_email') {
        // Convertir l'objet en JSON
        if (typeof value === 'object' && value !== null) {
          converted['contact_email'] = JSON.stringify(value);
        } else {
          converted['contact_email'] = value;
        }
        return;
      }
      
      // Convertir les objets complexes en JSON
      if (typeof value === 'object' && value !== null) {
        converted[mappedKey] = JSON.stringify(value);
      } else {
        converted[mappedKey] = value;
      }
    });

    return converted;
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
    try {
      const newSettings = { ...this.settings, ...updates };
      
      // Debug pour siteName
      if (updates.siteName) {
        console.log('🔍 Mise à jour siteName:', updates.siteName);
      }
      
      // Synchroniser officeHours avec office_hours (format legacy)
      if (updates.officeHours) {
        newSettings.office_hours = JSON.stringify(updates.officeHours);
      }
      
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        // Convertir et sauvegarder via API
        const apiFormat = this.convertToAPIFormat(newSettings);
        
        // Debug pour site_title
        if (apiFormat.site_title) {
          console.log('🔍 Conversion API site_title:', apiFormat.site_title);
        }
        
        // Sauvegarder les paramètres un par un pour éviter les erreurs de taille
        const promises = Object.entries(apiFormat).map(async ([key, value]) => {
          try {
            const type = typeof value === 'object' ? 'json' : 
                         typeof value === 'boolean' ? 'boolean' :
                         typeof value === 'number' ? 'number' : 'string';
            
            // Debug spécial pour site_title
            if (key === 'site_title') {
              console.log('💾 Sauvegarde site_title:', { key, value, type });
            }
            
            // Gérer spécialement les images base64 très longues
            if (key === 'logoUrl' && typeof value === 'string' && value.startsWith('data:image/')) {
              console.log('💾 Sauvegarde logo base64 (taille:', Math.round(value.length / 1024), 'KB)');
            }
            
            return await apiService.setSiteSetting(key, value, type);
          } catch (error) {
            console.error(`❌ Erreur sauvegarde ${key}:`, error.message);
            throw new Error(`Erreur sauvegarde ${key}: ${error.message}`);
          }
        });
        
        await Promise.all(promises);
      }
      
      // Mettre à jour localement
      this.settings = newSettings;
      this.applyMetaUpdates();
      this.notify();
    } catch (error) {
      console.error('❌ Erreur mise à jour paramètres site:', error);
      throw error;
    }
  }

  // Mise à jour locale uniquement (sans sauvegarde automatique)
  updateSettingsLocal(updates) {
    try {
      const newSettings = { ...this.settings, ...updates };
      
      // Synchroniser officeHours avec office_hours (format legacy)
      if (updates.officeHours) {
        newSettings.office_hours = JSON.stringify(updates.officeHours);
      }
      
      // Mettre à jour localement seulement
      this.settings = newSettings;
      this.notify();
      
      console.log('📝 Mise à jour locale:', Object.keys(updates).join(', '));
    } catch (error) {
      console.error('❌ Erreur mise à jour locale:', error);
      throw error;
    }
  }

  // Sauvegarder tous les paramètres vers l'API
  async saveAllSettings() {
    try {
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        // Convertir et sauvegarder via API
        const apiFormat = this.convertToAPIFormat(this.settings);
        
        // Sauvegarder les paramètres un par un pour éviter les erreurs de taille
        const promises = Object.entries(apiFormat).map(async ([key, value]) => {
          try {
            const type = typeof value === 'object' ? 'json' : 
                         typeof value === 'boolean' ? 'boolean' :
                         typeof value === 'number' ? 'number' : 'string';
            
            // Gérer spécialement les images base64 très longues
            if (key === 'logoUrl' && typeof value === 'string' && value.startsWith('data:image/')) {
              console.log('💾 Sauvegarde logo base64 (taille:', Math.round(value.length / 1024), 'KB)');
            }
            
            return await apiService.setSiteSetting(key, value, type);
          } catch (error) {
            console.error(`❌ Erreur sauvegarde ${key}:`, error.message);
            throw new Error(`Erreur sauvegarde ${key}: ${error.message}`);
          }
        });
        
        await Promise.all(promises);
        console.log('✅ Tous les paramètres sauvegardés avec succès');
      } else {
        throw new Error('API non disponible');
      }
      
      // Appliquer les meta updates après sauvegarde
      this.applyMetaUpdates();
      
      // Recharger depuis l'API pour s'assurer que tout est synchronisé
      await this.loadFromAPI();
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde complète:', error);
      throw error;
    }
  }

  async updateSetting(key, value) {
    try {
      const updates = { [key]: value };
      await this.updateSettings(updates);
    } catch (error) {
      console.error('❌ Erreur mise à jour paramètre:', error);
      throw error;
    }
  }

  // Migration des anciennes URLs sociales
  migrateSocialUrls() {
    const legacyUrls = {
      facebookUrl: 'facebook',
      twitterUrl: 'twitter',
      linkedinUrl: 'linkedin',
      instagramUrl: 'instagram'
    };

    let hasMigration = false;

    Object.entries(legacyUrls).forEach(([oldKey, network]) => {
      if (this.settings[oldKey]) {
        if (!this.settings.social) this.settings.social = {};
        if (!this.settings.social[network]) this.settings.social[network] = {};
        
        this.settings.social[network] = {
          ...this.settings.social[network],
          url: this.settings[oldKey],
          visible: true
        };
        
        delete this.settings[oldKey];
        hasMigration = true;
      }
    });

    if (hasMigration) {
      console.log('✅ URLs sociales migrées vers la nouvelle structure');
      this.updateSettings(this.settings);
    }
  }

  // Mettre à jour le favicon
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

  // Mettre à jour le titre du document
  updateTitle() {
    if (this.settings.siteName) {
      const title = this.getMultilingualValue(this.settings.siteName);
      document.title = title || 'Princept CMS';
    }
  }

  // Fonction utilitaire pour extraire la valeur multilingue
  getMultilingualValue(value, fallbackLanguage = null) {
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'object' && value !== null) {
      // Essayer d'abord de détecter la langue depuis l'URL ou le localStorage
      let currentLang = fallbackLanguage || this.detectCurrentLanguage();
      
      // Essayer la langue courante, puis français, puis anglais, puis la première valeur disponible
      return value[currentLang] || value['fr'] || value['en'] || Object.values(value)[0] || '';
    }
    
    return '';
  }

  // Détecter la langue actuelle depuis l'URL ou localStorage
  detectCurrentLanguage() {
    // Essayer de détecter depuis l'URL (format /en/page ou ?lang=en)
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const langFromPath = path.split('/')[1];
      if (langFromPath && ['fr', 'en', 'es', 'de', 'it'].includes(langFromPath)) {
        return langFromPath;
      }
      
      // Essayer depuis les paramètres URL
      const urlParams = new URLSearchParams(window.location.search);
      const langFromQuery = urlParams.get('lang');
      if (langFromQuery) {
        return langFromQuery;
      }
    }
    
    // Fallback vers français
    return 'fr';
  }

  // Mettre à jour la meta description
  updateMetaDescription() {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    
    const metaDesc = this.getMultilingualValue(this.settings.metaDescription) || 
                     this.getMultilingualValue(this.settings.siteDescription) || 
                     'CMS moderne avec haute disponibilité';
    meta.content = metaDesc;
  }

  // Mettre à jour les meta keywords
  updateMetaKeywords() {
    let meta = document.querySelector('meta[name="keywords"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'keywords';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    meta.content = this.settings.metaKeywords;
  }

  // Appliquer toutes les mises à jour meta
  applyMetaUpdates() {
    if (typeof document !== 'undefined') {
      this.updateTitle();
      this.updateMetaDescription();
      this.updateMetaKeywords();
      this.updateFavicon();
    }
  }

  // Réinitialiser aux valeurs par défaut
  async resetToDefaults() {
    try {
      this.initializeDefaultSettings();
      
      const isApiAvailable = await apiService.isApiReachable();
      if (isApiAvailable) {
        const apiFormat = this.convertToAPIFormat(this.settings);
        await apiService.setSiteSettings(apiFormat);
      }
      
      this.applyMetaUpdates();
      this.notify();
    } catch (error) {
      console.error('❌ Erreur reset paramètres:', error);
      throw error;
    }
  }

  // Méthodes pour le debugging et la compatibilité
  getStatus() {
    return {
      initialized: this.initialized,
      isLoading: this.isLoading,
      error: this.error,
      settingsCount: Object.keys(this.settings).length,
      apiAvailable: apiService.isApiReachable()
    };
  }

  async refresh() {
    this.initialized = false;
    await this.initialize();
  }

  // Migrer depuis localStorage vers API (pour la migration complète)
  async migrateFromLocalStorage() {
    try {
      console.log('🔄 Migration site settings localStorage -> API...');
      
      const localStorageKey = 'princept-site-settings';
      const localData = localStorage.getItem(localStorageKey);
      
      if (localData) {
        const parsedData = JSON.parse(localData);
        console.log('📦 Données localStorage trouvées:', Object.keys(parsedData).length, 'paramètres');
        
        // Mettre à jour via API
        await this.updateSettings(parsedData);
        
        console.log('✅ Migration site settings terminée');
        return true;
      } else {
        console.log('ℹ️ Aucune donnée localStorage à migrer');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur migration site settings:', error);
      return false;
    }
  }
}

const siteSettingsStoreAPIInstance = new SiteSettingsStoreAPI();

export default siteSettingsStoreAPIInstance;
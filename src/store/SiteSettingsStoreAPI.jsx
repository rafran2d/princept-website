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

      this.isLoading = true;
      this.error = null;
      
      // Vérifier si l'API est accessible
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        await this.loadFromAPI();
      } else {

        this.initializeDefaultSettings();
      }
      
      this.initialized = true;
      this.isLoading = false;
      this.applyMetaUpdates();
      this.notify();
      

    } catch (error) {

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

      const apiSettings = await apiService.getSiteSettings();
      


      
      // Convertir les paramètres API vers le format du store
      this.settings = this.convertFromAPIFormat(apiSettings);
      


      
      // S'assurer que les paramètres par défaut sont présents
      this.mergeWithDefaults();
      


      

      
      // Notifier tous les composants des nouveaux paramètres
      this.notify();
    } catch (error) {

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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 24px; background: #f3f4f6; }
        .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #fff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.025em; }
        .header p { margin: 6px 0 0; font-size: 0.875rem; opacity: 0.9; }
        .content { padding: 28px 24px; }
        .row { display: table; width: 100%; margin-bottom: 12px; font-size: 0.9375rem; }
        .label { display: table-cell; width: 100px; color: #6b7280; font-weight: 500; vertical-align: top; }
        .value { display: table-cell; color: #1f2937; }
        .message-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #4f46e5; }
        .message-box h3 { margin: 0 0 8px; font-size: 0.875rem; font-weight: 600; color: #374151; }
        .message-box p { margin: 0; color: #4b5563; white-space: pre-wrap; word-break: break-word; }
        .meta { font-size: 0.8125rem; color: #9ca3af; margin-top: 20px; }
        .footer { background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 0.75rem; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>Nouveau message de contact</h1>
            <p>Un visiteur vous a envoyé un message depuis votre site</p>
        </div>
        <div class="content">
            <div class="row"><span class="label">Nom</span><span class="value">{{name}}</span></div>
            <div class="row"><span class="label">Email</span><span class="value"><a href="mailto:{{email}}" style="color:#4f46e5;text-decoration:none">{{email}}</a></span></div>
            <div class="row"><span class="label">Sujet</span><span class="value">{{subject}}</span></div>
            <div class="message-box">
                <h3>Message</h3>
                <p>{{message}}</p>
            </div>
            <p class="meta">Reçu le {{date}} à {{time}}</p>
        </div>
        <div class="footer">Message envoyé depuis le formulaire de contact de votre site</div>
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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 24px; background: #f3f4f6; }
        .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #fff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.025em; }
        .header p { margin: 6px 0 0; font-size: 0.875rem; opacity: 0.9; }
        .content { padding: 28px 24px; }
        .row { display: table; width: 100%; margin-bottom: 12px; font-size: 0.9375rem; }
        .label { display: table-cell; width: 100px; color: #6b7280; font-weight: 500; vertical-align: top; }
        .value { display: table-cell; color: #1f2937; }
        .message-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #4f46e5; }
        .message-box h3 { margin: 0 0 8px; font-size: 0.875rem; font-weight: 600; color: #374151; }
        .message-box p { margin: 0; color: #4b5563; white-space: pre-wrap; word-break: break-word; }
        .meta { font-size: 0.8125rem; color: #9ca3af; margin-top: 20px; }
        .footer { background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 0.75rem; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>New contact message</h1>
            <p>A visitor has sent you a message from your website</p>
        </div>
        <div class="content">
            <div class="row"><span class="label">Name</span><span class="value">{{name}}</span></div>
            <div class="row"><span class="label">Email</span><span class="value"><a href="mailto:{{email}}" style="color:#4f46e5;text-decoration:none">{{email}}</a></span></div>
            <div class="row"><span class="label">Subject</span><span class="value">{{subject}}</span></div>
            <div class="message-box">
                <h3>Message</h3>
                <p>{{message}}</p>
            </div>
            <p class="meta">Received on {{date}} at {{time}}</p>
        </div>
        <div class="footer">Message sent from your website contact form</div>
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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 24px; background: #f3f4f6; }
        .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #fff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.025em; }
        .header .icon { font-size: 1.75rem; margin-right: 8px; }
        .content { padding: 28px 24px; }
        .content p { margin: 0 0 14px; font-size: 0.9375rem; color: #4b5563; }
        .content p:last-of-type { margin-bottom: 0; }
        .summary { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px; margin: 22px 0; }
        .summary h3 { margin: 0 0 12px; font-size: 0.875rem; font-weight: 600; color: #166534; }
        .summary p { margin: 4px 0; font-size: 0.875rem; color: #15803d; }
        .signature { margin-top: 24px; font-size: 0.9375rem; color: #374151; }
        .footer { background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 0.75rem; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1><span class="icon">✓</span> Message bien reçu</h1>
        </div>
        <div class="content">
            <p>Bonjour <strong>{{name}}</strong>,</p>
            <p>Nous avons bien reçu votre message et vous remercions de nous avoir contactés.</p>
            <div class="summary">
                <h3>Résumé de votre message</h3>
                <p><strong>Sujet :</strong> {{subject}}</p>
                <p><strong>Message :</strong> {{message}}</p>
                <p><strong>Envoyé le :</strong> {{date}} à {{time}}</p>
            </div>
            <p>Notre équipe reviendra vers vous dans les plus brefs délais.</p>
            <p class="signature">Cordialement,<br><strong>L'équipe {{siteName}}</strong></p>
        </div>
        <div class="footer">Ceci est un message automatique, merci de ne pas y répondre.</div>
    </div>
</body>
</html>`,
              en: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message confirmation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 24px; background: #f3f4f6; }
        .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #fff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.025em; }
        .header .icon { font-size: 1.75rem; margin-right: 8px; }
        .content { padding: 28px 24px; }
        .content p { margin: 0 0 14px; font-size: 0.9375rem; color: #4b5563; }
        .content p:last-of-type { margin-bottom: 0; }
        .summary { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px; margin: 22px 0; }
        .summary h3 { margin: 0 0 12px; font-size: 0.875rem; font-weight: 600; color: #166534; }
        .summary p { margin: 4px 0; font-size: 0.875rem; color: #15803d; }
        .signature { margin-top: 24px; font-size: 0.9375rem; color: #374151; }
        .footer { background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 0.75rem; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1><span class="icon">✓</span> Message received</h1>
        </div>
        <div class="content">
            <p>Hello <strong>{{name}}</strong>,</p>
            <p>We have received your message and thank you for contacting us.</p>
            <div class="summary">
                <h3>Summary of your message</h3>
                <p><strong>Subject:</strong> {{subject}}</p>
                <p><strong>Message:</strong> {{message}}</p>
                <p><strong>Sent on:</strong> {{date}} at {{time}}</p>
            </div>
            <p>Our team will get back to you as soon as possible.</p>
            <p class="signature">Best regards,<br><strong>The {{siteName}} team</strong></p>
        </div>
        <div class="footer">This is an automated message, please do not reply.</div>
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

          return;
        }
        
        // Vérifier si c'est un objet avec des indices numériques (format corrompu)
        const hasNumericKeys = keys.some(key => !isNaN(key));
        const hasFrKey = keys.includes('fr');
        
        if (hasNumericKeys) {

          
          // Cas 1: Corruption avec clé 'fr' vide - préserver les autres langues
          if (hasFrKey && this.settings[field].fr === '') {

            this.settings[field] = this.createMultilingualObject('', this.settings[field]);
          }
          // Cas 2: Format doublement corrompu détecté
          else if (keys.length > 50) {

            this.settings[field] = this.createMultilingualObject('');
          }
          // Cas 3: Format corrompu normal avec valeur 'fr' - préserver les autres langues
          else if (hasFrKey && this.settings[field].fr) {

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

          }
          // Cas 5: Autres corruptions - réinitialiser
          else {

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

      
      const isApiAvailable = await apiService.isApiReachable();
      if (!isApiAvailable) {

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

        
        for (const [key, value] of fieldsToCreate) {
          await apiService.setSiteSetting(key, JSON.stringify(value), 'json');

        }
        

      } else {

      }
      
    } catch (error) {

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
      


      
      // Éviter les doublons : si une clé est déjà mappée, ignorer la clé directe
      if (key === 'siteName' && apiSettings.site_title) {
        return;
      }
      if (key === 'siteDescription' && apiSettings.site_description) {
        return;
      }
      if (key === 'siteTagline' && apiSettings.site_tagline) {
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


          // Vérifier si c'est bien un objet multilingue
          if (parsed && typeof parsed === 'object' && (parsed.fr || parsed.en || Object.keys(parsed).length > 0)) {
            converted[mappedKey] = parsed;


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
      


      
      // Synchroniser officeHours avec office_hours (format legacy)
      if (updates.officeHours) {
        newSettings.office_hours = JSON.stringify(updates.officeHours);
      }
      
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        // Convertir et sauvegarder via API en une seule requête (évite le rate limiting)
        const apiFormat = this.convertToAPIFormat(newSettings);
        await apiService.setSiteSettingsBulk(apiFormat);
      }

      // Mettre à jour localement
      this.settings = newSettings;
      this.applyMetaUpdates();
      this.notify();
    } catch (error) {

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
      

    } catch (error) {

      throw error;
    }
  }

  // Sauvegarder tous les paramètres vers l'API
  async saveAllSettings() {
    try {
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        // Convertir et sauvegarder via API en une seule requête (évite le rate limiting)
        const apiFormat = this.convertToAPIFormat(this.settings);
        await apiService.setSiteSettingsBulk(apiFormat);
      } else {
        throw new Error('API non disponible');
      }
      
      // Appliquer les meta updates après sauvegarde
      this.applyMetaUpdates();
      
      // Recharger depuis l'API pour s'assurer que tout est synchronisé
      await this.loadFromAPI();
      
    } catch (error) {

      throw error;
    }
  }

  async updateSetting(key, value) {
    try {
      const updates = { [key]: value };
      await this.updateSettings(updates);
    } catch (error) {

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
        await apiService.setSiteSettingsBulk(apiFormat);
      }

      this.applyMetaUpdates();
      this.notify();
    } catch (error) {

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

      
      const localStorageKey = 'princept-site-settings';
      const localData = localStorage.getItem(localStorageKey);
      
      if (localData) {
        const parsedData = JSON.parse(localData);

        
        // Mettre à jour via API
        await this.updateSettings(parsedData);
        

        return true;
      } else {

        return false;
      }
    } catch (error) {

      return false;
    }
  }
}

const siteSettingsStoreAPIInstance = new SiteSettingsStoreAPI();

export default siteSettingsStoreAPIInstance;
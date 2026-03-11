import apiConfig, { API_ENDPOINTS } from '../config/api.js';

// Service d'envoi email unifié utilisant le backend pour tous les providers
// Compatible avec la configuration des EmailProviderSettings

class UnifiedEmailService {
  constructor() {
    this.apiConfig = apiConfig;
  }

  // Envoie un email via le backend unifié
  async sendEmail(providerConfig, emailData, type = 'contact') {
    const providerName = (providerConfig.providerId || providerConfig.provider || 'UNKNOWN').toUpperCase();
    
    try {
      // Construire le payload selon le provider
      const payload = this.buildPayload(providerConfig, emailData, type);

      const response = await fetch(this.apiConfig.getURL(API_ENDPOINTS.SEND_EMAIL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(`API Error (${response.status}): ${errorData.error || errorData.details || response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        messageId: result.messageId,
        message: result.message,
        provider: result.provider,
        response: result
      };

    } catch (error) {
      throw new Error(`Échec ${providerConfig.providerName || providerName}: ${error.message}`);
    }
  }

  // Construit le payload selon le provider sélectionné
  buildPayload(providerConfig, emailData, type) {
    // Pour la structure Mailjet: { provider: "mailjet", finalConfig: {...} }
    const provider = providerConfig.provider || providerConfig.providerId || providerConfig.finalConfig?.providerId;
    
    const basePayload = {
      provider: provider,
      email: {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html || emailData.text.replace(/\n/g, '<br>'),
        replyTo: emailData.replyTo,
        toName: emailData.toName || ''
      },
      type: type
    };

    // Configuration spécifique selon le provider
    const configData = providerConfig.finalConfig || providerConfig.config || providerConfig;
    switch (provider) {
      case 'mailjet':
        basePayload.config = {
          apiKey: configData.apiKey,
          secretKey: configData.secretKey,
          sandboxMode: configData.sandboxMode || false
        };
        break;

      case 'sendgrid':
        basePayload.config = {
          apiKey: configData.apiKey,
          senderEmail: configData.senderEmail,
          senderName: configData.senderName,
          replyTo: configData.replyTo
        };
        break;

      case 'mailgun':
        basePayload.config = {
          apiKey: configData.apiKey,
          domain: configData.domain,
          senderEmail: configData.senderEmail,
          senderName: configData.senderName,
          replyTo: configData.replyTo
        };
        break;

      case 'amazonses':
        basePayload.config = {
          region: configData.region || 'us-east-1',
          accessKeyId: configData.accessKeyId,
          secretAccessKey: configData.secretAccessKey,
          senderEmail: configData.senderEmail,
          senderName: configData.senderName,
          replyTo: configData.replyTo
        };
        break;

      case 'postmark':
        basePayload.config = {
          apiKey: configData.apiKey,
          senderEmail: configData.senderEmail,
          senderName: configData.senderName,
          replyTo: configData.replyTo
        };
        break;

      case 'gmail':
        basePayload.config = {
          username: providerConfig.username,
          password: providerConfig.password,
          senderName: providerConfig.senderName,
          senderEmail: providerConfig.senderEmail || providerConfig.username,
          replyTo: providerConfig.replyTo
        };
        break;

      case 'outlook':
        basePayload.config = {
          username: providerConfig.username,
          password: providerConfig.password,
          senderName: providerConfig.senderName,
          senderEmail: providerConfig.senderEmail || providerConfig.username,
          replyTo: providerConfig.replyTo
        };
        break;

      case 'smtp':
      case 'smtpCustom':
        basePayload.config = {
          host: providerConfig.smtpHost || providerConfig.host,
          port: providerConfig.smtpPort || providerConfig.port,
          secure: providerConfig.smtpSecure || providerConfig.secure,
          username: providerConfig.smtpUser || providerConfig.username,
          password: providerConfig.smtpPassword || providerConfig.password,
          senderEmail: providerConfig.senderEmail,
          senderName: providerConfig.senderName,
          replyTo: providerConfig.replyToEmail || providerConfig.replyTo
        };
        break;

      default:
        throw new Error(`Provider non supporté: ${provider}`);
    }

    return basePayload;
  }

  // Envoie un email de notification de contact
  async sendContactNotification(formData, siteSettings) {
    // La config provider peut être dans contact_email (Mailjet) ou emailConfig (SMTP/autres)
    let providerConfig = null;
    let templatesConfig = null;
    
    // 1. Chercher la config provider dans contact_email (objet ou string JSON)
    if (siteSettings.contact_email) {
      let contactEmailData = siteSettings.contact_email;
      
      // Si c'est une string, parser
      if (typeof contactEmailData === 'string') {
        try {
          contactEmailData = JSON.parse(contactEmailData);
        } catch (e) {
        }
      }
      
      // Vérifier si on a un provider non-SMTP (priorité)
      if (contactEmailData && contactEmailData.provider && contactEmailData.provider !== 'smtp') {
        providerConfig = contactEmailData;
      }
    }
    
    // 2. Fallback sur emailConfig directement (objet)
    if (!providerConfig && siteSettings.emailConfig) {
      let emailConfig = siteSettings.emailConfig;
      // Si c'est une string, parser
      if (typeof emailConfig === 'string') {
        try {
          emailConfig = JSON.parse(emailConfig);
        } catch (e) {
        }
      }
      
      // Vérifier si on a un provider valide
      if (emailConfig && emailConfig.provider && emailConfig.provider !== 'smtp') {
        providerConfig = emailConfig;
      } else if (emailConfig && emailConfig.provider === 'smtp') {
        providerConfig = emailConfig;
      }
    }
    
    // 3. Chercher les templates dans emailConfig
    if (siteSettings.emailConfig) {
      let emailConfig = siteSettings.emailConfig;
      if (typeof emailConfig === 'string') {
        try {
          emailConfig = JSON.parse(emailConfig);
        } catch (e) {}
      }
      
      if (emailConfig && emailConfig.templates) {
        templatesConfig = emailConfig.templates;
      }
    }
    
    if (!providerConfig) {
      throw new Error('Configuration du provider email non trouvée');
    }
    
    if (!templatesConfig) {
      throw new Error('Configuration des templates email non trouvée');
    }

    // Utiliser les templates trouvés
    const templates = templatesConfig;
    
    if (!templates?.contact?.enabled) {
      throw new Error('Template de contact non activé');
    }

    const variables = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Non renseigné',
      subject: formData.subject,
      message: formData.message,
      siteName: this.getSiteNameFromSettings(siteSettings),
      date: new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const emailContent = this.replaceTemplateVariables(
      templates.contact.template, 
      variables
    );

    // Utiliser finalConfig en priorité (structure Mailjet), sinon config, sinon providerConfig direct
    const config = providerConfig.finalConfig || providerConfig.config || providerConfig;
    
    const emailData = {
      to: config.senderEmail || siteSettings.email,
      subject: this.replaceTemplateVariables(templates.contact.subject, variables),
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
      from: {
        email: config.senderEmail,
        name: config.senderName
      },
      replyTo: config.replyTo || formData.email
    };

    return await this.sendEmail(providerConfig, emailData, 'contact_notification');
  }

  // Envoie un email de confirmation au visiteur
  async sendContactConfirmation(formData, siteSettings) {
    // Parse email_config si c'est une string JSON (peut être emailConfig ou email_config selon le store)
    let emailConfig = siteSettings.emailConfig || siteSettings.email_config;
    if (typeof emailConfig === 'string') {
      try {
        emailConfig = JSON.parse(emailConfig);
      } catch (e) {
        throw new Error('Configuration email invalide (JSON malformé)');
      }
    }
    
    if (!emailConfig) {
      throw new Error('Configuration email non trouvée dans les paramètres');
    }

    if (!emailConfig.templates?.contactConfirmation?.enabled) {
      return { success: true, message: 'Confirmation email disabled' };
    }

    const variables = {
      name: formData.name,
      message: formData.message,
      siteName: this.getSiteNameFromSettings(siteSettings),
      email: siteSettings.email,
      phone: siteSettings.phone
    };

    const emailContent = this.replaceTemplateVariables(
      emailConfig.config.templates.contactConfirmation.template, 
      variables
    );

    const emailData = {
      to: formData.email,
      subject: this.replaceTemplateVariables(emailConfig.config.templates.contactConfirmation.subject, variables),
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
      from: {
        email: emailConfig.config.senderEmail,
        name: emailConfig.config.senderName
      },
      replyTo: emailConfig.config.replyTo || siteSettings.email
    };

    return await this.sendEmail(emailConfig.finalConfig, emailData, 'contact_confirmation');
  }

  // Envoie les deux emails (notification + confirmation)
  async sendContactEmails(formData, siteSettings) {
    const results = {
      notification: null,
      confirmation: null,
      success: false,
      errors: []
    };

    try {
      // Envoi de l'email de notification (obligatoire)
      results.notification = await this.sendContactNotification(formData, siteSettings);
      
      // Envoi de l'email de confirmation (optionnel)
      try {
        results.confirmation = await this.sendContactConfirmation(formData, siteSettings);
      } catch (confirmError) {
        results.errors.push(`Confirmation: ${confirmError.message}`);
      }

      results.success = results.notification.success;
      return results;

    } catch (error) {
      results.errors.push(`Notification: ${error.message}`);
      results.success = false;
      throw new Error(`Échec de l'envoi: ${error.message}`);
    }
  }

  // Utilitaires
  replaceTemplateVariables(template, variables) {
    if (!template) return '';
    
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    });
    
    return result;
  }

  getSiteNameFromSettings(siteSettings) {
    if (siteSettings.siteName && typeof siteSettings.siteName === 'object') {
      return siteSettings.siteName.fr || siteSettings.siteName.en || Object.values(siteSettings.siteName)[0] || 'Mon Site Web';
    }
    return siteSettings.siteName || 'Mon Site Web';
  }

  // Teste la configuration d'un provider
  async testProviderConnection(providerConfig, testEmail = 'test@example.com') {
    try {
      const testEmailData = {
        to: testEmail,
        subject: '🔧 Test de configuration email',
        text: `Test de configuration pour ${providerConfig.providerName}.\n\nSi vous recevez ce message, la configuration fonctionne correctement !`,
        from: {
          email: providerConfig.senderEmail || providerConfig.username,
          name: providerConfig.senderName || 'Test Configuration'
        },
        replyTo: providerConfig.replyTo
      };

      const result = await this.sendEmail(providerConfig, testEmailData, 'test');
      
      return {
        success: true,
        message: `Test réussi avec ${providerConfig.providerName}`,
        messageId: result.messageId,
        provider: providerConfig.providerId
      };

    } catch (error) {
      throw new Error(`Test échoué: ${error.message}`);
    }
  }
}

// Instance singleton
const unifiedEmailService = new UnifiedEmailService();

export default unifiedEmailService;
export { UnifiedEmailService };
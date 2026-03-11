// Service d'envoi d'email RÉEL
import emailjs from '@emailjs/browser';

class RealEmailService {
  constructor() {
    this.isProduction = import.meta.env.PROD;
  }

  // Remplace les variables dans un template
  replaceTemplateVariables(template, variables) {
    if (!template) return '';
    
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    });
    
    return result;
  }

  // Envoie un email via EmailJS (solution frontend)
  async sendWithEmailJS(emailData, emailConfig, type) {
    try {
      // Initialisation d'EmailJS avec la clé publique
      emailjs.init(emailConfig.emailjsPublicKey);

      const templateParams = {
        from_name: emailData.from.name,
        from_email: emailData.from.email,
        to_email: emailData.to,
        subject: emailData.subject,
        message: emailData.text,
        reply_to: emailData.replyTo || emailData.from.email,
        // Variables supplémentaires pour les templates EmailJS
        user_name: emailData.variables?.name || '',
        user_email: emailData.variables?.email || '',
        user_phone: emailData.variables?.phone || '',
        user_subject: emailData.variables?.subject || '',
        user_message: emailData.variables?.message || '',
        site_name: emailData.variables?.siteName || '',
        current_date: emailData.variables?.date || new Date().toLocaleString('fr-FR')
      };

      const response = await emailjs.send(
        emailConfig.emailjsServiceId,
        emailConfig.emailjsTemplateId,
        templateParams
      );

      return {
        success: true,
        messageId: response.text,
        message: 'Email envoyé avec succès via EmailJS',
        provider: 'emailjs',
        response: response
      };

    } catch (error) {
      throw new Error(`Échec EmailJS: ${error.text || error.message}`);
    }
  }

  // Envoie un email via Mailjet (via backend API)
  async sendWithMailjetAPI(emailData, emailConfig, type) {
    try {
      const payload = {
        provider: 'mailjet',
        config: {
          apiKey: emailConfig.mailjetApiKey,
          secretKey: emailConfig.mailjetSecretKey,
          sandboxMode: emailConfig.mailjetSandboxMode
        },
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

      const response = await fetch('/api/send-email', {
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
        message: result.message || 'Email envoyé avec succès via Mailjet',
        provider: 'mailjet',
        response: result
      };

    } catch (error) {
      throw new Error(`Échec Mailjet: ${error.message}`);
    }
  }

  // Envoie un email via API backend personnalisée
  async sendWithBackendAPI(emailData, emailConfig, type) {
    try {
      const payload = {
        provider: emailConfig.provider,
        config: {
          mailjetApiKey: emailConfig.mailjetApiKey,
          mailjetSecretKey: emailConfig.mailjetSecretKey,
          mailjetSandboxMode: emailConfig.mailjetSandboxMode,
          smtpHost: emailConfig.smtpHost,
          smtpPort: emailConfig.smtpPort,
          smtpUser: emailConfig.smtpUser,
          smtpPassword: emailConfig.smtpPassword,
          smtpSecure: emailConfig.smtpSecure
        },
        email: {
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text,
          html: emailData.html,
          replyTo: emailData.replyTo
        },
        type: type
      };

      const response = await fetch(emailConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(`Backend API Error: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        messageId: result.messageId,
        message: 'Email envoyé avec succès via Backend API',
        provider: 'api',
        response: result
      };

    } catch (error) {
      throw new Error(`Échec Backend API: ${error.message}`);
    }
  }


  // Envoie un email de notification de contact
  async sendContactNotification(formData, emailConfig, siteSettings) {
    try {
      if (!emailConfig?.templates?.contact?.enabled) {
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
        emailConfig.templates.contact.template, 
        variables
      );

      const emailData = {
        to: emailConfig.senderEmail || siteSettings.email,
        subject: this.replaceTemplateVariables(emailConfig.templates.contact.subject, variables),
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>'),
        from: {
          email: emailConfig.senderEmail,
          name: emailConfig.senderName
        },
        replyTo: emailConfig.replyToEmail || formData.email,
        variables: variables
      };

      // Choisir la méthode d'envoi selon le provider
      switch (emailConfig.provider) {
        case 'emailjs':
          return await this.sendWithEmailJS(emailData, emailConfig, 'contact_notification');
        case 'mailjet':
          return await this.sendWithMailjetAPI(emailData, emailConfig, 'contact_notification');
        case 'api':
          return await this.sendWithBackendAPI(emailData, emailConfig, 'contact_notification');
        default:
          throw new Error(`Provider non supporté pour l'envoi réel: ${emailConfig.provider}`);
      }
      
    } catch (error) {
      throw error;
    }
  }

  // Envoie un email de confirmation au visiteur
  async sendContactConfirmation(formData, emailConfig, siteSettings) {
    try {
      if (!emailConfig?.templates?.contactConfirmation?.enabled) {
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
        emailConfig.templates.contactConfirmation.template, 
        variables
      );

      const emailData = {
        to: formData.email,
        subject: this.replaceTemplateVariables(emailConfig.templates.contactConfirmation.subject, variables),
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>'),
        from: {
          email: emailConfig.senderEmail,
          name: emailConfig.senderName
        },
        replyTo: emailConfig.replyToEmail || siteSettings.email,
        variables: variables
      };

      // Choisir la méthode d'envoi selon le provider
      switch (emailConfig.provider) {
        case 'emailjs':
          return await this.sendWithEmailJS(emailData, emailConfig, 'contact_confirmation');
        case 'mailjet':
          return await this.sendWithMailjetAPI(emailData, emailConfig, 'contact_confirmation');
        case 'api':
          return await this.sendWithBackendAPI(emailData, emailConfig, 'contact_confirmation');
        default:
          throw new Error(`Provider non supporté pour l'envoi réel: ${emailConfig.provider}`);
      }
      
    } catch (error) {
      throw error;
    }
  }

  // Méthode utilitaire pour obtenir le nom du site
  getSiteNameFromSettings(siteSettings) {
    // Gestion des noms multilingues
    if (siteSettings.siteName && typeof siteSettings.siteName === 'object') {
      return siteSettings.siteName.fr || siteSettings.siteName.en || Object.values(siteSettings.siteName)[0] || 'Mon Site Web';
    }
    return siteSettings.siteName || 'Mon Site Web';
  }

  // Envoie les deux emails (notification + confirmation)
  async sendContactEmails(formData, emailConfig, siteSettings) {
    const results = {
      notification: null,
      confirmation: null,
      success: false,
      errors: []
    };

    try {
      // Envoi de l'email de notification (obligatoire)
      results.notification = await this.sendContactNotification(formData, emailConfig, siteSettings);
      
      // Envoi de l'email de confirmation (optionnel)
      try {
        results.confirmation = await this.sendContactConfirmation(formData, emailConfig, siteSettings);
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

  // Valide la configuration email
  validateEmailConfig(emailConfig) {
    const errors = [];

    if (!emailConfig) {
      errors.push('Configuration email manquante');
      return errors;
    }

    // Validation commune
    if (!emailConfig.senderEmail) errors.push('Email expéditeur manquant');
    if (!emailConfig.senderName) errors.push('Nom expéditeur manquant');

    // Validation selon le provider
    switch (emailConfig.provider) {
      case 'emailjs':
        if (!emailConfig.emailjsServiceId) errors.push('Service ID EmailJS manquant');
        if (!emailConfig.emailjsTemplateId) errors.push('Template ID EmailJS manquant');
        if (!emailConfig.emailjsPublicKey) errors.push('Clé publique EmailJS manquante');
        break;
      case 'mailjet':
        if (!emailConfig.mailjetApiKey) errors.push('Clé API Mailjet manquante');
        if (!emailConfig.mailjetSecretKey) errors.push('Clé secrète Mailjet manquante');
        break;
      case 'api':
        if (!emailConfig.apiEndpoint) errors.push('Endpoint API manquant');
        break;
      default:
        errors.push(`Provider non supporté pour l'envoi réel: ${emailConfig.provider}`);
    }

    if (!emailConfig.templates?.contact?.enabled) {
      errors.push('Template de contact désactivé');
    }

    return errors;
  }
}

// Instance singleton
const realEmailService = new RealEmailService();

export default realEmailService;
export { RealEmailService };
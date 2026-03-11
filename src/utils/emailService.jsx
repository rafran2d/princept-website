// Service d'envoi d'email
// Note: Ce service simule l'envoi d'email côté frontend
// En production, vous devriez implémenter une API backend pour l'envoi d'emails

class EmailService {
  constructor() {
    this.apiEndpoint = import.meta.env.VITE_EMAIL_API_ENDPOINT || '/api/send-email';
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

  // Obtient le template approprié pour la langue actuelle
  getTemplateForLanguage(templateConfig, currentLanguage, fallbackLanguage = 'fr') {
    if (!templateConfig || typeof templateConfig !== 'object') {
      return templateConfig || '';
    }

    // Si c'est une chaîne simple, la retourner
    if (typeof templateConfig === 'string') {
      return templateConfig;
    }

    // Essayer la langue actuelle
    if (templateConfig[currentLanguage]) {
      return templateConfig[currentLanguage];
    }

    // Essayer la langue de fallback
    if (templateConfig[fallbackLanguage]) {
      return templateConfig[fallbackLanguage];
    }

    // Prendre la première valeur disponible
    const firstAvailable = Object.values(templateConfig).find(value => value && value.trim());
    return firstAvailable || '';
  }

  // Détermine la langue à utiliser pour les emails
  getEmailLanguage(formData, siteSettings) {
    // 1. Langue spécifiée dans le formulaire
    if (formData.language) {
      return formData.language;
    }

    // 2. Langue détectée depuis l'URL ou le navigateur
    if (formData.detectedLanguage) {
      return formData.detectedLanguage;
    }

    // 3. Langue par défaut du site
    if (siteSettings.defaultLanguage) {
      return siteSettings.defaultLanguage;
    }

    // 4. Fallback vers français
    return 'fr';
  }

  // Envoie un email de notification de contact
  async sendContactNotification(formData, emailConfig, siteSettings, currentLanguage = null) {
    try {
      if (!emailConfig?.templates?.contact?.enabled) {
        throw new Error('Template de contact non activé');
      }

      // Déterminer la langue à utiliser
      const emailLanguage = currentLanguage || this.getEmailLanguage(formData, siteSettings);
      
      const variables = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Non renseigné',
        subject: formData.subject,
        message: formData.message,
        siteName: this.getSiteNameFromSettings(siteSettings, emailLanguage),
        date: new Date().toLocaleString(this.getLocaleForLanguage(emailLanguage), {
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        language: emailLanguage
      };

      // Sélectionner le template approprié pour la langue
      const templateContent = this.getTemplateForLanguage(
        emailConfig.templates.contact.template,
        emailLanguage
      );

      const subjectTemplate = this.getTemplateForLanguage(
        emailConfig.templates.contact.subject,
        emailLanguage
      );

      const emailContent = this.replaceTemplateVariables(templateContent, variables);

      const emailData = {
        to: emailConfig.senderEmail || siteSettings.email,
        subject: this.replaceTemplateVariables(subjectTemplate, variables),
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>'),
        from: {
          email: emailConfig.senderEmail,
          name: emailConfig.senderName
        },
        replyTo: emailConfig.replyToEmail || formData.email,
        language: emailLanguage
      };

      // Choisir la méthode d'envoi selon le provider
      if (emailConfig.provider === 'mailjet') {
        return await this.sendWithMailjet(emailData, emailConfig, 'contact_notification');
      } else {
        return await this.sendWithSMTP(emailData, emailConfig, 'contact_notification');
      }
      
    } catch (error) {
      throw error;
    }
  }

  // Envoie un email de confirmation au visiteur
  async sendContactConfirmation(formData, emailConfig, siteSettings, currentLanguage = null) {
    try {
      if (!emailConfig?.templates?.contactConfirmation?.enabled) {
        return { success: true, message: 'Confirmation email disabled' };
      }

      // Déterminer la langue à utiliser
      const emailLanguage = currentLanguage || this.getEmailLanguage(formData, siteSettings);

      const variables = {
        name: formData.name,
        message: formData.message,
        siteName: this.getSiteNameFromSettings(siteSettings, emailLanguage),
        email: siteSettings.email,
        phone: siteSettings.phone,
        language: emailLanguage
      };

      // Sélectionner le template approprié pour la langue
      const templateContent = this.getTemplateForLanguage(
        emailConfig.templates.contactConfirmation.template,
        emailLanguage
      );

      const subjectTemplate = this.getTemplateForLanguage(
        emailConfig.templates.contactConfirmation.subject,
        emailLanguage
      );

      const emailContent = this.replaceTemplateVariables(templateContent, variables);

      const emailData = {
        to: formData.email,
        subject: this.replaceTemplateVariables(subjectTemplate, variables),
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>'),
        from: {
          email: emailConfig.senderEmail,
          name: emailConfig.senderName
        },
        replyTo: emailConfig.replyToEmail || siteSettings.email,
        language: emailLanguage
      };

      // Choisir la méthode d'envoi selon le provider
      if (emailConfig.provider === 'mailjet') {
        return await this.sendWithMailjet(emailData, emailConfig, 'contact_confirmation');
      } else {
        return await this.sendWithSMTP(emailData, emailConfig, 'contact_confirmation');
      }
      
    } catch (error) {
      throw error;
    }
  }

  // Envoie un email via l'API Mailjet
  async sendWithMailjet(emailData, emailConfig, type) {
    try {
      const payload = {
        Messages: [
          {
            From: {
              Email: emailData.from.email,
              Name: emailData.from.name
            },
            To: [
              {
                Email: emailData.to,
                Name: emailData.toName || ''
              }
            ],
            Subject: emailData.subject,
            TextPart: emailData.text,
            HTMLPart: emailData.html,
            ReplyTo: emailData.replyTo ? {
              Email: emailData.replyTo,
              Name: emailData.from.name
            } : undefined
          }
        ]
      };

      // En mode sandbox, ajouter SandboxMode
      if (emailConfig.mailjetSandboxMode) {
        payload.SandboxMode = true;
      }

      // Simulation de l'appel Mailjet
      return await this.simulateMailjetSend(payload, emailConfig, type);

    } catch (error) {
      throw new Error(`Échec envoi Mailjet: ${error.message}`);
    }
  }

  // Envoie un email via SMTP
  async sendWithSMTP(emailData, emailConfig, type) {
    const smtpData = {
      ...emailData,
      smtpConfig: {
        host: emailConfig.smtpHost,
        port: emailConfig.smtpPort,
        user: emailConfig.smtpUser,
        password: emailConfig.smtpPassword,
        secure: emailConfig.smtpSecure
      }
    };

    return await this.simulateSMTPSend(smtpData, type);
  }

  // Simule l'envoi d'email via Mailjet
  async simulateMailjetSend(payload, emailConfig, type) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validation de la configuration Mailjet
        if (!emailConfig.mailjetApiKey) {
          reject(new Error('Clé API Mailjet manquante'));
          return;
        }

        if (!emailConfig.mailjetSecretKey) {
          reject(new Error('Clé secrète Mailjet manquante'));
          return;
        }

        if (!payload.Messages[0].To[0].Email) {
          reject(new Error('Adresse destinataire manquante'));
          return;
        }

        resolve({
          success: true,
          messageId: `mj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          message: 'Email envoyé avec succès via Mailjet (simulation)',
          provider: 'mailjet'
        });

      }, Math.random() * 800 + 300); // Délai 300-1100ms
    });
  }

  // Simule l'envoi d'email via SMTP (ancien code)
  async simulateSMTPSend(emailData, type) {
    return new Promise((resolve, reject) => {
      // Simulation d'un délai réseau
      setTimeout(() => {
        // Vérification basique de la configuration
        if (!emailData.smtpConfig.host) {
          reject(new Error('Configuration SMTP incomplète: serveur SMTP manquant'));
          return;
        }

        if (!emailData.smtpConfig.user) {
          reject(new Error('Configuration SMTP incomplète: utilisateur manquant'));
          return;
        }

        if (!emailData.to) {
          reject(new Error('Adresse destinataire manquante'));
          return;
        }

        resolve({
          success: true,
          messageId: `smtp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          message: 'Email envoyé avec succès via SMTP (simulation)',
          provider: 'smtp'
        });

      }, Math.random() * 1000 + 500); // Délai aléatoire 500-1500ms
    });
  }

  // Méthode utilitaire pour obtenir le nom du site dans la langue appropriée
  getSiteNameFromSettings(siteSettings, language = 'fr') {
    // Gestion des noms multilingues
    if (siteSettings.siteName && typeof siteSettings.siteName === 'object') {
      return siteSettings.siteName[language] || 
             siteSettings.siteName.fr || 
             siteSettings.siteName.en || 
             Object.values(siteSettings.siteName)[0] || 
             'Mon Site Web';
    }
    return siteSettings.siteName || 'Mon Site Web';
  }

  // Obtient la locale appropriée pour le formatage des dates
  getLocaleForLanguage(language) {
    const localeMap = {
      'fr': 'fr-FR',
      'en': 'en-US',
      'es': 'es-ES',
      'de': 'de-DE',
      'it': 'it-IT',
      'ar': 'ar-SA'
    };
    return localeMap[language] || 'fr-FR';
  }

  // Envoie les deux emails (notification + confirmation) avec support multilingue
  async sendContactEmails(formData, emailConfig, siteSettings, currentLanguage = null) {
    const results = {
      notification: null,
      confirmation: null,
      success: false,
      errors: [],
      language: currentLanguage || this.getEmailLanguage(formData, siteSettings)
    };

    try {
      // Envoi de l'email de notification (obligatoire)
      results.notification = await this.sendContactNotification(formData, emailConfig, siteSettings, results.language);
      
      // Envoi de l'email de confirmation (optionnel)
      try {
        results.confirmation = await this.sendContactConfirmation(formData, emailConfig, siteSettings, results.language);
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
    if (emailConfig.provider === 'mailjet') {
      if (!emailConfig.mailjetApiKey) errors.push('Clé API Mailjet manquante');
      if (!emailConfig.mailjetSecretKey) errors.push('Clé secrète Mailjet manquante');
    } else {
      // Validation SMTP par défaut
      if (!emailConfig.smtpHost) errors.push('Serveur SMTP manquant');
      if (!emailConfig.smtpPort) errors.push('Port SMTP manquant');
      if (!emailConfig.smtpUser) errors.push('Utilisateur SMTP manquant');
      if (!emailConfig.smtpPassword) errors.push('Mot de passe SMTP manquant');
    }

    if (!emailConfig.templates?.contact?.enabled) {
      errors.push('Template de contact désactivé');
    }

    return errors;
  }
}

// Instance singleton
const emailService = new EmailService();

export default emailService;

// Export des méthodes utilitaires
export { EmailService };
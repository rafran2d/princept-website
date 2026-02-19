// Service de gestion des providers email (inspiré de Mageplaza SMTP)
// Support pour Gmail, Outlook, SendGrid, Mailgun, Amazon SES, etc.

class EmailProvidersService {
  constructor() {
    this.providers = this.getAvailableProviders();
  }

  // Liste complète des providers disponibles (comme Mageplaza SMTP)
  getAvailableProviders() {
    return {
      gmail: {
        id: 'gmail',
        name: 'Gmail',
        description: 'Envoi via Gmail SMTP',
        icon: '📧',
        category: 'free',
        isPopular: true,
        config: {
          smtp: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true pour 465, false pour autres ports
            requiresAuth: true,
            authType: 'login', // 'login' ou 'oauth2'
          },
          fields: [
            { key: 'username', label: 'Adresse Gmail', type: 'email', required: true, placeholder: 'votre-email@gmail.com' },
            { key: 'password', label: 'Mot de passe d\'application', type: 'password', required: true, help: 'Utilisez un mot de passe d\'application Gmail, pas votre mot de passe principal' },
            { key: 'senderName', label: 'Nom expéditeur', type: 'text', required: true, placeholder: 'Mon Site Web' },
            { key: 'replyTo', label: 'Répondre à', type: 'email', required: false, placeholder: 'contact@monsite.com' }
          ]
        },
        testSettings: {
          testEmail: 'Test Gmail Configuration',
          testSubject: '🔧 Test de configuration Gmail - {{siteName}}'
        },
        documentation: {
          setupUrl: 'https://support.google.com/accounts/answer/185833',
          videoUrl: 'https://www.youtube.com/watch?v=hXiPshHn9Pw',
          steps: [
            '1. Activez la validation en 2 étapes sur votre compte Gmail',
            '2. Générez un mot de passe d\'application dans les paramètres de sécurité',
            '3. Utilisez ce mot de passe d\'application dans le champ "Mot de passe"'
          ]
        }
      },

      outlook: {
        id: 'outlook',
        name: 'Outlook',
        description: 'Microsoft Outlook/Hotmail SMTP',
        icon: '📮',
        category: 'free',
        isPopular: true,
        config: {
          smtp: {
            host: 'smtp.live.com',
            port: 587,
            secure: false,
            requiresAuth: true,
            authType: 'login',
          },
          fields: [
            { key: 'username', label: 'Adresse Outlook', type: 'email', required: true, placeholder: 'votre-email@outlook.com' },
            { key: 'password', label: 'Mot de passe', type: 'password', required: true },
            { key: 'senderName', label: 'Nom expéditeur', type: 'text', required: true, placeholder: 'Mon Site Web' },
            { key: 'replyTo', label: 'Répondre à', type: 'email', required: false, placeholder: 'contact@monsite.com' }
          ]
        },
        testSettings: {
          testEmail: 'Test Outlook Configuration',
          testSubject: '🔧 Test de configuration Outlook - {{siteName}}'
        },
        documentation: {
          setupUrl: 'https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040',
          steps: [
            '1. Utilisez votre adresse email Outlook complète',
            '2. Utilisez votre mot de passe Outlook habituel',
            '3. Assurez-vous que SMTP est activé dans vos paramètres Outlook'
          ]
        }
      },

      sendgrid: {
        id: 'sendgrid',
        name: 'SendGrid',
        description: 'Service email transactionnel professionnel',
        icon: '🚀',
        category: 'professional',
        isPopular: true,
        pricingInfo: 'Gratuit jusqu\'à 100 emails/jour, puis payant',
        config: {
          type: 'api',
          apiEndpoint: 'https://api.sendgrid.com/v3/mail/send',
          fields: [
            { key: 'apiKey', label: 'Clé API SendGrid', type: 'password', required: true, placeholder: 'SG.xxx...' },
            { key: 'senderEmail', label: 'Email expéditeur vérifié', type: 'email', required: true, placeholder: 'noreply@mondomaine.com' },
            { key: 'senderName', label: 'Nom expéditeur', type: 'text', required: true, placeholder: 'Mon Site Web' },
            { key: 'replyTo', label: 'Répondre à', type: 'email', required: false, placeholder: 'contact@mondomaine.com' }
          ]
        },
        testSettings: {
          testEmail: 'Test SendGrid Configuration',
          testSubject: '🔧 Test de configuration SendGrid - {{siteName}}'
        },
        documentation: {
          setupUrl: 'https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs',
          steps: [
            '1. Créez un compte SendGrid gratuit',
            '2. Vérifiez votre domaine ou votre adresse email expéditrice',
            '3. Générez une clé API dans Settings > API Keys',
            '4. Copiez la clé API dans le champ correspondant'
          ]
        }
      },

      mailgun: {
        id: 'mailgun',
        name: 'Mailgun',
        description: 'API email puissante pour développeurs',
        icon: '🔫',
        category: 'professional',
        isPopular: true,
        pricingInfo: 'Gratuit jusqu\'à 5000 emails/mois, puis payant',
        config: {
          type: 'api',
          apiEndpoint: 'https://api.mailgun.net/v3',
          fields: [
            { key: 'apiKey', label: 'Clé API Mailgun', type: 'password', required: true, placeholder: 'key-xxx...' },
            { key: 'domain', label: 'Domaine Mailgun', type: 'text', required: true, placeholder: 'sandbox123.mailgun.org' },
            { key: 'senderEmail', label: 'Email expéditeur', type: 'email', required: true, placeholder: 'noreply@mondomaine.com' },
            { key: 'senderName', label: 'Nom expéditeur', type: 'text', required: true, placeholder: 'Mon Site Web' },
            { key: 'replyTo', label: 'Répondre à', type: 'email', required: false, placeholder: 'contact@mondomaine.com' }
          ]
        },
        testSettings: {
          testEmail: 'Test Mailgun Configuration',
          testSubject: '🔧 Test de configuration Mailgun - {{siteName}}'
        },
        documentation: {
          setupUrl: 'https://documentation.mailgun.com/en/latest/quickstart.html',
          steps: [
            '1. Créez un compte Mailgun',
            '2. Ajoutez et vérifiez votre domaine',
            '3. Récupérez votre clé API dans Settings > API Keys',
            '4. Utilisez votre domaine sandbox pour les tests'
          ]
        }
      },

      amazonses: {
        id: 'amazonses',
        name: 'Amazon SES',
        description: 'Service email d\'Amazon Web Services',
        icon: '☁️',
        category: 'enterprise',
        isPopular: false,
        pricingInfo: 'Très économique, facturé à l\'usage',
        config: {
          smtp: {
            host: 'email-smtp.us-east-1.amazonaws.com',
            port: 587,
            secure: false,
            requiresAuth: true,
            authType: 'login',
          },
          fields: [
            { key: 'region', label: 'Région AWS', type: 'select', required: true, options: [
              { value: 'us-east-1', label: 'US East (N. Virginia)' },
              { value: 'us-west-2', label: 'US West (Oregon)' },
              { value: 'eu-west-1', label: 'Europe (Ireland)' }
            ]},
            { key: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true, placeholder: 'AKIA...' },
            { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true },
            { key: 'senderEmail', label: 'Email expéditeur vérifié', type: 'email', required: true, placeholder: 'noreply@mondomaine.com' },
            { key: 'senderName', label: 'Nom expéditeur', type: 'text', required: true, placeholder: 'Mon Site Web' },
            { key: 'replyTo', label: 'Répondre à', type: 'email', required: false, placeholder: 'contact@mondomaine.com' }
          ]
        },
        testSettings: {
          testEmail: 'Test Amazon SES Configuration',
          testSubject: '🔧 Test de configuration Amazon SES - {{siteName}}'
        },
        documentation: {
          setupUrl: 'https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html',
          steps: [
            '1. Activez Amazon SES dans votre compte AWS',
            '2. Vérifiez vos adresses email ou domaines',
            '3. Créez des identifiants SMTP dans la console SES',
            '4. Demandez la sortie du mode sandbox si nécessaire'
          ]
        }
      },

      mailjet: {
        id: 'mailjet',
        name: 'Mailjet',
        description: 'Service email européen avec API robuste',
        icon: '✈️',
        category: 'professional',
        isPopular: true,
        pricingInfo: 'Gratuit jusqu\'à 6000 emails/mois, puis payant',
        config: {
          type: 'api',
          apiEndpoint: 'https://api.mailjet.com/v3.1/send',
          fields: [
            { key: 'apiKey', label: 'Clé API Mailjet', type: 'text', required: true, placeholder: 'xxx...' },
            { key: 'secretKey', label: 'Clé secrète Mailjet', type: 'password', required: true },
            { key: 'senderEmail', label: 'Email expéditeur vérifié', type: 'email', required: true, placeholder: 'noreply@mondomaine.com' },
            { key: 'senderName', label: 'Nom expéditeur', type: 'text', required: true, placeholder: 'Mon Site Web' },
            { key: 'replyTo', label: 'Répondre à', type: 'email', required: false, placeholder: 'contact@mondomaine.com' },
            { key: 'sandboxMode', label: 'Mode sandbox', type: 'checkbox', required: false, help: 'Active le mode test (aucun email réellement envoyé)' }
          ]
        },
        testSettings: {
          testEmail: 'Test Mailjet Configuration',
          testSubject: '🔧 Test de configuration Mailjet - {{siteName}}'
        },
        documentation: {
          setupUrl: 'https://dev.mailjet.com/email/guides/send-api-v31/',
          steps: [
            '1. Créez un compte Mailjet',
            '2. Vérifiez votre adresse email expéditrice',
            '3. Récupérez vos clés API dans Account Settings > API Keys',
            '4. Testez d\'abord en mode sandbox'
          ]
        }
      },

      postmark: {
        id: 'postmark',
        name: 'Postmark',
        description: 'Email transactionnel rapide et fiable',
        icon: '📫',
        category: 'professional',
        isPopular: false,
        pricingInfo: 'Gratuit jusqu\'à 100 emails/mois, excellent taux de délivrabilité',
        config: {
          type: 'api',
          apiEndpoint: 'https://api.postmarkapp.com/email',
          fields: [
            { key: 'serverToken', label: 'Server Token Postmark', type: 'password', required: true, placeholder: 'xxx-xxx-xxx' },
            { key: 'senderEmail', label: 'Email expéditeur vérifié', type: 'email', required: true, placeholder: 'noreply@mondomaine.com' },
            { key: 'senderName', label: 'Nom expéditeur', type: 'text', required: true, placeholder: 'Mon Site Web' },
            { key: 'replyTo', label: 'Répondre à', type: 'email', required: false, placeholder: 'contact@mondomaine.com' }
          ]
        },
        testSettings: {
          testEmail: 'Test Postmark Configuration',
          testSubject: '🔧 Test de configuration Postmark - {{siteName}}'
        },
        documentation: {
          setupUrl: 'https://postmarkapp.com/developer/user-guide/send-email-with-api',
          steps: [
            '1. Créez un compte Postmark',
            '2. Créez un serveur et vérifiez votre domaine',
            '3. Récupérez le Server Token dans les paramètres du serveur',
            '4. Configurez les signatures DKIM pour améliorer la délivrabilité'
          ]
        }
      },

      smtpCustom: {
        id: 'smtpCustom',
        name: 'SMTP Personnalisé',
        description: 'Configuration SMTP manuelle pour tout fournisseur',
        icon: '⚙️',
        category: 'advanced',
        isPopular: false,
        config: {
          smtp: {
            requiresAuth: true,
            authType: 'login',
          },
          fields: [
            { key: 'host', label: 'Serveur SMTP', type: 'text', required: true, placeholder: 'smtp.monprovider.com' },
            { key: 'port', label: 'Port', type: 'number', required: true, placeholder: '587', options: [
              { value: 587, label: '587 (STARTTLS)' },
              { value: 465, label: '465 (SSL)' },
              { value: 25, label: '25 (Non sécurisé)' }
            ]},
            { key: 'secure', label: 'Connexion sécurisée', type: 'checkbox', required: false, help: 'Activer SSL/TLS (recommandé pour le port 465)' },
            { key: 'username', label: 'Nom d\'utilisateur', type: 'text', required: true, placeholder: 'utilisateur ou email' },
            { key: 'password', label: 'Mot de passe', type: 'password', required: true },
            { key: 'senderEmail', label: 'Email expéditeur', type: 'email', required: true, placeholder: 'noreply@mondomaine.com' },
            { key: 'senderName', label: 'Nom expéditeur', type: 'text', required: true, placeholder: 'Mon Site Web' },
            { key: 'replyTo', label: 'Répondre à', type: 'email', required: false, placeholder: 'contact@mondomaine.com' }
          ]
        },
        testSettings: {
          testEmail: 'Test SMTP Personnalisé',
          testSubject: '🔧 Test de configuration SMTP - {{siteName}}'
        },
        documentation: {
          setupUrl: '#',
          steps: [
            '1. Obtenez les paramètres SMTP de votre fournisseur',
            '2. Renseignez le serveur, port et identifiants',
            '3. Testez la configuration avec l\'outil de test',
            '4. Vérifiez que l\'email expéditeur est autorisé'
          ]
        }
      }
    };
  }

  // Obtient un provider par son ID
  getProvider(providerId) {
    return this.providers[providerId] || null;
  }

  // Obtient tous les providers par catégorie
  getProvidersByCategory() {
    const categories = {
      free: { name: 'Gratuits', providers: [] },
      professional: { name: 'Professionnels', providers: [] },
      enterprise: { name: 'Entreprise', providers: [] },
      advanced: { name: 'Avancé', providers: [] }
    };

    Object.values(this.providers).forEach(provider => {
      if (categories[provider.category]) {
        categories[provider.category].providers.push(provider);
      }
    });

    return categories;
  }

  // Obtient les providers populaires
  getPopularProviders() {
    return Object.values(this.providers).filter(provider => provider.isPopular);
  }

  // Valide la configuration d'un provider
  validateProviderConfig(providerId, config) {
    const provider = this.getProvider(providerId);
    if (!provider) {
      return { isValid: false, errors: ['Provider non trouvé'] };
    }

    const errors = [];
    const requiredFields = provider.config.fields.filter(field => field.required);

    requiredFields.forEach(field => {
      if (!config[field.key] || config[field.key].trim() === '') {
        errors.push(`${field.label} est requis`);
      }
    });

    // Validations spécifiques par type de champ
    provider.config.fields.forEach(field => {
      if (config[field.key]) {
        if (field.type === 'email' && !this.isValidEmail(config[field.key])) {
          errors.push(`${field.label} doit être une adresse email valide`);
        }
        if (field.type === 'number' && isNaN(config[field.key])) {
          errors.push(`${field.label} doit être un nombre`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Génère la configuration finale pour l'envoi
  generateSendConfig(providerId, userConfig) {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error('Provider non trouvé');
    }

    const config = {
      providerId: providerId,
      providerName: provider.name,
      type: provider.config.type || 'smtp',
      ...userConfig
    };

    // Configuration SMTP spécifique
    if (provider.config.smtp) {
      config.smtp = {
        ...provider.config.smtp,
        host: userConfig.host || provider.config.smtp.host,
        port: parseInt(userConfig.port || provider.config.smtp.port),
        secure: userConfig.secure !== undefined ? userConfig.secure : provider.config.smtp.secure,
        auth: {
          user: userConfig.username,
          pass: userConfig.password
        }
      };
    }

    // Configuration API spécifique
    if (provider.config.apiEndpoint) {
      config.apiEndpoint = provider.config.apiEndpoint;
    }

    return config;
  }

  // Test de connexion pour un provider
  async testProviderConnection(providerId, config) {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error('Provider non trouvé');
    }

    // Validation de la configuration
    const validation = this.validateProviderConfig(providerId, config);
    if (!validation.isValid) {
      throw new Error(`Configuration invalide: ${validation.errors.join(', ')}`);
    }

    try {
      // Simulation du test (à remplacer par de vrais tests)
      const testResult = await this.simulateConnectionTest(provider, config);
      
      return {
        success: true,
        provider: provider.name,
        message: `Connexion réussie avec ${provider.name}`,
        details: testResult
      };
    } catch (error) {
      throw new Error(`Test de connexion échoué pour ${provider.name}: ${error.message}`);
    }
  }

  // Simulation de test de connexion
  async simulateConnectionTest(provider, config) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation de différents cas selon le provider
        const success = Math.random() > 0.1; // 90% de succès en simulation
        
        if (success) {
          resolve({
            latency: Math.floor(Math.random() * 500) + 100,
            authentication: 'Success',
            serverResponse: `Connected to ${provider.name} successfully`
          });
        } else {
          reject(new Error('Échec de la connexion simulée'));
        }
      }, Math.random() * 2000 + 500); // Délai 500-2500ms
    });
  }

  // Utilitaire de validation email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Obtient les recommandations pour choisir un provider
  getProviderRecommendations() {
    return {
      forBeginner: 'gmail', // Le plus simple à configurer
      forBusiness: 'sendgrid', // Bon rapport qualité/prix
      forDeveloper: 'mailgun', // API puissante
      forEnterprise: 'amazonses', // Très économique à grande échelle
      forEurope: 'mailjet' // Serveurs européens, RGPD
    };
  }
}

// Instance singleton
const emailProvidersService = new EmailProvidersService();

export default emailProvidersService;
export { EmailProvidersService };
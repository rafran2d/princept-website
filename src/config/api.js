// Configuration centralisée de l'API backend
class ApiConfig {
  constructor() {
    // Configuration par défaut
    this.defaultConfig = {
      baseURL: 'http://localhost:3004',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Configuration depuis les variables d'environnement ou défaut
    this.config = {
      baseURL: import.meta.env.VITE_API_URL || this.defaultConfig.baseURL,
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || this.defaultConfig.timeout,
      headers: this.defaultConfig.headers
    };
  }

  // Obtenir l'URL de base
  getBaseURL() {
    return this.config.baseURL;
  }

  // Obtenir une URL complète pour un endpoint
  getURL(endpoint) {
    const baseURL = this.getBaseURL();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseURL}/api${cleanEndpoint}`;
  }

  // Obtenir la configuration complète pour fetch
  getFetchConfig(options = {}) {
    return {
      ...this.config,
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers
      }
    };
  }

  // Obtenir la configuration avec token d'authentification
  getAuthFetchConfig(token, options = {}) {
    return this.getFetchConfig({
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
  }

  // Changer l'URL de base (utile pour les tests ou changement d'environnement)
  setBaseURL(newBaseURL) {
    this.config.baseURL = newBaseURL;
    console.log(`🔧 API Base URL changée vers: ${newBaseURL}`);
  }

  // Utilitaire pour faire des requêtes avec gestion d'erreur standardisée
  async request(endpoint, options = {}) {
    const url = this.getURL(endpoint);
    const config = this.getFetchConfig(options);
    
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        ...config,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ API Request failed [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Utilitaire pour les requêtes authentifiées
  async authRequest(endpoint, token, options = {}) {
    return this.request(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
  }
}

// Instance singleton
const apiConfig = new ApiConfig();

// Endpoints prédéfinis pour éviter les erreurs de typo
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VERIFY_TOKEN: '/auth/verify',
  CHANGE_PASSWORD: '/auth/change-password',
  UPDATE_PROFILE: '/auth/update-profile',
  CHECK_DEFAULT_ADMIN: '/check-default-admin',
  
  // Site Settings
  SITE_SETTINGS: '/site-settings',
  
  // Sections
  SECTIONS: '/sections',
  
  // Languages
  LANGUAGES: '/languages',
  
  // Email
  SEND_EMAIL: '/send-email',
  
  // System
  HEALTH: '/health',
  MONITORING: '/monitoring'
};

export default apiConfig;
export { ApiConfig };
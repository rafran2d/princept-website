// Service API complet pour Princept CMS avec HA
// Gère tous les types de données : langues, sections, paramètres, thèmes, etc.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper pour fetch avec gestion d'erreurs
  async fetchWithRetry(endpoint, options = {}, retries = 3) {
    const url = `${this.baseURL}${endpoint}`;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            const text = await response.text();
            errorData = { error: text || `HTTP ${response.status}`, details: text };
          }
          const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
          const errorDetails = errorData.details || errorData.error || '';
          const fullError = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;

          throw new Error(fullError);
        }

        const data = await response.json();

        return data;
      } catch (error) {
        const isLastAttempt = i === retries - 1;
        const errorMsg = error.message || error.toString();
        
        if (isLastAttempt) {
          throw new Error(`Échec API après ${retries} tentatives: ${errorMsg}`);
        }
        
        // Attendre avant retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  // ================================
  // SYSTÈME & SANTÉ
  // ================================

  async getHealth() {
    return this.fetchWithRetry('/api/health');
  }

  async getMonitoring() {
    return this.fetchWithRetry('/api/monitoring');
  }

  // Test de connexion (legacy)
  async healthCheck() {
    try {
      const health = await this.getHealth();
      // Normaliser la réponse pour compatibilité
      if (health && health.status) {
        return health;
      }
      // Si pas de status, considérer comme OK si database est présent
      if (health && health.database) {
        return { ...health, status: 'OK' };
      }
      return { status: 'ERROR', error: 'Réponse de santé invalide' };
    } catch (error) {
      return { status: 'ERROR', error: error.message };
    }
  }

  // ================================
  // LANGUES
  // ================================

  async getLanguages() {
    const response = await this.fetchWithRetry('/api/languages');
    return response.data;
  }

  // Legacy method
  async getAllLanguages() {
    const response = await this.fetchWithRetry('/api/languages');
    return response;
  }

  async getActiveLanguages() {
    const response = await this.fetchWithRetry('/api/languages/active');
    return response.data;
  }

  async getDefaultLanguage() {
    const response = await this.fetchWithRetry('/api/languages/default');
    return response.data;
  }

  async createLanguage(languageData) {
    const response = await this.fetchWithRetry('/api/languages', {
      method: 'POST',
      body: JSON.stringify(languageData)
    });
    return response.data;
  }

  async updateLanguage(id, languageData) {
    const response = await this.fetchWithRetry(`/api/languages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(languageData)
    });
    return response.data;
  }

  async toggleLanguage(id) {
    const response = await this.fetchWithRetry(`/api/languages/${id}/toggle`, {
      method: 'PATCH'
    });
    return response.data;
  }

  async deleteLanguage(id) {
    const response = await this.fetchWithRetry(`/api/languages/${id}`, {
      method: 'DELETE'
    });
    if (!response.success && response.error) {
      throw new Error(response.error);
    }
    return response.message || response.success || true;
  }

  // ================================
  // SECTIONS (CMS Content)
  // ================================

  async getSections(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.language_id) queryParams.set('language_id', filters.language_id);
    if (filters.section_type) queryParams.set('section_type', filters.section_type);
    if (filters.enabled_only) queryParams.set('enabled_only', 'true');
    
    const endpoint = `/api/sections${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await this.fetchWithRetry(endpoint);
    return response.data;
  }

  async getSectionById(id) {
    const sections = await this.getSections();
    return sections.find(section => section.id === id) || null;
  }

  async createSection(sectionData) {
    const response = await this.fetchWithRetry('/api/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData)
    });
    return response.data;
  }

  async updateSection(id, sectionData) {
    const response = await this.fetchWithRetry(`/api/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData)
    });
    return response.data;
  }

  async deleteSection(id) {
    await this.fetchWithRetry(`/api/sections/${id}`, {
      method: 'DELETE'
    });
    return true;
  }

  // ================================
  // PARAMÈTRES SITE
  // ================================

  async getSiteSettings() {
    const response = await this.fetchWithRetry('/api/site-settings');
    return response.data;
  }

  async getSiteSetting(key) {
    const settings = await this.getSiteSettings();
    return settings[key] || null;
  }

  async setSiteSetting(key, value, type = 'string', description = null) {
    const response = await this.fetchWithRetry('/api/site-settings', {
      method: 'POST',
      body: JSON.stringify({
        setting_key: key,
        setting_value: value,
        setting_type: type,
        description
      })
    });
    return response.data;
  }

  async setSiteSettings(settings) {
    const promises = Object.entries(settings).map(([key, value]) => {
      const type = typeof value === 'object' ? 'json' : 
                   typeof value === 'boolean' ? 'boolean' :
                   typeof value === 'number' ? 'number' : 'string';
      
      return this.setSiteSetting(key, value, type);
    });
    
    return Promise.all(promises);
  }

  async updateSiteSetting(key, value) {
    const type = typeof value === 'object' ? 'json' : 
                 typeof value === 'boolean' ? 'boolean' :
                 typeof value === 'number' ? 'number' : 'string';
    
    return this.setSiteSetting(key, value, type);
  }

  // ================================
  // PAGES DYNAMIQUES
  // ================================

  async getPages() {
    const response = await this.fetchWithRetry('/api/pages');
    return response.data || [];
  }

  async getPage(slug) {
    const response = await this.fetchWithRetry(`/api/pages/${slug}`);
    return response.data;
  }

  async createPage(pageData) {
    const response = await this.fetchWithRetry('/api/pages', {
      method: 'POST',
      body: JSON.stringify(pageData)
    });
    return response.data;
  }

  async updatePage(id, pageData) {
    const response = await this.fetchWithRetry(`/api/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pageData)
    });
    return response.data;
  }

  async deletePage(id) {
    const response = await this.fetchWithRetry(`/api/pages/${id}`, {
      method: 'DELETE'
    });
    return response.data;
  }

  // ================================
  // THÈMES PERSONNALISÉS
  // ================================

  async getThemes() {
    const response = await this.fetchWithRetry('/api/themes');
    return response.data;
  }

  async getActiveTheme() {
    const themes = await this.getThemes();
    return themes.find(theme => theme.is_active) || null;
  }

  async createTheme(themeData) {
    const response = await this.fetchWithRetry('/api/themes', {
      method: 'POST',
      body: JSON.stringify(themeData)
    });
    return response.data;
  }

  async activateTheme(themeId) {
    const response = await this.fetchWithRetry(`/api/themes/${themeId}/activate`, {
      method: 'PATCH'
    });
    return response.data;
  }

  // ================================
  // PARAMÈTRES DESIGN
  // ================================

  async getDesignSettings() {
    const response = await this.fetchWithRetry('/api/design-settings');
    return response.data;
  }

  async getDesignSetting(name) {
    const settings = await this.getDesignSettings();
    return settings[name] || null;
  }

  async setDesignSetting(name, value) {
    const response = await this.fetchWithRetry('/api/design-settings', {
      method: 'POST',
      body: JSON.stringify({
        setting_name: name,
        setting_value: value
      })
    });
    return response.data;
  }

  async setDesignSettings(settings) {
    const promises = Object.entries(settings).map(([name, value]) => 
      this.setDesignSetting(name, value)
    );
    
    return Promise.all(promises);
  }

  // ================================
  // PRÉFÉRENCES UTILISATEUR
  // ================================

  async getUserPreferences() {
    const response = await this.fetchWithRetry('/api/user-preferences');
    return response.data;
  }

  async getUserPreference(key) {
    const preferences = await this.getUserPreferences();
    return preferences[key] || null;
  }

  async setUserPreference(key, value, type = 'string') {
    const response = await this.fetchWithRetry('/api/user-preferences', {
      method: 'POST',
      body: JSON.stringify({
        preference_key: key,
        preference_value: value,
        preference_type: type
      })
    });
    return response.data;
  }

  async setUserPreferences(preferences) {
    const promises = Object.entries(preferences).map(([key, value]) => {
      const type = typeof value === 'object' ? 'json' : 
                   typeof value === 'boolean' ? 'boolean' :
                   typeof value === 'number' ? 'number' : 'string';
      
      return this.setUserPreference(key, value, type);
    });
    
    return Promise.all(promises);
  }

  // ================================
  // MIGRATION LOCALSTORAGE
  // ================================

  async migrateLocalStorageData(dataType, data) {
    const response = await this.fetchWithRetry('/api/migrate/localstorage', {
      method: 'POST',
      body: JSON.stringify({
        data_type: dataType,
        data: data
      })
    });
    return response;
  }

  // Migrer tous les types de données localStorage
  async migrateAllLocalStorageData() {
    const migrations = [];

    try {
      // Migration des sections
      const sectionsData = localStorage.getItem('onepress-sections');
      if (sectionsData) {
        const sections = JSON.parse(sectionsData);
        migrations.push({
          type: 'sections',
          result: await this.migrateLocalStorageData('sections', sections)
        });
      }

      // Migration des paramètres site
      const siteSettingsData = localStorage.getItem('princept-site-settings');
      if (siteSettingsData) {
        const siteSettings = JSON.parse(siteSettingsData);
        migrations.push({
          type: 'site_settings',
          result: await this.migrateLocalStorageData('site_settings', siteSettings)
        });
      }

      // Migration des préférences utilisateur
      const userPrefs = {
        current_admin_language: localStorage.getItem('current-admin-language'),
        admin_theme: localStorage.getItem('admin-theme'),
        active_theme: localStorage.getItem('activeTheme')
      };

      const filteredUserPrefs = Object.fromEntries(
        Object.entries(userPrefs).filter(([key, value]) => value !== null)
      );

      if (Object.keys(filteredUserPrefs).length > 0) {
        migrations.push({
          type: 'user_preferences',
          result: await this.migrateLocalStorageData('user_preferences', filteredUserPrefs)
        });
      }

      // Migration des thèmes personnalisés
      const customThemesData = localStorage.getItem('customThemes');
      if (customThemesData) {
        const customThemes = JSON.parse(customThemesData);
        // Convertir le format localStorage vers format base
        const themesArray = Object.entries(customThemes).map(([id, config]) => ({
          id,
          theme_name: config.name || `Theme ${id}`,
          theme_config: config,
          is_active: id === localStorage.getItem('activeTheme') ? 1 : 0
        }));

        migrations.push({
          type: 'custom_themes',
          result: await this.migrateLocalStorageData('custom_themes', themesArray)
        });
      }

      // Migration des paramètres de design
      const designSettingsData = localStorage.getItem('designSettings');
      if (designSettingsData) {
        const designSettings = JSON.parse(designSettingsData);
        migrations.push({
          type: 'design_settings',
          result: await this.migrateLocalStorageData('design_settings', designSettings)
        });
      }

      return {
        success: true,
        migrations,
        total: migrations.reduce((sum, m) => sum + (m.result.migrated || 0), 0)
      };

    } catch (error) {
      throw error;
    }
  }

  // ================================
  // UTILITAIRES
  // ================================

  // Vérifier si l'API est accessible
  async isApiReachable() {
    try {
      await this.getHealth();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obtenir le statut du système HA
  async getHAStatus() {
    try {
      const health = await this.getHealth();
      return {
        available: true,
        dbType: health.dbType,
        degraded: false,
        mysql: health.dbType === 'mysql'
      };
    } catch (error) {
      return {
        available: false,
        dbType: 'unknown',
        degraded: true,
        mysql: false,
        error: error.message
      };
    }
  }

  // Nettoyer localStorage après migration réussie
  async cleanupLocalStorage() {
    const keysToRemove = [
      'onepress-sections',
      'princept-site-settings', 
      'current-admin-language',
      'admin-theme',
      'activeTheme',
      'customThemes',
      'designSettings'
    ];

    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });

    // Marquer la migration comme terminée
    localStorage.setItem('princept-migrated-to-db', new Date().toISOString());
    
    return {
      cleaned: keysToRemove.length,
      timestamp: new Date().toISOString()
    };
  }
}

// Instance singleton
const apiService = new ApiService();

export default apiService;

// Export des méthodes individuelles pour compatibilité
export const {
  getHealth,
  getMonitoring,
  healthCheck,
  getLanguages,
  getAllLanguages,
  getActiveLanguages,
  getDefaultLanguage,
  createLanguage,
  updateLanguage,
  toggleLanguage,
  deleteLanguage,
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  getSiteSettings,
  getSiteSetting,
  setSiteSetting,
  setSiteSettings,
  getThemes,
  getActiveTheme,
  createTheme,
  activateTheme,
  getDesignSettings,
  getDesignSetting,
  setDesignSetting,
  setDesignSettings,
  getUserPreferences,
  getUserPreference,
  setUserPreference,
  setUserPreferences,
  migrateLocalStorageData,
  migrateAllLocalStorageData,
  isApiReachable,
  getHAStatus,
  cleanupLocalStorage,
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage
} = apiService;
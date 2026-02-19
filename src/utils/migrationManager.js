// Gestionnaire de migration complète localStorage -> API HA
// Migre tous les contextes et stores vers l'API de manière transparente

import apiService from '../services/apiService';

class MigrationManager {
  constructor() {
    this.migrationKey = 'princept-migration-status';
    this.backupKey = 'princept-localStorage-backup';
  }

  // Vérifier si la migration a déjà été effectuée
  isMigrationCompleted() {
    const status = localStorage.getItem(this.migrationKey);
    return status === 'completed';
  }

  // Marquer la migration comme terminée
  markMigrationCompleted() {
    localStorage.setItem(this.migrationKey, 'completed');
    localStorage.setItem(`${this.migrationKey}-date`, new Date().toISOString());
    console.log('✅ Migration marquée comme terminée');
  }

  // Créer une sauvegarde de localStorage avant migration
  async createBackup() {
    try {
      const keysToBackup = [
        'onepress-sections',
        'princept-site-settings',
        'current-admin-language',
        'admin-theme',
        'activeTheme',
        'customThemes',
        'designSettings',
        'site-languages'
      ];

      const backup = {};
      keysToBackup.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          backup[key] = value;
        }
      });

      localStorage.setItem(this.backupKey, JSON.stringify(backup));
      console.log('💾 Sauvegarde localStorage créée:', Object.keys(backup).length, 'éléments');
      return backup;
    } catch (error) {
      console.error('❌ Erreur création sauvegarde:', error);
      throw error;
    }
  }

  // Migrer les langues
  async migrateSiteLanguages() {
    try {
      console.log('🌍 Migration des langues...');
      
      const siteLanguages = localStorage.getItem('site-languages');
      const currentAdminLang = localStorage.getItem('current-admin-language');
      
      let migrated = 0;

      if (siteLanguages) {
        const languages = JSON.parse(siteLanguages);
        console.log('📥 Langues trouvées:', languages.length);
        
        for (const lang of languages) {
          try {
            await apiService.createLanguage({
              id: lang.code,
              name: lang.name,
              code: lang.code,
              flag: lang.flag || '',
              is_active: lang.active ? 1 : 0,
              is_default: lang.default ? 1 : 0,
              is_rtl: lang.rtl ? 1 : 0,
              sort_order: lang.order || 0
            });
            migrated++;
          } catch (error) {
            if (!error.message.includes('duplicate') && !error.message.includes('exists')) {
              console.warn(`⚠️ Erreur création langue ${lang.code}:`, error.message);
            } else {
              migrated++; // Compte comme migré si elle existe déjà
            }
          }
        }
      }

      if (currentAdminLang) {
        await apiService.setUserPreference('current_admin_language', currentAdminLang);
      }

      console.log(`✅ Langues migrées: ${migrated}`);
      return migrated;
    } catch (error) {
      console.error('❌ Erreur migration langues:', error);
      return 0;
    }
  }

  // Migrer les sections
  async migrateSections() {
    try {
      console.log('📄 Migration des sections...');
      
      const sectionsData = localStorage.getItem('onepress-sections');
      if (!sectionsData) {
        console.log('ℹ️ Aucune section à migrer');
        return 0;
      }

      const sections = JSON.parse(sectionsData);
      console.log('📥 Sections trouvées:', sections.length);
      
      let migrated = 0;
      
      for (const section of sections) {
        try {
          // Convertir le format localStorage vers format API
          const apiSection = {
            id: section.id || `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            section_type: section.type,
            section_data: {
              title: section.title,
              subtitle: section.subtitle,
              description: section.description,
              buttonText: section.buttonText,
              buttonLink: section.buttonLink,
              backgroundColor: section.backgroundColor,
              textColor: section.textColor,
              backgroundImage: section.backgroundImage,
              navigationMode: section.navigationMode,
              features: section.features,
              services: section.services,
              email: section.email,
              phone: section.phone,
              address: section.address,
              images: section.images,
              testimonials: section.testimonials
            },
            is_enabled: section.enabled ? 1 : 0,
            sort_order: section.position || 0,
            language_id: 'fr'
          };

          await apiService.createSection(apiSection);
          migrated++;
        } catch (error) {
          if (!error.message.includes('duplicate') && !error.message.includes('exists')) {
            console.warn(`⚠️ Erreur création section ${section.id}:`, error.message);
          } else {
            migrated++;
          }
        }
      }

      console.log(`✅ Sections migrées: ${migrated}`);
      return migrated;
    } catch (error) {
      console.error('❌ Erreur migration sections:', error);
      return 0;
    }
  }

  // Migrer les paramètres du site
  async migrateSiteSettings() {
    try {
      console.log('⚙️ Migration des paramètres du site...');
      
      const settingsData = localStorage.getItem('princept-site-settings');
      if (!settingsData) {
        console.log('ℹ️ Aucun paramètre site à migrer');
        return 0;
      }

      const settings = JSON.parse(settingsData);
      console.log('📥 Paramètres site trouvés:', Object.keys(settings).length);
      
      // Mapping des paramètres
      const settingsMapping = {
        siteName: 'site_title',
        siteDescription: 'site_description',
        siteTagline: 'site_tagline',
        email: 'contact_email',
        phone: 'contact_phone',
        address: 'contact_address',
        social: 'social_links',
        primaryColor: 'primary_color',
        secondaryColor: 'secondary_color',
        emailConfig: 'email_config'
      };

      let migrated = 0;
      
      for (const [localKey, value] of Object.entries(settings)) {
        try {
          const apiKey = settingsMapping[localKey] || localKey;
          const settingType = typeof value === 'object' ? 'json' : 
                             typeof value === 'boolean' ? 'boolean' :
                             typeof value === 'number' ? 'number' : 'string';

          await apiService.setSiteSetting(apiKey, value, settingType);
          migrated++;
        } catch (error) {
          console.warn(`⚠️ Erreur paramètre ${localKey}:`, error.message);
        }
      }

      console.log(`✅ Paramètres site migrés: ${migrated}`);
      return migrated;
    } catch (error) {
      console.error('❌ Erreur migration paramètres site:', error);
      return 0;
    }
  }

  // Migrer les thèmes personnalisés
  async migrateCustomThemes() {
    try {
      console.log('🎨 Migration des thèmes...');
      
      const customThemesData = localStorage.getItem('customThemes');
      const activeTheme = localStorage.getItem('activeTheme');
      
      let migrated = 0;

      if (customThemesData) {
        const customThemes = JSON.parse(customThemesData);
        console.log('📥 Thèmes personnalisés trouvés:', Object.keys(customThemes).length);

        for (const [themeId, themeConfig] of Object.entries(customThemes)) {
          try {
            await apiService.createTheme({
              id: themeId,
              theme_name: themeConfig.name || `Theme ${themeId}`,
              theme_config: themeConfig,
              is_active: themeId === activeTheme ? 1 : 0
            });
            migrated++;
          } catch (error) {
            if (!error.message.includes('duplicate') && !error.message.includes('exists')) {
              console.warn(`⚠️ Erreur création thème ${themeId}:`, error.message);
            } else {
              migrated++;
            }
          }
        }
      }

      // Migrer le thème actif
      if (activeTheme) {
        await apiService.setUserPreference('active_theme', activeTheme);
      }

      console.log(`✅ Thèmes migrés: ${migrated}`);
      return migrated;
    } catch (error) {
      console.error('❌ Erreur migration thèmes:', error);
      return 0;
    }
  }

  // Migrer les paramètres de design
  async migrateDesignSettings() {
    try {
      console.log('🖌️ Migration des paramètres de design...');
      
      const designSettingsData = localStorage.getItem('designSettings');
      if (!designSettingsData) {
        console.log('ℹ️ Aucun paramètre design à migrer');
        return 0;
      }

      const settings = JSON.parse(designSettingsData);
      console.log('📥 Paramètres design trouvés:', Object.keys(settings).length);
      
      let migrated = 0;
      
      for (const [name, value] of Object.entries(settings)) {
        try {
          await apiService.setDesignSetting(name, value);
          migrated++;
        } catch (error) {
          console.warn(`⚠️ Erreur paramètre design ${name}:`, error.message);
        }
      }

      console.log(`✅ Paramètres design migrés: ${migrated}`);
      return migrated;
    } catch (error) {
      console.error('❌ Erreur migration design settings:', error);
      return 0;
    }
  }

  // Migrer les préférences utilisateur
  async migrateUserPreferences() {
    try {
      console.log('👤 Migration des préférences utilisateur...');
      
      const preferences = {
        current_admin_language: localStorage.getItem('current-admin-language'),
        admin_theme: localStorage.getItem('admin-theme'),
        active_theme: localStorage.getItem('activeTheme')
      };

      let migrated = 0;
      
      for (const [key, value] of Object.entries(preferences)) {
        if (value) {
          try {
            const prefType = typeof value === 'boolean' ? 'boolean' : 'string';
            await apiService.setUserPreference(key, value, prefType);
            migrated++;
          } catch (error) {
            console.warn(`⚠️ Erreur préférence ${key}:`, error.message);
          }
        }
      }

      console.log(`✅ Préférences utilisateur migrées: ${migrated}`);
      return migrated;
    } catch (error) {
      console.error('❌ Erreur migration préférences:', error);
      return 0;
    }
  }

  // Migration complète
  async migrateAll() {
    if (this.isMigrationCompleted()) {
      console.log('ℹ️ Migration déjà effectuée');
      return {
        alreadyCompleted: true,
        backupExists: !!localStorage.getItem(this.backupKey)
      };
    }

    try {
      console.log('🚀 Début de la migration complète localStorage -> API HA');
      
      // Vérifier que l'API est accessible
      const isApiAvailable = await apiService.isApiReachable();
      if (!isApiAvailable) {
        throw new Error('API non accessible - migration impossible');
      }

      // Créer une sauvegarde
      const backup = await this.createBackup();
      
      // Effectuer toutes les migrations
      const results = {
        languages: await this.migrateSiteLanguages(),
        sections: await this.migrateSections(),
        siteSettings: await this.migrateSiteSettings(),
        customThemes: await this.migrateCustomThemes(),
        designSettings: await this.migrateDesignSettings(),
        userPreferences: await this.migrateUserPreferences()
      };

      const totalMigrated = Object.values(results).reduce((sum, count) => sum + count, 0);
      
      // Marquer comme terminé
      this.markMigrationCompleted();

      console.log('🎉 Migration complète terminée !');
      console.log('📊 Résultats:', results);
      console.log(`📈 Total migré: ${totalMigrated} éléments`);

      return {
        success: true,
        results,
        totalMigrated,
        backup: Object.keys(backup)
      };

    } catch (error) {
      console.error('❌ ERREUR Migration complète:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Nettoyer localStorage après vérification
  async cleanupLocalStorage(force = false) {
    if (!force && !this.isMigrationCompleted()) {
      console.warn('⚠️ Migration non terminée, nettoyage annulé');
      return false;
    }

    try {
      const keysToRemove = [
        'onepress-sections',
        'princept-site-settings',
        'current-admin-language',
        'admin-theme',
        'activeTheme',
        'customThemes',
        'designSettings',
        'site-languages'
      ];

      const removed = [];
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          removed.push(key);
        }
      });

      console.log('🗑️ localStorage nettoyé:', removed.length, 'éléments supprimés');
      console.log('🔒 Sauvegarde conservée sous la clé:', this.backupKey);
      
      return {
        success: true,
        removed,
        backupKey: this.backupKey
      };

    } catch (error) {
      console.error('❌ Erreur nettoyage localStorage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Restaurer depuis la sauvegarde (en cas de problème)
  async restoreFromBackup() {
    try {
      const backupData = localStorage.getItem(this.backupKey);
      if (!backupData) {
        throw new Error('Aucune sauvegarde trouvée');
      }

      const backup = JSON.parse(backupData);
      
      Object.entries(backup).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Supprimer le marqueur de migration pour permettre une nouvelle tentative
      localStorage.removeItem(this.migrationKey);
      localStorage.removeItem(`${this.migrationKey}-date`);

      console.log('🔄 localStorage restauré depuis la sauvegarde');
      return {
        success: true,
        restoredKeys: Object.keys(backup)
      };

    } catch (error) {
      console.error('❌ Erreur restauration:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtenir le statut de la migration
  getStatus() {
    const isCompleted = this.isMigrationCompleted();
    const migrationDate = localStorage.getItem(`${this.migrationKey}-date`);
    const hasBackup = !!localStorage.getItem(this.backupKey);

    // Compter les éléments localStorage restants
    const remainingKeys = [
      'onepress-sections',
      'princept-site-settings',
      'current-admin-language',
      'admin-theme',
      'activeTheme',
      'customThemes',
      'designSettings'
    ].filter(key => localStorage.getItem(key));

    return {
      isCompleted,
      migrationDate: migrationDate ? new Date(migrationDate) : null,
      hasBackup,
      remainingLocalStorageKeys: remainingKeys,
      needsCleanup: isCompleted && remainingKeys.length > 0
    };
  }
}

// Instance singleton
const migrationManager = new MigrationManager();

export default migrationManager;

// Export des fonctions utilitaires
export const {
  migrateAll,
  cleanupLocalStorage,
  restoreFromBackup,
  getStatus,
  isMigrationCompleted
} = migrationManager;
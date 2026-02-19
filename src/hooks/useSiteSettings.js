import { useState, useEffect } from 'react';
import siteSettingsStore from '../store/SiteSettingsStoreAPI';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(siteSettingsStore.getSettings());
  
  // Détecter la langue actuelle depuis l'URL ou localStorage
  const getCurrentLanguage = () => {
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
      if (langFromQuery && ['fr', 'en', 'es', 'de', 'it'].includes(langFromQuery)) {
        return langFromQuery;
      }
    }
    
    // Fallback vers français
    return 'fr';
  };
  
  const currentLanguage = getCurrentLanguage();

  useEffect(() => {
    const unsubscribe = siteSettingsStore.subscribe((updatedSettings) => {
      setSettings({ ...updatedSettings });
    });

    return unsubscribe;
  }, []);

  const updateNestedSetting = (path, value) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    siteSettingsStore.updateSettings(newSettings);
  };

  const getVisibleSocialNetworks = () => {
    if (!settings.social) return [];
    
    return Object.entries(settings.social)
      .filter(([, network]) => network.visible && network.url)
      .map(([name, network]) => ({ name, ...network }));
  };

  const getSocialUrls = () => {
    if (!settings.social) return {};
    
    const socialUrls = {};
    Object.entries(settings.social).forEach(([name, network]) => {
      if (network.visible && network.url) {
        socialUrls[name] = network.url;
      }
    });
    return socialUrls;
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'site-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          siteSettingsStore.updateSettings(importedSettings);
          resolve(importedSettings);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  // Fonction utilitaire pour extraire les valeurs multilingues
  const getMultilingualValue = (value, fallbackLanguage = currentLanguage) => {
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'object' && value !== null) {
      // Utiliser d'abord la langue actuelle, puis les fallbacks
      return value[fallbackLanguage] || value['fr'] || value['en'] || Object.values(value)[0] || '';
    }
    
    return '';
  };

  return {
    settings: {
      ...settings,
      socialUrls: getSocialUrls()
    },
    updateSettings: (updates) => siteSettingsStore.updateSettingsLocal(updates),
    updateSetting: (key, value) => siteSettingsStore.updateSetting(key, value),
    updateNestedSetting,
    resetToDefaults: () => siteSettingsStore.resetToDefaults(),
    applyMetaUpdates: () => siteSettingsStore.applyMetaUpdates(),
    saveAllSettings: () => siteSettingsStore.saveAllSettings(),
    getVisibleSocialNetworks,
    getSocialUrls,
    getMultilingualValue,
    exportSettings,
    importSettings
  };
};
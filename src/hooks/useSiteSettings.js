import { useState, useEffect } from 'react';
import siteSettingsStore from '../store/SiteSettingsStore';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(siteSettingsStore.getSettings());

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

  return {
    settings: {
      ...settings,
      socialUrls: getSocialUrls()
    },
    updateSettings: (updates) => siteSettingsStore.updateSettings(updates),
    updateSetting: (key, value) => siteSettingsStore.updateSetting(key, value),
    updateNestedSetting,
    resetToDefaults: () => siteSettingsStore.resetToDefaults(),
    applyMetaUpdates: () => siteSettingsStore.applyMetaUpdates(),
    getVisibleSocialNetworks,
    getSocialUrls,
    exportSettings,
    importSettings
  };
};
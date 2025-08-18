import { useCallback } from 'react';

/**
 * Version admin de useLanguage qui fonctionne sans contexte multilingue
 * Simule le comportement pour l'admin
 */
export const useAdminLanguage = () => {
  // Créer un objet multilingue avec une valeur par défaut
  const createMultilingualObject = useCallback((defaultValue = '') => {
    return {
      fr: defaultValue,
      en: defaultValue
    };
  }, []);

  // Obtenir la valeur localisée (pour l'admin, on retourne toujours le français)
  const getLocalizedValue = useCallback((multilingualValue, fallback = '') => {
    if (typeof multilingualValue === 'string') {
      return multilingualValue;
    }
    if (multilingualValue && typeof multilingualValue === 'object') {
      return multilingualValue.fr || multilingualValue.en || fallback;
    }
    return fallback;
  }, []);

  return {
    createMultilingualObject,
    getLocalizedValue,
    // Propriétés supplémentaires pour compatibilité
    currentLanguage: { id: 'fr', code: 'fr', name: 'Français' },
    availableLanguages: [
      { id: 'fr', code: 'fr', name: 'Français', enabled: true },
      { id: 'en', code: 'en', name: 'English', enabled: true }
    ]
  };
};
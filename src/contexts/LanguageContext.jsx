import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Langues disponibles par défaut
const DEFAULT_LANGUAGES = {
  fr: {
    id: 'fr',
    name: 'Français',
    code: 'fr',
    flag: '🇫🇷',
    isActive: true,
    isDefault: true,
    isRTL: false,
    order: 1
  },
  en: {
    id: 'en',
    name: 'English',
    code: 'en',
    flag: '🇺🇸',
    isActive: true,
    isDefault: false,
    isRTL: false,
    order: 2
  },
  es: {
    id: 'es',
    name: 'Español',
    code: 'es',
    flag: '🇪🇸',
    isActive: true,
    isDefault: false,
    isRTL: false,
    order: 3
  },
  de: {
    id: 'de',
    name: 'Deutsch',
    code: 'de',
    flag: '🇩🇪',
    isActive: true,
    isDefault: false,
    isRTL: false,
    order: 4
  },
  it: {
    id: 'it',
    name: 'Italiano',
    code: 'it',
    flag: '🇮🇹',
    isActive: true,
    isDefault: false,
    isRTL: false,
    order: 5
  },
  ar: {
    id: 'ar',
    name: 'العربية',
    code: 'ar',
    flag: '🇸🇦',
    isActive: true,
    isDefault: false,
    isRTL: true,
    order: 6
  }
};

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState(() => {
    const saved = localStorage.getItem('site-languages');
    return saved ? JSON.parse(saved) : DEFAULT_LANGUAGES;
  });

  const [currentAdminLanguage, setCurrentAdminLanguage] = useState(() => {
    // Langue actuelle pour l'édition dans l'admin
    const saved = localStorage.getItem('current-admin-language');
    if (saved && languages[saved]) {
      return saved;
    }
    // Trouver la langue par défaut directement
    const defaultLang = Object.values(languages).find(lang => lang.isDefault);
    return defaultLang?.id || 'fr';
  });

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Langue actuelle pour l'affichage frontend (basée sur l'URL)
    const defaultLang = Object.values(languages).find(lang => lang.isDefault);
    return defaultLang?.id || 'fr';
  });

  // Sauvegarder les langues dans localStorage
  useEffect(() => {
    localStorage.setItem('site-languages', JSON.stringify(languages));
  }, [languages]);

  // Sauvegarder la langue admin actuelle
  useEffect(() => {
    localStorage.setItem('current-admin-language', currentAdminLanguage);
  }, [currentAdminLanguage]);

  // Obtenir la langue par défaut
  function getDefaultLanguage() {
    return Object.values(languages).find(lang => lang.isDefault);
  }

  // Obtenir les langues actives
  function getActiveLanguages() {
    return Object.values(languages)
      .filter(lang => lang.isActive)
      .sort((a, b) => a.order - b.order);
  }

  // Obtenir toutes les langues
  function getAllLanguages() {
    return Object.values(languages).sort((a, b) => a.order - b.order);
  }

  // Activer/désactiver une langue
  function toggleLanguage(languageId) {
    setLanguages(prev => ({
      ...prev,
      [languageId]: {
        ...prev[languageId],
        isActive: !prev[languageId].isActive
      }
    }));
    
    // Déclencher un événement pour informer les composants frontend
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('languagesUpdated'));
    }, 100);
  }

  // Définir comme langue par défaut
  function setDefaultLanguage(languageId) {
    setLanguages(prev => {
      const updated = { ...prev };
      // Enlever le défaut de toutes les langues
      Object.keys(updated).forEach(key => {
        updated[key].isDefault = false;
      });
      // Définir la nouvelle langue par défaut
      updated[languageId].isDefault = true;
      updated[languageId].isActive = true; // Forcer l'activation
      return updated;
    });
    
    // Déclencher un événement pour informer les composants frontend
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('languagesUpdated'));
    }, 100);
  }

  // Changer l'ordre des langues
  function reorderLanguages(newOrder) {
    setLanguages(prev => {
      const updated = { ...prev };
      newOrder.forEach((languageId, index) => {
        if (updated[languageId]) {
          updated[languageId].order = index + 1;
        }
      });
      return updated;
    });
  }

  // Changer la langue courante de l'admin
  function setAdminLanguage(languageId) {
    if (languages[languageId] && languages[languageId].isActive) {
      setCurrentAdminLanguage(languageId);
    }
  }

  // Changer la langue courante du frontend
  function setCurrentLanguageById(languageId) {
    if (languages[languageId] && languages[languageId].isActive) {
      setCurrentLanguage(languageId);
    }
  }

  // Ajouter une nouvelle langue
  function addLanguage(newLanguage) {
    const maxOrder = Math.max(...Object.values(languages).map(l => l.order || 0), 0);
    
    setLanguages(prev => ({
      ...prev,
      [newLanguage.id]: {
        ...newLanguage,
        order: maxOrder + 1
      }
    }));
    
    // Déclencher un événement pour informer les composants frontend
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('languagesUpdated'));
    }, 100);
  }

  // Mettre à jour une langue existante
  function updateLanguage(languageId, updatedData) {
    setLanguages(prev => ({
      ...prev,
      [languageId]: {
        ...prev[languageId],
        ...updatedData,
        id: languageId // Empêcher la modification de l'ID
      }
    }));
    
    // Déclencher un événement pour informer les composants frontend
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('languagesUpdated'));
    }, 100);
  }

  // Supprimer une langue
  function removeLanguage(languageId) {
    if (languages[languageId]?.isDefault) {
      console.warn('Impossible de supprimer la langue par défaut');
      return;
    }
    
    setLanguages(prev => {
      const updated = { ...prev };
      delete updated[languageId];
      return updated;
    });
    
    // Déclencher un événement pour informer les composants frontend
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('languagesUpdated'));
    }, 100);
  }

  // Obtenir la langue courante de l'admin
  function getCurrentAdminLanguage() {
    return languages[currentAdminLanguage] || getDefaultLanguage();
  }

  // Obtenir la langue courante du frontend
  function getCurrentLanguage() {
    return languages[currentLanguage] || getDefaultLanguage();
  }

  // Créer un objet multilingue vide
  function createMultilingualObject(defaultValue = '') {
    const obj = {};
    getActiveLanguages().forEach(lang => {
      obj[lang.id] = defaultValue;
    });
    return obj;
  }

  // Obtenir la valeur dans la langue appropriée
  function getLocalizedValue(multilingualObject, languageId = null) {
    // Si c'est pas un objet, retourner tel quel comme string
    if (!multilingualObject || typeof multilingualObject !== 'object') {
      const result = String(multilingualObject || '');
      return result;
    }

    // Si c'est un objet vide, retourner chaîne vide
    if (Object.keys(multilingualObject).length === 0) {
      return '';
    }

    // Utiliser currentLanguage pour le frontend, currentAdminLanguage pour l'admin
    const targetLang = languageId || currentLanguage;
    
    // Retourner la valeur dans la langue demandée
    if (multilingualObject[targetLang] && typeof multilingualObject[targetLang] === 'string') {
      return multilingualObject[targetLang];
    }

    // Fallback vers la langue par défaut
    const defaultLang = getDefaultLanguage();
    if (defaultLang && multilingualObject[defaultLang.id] && typeof multilingualObject[defaultLang.id] === 'string') {
      return multilingualObject[defaultLang.id];
    }

    // Fallback vers la première valeur string disponible (accepter les chaînes vides)
    const firstAvailable = Object.values(multilingualObject).find(value => 
      typeof value === 'string'
    );
    
    if (firstAvailable !== undefined) {
      return String(firstAvailable);
    }
    
    // Dernière sécurité : si rien n'est trouvé, retourner chaîne vide
    return '';
  }

  const value = {
    // États
    languages,
    currentAdminLanguage,
    currentLanguage,
    
    // Fonctions utilitaires
    getDefaultLanguage,
    getActiveLanguages,
    getAllLanguages,
    getCurrentAdminLanguage,
    getCurrentLanguage,
    
    // Actions
    toggleLanguage,
    setDefaultLanguage,
    reorderLanguages,
    setAdminLanguage,
    setCurrentLanguage: setCurrentLanguageById,
    addLanguage,
    updateLanguage,
    removeLanguage,
    
    // Helpers pour le contenu multilingue
    createMultilingualObject,
    getLocalizedValue
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState({});
  const [currentAdminLanguage, setCurrentAdminLanguage] = useState('fr');
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(true);
  const [isApiAvailable, setIsApiAvailable] = useState(false);

  // Initialiser les données depuis l'API
  useEffect(() => {
    initializeLanguages();
  }, []);

  const initializeLanguages = async () => {
    try {
      setIsLoading(true);
      
      // Tester la connexion API
      const health = await apiService.healthCheck();
      const apiAvailable = health.status === 'OK';
      setIsApiAvailable(apiAvailable);

      if (apiAvailable) {

        await loadLanguagesFromAPI();
      } else {

        await loadLanguagesFromLocalStorage();
      }
    } catch (error) {

      // Fallback vers localStorage
      await loadLanguagesFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les langues depuis l'API
  const loadLanguagesFromAPI = async () => {
    try {
      const languagesArray = await apiService.getAllLanguages();
      const languagesObject = {};
      
      languagesArray.forEach(lang => {
        languagesObject[lang.id] = {
          id: lang.id,
          name: lang.name,
          code: lang.code,
          flag: lang.flag,
          isActive: lang.is_active,
          isDefault: lang.is_default,
          isRTL: lang.is_rtl,
          order: lang.sort_order
        };
      });

      setLanguages(languagesObject);
      
      // Définir les langues courantes
      const defaultLang = languagesArray.find(lang => lang.is_default);
      if (defaultLang) {
        setCurrentLanguage(defaultLang.id);
        setCurrentAdminLanguage(defaultLang.id);
      }
      

    } catch (error) {

      throw error;
    }
  };

  // Fallback vers localStorage (ancienne méthode)
  const loadLanguagesFromLocalStorage = () => {
    const DEFAULT_LANGUAGES = {
      fr: {
        id: 'fr', name: 'Français', code: 'fr', flag: '🇫🇷',
        isActive: true, isDefault: true, isRTL: false, order: 1
      },
      en: {
        id: 'en', name: 'English', code: 'en', flag: '🇺🇸',
        isActive: true, isDefault: false, isRTL: false, order: 2
      }
    };

    const saved = localStorage.getItem('site-languages');
    const loadedLanguages = saved ? JSON.parse(saved) : DEFAULT_LANGUAGES;
    setLanguages(loadedLanguages);

    const defaultLang = Object.values(loadedLanguages).find(lang => lang.isDefault);
    if (defaultLang) {
      setCurrentLanguage(defaultLang.id);
      setCurrentAdminLanguage(defaultLang.id);
    }
    

  };

  // Sauvegarder dans localStorage (backup)
  const saveToLocalStorage = (languagesData) => {
    localStorage.setItem('site-languages', JSON.stringify(languagesData));
  };

  // Convertir format API vers format frontend
  const apiToFrontendFormat = (apiLang) => ({
    id: apiLang.id,
    name: apiLang.name,
    code: apiLang.code,
    flag: apiLang.flag,
    isActive: apiLang.is_active,
    isDefault: apiLang.is_default,
    isRTL: apiLang.is_rtl,
    order: apiLang.sort_order
  });

  // Convertir format frontend vers format API
  const frontendToApiFormat = (frontendLang) => ({
    id: frontendLang.id,
    name: frontendLang.name,
    code: frontendLang.code,
    flag: frontendLang.flag,
    is_active: frontendLang.isActive,
    is_default: frontendLang.isDefault,
    is_rtl: frontendLang.isRTL,
    sort_order: frontendLang.order
  });

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
  async function toggleLanguage(languageId) {
    try {
      if (isApiAvailable) {
        const updatedLang = await apiService.toggleLanguage(languageId);
        const frontendLang = apiToFrontendFormat(updatedLang);
        
        setLanguages(prev => ({
          ...prev,
          [languageId]: frontendLang
        }));
        
        // Backup localStorage
        const updatedLanguages = { ...languages, [languageId]: frontendLang };
        saveToLocalStorage(updatedLanguages);
        

      } else {
        // Fallback localStorage
        setLanguages(prev => ({
          ...prev,
          [languageId]: {
            ...prev[languageId],
            isActive: !prev[languageId].isActive
          }
        }));
      }
      
      // Déclencher événement
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('languagesUpdated'));
      }, 100);
    } catch (error) {

      throw error;
    }
  }

  // Définir comme langue par défaut
  async function setDefaultLanguage(languageId) {
    try {
      if (isApiAvailable) {
        const updatedLang = await apiService.setDefaultLanguage(languageId);
        const frontendLang = apiToFrontendFormat(updatedLang);
        
        // Mettre à jour toutes les langues (enlever isDefault des autres)
        setLanguages(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            updated[key] = { ...updated[key], isDefault: false };
          });
          updated[languageId] = { ...frontendLang, isDefault: true, isActive: true };
          return updated;
        });
        

      } else {
        // Fallback localStorage
        setLanguages(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            updated[key] = { ...updated[key], isDefault: false };
          });
          updated[languageId] = { ...updated[languageId], isDefault: true, isActive: true };
          return updated;
        });
      }
      
      // Déclencher événement
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('languagesUpdated'));
      }, 100);
    } catch (error) {

      throw error;
    }
  }

  // Ajouter une nouvelle langue
  async function addLanguage(newLanguage) {
    try {
      if (isApiAvailable) {
        const apiData = frontendToApiFormat(newLanguage);
        const createdLang = await apiService.createLanguage(apiData);
        const frontendLang = apiToFrontendFormat(createdLang);
        
        setLanguages(prev => ({
          ...prev,
          [newLanguage.id]: frontendLang
        }));
        

      } else {
        // Fallback localStorage
        const maxOrder = Math.max(...Object.values(languages).map(l => l.order || 0), 0);
        setLanguages(prev => ({
          ...prev,
          [newLanguage.id]: {
            ...newLanguage,
            order: maxOrder + 1
          }
        }));
      }
      
      // Déclencher événement
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('languagesUpdated'));
      }, 100);
    } catch (error) {

      throw error;
    }
  }

  // Mettre à jour une langue existante
  async function updateLanguage(languageId, updatedData) {
    try {
      if (isApiAvailable) {
        const apiData = frontendToApiFormat({ ...languages[languageId], ...updatedData });
        const updatedLang = await apiService.updateLanguage(languageId, apiData);
        const frontendLang = apiToFrontendFormat(updatedLang);
        
        setLanguages(prev => ({
          ...prev,
          [languageId]: frontendLang
        }));
        

      } else {
        // Fallback localStorage
        setLanguages(prev => ({
          ...prev,
          [languageId]: {
            ...prev[languageId],
            ...updatedData,
            id: languageId
          }
        }));
      }
      
      // Déclencher événement
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('languagesUpdated'));
      }, 100);
    } catch (error) {

      throw error;
    }
  }

  // Supprimer une langue
  async function removeLanguage(languageId) {
    try {
      if (languages[languageId]?.isDefault) {
        throw new Error('Impossible de supprimer la langue par défaut');
      }
      
      if (isApiAvailable) {
        await apiService.deleteLanguage(languageId);

      }
      
      setLanguages(prev => {
        const updated = { ...prev };
        delete updated[languageId];
        return updated;
      });
      
      // Déclencher événement
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('languagesUpdated'));
      }, 100);
    } catch (error) {

      throw error;
    }
  }

  // Changer l'ordre des langues
  async function reorderLanguages(newOrder) {
    try {
      if (isApiAvailable) {
        await apiService.reorderLanguages(newOrder);

      }
      
      setLanguages(prev => {
        const updated = { ...prev };
        newOrder.forEach((languageId, index) => {
          if (updated[languageId]) {
            updated[languageId].order = index + 1;
          }
        });
        return updated;
      });
    } catch (error) {

      throw error;
    }
  }

  // Obtenir la langue courante de l'admin
  function getCurrentAdminLanguage() {
    return languages[currentAdminLanguage] || getDefaultLanguage();
  }

  // Obtenir la langue courante du frontend
  function getCurrentLanguage() {
    return languages[currentLanguage] || getDefaultLanguage();
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
    if (!multilingualObject || typeof multilingualObject !== 'object') {
      return String(multilingualObject || '');
    }

    if (Object.keys(multilingualObject).length === 0) {
      return '';
    }

    const targetLang = languageId || currentLanguage;
    
    if (multilingualObject[targetLang] && typeof multilingualObject[targetLang] === 'string') {
      return multilingualObject[targetLang];
    }

    const defaultLang = getDefaultLanguage();
    if (defaultLang && multilingualObject[defaultLang.id] && typeof multilingualObject[defaultLang.id] === 'string') {
      return multilingualObject[defaultLang.id];
    }

    const firstAvailable = Object.values(multilingualObject).find(value => 
      typeof value === 'string'
    );
    
    if (firstAvailable !== undefined) {
      return String(firstAvailable);
    }
    
    return '';
  }

  const value = {
    // États
    languages,
    currentAdminLanguage,
    currentLanguage,
    isLoading,
    isApiAvailable,
    
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
    getLocalizedValue,
    
    // Fonctions de réinitialisation
    initializeLanguages
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
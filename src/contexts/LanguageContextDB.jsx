import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState({});
  const [currentAdminLanguage, setCurrentAdminLanguage] = useState('fr');
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(true);
  const [dbType, setDbType] = useState('unknown'); // 'mysql', 'error'

  // Initialiser les données depuis l'API (MySQL)
  useEffect(() => {
    initializeLanguages();
  }, []);

  const initializeLanguages = async () => {
    try {
      setIsLoading(true);
      
      // Tester la connexion API et identifier le type de base
      let health;
      try {
        health = await apiService.healthCheck();
      } catch (healthError) {

        // Essayer directement getHealth() si healthCheck() échoue
        try {
          health = await apiService.getHealth();
        } catch (directError) {

          throw new Error(`Impossible de se connecter à l'API: ${directError.message}`);
        }
      }
      
      // Vérifier la réponse de santé
      if (!health) {
        throw new Error('Réponse de santé vide');
      }
      
      // Le backend peut retourner status: 'OK' ou directement les données
      const isHealthy = health.status === 'OK' || health.status === 'ok' || 
                       (health.database && health.database.includes('MySQL'));
      
      if (isHealthy) {
        const detectedDbType = (health.database && health.database.includes('MySQL')) || 
                              health.dbType === 'mysql' ? 'mysql' : 'error';
        setDbType(detectedDbType);

        
        await loadLanguagesFromAPI();
      } else {
        setDbType('error');

        throw new Error(`Base de données inaccessible: ${health.error || health.status || 'Unknown'}`);
      }
    } catch (error) {

      setDbType('error');
      // Initialiser avec des langues par défaut minimales pour éviter le crash
      setLanguages({
        fr: {
          id: 'fr', name: 'Français', code: 'fr', flag: '🇫🇷',
          isActive: true, isDefault: true, isRTL: false, order: 1
        }
      });
      // Ne pas throw ici pour éviter de bloquer l'application
      // L'erreur sera visible dans la console
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les langues depuis l'API
  const loadLanguagesFromAPI = async () => {
    try {
      const languagesResponse = await apiService.getAllLanguages();
      const languagesArray = languagesResponse.data || languagesResponse; // Support both formats
      const languagesObject = {};
      
      languagesArray.forEach(lang => {
        languagesObject[lang.id] = {
          id: lang.id,
          name: lang.name,
          code: lang.code,
          flag: lang.flag,
          isActive: Boolean(lang.is_active),
          isDefault: Boolean(lang.is_default),
          isRTL: Boolean(lang.is_rtl),
          order: lang.sort_order || 0
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

  // Convertir format API vers format frontend
  const apiToFrontendFormat = (apiLang) => ({
    id: apiLang.id,
    name: apiLang.name,
    code: apiLang.code,
    flag: apiLang.flag,
    isActive: Boolean(apiLang.is_active),
    isDefault: Boolean(apiLang.is_default),
    isRTL: Boolean(apiLang.is_rtl),
    order: apiLang.sort_order || 0
  });

  // Convertir format frontend vers format API
  const frontendToApiFormat = (frontendLang) => ({
    id: frontendLang.id,
    name: frontendLang.name,
    code: frontendLang.code,
    flag: frontendLang.flag,
    is_active: frontendLang.isActive ? 1 : 0,
    is_default: frontendLang.isDefault ? 1 : 0,
    is_rtl: frontendLang.isRTL ? 1 : 0,
    sort_order: frontendLang.order || 0
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
    if (dbType === 'error') {
      throw new Error('Base de données inaccessible');
    }

    try {
      const updatedLang = await apiService.toggleLanguage(languageId);
      const frontendLang = apiToFrontendFormat(updatedLang);
      
      setLanguages(prev => ({
        ...prev,
        [languageId]: frontendLang
      }));
      

      
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
    if (dbType === 'error') {
      throw new Error('Base de données inaccessible');
    }

    try {
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
    if (dbType === 'error') {
      throw new Error('Base de données inaccessible');
    }

    try {
      const apiData = frontendToApiFormat(newLanguage);
      const createdLang = await apiService.createLanguage(apiData);
      const frontendLang = apiToFrontendFormat(createdLang);
      
      setLanguages(prev => ({
        ...prev,
        [newLanguage.id]: frontendLang
      }));
      

      
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
    if (dbType === 'error') {
      throw new Error('Base de données inaccessible');
    }

    try {
      const apiData = frontendToApiFormat({ ...languages[languageId], ...updatedData });
      const updatedLang = await apiService.updateLanguage(languageId, apiData);
      const frontendLang = apiToFrontendFormat(updatedLang);
      
      setLanguages(prev => ({
        ...prev,
        [languageId]: frontendLang
      }));
      

      
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
    if (dbType === 'error') {
      throw new Error('Base de données inaccessible');
    }

    if (languages[languageId]?.isDefault) {
      throw new Error('Impossible de supprimer la langue par défaut');
    }
    
    try {
      await apiService.deleteLanguage(languageId);
      
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
    if (dbType === 'error') {
      throw new Error('Base de données inaccessible');
    }

    try {
      await apiService.reorderLanguages(newOrder);
      
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

    // Vérifier la langue cible
    if (multilingualObject[targetLang]) {
      if (typeof multilingualObject[targetLang] === 'string') {
        return multilingualObject[targetLang];
      } else if (typeof multilingualObject[targetLang] === 'object') {
        // Si c'est un objet imbriqué, essayer de le résoudre récursivement
        return getLocalizedValue(multilingualObject[targetLang], languageId);
      }
    }

    // Vérifier la langue par défaut
    const defaultLang = getDefaultLanguage();
    if (defaultLang && multilingualObject[defaultLang.id]) {
      if (typeof multilingualObject[defaultLang.id] === 'string') {
        return multilingualObject[defaultLang.id];
      } else if (typeof multilingualObject[defaultLang.id] === 'object') {
        return getLocalizedValue(multilingualObject[defaultLang.id], languageId);
      }
    }

    // Chercher la première valeur string disponible
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
    dbType, // 'mysql', 'error'
    
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
    
    // Fonctions de gestion
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
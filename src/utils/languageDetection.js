// Utilitaires pour la détection et gestion de langue dans les emails

/**
 * Détecte la langue actuelle depuis l'URL, le contexte ou le navigateur
 */
export const detectCurrentLanguage = () => {
  // 1. Détecter depuis l'URL (ex: /fr/contact, /en/about)
  const path = window.location.pathname;
  const urlLangMatch = path.match(/^\/([a-z]{2})\//);
  if (urlLangMatch) {
    return urlLangMatch[1];
  }

  // 2. Détecter depuis le localStorage (préférence utilisateur)
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang) {
    return savedLang;
  }

  // 3. Détecter depuis les headers Accept-Language du navigateur
  const browserLang = navigator.language || navigator.languages?.[0];
  if (browserLang) {
    const langCode = browserLang.split('-')[0]; // 'fr-FR' -> 'fr'
    return langCode;
  }

  // 4. Fallback vers français
  return 'fr';
};

/**
 * Enrichit les données du formulaire avec la langue détectée
 */
export const enrichFormDataWithLanguage = (formData, languageContext = null) => {
  const enrichedData = { ...formData };

  // Ajouter la langue détectée
  if (!enrichedData.language) {
    enrichedData.detectedLanguage = detectCurrentLanguage();
  }

  // Si un contexte de langue est fourni, l'utiliser
  if (languageContext?.currentLanguage) {
    enrichedData.language = languageContext.currentLanguage;
  }

  // Ajouter des métadonnées utiles
  enrichedData.userAgent = navigator.userAgent;
  enrichedData.referrer = document.referrer;
  enrichedData.timestamp = new Date().toISOString();

  return enrichedData;
};

/**
 * Valide si une langue est supportée
 */
export const isLanguageSupported = (language, supportedLanguages) => {
  if (!Array.isArray(supportedLanguages)) {
    return false;
  }
  
  return supportedLanguages.some(lang => 
    lang.id === language || lang.code === language
  );
};

/**
 * Obtient la langue de fallback la plus appropriée
 */
export const getFallbackLanguage = (targetLanguage, supportedLanguages, defaultLang = 'fr') => {
  // Si la langue cible est supportée, la retourner
  if (isLanguageSupported(targetLanguage, supportedLanguages)) {
    return targetLanguage;
  }

  // Chercher une langue par défaut dans les supportées
  const defaultSupported = supportedLanguages.find(lang => lang.isDefault);
  if (defaultSupported) {
    return defaultSupported.id;
  }

  // Chercher la langue de fallback spécifiée
  if (isLanguageSupported(defaultLang, supportedLanguages)) {
    return defaultLang;
  }

  // Retourner la première langue supportée
  return supportedLanguages[0]?.id || 'fr';
};

/**
 * Créer un hook pour utiliser la détection de langue dans les composants React
 */
export const useLanguageDetection = (languageContext) => {
  const getCurrentLanguage = () => {
    if (languageContext?.currentLanguage) {
      return languageContext.currentLanguage;
    }
    return detectCurrentLanguage();
  };

  const enrichFormData = (formData) => {
    return enrichFormDataWithLanguage(formData, languageContext);
  };

  return {
    getCurrentLanguage,
    enrichFormData,
    detectCurrentLanguage,
    isLanguageSupported: (lang) => isLanguageSupported(lang, languageContext?.getActiveLanguages?.() || []),
    getFallbackLanguage: (lang) => getFallbackLanguage(lang, languageContext?.getActiveLanguages?.() || [], languageContext?.getDefaultLanguage?.()?.id)
  };
};

export default {
  detectCurrentLanguage,
  enrichFormDataWithLanguage,
  isLanguageSupported,
  getFallbackLanguage,
  useLanguageDetection
};
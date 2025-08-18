import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Composant wrapper qui applique la direction RTL selon la langue courante
 */
const RTLWrapper = ({ children }) => {
  const { getCurrentLanguage } = useLanguage();
  const currentLang = getCurrentLanguage();
  const isRTL = currentLang?.isRTL || false;

  useEffect(() => {
    // Appliquer la direction au document
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang?.code || 'fr';
    
    // Ajouter/enlever la classe RTL au body pour les styles spéciaux
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }

    console.log(`🌍 RTL Direction set to: ${isRTL ? 'RTL' : 'LTR'} for language: ${currentLang?.name}`);
  }, [isRTL, currentLang]);

  return (
    <div className={`app-content ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
};

export default RTLWrapper;
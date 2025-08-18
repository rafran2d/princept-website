import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ className = '', compact = false }) => {
  const { 
    getActiveLanguages, 
    getDefaultLanguage,
    currentLanguage
  } = useLanguage();
  
  const navigate = useNavigate();
  const { lang } = useParams();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [, setForceUpdate] = useState(0);
  
  // Écouter les changements de langues depuis l'admin
  React.useEffect(() => {
    const handleLanguagesUpdate = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('languagesUpdated', handleLanguagesUpdate);
    return () => window.removeEventListener('languagesUpdated', handleLanguagesUpdate);
  }, []);
  
  // Recalculer à chaque render pour les changements en temps réel
  const activeLanguages = getActiveLanguages();
  const defaultLanguage = getDefaultLanguage();
  
  // Obtenir la langue courante depuis l'URL ou le contexte
  const currentLang = activeLanguages.find(l => l.code === lang || l.id === currentLanguage) || defaultLanguage;

  const handleLanguageChange = (language) => {
    setIsOpen(false);
    
    // Construire la nouvelle URL avec la nouvelle langue
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const newPath = `/${language.code}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    
    navigate(newPath);
  };

  if (activeLanguages.length <= 1) {
    return null; // Ne pas afficher le sélecteur s'il n'y a qu'une langue
  }
  
  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors text-white"
        >
          <span className="text-lg">{currentLang?.flag}</span>
          <span className="text-sm font-medium text-white">{currentLang?.code.toUpperCase()}</span>
          <ChevronDown size={14} className={`text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border min-w-[160px] z-20 overflow-hidden">
              {activeLanguages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                    lang.id === currentLang?.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{lang.name}</div>
                    <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                  </div>
                  {lang.id === currentLang?.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
      >
        <Globe size={18} className="text-gray-500" />
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="font-medium text-gray-700">{currentLang?.name}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border min-w-full z-20 overflow-hidden">
            {activeLanguages.map(lang => (
              <button
                key={lang.id}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                  lang.id === currentLang?.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{lang.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">{lang.name}</div>
                    <div className="text-sm text-gray-500">{lang.code.toUpperCase()}</div>
                  </div>
                </div>
                
                {lang.isDefault && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Défaut
                  </span>
                )}
                
                {lang.id === currentLang?.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Hook personnalisé pour la langue frontend (simplifié avec le routing basé sur l'URL)
export const useFrontendLanguage = () => {
  const { getActiveLanguages, getDefaultLanguage, getLocalizedValue, currentLanguage } = useLanguage();
  
  // Recalculer à chaque render pour prendre en compte les changements de langues actives
  const activeLanguages = getActiveLanguages();
  const defaultLanguage = getDefaultLanguage();
  
  // Obtenir la langue courante depuis l'URL ou le contexte
  const currentLangId = currentLanguage || defaultLanguage?.id || 'fr';

  // Fonction pour obtenir du contenu localisé
  const t = (multilingualContent, fallback = '') => {
    try {
      const result = getLocalizedValue(multilingualContent, currentLangId);
      // S'assurer qu'on retourne toujours une chaîne
      if (result && typeof result === 'string') {
        return result;
      }
      
      // Sécurité supplémentaire : si le résultat est encore un objet
      if (result && typeof result === 'object') {
        console.warn('t() function received object instead of string:', result);
        return String(fallback || '');
      }
      
      return String(fallback || '');
    } catch (error) {
      console.error('Error in t() function:', error, 'Content:', multilingualContent);
      return String(fallback || '');
    }
  };

  return {
    currentLanguage: currentLangId,
    t,
    getActiveLanguages: () => activeLanguages,
    getDefaultLanguage: () => defaultLanguage
  };
};

export default LanguageSelector;
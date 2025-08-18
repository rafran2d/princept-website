import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import RTLWrapper from './RTLWrapper';

const LanguageRouter = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getActiveLanguages, getDefaultLanguage, setCurrentLanguage } = useLanguage();

  useEffect(() => {
    console.log('🔍 LanguageRouter - Current path:', location.pathname);
    
    // Ignorer les routes admin
    if (location.pathname.startsWith('/admin')) {
      console.log('🚫 LanguageRouter - Ignoring admin route');
      return;
    }

    // Extraire la langue du chemin URL (première partie après /)
    const pathParts = location.pathname.split('/').filter(Boolean);
    const langFromPath = pathParts[0]; // fr, en, etc.
    
    console.log('🔍 LanguageRouter - Language from path:', langFromPath);

    // Ignorer si c'est 'admin'
    if (langFromPath === 'admin') {
      console.log('🚫 LanguageRouter - Ignoring admin in path');
      return;
    }

    const activeLanguages = getActiveLanguages();
    const defaultLanguage = getDefaultLanguage();
    const validLanguageCodes = activeLanguages.map(l => l.code);
    
    console.log('🔍 LanguageRouter - Valid languages:', validLanguageCodes);
    console.log('🔍 LanguageRouter - Default language:', defaultLanguage);

    // Si nous sommes sur la racine sans langue
    if (location.pathname === '/') {
      console.log('🔄 LanguageRouter - Redirecting to default language');
      navigate(`/${defaultLanguage.code}`, { replace: true });
      return;
    }

    // Si la langue dans l'URL n'est pas valide
    if (langFromPath && !validLanguageCodes.includes(langFromPath)) {
      console.log('🔄 LanguageRouter - Invalid language, redirecting to default');
      navigate(`/${defaultLanguage.code}`, { replace: true });
      return;
    }

    // Si nous avons une langue valide, la définir comme langue courante
    if (langFromPath && validLanguageCodes.includes(langFromPath)) {
      const selectedLanguage = activeLanguages.find(l => l.code === langFromPath);
      if (selectedLanguage) {
        console.log('✅ LanguageRouter - Setting language to:', selectedLanguage);
        setCurrentLanguage(selectedLanguage.id);
      }
    }
  }, [location.pathname, navigate, getActiveLanguages, getDefaultLanguage, setCurrentLanguage]);

  return <RTLWrapper>{children}</RTLWrapper>;
};

export default LanguageRouter;
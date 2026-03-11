import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContextDB';
import RTLWrapper from './RTLWrapper';

const LanguageRouter = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getActiveLanguages, getDefaultLanguage, setCurrentLanguage } = useLanguage();

  useEffect(() => {
    // Ignorer les routes admin
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // Extraire la langue du chemin URL (première partie après /)
    const pathParts = location.pathname.split('/').filter(Boolean);
    const langFromPath = pathParts[0]; // fr, en, etc.

    // Ignorer si c'est 'admin'
    if (langFromPath === 'admin') {
      return;
    }

    const activeLanguages = getActiveLanguages();
    const defaultLanguage = getDefaultLanguage();
    const validLanguageCodes = activeLanguages.map(l => l.code);

    // Si les langues ne sont pas encore chargées, ne pas rediriger
    if (!activeLanguages.length || !defaultLanguage) {
      return;
    }

    // Si nous sommes sur la racine sans langue
    if (location.pathname === '/') {
      navigate(`/${defaultLanguage.code}`, { replace: true });
      return;
    }

    // Si la langue dans l'URL n'est pas valide
    if (langFromPath && !validLanguageCodes.includes(langFromPath)) {
      navigate(`/${defaultLanguage.code}`, { replace: true });
      return;
    }

    // Si nous avons une langue valide, la définir comme langue courante
    if (langFromPath && validLanguageCodes.includes(langFromPath)) {
      const selectedLanguage = activeLanguages.find(l => l.code === langFromPath);
      if (selectedLanguage) {
        setCurrentLanguage(selectedLanguage.id);
      }
    }
  }, [location.pathname, navigate, getActiveLanguages, getDefaultLanguage, setCurrentLanguage]);

  return <RTLWrapper>{children}</RTLWrapper>;
};

export default LanguageRouter;
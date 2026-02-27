import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import apiService from '../services/apiService';
import { useFrontendLanguage } from './LanguageSelector';
import { useSections } from '../hooks/useSections';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { getThemedComponents } from '../data/themedComponents';
import { predefinedThemes } from '../data/themes';
import LanguageSelector from './LanguageSelector';
import { DefaultFooter } from './footers/AllThemedFooters';

const PageView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();
  const { enabledSections } = useSections();
  const { settings } = useSiteSettings();
  const { isTheme } = useThemeStyles();
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  
  // Obtenir le thème actif et les composants thématiques
  const activeThemeId = localStorage.getItem('activeTheme') || 'default';
  const currentTheme = predefinedThemes[activeThemeId];
  const themedComponents = getThemedComponents(activeThemeId);
  const ThemedHeader = themedComponents.header;
  const ThemedFooter = themedComponents.footer;

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getPage(slug);
      setPage(data);
    } catch (error) {
      console.error('Erreur chargement page:', error);
      setError('Page non trouvée');
    } finally {
      setIsLoading(false);
    }
  };

  const getText = (value, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') {
      // Tenter de parser comme JSON si ça ressemble à un objet multilangue
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object') {
          const langCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
          return parsed[langCode] || parsed.fr || parsed.en || Object.values(parsed)[0] || fallback;
        }
      } catch (e) {
        // Pas du JSON, retourner tel quel
      }
      return value;
    }
    if (typeof value === 'object') {
      const langCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
      return value[langCode] || value.fr || value.en || Object.values(value)[0] || fallback;
    }
    return String(value);
  };

  // Extraire et injecter le CSS du contenu HTML
  useEffect(() => {
    if (!page) return;

    const content = getText(page.content);
    if (!content) return;

    // Créer un élément temporaire pour parser le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Extraire les balises <style>
    const styleTags = tempDiv.querySelectorAll('style');
    let styles = Array.from(styleTags).map(style => style.textContent || style.innerHTML).join('\n');

    // Extraire aussi le CSS des balises <link rel="stylesheet"> (pour référence)
    const linkTags = tempDiv.querySelectorAll('link[rel="stylesheet"]');
    linkTags.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        // Note: Les liens externes nécessiteraient une requête fetch, on les ignore pour l'instant
        console.log('CSS externe détecté:', href);
      }
    });

    // Retirer les balises <style> et <link> du contenu pour éviter la duplication
    styleTags.forEach(style => style.remove());
    linkTags.forEach(link => link.remove());

    // Injecter le CSS dans un style tag dans le head
    if (styles.trim()) {
      const styleId = `page-styles-${slug}`;
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.setAttribute('data-page-slug', slug);
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = styles;

      // Nettoyer le style tag quand le composant est démonté ou quand la page change
      return () => {
        const styleToRemove = document.getElementById(styleId);
        if (styleToRemove) {
          styleToRemove.remove();
        }
      };
    }
  }, [page, slug]);

  // Préparer le contenu HTML sans les balises <style> et <link>
  const getProcessedContent = () => {
    const content = getText(page.content);
    if (!content) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Retirer les balises <style> et <link> du contenu (elles sont injectées dans le head)
    const styleTags = tempDiv.querySelectorAll('style');
    const linkTags = tempDiv.querySelectorAll('link[rel="stylesheet"]');
    styleTags.forEach(style => style.remove());
    linkTags.forEach(link => link.remove());
    
    return tempDiv.innerHTML;
  };

  // Fonction de navigation pour les liens du footer
  const scrollToSection = (sectionType, sectionId = null) => {
    // Trouver la section pour vérifier son mode de navigation
    const section = sectionId 
      ? enabledSections.find(s => s.id === sectionId)
      : enabledSections.find(s => s.type === sectionType);
    
    if (section?.navigationMode === 'newpage') {
      // Rediriger vers la page de section dédiée
      const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
      navigate(`/${currentLangCode}/section/${sectionType}`);
      return;
    }
    
    // Pour les sections onepage, rediriger vers la homepage avec ancre
    const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
    navigate(`/${currentLangCode}#${sectionType}`);
  };

  // Navigation items pour le header et footer
  const navigationItems = enabledSections
    .filter(section => section.navigationMode !== 'newpage')
    .map(section => ({
      id: section.type,
      type: section.type,
      label: t(section.title, section.type.charAt(0).toUpperCase() + section.type.slice(1)),
      sectionId: section.id
    }));

  // Debug: vérifier que les sections sont chargées
  if (import.meta.env.DEV) {
    console.log('🔍 PageView Debug:', {
      enabledSectionsCount: enabledSections?.length || 0,
      navigationItemsCount: navigationItems?.length || 0,
      navigationItems: navigationItems
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header thématique ou navigation par défaut */}
      {ThemedHeader ? (
        <ThemedHeader 
          theme={currentTheme} 
          settings={{
            ...settings,
            siteName: t(settings.siteName),
            logoText: t(settings.logoText),
            siteTagline: t(settings.siteTagline),
            footerText: t(settings.footerText),
            siteDescription: t(settings.siteDescription),
            copyrightText: t(settings.copyrightText),
            mapTitle: t(settings.mapTitle),
            mapDescription: t(settings.mapDescription)
          }}
          navigationItems={navigationItems}
          scrollToSection={(sectionType) => {
            navigate(`/${currentLanguage}#${sectionType}`);
          }}
        />
      ) : (
        /* Beachcomber Style Header */
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg" style={{ borderLeft: '4px solid #D4AF37' }}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo à gauche */}
              <div className="flex-shrink-0 flex items-center">
                {settings?.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt={t(settings.siteName) || 'Logo'} 
                    className="h-12 w-auto object-contain mr-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const textContainer = e.target.parentElement.querySelector('.logo-text-container');
                      if (textContainer) textContainer.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`logo-text-container flex flex-col ${settings?.logoUrl && settings.logoUrl.trim() ? 'hidden' : 'flex'}`}>
                  <span className="text-xl font-serif text-white uppercase tracking-wide">
                    {t(settings?.logoText) || t(settings?.siteName) || ''}
                  </span>
                  {settings?.siteTagline && (
                    <span className="text-xs text-gray-300 uppercase tracking-wider mt-0.5">
                      {t(settings.siteTagline)}
                    </span>
                  )}
                </div>
              </div>

              {/* Menu Navigation au centre */}
              <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/${currentLanguage}#${item.type}`)}
                    className="text-sm font-medium uppercase tracking-wide transition-all duration-300 whitespace-nowrap flex items-center space-x-1 text-gray-300 hover:text-white"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Sélecteur de langue et Admin à droite */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="h-6 w-px bg-gray-600"></div>
                <LanguageSelector compact className="text-white" />
                <a
                  href="/admin"
                  className="text-white px-4 py-2 text-xs font-medium uppercase tracking-wide transition-all duration-200 hover:text-gray-300 whitespace-nowrap"
                  style={{ letterSpacing: '0.1em' }}
                >
                  Admin
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-3">
                <LanguageSelector compact className="text-white" />
                <a
                  href="/admin"
                  className="text-white text-xs font-medium uppercase"
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Contenu principal */}
      <main className={ThemedHeader ? 'pt-20' : 'pt-20'}>
        <div className={`min-h-screen ${isTheme('default') ? 'page-view-wrap' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6 py-10 md:py-14 max-w-4xl">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={isTheme('default') ? 'page-view-back' : 'flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors'}
            >
              <ArrowLeft size={20} />
              <span>Retour</span>
            </button>

            <article className={isTheme('default') ? 'page-view-card' : 'bg-white rounded-lg shadow-lg p-8 md:p-12'}>
              <h1 className={isTheme('default') ? 'page-view-title' : 'text-4xl md:text-5xl font-bold text-gray-900 mb-6'}>
                {getText(page.title)}
              </h1>
              {isTheme('default') && <div className="page-view-title-line" />}
              <div className={isTheme('default') ? 'page-view-prose' : 'prose prose-lg max-w-none'}>
                <div
                  ref={contentRef}
                  className={isTheme('default') ? 'page-view-content' : 'text-gray-700 leading-relaxed'}
                  dangerouslySetInnerHTML={{
                    __html: getProcessedContent()
                  }}
                />
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Footer thématique ou footer par défaut */}
      {ThemedFooter ? (
        <ThemedFooter 
          theme={currentTheme}
          settings={{
            ...settings,
            siteName: t(settings.siteName),
            logoText: t(settings.logoText),
            siteTagline: t(settings.siteTagline),
            footerText: t(settings.footerText),
            siteDescription: t(settings.siteDescription),
            copyrightText: t(settings.copyrightText),
            mapTitle: t(settings.mapTitle),
            mapDescription: t(settings.mapDescription)
          }}
          navigationItems={navigationItems}
          scrollToSection={scrollToSection}
        />
      ) : (
        <DefaultFooter
          theme={currentTheme}
          settings={{
            ...settings,
            siteName: t(settings.siteName),
            logoText: t(settings.logoText),
            siteTagline: t(settings.siteTagline),
            footerText: t(settings.footerText),
            siteDescription: t(settings.siteDescription),
            copyrightText: t(settings.copyrightText),
            mapTitle: t(settings.mapTitle),
            mapDescription: t(settings.mapDescription)
          }}
          navigationItems={navigationItems}
          scrollToSection={scrollToSection}
        />
      )}
    </div>
  );
};

export default PageView;

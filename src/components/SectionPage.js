import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { useSections } from '../hooks/useSections';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SectionRenderer from './SectionRenderer';
import MapSection from './MapSection';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { getThemedComponents } from '../data/themedComponents';
import { predefinedThemes } from '../data/themes';
import { useFrontendLanguage } from './LanguageSelector';

const SectionPage = () => {
  const { sectionType, lang } = useParams();
  const { enabledSections } = useSections();
  const { settings } = useSiteSettings();
  const { isTheme } = useThemeStyles();
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Obtenir le code de la langue courante
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
  
  // Obtenir le thème actif et les composants thématiques
  const activeThemeId = localStorage.getItem('activeTheme') || 'default';
  const currentTheme = predefinedThemes[activeThemeId];
  const themedComponents = getThemedComponents(activeThemeId);

  // Trouver la section spécifique
  const section = enabledSections.find(s => s.type === sectionType);

  // Fonction de navigation pour les headers/footers
  const scrollToSection = (sectionType) => {
    // Find the section configuration to check navigation mode
    const targetSection = enabledSections.find(s => s.type === sectionType);
    
    if (targetSection?.navigationMode === 'newpage') {
      // Redirect to dedicated section page
      window.location.href = `/${currentLangCode}/section/${sectionType}`;
      return;
    }
    
    // For onepage sections, redirect to homepage with anchor
    window.location.href = `/${currentLangCode}/#${sectionType}`;
  };

  // Items de navigation (toutes les sections pour les menus)
  const navigationItems = enabledSections.map(section => ({
    id: section.type,
    label: t(section.title, section.type.charAt(0).toUpperCase() + section.type.slice(1)),
    type: section.type,
    navigationMode: section.navigationMode || 'onepage'
  }));

  // Composants thématiques
  const ThemedHeader = themedComponents.header;
  const ThemedFooter = themedComponents.footer;

  // Si la section n'existe pas, afficher une erreur
  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Section non trouvée
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            La section "{sectionType}" n'existe pas ou n'est pas activée.
          </p>
          <Link
            to={`/${currentLangCode}`}
            className="inline-block text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
            style={{ backgroundColor: 'var(--color-primary)' }}
            onMouseEnter={(e) => e.target.style.filter = 'brightness(0.9)'}
            onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
          >
            Retour à l'accueil
          </Link>
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
          settings={settings}
          navigationItems={navigationItems}
          scrollToSection={scrollToSection}
        />
      ) : (
        /* Corporate Style Header */
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Corporate Logo */}
              <div className="flex-shrink-0 flex items-center">
                {settings.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt={settings.siteName || 'Logo'} 
                    className="h-8 w-auto object-contain mr-3 filter brightness-0 invert"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                ) : null}
                <span className={`text-2xl font-bold text-white tracking-tight ${settings.logoUrl ? 'hidden' : 'inline'}`}>
                  {settings.logoText || settings.siteName || 'Princept CMS'}
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  to={`/${currentLangCode}`}
                  className="text-sm font-medium uppercase tracking-widest transition-all duration-300 pb-1 border-b-2 text-gray-300 border-transparent hover:text-white hover:border-gray-400"
                >
                  Accueil
                </Link>
                {/* Sections en mode newpage */}
                {navigationItems.filter(item => item.navigationMode === 'newpage').map((item) => (
                  <Link
                    key={item.id}
                    to={`/${currentLangCode}/section/${item.type}`}
                    className={`text-sm font-medium uppercase tracking-widest transition-all duration-300 pb-1 border-b-2 ${
                      sectionType === item.type
                        ? 'text-white border-white'
                        : 'text-gray-300 border-transparent hover:text-white hover:border-gray-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Sections en mode onepage - retour vers homepage avec scroll */}
                {navigationItems.filter(item => item.navigationMode === 'onepage').map((item) => (
                  <a
                    key={item.id}
                    href={`/${currentLangCode}/#${item.type}`}
                    className="text-sm font-medium uppercase tracking-widest transition-all duration-300 pb-1 border-b-2 text-gray-300 border-transparent hover:text-white hover:border-gray-400"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="/admin"
                  className="text-gray-900 bg-white px-6 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-200 hover:bg-gray-100"
                  style={{ letterSpacing: '0.1em' }}
                >
                  Admin
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 focus:outline-none p-2 rounded-lg transition-colors duration-200 hover:bg-gray-50"
                  style={{
                    color: isMenuOpen ? 'var(--color-primary)' : undefined
                  }}
                >
                  {isMenuOpen ? '✕' : '☰'}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-gray-100">
                <div className="px-6 py-4 bg-white space-y-2">
                  <Link
                    to={`/${currentLangCode}`}
                    className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Accueil
                  </Link>
                  {/* Sections en mode newpage */}
                  {navigationItems.filter(item => item.navigationMode === 'newpage').map((item) => (
                    <Link
                      key={item.id}
                      to={`/${currentLangCode}/section/${item.type}`}
                      className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                        sectionType === item.type
                          ? 'text-white'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor: sectionType === item.type ? 'var(--color-primary)' : 'transparent'
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {/* Sections en mode onepage - retour vers homepage avec scroll */}
                  {navigationItems.filter(item => item.navigationMode === 'onepage').map((item) => (
                    <a
                      key={item.id}
                      href={`/${currentLangCode}/#${item.type}`}
                      className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {item.label}
                    </a>
                  ))}
                  <a
                    href="/admin"
                    className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Administration
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Breadcrumb */}
      <div className={`${ThemedHeader ? 'pt-20' : 'pt-16'} bg-gray-50 border-b`}>
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to={`/${currentLangCode}`}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1"
            >
              <Home size={16} />
              <span>Accueil</span>
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">
              {t(section.title, section.type.charAt(0).toUpperCase() + section.type.slice(1))}
            </span>
          </nav>
        </div>
      </div>

      {/* Section Content */}
      <main className="min-h-screen">
        <SectionRenderer section={section} />
      </main>

      {/* Map Section */}
      {settings.showMap && (
        <MapSection
          latitude={settings.mapLatitude}
          longitude={settings.mapLongitude}
          zoom={settings.mapZoom}
          title={settings.mapTitle}
          description={settings.mapDescription}
          address={settings.address}
        />
      )}

      {/* Footer thématique ou footer par défaut */}
      {ThemedFooter ? (
        <ThemedFooter 
          theme={currentTheme}
          settings={settings}
          navigationItems={navigationItems}
          scrollToSection={scrollToSection}
        />
      ) : (
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Company Info */}
              <div className="lg:col-span-2">
                {settings.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt={settings.siteName || 'Logo'} 
                    className="h-12 w-auto object-contain mb-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span 
                  className={`text-3xl font-bold bg-clip-text text-transparent mb-6 block ${settings.logoUrl ? 'hidden' : 'block'}`}
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                    filter: 'brightness(1.2)'
                  }}
                >
                  {settings.logoText || ''}
                </span>
                {(settings.footerText || settings.siteDescription) && (
                  <p className="text-gray-400 mb-6 leading-relaxed font-light">
                    {settings.footerText || settings.siteDescription}
                  </p>
                )}
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Navigation</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to={`/${currentLangCode}`}
                      className="text-gray-400 hover:text-white transition-colors duration-200 font-light"
                    >
                      Accueil
                    </Link>
                  </li>
                  {/* Sections en mode newpage */}
                  {navigationItems.filter(item => item.navigationMode === 'newpage').map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/${currentLangCode}/section/${item.type}`}
                        className="text-gray-400 hover:text-white transition-colors duration-200 font-light"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  {/* Sections en mode onepage - retour vers homepage avec scroll */}
                  {navigationItems.filter(item => item.navigationMode === 'onepage').map((item) => (
                    <li key={item.id}>
                      <a
                        href={`/${currentLangCode}/#${item.type}`}
                        className="text-gray-400 hover:text-white transition-colors duration-200 font-light"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Contact</h3>
                <div className="space-y-3 text-gray-400 font-light">
                  {settings.email && <p>{settings.email}</p>}
                  {settings.phone && <p>{settings.phone}</p>}
                  {settings.address && (
                    <p dangerouslySetInnerHTML={{ __html: settings.address.replace(/\n/g, '<br />') }} />
                  )}
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-gray-400 text-sm font-light mb-4 md:mb-0">
                  {settings.copyrightText}
                </div>
                <div className="flex items-center space-x-6">
                  <a
                    href="/admin"
                    className="text-gray-400 transition-colors duration-200 text-sm font-light"
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.target.style.color = ''}
                  >
                    Administration
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default SectionPage;
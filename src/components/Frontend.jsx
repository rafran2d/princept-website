import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ArrowUp } from 'lucide-react';
import { useSections } from '../hooks/useSections';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SectionRenderer from './SectionRenderer';
import SocialLinks from './SocialLinks';
import MapSection from './MapSection';
import FloatingEditWidget from './FloatingEditWidget';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { getThemedComponents } from '../data/themedComponents';
import { predefinedThemes } from '../data/themes';
import LanguageSelector, { useFrontendLanguage } from './LanguageSelector';

const Frontend = () => {
  const { enabledSections } = useSections();
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();
  
  // Filtrer les sections selon leur mode de navigation pour la page d'accueil
  const homepageSections = enabledSections.filter(section => 
    section.navigationMode !== 'newpage'
  );
  const { settings } = useSiteSettings();
  const { isTheme } = useThemeStyles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Obtenir le thème actif et les composants thématiques
  const activeThemeId = localStorage.getItem('activeTheme') || 'default';
  const currentTheme = predefinedThemes[activeThemeId];
  const themedComponents = getThemedComponents(activeThemeId);


  useEffect(() => {
    const handleScroll = () => {
      const sections = homepageSections.map(section => ({
        id: section.type,
        element: document.getElementById(section.type)
      }));

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [homepageSections]);

  // Scroll progress bar + back-to-top (thème default)
  useEffect(() => {
    if (activeThemeId !== 'default') return;
    const handleProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackToTop(scrollTop > 500);
    };
    window.addEventListener('scroll', handleProgress, { passive: true });
    return () => window.removeEventListener('scroll', handleProgress);
  }, [activeThemeId]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Révélation au scroll pour le thème default (agence)
  useEffect(() => {
    if (activeThemeId !== 'default') return;
    const els = document.querySelectorAll('.agency-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('agency-reveal-visible');
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeThemeId, enabledSections]);

  // Gérer le scroll automatique vers une section si il y a une ancre dans l'URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Petit délai pour s'assurer que les sections sont rendues
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, []);

  const scrollToSection = (sectionType, sectionId = null) => {
    // Find the section configuration to check navigation mode
    const section = sectionId 
      ? enabledSections.find(s => s.id === sectionId)
      : enabledSections.find(s => s.type === sectionType);
    
    if (section?.navigationMode === 'newpage') {
      // Redirect to dedicated section page
      // Obtenir le code de la langue courante depuis le contexte
      const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
      window.location.href = `/${currentLangCode}/section/${sectionType}`;
      return;
    }
    
    // Default behavior: scroll to section (onepage mode)
    let element;
    
    if (sectionId) {
      // Scroll to specific section by ID
      element = document.getElementById(`section-${sectionId}`);
    } else {
      // Scroll to first section of this type
      element = document.querySelector(`[data-section-type="${sectionType}"]`);
    }
    
    if (element) {
      // OnePress style smooth scrolling with offset for fixed header
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  // Create navigation items for all sections (including duplicates)
  const navigationItems = enabledSections.map((section, index) => {
    const fallbackLabel = section.type.charAt(0).toUpperCase() + section.type.slice(1);
    const labelValue = t(section.title, fallbackLabel);

    return {
      id: `${section.type}-${section.id}`, // Unique ID combining type and section ID
      label: typeof labelValue === 'string' ? labelValue : fallbackLabel,
      type: section.type,
      sectionId: section.id, // Store the actual section ID
      navigationMode: section.navigationMode || 'onepage'
    };
  });

  // Composants thématiques
  const ThemedHeader = themedComponents.header;
  const ThemedFooter = themedComponents.footer;

  return (
    <div className="min-h-screen">
      {/* Scroll progress bar */}
      {activeThemeId === 'default' && (
        <div
          className="agency-scroll-progress"
          style={{ width: `${scrollProgress}%` }}
        />
      )}

      {/* Back to top */}
      {activeThemeId === 'default' && (
        <button
          className={`agency-back-to-top ${showBackToTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Retour en haut"
        >
          <ArrowUp size={22} strokeWidth={2.5} />
        </button>
      )}

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
          scrollToSection={scrollToSection}
        />
      ) : (
        /* Beachcomber Style Header */
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg" style={{ borderLeft: '4px solid #D4AF37' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo à gauche */}
            <div className="flex-shrink-0 flex items-center">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.siteNameText || 'Logo'} 
                  className="h-12 w-auto object-contain mr-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
              ) : null}
              <div className={`flex flex-col ${settings.logoUrl ? 'hidden' : 'flex'}`}>
                <span className="text-xl font-serif text-white uppercase tracking-wide">
                  {settings.logoText || settings.siteName || ''}
                </span>
                {settings.siteTagline && (
                  <span className="text-xs text-gray-300 uppercase tracking-wider mt-0.5">
                    {settings.siteTagline}
                  </span>
                )}
              </div>
            </div>

            {/* Menu Navigation au centre */}
            <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.type, item.sectionId)}
                  className={`text-sm font-medium uppercase tracking-wide transition-all duration-300 whitespace-nowrap flex items-center space-x-1 ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Sélecteur de langue et Admin à droite */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Séparateur vertical */}
              <div className="h-6 w-px bg-gray-600"></div>
              
              {/* Sélecteur de langue */}
              <LanguageSelector compact className="text-white" />
              
              {/* Admin Button */}
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
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none p-2 rounded-lg transition-colors duration-200 hover:bg-white hover:bg-opacity-10"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Clean Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-700">
              <div className="px-6 py-4 bg-gray-900 space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToSection(item.type, item.sectionId);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 uppercase tracking-wide ${
                      activeSection === item.id
                        ? 'text-white bg-gray-800'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <a
                    href="/admin"
                    className="block w-full text-center text-white px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 uppercase tracking-wide bg-gray-800 hover:bg-gray-700"
                  >
                    Administration
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      )}

      {/* Main Content */}
      <main className={ThemedHeader ? 'pt-20' : ''}>
        {homepageSections.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Bienvenue
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {enabledSections.length === 0 
                  ? "Aucune section n'est activée. Accédez à l'administration pour commencer."
                  : "Toutes les sections sont en mode page séparée. Utilisez la navigation pour y accéder."
                }
              </p>
              <a
                href="/admin"
                className="inline-block text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
                style={{ backgroundColor: 'var(--color-primary)' }}
                onMouseEnter={(e) => e.target.style.filter = 'brightness(0.9)'}
                onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
              >
                Accéder à l'administration
              </a>
            </div>
          </div>
        ) : (
          homepageSections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        )}
      </main>

      {/* Map Section */}
      {settings.showMap && (
        <MapSection
          latitude={settings.mapLatitude}
          longitude={settings.mapLongitude}
          zoom={settings.mapZoom}
          title={t(settings.mapTitle) || ''}
          description={t(settings.mapDescription) || ''}
          address={settings.address}
        />
      )}

      {/* Footer thématique ou footer par défaut */}
      {homepageSections.length > 0 && (
        ThemedFooter ? (
          <ThemedFooter 
            theme={currentTheme}
            settings={{
              ...settings,
              siteName: t(settings.siteName),
              logoText: t(settings.logoText),
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
          <footer className="bg-gray-900 text-white py-16">
          <div className={`mx-auto px-6 ${isTheme('slack') ? 'w-full max-w-6xl' : 'container'}`}>
            {isTheme('slack') ? (
              // Slack-style footer layout
              <>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="md:col-span-1">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 rounded mr-3 flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                        <span className="text-white font-bold text-lg">{t(settings.logoText) ? t(settings.logoText).charAt(0).toUpperCase() : ''}</span>
                      </div>
                      {t(settings.logoText) && <span className="text-xl font-bold">{t(settings.logoText)}</span>}
                    </div>
                    {t(settings.siteDescription) && (
                      <p className="text-sm text-gray-400 mb-6">
                        {t(settings.siteDescription)}
                      </p>
                    )}
                    <SocialLinks />
                  </div>
                  
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">CONTACT</h3>
                    <ul className="space-y-3 text-sm">
                      {settings.email && <li><a href={`mailto:${settings.email}`} className="text-gray-400 hover:text-white transition-colors">{settings.email}</a></li>}
                      {settings.phone && <li><a href={`tel:${settings.phone}`} className="text-gray-400 hover:text-white transition-colors">{settings.phone}</a></li>}
                      {settings.address && <li><span className="text-gray-400">{settings.address}</span></li>}
                    </ul>
                  </div>
                  
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">NAVIGATION</h3>
                    <ul className="space-y-3 text-sm">
                      {navigationItems.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => scrollToSection(item.type, item.sectionId)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">LÉGAL</h3>
                    <ul className="space-y-3 text-sm">
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mentions légales</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-white transition-colors">CGU</a></li>
                      <li><a href="/admin" className="text-gray-400 hover:text-white transition-colors">Administration</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 mt-12 pt-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="mb-4 lg:mb-0">
                      <p className="text-sm text-gray-400">
                        {t(settings.copyrightText) || (t(settings.logoText) ? `©2024 ${t(settings.logoText)}. Tous droits réservés.` : '')}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Conditions d'utilisation</a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Original footer layout for other themes
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {/* Company Info */}
                  <div className="lg:col-span-2">
                    {settings.logoUrl ? (
                      <img 
                        src={settings.logoUrl} 
                        alt={settings.siteNameText || 'Logo'} 
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
                        filter: 'brightness(1.2)' // Slightly brighter for footer
                      }}
                    >
                      {t(settings.logoText) || ''}
                    </span>
                    {(settings.footerText || settings.siteDescription) && (
                      <p className="text-gray-400 mb-6 leading-relaxed font-light">
                        {t(settings.footerText) || t(settings.siteDescription)}
                      </p>
                    )}
                    <SocialLinks />
                  </div>

                  {/* Quick Links */}
                  {settings.showQuickLinks && (
                    <div>
                      <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                      <ul className="space-y-3">
                        {navigationItems.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => scrollToSection(item.type, item.sectionId)}
                              className="text-gray-400 hover:text-white transition-colors duration-200 font-light"
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                      {t(settings.copyrightText)}
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
                      <button
                        onClick={() => window.location.href = '#'}
                        className="text-gray-400 transition-colors duration-200 text-sm font-light"
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.target.style.color = ''}
                      >
                        Privacy Policy
                      </button>
                      <button
                        onClick={() => window.location.href = '#'}
                        className="text-gray-400 transition-colors duration-200 text-sm font-light"
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.target.style.color = ''}
                      >
                        Terms of Service
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </footer>
        )
      )}

      {/* Widget d'édition flottant */}
      <FloatingEditWidget />
    </div>
  );
};

export default Frontend;
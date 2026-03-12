import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SocialLinks from '../SocialLinks';
import MapSection from '../MapSection';
import { useFrontendLanguage } from '../LanguageSelector';


export const Footer = ({ variant = 'default', settings, t, ...rest }) => {
  const getMultilingualText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
      if (field.fr) return field.fr;
      if (field.en) return field.en;
      // Si c'est l'objet corrompu avec indices numériques
      const keys = Object.keys(field);
      if (keys.some(key => !isNaN(key))) {
        return keys
          .filter(key => !isNaN(key))
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(key => field[key])
          .join('');
      }
    }
    return '';
  };

  return (
      <div>
        {settings?.showMap && (
            <MapSection
                latitude={settings.mapLatitude}
                longitude={settings.mapLongitude}
                zoom={settings.mapZoom}
                title={getMultilingualText(settings.mapTitle)}
                description={getMultilingualText(settings.mapDescription)}
                address={settings.address}
            />
        )}

        {variant === 'default' && <DefaultFooter {...rest} settings={settings} />}
        {variant === 'github' && <GitHubFooter {...rest} settings={settings} />}
        {variant === 'airbnb' && <AirbnbFooter {...rest} settings={settings} />}
        {variant === 'spotify' && <SpotifyFooter {...rest} settings={settings} />}
        {/* ... */}
      </div>
  );
};


// 🎯 Default Footer - Beachcomber Style (Dark, Professional, Multi-column)
export const DefaultFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [pages, setPages] = React.useState([]);
  const [isLoadingPages, setIsLoadingPages] = React.useState(true);
  const navigate = useNavigate();
  const { lang } = useParams();
  const { getActiveLanguages, currentLanguage } = useFrontendLanguage();
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || lang || 'fr';

  React.useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setIsLoadingPages(true);
      // Import dynamique pour éviter les erreurs si l'API n'est pas disponible
      const apiService = (await import('../../services/apiService')).default;
      const data = await apiService.getPages();
      setPages((data || []).filter(page => page.isPublished !== false));
    } catch (error) {
      setPages([]);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const getText = (value, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object') {
          return parsed[currentLangCode] || parsed.fr || parsed.en || Object.values(parsed)[0] || fallback;
        }
      } catch {}
      return value;
    }
    if (typeof value === 'object') {
      return value[currentLangCode] || value.fr || value.en || Object.values(value)[0] || fallback;
    }
    return String(value);
  };

  const legalSectionTitle = {
    fr: 'Informations légales',
    en: 'Legal Information',
    es: 'Información Legal',
    it: 'Informazioni Legali',
    de: 'Rechtliches'
  }[currentLangCode] || 'Informations légales';

  // Vérifier si une page "Informations légales" existe
  const hasLegalPages = pages.length > 0;
  const legalPageExists = pages.some(page => 
    getText(page.title, '').toLowerCase().includes('informations légales') ||
    getText(page.title, '').toLowerCase().includes('legal')
  );

  // Préparer tous les liens rapides
  const allQuickLinks = [
    ...(navigationItems || []).map(item => ({
      type: 'button',
      id: item.id,
      label: item.label,
      onClick: () => {
        if (scrollToSection) {
          scrollToSection(item.type, item.sectionId);
        } else {
          // Fallback: rediriger vers la homepage avec ancre
          const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || lang || 'fr';
          window.location.href = `/${currentLangCode}#${item.type}`;
        }
      }
    })),
    {
      type: 'link',
      id: 'admin',
      label: 'Administration',
      href: '/admin'
    }
  ];

  // Diviser en 2 colonnes si plus de 4 éléments
  const shouldSplitQuickLinks = allQuickLinks.length > 4;
  const midPoint = shouldSplitQuickLinks ? Math.ceil(allQuickLinks.length / 2) : allQuickLinks.length;
  const firstColumnLinks = allQuickLinks.slice(0, midPoint);
  const secondColumnLinks = shouldSplitQuickLinks ? allQuickLinks.slice(midPoint) : [];

  return (
    <div>
      <style>{`
        .footer-social-link:hover {
          color: var(--color-primary, #3B82F6) !important;
        }
        .footer-social-link:hover svg {
          color: var(--color-primary, #3B82F6) !important;
        }
      `}</style>
      <footer className="bg-gray-900 text-white">
        {/* Top Section: Social Media Bar */}
        {settings?.showSocialLinks && (
          <div className="bg-gray-800 border-b border-gray-700 py-8">
            <div className="container mx-auto px-6">
              <h3 className="text-center text-white uppercase tracking-wider text-sm font-semibold mb-6">
                Retrouvez-nous sur les réseaux sociaux
              </h3>
              <div className="flex justify-center items-center space-x-6">
                <SocialLinks
                  customStyles={true}
                  linkClassName="w-10 h-10 text-white transition-colors duration-200 flex items-center justify-center footer-social-link"
                  iconStyle={{ color: 'white' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content: Multi-column Layout */}
        <div className="container mx-auto px-6 py-12">
          <div className={`grid grid-cols-1 md:grid-cols-2 ${
            shouldSplitQuickLinks 
              ? (hasLegalPages ? 'lg:grid-cols-4' : 'lg:grid-cols-3')
              : (hasLegalPages ? 'lg:grid-cols-3' : 'lg:grid-cols-2')
          } gap-10 mb-8`}>
            {/* Liens rapides - un seul bloc, une ou deux colonnes de liens */}
            <div className={shouldSplitQuickLinks ? 'lg:col-span-2' : ''}>
              <h4 className="footer-column-title">
                Liens rapides
              </h4>
              <div className="footer-quick-links-grid">
                <ul className="footer-quick-links-list">
                  {firstColumnLinks.map((link) => (
                    <li key={link.id}>
                      {link.type === 'button' ? (
                        <button
                          type="button"
                          onClick={link.onClick}
                          className="footer-quick-link"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a href={link.href} className="footer-quick-link">
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                {shouldSplitQuickLinks && secondColumnLinks.length > 0 && (
                  <ul className="footer-quick-links-list">
                    {secondColumnLinks.map((link) => (
                      <li key={link.id}>
                        {link.type === 'button' ? (
                          <button
                            type="button"
                            onClick={link.onClick}
                            className="footer-quick-link"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <a href={link.href} className="footer-quick-link">
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Column 2: À propos */}
            <div>
              <h4 className="footer-column-title">À propos</h4>
              <ul className="footer-column-list">
                {settings?.address && (
                  <li className="footer-about-text">{settings.address}</li>
                )}
                {settings?.footerText && (
                  <li className="footer-about-text">{getText(settings.footerText)}</li>
                )}
                {settings?.siteDescription && (
                  <li className="footer-about-text">{getText(settings.siteDescription)}</li>
                )}
              </ul>
            </div>

            {/* Column 3: Informations légales / Politique */}
            {hasLegalPages ? (
              <div>
                <h4 className="footer-column-title">{legalSectionTitle}</h4>
                <ul className="footer-column-list">
                  {pages.map((page) => (
                    <li key={page.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/${currentLangCode}/page/${page.slug}`)}
                        className="footer-quick-link"
                      >
                        {getText(page.title, 'Page sans titre')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h4 className="footer-column-title">Politique de l'entreprise</h4>
                <ul className="footer-column-list">
                  <li>
                    <a href="#" className="footer-quick-link">Politique de confidentialité</a>
                  </li>
                  <li>
                    <a href="#" className="footer-quick-link">Mentions légales</a>
                  </li>
                  <li>
                    <a href="#" className="footer-quick-link">Conditions d'utilisation</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Zone contact : séparation nette */}
        {(settings?.phone || settings?.email) && (
          <div className="footer-contact-section">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-10">
                {settings?.phone && (
                  <div className="footer-contact-block">
                    <div className="footer-contact-icon">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <a href={`tel:${settings.phone}`} className="footer-contact-main">
                        {settings.phone}
                      </a>
                      <p className="footer-contact-label">Appelez-nous maintenant</p>
                    </div>
                  </div>
                )}
                {settings?.email && (
                  <div className="footer-contact-block">
                    <div className="footer-contact-icon">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div>
                      <a href={`mailto:${settings.email}`} className="footer-contact-main">
                        Envoyez-nous un e-mail
                      </a>
                      <p className="footer-contact-label">Demandez un devis sur mesure à nos experts</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Copyright : discret */}
        <div className="footer-copyright">
          <div className="container mx-auto px-6">
            <p className="footer-copyright-text">
              {getText(settings?.copyrightText) || `© ${new Date().getFullYear()} ${getText(settings?.siteName) || getText(settings?.logoText) || ''}. Tous droits réservés.`}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// 🚀 GitHub Footer - Authentic GitHub style
export const GitHubFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <div>
      <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              {navigationItems?.slice(0, 4).map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">API</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Help</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              <li><a href="/admin" className="hover:text-blue-600 transition-colors">Admin</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-4">Social</h4>
            <div className="flex space-x-3">
              <SocialLinks customStyles={true} size={20} />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName || 'Logo'}
                className="h-6 w-auto object-contain mr-3"
              />
            ) : (
              <span className="text-lg font-semibold mr-3" style={{ color: 'var(--color-primary)' }}>
                {settings?.logoText || ''}
              </span>
            )}
            <span className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Made with ❤️</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
      </div>
  );
};

// ✈️ Airbnb Footer - Coral design with card layout
export const AirbnbFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <div>
      <footer className="bg-gradient-to-br from-pink-50 via-coral-50 to-orange-50 relative">
      <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>

      <div className="container mx-auto px-6 py-24 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-coral-500 rounded-full mb-6">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName || 'Logo'}
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <span className="text-white font-bold text-2xl">
                {(settings?.logoText || '').charAt(0)}
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {settings?.logoText || ''}
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {settings?.footerText || ''}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
            <h4 className="font-bold mb-6 text-gray-900 text-xl">Quick Links</h4>
            <ul className="space-y-4">
              {navigationItems?.slice(0, Math.ceil(navigationItems.length/2))?.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="text-gray-600 hover:text-pink-600 transition-all duration-300 text-left font-medium flex items-center group"
                  >
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
            <h4 className="font-bold mb-6 text-gray-900 text-xl">More Pages</h4>
            <ul className="space-y-4">
              {navigationItems?.slice(Math.ceil(navigationItems.length/2))?.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="text-gray-600 hover:text-pink-600 transition-all duration-300 text-left font-medium flex items-center group"
                  >
                    <span className="w-2 h-2 bg-coral-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100">
            <h4 className="font-bold mb-6 text-gray-900 text-xl">Connect</h4>
            <p className="text-gray-600 mb-6">Join our community and stay updated!</p>
            <SocialLinks
              customStyles={true}
              size={28}
              iconStyle={{ color: '#EC4899' }}
              className="flex flex-wrap gap-4"
            />
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-coral-100 rounded-xl">
              <p className="text-pink-700 text-sm font-medium">Get 20% off your first booking!</p>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-pink-200 pt-10">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} - Experience the extraordinary
          </p>
        </div>
      </div>
    </footer>
    </div>
  );
};

// 🎵 Spotify Footer - Dark music theme with audio visualizer
export const SpotifyFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <div>
      <footer className="bg-gradient-to-t from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>

      {/* Audio Visualizer Effect */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center space-x-1 pb-4">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="bg-green-500 w-1 opacity-30"
            style={{
              height: `${Math.random() * 40 + 10}px`,
              animationDelay: `${i * 0.1}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-green-500/20 to-transparent p-8 rounded-3xl border border-green-500/30 mb-8">
              <div className="flex items-center mb-6">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    className="h-16 w-auto object-contain mr-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div>
                  <span className={`text-3xl font-black text-white ${settings?.logoUrl ? 'hidden' : 'block'}`}>
                    {settings?.logoText || ''}
                  </span>
                  <div className="flex items-center mt-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-400 text-sm font-medium">Now Playing</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                {settings?.footerText || ''}
              </p>

              {/* Music Player Style Controls */}
              <div className="flex items-center space-x-4 mb-6">
                <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors">
                  <span className="text-black text-xl">▶</span>
                </button>
                <div className="flex-1 h-1 bg-gray-700 rounded-full">
                  <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
                </div>
              </div>

              <SocialLinks
                circularStyle={true}
                size={22}
                iconStyle={{ color: '#000' }}
                circularBgStyle={{ backgroundColor: '#1DB954' }}
                className="flex space-x-4"
              />
            </div>
          </div>

          <div className="lg:col-span-7 grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-8 text-white text-2xl flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-4"></span>
                Explore
              </h4>
              <ul className="space-y-5">
                {navigationItems?.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection?.(item.type, item.sectionId)}
                      className="text-gray-400 hover:text-white transition-all duration-300 text-left font-medium group flex items-center w-full"
                    >
                      <span className="w-1 h-6 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mr-4"></span>
                      <span className="group-hover:translate-x-2 transition-transform text-lg">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-white text-2xl flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-4"></span>
                Playlists
              </h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors">
                  <h5 className="text-white font-semibold mb-1">Daily Mix</h5>
                  <p className="text-gray-400 text-sm">Your personalized playlist updates daily</p>
                </div>
                <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors">
                  <h5 className="text-white font-semibold mb-1">Discover Weekly</h5>
                  <p className="text-gray-400 text-sm">Fresh music recommendations just for you</p>
                </div>
                <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors">
                  <h5 className="text-white font-semibold mb-1">Liked Songs</h5>
                  <p className="text-gray-400 text-sm">All your favorite tracks in one place</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">
            © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
          </p>
          <div className="flex justify-center items-center space-x-8 text-gray-600 text-sm">
            <span>Premium</span>
            <span>•</span>
            <span>Free</span>
            <span>•</span>
            <span>Mobile</span>
            <span>•</span>
            <span>Desktop</span>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

// 💼 Slack Footer - Professional colorful with hexagon layout
export const SlackFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-blue-500 to-green-500"></div>

      {/* Hexagon Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {[...Array(48)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-purple-600 transform rotate-45 opacity-20"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName || 'Logo'}
                  className="h-20 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl">
                    {(settings?.logoText || '').charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
            </div>
          </div>

          <h3 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {settings?.logoText || ''}
          </h3>
          <p className="text-gray-700 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
            {settings?.footerText || ''}
          </p>
        </div>

        {/* Hexagon Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Navigation Hexagon */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-purple-600 rounded-full mr-3"></div>
                <h4 className="font-black text-gray-900 text-2xl">Navigate</h4>
              </div>
              <ul className="space-y-4">
                {navigationItems?.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection?.(item.type, item.sectionId)}
                      className="text-gray-600 hover:text-purple-600 transition-all duration-300 text-left font-semibold group flex items-center w-full p-2 rounded-lg hover:bg-purple-50"
                    >
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-4 group-hover:scale-150 transition-transform"></span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features Hexagon */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                <h4 className="font-black text-gray-900 text-2xl">Features</h4>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h5 className="font-bold text-blue-900 mb-1">Team Collaboration</h5>
                  <p className="text-blue-700 text-sm">Work together seamlessly</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h5 className="font-bold text-blue-900 mb-1">Smart Notifications</h5>
                  <p className="text-blue-700 text-sm">Stay updated without noise</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h5 className="font-bold text-blue-900 mb-1">File Sharing</h5>
                  <p className="text-blue-700 text-sm">Share and sync instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Hexagon */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                <h4 className="font-black text-gray-900 text-2xl">Connect</h4>
              </div>
              <p className="text-gray-600 mb-6">Join thousands of teams already using our platform!</p>

              <div className="mb-6">
                <SocialLinks
                  customStyles={true}
                  size={28}
                  iconStyle={{ color: '#7C3AED' }}
                  className="flex space-x-4 justify-center"
                />
              </div>

              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-xl text-center">
                <p className="text-green-700 font-bold text-sm mb-1">Ready to get started?</p>
                <p className="text-green-600 text-xs">Join 50k+ happy teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center border-t-2 border-gradient-to-r from-purple-200 to-blue-200 pt-12">
          <div className="flex justify-center items-center space-x-6 mb-6">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          <p className="text-gray-700 text-sm font-semibold">
            © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} - Where work happens
          </p>
        </div>
      </div>
    </footer>
  );
};

// 📝 Notion Footer - Clean minimal with block-style layout
export const NotionFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-white border-t border-gray-100 relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 bg-gray-100" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}></div>

      <div className="container mx-auto px-6 py-24 relative">
        {/* Header block */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-12 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-gray-400 rounded-sm mr-3"></div>
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    className="h-10 w-auto object-contain mr-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span className={`text-2xl font-bold text-gray-900 ${settings?.logoUrl ? 'hidden' : 'block'}`}>
                  {settings?.logoText || ''}
                </span>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-sm mr-2"></div>
                  <span className="text-gray-500 text-sm font-mono">About</span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed pl-4 border-l-2 border-gray-200">
                  {settings?.footerText || ''}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-sm mr-2"></div>
                  <span className="text-gray-500 text-sm font-mono">Connect</span>
                </div>
                <SocialLinks
                  customStyles={true}
                  size={22}
                  iconStyle={{ color: '#6B7280' }}
                  className="flex space-x-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation blocks */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {navigationItems?.map((item, index) => (
            <div key={index} className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-6 border border-gray-100 group cursor-pointer"
                 onClick={() => scrollToSection?.(item.type, item.sectionId)}>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-sm mr-3 group-hover:bg-gray-600 transition-colors"></div>
                <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
              </div>
              <div className="mt-3 pl-6">
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div className="w-0 group-hover:w-full h-full bg-gray-400 rounded-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional blocks */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-blue-400 rounded-sm mr-3"></div>
              <h4 className="text-gray-900 font-semibold text-lg">Quick Access</h4>
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-sm mr-3"></div>
                <span className="text-gray-600 text-sm">Documentation</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-sm mr-3"></div>
                <span className="text-gray-600 text-sm">API Reference</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-sm mr-3"></div>
                <span className="text-gray-600 text-sm">Templates</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-sm mr-3"></div>
              <h4 className="text-gray-900 font-semibold text-lg">Resources</h4>
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-sm mr-3"></div>
                <span className="text-gray-600 text-sm">Help Center</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-sm mr-3"></div>
                <span className="text-gray-600 text-sm">Community</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-sm mr-3"></div>
                <span className="text-gray-600 text-sm">Blog</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer block */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-gray-300 rounded-sm mr-3"></div>
            <span className="text-gray-500 text-sm font-mono">Footer</span>
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} - Building blocks for your ideas
          </p>
        </div>
      </div>
    </footer>
  );
};

// 💳 Stripe Footer - Elegant premium with wave design
export const StripeFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="relative overflow-hidden">
      {/* Animated wave background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="text-purple-300"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="text-purple-400"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="text-purple-500"></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        {/* Floating cards layout */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          {/* Main card */}
          <div className="lg:col-span-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center mb-8">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    className="h-16 w-auto object-contain mr-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center mr-6">
                    <span className="text-white font-bold text-2xl">
                      {(settings?.logoText || '').charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-3xl font-bold text-white block mb-2">
                    {settings?.logoText || ''}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-sm">Secure & Trusted</span>
                  </div>
                </div>
              </div>

              <p className="text-white/90 mb-10 text-lg leading-relaxed">
                {settings?.footerText || ''}
              </p>

              <div className="flex items-center space-x-6">
                <SocialLinks
                  customStyles={true}
                  size={26}
                  iconStyle={{ color: 'rgba(255,255,255,0.9)' }}
                  className="flex space-x-5"
                />
                <div className="h-8 w-px bg-white/30"></div>
                <span className="text-white/60 text-sm">Connect with us</span>
              </div>
            </div>
          </div>

          {/* Navigation cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {navigationItems?.map((item, index) => (
                <div key={index}
                     className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                     onClick={() => scrollToSection?.(item.type, item.sectionId)}>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg group-hover:text-purple-200 transition-colors">
                      {item.label}
                    </span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <span className="text-white text-sm">→</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-0 group-hover:w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-700"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h4 className="text-white font-bold text-xl mb-6">Secure Payments</h4>
              <div className="grid grid-cols-4 gap-4">
                {['Visa', 'MC', 'Amex', 'PayPal'].map((method, index) => (
                  <div key={index} className="bg-white/20 rounded-lg p-3 text-center">
                    <span className="text-white/80 text-xs font-medium">{method}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm mt-4">256-bit SSL encryption • PCI DSS compliant</p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/20 pt-12 text-center">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">99.9% Uptime</span>
            </div>
            <div className="w-px h-4 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">24/7 Support</span>
            </div>
            <div className="w-px h-4 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Global Scale</span>
            </div>
          </div>

          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} - Powering online commerce
          </p>
        </div>
      </div>
    </footer>
  );
};

// 🎨 Figma Footer - Creative colorful with design tool layout
export const FigmaFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-white relative overflow-hidden">
      {/* Creative background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-10 left-1/4 w-28 h-28 bg-green-200 rounded-full opacity-35 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-yellow-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-purple-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Toolbar style header */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              {/* Figma-style toolbar buttons */}
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">F</span>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
              </div>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="flex items-center">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    className="h-10 w-auto object-contain mr-3"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span className={`text-2xl font-black text-black ${settings?.logoUrl ? 'hidden' : 'block'}`}>
                  {settings?.logoText || ''}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {settings?.footerText || ''}
          </p>

          <SocialLinks
            customStyles={true}
            size={24}
            iconStyle={{ color: '#374151' }}
            className="flex space-x-5"
          />
        </div>

        {/* Design panels layout */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Layers Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <h4 className="font-bold text-black text-lg flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Navigation
              </h4>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {navigationItems?.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection?.(item.type, item.sectionId)}
                      className="text-gray-600 hover:text-black transition-all duration-300 text-left font-medium group flex items-center w-full p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-4 h-4 bg-gray-300 rounded mr-3 group-hover:bg-blue-500 transition-colors"></div>
                      <span className="flex-1">{item.label}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <h4 className="font-bold text-black text-lg flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Design System
              </h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Colors</h5>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-red-500 rounded border"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded border"></div>
                  <div className="w-6 h-6 bg-green-500 rounded border"></div>
                  <div className="w-6 h-6 bg-yellow-500 rounded border"></div>
                  <div className="w-6 h-6 bg-purple-500 rounded border"></div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Typography</h5>
                <div className="space-y-1">
                  <div className="text-xl font-bold">Heading</div>
                  <div className="text-base">Body text</div>
                  <div className="text-sm text-gray-600">Caption</div>
                </div>
              </div>
            </div>
          </div>

          {/* Assets Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <h4 className="font-bold text-black text-lg flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Components
              </h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                  <div className="w-full h-8 bg-blue-100 rounded mb-2"></div>
                  <span className="text-xs text-gray-600">Button</span>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg hover:border-green-400 transition-colors cursor-pointer">
                  <div className="w-full h-8 bg-green-100 rounded mb-2"></div>
                  <span className="text-xs text-gray-600">Card</span>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                  <div className="w-full h-8 bg-purple-100 rounded mb-2"></div>
                  <span className="text-xs text-gray-600">Modal</span>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg hover:border-red-400 transition-colors cursor-pointer">
                  <div className="w-full h-8 bg-red-100 rounded mb-2"></div>
                  <span className="text-xs text-gray-600">Alert</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-gray-900 text-white rounded-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-sm">© {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}</span>
            <div className="h-4 w-px bg-gray-600"></div>
            <span className="text-sm text-gray-400">Design tool for teams</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">100% zoom</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🎮 Discord Footer - Gaming dark with server layout
export const DiscordFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-gray-800 text-white relative overflow-hidden">
      {/* Gaming grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-8 h-full">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="border border-indigo-500 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Discord-style server layout */}
        <div className="flex gap-8">
          {/* Server sidebar */}
          <div className="w-20 flex flex-col space-y-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl hover:rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer group">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName || 'Logo'}
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {(settings?.logoText || '').charAt(0)}
                </span>
              )}
            </div>

            <div className="w-16 h-1 bg-gray-600 rounded-full mx-auto"></div>

            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-700 rounded-2xl hover:rounded-xl hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center cursor-pointer">
                <span className="text-gray-400 text-xl">#</span>
              </div>
            ))}

            <div className="w-16 h-16 bg-green-600 rounded-2xl hover:rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer">
              <span className="text-white text-2xl">+</span>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-gray-700 rounded-t-xl p-6 border-b border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">#</span>
                  <h3 className="text-2xl font-bold">{settings?.logoText || 'general'}</h3>
                  <div className="h-6 w-px bg-gray-500"></div>
                  <p className="text-gray-300">{settings?.footerText || ''}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Online</span>
                </div>
              </div>
            </div>

            {/* Chat messages style navigation */}
            <div className="bg-gray-750 p-6 min-h-96">
              <div className="space-y-6">
                {navigationItems?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 hover:bg-gray-700/50 p-3 rounded-lg transition-colors cursor-pointer group"
                       onClick={() => scrollToSection?.(item.type, item.sectionId)}>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{item.label.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{item.label}</span>
                        <span className="text-xs text-gray-400">Today at {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</span>
                      </div>
                      <p className="text-gray-300 text-sm">Click to navigate to {item.label.toLowerCase()} section</p>
                    </div>
                  </div>
                ))}

                {/* System message */}
                <div className="flex items-center justify-center my-8">
                  <div className="bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-full text-sm">
                    Welcome to {settings?.siteName || settings?.logoText || 'our server'}! 🎉
                  </div>
                </div>
              </div>
            </div>

            {/* Social links as Discord reactions */}
            <div className="bg-gray-700 rounded-b-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">React with:</span>
                  <SocialLinks
                    circularStyle={true}
                    size={18}
                    iconStyle={{ color: '#FFF' }}
                    circularBgStyle={{ backgroundColor: '#5865F2' }}
                    className="flex space-x-3"
                  />
                </div>
                <div className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
                </div>
              </div>
            </div>
          </div>

          {/* Members sidebar */}
          <div className="w-60 bg-gray-700 rounded-xl p-6">
            <h4 className="font-bold text-white text-lg mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              Online - 1,337
            </h4>

            <div className="space-y-4">
              <div className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Administrators</div>
              <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-600 transition-colors">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-white font-medium">Admin</span>
                <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
              </div>

              <div className="text-xs text-gray-400 uppercase font-semibold tracking-wide mt-6">Members</div>
              {['User1', 'User2', 'User3'].map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-600 transition-colors">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.charAt(4) || 'U'}</span>
                  </div>
                  <span className="text-gray-300">{user}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 💼 LinkedIn Footer - Professional blue
export const LinkedInFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-circuit opacity-10"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="text-center lg:text-left">
            <div className="mb-8">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName || 'Logo'}
                  className="h-16 w-auto object-contain mb-6 mx-auto lg:mx-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span
                className={`text-4xl font-black bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent ${settings?.logoUrl ? 'hidden' : 'block'}`}
              >
                {settings?.logoText || ''}
              </span>
            </div>
            <p className="text-blue-100 mb-8 text-lg max-w-md leading-relaxed">
              {settings?.footerText || ''}
            </p>
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <SocialLinks
                customStyles={true}
                size={24}
                iconStyle={{ color: '#93C5FD' }}
                className="flex space-x-6"
              />
              <div className="flex items-center space-x-3 text-blue-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Connect with professionals worldwide</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-600/30">
            <h4 className="font-bold mb-6 text-white text-xl flex items-center">
              <svg className="w-5 h-5 mr-3 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {navigationItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection?.(item.type, item.sectionId)}
                  className="bg-blue-700/50 hover:bg-blue-600/50 text-blue-100 hover:text-white px-4 py-3 rounded-lg transition-all duration-300 text-left text-sm font-medium border border-blue-600/30 hover:border-blue-400/50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-blue-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm mb-4 md:mb-0 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z"/>
              </svg>
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
            </p>
            <div className="flex items-center space-x-4 text-blue-300 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Professional Network
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🛒 Shopify Footer - E-commerce marketplace design
export const ShopifyFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-white relative">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">Secure Shopping</h3>
              </div>
              <p className="text-green-100 text-sm">SSL encrypted transactions for safe purchases</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">Fast Shipping</h3>
              </div>
              <p className="text-green-100 text-sm">Free delivery on orders over $50</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">Customer Love</h3>
              </div>
              <p className="text-green-100 text-sm">24/7 support and easy returns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="lg:w-1/3">
              <div className="mb-6">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    className="h-12 w-auto object-contain mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span
                  className={`text-2xl font-bold text-gray-800 ${settings?.logoUrl ? 'hidden' : 'block'}`}
                >
                  {settings?.logoText || ''}
                </span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {settings?.footerText || ''}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <SocialLinks
                  customStyles={true}
                  size={20}
                  iconStyle={{ color: '#059669' }}
                  className="flex space-x-4"
                />
              </div>
            </div>

            <div className="lg:w-1/3">
              <h4 className="font-bold mb-6 text-gray-800 text-lg flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
                </svg>
                Quick Links
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {navigationItems?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="text-left text-gray-600 hover:text-green-600 transition-colors py-2 px-3 rounded-lg hover:bg-green-50 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <h4 className="font-bold text-xl mb-4">Newsletter Signup</h4>
                <p className="text-green-100 mb-4 text-sm">Get exclusive deals and updates delivered to your inbox</p>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center text-white/80">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Stay connected with us</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
            <p>© {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}</p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Trusted by 10,000+ customers
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🎬 Netflix Footer - Cinematic streaming experience
export const NetflixFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-900/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <div className="mb-8">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName || 'Logo'}
                className="h-20 w-auto object-contain mb-6 mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <span
              className={`text-5xl font-black text-red-500 ${settings?.logoUrl ? 'hidden' : 'block'}`}
              style={{
                textShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
              }}
            >
              {settings?.logoText || ''}
            </span>
          </div>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            {settings?.footerText || ''}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div className="bg-gradient-to-br from-red-900/30 to-gray-900/50 rounded-2xl p-8 border border-red-800/30 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"/>
                  <path d="M8 8l4 2-4 2V8z" fill="white"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Unlimited Streaming</h3>
            </div>
            <p className="text-gray-300">Watch anywhere, anytime on all your devices</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/30 to-gray-900/50 rounded-2xl p-8 border border-red-800/30 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Original Content</h3>
            </div>
            <p className="text-gray-300">Exclusive movies, series and documentaries</p>
          </div>

          <div className="bg-gradient-to-br from-red-900/30 to-gray-900/50 rounded-2xl p-8 border border-red-800/30 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Mobile Ready</h3>
            </div>
            <p className="text-gray-300">Download and watch offline on mobile</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="text-center lg:text-left">
            <h4 className="font-bold mb-6 text-white text-xl flex items-center justify-center lg:justify-start">
              <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
              </svg>
              Quick Access
            </h4>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {navigationItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection?.(item.type, item.sectionId)}
                  className="bg-gray-800/60 hover:bg-red-600/80 text-gray-300 hover:text-white px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-gray-700/50 hover:border-red-500/50 text-sm font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <SocialLinks
                circularStyle={true}
                size={22}
                iconStyle={{ color: '#fff' }}
                circularBgStyle={{
                  backgroundColor: '#DC2626',
                  boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)'
                }}
                className="flex justify-center space-x-4"
              />
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Streaming worldwide</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} • Entertainment for Everyone
            </p>
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Award Winning Platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🍎 Apple Footer - Minimalist premium
export const AppleFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-white">
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="mb-8">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    className="h-16 w-auto object-contain mb-6 mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span
                  className={`text-4xl font-light text-black ${settings?.logoUrl ? 'hidden' : 'block'}`}
                >
                  {settings?.logoText || ''}
                </span>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                {settings?.footerText || ''}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-16 mb-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-black mb-4">Innovation</h3>
                <p className="text-gray-600 font-light">Pioneering technology that shapes the future</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-black mb-4">Design</h3>
                <p className="text-gray-600 font-light">Beautiful simplicity meets powerful functionality</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-black mb-4">Ecosystem</h3>
                <p className="text-gray-600 font-light">Seamlessly connected across all your devices</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
              <div className="text-center lg:text-left">
                <h4 className="font-medium mb-8 text-black text-lg">Quick Navigation</h4>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {navigationItems?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection?.(item.type, item.sectionId)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black px-4 py-2 rounded-full transition-colors text-sm font-medium border-0"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="mb-6">
                  <SocialLinks
                    customStyles={true}
                    size={20}
                    iconStyle={{ color: '#6B7280' }}
                    className="flex justify-center space-x-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-6 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0 font-light">
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
            </p>
            <div className="flex items-center space-x-6 text-gray-400 text-sm font-light">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Use</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🎨 Dribbble Footer - Creative portfolio showcase
export const DribbbleFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="mb-8">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName || 'Logo'}
                  className="h-16 w-auto object-contain mb-6"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span
                className={`text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent ${settings?.logoUrl ? 'hidden' : 'block'}`}
              >
                {settings?.logoText || ''}
              </span>
            </div>
            <p className="text-gray-700 mb-10 text-xl leading-relaxed">
              {settings?.footerText || ''}
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Creative Inspiration</h4>
                  <p className="text-gray-600 text-sm">Where creativity meets innovation</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Design Community</h4>
                  <p className="text-gray-600 text-sm">Connect with talented designers</p>
                </div>
              </div>

              <div className="pt-6">
                <SocialLinks
                  customStyles={true}
                  size={24}
                  iconStyle={{ color: '#EC4899' }}
                  className="flex space-x-6"
                />
              </div>
            </div>
          </div>

          <div className="lg:ml-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-pink-200/50 shadow-xl">
              <h4 className="font-bold mb-8 text-gray-900 text-2xl flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg mr-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                Portfolio Navigation
              </h4>

              <div className="space-y-4">
                {navigationItems?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="w-full text-left bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 text-gray-700 hover:text-gray-900 p-4 rounded-xl transition-all duration-300 font-medium border border-pink-100 hover:border-pink-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="group-hover:translate-x-2 transition-transform">{item.label}</span>
                      <svg className="w-5 h-5 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl text-white">
                <h5 className="font-bold text-lg mb-2">Featured Work</h5>
                <p className="text-pink-100 text-sm mb-4">Showcase your creative portfolio to the world</p>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                  <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
                  <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                  <div className="text-white/80 text-xs flex items-center ml-2">+12 more</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-pink-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} • Where designers thrive
            </p>
            <div className="flex items-center space-x-4 text-pink-500 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
                Creative Community
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🎥 YouTube Footer - Red video theme with video player layout
export const YoutubeFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Video player background effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70">
        <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Video player style header */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-12 border border-gray-800 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              {/* Play button */}
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer shadow-lg">
                <span className="text-white text-2xl ml-1">▶</span>
              </div>

              <div>
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    className="h-12 w-auto object-contain mb-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <h3 className={`text-3xl font-bold text-white ${settings?.logoUrl ? 'hidden' : 'block'}`}>
                  {settings?.logoText || ''}
                </h3>
                <div className="flex items-center mt-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-red-400 text-sm font-medium">LIVE</span>
                  <span className="text-gray-400 text-sm ml-3">• 1.3M viewers</span>
                </div>
              </div>
            </div>

            {/* Video controls */}
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-white text-lg">⏮</span>
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-white text-lg">⏭</span>
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-white text-sm">HD</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-red-600 rounded-full relative">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full shadow-lg"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>2:34</span>
              <span>7:42</span>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {settings?.footerText || ''}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <SocialLinks
                customStyles={true}
                size={24}
                iconStyle={{ color: '#DC2626' }}
                className="flex space-x-4"
              />
              <div className="h-6 w-px bg-gray-600"></div>
              <span className="text-gray-400 text-sm">Subscribe for updates</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Quality:</span>
              <span className="text-white text-sm bg-red-600 px-3 py-1 rounded">1080p</span>
            </div>
          </div>
        </div>

        {/* Video grid layout */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {navigationItems?.map((item, index) => (
            <div key={index}
                 className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 cursor-pointer group shadow-lg"
                 onClick={() => scrollToSection?.(item.type, item.sectionId)}>
              {/* Video thumbnail */}
              <div className="relative h-32 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <span className="text-white text-4xl opacity-70">▶</span>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(Math.random() * 10) + 1}:0{Math.floor(Math.random() * 6)}
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xl">▶</span>
                </div>
              </div>

              {/* Video info */}
              <div className="p-4">
                <h4 className="text-white font-semibold text-sm mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                  {item.label} - Complete Guide
                </h4>
                <div className="flex items-center text-gray-400 text-xs space-x-2">
                  <span>{Math.floor(Math.random() * 100) + 10}K views</span>
                  <span>•</span>
                  <span>{Math.floor(Math.random() * 7) + 1} days ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer controls */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Streaming Live</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <span className="text-gray-400 text-sm">
                © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>Autoplay: ON</span>
              <span>•</span>
              <span>HD Quality</span>
              <span>•</span>
              <span>Captions: OFF</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 📰 Medium Footer - Clean reading with article layout
export const MediumFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-gray-50 relative overflow-hidden">
      {/* Subtle paper texture */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-gray-100 to-white"></div>

      <div className="container mx-auto px-6 py-24 relative">
        {/* Article-style header */}
        <article className="max-w-4xl mx-auto mb-16">
          <header className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName || 'Logo'}
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-2xl">
                    {(settings?.logoText || '').charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <h1 className={`text-5xl font-serif font-bold text-black mb-4 leading-tight ${settings?.logoUrl ? 'hidden' : 'block'}`}>
              {settings?.logoText || ''}
            </h1>

            <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
              <span className="font-serif">Published</span>
              <span>•</span>
              <time className="font-serif">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>•</span>
              <span className="font-serif">{Math.floor(Math.random() * 5) + 3} min read</span>
            </div>
          </header>

          {/* Article content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-xl leading-relaxed font-serif mb-8 first-letter:text-6xl first-letter:font-bold first-letter:text-green-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
              {settings?.footerText || ''}
            </p>

            <blockquote className="border-l-4 border-green-600 pl-6 py-4 bg-green-50 rounded-r-lg my-8">
              <p className="text-gray-800 font-serif italic text-lg mb-2">
                "Great content deserves a great platform to showcase it."
              </p>
              <cite className="text-gray-600 font-serif text-sm">— The Editorial Team</cite>
            </blockquote>
          </div>
        </article>

        {/* Navigation as article sections */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-serif font-bold text-black mb-8 text-center">Explore More</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {navigationItems?.map((item, index) => (
              <article key={index}
                       className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                       onClick={() => scrollToSection?.(item.type, item.sectionId)}>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-serif font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-0 group-hover:w-full h-full bg-green-500 rounded-full transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-black text-lg mb-3 group-hover:text-green-600 transition-colors">
                  {item.label}
                </h3>

                <p className="text-gray-600 font-serif text-sm mb-4 leading-relaxed">
                  Discover everything about {item.label.toLowerCase()} in our comprehensive guide.
                </p>

                <div className="flex items-center justify-between text-gray-500 text-xs font-serif">
                  <span>{Math.floor(Math.random() * 3) + 2} min read</span>
                  <span className="group-hover:text-green-600 transition-colors">→</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Social sharing */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="font-serif font-bold text-black text-xl mb-2">Share this story</h3>
              <p className="text-gray-600 font-serif">Help others discover great content</p>
            </div>

            <div className="flex justify-center items-center space-x-8">
              <SocialLinks
                customStyles={true}
                size={28}
                iconStyle={{ color: '#059669' }}
                className="flex space-x-6"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm font-serif">
                <span>👏 {Math.floor(Math.random() * 500) + 100} claps</span>
                <span>•</span>
                <span>💬 {Math.floor(Math.random() * 50) + 5} responses</span>
                <span>•</span>
                <span>🔖 {Math.floor(Math.random() * 1000) + 200} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer byline */}
        <div className="max-w-4xl mx-auto text-center border-t border-gray-300 pt-8">
          <p className="text-gray-600 font-serif text-sm mb-4">
            © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
          </p>
          <div className="flex items-center justify-center space-x-6 text-gray-500 text-xs font-serif">
            <span>Editorial Guidelines</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>About</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🎮 Twitch Footer - Purple streaming
export const TwitchFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900 text-white relative overflow-hidden">
      {/* Gaming pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 h-full">
          {Array.from({length: 400}).map((_, i) => (
            <div key={i} className={`border border-purple-600 ${Math.random() > 0.7 ? 'bg-purple-600' : ''}`} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Streaming stats bar */}
        <div className="flex justify-center mb-12">
          <div className="bg-purple-800/50 backdrop-blur-sm rounded-full px-8 py-4 flex space-x-8 border border-purple-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">●</div>
              <div className="text-xs text-purple-400">LIVE</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">24/7</div>
              <div className="text-xs text-purple-400">STREAMING</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">∞</div>
              <div className="text-xs text-purple-400">COMMUNITY</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Logo section with gaming aesthetic */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-purple-800/30 to-transparent p-6 rounded-lg border-l-4 border-purple-500">
              <div className="mb-6">
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.siteName || 'Logo'}
                    className="h-16 w-auto object-contain mb-4 filter drop-shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div className={`${settings?.logoUrl ? 'hidden' : 'block'}`}>
                  <span className="text-3xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {settings?.logoText || ''}
                  </span>
                  <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mt-2 rounded"></div>
                </div>
              </div>
              <p className="text-purple-200 leading-relaxed mb-6">
                {settings?.footerText || ''}
              </p>

              {/* Gaming-style social links */}
              <div className="flex space-x-3">
                <SocialLinks
                  customStyles={true}
                  size={18}
                  iconStyle={{ color: '#FFF' }}
                  className="flex space-x-3"
                />
              </div>
            </div>
          </div>

          {/* Navigation in gaming card style */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-700/30">
              <h4 className="font-bold mb-6 text-purple-300 text-lg flex items-center">
                <span className="mr-2">▶</span> Navigation
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {navigationItems?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="text-left p-3 rounded-lg bg-purple-800/20 hover:bg-purple-700/30 text-purple-200 hover:text-white transition-all duration-300 border border-transparent hover:border-purple-600"
                  >
                    <span className="text-purple-500 mr-2">◆</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gaming status widget */}
          <div>
            <div className="bg-gradient-to-b from-purple-700/30 to-gray-800/30 rounded-lg p-6 border border-purple-600/30">
              <h4 className="font-bold text-purple-300 text-sm mb-4">SERVER STATUS</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-400">API</span>
                  <span className="text-green-400 text-xs font-bold">● ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-400">CHAT</span>
                  <span className="text-green-400 text-xs font-bold">● ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-400">STREAM</span>
                  <span className="text-green-400 text-xs font-bold">● LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gaming-style footer bar */}
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-6"></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} • Level Up Your Experience
            </p>
            <div className="flex items-center space-x-4 text-xs text-purple-500">
              <span className="flex items-center"><span className="mr-1">⚡</span>Powered by Gaming</span>
              <span className="flex items-center"><span className="mr-1">🎮</span>Always Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 📸 Instagram Footer - Gradient social
export const InstagramFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-white relative overflow-hidden">
      {/* Instagram Stories-inspired circular elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-yellow-400/15 to-orange-400/15 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Photo grid header */}
        <div className="text-center mb-16">
          <div className="inline-flex space-x-1 mb-6">
            {Array.from({length: 9}).map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm bg-gradient-to-br ${
                i % 3 === 0 ? 'from-pink-400 to-rose-500' :
                i % 3 === 1 ? 'from-purple-400 to-pink-500' :
                'from-yellow-400 to-orange-500'
              }`}></div>
            ))}
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Share Your Story
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Logo section with photo-like frame */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="mb-6">
                {settings?.logoUrl ? (
                  <div className="relative">
                    <img
                      src={settings.logoUrl}
                      alt={settings.siteName || 'Logo'}
                      className="h-16 w-auto object-contain mb-4 filter drop-shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                ) : null}
                <div className={`${settings?.logoUrl ? 'hidden' : 'block'}`}>
                  <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    {settings?.logoText || ''}
                  </span>
                  <div className="flex space-x-1 mt-2">
                    <div className="h-1 w-6 bg-purple-500 rounded-full"></div>
                    <div className="h-1 w-6 bg-pink-500 rounded-full"></div>
                    <div className="h-1 w-6 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                {settings?.footerText || ''}
              </p>

              {/* Instagram-style social icons */}
              <div className="flex space-x-3">
                <SocialLinks
                  customStyles={true}
                  size={20}
                  iconStyle={{ color: '#E91E63' }}
                  className="flex space-x-3"
                />
              </div>
            </div>
          </div>

          {/* Navigation as story highlights */}
          <div>
            <h4 className="font-bold mb-8 text-gray-900 text-lg flex items-center">
              <span className="mr-3 text-pink-500">📸</span> Quick Access
            </h4>
            <div className="space-y-4">
              {navigationItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection?.(item.type, item.sectionId)}
                  className="w-full group flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-pink-50 hover:to-purple-50 transition-all duration-300 text-left border border-transparent hover:border-pink-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Instagram-style engagement stats */}
          <div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
              <h4 className="font-bold text-gray-900 text-lg mb-6 flex items-center">
                <span className="mr-2">❤️</span> Community
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-bold text-pink-600">10.2K</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Posts</span>
                  <span className="font-bold text-purple-600">247</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Stories</span>
                  <span className="font-bold text-orange-600">Daily</span>
                </div>
              </div>

              {/* Instagram-style CTA button */}
              <button className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Follow Us
              </button>
            </div>
          </div>
        </div>

        {/* Instagram-style bottom bar */}
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 mb-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0 flex items-center">
              <span className="mr-2">📷</span>
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} • Capturing Moments
            </p>
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <span className="flex items-center"><span className="mr-1">✨</span>Verified</span>
              <span className="flex items-center"><span className="mr-1">🌐</span>Global</span>
              <span className="flex items-center"><span className="mr-1">📩</span>DM Open</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 💬 WhatsApp Footer - Green messaging
export const WhatsAppFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-green-50 border-t border-green-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="mb-6">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName || 'Logo'}
                  className="h-12 w-auto object-contain mb-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span
                className={`text-2xl font-bold text-green-900 ${settings?.logoUrl ? 'hidden' : 'block'}`}
              >
                {settings?.logoText || ''}
              </span>
            </div>
            <p className="text-green-800 mb-8 leading-relaxed">
              {settings?.footerText || ''}
            </p>
            <SocialLinks
              customStyles={true}
              size={22}
              iconStyle={{ color: '#059669' }}
              className="flex space-x-4"
            />
          </div>

          <div>
            <h4 className="font-bold mb-6 text-green-900 text-lg">Navigation</h4>
            <ul className="space-y-4">
              {navigationItems?.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="text-green-700 hover:text-green-900 transition-colors text-left font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-green-200 pt-8">
          <p className="text-green-700 text-sm text-center">
            © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
          </p>
        </div>
      </div>
    </footer>
  );
};

// 🎨 Behance Footer - Portfolio blue
export const BehanceFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Creative geometric patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 100 100">
          <defs>
            <pattern id="creative-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2" fill="#1e40af"/>
              <rect x="0" y="0" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#creative-grid)"/>
        </svg>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-blue-200/30 transform rotate-45"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Creative header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded"></div>
            <h3 className="text-2xl font-bold text-gray-800">Creative Portfolio</h3>
            <div className="w-8 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"></div>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">Showcasing creativity through exceptional design and innovation</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          {/* Brand section with creative frame */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-1"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="mb-6">
                  {settings?.logoUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={settings.logoUrl}
                        alt={settings.siteName || 'Logo'}
                        className="h-16 w-auto object-contain mb-4"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✦</span>
                      </div>
                    </div>
                  ) : null}
                  <div className={`${settings?.logoUrl ? 'hidden' : 'block'}`}>
                    <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {settings?.logoText || ''}
                    </span>
                    <div className="flex space-x-2 mt-3">
                      <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-8 h-2 bg-indigo-500 rounded-full"></div>
                      <div className="w-6 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-8">
                  {settings?.footerText || ''}
                </p>

                {/* Creative social links */}
                <div className="flex space-x-4">
                  <SocialLinks
                    customStyles={true}
                    size={18}
                    iconStyle={{ color: '#4F46E5' }}
                    className="flex space-x-4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio grid navigation */}
          <div>
            <h4 className="font-bold mb-8 text-gray-800 text-lg flex items-center">
              <span className="mr-3 text-blue-600">🎨</span> Portfolio
            </h4>
            <div className="space-y-3">
              {navigationItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection?.(item.type, item.sectionId)}
                  className="w-full group flex items-center justify-between p-4 rounded-xl bg-white hover:bg-blue-50 transition-all duration-300 text-left border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                      <span className="text-white font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Creative stats */}
          <div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h4 className="font-bold text-lg mb-6 flex items-center">
                <span className="mr-2">💼</span> Projects
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Completed</span>
                  <span className="font-bold text-2xl">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Awards</span>
                  <span className="font-bold text-2xl">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Clients</span>
                  <span className="font-bold text-2xl">89</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-400/30">
                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg">
                  View Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Creative footer bar */}
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 mb-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0 flex items-center">
              <span className="mr-2">✦</span>
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} • Creative Excellence
            </p>
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <span className="flex items-center"><span className="mr-1">🎯</span>Award Winning</span>
              <span className="flex items-center"><span className="mr-1">🚀</span>Innovation</span>
              <span className="flex items-center"><span className="mr-1">💡</span>Creative</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🚗 Uber Footer - Black and white
export const UberFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Tech grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {Array.from({length: 144}).map((_, i) => (
            <div key={i} className={`border border-gray-700 ${i % 7 === 0 ? 'bg-green-500/20' : ''}`} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Modern mobility header */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl px-12 py-6 border border-gray-700">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-black font-bold">🚗</span>
                </div>
                <div className="text-xs text-gray-400">ON DEMAND</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold">24/7</span>
                </div>
                <div className="text-xs text-gray-400">AVAILABLE</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold">∞</span>
                </div>
                <div className="text-xs text-gray-400">CITIES</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          {/* Brand section with tech aesthetic */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl blur-xl"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                <div className="mb-6">
                  {settings?.logoUrl ? (
                    <div className="relative">
                      <img
                        src={settings.logoUrl}
                        alt={settings.siteName || 'Logo'}
                        className="h-16 w-auto object-contain mb-4 filter brightness-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  ) : null}
                  <div className={`${settings?.logoUrl ? 'hidden' : 'block'}`}>
                    <span className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {settings?.logoText || ''}
                    </span>
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                      </div>
                      <span className="text-green-400 text-sm font-mono">CONNECTED</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed mb-8">
                  {settings?.footerText || ''}
                </p>

                {/* Tech social links */}
                <div className="flex space-x-4">
                  <SocialLinks
                    customStyles={true}
                    size={18}
                    iconStyle={{ color: '#10B981' }}
                    className="flex space-x-4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation with mobility theme */}
          <div>
            <h4 className="font-bold mb-8 text-white text-lg flex items-center">
              <span className="mr-3 text-green-500">🎯</span> Quick Routes
            </h4>
            <div className="space-y-3">
              {navigationItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection?.(item.type, item.sectionId)}
                  className="w-full group flex items-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 text-left border border-gray-700 hover:border-green-500/50"
                >
                  <div className="relative mr-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xs font-bold">→</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity"></div>
                  </div>
                  <span className="text-gray-300 group-hover:text-white font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time status */}
          <div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <h4 className="font-bold text-white text-lg mb-6 flex items-center">
                <span className="mr-2">📊</span> Live Stats
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400 text-sm">Active Rides</span>
                  <div className="flex items-center">
                    <span className="font-bold text-green-400 text-lg">1,247</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400 text-sm">Drivers Online</span>
                  <div className="flex items-center">
                    <span className="font-bold text-blue-400 text-lg">3,892</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400 text-sm">Cities</span>
                  <div className="flex items-center">
                    <span className="font-bold text-purple-400 text-lg">150+</span>
                    <div className="w-2 h-2 bg-purple-500 rounded-full ml-2 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300">
                Get Moving
              </button>
            </div>
          </div>
        </div>

        {/* Modern footer bar */}
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent mb-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center">
              <span className="mr-2">🚀</span>
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''} • Moving Forward Together
            </p>
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <span className="flex items-center"><span className="mr-1">⚡</span>Fast</span>
              <span className="flex items-center"><span className="mr-1">🔒</span>Secure</span>
              <span className="flex items-center"><span className="mr-1">🌍</span>Global</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🔮 Cursor Footer - AI editor
export const CursorFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  return (
      <div>
    <footer className="bg-gray-950 text-green-400 relative overflow-hidden font-mono">
      {/* Code matrix effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-16 h-full text-xs">
          {Array.from({length: 256}).map((_, i) => (
            <div key={i} className="border border-gray-800 p-1 text-center">
              {Math.random() > 0.7 ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : ''}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Terminal header */}
        <div className="bg-gray-900 rounded-t-lg border border-gray-800 mb-8">
          <div className="flex items-center px-4 py-3 border-b border-gray-800">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm">cursor-ai-footer v2.1.0</span>
            <div className="ml-auto flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-400 text-xs">AI ACTIVE</span>
            </div>
          </div>

          <div className="p-6">
            <div className="text-green-400 text-sm mb-4">
              <span className="text-gray-500">$</span> cursor --version && echo "Welcome to AI-powered development"
            </div>
            <div className="text-white text-xl mb-2">AI Code Editor Footer</div>
            <div className="text-gray-400 text-sm">Intelligent development environment at your service</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Brand section with terminal theme */}
          <div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-green-500 mr-2">●</span>
                  <span className="text-gray-400 text-sm">SYSTEM STATUS</span>
                </div>
                {settings?.logoUrl ? (
                  <div className="relative mb-4">
                    <img
                      src={settings.logoUrl}
                      alt={settings.siteName || 'Logo'}
                      className="h-12 w-auto object-contain filter brightness-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ) : null}
                <div className={`${settings?.logoUrl ? 'hidden' : 'block'} mb-4`}>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    {settings?.logoText || ''}
                  </span>
                  <div className="flex items-center mt-2">
                    <span className="text-green-500 text-xs mr-2">{'>'}</span>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-green-500 to-blue-500 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-gray-500 text-xs mb-2">// Description</div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {settings?.footerText || ''}
                </p>
              </div>

              {/* Code-style social links */}
              <div className="border-t border-gray-800 pt-4">
                <div className="text-gray-500 text-xs mb-2">// Social connections</div>
                <div className="flex space-x-3">
                  <SocialLinks
                    customStyles={true}
                    size={16}
                    iconStyle={{ color: '#10B981' }}
                    className="flex space-x-3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation as code structure */}
          <div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h4 className="text-green-400 font-bold mb-6 flex items-center">
                <span className="mr-2">📁</span> Project Structure
              </h4>
              <div className="space-y-2">
                {navigationItems?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="w-full group flex items-center p-3 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 text-left border-l-2 border-transparent hover:border-green-500"
                  >
                    <span className="text-gray-500 mr-3 text-xs font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-blue-400 mr-2">📄</span>
                    <span className="text-gray-300 group-hover:text-white font-mono text-sm">
                      {item.label.toLowerCase().replace(/\s+/g, '_')}.js
                    </span>
                    <span className="ml-auto text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Assistant panel */}
          <div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-green-500/30">
              <h4 className="text-green-400 font-bold mb-6 flex items-center">
                <span className="mr-2">🤖</span> AI Assistant
              </h4>

              <div className="space-y-4">
                <div className="bg-gray-950/50 rounded-md p-3 border border-gray-700">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-400 text-xs font-bold">ONLINE</span>
                  </div>
                  <p className="text-gray-300 text-xs">
                    AI is ready to assist with code generation, debugging, and optimization.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Code Completion</span>
                    <span className="text-green-400">●</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Error Detection</span>
                    <span className="text-green-400">●</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Smart Refactoring</span>
                    <span className="text-green-400">●</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-3 rounded-md hover:from-green-700 hover:to-blue-700 transition-all duration-300 text-sm">
                Start Coding →
              </button>
            </div>
          </div>
        </div>

        {/* Terminal footer */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-gray-400 mb-2 md:mb-0 font-mono">
              <span className="text-green-500">$</span>
              © {new Date().getFullYear()} {settings?.siteName || settings?.logoText || ''}
              <span className="text-gray-600 mx-2">|</span>
              <span className="text-blue-400">Powered by AI</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500 font-mono">
              <span className="flex items-center">
                <span className="text-green-500 mr-1">⚡</span>Fast
              </span>
              <span className="flex items-center">
                <span className="text-blue-500 mr-1">🧠</span>Smart
              </span>
              <span className="flex items-center">
                <span className="text-purple-500 mr-1">🔮</span>AI-Powered
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFrontendLanguage } from '../LanguageSelector';
import LanguageSelector from '../LanguageSelector';

// 🚀 Default Header - Design agence : glassmorphism, nav pill, animations
export const DefaultHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage, getActiveLanguages, t } = useFrontendLanguage();
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
  
  // Fonction helper pour obtenir une valeur traduite ou une chaîne
  const getText = (value, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return t(value, fallback);
    }
    return String(value);
  };

  return (
    <>
      {/* Beachcomber Style Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo à gauche */}
            <div
              className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate(`/${currentLangCode}`)}
            >
              {settings?.logoUrl && settings.logoUrl.trim() ? (
                <img
                  src={settings.logoUrl}
                  alt={getText(settings.siteName, 'Logo')}
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
                  {getText(settings?.logoText) || getText(settings?.siteName) || ''}
                </span>
                {settings?.siteTagline && (
                  <span className="text-xs text-gray-300 uppercase tracking-wider mt-0.5">
                    {getText(settings.siteTagline)}
                  </span>
                )}
              </div>
            </div>

            {/* Menu Navigation au centre */}
            <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
              {navigationItems?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection?.(item.type, item.sectionId)}
                  className="agency-nav-link text-sm font-medium uppercase tracking-wide transition-all duration-300 whitespace-nowrap text-gray-300 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Sélecteur de langue à droite */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Séparateur vertical */}
              <div className="h-6 w-px bg-gray-600"></div>
              
              {/* Sélecteur de langue */}
              <LanguageSelector compact className="text-white" />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <LanguageSelector compact className="text-white" />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none p-2 rounded-lg transition-colors duration-200 hover:bg-white hover:bg-opacity-10"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-700">
              <div className="px-6 py-4 bg-gray-900 space-y-2">
                {navigationItems?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToSection?.(item.type, item.sectionId);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 uppercase tracking-wide text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
export const GitHubHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <>
        {/* Main header bar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <div className="flex items-center">
              {settings?.logoUrl ? (
                  <img
                      src={settings.logoUrl}
                      alt={settings.siteName || 'Logo'}
                      className="h-12 w-auto object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                  />
              ) : null}
              <span className={`text-2xl font-bold text-white ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
            </div>

            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white p-2 hover:bg-gray-800 rounded"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Floating navigation pill */}
        <nav className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 hidden md:block">
          <div className="bg-black/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-gray-700">
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                  <button
                      key={item.id}
                      onClick={() => scrollToSection(item.type, item.sectionId)}
                      className="text-gray-300 hover:text-white text-sm font-medium transition-all duration-300 px-3 py-1 rounded-full hover:bg-gray-700"
                  >
                    {item.label}
                  </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
            <div className="fixed inset-0 z-40 md:hidden bg-gray-900">
              <div className="pt-20 px-6">
                {navigationItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                          scrollToSection(item.type, item.sectionId);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left py-4 text-white text-lg hover:bg-gray-800 transition-colors"
                    >
                      {item.label}
                    </button>
                ))}
              </div>
            </div>
        )}
      </>
  );
};
// 🏠 Airbnb Header - Centered with search bar style
export const AirbnbHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-6">
        {/* Top row with logo and mobile menu */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-2xl font-bold text-pink-500 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Search bar style navigation */}
        <div className="hidden md:flex items-center justify-center pb-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.type, item.sectionId)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 hover:bg-gray-50 ${
                  index === 0 ? 'rounded-l-full' : 
                  index === navigationItems.length - 1 ? 'rounded-r-full' : ''
                } ${index !== navigationItems.length - 1 ? 'border-r border-gray-200' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-3 text-gray-700 hover:text-pink-500 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

// 🎵 Spotify Header - Minimal top bar with side navigation indicator
export const SpotifyHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  return (
    <>
      {/* Slim top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black h-12">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-lg font-bold text-green-400 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-1"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Side navigation tabs */}
      <nav className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
        <div className="bg-gray-800 rounded-2xl p-2 shadow-2xl">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setActiveItem(item.id);
              }}
              onMouseEnter={() => setActiveItem(item.id)}
              onMouseLeave={() => setActiveItem(null)}
              className={`block w-12 h-12 rounded-xl mb-2 transition-all duration-300 text-xs font-medium ${
                activeItem === item.id 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={item.label}
            >
              {item.label.charAt(0)}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black pt-12">
          <div className="px-6 pt-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-4 text-white hover:text-green-400 transition-colors text-lg"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 💼 Slack Header - Split header with colorful nav pills
export const SlackHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const colors = ['bg-purple-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500', 'bg-pink-500'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto">
        {/* Main header row */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-2xl font-bold text-purple-600 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Colorful navigation pills */}
        <div className="hidden md:flex items-center justify-center py-3 space-x-2">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.type, item.sectionId)}
              className={`px-4 py-2 rounded-full text-white text-sm font-medium hover:scale-105 transition-transform ${
                colors[index % colors.length]
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left py-3 px-4 mb-2 rounded-lg text-white font-medium ${
                colors[index % colors.length]
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

// 📝 Notion Header - Clean with animated underline tabs
export const NotionHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-bold text-gray-800 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          {/* Desktop navigation with animated tabs */}
          <nav className="hidden md:flex items-center relative">
            <div className="flex space-x-8 relative">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.type, item.sectionId);
                    setActiveTab(index);
                  }}
                  onMouseEnter={() => setActiveTab(index)}
                  className="text-gray-600 hover:text-gray-900 py-2 px-4 transition-colors duration-200 relative"
                >
                  {item.label}
                  {activeTab === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300"></div>
                  )}
                </button>
              ))}
            </div>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t px-6 py-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded px-4 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

// 💳 Stripe Header - Gradient bar with floating buttons
export const StripeHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Gradient top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-bold text-white ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Floating navigation buttons */}
      <nav className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 hidden md:block">
        <div className="flex space-x-3">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.type, item.sectionId)}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium border"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 pt-16">
          <div className="px-6 pt-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-4 text-white hover:bg-white/10 transition-colors text-lg rounded px-4 mb-2"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

// 🎨 Figma Header - Grid layout with modular navigation
export const FigmaHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <>
      {/* Fixed top toolbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-100 border-b border-gray-200 h-14">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-lg font-medium text-gray-800 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-200 rounded"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Grid navigation modules */}
      <nav className="fixed top-16 left-4 z-40 hidden md:block">
        <div className="grid grid-cols-2 gap-2 w-48">
          {navigationItems.map((item, index) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative"
            >
              <button
                onClick={() => scrollToSection(item.type, item.sectionId)}
                className={`w-full h-16 bg-white border-2 rounded-lg p-3 text-sm font-medium transition-all duration-200 ${
                  hoveredItem === item.id 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <div className={`w-6 h-6 rounded mb-1 ${
                    index % 4 === 0 ? 'bg-red-400' :
                    index % 4 === 1 ? 'bg-green-400' :
                    index % 4 === 2 ? 'bg-blue-400' : 'bg-purple-400'
                  }`}></div>
                  <div className="text-xs text-gray-600 truncate">{item.label}</div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white pt-14">
          <div className="p-4 grid grid-cols-2 gap-3">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="h-20 bg-gray-50 border border-gray-200 rounded-lg p-3 text-left"
              >
                <div className={`w-8 h-8 rounded mb-2 ${
                  index % 4 === 0 ? 'bg-red-400' :
                  index % 4 === 1 ? 'bg-green-400' :
                  index % 4 === 2 ? 'bg-blue-400' : 'bg-purple-400'
                }`}></div>
                <div className="text-sm font-medium text-gray-700">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 🎮 Discord Header - Gaming style with hexagonal navigation
export const DiscordHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHex, setActiveHex] = useState(0);

  return (
    <>
      {/* Dark gaming header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-purple-500/20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-bold text-purple-400 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-gray-800 rounded"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Hexagonal navigation */}
      <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 hidden md:block">
        <div className="flex items-center space-x-2">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setActiveHex(index);
              }}
              onMouseEnter={() => setActiveHex(index)}
              className="relative group"
              style={{
                width: '60px',
                height: '52px',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
              }}
            >
              <div className={`w-full h-full transition-all duration-300 ${
                activeHex === index 
                  ? 'bg-purple-500' 
                  : 'bg-gray-700 group-hover:bg-gray-600'
              }`}></div>
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                {item.label.charAt(0)}
              </span>
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-gray-900 pt-16">
          <div className="px-6 pt-6">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-4 px-6 mb-3 bg-gray-800 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
              >
                <span className="text-purple-400 mr-3">#{index + 1}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 💼 LinkedIn Header - Professional with breadcrumb style navigation
export const LinkedInHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(['Home']);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto">
        {/* Main header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-semibold text-blue-700 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Breadcrumb navigation */}
        <div className="hidden md:flex items-center px-6 py-3 bg-gray-50">
          <div className="flex items-center space-x-2">
            {currentPath.map((path, index) => (
              <div key={index} className="flex items-center">
                <span className="text-gray-600 text-sm">{path}</span>
                {index < currentPath.length - 1 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Professional navigation tabs */}
        <nav className="hidden md:flex items-center px-6 py-2 bg-white border-b">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setCurrentPath(['Home', item.label]);
              }}
              className="px-4 py-2 mr-6 text-gray-600 hover:text-blue-700 text-sm font-medium border-b-2 border-transparent hover:border-blue-700 transition-all duration-200"
            >
              {item.label}
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {index + 1}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-3 px-4 mb-2 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{item.label}</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {index + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

// 🛒 Shopify Header - E-commerce with tabbed navigation
export const ShopifyHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* E-commerce header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-bold ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-green-700 rounded"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Tabbed navigation */}
      <nav className="fixed top-16 left-0 right-0 z-40 hidden md:block bg-white border-b shadow-sm">
        <div className="container mx-auto">
          <div className="flex">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setActiveTab(index);
                }}
                className={`flex-1 py-4 px-6 text-center font-medium border-b-3 transition-all duration-200 ${
                  activeTab === index
                    ? 'bg-green-50 text-green-600 border-green-600'
                    : 'bg-white text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center text-white text-sm font-bold ${
                    activeTab === index ? 'bg-green-600' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-green-600 pt-16">
          <div className="px-6 pt-6">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-4 px-6 mb-3 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 🎬 Netflix Header - Cinematic with overlay navigation
export const NetflixHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      {/* Cinematic header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-2xl font-bold text-red-600 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onMouseEnter={() => setShowOverlay(true)}
              className="text-white hover:text-red-500 transition-colors"
            >
              Browse
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Overlay navigation */}
      {showOverlay && (
        <div 
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg hidden md:block"
          onMouseLeave={() => setShowOverlay(false)}
        >
          <div className="container mx-auto pt-24 px-6">
            <div className="grid grid-cols-3 gap-8">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.type, item.sectionId);
                    setShowOverlay(false);
                  }}
                  className="group relative overflow-hidden rounded-lg bg-gray-900 hover:bg-red-600 transition-all duration-300 p-8"
                >
                  <div className="text-left">
                    <h3 className="text-white text-xl font-bold mb-2">{item.label}</h3>
                    <p className="text-gray-400 group-hover:text-white transition-colors">
                      Section {index + 1}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ▶
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black pt-16">
          <div className="px-6 pt-6">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-4 px-6 mb-3 bg-gray-900 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-red-500">▶</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 🍎 Apple Header - Minimalist with invisible navigation
export const AppleHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Minimalist header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-center px-6 py-6">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-lg font-light text-gray-900 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden absolute right-6 p-2"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Invisible navigation that appears on hover */}
        <nav className={`hidden md:block transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <div className="flex items-center justify-center space-x-12 pb-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.type, item.sectionId)}
                className="text-gray-600 hover:text-gray-900 text-sm font-light transition-all duration-200 hover:scale-105"
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white pt-20">
          <div className="text-center">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full py-6 text-gray-700 hover:text-gray-900 text-xl font-light hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 🎯 Dribbble Header - Portfolio with circular navigation
export const DribbbleHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCircle, setActiveCircle] = useState(0);

  return (
    <>
      {/* Portfolio header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-pink-50 border-b border-pink-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-bold text-pink-600 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-pink-100 rounded-full"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Circular navigation */}
      <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
        <div className="relative">
          {navigationItems.map((item, index) => {
            const angle = (index * 360) / navigationItems.length;
            const radius = 80;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setActiveCircle(index);
                }}
                onMouseEnter={() => setActiveCircle(index)}
                className={`absolute w-12 h-12 rounded-full transition-all duration-300 ${
                  activeCircle === index 
                    ? 'bg-pink-500 text-white scale-125' 
                    : 'bg-white text-pink-500 border-2 border-pink-200 hover:border-pink-400'
                }`}
                style={{
                  left: `${x + 80}px`,
                  top: `${y + 80}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={item.label}
              >
                {item.label.charAt(0)}
              </button>
            );
          })}
          
          {/* Center circle */}
          <div className="absolute w-8 h-8 bg-pink-600 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-pink-50 pt-20">
          <div className="px-6 pt-6 grid grid-cols-2 gap-4">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="h-20 bg-white border-2 border-pink-200 hover:border-pink-400 rounded-2xl p-4 text-pink-600 font-medium transition-colors"
              >
                <div className="w-8 h-8 bg-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm">
                  {item.label.charAt(0)}
                </div>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 📹 YouTube Header - Video style with timeline navigation
export const YoutubeHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Video-style header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-lg font-bold text-red-600 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Timeline navigation */}
        <div className="hidden md:block px-6 pb-2">
          <div className="relative bg-gray-800 rounded-full h-2">
            <div 
              className="absolute top-0 left-0 h-full bg-red-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
            
            {/* Timeline markers */}
            {navigationItems.map((item, index) => {
              const position = ((index + 1) / (navigationItems.length + 1)) * 100;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.type, item.sectionId)}
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-red-600 rounded-full hover:scale-125 transition-transform group"
                  style={{ left: `${position}%`, marginLeft: '-8px' }}
                >
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Video controls bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 hidden md:flex items-center space-x-4 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full">
        <button className="text-white hover:text-red-500 transition-colors">⏮</button>
        <button className="text-white hover:text-red-500 transition-colors text-2xl">▶</button>
        <button className="text-white hover:text-red-500 transition-colors">⏭</button>
        <div className="text-white text-sm">00:{progress.toString().padStart(2, '0')}</div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black pt-14">
          <div className="px-6 pt-6">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-4 px-6 mb-3 bg-gray-900 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm mr-3">
                    ▶
                  </span>
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 📝 Medium Header - Blog style with typewriter navigation
export const MediumHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!navigationItems.length) return;
    
    const currentItem = navigationItems[currentIndex % navigationItems.length];
    const text = currentItem.label;
    
    if (typedText.length < text.length) {
      const timer = setTimeout(() => {
        setTypedText(text.slice(0, typedText.length + 1));
      }, 150);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setTypedText('');
        setCurrentIndex((prev) => (prev + 1) % navigationItems.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [typedText, currentIndex, navigationItems]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-2xl font-bold text-gray-900 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          {/* Typewriter navigation */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="text-center">
              <span className="text-lg text-gray-700 font-serif">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Blog-style navigation */}
        <nav className="hidden md:flex items-center justify-center mt-6 space-x-8">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.type, item.sectionId)}
              className="text-gray-600 hover:text-gray-900 text-sm font-serif relative group transition-colors duration-200"
            >
              {item.label}
              <div className="absolute -bottom-2 left-0 right-0 h-px bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-4 text-gray-700 hover:text-gray-900 font-serif border-b border-gray-100 last:border-0 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

// 🎮 Twitch Header - Streaming with chat-style navigation
export const TwitchHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const messages = navigationItems.map((item, index) => ({
      id: index,
      user: `User${index + 1}`,
      message: item.label,
      color: ['text-purple-400', 'text-green-400', 'text-blue-400', 'text-yellow-400', 'text-red-400'][index % 5]
    }));
    setChatMessages(messages);
  }, [navigationItems]);

  return (
    <>
      {/* Streaming header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-purple-900 text-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-lg font-bold ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm">LIVE</span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-purple-800 rounded"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Chat-style navigation */}
      <nav className="fixed right-4 top-20 z-40 hidden md:block w-64">
        <div className="bg-gray-900 rounded-lg border border-gray-700 max-h-96 overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <span className="text-white text-sm font-medium">Stream Chat</span>
          </div>
          <div className="p-2 space-y-2">
            {chatMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => scrollToSection(navigationItems[msg.id].type, navigationItems[msg.id].sectionId)}
                className="block w-full text-left p-2 hover:bg-gray-800 rounded transition-colors"
              >
                <span className={`font-bold text-sm ${msg.color}`}>{msg.user}:</span>
                <span className="text-white text-sm ml-2">{msg.message}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-purple-900 pt-14">
          <div className="px-6 pt-6">
            <div className="text-center mb-6">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2 animate-pulse"></div>
              <span className="text-white">LIVE STREAM</span>
            </div>
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-3 px-4 mb-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <span className={`font-bold mr-2 ${
                  ['text-purple-400', 'text-green-400', 'text-blue-400', 'text-yellow-400', 'text-red-400'][index % 5]
                }`}>
                  User{index + 1}:
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 📸 Instagram Header - Stories style navigation
export const InstagramHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(0);

  return (
    <>
      {/* Instagram-style header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Stories navigation */}
        <div className="hidden md:flex items-center px-6 pb-4 space-x-4 overflow-x-auto">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setActiveStory(index);
              }}
              className="flex flex-col items-center space-y-1 flex-shrink-0"
            >
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                activeStory === index 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gray-300'
              }`}>
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <span className={`text-lg font-bold ${
                    activeStory === index ? 'text-purple-500' : 'text-gray-500'
                  }`}>
                    {item.label.charAt(0)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-600 max-w-16 truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-white pt-20">
          <div className="px-6 pt-6">
            <div className="grid grid-cols-3 gap-6">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.type, item.sectionId);
                    setIsMenuOpen(false);
                  }}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-0.5">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-purple-500">
                        {item.label.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 💬 WhatsApp Header - Chat style with bubble navigation
export const WhatsAppHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* WhatsApp-style header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-lg font-medium ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <span>Online</span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-green-600 rounded"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Chat bubble navigation */}
      <nav className="fixed bottom-8 left-6 right-6 z-40 hidden md:block">
        <div className="bg-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <div key={item.id} className={`mb-3 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
              <button
                onClick={() => scrollToSection(item.type, item.sectionId)}
                className={`inline-block px-4 py-2 rounded-2xl text-sm max-w-xs transition-all duration-200 hover:scale-105 ${
                  index % 2 === 0 
                    ? 'bg-white text-gray-700 hover:bg-gray-50' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {item.label}
              </button>
              <div className={`text-xs text-gray-500 mt-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                {currentTime}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-green-500 pt-16">
          <div className="px-6 pt-6">
            {navigationItems.map((item, index) => (
              <div key={item.id} className={`mb-4 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                <button
                  onClick={() => {
                    scrollToSection(item.type, item.sectionId);
                    setIsMenuOpen(false);
                  }}
                  className={`inline-block px-6 py-3 rounded-2xl font-medium transition-colors ${
                    index % 2 === 0 
                      ? 'bg-white text-green-600' 
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {item.label}
                </button>
                <div className={`text-xs text-green-200 mt-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                  {currentTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 🎨 Behance Header - Portfolio with masonry navigation
export const BehanceHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <>
      {/* Behance-style header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-bold ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-blue-700 rounded"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Masonry navigation */}
      <nav className="fixed top-20 left-6 right-6 z-40 hidden md:block">
        <div className="columns-4 gap-4">
          {navigationItems.map((item, index) => {
            const heights = [120, 160, 100, 140, 180, 110];
            const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.type, item.sectionId)}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`w-full mb-4 rounded-lg p-4 text-white font-medium transition-all duration-300 break-inside-avoid ${
                  colors[index % colors.length]
                } ${hoveredCard === item.id ? 'transform scale-105 shadow-2xl' : 'shadow-lg'}`}
                style={{ height: `${heights[index % heights.length]}px` }}
              >
                <div className="flex flex-col justify-between h-full">
                  <div className="text-left">
                    <h3 className="font-bold text-lg mb-2">{item.label}</h3>
                    <p className="text-sm opacity-90">Portfolio Section</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs">View Project</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-blue-600 pt-20">
          <div className="px-6 pt-6 grid grid-cols-2 gap-4">
            {navigationItems.map((item, index) => {
              const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.type, item.sectionId);
                    setIsMenuOpen(false);
                  }}
                  className={`h-24 rounded-lg p-4 text-white font-medium ${colors[index % colors.length]}`}
                >
                  <div className="text-left">
                    <h4 className="font-bold text-sm">{item.label}</h4>
                    <p className="text-xs opacity-90 mt-1">Section {index + 1}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

// 🚗 Uber Header - Transport with map-style navigation
export const UberHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  return (
    <>
      {/* Uber-style header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-lg font-bold ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Map-style navigation */}
      <nav className="fixed inset-x-0 top-16 bottom-0 z-40 hidden md:block bg-gray-100">
        <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100">
          {navigationItems.map((item, index) => {
            const positions = [
              { top: '20%', left: '25%' },
              { top: '40%', left: '60%' },
              { top: '60%', left: '30%' },
              { top: '30%', left: '70%' },
              { top: '70%', left: '50%' },
              { top: '50%', left: '15%' },
            ];
            const position = positions[index % positions.length];

            return (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setSelectedPin(item.id);
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ top: position.top, left: position.left }}
              >
                <div className={`w-8 h-8 rounded-full transition-all duration-300 ${
                  selectedPin === item.id 
                    ? 'bg-black scale-125' 
                    : 'bg-white border-2 border-black hover:scale-110'
                }`}></div>
                
                {/* Pin label */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </div>
                
                {/* Connection lines */}
                {index < navigationItems.length - 1 && (
                  <div className="absolute top-4 left-4 w-20 h-px bg-black/30 transform rotate-45"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Map controls */}
        <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Navigate to:</div>
          {selectedPin && (
            <div className="text-black font-medium">
              {navigationItems.find(item => item.id === selectedPin)?.label}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black pt-16">
          <div className="px-6 pt-6">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-4 px-6 mb-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white rounded-full mr-3 flex items-center justify-center">
                    <span className="text-black text-sm font-bold">{index + 1}</span>
                  </div>
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// 🤖 Cursor Header - AI with futuristic navigation
export const CursorHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glitchText, setGlitchText] = useState('');
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const texts = navigationItems.map(item => item.label);
    let currentIndex = 0;
    
    const glitch = () => {
      const originalText = texts[currentIndex % texts.length];
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      let glitched = '';
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() > 0.8) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          glitched += originalText[i];
        }
      }
      
      setGlitchText(glitched);
      
      setTimeout(() => {
        setGlitchText(originalText);
        setTimeout(() => {
          currentIndex++;
          if (currentIndex < texts.length * 2) {
            glitch();
          } else {
            currentIndex = 0;
            setTimeout(glitch, 2000);
          }
        }, 1000);
      }, 200);
    };

    if (texts.length > 0) {
      glitch();
    }
  }, [navigationItems]);

  return (
    <>
      {/* Futuristic AI header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-cyan-500 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className={`text-xl font-mono font-bold text-cyan-400 ${settings?.logoUrl ? 'hidden' : 'inline'}`}>
              {settings?.logoText || ''}
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* AI status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="font-mono text-cyan-400 text-sm">
              {glitchText}
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-cyan-900/20 rounded border border-cyan-500/30"
          >
            {isMenuOpen ? <X size={20} color="#00ffff" /> : <Menu size={20} color="#00ffff" />}
          </button>
        </div>
      </header>

      {/* Neural network navigation */}
      <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
        <div className="relative">
          <svg width="200" height="300" className="absolute inset-0">
            {/* Neural network connections */}
            {navigationItems.map((_, index) => {
              const y1 = 50 + index * 40;
              const y2 = 50 + ((index + 1) % navigationItems.length) * 40;
              return (
                <line
                  key={index}
                  x1="20" y1={y1}
                  x2="20" y2={y2}
                  stroke="#00ffff"
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            })}
          </svg>
          
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.type, item.sectionId);
                setActiveNode(index);
              }}
              onMouseEnter={() => setActiveNode(index)}
              className="absolute flex items-center space-x-3 group"
              style={{ top: `${40 + index * 40}px`, right: '0' }}
            >
              <div className={`w-6 h-6 border-2 rounded-full transition-all duration-300 ${
                activeNode === index 
                  ? 'bg-cyan-400 border-cyan-400 animate-pulse' 
                  : 'bg-black border-cyan-500 group-hover:border-cyan-400'
              }`}></div>
              
              <div className={`bg-black/90 border border-cyan-500 rounded px-3 py-1 transition-all duration-300 ${
                activeNode === index ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <span className="text-cyan-400 text-sm font-mono">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black pt-16">
          <div className="px-6 pt-6">
            <div className="text-center mb-6">
              <div className="text-cyan-400 font-mono text-lg mb-2">AI Navigation System</div>
              <div className="text-green-400 text-sm">Status: Online</div>
            </div>
            
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.type, item.sectionId);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-4 px-6 mb-3 bg-gray-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 rounded-lg transition-all duration-300 font-mono"
              >
                <div className="flex items-center justify-between">
                  <span>{'>'} {item.label}</span>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
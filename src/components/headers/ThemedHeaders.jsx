import React, { useState } from 'react';
import { Menu, X, Search, User, Heart, ShoppingBag, Globe, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFrontendLanguage } from '../LanguageSelector';

export const GitHubHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage, getActiveLanguages } = useFrontendLanguage();
  
  // Obtenir le code de la langue courante
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';

  return (
    <header 
      className="sticky top-0 z-50 border-b"
      style={{ 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.text.light + '20'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => {
              navigate(`/${currentLangCode}`);
            }}
          >
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
            <div 
              className={`text-2xl font-bold ${settings?.logoUrl ? 'hidden' : 'inline'}`}
              style={{ color: theme.colors.text.primary }}
            >
              {settings?.logoText || ''}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems?.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection?.(item.type, item.sectionId)}
                className="flex items-center gap-1 py-2 hover:opacity-70 transition-opacity"
                style={{ color: theme.colors.text.primary }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.colors.text.light }} />
              <input 
                type="text"
                placeholder="Search GitHub"
                className="pl-10 pr-4 py-2 rounded-lg border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.text.light + '30',
                  color: theme.colors.text.primary
                }}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: theme.colors.text.primary }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden border-t"
          style={{ 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.text.light + '20'
          }}
        >
          <div className="container mx-auto px-6 py-4">
            <nav className="flex flex-col gap-4">
              {navigationItems?.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => scrollToSection?.(item.type, item.sectionId)}
                  className="py-2 text-left"
                  style={{ color: theme.colors.text.primary }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export const AirbnbHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage, getActiveLanguages } = useFrontendLanguage();
  
  // Obtenir le code de la langue courante
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';

  return (
    <header 
      className="sticky top-0 z-50 border-b bg-white"
      style={{ 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.text.light + '20'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
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
            <div 
              className={`text-2xl font-bold ${settings?.logoUrl ? 'hidden' : 'inline'}`}
              style={{ color: theme.colors.primary }}
            >
              {settings?.logoText || ''}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div 
              className="flex items-center rounded-full border shadow-sm hover:shadow-md transition-shadow duration-200 p-2"
              style={{ borderColor: theme.colors.text.light + '30' }}
            >
              {navigationItems?.slice(0, 3).map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <div className="w-px h-6" style={{ backgroundColor: theme.colors.text.light + '30' }}></div>}
                  <button 
                    onClick={() => scrollToSection?.(item.type, item.sectionId)}
                    className="px-4 py-2 text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
              <button 
                className="ml-2 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
                onClick={() => navigationItems?.[0] && scrollToSection?.(navigationItems[0].type)}
              >
                <Search size={16} className="text-white" />
              </button>
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Globe size={20} style={{ color: theme.colors.text.primary }} />
            </button>
            <div 
              className="flex items-center gap-2 p-2 rounded-full border hover:shadow-md transition-shadow duration-200"
              style={{ borderColor: theme.colors.text.light + '30' }}
            >
              <Menu size={16} style={{ color: theme.colors.text.primary }} />
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.colors.text.light }}
              >
                <User size={16} style={{ color: theme.colors.background }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const SpotifyHeader = ({ theme, settings, navigationItems, scrollToSection }) => {
  const navigate = useNavigate();
  const { currentLanguage, getActiveLanguages } = useFrontendLanguage();
  
  // Obtenir le code de la langue courante
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
  return (
    <header 
      className="sticky top-0 z-50"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <div 
              className={`text-3xl font-bold ${settings?.logoUrl ? 'hidden' : 'inline'}`}
              style={{ color: theme.colors.text.primary }}
            >
              {settings?.logoText || ''}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems?.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection?.(item.type, item.sectionId)}
                className="font-medium hover:opacity-70 transition-opacity"
                style={{ color: theme.colors.text.primary }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <Menu size={24} style={{ color: theme.colors.text.primary }} />
          </button>
        </div>
      </div>
    </header>
  );
};
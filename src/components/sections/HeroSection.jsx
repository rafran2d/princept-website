import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';

const HeroSection = ({ section, useGlobalStyles }) => {
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();
  
  // Obtenir le code de la langue courante pour smartNavigate
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
  
  // Extraction des données avec support multilingue
  const title = t(section.title, 'Titre par défaut');
  const subtitle = t(section.subtitle, '');
  const description = t(section.description, '');
  const buttonText = t(section.buttonText, 'Commencer');
  const secondaryButtonText = t(section.secondaryButtonText, 'En savoir plus');
  
  const {
    buttonLink,
    secondaryButtonLink,
    backgroundColor,
    backgroundImage
  } = section;

  const { getInlineStyles, getClasses, getAnimations, isTheme, getCurrentTheme } = useThemeStyles();
  const { enabledSections } = useSections();
  
  // Get theme-specific styles
  const heroStyles = getInlineStyles('hero');
  const animations = getAnimations();
  
  // Image de fond par défaut pour style hairnet
  const defaultBgImage = backgroundImage || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
  
  // Determine final styles based on theme and settings
  const getFinalStyles = () => {
    if (isTheme('default')) {
      // Style hairnet : fond image avec blur (l'image sera dans ::before)
      const bgImage = backgroundImage || defaultBgImage;
      return {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#FFFFFF'
      };
    } else if (isTheme('slack')) {
      // Force Slack gradient with higher specificity
      return {
        background: 'linear-gradient(135deg, #4A154B 0%, #350D36 25%, #2D0B31 50%, #4A154B 75%, #611F69 100%) !important',
        backgroundImage: 'none !important'
      };
    } else if (useGlobalStyles) {
      return heroStyles;
    } else {
      return {
        ...(backgroundImage ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {
          backgroundColor: backgroundColor || '#ffffff'
        }),
        ...heroStyles
      };
    }
  };

  // Get layout classes based on theme with reduced heights
  const getLayoutClasses = () => {
    const theme = getCurrentTheme();
    
    if (isTheme('slack')) {
      return 'min-h-[70vh] flex items-center justify-center text-center w-full relative overflow-hidden';
    } else if (isTheme('airbnb')) {
      return 'min-h-[85vh] flex items-center justify-start text-left';
    } else if (isTheme('spotify') || isTheme('netflix')) {
      return 'min-h-[85vh] flex items-center justify-center text-center';
    } else if (isTheme('notion') || isTheme('medium')) {
      return 'min-h-[70vh] flex items-center justify-start text-left';
    } else if (isTheme('discord') || isTheme('twitch')) {
      return 'min-h-[85vh] flex items-center justify-center text-center';
    } else if (isTheme('apple')) {
      return 'min-h-[75vh] flex items-center justify-center text-center';
    } else {
      return 'min-h-[70vh] flex items-center justify-center text-center';
    }
  };

  // Get container classes based on theme
  const getContainerClasses = () => {
    if (isTheme('slack')) {
      return 'w-full px-8 max-w-4xl mx-auto relative z-10';
    } else if (isTheme('medium')) {
      return 'container mx-auto px-6 max-w-4xl';
    } else if (isTheme('notion')) {
      return 'container mx-auto px-8 max-w-6xl';
    } else if (isTheme('airbnb')) {
      return 'container mx-auto px-8 max-w-7xl';
    } else {
      return 'container mx-auto px-6 max-w-6xl';
    }
  };

  // Get text color based on theme
  const getTextColor = () => {
    if (isTheme('default')) return 'text-gray-900'; // Style hairnet : texte sombre sur fond blanc
    if (isTheme('slack')) return 'text-white';
    if (isTheme('spotify') || isTheme('netflix') || isTheme('discord') || isTheme('twitch') || backgroundImage) return 'text-white';
    return 'text-gray-900 dark:text-white';
  };

  const isDefaultTheme = isTheme('default');

  return (
    <section 
      id="hero"
      className={`relative ${getLayoutClasses()} ${isDefaultTheme ? 'agency-hero' : ''} ${isTheme('slack') ? 'slack-hero-gradient' : 'bg-cover bg-center'} ${animations}`}
      style={isDefaultTheme ? {
        ...getFinalStyles(),
      } : getFinalStyles()}
      data-bg-image={isDefaultTheme ? (backgroundImage || defaultBgImage) : undefined}
    >
      {/* Slack hero decorative elements */}
      {isTheme('slack') && (
        <>
          <div className="absolute top-20 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-10 w-6 h-6 bg-white bg-opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </>
      )}
      
      {/* Fond image avec blur pour style hairnet */}
      {isDefaultTheme && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage || defaultBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.4)',
            transform: 'scale(1.1)',
            zIndex: 0
          }}
        />
      )}
      
      {/* Overlay sombre */}
      {isDefaultTheme && (
        <div className="absolute inset-0 bg-black bg-opacity-50" style={{ zIndex: 1 }}></div>
      )}
      
      {/* Theme-specific overlays - pas pour default theme car géré ci-dessus */}
      {!isDefaultTheme && !useGlobalStyles && !isTheme('notion') && !isTheme('medium') && !isTheme('apple') && !isTheme('slack') && backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      <div className={`${getContainerClasses()} ${isDefaultTheme ? 'relative w-full' : backgroundImage && !useGlobalStyles && !isTheme('slack') ? 'relative z-10' : ''}`} style={isDefaultTheme ? { zIndex: 2 } : {}}>
        {isDefaultTheme ? (
          <div className="agency-hero-content-card">
            {/* Subtitle */}
            {subtitle && (
              <h2 className="agency-hero-subtitle">
                {subtitle}
              </h2>
            )}
            
            {/* Main title */}
            <h1 className="agency-hero-title">
              {title}
            </h1>
            
            {/* Description */}
            {description && (
              <p className="agency-hero-desc">
                {description}
              </p>
            )}
            
            {/* Buttons */}
            <div className="agency-hero-buttons">
              {buttonText && buttonLink && (
                <button
                  onClick={() => smartNavigate(buttonLink, enabledSections, currentLangCode)}
                  className="agency-btn-primary"
                >
                  {buttonText}
                </button>
              )}
              {secondaryButtonText && secondaryButtonLink && (
                <button
                  onClick={() => smartNavigate(secondaryButtonLink, enabledSections, currentLangCode)}
                  className="agency-btn-secondary"
                >
                  {secondaryButtonText}
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
          <div className={`${isTheme('slack') ? 'max-w-3xl mx-auto' : isTheme('airbnb') ? 'max-w-2xl' : isTheme('medium') ? 'max-w-3xl' : 'max-w-4xl'} ${isTheme('airbnb') ? '' : 'mx-auto'} ${getTextColor()}`}>
            {/* Theme-adaptive subtitle */}
            {isTheme('slack') && subtitle ? (
              <div className="mb-6">
                <span className="inline-block bg-white bg-opacity-20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {subtitle}
                </span>
              </div>
            ) : subtitle && (
              <h2 className={`agency-hero-subtitle ${isTheme('medium') ? 'text-lg' : 'text-xl md:text-2xl'} font-light mb-6 ${isTheme('notion') ? 'tracking-normal' : 'tracking-wide'} opacity-90`}>
                {subtitle}
              </h2>
            )}
            
            {/* Theme-adaptive main title */}
            <h1 className={`agency-hero-title ${
              isTheme('slack') ? 'text-5xl md:text-6xl xl:text-7xl' :
              isTheme('medium') ? 'text-3xl md:text-5xl' :
              isTheme('notion') ? 'text-4xl md:text-5xl xl:text-6xl' :
              isTheme('apple') ? 'text-4xl md:text-6xl xl:text-7xl' :
              'text-4xl md:text-6xl xl:text-7xl'
            } font-bold mb-6 leading-tight ${isTheme('spotify') || isTheme('discord') || isTheme('slack') ? 'font-black' : ''} ${isTheme('slack') ? 'text-white' : ''}`}>
              {title}
            </h1>
            
            {/* Theme-adaptive description */}
            {description && (
              <p className={`agency-hero-desc ${
                isTheme('slack') ? 'text-xl md:text-2xl text-white opacity-90 mb-10 max-w-2xl mx-auto' :
                'text-lg md:text-xl opacity-90 mb-12 ' + (
                  isTheme('airbnb') ? 'max-w-xl' : 
                  isTheme('medium') ? 'max-w-2xl' : 
                  'max-w-3xl mx-auto'
                )
              } leading-relaxed font-light`}>
                {description}
              </p>
            )}
            
            {/* Theme-adaptive buttons */}
            <div className={`agency-hero-buttons flex ${isTheme('slack') ? 'flex-col sm:flex-row gap-4' : isTheme('medium') || isTheme('notion') ? 'flex-col sm:flex-row gap-3' : 'flex-col sm:flex-row gap-4'} ${isTheme('airbnb') ? 'justify-start' : 'justify-center'} items-center`}>
            {isTheme('slack') ? (
              <>
                {buttonText && buttonLink && (
                  <button
                    onClick={() => smartNavigate(buttonLink, enabledSections, currentLangCode)}
                    className="inline-flex items-center bg-white text-purple-900 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px] justify-center"
                  >
                    {buttonText}
                  </button>
                )}
                {secondaryButtonText && secondaryButtonLink && (
                  <button
                    onClick={() => smartNavigate(secondaryButtonLink, enabledSections, currentLangCode)}
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 min-w-[200px] inline-flex items-center justify-center"
                  >
                    {secondaryButtonText}
                  </button>
                )}
              </>
            ) : buttonText && buttonLink && (
              <button
                onClick={() => smartNavigate(buttonLink, enabledSections, currentLangCode)}
                className={`inline-flex items-center px-8 py-4 text-lg font-medium min-w-[200px] justify-center ${
                  isDefaultTheme ? 'agency-btn-primary' :
                  isTheme('airbnb') ? 'text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1' :
                  isTheme('spotify') || isTheme('discord') ? 'text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105' :
                  isTheme('netflix') ? 'text-white rounded-md shadow-lg hover:shadow-xl' :
                  isTheme('apple') ? 'text-white rounded-xl shadow-lg hover:shadow-xl' :
                  isTheme('notion') || isTheme('medium') ? 'text-white rounded-lg shadow-sm hover:shadow-md' :
                  'text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                } ${animations}`}
                style={{
                  backgroundColor: isDefaultTheme ? '#3f6ff7' : 'var(--color-primary)',
                  color: '#FFFFFF',
                  borderRadius: isDefaultTheme ? '0.5rem' : isTheme('notion') || isTheme('medium') ? '0.5rem' : 
                               isTheme('apple') ? '0.75rem' : 
                               isTheme('netflix') ? '0.375rem' : '9999px'
                }}
                onMouseEnter={(e) => {
                  if (isDefaultTheme) {
                    e.target.style.backgroundColor = '#2d5ae6';
                  } else {
                    e.target.style.filter = 'brightness(0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isDefaultTheme) {
                    e.target.style.backgroundColor = '#3f6ff7';
                  } else {
                    e.target.style.filter = 'brightness(1)';
                  }
                }}
              >
                {buttonText}
              </button>
            )}
            
            {!isTheme('medium') && !isTheme('notion') && !isTheme('slack') && secondaryButtonText && secondaryButtonLink && (
              <button
                onClick={() => smartNavigate(secondaryButtonLink, enabledSections, currentLangCode)}
                className={`inline-flex items-center border-2 px-8 py-4 text-lg font-medium min-w-[200px] justify-center ${
                  isTheme('spotify') || isTheme('netflix') || isTheme('discord') || backgroundImage ? 'border-white text-white hover:bg-white hover:text-gray-900' :
                  'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                } ${
                  isTheme('airbnb') ? 'rounded-full' :
                  isTheme('spotify') || isTheme('discord') ? 'rounded-full' :
                  isTheme('netflix') ? 'rounded-md' :
                  isTheme('apple') ? 'rounded-xl' :
                  'rounded-full'
                } ${animations}`}
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
          
          {/* Slack hero bottom info - only if no description */}
          {isTheme('slack') && !description && (
            <div className="mt-12 text-center">
              <p className="text-white opacity-75 text-sm mb-4">
                Faites confiance à notre expertise pour votre réussite
              </p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-white text-xs">
                  <div className="font-semibold">100+</div>
                  <div>Clients</div>
                </div>
                <div className="text-white text-xs">
                  <div className="font-semibold">5+</div>
                  <div>Années</div>
                </div>
                <div className="text-white text-xs">
                  <div className="font-semibold">24/7</div>
                  <div>Support</div>
                </div>
              </div>
            </div>
          )}
          </div>
          </>
        )}
      </div>
      
      {/* Theme-adaptive scroll indicator */}
      {!isTheme('medium') && !isTheme('notion') && !isTheme('slack') && (
        <div className={`agency-hero-scroll absolute bottom-8 w-full flex justify-center ${getTextColor()} ${
          isDefaultTheme ? '' : isTheme('discord') || isTheme('spotify') ? 'animate-pulse' : 'animate-bounce'
        } z-10`}>
          <a href="#about" className={`flex flex-col items-center opacity-75 hover:opacity-100 transition-opacity ${animations}`}>
            <span className="text-sm mb-2 font-light text-center whitespace-nowrap">
              {isTheme('airbnb') ? 'Découvrir' : 
               isTheme('apple') ? 'Explorer' : 
               isTheme('netflix') ? 'Voir plus' : 
               'Scroll Down'}
            </span>
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      )}
      
      {/* Slack scroll indicator */}
      {isTheme('slack') && (
        <div className="absolute bottom-8 w-full flex justify-center text-white animate-bounce z-10">
          <a href="#about" className="flex flex-col items-center opacity-75 hover:opacity-100 transition-opacity">
            <span className="text-sm mb-2 font-light text-center whitespace-nowrap">Découvrir</span>
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
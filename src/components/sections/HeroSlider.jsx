import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';

const HeroSlider = ({ section, useGlobalStyles }) => {
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';

  // Configuration du slider
  // Les slides sont déjà convertis par SectionRenderer, mais on s'assure qu'ils sont valides
  const slides = section.slides && section.slides.length > 0 
    ? section.slides.map(slide => ({
        ...slide,
        // S'assurer que toutes les valeurs textuelles sont des strings
        title: typeof slide.title === 'string' ? slide.title : (slide.title?.fr || slide.title?.en || ''),
        subtitle: typeof slide.subtitle === 'string' ? slide.subtitle : (slide.subtitle?.fr || slide.subtitle?.en || ''),
        description: typeof slide.description === 'string' ? slide.description : (slide.description?.fr || slide.description?.en || ''),
        buttonText: typeof slide.buttonText === 'string' ? slide.buttonText : (slide.buttonText?.fr || slide.buttonText?.en || ''),
        secondaryButtonText: typeof slide.secondaryButtonText === 'string' ? slide.secondaryButtonText : (slide.secondaryButtonText?.fr || slide.secondaryButtonText?.en || ''),
        // Ne pas utiliser d'image par défaut
        backgroundImage: slide.backgroundImage || null,
        tabletImage: slide.tabletImage || null
      }))
    : [
        {
          id: 1,
          title: typeof section.title === 'string' ? section.title : (section.title?.fr || section.title?.en || 'Bienvenue'),
          subtitle: typeof section.subtitle === 'string' ? section.subtitle : (section.subtitle?.fr || section.subtitle?.en || ''),
          description: typeof section.description === 'string' ? section.description : (section.description?.fr || section.description?.en || ''),
          buttonText: typeof section.buttonText === 'string' ? section.buttonText : (section.buttonText?.fr || section.buttonText?.en || 'Commencer'),
          buttonLink: section.buttonLink || '#contact',
          secondaryButtonText: typeof section.secondaryButtonText === 'string' ? section.secondaryButtonText : (section.secondaryButtonText?.fr || section.secondaryButtonText?.en || 'En savoir plus'),
          secondaryButtonLink: section.secondaryButtonLink || '#about',
          backgroundImage: null, // Ne pas utiliser section.backgroundImage car chaque slide a sa propre image
          tabletImage: null
        }
      ];

  const autoPlayDelay = section.autoPlayDelay || 5000; // 5 secondes par défaut
  const enableAutoPlay = section.enableAutoPlay !== false; // true par défaut

  const { getInlineStyles, getClasses, getAnimations, isTheme, getCurrentTheme } = useThemeStyles();
  const { enabledSections } = useSections();

  const heroStyles = getInlineStyles('hero');
  const animations = getAnimations();

  // Navigation vers le slide suivant
  const nextSlide = useCallback(() => {
    // Changer directement le slide sans transition complexe
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Navigation vers le slide précédent
  const prevSlide = useCallback(() => {
    // Changer directement le slide sans transition complexe
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Navigation vers un slide spécifique
  const goToSlide = (index) => {
    if (index !== currentSlide) {
      // Changer directement le slide sans transition complexe
      setCurrentSlide(index);
    }
    setIsAutoPlaying(false); // Arrêter l'auto-play si l'utilisateur interagit
  };

  // Auto-play
  useEffect(() => {
    if (!enableAutoPlay || !isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayDelay);
    return () => clearInterval(interval);
  }, [enableAutoPlay, isAutoPlaying, nextSlide, autoPlayDelay, slides.length]);

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  const currentSlideData = slides[currentSlide];
  
  // S'assurer que les valeurs sont des strings (déjà converties par SectionRenderer)
  // Si ce sont encore des objets, utiliser la fonction t() pour les convertir
  const title = typeof currentSlideData.title === 'string' 
    ? currentSlideData.title 
    : t(currentSlideData.title, currentSlideData.title?.fr || currentSlideData.title?.en || 'Titre par défaut');
  const subtitle = typeof currentSlideData.subtitle === 'string' 
    ? currentSlideData.subtitle 
    : t(currentSlideData.subtitle, currentSlideData.subtitle?.fr || currentSlideData.subtitle?.en || '');
  const description = typeof currentSlideData.description === 'string' 
    ? currentSlideData.description 
    : t(currentSlideData.description, currentSlideData.description?.fr || currentSlideData.description?.en || '');
  const buttonText = typeof currentSlideData.buttonText === 'string' 
    ? currentSlideData.buttonText 
    : t(currentSlideData.buttonText, currentSlideData.buttonText?.fr || currentSlideData.buttonText?.en || 'Commencer');
  const secondaryButtonText = typeof currentSlideData.secondaryButtonText === 'string' 
    ? currentSlideData.secondaryButtonText 
    : t(currentSlideData.secondaryButtonText, currentSlideData.secondaryButtonText?.fr || currentSlideData.secondaryButtonText?.en || 'En savoir plus');
  
  // S'assurer que backgroundImage et tabletImage sont null si non définis (pas de valeurs par défaut)
  const backgroundImage = currentSlideData.backgroundImage && typeof currentSlideData.backgroundImage === 'string' && currentSlideData.backgroundImage.trim() !== '' 
    ? currentSlideData.backgroundImage 
    : null;
  const tabletImage = currentSlideData.tabletImage && typeof currentSlideData.tabletImage === 'string' && currentSlideData.tabletImage.trim() !== '' 
    ? currentSlideData.tabletImage 
    : null;

  const isDefaultTheme = getCurrentTheme() === 'default';

  const getFinalStyles = () => {
    if (isTheme('slack')) {
      return {
        background: 'linear-gradient(135deg, #4A154B 0%, #350D36 25%, #2D0B31 50%, #4A154B 75%, #611F69 100%)',
        backgroundImage: 'none'
      };
    } else if (isDefaultTheme) {
      return {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        backgroundImage: 'none'
      };
    } else if (useGlobalStyles) {
      return heroStyles;
    } else {
      // Ne pas utiliser d'image si elle n'est pas définie
      if (!backgroundImage) {
        return {
          backgroundColor: section.backgroundColor || '#1a202c'
        };
      }
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: section.backgroundColor || '#1a202c',
        transition: 'background-image 0.3s ease-in-out'
      };
    }
  };

  const getLayoutClasses = () => {
    const theme = getCurrentTheme();

    if (isTheme('slack')) {
      return 'min-h-[70vh] flex items-center justify-center text-center w-full relative overflow-hidden';
    } else if (isDefaultTheme) {
      return 'agency-hero-slider';
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

  const getTextColor = () => {
    if (isTheme('slack')) {
      return 'text-white';
    } else if (isTheme('spotify') || isTheme('netflix') || isTheme('discord') || isTheme('twitch') || currentSlideData.backgroundImage) {
      return 'text-white';
    } else {
      return 'text-gray-900 dark:text-white';
    }
  };


  return (
    <section
      id="hero"
      className={`relative ${getLayoutClasses()} ${isTheme('slack') ? 'slack-hero-gradient' : isDefaultTheme ? '' : 'bg-cover bg-center'} ${animations}`}
      style={getFinalStyles()}
    >
      {/* Fond image avec blur pour style hairnet (default theme) */}
      {isDefaultTheme && backgroundImage && backgroundImage.trim() !== '' && (
        <div 
          className="absolute inset-0"
          key={`bg-${currentSlide}-${backgroundImage}`}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.4)',
            transform: 'scale(1.1)',
            zIndex: 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* Overlay sombre pour default theme */}
      {isDefaultTheme && (
        <div className="absolute inset-0 bg-black bg-opacity-50" style={{ zIndex: 1 }}></div>
      )}

      {/* Background overlay pour autres thèmes */}
      {!isDefaultTheme && !useGlobalStyles && !isTheme('notion') && !isTheme('medium') && !isTheme('apple') && !isTheme('slack') && currentSlideData.backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-500"></div>
      )}

      {/* Slack decorative elements */}
      {isTheme('slack') && (
        <>
          <div className="absolute top-20 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-10 w-6 h-6 bg-white bg-opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </>
      )}

      {/* Navigation Arrows - Only show if multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDefaultTheme ? 'z-30' : ''}`}
            aria-label="Slide précédent"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDefaultTheme ? 'z-30' : ''}`}
            aria-label="Slide suivant"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Content container with fade animation */}
      <div className={`${getContainerClasses()} ${isDefaultTheme ? 'relative w-full' : currentSlideData.backgroundImage && !useGlobalStyles && !isTheme('slack') ? 'relative z-10' : ''}`} style={isDefaultTheme ? { zIndex: 2 } : {}}>
        {isDefaultTheme ? (
          <div className="agency-hero-slider-container" key={currentSlide} style={{ transition: 'opacity 0.3s ease-in-out' }}>
            {/* Colonne gauche : Contenu texte et boutons */}
            <div className="agency-hero-slider-content-card">
              {/* Subtitle */}
              {subtitle && (
                <h2 className="agency-hero-slider-subtitle">
                  {subtitle}
                </h2>
              )}
              
              {/* Main title */}
              <h1 className="agency-hero-slider-title">
                {title}
              </h1>
              
              {/* Description */}
              {description && (
                <p className="agency-hero-slider-desc">
                  {description}
                </p>
              )}
              
              {/* Buttons */}
              <div className="agency-hero-slider-buttons">
                {buttonText && currentSlideData.buttonLink && (
                  <button
                    onClick={() => smartNavigate(currentSlideData.buttonLink, enabledSections, currentLangCode)}
                    className="agency-btn-primary"
                  >
                    {buttonText}
                  </button>
                )}
                {secondaryButtonText && currentSlideData.secondaryButtonLink && (
                  <button
                    onClick={() => smartNavigate(currentSlideData.secondaryButtonLink, enabledSections, currentLangCode)}
                    className="agency-btn-secondary"
                  >
                    {secondaryButtonText}
                  </button>
                )}
              </div>
            </div>

            {/* Colonne droite : Tablette avec contenu */}
            <div className="agency-hero-slider-tablet">
              <div className="agency-hero-slider-tablet-device">
                <div className="agency-hero-slider-tablet-screen">
                  {tabletImage ? (
                    <img 
                      key={`tablet-${currentSlide}-${tabletImage}`}
                      src={tabletImage} 
                      alt={title}
                      className="agency-hero-slider-tablet-image"
                      style={{ 
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : backgroundImage ? (
                    <img 
                      key={`tablet-bg-${currentSlide}-${backgroundImage}`}
                      src={backgroundImage} 
                      alt={title}
                      className="agency-hero-slider-tablet-image"
                      style={{ 
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {/* Plus de placeholder - la tablette reste vide si aucune image n'est définie */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${isTheme('slack') ? 'max-w-3xl mx-auto' : isTheme('airbnb') ? 'max-w-2xl' : isTheme('medium') ? 'max-w-3xl' : 'max-w-4xl'} ${isTheme('airbnb') ? '' : 'mx-auto'} ${getTextColor()} transition-opacity duration-300`}
            key={currentSlide}
          >
            {/* Subtitle */}
            {isTheme('slack') && subtitle ? (
              <div className="mb-6 animate-fadeInUp">
                <span className="inline-block bg-white bg-opacity-20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {subtitle}
                </span>
              </div>
            ) : subtitle && (
              <h2 className={`${isTheme('medium') ? 'text-lg' : 'text-xl md:text-2xl'} font-light mb-6 opacity-90 ${isTheme('notion') ? 'tracking-normal' : 'tracking-wide'} animate-fadeInUp`}>
                {subtitle}
              </h2>
            )}

            {/* Title */}
            <h1 className={`${
              isTheme('slack') ? 'text-5xl md:text-6xl xl:text-7xl' :
              isTheme('medium') ? 'text-3xl md:text-5xl' :
              isTheme('notion') ? 'text-4xl md:text-5xl xl:text-6xl' :
              isTheme('apple') ? 'text-4xl md:text-6xl xl:text-7xl' :
              'text-4xl md:text-6xl xl:text-7xl'
            } font-bold mb-6 leading-tight ${isTheme('spotify') || isTheme('discord') || isTheme('slack') ? 'font-black' : ''} ${
              isTheme('slack') ? 'text-white' : ''
            } animate-fadeInUp`}
            style={{ animationDelay: '0.1s' }}
            >
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className={`${
                isTheme('slack') ? 'text-xl md:text-2xl text-white opacity-90 mb-10 max-w-2xl mx-auto' :
                'text-lg md:text-xl opacity-90 mb-12 ' + (
                  isTheme('airbnb') ? 'max-w-xl' :
                  isTheme('medium') ? 'max-w-2xl' :
                  'max-w-3xl mx-auto'
                )
              } leading-relaxed font-light animate-fadeInUp`}
              style={{ animationDelay: '0.2s' }}
              >
                {description}
              </p>
            )}

            {/* Buttons */}
            <div
              className={`flex ${isTheme('slack') ? 'flex-col sm:flex-row gap-4' : isTheme('medium') || isTheme('notion') ? 'flex-col sm:flex-row gap-3' : 'flex-col sm:flex-row gap-4'} ${isTheme('airbnb') ? 'justify-start' : 'justify-center'} items-center animate-fadeInUp`}
              style={{ animationDelay: '0.3s' }}
            >
            {isTheme('slack') ? (
              <>
                {buttonText && currentSlideData.buttonLink && (
                  <button
                    onClick={() => smartNavigate(currentSlideData.buttonLink, enabledSections, currentLangCode)}
                    className="inline-flex items-center bg-white text-purple-900 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px] justify-center"
                  >
                    {buttonText}
                  </button>
                )}
                {secondaryButtonText && currentSlideData.secondaryButtonLink && (
                  <button
                    onClick={() => smartNavigate(currentSlideData.secondaryButtonLink, enabledSections, currentLangCode)}
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 min-w-[200px] inline-flex items-center justify-center"
                  >
                    {secondaryButtonText}
                  </button>
                )}
              </>
            ) : buttonText && currentSlideData.buttonLink && (
              <>
                <button
                  onClick={() => smartNavigate(currentSlideData.buttonLink, enabledSections, currentLangCode)}
                  className={`inline-flex items-center text-white px-8 py-4 text-lg font-medium transition-all duration-300 min-w-[200px] justify-center ${
                    isTheme('airbnb') ? 'rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1' :
                    isTheme('spotify') || isTheme('discord') ? 'rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105' :
                    isTheme('netflix') ? 'rounded-md shadow-lg hover:shadow-xl' :
                    isTheme('apple') ? 'rounded-xl shadow-lg hover:shadow-xl' :
                    isTheme('notion') || isTheme('medium') ? 'rounded-lg shadow-sm hover:shadow-md' :
                    'rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  } ${animations}`}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: isTheme('notion') || isTheme('medium') ? '0.5rem' :
                                 isTheme('apple') ? '0.75rem' :
                                 isTheme('netflix') ? '0.375rem' : '9999px'
                  }}
                  onMouseEnter={(e) => e.target.style.filter = 'brightness(0.9)'}
                  onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
                >
                  {buttonText}
                </button>

                {!isTheme('medium') && !isTheme('notion') && secondaryButtonText && currentSlideData.secondaryButtonLink && (
                  <button
                    onClick={() => smartNavigate(currentSlideData.secondaryButtonLink, enabledSections, currentLangCode)}
                    className={`inline-flex items-center border-2 ${
                      isTheme('spotify') || isTheme('netflix') || isTheme('discord') || currentSlideData.backgroundImage ? 'border-white text-white hover:bg-white hover:text-gray-900' :
                      'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                    } px-8 py-4 text-lg font-medium transition-all duration-300 min-w-[200px] justify-center ${
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
              </>
            )}
          </div>
          </div>
        )}
      </div>

      {/* Slide indicators/dots - Only show if multiple slides */}
      {slides.length > 1 && (
        <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2 ${isDefaultTheme ? 'z-30' : ''}`}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 h-3 bg-white'
                  : 'w-3 h-3 bg-white bg-opacity-50 hover:bg-opacity-75'
              } rounded-full`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      {!isDefaultTheme && !isTheme('medium') && !isTheme('notion') && !isTheme('slack') && (
        <div className={`absolute bottom-8 w-full flex justify-center ${getTextColor()} ${
          isTheme('discord') || isTheme('spotify') ? 'animate-pulse' : 'animate-bounce'
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

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className={`absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm ${isDefaultTheme ? 'z-30' : ''}`}>
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;

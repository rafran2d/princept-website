import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Image, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';

// Fonction pour supprimer les fonds blancs d'une image
const removeWhiteBackground = (img, threshold = 240) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Parcourir tous les pixels et rendre transparents ceux qui sont blancs
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Si le pixel est blanc ou très clair, le rendre transparent
      // Seuil plus élevé pour ne supprimer que les vrais blancs purs
      if (r > threshold && g > threshold && b > threshold) {
        // Vérifier si c'est vraiment un fond blanc (pas un logo blanc)
        // En vérifiant les pixels voisins pour éviter de supprimer les logos blancs
        const isBackground = r >= 250 && g >= 250 && b >= 250;
        if (isBackground) {
          data[i + 3] = 0; // Alpha à 0 (transparent)
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    resolve(canvas.toDataURL());
  });
};

// Composant pour gérer la suppression des fonds blancs
const GalleryImage = ({ src, alt }) => {
  const imgRef = useRef(null);
  const [processedSrc, setProcessedSrc] = React.useState(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = async () => {
      try {
        const processed = await removeWhiteBackground(img, 250);
        setProcessedSrc(processed);
      } catch (error) {
        console.error('Erreur lors du traitement de l\'image:', error);
        setProcessedSrc(null);
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={processedSrc || src}
      alt={alt}
    />
  );
};

const GallerySection = ({ section, useGlobalStyles }) => {
  const { title, description, images = [], backgroundColor, textColor, backgroundImage, ctaButtonText, ctaButtonLink } = section;
  const { getClasses, getAnimations, isTheme } = useThemeStyles();
  const { enabledSections } = useSections();
  const { currentLanguage, getActiveLanguages } = useFrontendLanguage();
  
  // Obtenir le code de la langue courante pour smartNavigate
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';

  const sectionStyle = useGlobalStyles ? {} : {
    ...(backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    } : {
      backgroundColor
    }),
    color: textColor
  };

  const placeholderImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', alt: 'Équipe en réunion de travail' },
    { id: 2, src: 'https://images.unsplash.com/photo-1553028826-f4804a6dfd3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', alt: 'Bureau moderne et créatif' },
    { id: 3, src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', alt: 'Analyse de données sur ordinateur' },
    { id: 4, src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', alt: 'Brainstorming créatif' },
    { id: 5, src: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', alt: 'Collaboration en équipe' },
    { id: 6, src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', alt: 'Présentation de projet' }
  ];

  const displayImages = images.length > 0 ? images : placeholderImages;
  const shouldUseSlider = displayImages.length > 4;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Calculer le nombre de slides (3 images par slide)
  const imagesPerSlide = 3;
  const totalSlides = Math.ceil(displayImages.length / imagesPerSlide);

  // Navigation vers le slide suivant
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Navigation vers le slide précédent
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play pour le slider
  useEffect(() => {
    if (!shouldUseSlider || !isAutoPlaying || totalSlides <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [shouldUseSlider, isAutoPlaying, nextSlide, totalSlides]);

  // Obtenir les images pour le slide actuel
  const getCurrentSlideImages = () => {
    if (!shouldUseSlider) return displayImages;
    const start = currentSlide * imagesPerSlide;
    return displayImages.slice(start, start + imagesPerSlide);
  };

  const currentSlideImages = getCurrentSlideImages();

  const isDefaultTheme = isTheme('default') || (!isTheme('slack') && !isTheme('airbnb') && !isTheme('medium') && !isTheme('spotify') && !isTheme('netflix') && !isTheme('discord') && !isTheme('notion'));

  return (
    <section 
      id="gallery"
      className={`${isDefaultTheme ? 'agency-gallery-wrap' : ''} ${isTheme('slack') ? 'py-12 lg:py-16' : isDefaultTheme ? '' : 'py-12 lg:py-20'} ${getAnimations()} ${backgroundImage ? 'relative' : ''}`}
      style={isDefaultTheme ? { 
        backgroundColor: '#FFFFFF',
        ...sectionStyle 
      } : isTheme('slack') ? { 
        ...(backgroundImage ? {} : { backgroundColor: '#fff' }), 
        ...sectionStyle 
      } : sectionStyle}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      <div className={`${isDefaultTheme ? 'container mx-auto px-6' : isTheme('slack') ? 'w-full px-6 max-w-5xl mx-auto' : 'container mx-auto px-6'} ${backgroundImage ? 'relative z-10' : ''}`}>
        {isDefaultTheme ? (
          <div className="agency-gallery-header">
            <h2 className="agency-gallery-title">{title}</h2>
            <p className="agency-gallery-desc">{description}</p>
          </div>
        ) : (
          <div className={`${isTheme('slack') || isTheme('airbnb') || isTheme('medium') ? 'text-left' : 'text-center'} mb-16`}>
            <h2 className={`${
              isTheme('slack') ? 'text-4xl md:text-5xl' :
              isTheme('medium') ? 'text-3xl md:text-4xl' :
              'text-3xl md:text-4xl'
            } font-bold mb-6 ${isTheme('slack') ? 'text-gray-800' : isTheme('spotify') || isTheme('netflix') || isTheme('discord') ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
            {!isTheme('slack') && !isTheme('medium') && !isTheme('notion') && (
              <div className="w-20 h-1 mx-auto mb-8" style={{ backgroundColor: 'var(--color-primary)' }}></div>
            )}
            <p className={`${
              isTheme('slack') || isTheme('medium') ? 'text-lg' : 'text-lg md:text-xl'
            } ${isTheme('slack') ? 'text-gray-600' : isTheme('spotify') || isTheme('netflix') || isTheme('discord') ? 'text-gray-300 opacity-80' : 'opacity-80'} ${
              isTheme('slack') || isTheme('airbnb') ? 'max-w-2xl' : 
              isTheme('medium') ? 'max-w-3xl' : 
              'max-w-3xl mx-auto'
            } leading-relaxed`}>
              {description}
            </p>
          </div>
        )}

        {isDefaultTheme ? (
          <div className="agency-gallery-container" style={{ position: 'relative' }}>
            {shouldUseSlider && (
              <>
                <button
                  onClick={() => {
                    prevSlide();
                    setIsAutoPlaying(false);
                  }}
                  className="agency-gallery-nav agency-gallery-nav-prev"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    nextSlide();
                    setIsAutoPlaying(false);
                  }}
                  className="agency-gallery-nav agency-gallery-nav-next"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="agency-gallery-slider-indicators">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index);
                        setIsAutoPlaying(false);
                      }}
                      className={`agency-gallery-indicator ${currentSlide === index ? 'active' : ''}`}
                      aria-label={`Aller au slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="agency-gallery-grid">
              {currentSlideImages.map((image) => {
              const ImageWrapper = image.link ? 'a' : 'div';
              const wrapperProps = image.link ? {
                href: image.link,
                target: image.link.startsWith('http') ? '_blank' : '_self',
                rel: image.link.startsWith('http') ? 'noopener noreferrer' : undefined,
                onClick: (e) => {
                  if (!image.link.startsWith('http')) {
                    e.preventDefault();
                    smartNavigate(image.link, enabledSections, currentLangCode);
                  }
                }
              } : {};

              return (
                <ImageWrapper
                  key={image.id}
                  className="agency-gallery-card"
                  {...wrapperProps}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                  />
                  <div className="agency-gallery-card-overlay">
                    <Eye className="agency-gallery-card-icon" />
                  </div>
                  <h4 className="agency-gallery-card-title">{image.alt}</h4>
                  {image.link && (
                    <div className="agency-gallery-card-badge">
                      {image.link.startsWith('http') ? '↗ Lien externe' : '→ Lien interne'}
                    </div>
                  )}
                </ImageWrapper>
              );
              })}
            </div>
          </div>
        ) : (
          <div className={`grid md:grid-cols-2 lg:grid-cols-${isTheme('slack') ? '3' : '3'} gap-6`}>
            {displayImages.map((image) => {
              const ImageWrapper = image.link ? 'a' : 'div';
              const wrapperProps = image.link ? {
                href: image.link,
                target: image.link.startsWith('http') ? '_blank' : '_self',
                rel: image.link.startsWith('http') ? 'noopener noreferrer' : undefined,
                onClick: (e) => {
                  if (!image.link.startsWith('http')) {
                    e.preventDefault();
                    smartNavigate(image.link, enabledSections, currentLangCode);
                  }
                }
              } : {};

              return (
                <ImageWrapper
                  key={image.id}
                  className={`relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${image.link ? 'cursor-pointer' : ''} flex items-center justify-center`}
                  style={{ 
                    minHeight: '16rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                  }}
                  {...wrapperProps}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="text-white font-medium">{image.alt}</h4>
                  </div>

                  {image.link && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                        {image.link.startsWith('http') ? '↗ Lien externe' : '→ Lien interne'}
                      </div>
                    </div>
                  )}
                </ImageWrapper>
              );
            })}
          </div>
        )}

        {ctaButtonText && (
          <div className="mt-12 text-center">
            <button 
              className={`text-white px-8 py-3 transition-colors duration-200 shadow-lg hover:shadow-xl ${
                isTheme('slack') ? 'rounded-lg' : 'rounded-lg'
              }`}
              style={{
                backgroundColor: isTheme('slack') ? '#4A154B' : 'var(--color-primary)'
              }}
              onClick={() => smartNavigate(ctaButtonLink, enabledSections, currentLangCode)}
              onMouseEnter={(e) => e.target.style.filter = 'brightness(0.9)'}
              onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
            >
              {ctaButtonText}
            </button>
          </div>
        )}

        {images.length === 0 && (
          <div className="mt-8 text-center opacity-60">
            <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Images de démonstration - Configurez vos propres images dans l'administration</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
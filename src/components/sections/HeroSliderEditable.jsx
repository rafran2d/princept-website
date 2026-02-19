import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';
import { EditableTitle, EditableSubtitle, EditableDescription, EditableButton } from '../EditableText';
import InlineImageEditor from '../InlineImageEditor';
import AdminLanguageInput from '../admin/AdminLanguageInput';

const HeroSliderEditable = ({ section, useGlobalStyles, isEditing = false }) => {
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false); // Désactivé en mode édition
  const [showSlideManager, setShowSlideManager] = useState(false);
  const { updateSection } = useSections();

  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';

  // Configuration du slider avec données par défaut
  const defaultSlide = {
    id: Date.now(),
    title: { fr: 'Nouveau Slide', en: 'New Slide' },
    subtitle: { fr: 'Sous-titre', en: 'Subtitle' },
    description: { fr: 'Description du slide', en: 'Slide description' },
    buttonText: { fr: 'Commencer', en: 'Start' },
    buttonLink: '#contact',
    secondaryButtonText: { fr: 'En savoir plus', en: 'Learn more' },
    secondaryButtonLink: '#about',
    backgroundImage: null,
    tabletImage: null
  };

  // Normaliser les valeurs de section pour créer un slide par défaut
  const normalizeSectionValue = (value) => {
    if (!value) return {};
    if (typeof value === 'string') {
      return { fr: value };
    }
    if (value && typeof value === 'object') {
      return value;
    }
    return {};
  };

  const slides = section.slides && section.slides.length > 0 ? section.slides : [
    {
      id: 1,
      title: normalizeSectionValue(section.title) || { fr: 'Bienvenue', en: 'Welcome' },
      subtitle: normalizeSectionValue(section.subtitle) || {},
      description: normalizeSectionValue(section.description) || {},
      buttonText: normalizeSectionValue(section.buttonText) || { fr: 'Commencer', en: 'Start' },
      buttonLink: section.buttonLink || '#contact',
      secondaryButtonText: normalizeSectionValue(section.secondaryButtonText) || { fr: 'En savoir plus', en: 'Learn more' },
      secondaryButtonLink: section.secondaryButtonLink || '#about',
      backgroundImage: null, // Ne pas utiliser section.backgroundImage car chaque slide a sa propre image
      tabletImage: null
    }
  ];

  const autoPlayDelay = section.autoPlayDelay || 5000;
  const enableAutoPlay = section.enableAutoPlay !== false;

  const { getInlineStyles, getClasses, getAnimations, isTheme, getCurrentTheme } = useThemeStyles();
  const { enabledSections } = useSections();

  const heroStyles = getInlineStyles('hero');
  const animations = getAnimations();

  // Ajouter un nouveau slide
  const addSlide = async () => {
    const newSlide = {
      ...defaultSlide,
      id: Date.now(),
      title: { 
        fr: `Slide ${slides.length + 1}`, 
        en: `Slide ${slides.length + 1}` 
      }
    };

    const updatedSlides = [...slides, newSlide];
    await updateSection(section.id, {
      ...section,
      slides: updatedSlides
    });
    setCurrentSlide(updatedSlides.length - 1);
  };

  // Supprimer un slide
  const deleteSlide = async (slideId) => {
    if (slides.length <= 1) {
      alert('Vous devez avoir au moins un slide');
      return;
    }

    const updatedSlides = slides.filter(s => s.id !== slideId);
    await updateSection(section.id, {
      ...section,
      slides: updatedSlides
    });

    if (currentSlide >= updatedSlides.length) {
      setCurrentSlide(updatedSlides.length - 1);
    }
  };

  // Dupliquer un slide
  const duplicateSlide = async (slideIndex) => {
    const slideToDuplicate = slides[slideIndex];
    const duplicatedTitle = typeof slideToDuplicate.title === 'string' 
      ? { fr: `${slideToDuplicate.title} (Copie)`, en: `${slideToDuplicate.title} (Copy)` }
      : {
          fr: `${slideToDuplicate.title?.fr || 'Slide'} (Copie)`,
          en: `${slideToDuplicate.title?.en || 'Slide'} (Copy)`
        };
    
    const newSlide = {
      ...slideToDuplicate,
      id: Date.now(),
      title: duplicatedTitle
    };

    const updatedSlides = [...slides, newSlide];
    await updateSection(section.id, {
      ...section,
      slides: updatedSlides
    });
    setCurrentSlide(updatedSlides.length - 1);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!enableAutoPlay || !isAutoPlaying || slides.length <= 1 || isEditing) return;

    const interval = setInterval(nextSlide, autoPlayDelay);
    return () => clearInterval(interval);
  }, [enableAutoPlay, isAutoPlaying, nextSlide, autoPlayDelay, slides.length, isEditing]);

  const currentSlideData = slides[currentSlide];
  
  // Normaliser les valeurs multilingues pour AdminLanguageInput
  // Convertir les strings en objets multilingues si nécessaire
  // S'assurer que toutes les valeurs dans l'objet sont des strings
  const normalizeMultilingualValue = (value, fieldName = '') => {
    // Log pour déboguer
    if (fieldName) {
      console.log(`🔍 normalizeMultilingualValue [${fieldName}]:`, {
        value,
        type: typeof value,
        isObject: value && typeof value === 'object',
        isArray: Array.isArray(value)
      });
    }
    
    if (!value) return {};
    
    // Si c'est une string, créer un objet avec la langue par défaut
    if (typeof value === 'string') {
      const defaultLang = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
      return { [defaultLang]: value };
    }
    
    // Si c'est un objet, s'assurer que toutes les valeurs sont des strings
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const normalized = {};
      const activeLangs = getActiveLanguages();
      
      // Pour chaque langue active, extraire la valeur string
      activeLangs.forEach(lang => {
        const langCode = lang.code;
        let langValue = value[langCode];
        
        // Si la valeur n'existe pas pour cette langue, essayer d'autres clés communes
        if (langValue === undefined) {
          // Essayer avec l'ID de la langue
          const langById = activeLangs.find(l => l.code === langCode);
          if (langById && value[langById.id]) {
            langValue = value[langById.id];
          }
        }
        
        // Si la valeur existe et est une string, l'utiliser
        if (typeof langValue === 'string') {
          normalized[langCode] = langValue;
        } 
        // Si c'est un objet imbriqué, essayer d'extraire une valeur string
        else if (langValue && typeof langValue === 'object' && !Array.isArray(langValue)) {
          // Essayer fr ou en dans l'objet imbriqué
          const nestedValue = langValue.fr || langValue.en || Object.values(langValue).find(v => typeof v === 'string');
          normalized[langCode] = typeof nestedValue === 'string' ? nestedValue : '';
        }
        // Sinon, essayer d'utiliser la fonction t() pour convertir
        else if (langValue !== undefined && langValue !== null) {
          const converted = t(langValue, '');
          normalized[langCode] = typeof converted === 'string' ? converted : String(converted || '');
        }
        else {
          normalized[langCode] = '';
        }
      });
      
      if (fieldName) {
        console.log(`✅ normalizeMultilingualValue [${fieldName}] résultat:`, normalized);
      }
      
      return normalized;
    }
    
    return {};
  };
  
  // Pour l'affichage, convertir les objets multilingues en strings
  const getDisplayValue = (value) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
      return t(value, value?.fr || value?.en || '');
    }
    return '';
  };
  
  const title = getDisplayValue(currentSlideData.title);
  const subtitle = getDisplayValue(currentSlideData.subtitle);
  const description = getDisplayValue(currentSlideData.description);
  const buttonText = getDisplayValue(currentSlideData.buttonText);
  const secondaryButtonText = getDisplayValue(currentSlideData.secondaryButtonText);

  const getFinalStyles = () => {
    if (isTheme('slack')) {
      return {
        background: 'linear-gradient(135deg, #4A154B 0%, #350D36 25%, #2D0B31 50%, #4A154B 75%, #611F69 100%)',
        backgroundImage: 'none'
      };
    } else if (useGlobalStyles) {
      return heroStyles;
    } else {
      // Ne pas utiliser d'image si elle n'est pas définie
      const slideBgImage = currentSlideData.backgroundImage && typeof currentSlideData.backgroundImage === 'string' && currentSlideData.backgroundImage.trim() !== ''
        ? currentSlideData.backgroundImage
        : null;
      
      if (!slideBgImage) {
        return {
          backgroundColor: section.backgroundColor || '#1a202c'
        };
      }
      
      return {
        backgroundImage: `url(${slideBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: section.backgroundColor || '#1a202c',
        transition: 'background-image 0.5s ease-in-out'
      };
    }
  };

  const getLayoutClasses = () => {
    if (isTheme('slack')) {
      return 'min-h-[70vh] flex items-center justify-center text-center w-full relative overflow-hidden';
    } else if (isTheme('airbnb')) {
      return 'min-h-[85vh] flex items-center justify-start text-left';
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
    if (isTheme('slack') || currentSlideData.backgroundImage) {
      return 'text-white';
    } else {
      return 'text-gray-900 dark:text-white';
    }
  };

  return (
    <section
      id="hero"
      className={`relative ${getLayoutClasses()} ${isTheme('slack') ? 'slack-hero-gradient' : 'bg-cover bg-center'} ${animations}`}
      style={getFinalStyles()}
    >
      {/* Background overlay */}
      {!useGlobalStyles && !isTheme('slack') && currentSlideData.backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-500"></div>
      )}

      {/* Slide Manager Panel */}
      {isEditing && (
        <>
          <button
            onClick={() => setShowSlideManager(!showSlideManager)}
            className="absolute top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300"
          >
            <Edit2 className="w-4 h-4" />
            Gérer les slides ({slides.length})
          </button>

          {showSlideManager && (
            <div className="absolute top-16 left-4 z-50 bg-white rounded-lg shadow-2xl p-4 max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Slides du Hero</h3>
                <button
                  onClick={addSlide}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-2">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-3 rounded-lg border-2 ${
                      index === currentSlide ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    } cursor-pointer hover:border-blue-300 transition-all`}
                    onClick={() => goToSlide(index)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Slide {index + 1}</p>
                        <p className="text-xs text-gray-600 truncate">
                          {typeof slide.title === 'string' 
                            ? slide.title 
                            : (slide.title?.fr || slide.title?.en || 'Sans titre')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSlide(index);
                          }}
                          className="p-1 hover:bg-blue-100 rounded text-blue-600"
                          title="Dupliquer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        {slides.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Supprimer ce slide?')) {
                                deleteSlide(slide.id);
                              }
                            }}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    {slide.backgroundImage && (
                      <img
                        src={slide.backgroundImage}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide Configuration Panel */}
          {!isTheme('slack') && (
            <div className="absolute top-4 right-4 z-50 max-w-md max-h-[90vh] overflow-y-auto">
              <div className="bg-white rounded-lg shadow-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    ⚙️ Configuration Slide {currentSlide + 1}
                  </h3>
                </div>

                {/* Titre */}
                <div>
                  <AdminLanguageInput
                    label="Titre"
                    value={normalizeMultilingualValue(currentSlideData.title, 'title')}
                    onChange={(multilingualValue) => {
                      const updatedSlides = [...slides];
                      updatedSlides[currentSlide] = {
                        ...updatedSlides[currentSlide],
                        title: multilingualValue
                      };
                      updateSection(section.id, { ...section, slides: updatedSlides });
                    }}
                    placeholder="Titre du slide"
                    className="w-full"
                  />
                </div>

                {/* Sous-titre */}
                <div>
                  <AdminLanguageInput
                    label="Sous-titre"
                    value={normalizeMultilingualValue(currentSlideData.subtitle, 'subtitle')}
                    onChange={(multilingualValue) => {
                      const updatedSlides = [...slides];
                      updatedSlides[currentSlide] = {
                        ...updatedSlides[currentSlide],
                        subtitle: multilingualValue
                      };
                      updateSection(section.id, { ...section, slides: updatedSlides });
                    }}
                    placeholder="Sous-titre du slide"
                    className="w-full"
                  />
                </div>

                {/* Description */}
                <div>
                  <AdminLanguageInput
                    label="Description"
                    type="textarea"
                    value={normalizeMultilingualValue(currentSlideData.description, 'description')}
                    onChange={(multilingualValue) => {
                      const updatedSlides = [...slides];
                      updatedSlides[currentSlide] = {
                        ...updatedSlides[currentSlide],
                        description: multilingualValue
                      };
                      updateSection(section.id, { ...section, slides: updatedSlides });
                    }}
                    placeholder="Description du slide"
                    className="w-full"
                  />
                </div>

                {/* Image de fond */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📸 Image de fond
                  </label>
                  <InlineImageEditor
                    sectionId={section.id}
                    fieldPath={`slides.${currentSlide}.backgroundImage`}
                    currentImageUrl={currentSlideData.backgroundImage}
                    placeholder="Cliquez pour changer l'image"
                    width="100%"
                    height="150px"
                  />
                </div>

                {/* Bouton Principal */}
                <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    🔘 Bouton Principal
                  </label>
                  <AdminLanguageInput
                    label=""
                    value={normalizeMultilingualValue(currentSlideData.buttonText, 'buttonText')}
                    onChange={(multilingualValue) => {
                      const updatedSlides = [...slides];
                      updatedSlides[currentSlide] = {
                        ...updatedSlides[currentSlide],
                        buttonText: multilingualValue
                      };
                      updateSection(section.id, { ...section, slides: updatedSlides });
                    }}
                    placeholder="Texte du bouton"
                    className="w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Lien du bouton (ex: #contact)"
                    value={currentSlideData.buttonLink || ''}
                    onChange={(e) => {
                      const updatedSlides = [...slides];
                      updatedSlides[currentSlide] = {
                        ...updatedSlides[currentSlide],
                        buttonLink: e.target.value
                      };
                      updateSection(section.id, { ...section, slides: updatedSlides });
                    }}
                    className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Bouton Secondaire */}
                <div className="bg-purple-50 p-3 rounded-lg space-y-2">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    🔘 Bouton Secondaire
                  </label>
                  <AdminLanguageInput
                    label=""
                    value={normalizeMultilingualValue(currentSlideData.secondaryButtonText, 'secondaryButtonText')}
                    onChange={(multilingualValue) => {
                      const updatedSlides = [...slides];
                      updatedSlides[currentSlide] = {
                        ...updatedSlides[currentSlide],
                        secondaryButtonText: multilingualValue
                      };
                      updateSection(section.id, { ...section, slides: updatedSlides });
                    }}
                    placeholder="Texte du bouton secondaire"
                    className="w-full mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Lien du bouton secondaire (ex: #about)"
                    value={currentSlideData.secondaryButtonLink || ''}
                    onChange={(e) => {
                      const updatedSlides = [...slides];
                      updatedSlides[currentSlide] = {
                        ...updatedSlides[currentSlide],
                        secondaryButtonLink: e.target.value
                      };
                      updateSection(section.id, { ...section, slides: updatedSlides });
                    }}
                    className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Slide suivant"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Content container */}
      <div className={`${getContainerClasses()} ${currentSlideData.backgroundImage && !useGlobalStyles && !isTheme('slack') ? 'relative z-10' : ''}`}>
        <div
          className={`${isTheme('slack') ? 'max-w-3xl mx-auto' : isTheme('airbnb') ? 'max-w-2xl' : 'max-w-4xl mx-auto'} ${getTextColor()} transition-all duration-500`}
          key={currentSlide}
        >
          {/* Subtitle */}
          {(subtitle || isEditing) && (
            <div className="mb-6">
              {isEditing ? (
                <EditableSubtitle
                  sectionId={section.id}
                  fieldPath={`slides.${currentSlide}.subtitle`}
                  className={`${isTheme('slack') ? 'inline-block bg-white bg-opacity-20 text-white text-sm font-medium px-3 py-1 rounded-full' : 'text-xl md:text-2xl font-light opacity-90'}`}
                  placeholder="Sous-titre"
                  tag="h2"
                />
              ) : isTheme('slack') ? (
                <span className="inline-block bg-white bg-opacity-20 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {subtitle}
                </span>
              ) : (
                <h2 className="text-xl md:text-2xl font-light opacity-90">{subtitle}</h2>
              )}
            </div>
          )}

          {/* Title */}
          {isEditing ? (
            <EditableTitle
              sectionId={section.id}
              fieldPath={`slides.${currentSlide}.title`}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              placeholder="Titre du slide"
              tag="h1"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {title}
            </h1>
          )}

          {/* Description */}
          {(description || isEditing) && (
            <div>
              {isEditing ? (
                <EditableDescription
                  sectionId={section.id}
                  fieldPath={`slides.${currentSlide}.description`}
                  className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed opacity-90"
                  placeholder="Description du slide"
                />
              ) : (
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed opacity-90">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!isEditing && currentSlideData.buttonLink) {
                  smartNavigate(currentSlideData.buttonLink, enabledSections, currentLangCode);
                }
              }}
              className="px-8 py-4 text-lg font-semibold rounded-full bg-white text-purple-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {isEditing ? (
                <EditableButton
                  sectionId={section.id}
                  fieldPath={`slides.${currentSlide}.buttonText`}
                  placeholder="Texte du bouton"
                  style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0 }}
                />
              ) : (
                buttonText
              )}
            </button>

            {(secondaryButtonText || isEditing) && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isEditing && currentSlideData.secondaryButtonLink) {
                    smartNavigate(currentSlideData.secondaryButtonLink, enabledSections, currentLangCode);
                  }
                }}
                className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {isEditing ? (
                  <EditableButton
                    sectionId={section.id}
                    fieldPath={`slides.${currentSlide}.secondaryButtonText`}
                    placeholder="Texte bouton secondaire"
                    style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0 }}
                  />
                ) : (
                  secondaryButtonText
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
      <div className="absolute bottom-8 w-full flex justify-center text-white animate-bounce z-10">
        <a href="#about" className="flex flex-col items-center opacity-75 hover:opacity-100 transition-opacity">
          <span className="text-sm mb-2 font-light">Découvrir</span>
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      )}

      {/* Edit mode indicator */}
      {isEditing && (
        <div className="absolute bottom-4 right-4 z-20 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          Mode édition: Hero Slider
        </div>
      )}
    </section>
  );
};

export default HeroSliderEditable;

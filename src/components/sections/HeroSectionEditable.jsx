import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';
import { EditableTitle, EditableSubtitle, EditableDescription, EditableButton } from '../EditableText';
import InlineImageEditor from '../InlineImageEditor';

const HeroSectionEditable = ({ section, useGlobalStyles, isEditing = false }) => {
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();

  console.log('🔍 HERO - HeroSectionEditable isEditing:', isEditing);


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

  // OnePress style: Dark background with overlay
  const defaultBgImage = backgroundImage || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  // Determine final styles based on theme and settings
  const getFinalStyles = () => {
    if (isTheme('slack')) {
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
        } : {}),
        backgroundColor: backgroundColor || '#1a202c'
      };
    }
  };

  const finalStyles = getFinalStyles();

  const handleButtonClick = (e, link) => {
    e.preventDefault();
    if (link) {
      smartNavigate(link, currentLangCode);
    }
  };

  const handleScrollDown = () => {
    const nextSection = enabledSections[1];
    if (nextSection) {
      const element = document.getElementById(nextSection.type || nextSection.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero"
      className={`relative min-h-screen flex items-center justify-center ${getClasses('hero')}`}
      style={finalStyles}
    >
      {/* Image de fond éditable en mode édition */}
      {isEditing && !isTheme('slack') && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm">
            <p className="text-sm font-semibold text-gray-700 mb-3">Image de fond</p>
            <InlineImageEditor
              sectionId={section.id}
              fieldPath="backgroundImage"
              currentImageUrl={backgroundImage || defaultBgImage}
              placeholder="Cliquez pour changer l'image de fond"
              width="300px"
              height="200px"
            />
          </div>
        </div>
      )}

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content container */}
      <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
        <div className={`space-y-8 ${animations.fadeInUp} ${isTheme('slack') ? 'max-w-4xl mx-auto' : ''}`}>
          {/* Title */}
          {isEditing ? (
            <EditableTitle
              sectionId={section.id}
              fieldPath="title"
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              placeholder="Titre principal de votre site"
              tag="h1"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {title}
            </h1>
          )}

          {/* Subtitle */}
          {(subtitle || isEditing) && (
            <div>
              {isEditing ? (
                <EditableSubtitle
                  sectionId={section.id}
                  fieldPath="subtitle"
                  className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-gray-200"
                  placeholder="Sous-titre accrocheur"
                  tag="h2"
                />
              ) : (
                <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-gray-200">
                  {subtitle}
                </h2>
              )}
            </div>
          )}

          {/* Description */}
          {(description || isEditing) && (
            <div>
              {isEditing ? (
                <EditableDescription
                  sectionId={section.id}
                  fieldPath="description"
                  className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed text-gray-300"
                  placeholder="Description détaillée de votre offre ou service"
                />
              ) : (
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed text-gray-300">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Primary button */}
            <button
              onClick={(e) => handleButtonClick(e, buttonLink)}
              className={`group px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform ${
                isTheme('slack')
                  ? 'bg-white text-[#4A154B] hover:bg-gray-100 hover:scale-105'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
              } shadow-lg hover:shadow-xl`}
            >
              {isEditing ? (
                <EditableButton
                  sectionId={section.id}
                  fieldPath="buttonText"
                  placeholder="Texte du bouton principal"
                  style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0 }}
                />
              ) : (
                buttonText
              )}
            </button>

            {/* Secondary button */}
            {(secondaryButtonText || secondaryButtonLink || isEditing) && (
              <button
                onClick={(e) => handleButtonClick(e, secondaryButtonLink)}
                className="group px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isEditing ? (
                  <EditableButton
                    sectionId={section.id}
                    fieldPath="secondaryButtonText"
                    placeholder="Texte du bouton secondaire"
                    style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0 }}
                  />
                ) : (
                  secondaryButtonText
                )}
              </button>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        {enabledSections.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleScrollDown}
              className="group flex flex-col items-center space-y-2 text-white hover:text-gray-300 transition-colors duration-300"
              aria-label="Scroll to next section"
            >
              <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                Découvrir
              </span>
              <ChevronDown className="w-6 h-6 animate-bounce group-hover:transform group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Edit mode overlay */}
      {isEditing && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Mode édition: Hero
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSectionEditable;
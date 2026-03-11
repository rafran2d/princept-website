import React from 'react';
import {
  User, Smartphone, Zap, Search, Star, Shield, Globe,
  Settings, Heart, Award, CheckCircle, Target
} from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';
import { EditableTitle, EditableDescription, EditableButton } from '../EditableText';
import InlineTextEditor from '../InlineTextEditor';
import InlineImageEditor from '../InlineImageEditor';

const iconMap = {
  User, Smartphone, Zap, Search, Star, Shield, Globe,
  Settings, Heart, Award, CheckCircle, Target
};

const AboutSectionEditable = ({ section, useGlobalStyles, isEditing = false }) => {
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();

  // Obtenir le code de la langue courante pour smartNavigate
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';

  // Extraction des données avec support multilingue
  const title = t(section.title, 'À propos');
  const description = t(section.description, '');
  const ctaTitle = t(section.ctaTitle, '');
  const ctaDescription = t(section.ctaDescription, '');
  const ctaButtonText = t(section.ctaButtonText, 'Commencer');

  const { features, backgroundColor, textColor, backgroundImage, ctaButtonLink } = section;
  const { getClasses, getAnimations, isTheme, getThemeCategory } = useThemeStyles();
  const { enabledSections } = useSections();

  const sectionStyle = useGlobalStyles ? {} : {
    ...(backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    } : {
      backgroundColor: backgroundColor || '#ffffff'
    }),
    color: textColor || '#333333'
  };

  const sectionClasses = getClasses('section');
  const animations = getAnimations();

  const handleCtaClick = (e) => {
    e.preventDefault();
    if (ctaButtonLink) {
      smartNavigate(ctaButtonLink, currentLangCode);
    }
  };

  return (
    <section
      id="about"
      className={`${isTheme('slack') ? 'py-12 lg:py-16' : 'py-12 lg:py-20'} ${sectionClasses} ${backgroundImage ? 'relative' : ''}`}
      style={sectionStyle}
    >
      {/* Image de fond éditable */}
      {isEditing && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm">
            <p className="text-sm font-semibold text-gray-700 mb-3">Image de fond (optionnelle)</p>
            <InlineImageEditor
              sectionId={section.id}
              fieldPath="backgroundImage"
              currentImageUrl={backgroundImage}
              placeholder="Cliquez pour ajouter une image de fond"
              width="300px"
              height="200px"
            />
          </div>
        </div>
      )}

      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}

      <div className={`${isTheme('slack') ? 'w-full px-6 max-w-5xl mx-auto' : 'container mx-auto px-6'} ${backgroundImage ? 'relative z-10' : ''}`}>
        {/* Section header */}
        <div className={`text-center mb-20 ${animations.fadeInUp}`}>
          {isEditing ? (
            <EditableTitle
              sectionId={section.id}
              fieldPath="title"
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
              placeholder="Titre de la section à propos"
              tag="h2"
            />
          ) : (
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              {title}
            </h2>
          )}

          <div className="w-20 h-1 mx-auto mb-8" style={{ backgroundColor: 'var(--color-primary)' }}></div>

          {(description || isEditing) && (
            <div>
              {isEditing ? (
                <EditableDescription
                  sectionId={section.id}
                  fieldPath="description"
                  className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light"
                  placeholder="Description de votre entreprise ou organisation"
                />
              ) : (
                <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features grid */}
        {features && features.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${features.length >= 4 ? '4' : features.length} gap-8 mb-16 ${animations.fadeInUp}`}>
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || Star;
              return (
                <div key={feature.id || index} className="text-center group">
                  <div className="mb-6 flex justify-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        backgroundColor: 'rgba(var(--color-primary-rgb, 59, 130, 246), 0.1)',
                        color: 'var(--color-primary)'
                      }}
                    >
                      <IconComponent className="w-10 h-10" />
                    </div>
                  </div>

                  <div>
                    {isEditing ? (
                      <InlineTextEditor
                        value={feature.title}
                        sectionId={section.id}
                        fieldPath={`features.${index}.title`}
                        placeholder="Titre de la fonctionnalité"
                        tag="h3"
                        className="text-xl font-semibold mb-4 text-gray-800"
                      />
                    ) : (
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        {t(feature.title, 'Fonctionnalité')}
                      </h3>
                    )}

                    {isEditing ? (
                      <InlineTextEditor
                        value={feature.description}
                        sectionId={section.id}
                        fieldPath={`features.${index}.description`}
                        placeholder="Description de la fonctionnalité"
                        tag="p"
                        multiline={true}
                        className="text-gray-600 leading-relaxed font-light"
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed font-light">
                        {t(feature.description, 'Description de la fonctionnalité')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        {(ctaTitle || ctaDescription || ctaButtonText || isEditing) && (
          <div className={`text-center bg-gray-50 rounded-2xl p-12 ${animations.fadeInUp}`}>
            {(ctaTitle || isEditing) && (
              <div className="mb-6">
                {isEditing ? (
                  <EditableTitle
                    sectionId={section.id}
                    fieldPath="ctaTitle"
                    className="text-3xl md:text-4xl font-bold text-gray-800"
                    placeholder="Titre de l'appel à l'action"
                    tag="h3"
                  />
                ) : (
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {ctaTitle}
                  </h3>
                )}
              </div>
            )}

            {(ctaDescription || isEditing) && (
              <div className="mb-8">
                {isEditing ? (
                  <EditableDescription
                    sectionId={section.id}
                    fieldPath="ctaDescription"
                    className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
                    placeholder="Description de l'appel à l'action"
                  />
                ) : (
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                    {ctaDescription}
                  </p>
                )}
              </div>
            )}

            {(ctaButtonText || ctaButtonLink || isEditing) && (
              <button
                onClick={handleCtaClick}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {isEditing ? (
                  <EditableButton
                    sectionId={section.id}
                    fieldPath="ctaButtonText"
                    placeholder="Texte du bouton CTA"
                    style={{ background: 'transparent', border: 'none', color: 'inherit', padding: 0 }}
                  />
                ) : (
                  ctaButtonText
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit mode overlay */}
      {isEditing && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Mode édition: About
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutSectionEditable;
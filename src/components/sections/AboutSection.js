import React from 'react';
import { 
  User, Smartphone, Zap, Search, Star, Shield, Globe, 
  Settings, Heart, Award, CheckCircle, Target 
} from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';

const iconMap = {
  User, Smartphone, Zap, Search, Star, Shield, Globe,
  Settings, Heart, Award, CheckCircle, Target
};

const AboutSection = ({ section, useGlobalStyles }) => {
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

  return (
    <section 
      id="about"
      className={`${isTheme('slack') ? 'py-12 lg:py-16' : 'py-12 lg:py-20'} ${animations} ${backgroundImage ? 'relative' : ''}`}
      style={isTheme('slack') ? { 
        ...(backgroundImage ? {} : { backgroundColor: '#fff' }), 
        ...sectionStyle 
      } : sectionStyle}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      <div className={`${isTheme('slack') ? 'w-full px-6 max-w-5xl mx-auto' : `container mx-auto px-6 ${isTheme('medium') ? 'max-w-4xl' : isTheme('notion') ? 'max-w-6xl' : ''}`} ${backgroundImage ? 'relative z-10' : ''}`}>
        {/* Theme-adaptive section header */}
        <div className={`${isTheme('slack') || isTheme('airbnb') || isTheme('medium') ? 'text-left' : 'text-center'} ${
          isTheme('slack') ? 'mb-20' : isTheme('medium') ? 'mb-12' : isTheme('notion') ? 'mb-16' : 'mb-20'
        }`}>
          <h2 className={`${
            isTheme('slack') ? 'text-4xl md:text-5xl' :
            isTheme('medium') ? 'text-3xl md:text-4xl' :
            isTheme('notion') ? 'text-3xl md:text-4xl' : 
            isTheme('apple') ? 'text-4xl md:text-5xl' :
            'text-4xl md:text-5xl'
          } font-bold mb-6 ${isTheme('spotify') || isTheme('netflix') || isTheme('discord') || backgroundImage ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h2>
          
          {/* Theme-adaptive divider */}
          {!isTheme('medium') && !isTheme('notion') && !isTheme('slack') && (
            <div className={`${
              isTheme('airbnb') ? 'w-16 h-1 mb-8' :
              isTheme('discord') || isTheme('figma') ? 'w-24 h-2 mx-auto mb-8 rounded-full' :
              'w-20 h-1 mx-auto mb-8'
            }`} style={{ backgroundColor: 'var(--color-primary)' }}></div>
          )}
          
          <p className={`${
            isTheme('slack') || isTheme('medium') ? 'text-lg' : 'text-lg md:text-xl'
          } ${isTheme('spotify') || isTheme('netflix') || isTheme('discord') || backgroundImage ? 'text-gray-300' : 'text-gray-600'} ${
            isTheme('slack') || isTheme('airbnb') ? 'max-w-2xl' : 
            isTheme('medium') ? 'max-w-3xl' : 
            'max-w-4xl mx-auto'
          } leading-relaxed font-light`}>
            {description}
          </p>
        </div>

        {features && features.length > 0 && (
          <div className={`grid md:grid-cols-2 lg:grid-cols-${isTheme('slack') ? '3' : '4'} gap-12`}>
            {features.map((feature) => {
              const IconComponent = iconMap[feature.icon] || Star;
              
              return (
                <div
                  key={feature.id}
                  className="text-center group"
                >
                  {/* OnePress style icon circle */}
                  <div className="relative mb-8">
                    <div 
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 border-2"
                      style={{
                        backgroundColor: 'rgba(var(--color-primary-rgb, 59, 130, 246), 0.1)',
                        color: 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--color-primary)';
                        e.target.style.color = 'var(--color-surface)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(var(--color-primary-rgb, 59, 130, 246), 0.1)';
                        e.target.style.color = 'var(--color-primary)';
                      }}
                    >
                      <IconComponent size={32} strokeWidth={1.5} />
                    </div>
                    {/* Decorative circle */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-4 ${isTheme('slack') ? 'text-gray-800' : 'text-gray-800'}`}>
                    {t(feature.title, feature.title)}
                  </h3>
                  
                  <p className={`leading-relaxed font-light ${isTheme('slack') ? 'text-gray-600' : 'text-gray-600'}`}>
                    {t(feature.description, feature.description)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* OnePress style call to action */}
        {(ctaTitle || ctaDescription || ctaButtonText) && (
          <div className="mt-20 text-center">
            <div className={`${isTheme('slack') ? 'bg-gray-50' : 'bg-gray-50'} rounded-lg p-12 max-w-4xl mx-auto`}>
              {ctaTitle && (
                <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${isTheme('slack') ? 'text-gray-800' : 'text-gray-800'}`}>
                  {ctaTitle}
                </h3>
              )}
              {ctaDescription && (
                <p className={`text-lg mb-8 font-light ${isTheme('slack') ? 'text-gray-600' : 'text-gray-600'}`}>
                  {ctaDescription}
                </p>
              )}
              {ctaButtonText && (
                <div className="flex justify-center">
                  <button 
                    className="text-white px-8 py-4 rounded-full font-medium transition-colors duration-300"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--border-radius-xl)'
                    }}
                    onClick={() => smartNavigate(ctaButtonLink, enabledSections, currentLangCode)}
                    onMouseEnter={(e) => e.target.style.filter = 'brightness(0.9)'}
                    onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
                  >
                    {ctaButtonText}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  User, Smartphone, Zap, Search, Star, Shield, Globe, 
  Settings, Heart, Award, CheckCircle, Target, ChevronRight, X
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
  
  // Vérifier si le CTA est vide (vérifier les strings vides après trim)
  const hasCtaTitle = ctaTitle && String(ctaTitle).trim() !== '';
  const hasCtaDescription = ctaDescription && String(ctaDescription).trim() !== '';
  const hasCtaButtonText = ctaButtonText && String(ctaButtonText).trim() !== '';
  const hasCtaButtonLink = ctaButtonLink && String(ctaButtonLink).trim() !== '';
  const hasCta = hasCtaTitle || hasCtaDescription || (hasCtaButtonText && hasCtaButtonLink);
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

  const isDefaultTheme = isTheme('default');

  const aboutSectionRef = useRef(null);
  const [stripsInView, setStripsInView] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const el = aboutSectionRef.current;
    if (!el || !isDefaultTheme) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setStripsInView(entry.isIntersecting);
        });
      },
      { rootMargin: '-10% 0px -10% 0px', threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDefaultTheme]);

  const stripDelayStep = 2.4;

  // Composant modal réutilisable (défini AVANT les returns pour être accessible partout)
  const ModalContent = () => {
    if (!isModalOpen || !selectedFeature) return null;

    const modalElement = (
      <div
        onClick={() => setIsModalOpen(false)}
        className="agency-modal-backdrop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="agency-modal-3d"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '1.5rem',
            maxWidth: '48rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 100000,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 30px 70px rgba(0, 0, 0, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.3)';
          }}
        >
          {/* Header */}
          <div
            className="sticky top-0 bg-gradient-to-br from-white to-gray-50 border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10"
            style={{
              borderRadius: '1.5rem 1.5rem 0 0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center space-x-4">
              {(() => {
                const IconComponent = iconMap[selectedFeature.icon] || Star;
                return (
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '1rem',
                      background: 'var(--gradient-primary, linear-gradient(135deg, #2563EB, #3B82F6))',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    <IconComponent size={28} strokeWidth={2} />
                  </div>
                );
              })()}
              <h3 className="text-2xl font-bold text-gray-900">
                {t(selectedFeature.title, selectedFeature.title)}
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: '#6B7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.color = '#6B7280';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
              aria-label="Fermer"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Contenu */}
          <div className="px-8 py-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                {t(selectedFeature.description, selectedFeature.description)}
              </p>

              {selectedFeature.details && (
                <div
                  className="mt-8 p-6 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    border: '1px solid rgba(37, 99, 235, 0.1)',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
                  }}
                >
                  <h4
                    className="text-xl font-bold mb-4"
                    style={{ color: 'var(--color-primary, #2563EB)' }}
                  >
                    Détails
                  </h4>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {t(selectedFeature.details, selectedFeature.details)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'var(--gradient-primary, linear-gradient(135deg, #2563EB, #3B82F6))',
                  color: 'white',
                  padding: '0.875rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.3)';
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    return typeof document !== 'undefined'
      ? createPortal(modalElement, document.body)
      : modalElement;
  };

  /* Layout thème default : grille de cartes (comme l'image), apparition une par une en boucle */
  if (isDefaultTheme) {
    return (
      <section
        ref={aboutSectionRef}
        id="about"
        className={`py-16 lg:py-24 ${animations} agency-reveal`}
        style={{
          background: 'transparent',
          color: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container mx-auto px-6 agency-about-v2" style={{ position: 'relative', zIndex: 1 }}>
          <div className="agency-about-header" style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="agency-about-title">{title}</h2>
            {description && (
              <p className="agency-about-desc">{description}</p>
            )}
          </div>

          {features && features.length > 0 && (
            <div className={`agency-about-grid ${stripsInView ? 'agency-about-grid-inview' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Star;
                return (
                  <div
                    key={feature.id}
                    className="agency-about-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="agency-about-card-icon">
                      <IconComponent size={36} strokeWidth={2} />
                    </div>
                    <h3 className="agency-about-card-title">
                      {t(feature.title, feature.title)}
                    </h3>
                    <p className="agency-about-card-desc">
                      {t(feature.description, feature.description)}
                    </p>
                    <button
                      type="button"
                      className="agency-about-card-link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedFeature(feature);
                        setIsModalOpen(true);
                      }}
                    >
                      En savoir plus
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {hasCta && (
            <div className="agency-about-cta-v2 text-center mt-12">
              {hasCtaTitle && (
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                  {ctaTitle}
                </h3>
              )}
              {hasCtaDescription && (
                <p className="text-base mb-6 max-w-2xl mx-auto text-gray-600">
                  {ctaDescription}
                </p>
              )}
              {hasCtaButtonText && hasCtaButtonLink && (
                <button
                  className="agency-about-cta-btn text-white px-8 py-4 rounded-xl font-semibold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  onClick={() => smartNavigate(ctaButtonLink, enabledSections, currentLangCode)}
                >
                  {ctaButtonText}
                </button>
              )}
            </div>
          )}
        </div>
        <ModalContent />
      </section>
    );
  }

  /* Layout standard pour les autres thèmes */
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
                <div key={feature.id} className="text-center group">
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
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-4 ${isTheme('slack') ? 'text-gray-800' : 'text-gray-800'}`}>
                    {t(feature.title, feature.title)}
                  </h3>
                  
                  <p className={`leading-relaxed font-light mb-4 ${isTheme('slack') ? 'text-gray-600' : 'text-gray-600'}`}
                    style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                    {t(feature.description, feature.description)}
                  </p>

                  <button
                    type="button"
                    className="font-medium text-sm flex items-center justify-center transition-colors duration-200 mx-auto group"
                    style={{ color: 'var(--color-primary, #3B82F6)' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFeature(feature);
                      setIsModalOpen(true);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--color-secondary, #64748B)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--color-primary, #3B82F6)';
                    }}
                  >
                    En savoir plus
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {hasCta && (
          <div className="mt-20 text-center">
            <div className={`${isTheme('slack') ? 'bg-gray-50' : 'bg-gray-50'} rounded-lg p-12 max-w-4xl mx-auto`}>
              {hasCtaTitle && (
                <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${isTheme('slack') ? 'text-gray-800' : 'text-gray-800'}`}>
                  {ctaTitle}
                </h3>
              )}
              {hasCtaDescription && (
                <p className={`text-lg mb-8 font-light ${isTheme('slack') ? 'text-gray-600' : 'text-gray-600'}`}>
                  {ctaDescription}
                </p>
              )}
              {hasCtaButtonText && hasCtaButtonLink && (
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
      <ModalContent />
    </section>
  );
};

export default AboutSection;
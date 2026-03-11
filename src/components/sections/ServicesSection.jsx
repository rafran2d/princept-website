import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Code, Palette, TrendingUp, Headphones, Globe, Settings,
  Smartphone, Zap, Shield, Star, Target, Award, ChevronRight, X, Brain, Users
} from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';

const iconMap = {
  Code, Palette, TrendingUp, Headphones: Headphones, Globe, Settings,
  Smartphone, Zap, Shield, Star, Target, Award, HeadphonesIcon: Headphones,
  Brain, Users
};

const ServicesSection = ({ section, useGlobalStyles }) => {
  const { t, currentLanguage, getActiveLanguages } = useFrontendLanguage();
  
  // Obtenir le code de la langue courante pour smartNavigate
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';
  
  // Extraction des données avec support multilingue
  const title = t(section.title, 'Nos Services');
  const description = t(section.description, '');
  const ctaTitle = t(section.ctaTitle, '');
  const ctaDescription = t(section.ctaDescription, '');
  const ctaButtonText = t(section.ctaButtonText, 'Commencer');
  
  const { services, backgroundColor, textColor, backgroundImage, ctaButtonLink } = section;
  
  // Vérifier si le CTA est vide (vérifier les strings vides après trim)
  const hasCtaTitle = ctaTitle && String(ctaTitle).trim() !== '';
  const hasCtaDescription = ctaDescription && String(ctaDescription).trim() !== '';
  const hasCtaButtonText = ctaButtonText && String(ctaButtonText).trim() !== '';
  const hasCtaButtonLink = ctaButtonLink && String(ctaButtonLink).trim() !== '';
  const hasCta = hasCtaTitle || hasCtaDescription || (hasCtaButtonText && hasCtaButtonLink);
  const { getClasses, getAnimations, isTheme, getCurrentTheme } = useThemeStyles();
  const { enabledSections } = useSections();

  const sectionStyle = useGlobalStyles ? {} : {
    ...(backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    } : {
      backgroundColor: backgroundColor || '#f8fafc'
    }),
    color: textColor || '#333333'
  };

  const isDefaultTheme = isTheme('default');
  const servicesSectionRef = useRef(null);
  const [servicesInView, setServicesInView] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const el = servicesSectionRef.current;
    if (!el || !isDefaultTheme) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setServicesInView(entry.isIntersecting));
      },
      { rootMargin: '-5% 0px -5% 0px', threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDefaultTheme]);

  const serviceCardDelay = 2;

  // Composant modal réutilisable (défini AVANT les returns pour être accessible partout)
  const ModalContent = () => {
    if (!isModalOpen || !selectedService) return null;
    
    const modalElement = (
      <div 
        onClick={() => {
          setIsModalOpen(false);
        }}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <div 
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ 
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '42rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 100000
          }}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
              {(() => {
                const IconComponent = iconMap[selectedService.icon] || Code;
                return (
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary, #3B82F6)20', color: 'var(--color-primary, #3B82F6)' }}
                  >
                    <IconComponent size={24} />
                  </div>
                );
              })()}
              <h3 className="text-2xl font-bold text-gray-900">
                {t(selectedService.title, selectedService.title)}
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="px-6 py-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {t(selectedService.description, selectedService.description)}
              </p>
              
              {selectedService.details && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Détails du service</h4>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {t(selectedService.details, selectedService.details)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: 'var(--color-primary, #3B82F6)',
                  color: 'white'
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

  /* Layout thème default : identité visuelle distincte d’À propos */
  if (isDefaultTheme) {
    return (
      <section
        ref={servicesSectionRef}
        id="services"
        className="pt-16 pb-0 lg:pt-24 lg:pb-0 agency-services-wrap"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="agency-services-title">{title}</h2>
            <div className="agency-services-title-line" />
            {description && (
              <p className="agency-services-desc">{description}</p>
            )}
          </div>

          {services && services.length > 0 && (
            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 agency-services-grid ${servicesInView ? 'agency-services-grid-inview' : ''}`} style={{ alignItems: 'stretch', position: 'relative' }}>
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Code;
                const col = index % 3;
                const row = Math.floor(index / 3);
                return (
                  <div
                    key={service.id}
                    className="agency-services-card group"
                    style={{ 
                      animationDelay: `${index * serviceCardDelay}s`,
                      '--card-delay': `${index * serviceCardDelay}s`,
                      '--card-index': index,
                      '--card-col': col,
                      '--card-row': row
                    }}
                  >
                    <div className="agency-services-card-icon">
                      <IconComponent size={44} strokeWidth={2.5} />
                    </div>
                    <h3 className="agency-services-card-title">{t(service.title, service.title)}</h3>
                    <p className="agency-services-card-desc" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {t(service.description, service.description)}
                    </p>
                    {service.details && (
                      <button
                        type="button"
                        className="agency-services-card-link"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedService(service);
                          setIsModalOpen(true);
                        }}
                      >
                        Découvrir
                        <ChevronRight size={18} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {hasCta && (
            <div className="mt-16 text-center">
              <div className="max-w-4xl mx-auto">
                {hasCtaTitle && <h3 className="text-2xl font-bold text-gray-900 mb-4">{ctaTitle}</h3>}
                {hasCtaDescription && <p className="text-gray-600 mb-6">{ctaDescription}</p>}
                {hasCtaButtonText && hasCtaButtonLink && (
                  <button
                    type="button"
                    className="text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                    onClick={() => smartNavigate(ctaButtonLink, enabledSections, currentLangCode)}
                  >
                    {ctaButtonText}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <ModalContent />
      </section>
    );
  }

  return (
    <section 
      id="services"
      className={`${isTheme('slack') ? 'py-12 lg:py-16' : 'py-12 lg:py-20'} ${getAnimations()} ${backgroundImage ? 'relative' : ''}`}
      style={isTheme('slack') ? { 
        ...(backgroundImage ? {} : { backgroundColor: '#f8f9fa' }), 
        ...sectionStyle 
      } : sectionStyle}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      <div className={`${isTheme('slack') ? 'w-full px-6 max-w-6xl mx-auto' : 'container mx-auto px-6'} ${backgroundImage ? 'relative z-10' : ''}`}>
        <div className={`${isTheme('slack') ? 'text-center' : isTheme('airbnb') || isTheme('medium') ? 'text-left' : 'text-center'} ${
          isTheme('slack') ? 'mb-16' : isTheme('medium') ? 'mb-12' : 'mb-20'
        }`}>
          <h2 className={`${
            isTheme('slack') ? 'text-4xl md:text-5xl' :
            isTheme('medium') ? 'text-3xl md:text-4xl' :
            isTheme('notion') ? 'text-3xl md:text-4xl' : 
            'text-4xl md:text-5xl'
          } font-bold mb-6 ${isTheme('slack') ? 'text-gray-800' : isTheme('spotify') || isTheme('netflix') || isTheme('discord') || backgroundImage ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h2>
          {!isTheme('medium') && !isTheme('notion') && !isTheme('slack') && (
            <div className="w-20 h-1 mx-auto mb-8" style={{ backgroundColor: 'var(--color-primary)' }}></div>
          )}
          <p className={`${
            isTheme('slack') || isTheme('medium') ? 'text-lg' : 'text-lg md:text-xl'
          } ${isTheme('slack') ? 'text-gray-600' : isTheme('spotify') || isTheme('netflix') || isTheme('discord') || backgroundImage ? 'text-gray-300' : 'text-gray-600'} ${
            isTheme('slack') || isTheme('airbnb') ? 'max-w-2xl' : 
            isTheme('medium') ? 'max-w-3xl' : 
            'max-w-4xl mx-auto'
          } leading-relaxed font-light`}>
            {description}
          </p>
        </div>

        {services && services.length > 0 && (
          <div className={`grid md:grid-cols-2 lg:grid-cols-${isTheme('slack') ? '4' : '3'} gap-6`}>
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Code;
              
              return (
                <div
                  key={service.id}
                  className={`${isTheme('slack') ? 'bg-white border border-gray-200 hover:border-purple-200' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group`}
                >
                  <div className="text-center">
                    {/* Theme-adaptive service icon */}
                    <div className="mb-6">
                      {isTheme('slack') ? (
                        <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 21, 75, 0.1)' }}>
                          <IconComponent size={24} strokeWidth={2} style={{ color: '#4A154B' }} />
                        </div>
                      ) : (
                        <div className="relative group">
                          <div 
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 border-2 group-hover:scale-110"
                            style={{
                              backgroundColor: 'var(--color-primary, #3B82F6)20',
                              color: 'var(--color-primary, #3B82F6)',
                              borderColor: 'var(--color-primary, #3B82F6)30'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'var(--color-primary, #3B82F6)';
                              e.target.style.color = 'white';
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'var(--color-primary, #3B82F6)20';
                              e.target.style.color = 'var(--color-primary, #3B82F6)';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <IconComponent size={32} strokeWidth={1.5} />
                          </div>
                          <div 
                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 transition-all duration-300 opacity-0 group-hover:opacity-100"
                            style={{ backgroundColor: 'var(--color-primary, #3B82F6)' }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    <h3 className={`${isTheme('slack') ? 'text-lg' : 'text-xl'} font-semibold mb-3 ${isTheme('slack') ? 'text-gray-900' : 'text-gray-800'}`}>
                      {t(service.title, service.title)}
                    </h3>
                    
                    <p className={`${isTheme('slack') ? 'text-sm' : 'leading-relaxed'} leading-relaxed font-light mb-4 ${isTheme('slack') ? 'text-gray-600' : 'text-gray-600'}`}
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                      {t(service.description, service.description)}
                    </p>

                    {/* Theme-adaptive service link */}
                    {!isTheme('slack') && (
                      <button 
                        type="button"
                        className="font-medium text-sm flex items-center justify-center transition-colors duration-200 mx-auto group"
                        style={{ color: 'var(--color-primary, #3B82F6)' }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedService(service);
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Theme-adaptive bottom section - only for non-Slack themes */}
        {!isTheme('slack') && hasCta && (
          <div className="mt-20 text-center">
            <div className="max-w-4xl mx-auto">
              {hasCtaTitle && (
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                  {ctaTitle}
                </h3>
              )}
              {hasCtaDescription && (
                <p className="text-lg mb-8 font-light text-gray-600">
                  {ctaDescription}
                </p>
              )}
              {hasCtaButtonText && hasCtaButtonLink && (
                <div className="flex justify-center">
                  <button 
                    className="text-white px-8 py-4 font-medium transition-colors duration-300 shadow-lg hover:shadow-xl rounded-full"
                    style={{ backgroundColor: 'var(--color-primary, #3B82F6)' }}
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
        
        {/* Slack-style simple bottom section */}
        {isTheme('slack') && hasCta && (
          <div className="mt-16 text-center">
            <div className="max-w-3xl mx-auto">
              {hasCtaDescription && (
                <p className="text-gray-600 text-lg">
                  {ctaDescription}
                </p>
              )}
              {hasCtaButtonText && hasCtaButtonLink && (
                <button 
                  className="mt-6 bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
                  onClick={() => smartNavigate(ctaButtonLink, enabledSections, currentLangCode)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#581c87'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#7c3aed'}
                >
                  {ctaButtonText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ModalContent />
    </section>
  );
};

export default ServicesSection;
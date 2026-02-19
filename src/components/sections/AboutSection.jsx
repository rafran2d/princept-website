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
  const circularImageRef = useRef(null);
  const cardRefs = useRef([]);
  const [stripsInView, setStripsInView] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollRotation, setScrollRotation] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

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

  // Détection de l'intersection entre l'ovale et les cartes
  useEffect(() => {
    if (!isDefaultTheme || !circularImageRef.current || !aboutSectionRef.current) return;

    const checkIntersections = () => {
      const circularElement = circularImageRef.current;
      if (!circularElement) return;

      const ovalRect = circularElement.getBoundingClientRect();
      const ovalCenterX = ovalRect.left + ovalRect.width / 2;
      const ovalCenterY = ovalRect.top + ovalRect.height / 2;
      const ovalRadiusX = ovalRect.width / 2;
      const ovalRadiusY = ovalRect.height / 2;

      // Convertir la rotation en radians
      const rotationRad = (scrollRotation * Math.PI) / 180;
      
      // Point de référence sur le périmètre de l'ovale (bord droit avant rotation)
      // On utilise un point sur le bord de l'ovale qui tourne avec lui
      const referenceAngle = rotationRad;
      const refX = ovalCenterX + Math.cos(referenceAngle) * ovalRadiusX * 0.9;
      const refY = ovalCenterY + Math.sin(referenceAngle) * ovalRadiusY * 0.9;

      let closestIndex = null;
      let minDistance = Infinity;

      cardRefs.current.forEach((cardRef, index) => {
        if (!cardRef) return;

        const cardRect = cardRef.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        // Distance entre le centre de la carte et le point de référence sur l'ovale
        const dx = cardCenterX - refX;
        const dy = cardCenterY - refY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Vérifier aussi si la carte est dans l'ovale
        const dxFromCenter = (cardCenterX - ovalCenterX) / ovalRadiusX;
        const dyFromCenter = (cardCenterY - ovalCenterY) / ovalRadiusY;
        const isInsideOval = (dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter) <= 1.2;

        // Trouver la carte la plus proche du point de référence ET dans l'ovale
        if (isInsideOval && distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setHoveredCardIndex(closestIndex);
    };

    const handleScroll = () => {
      checkIntersections();
    };

    const handleResize = () => {
      checkIntersections();
    };

    // Vérifier initialement et à chaque scroll/resize
    checkIntersections();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Vérifier aussi périodiquement pour la rotation (plus fréquent pour une transition fluide)
    const interval = setInterval(checkIntersections, 50);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [isDefaultTheme, scrollRotation]);

  // Animation de rotation au scroll pour l'image circulaire
  useEffect(() => {
    if (!isDefaultTheme || !circularImageRef.current || !aboutSectionRef.current) return;

    const handleScroll = () => {
      const sectionElement = aboutSectionRef.current;
      const circularElement = circularImageRef.current;
      if (!sectionElement || !circularElement) return;

      const sectionRect = sectionElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculer quand la section entre et sort de la vue
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const sectionHeight = sectionRect.height;
      
      // Rotation basée sur le scroll dans la section
      // Commence à tourner quand la section entre dans la vue
      // Continue à tourner pendant tout le scroll de la section
      const scrollStart = windowHeight; // Quand la section commence à entrer
      const scrollEnd = -sectionHeight; // Quand la section sort complètement
      const scrollRange = scrollStart - scrollEnd;
      
      // Position actuelle de la section
      const currentScroll = sectionTop;
      
      // Calculer le pourcentage de scroll (0 à 1)
      const scrollProgress = Math.max(0, Math.min(1, (scrollStart - currentScroll) / scrollRange));
      
      // Rotation complète (360 degrés) pendant le scroll de la section
      const maxRotation = 720; // 2 tours complets pour un effet plus visible
      const rotation = scrollProgress * maxRotation;
      
      setScrollRotation(rotation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Appel initial
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDefaultTheme]);

  const stripDelayStep = 2.4;

  // Composant modal réutilisable avec design 3D (défini AVANT les returns pour être accessible partout)
  const ModalContent = () => {
    if (!isModalOpen || !selectedFeature) return null;
    
    const modalElement = (
      <div 
        onClick={() => {
          console.log('Closing modal - backdrop clicked');
          setIsModalOpen(false);
        }}
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
          padding: '1rem',
          perspective: '2000px'
        }}
      >
        <div 
          onClick={(e) => {
            e.stopPropagation();
            console.log('Modal content clicked');
          }}
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
            transform: 'perspective(2000px) rotateY(-2deg) rotateX(4deg)',
            transformStyle: 'preserve-3d',
            boxShadow: 
              '0 30px 80px rgba(0, 0, 0, 0.4), ' +
              '0 0 0 1px rgba(255, 255, 255, 0.1), ' +
              '-20px 0 60px rgba(0, 0, 0, 0.3), ' +
              '0 20px 60px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'perspective(2000px) rotateY(0deg) rotateX(0deg) translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = 
              '0 40px 100px rgba(0, 0, 0, 0.5), ' +
              '0 0 0 1px rgba(63, 111, 247, 0.2), ' +
              '-25px 0 80px rgba(0, 0, 0, 0.4), ' +
              '0 25px 80px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'perspective(2000px) rotateY(-2deg) rotateX(4deg)';
            e.currentTarget.style.boxShadow = 
              '0 30px 80px rgba(0, 0, 0, 0.4), ' +
              '0 0 0 1px rgba(255, 255, 255, 0.1), ' +
              '-20px 0 60px rgba(0, 0, 0, 0.3), ' +
              '0 20px 60px rgba(0, 0, 0, 0.2)';
          }}
        >
          {/* Header avec effet 3D */}
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
                    className="agency-modal-icon-3d"
                    style={{ 
                      width: '56px',
                      height: '56px',
                      borderRadius: '1rem',
                      background: 'linear-gradient(135deg, #3f6ff7 0%, #2d5ae6 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(63, 111, 247, 0.3), 0 0 0 4px rgba(63, 111, 247, 0.1)',
                      transform: 'translateZ(20px)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <IconComponent size={28} strokeWidth={2} />
                  </div>
                );
              })()}
              <h3 
                className="text-2xl font-bold text-gray-900"
                style={{
                  transform: 'translateZ(10px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {t(selectedFeature.title, selectedFeature.title)}
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="agency-modal-close-btn"
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
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transform: 'translateZ(10px)',
                transformStyle: 'preserve-3d'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.transform = 'translateZ(15px) rotate(90deg)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.color = '#6B7280';
                e.currentTarget.style.transform = 'translateZ(10px) rotate(0deg)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
              }}
              aria-label="Fermer"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Contenu avec effet de profondeur */}
          <div 
            className="px-8 py-8"
            style={{
              transform: 'translateZ(5px)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="prose prose-lg max-w-none">
              <p 
                className="text-gray-700 leading-relaxed mb-6 text-lg"
                style={{
                  transform: 'translateZ(5px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {t(selectedFeature.description, selectedFeature.description)}
              </p>
              
              {selectedFeature.details && (
                <div 
                  className="mt-8 p-6 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(63, 111, 247, 0.05)',
                    border: '1px solid rgba(63, 111, 247, 0.1)',
                    transform: 'translateZ(10px)',
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 4px 12px rgba(63, 111, 247, 0.1)'
                  }}
                >
                  <h4 
                    className="text-xl font-bold text-gray-900 mb-4"
                    style={{
                      color: '#3f6ff7',
                      transform: 'translateZ(5px)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    Détails
                  </h4>
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-line"
                    style={{
                      transform: 'translateZ(5px)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {t(selectedFeature.details, selectedFeature.details)}
                  </div>
                </div>
              )}
            </div>
            
            {/* Bouton avec effet 3D */}
            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="agency-modal-btn-3d"
                style={{ 
                  backgroundColor: '#3f6ff7',
                  color: 'white',
                  padding: '0.875rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  transform: 'translateZ(15px)',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 8px 24px rgba(63, 111, 247, 0.3), 0 0 0 4px rgba(63, 111, 247, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateZ(20px) translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(63, 111, 247, 0.4), 0 0 0 6px rgba(63, 111, 247, 0.15)';
                  e.currentTarget.style.backgroundColor = '#2d5ae6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateZ(15px) translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(63, 111, 247, 0.3), 0 0 0 4px rgba(63, 111, 247, 0.1)';
                  e.currentTarget.style.backgroundColor = '#3f6ff7';
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
        <div className="container mx-auto px-6 agency-about-v2" style={{ position: 'relative', zIndex: 1, minHeight: '600px' }}>
          {/* Image circulaire rotative avec effet arc-en-ciel - Fond complet de la section */}
          <div 
            ref={circularImageRef}
            className="agency-about-circular-image"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '140vw',
              height: '80vw',
              maxWidth: '1800px',
              maxHeight: '1000px',
              zIndex: 0,
              pointerEvents: 'none',
              opacity: 0
            }}
          >
            <div
              className="agency-circular-rainbow"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                transform: `rotate(${scrollRotation}deg)`,
                transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              {/* Cercle extérieur avec bordure plus épaisse - invisible */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '2px solid #6d96fc',
                  opacity: 0,
                  filter: 'drop-shadow(0 0 60px rgba(0, 0, 0, 0.08)) drop-shadow(0 0 120px rgba(0, 0, 0, 0.05)) drop-shadow(0 0 180px rgba(0, 0, 0, 0.03))'
                }}
              />
              
              {/* Cercle intermédiaire avec bordure plus épaisse - invisible */}
              <div
                style={{
                  position: 'absolute',
                  inset: '5%',
                  borderRadius: '50%',
                  border: '2px solid #6d96fc',
                  opacity: 0,
                  filter: 'drop-shadow(0 0 40px rgba(0, 0, 0, 0.06)) drop-shadow(0 0 80px rgba(0, 0, 0, 0.04))'
                }}
              />
              
              {/* Cercle intérieur avec bordure plus épaisse - invisible */}
              <div
                style={{
                  position: 'absolute',
                  inset: '10%',
                  borderRadius: '50%',
                  border: '1.5px solid #6d96fc',
                  opacity: 0,
                  filter: 'drop-shadow(0 0 30px rgba(0, 0, 0, 0.05))'
                }}
              />
              
              {/* Cercles supplémentaires avec bordures plus épaisses - invisibles */}
              <div
                style={{
                  position: 'absolute',
                  inset: '15%',
                  borderRadius: '50%',
                  border: '1.5px solid #6d96fc',
                  opacity: 0,
                  filter: 'drop-shadow(0 0 25px rgba(0, 0, 0, 0.04))'
                }}
              />
              
              <div
                style={{
                  position: 'absolute',
                  inset: '20%',
                  borderRadius: '50%',
                  border: '1px solid #6d96fc',
                  opacity: 0,
                  filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.03))'
                }}
              />
              
              <div
                style={{
                  position: 'absolute',
                  inset: '25%',
                  borderRadius: '50%',
                  border: '1px solid #6d96fc',
                  opacity: 0,
                  filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.02))'
                }}
              />
            </div>
          </div>

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
                    ref={(el) => {
                      if (el) cardRefs.current[index] = el;
                    }}
                    className={`agency-about-card ${hoveredCardIndex === index ? 'agency-about-card-oval-hover' : ''}`}
                    style={{ animationDelay: `${index * stripDelayStep}s` }}
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
                        console.log('Opening modal for feature:', feature.title);
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
                      console.log('Opening modal for feature:', feature.title);
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
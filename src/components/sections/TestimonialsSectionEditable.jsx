import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSections } from '../../hooks/useSections';
import { smartNavigate } from '../../utils/navigation';
import { useFrontendLanguage } from '../LanguageSelector';
import { EditableTitle, EditableDescription, EditableButton } from '../EditableText';
import InlineImageEditor from '../InlineImageEditor';

const TestimonialsSectionEditable = ({ section, useGlobalStyles, isEditing = false }) => {
  const { title, description, testimonials = [], backgroundColor, textColor, backgroundImage, ctaButtonText, ctaButtonLink } = section;
  const { getClasses, getAnimations, isTheme } = useThemeStyles();
  const { enabledSections } = useSections();
  const { currentLanguage, getActiveLanguages } = useFrontendLanguage();
  
  // Obtenir le code de la langue courante pour smartNavigate
  const currentLangCode = getActiveLanguages().find(l => l.id === currentLanguage)?.code || 'fr';

  // Fonction pour rediriger vers la section contact
  const scrollToContact = () => {
    // Trouver la section contact pour vérifier son mode de navigation
    const contactSection = enabledSections.find(s => s.type === 'contact');
    
    if (contactSection?.navigationMode === 'newpage') {
      // Si contact est en mode nouvelle page, rediriger vers la route dédiée
      // Obtenir la langue courante depuis l'URL
      const currentLang = window.location.pathname.match(/^\/([a-z]{2})\//)?.[1] || 'fr';
      window.location.href = `/${currentLang}/section/contact`;
      return;
    }
    
    // Sinon, comportement normal de scroll ou redirection homepage
    const element = document.getElementById('contact');
    if (element) {
      // Si on est sur la page d'accueil, scroller directement
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // Si on est sur une page de section individuelle, rediriger vers la homepage avec ancre
      // Obtenir la langue courante depuis l'URL
      const currentLang = window.location.pathname.match(/^\/([a-z]{2})\//)?.[1] || 'fr';
      window.location.href = `/${currentLang}/#contact`;
    }
  };

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

  const placeholderTestimonials = [
    {
      id: 1,
      name: 'Marie Dubois',
      role: 'Directrice Marketing',
      company: 'TechCorp',
      content: 'Excellent service ! L\'équipe a dépassé nos attentes et livré un produit de qualité exceptionnelle.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b742?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80'
    },
    {
      id: 2,
      name: 'Pierre Martin',
      role: 'CEO',
      company: 'StartupXYZ',
      content: 'Professionnalisme et expertise technique au rendez-vous. Je recommande vivement leurs services.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80'
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      role: 'Responsable Digital',
      company: 'AgenceWeb',
      content: 'Une collaboration fluide et des résultats qui parlent d\'eux-mêmes. Merci pour votre excellent travail !',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80'
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : placeholderTestimonials;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <section
      id="testimonials"
      className={`${isTheme('slack') ? 'py-12 lg:py-16' : 'py-12 lg:py-20'} ${getAnimations()} ${backgroundImage ? 'relative' : ''}`}
      style={isTheme('slack') ? {
        ...(backgroundImage ? {} : { backgroundColor: '#f8f9fa' }),
        ...sectionStyle
      } : sectionStyle}
    >
      {isEditing && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm">
            <p className="text-sm font-semibold text-gray-700 mb-3">Image de fond</p>
            <InlineImageEditor
              sectionId={section.id}
              fieldPath="backgroundImage"
              currentImageUrl={backgroundImage}
              placeholder="Ajouter une image de fond"
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
        <div className={`${isTheme('slack') || isTheme('airbnb') || isTheme('medium') ? 'text-left' : 'text-center'} mb-16`}>
          {isEditing ? (
            <EditableTitle
              sectionId={section.id}
              fieldPath="title"
              className={`${
                isTheme('slack') ? 'text-4xl md:text-5xl' :
                isTheme('medium') ? 'text-3xl md:text-4xl' :
                'text-3xl md:text-4xl'
              } font-bold mb-6 ${isTheme('slack') ? 'text-gray-800' : isTheme('spotify') || isTheme('netflix') || isTheme('discord') ? 'text-white' : 'text-gray-800'}`}
              placeholder="Titre des témoignages"
              tag="h2"
            />
          ) : (
            <h2 className={`${
              isTheme('slack') ? 'text-4xl md:text-5xl' :
              isTheme('medium') ? 'text-3xl md:text-4xl' :
              'text-3xl md:text-4xl'
            } font-bold mb-6 ${isTheme('slack') ? 'text-gray-800' : isTheme('spotify') || isTheme('netflix') || isTheme('discord') ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
          )}
          {!isTheme('slack') && !isTheme('medium') && !isTheme('notion') && (
            <div className="w-20 h-1 mx-auto mb-8" style={{ backgroundColor: 'var(--color-primary)' }}></div>
          )}
          {isEditing ? (
            <EditableDescription
              sectionId={section.id}
              fieldPath="description"
              className={`${
                isTheme('slack') || isTheme('medium') ? 'text-lg' : 'text-lg md:text-xl'
              } ${isTheme('slack') ? 'text-gray-600' : isTheme('spotify') || isTheme('netflix') || isTheme('discord') ? 'text-gray-300 opacity-80' : 'opacity-80'} ${
                isTheme('slack') || isTheme('airbnb') ? 'max-w-2xl' :
                isTheme('medium') ? 'max-w-3xl' :
                'max-w-3xl mx-auto'
              } leading-relaxed`}
              placeholder="Description des témoignages"
            />
          ) : (
            <p className={`${
              isTheme('slack') || isTheme('medium') ? 'text-lg' : 'text-lg md:text-xl'
            } ${isTheme('slack') ? 'text-gray-600' : isTheme('spotify') || isTheme('netflix') || isTheme('discord') ? 'text-gray-300 opacity-80' : 'opacity-80'} ${
              isTheme('slack') || isTheme('airbnb') ? 'max-w-2xl' :
              isTheme('medium') ? 'max-w-3xl' :
              'max-w-3xl mx-auto'
            } leading-relaxed`}>
              {description}
            </p>
          )}
        </div>

        <div className={`grid md:grid-cols-2 lg:grid-cols-${isTheme('slack') ? '3' : '3'} gap-6`}>
          {displayTestimonials.map((testimonial, testimonialIndex) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative"
              style={{
                backgroundColor: backgroundColor === '#ffffff' ? '#ffffff' : `${backgroundColor}10`,
                borderColor: backgroundColor === '#ffffff' ? '#e5e7eb' : `${textColor}10`
              }}
            >
              <div className="absolute -top-4 left-8">
                <div className="rounded-full p-3" style={{ backgroundColor: isTheme('slack') ? 'rgba(74, 21, 75, 0.1)' : 'var(--color-primary)20' }}>
                  <Quote className="w-6 h-6" style={{ color: isTheme('slack') ? '#4A154B' : 'var(--color-primary)' }} />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {isEditing ? (
                  <EditableDescription
                    sectionId={section.id}
                    fieldPath={`testimonials.${testimonialIndex}.content`}
                    className="text-gray-700 italic mb-6 leading-relaxed"
                    placeholder="Contenu du témoignage"
                  />
                ) : (
                  <p className="text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                )}

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    {isEditing ? (
                      <EditableButton
                        sectionId={section.id}
                        fieldPath={`testimonials.${testimonialIndex}.name`}
                        className="font-semibold text-gray-900"
                        placeholder="Nom"
                        tag="h4"
                      />
                    ) : (
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    )}
                    {isEditing ? (
                      <EditableButton
                        sectionId={section.id}
                        fieldPath={`testimonials.${testimonialIndex}.role`}
                        className="text-sm text-gray-500 inline"
                        placeholder="Rôle"
                      />
                    ) : (
                      <p className="text-sm text-gray-500">
                        {testimonial.role} - {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ctaButtonText && (
          <div className="mt-16 text-center">
            <div className="rounded-lg p-8 max-w-2xl mx-auto" style={{ backgroundColor: isTheme('slack') ? 'rgba(74, 21, 75, 0.05)' : 'var(--color-primary)05' }}>
              <button 
                onClick={() => smartNavigate(ctaButtonLink, enabledSections, currentLangCode)}
                className={`text-white px-6 py-3 transition-colors duration-200 ${
                  isTheme('slack') ? 'rounded-lg' : 'rounded-lg'
                }`}
                style={{
                  backgroundColor: isTheme('slack') ? '#4A154B' : 'var(--color-primary)'
                }}
                onMouseEnter={(e) => e.target.style.filter = 'brightness(0.9)'}
                onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
              >
                {ctaButtonText}
              </button>
            </div>
          </div>
        )}

        {testimonials.length === 0 && (
          <div className="mt-8 text-center opacity-60">
            <Quote className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Témoignages de démonstration - Ajoutez vos propres témoignages dans l'administration</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSectionEditable;
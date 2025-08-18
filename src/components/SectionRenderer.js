import React from 'react';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ContactSection from './sections/ContactSection';
import GallerySection from './sections/GallerySection';
import TestimonialsSection from './sections/TestimonialsSection';
import CTASection from './sections/CTASection';
import { getThemedComponents } from '../data/themedComponents';
import { predefinedThemes } from '../data/themes';
import { useLanguage } from '../contexts/LanguageContext';

const sectionComponents = {
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  contact: ContactSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  cta: CTASection
};

// Utility function to add !important to CSS properties automatically
const addImportantToCSS = (cssText) => {
  if (!cssText) return '';
  
  // Split CSS into individual declarations
  const declarations = cssText.split(';').filter(decl => decl.trim());
  
  // Process each declaration
  const processedDeclarations = declarations.map(declaration => {
    const trimmed = declaration.trim();
    if (!trimmed) return trimmed;
    
    // Skip CSS comments
    if (trimmed.startsWith('/*') || trimmed.includes('*/')) {
      return trimmed;
    }
    
    // Check if !important is already present
    if (trimmed.toLowerCase().includes('!important')) {
      return trimmed;
    }
    
    // Add !important to the declaration
    return `${trimmed} !important`;
  });
  
  return processedDeclarations.join(';\n  ') + (processedDeclarations.length > 0 ? ';' : '');
};

const SectionRenderer = ({ section }) => {
  const { getLocalizedValue } = useLanguage();
  
  // Fonction pour convertir un objet multilingue en string
  const convertMultilingualToString = (value) => {
    console.log('🔍 SectionRenderer - Conversion:', { value, type: typeof value });
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && (value.fr || value.en)) {
      const result = getLocalizedValue(value);
      console.log('🔍 SectionRenderer - Résultat getLocalizedValue:', result);
      return result;
    }
    return value;
  };
  
  // Convertir la section multilingue en section avec strings
  const localizedSection = React.useMemo(() => {
    const localized = { ...section };
    
    // Convertir les champs texte principaux
    ['title', 'subtitle', 'description', 'buttonText', 'ctaTitle', 'ctaDescription', 'ctaButtonText'].forEach(field => {
      if (localized[field]) {
        localized[field] = convertMultilingualToString(localized[field]);
      }
    });
    
    // Convertir les features
    if (localized.features && Array.isArray(localized.features)) {
      localized.features = localized.features.map(feature => ({
        ...feature,
        title: convertMultilingualToString(feature.title),
        description: convertMultilingualToString(feature.description)
      }));
    }
    
    // Convertir les services
    if (localized.services && Array.isArray(localized.services)) {
      localized.services = localized.services.map(service => ({
        ...service,
        title: convertMultilingualToString(service.title),
        description: convertMultilingualToString(service.description)
      }));
    }
    
    // Convertir les témoignages
    if (localized.testimonials && Array.isArray(localized.testimonials)) {
      localized.testimonials = localized.testimonials.map(testimonial => ({
        ...testimonial,
        name: convertMultilingualToString(testimonial.name),
        role: convertMultilingualToString(testimonial.role),
        company: convertMultilingualToString(testimonial.company),
        content: convertMultilingualToString(testimonial.content)
      }));
    }
    
    // Convertir les images (alt text)
    if (localized.images && Array.isArray(localized.images)) {
      localized.images = localized.images.map(image => ({
        ...image,
        alt: convertMultilingualToString(image.alt)
      }));
    }
    
    return localized;
  }, [section, getLocalizedValue]);
  
  // Obtenir le thème actif
  const activeThemeId = localStorage.getItem('activeTheme') || 'default';
  const currentTheme = predefinedThemes[activeThemeId];
  const themedComponents = getThemedComponents(activeThemeId);
  
  // Vérifier s'il y a un composant thématique pour cette section
  let Component = sectionComponents[localizedSection.type];
  
  // Si c'est un type de section thématique, utiliser le composant thématique
  if (localizedSection.themed && themedComponents.sections) {
    const themedSection = themedComponents.sections.find(s => s.id === localizedSection.type);
    if (themedSection && themedSection.component) {
      Component = themedSection.component;
    }
  }
  
  if (!Component) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-800">
        <p>Section type "{localizedSection.type}" not found</p>
      </div>
    );
  }

  // Generate unique ID for section-specific styles
  const sectionId = `section-${localizedSection.id}`;

  // Process custom CSS to add !important automatically
  const processedCustomCSS = addImportantToCSS(localizedSection.customCss);

  return (
    <div id={sectionId} className="section-wrapper" data-section-type={localizedSection.type}>
      {/* Build CSS with proper priority order based on useGlobalStyles setting */}
      <style>
        {`
          /* 1. Global styles are already applied via CSS variables */
          
          /* 2. Section-specific styles (conditional based on useGlobalStyles) */
          ${!localizedSection.useGlobalStyles ? `
            #${sectionId} {
              ${localizedSection.backgroundColor ? `background-color: ${localizedSection.backgroundColor} !important;` : ''}
              ${localizedSection.textColor ? `color: ${localizedSection.textColor} !important;` : ''}
              ${localizedSection.backgroundImage ? `
                background-image: url(${localizedSection.backgroundImage}) !important;
                background-size: ${localizedSection.backgroundSize || 'cover'} !important;
                background-position: ${localizedSection.backgroundPosition || 'center center'} !important;
                background-repeat: no-repeat !important;
              ` : ''}
            }
          ` : `
            #${sectionId} {
              background-color: var(--color-background) !important;
              color: var(--color-text-primary) !important;
            }
            #${sectionId} * {
              color: var(--color-text-primary) !important;
            }
            #${sectionId} .section-content {
              background-color: var(--color-surface) !important;
            }
          `}
          
          /* 3. Custom CSS from free field (highest priority with auto !important) */
          ${processedCustomCSS ? `
            #${sectionId} { 
              ${processedCustomCSS}
            }
          ` : ''}
        `}
      </style>
      <Component 
        section={localizedSection} 
        useGlobalStyles={localizedSection.useGlobalStyles} 
        theme={currentTheme}
      />
    </div>
  );
};

export default SectionRenderer;
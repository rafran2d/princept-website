import React, { useState, useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import HeroSectionEditable from './sections/HeroSectionEditable';
import HeroSlider from './sections/HeroSlider';
import HeroSliderEditable from './sections/HeroSliderEditable';
import AboutSection from './sections/AboutSection';
import AboutSectionEditable from './sections/AboutSectionEditable';
import ServicesSection from './sections/ServicesSection';
import ServicesSectionEditable from './sections/ServicesSectionEditable';
import ContactSection from './sections/ContactSection';
import ContactSectionEditable from './sections/ContactSectionEditable';
import GallerySection from './sections/GallerySection';
import GallerySectionEditable from './sections/GallerySectionEditable';
import TestimonialsSection from './sections/TestimonialsSection';
import TestimonialsSectionEditable from './sections/TestimonialsSectionEditable';
import CTASection from './sections/CTASection';
import CTASectionEditable from './sections/CTASectionEditable';
import BlogSection from './sections/BlogSection';
import BlogSectionEditable from './sections/BlogSectionEditable';
import { getThemedComponents } from '../data/themedComponents';
import { predefinedThemes } from '../data/themes';
import { useLanguage } from '../contexts/LanguageContextDB';
import { useAuth } from '../contexts/AuthContext';

const sectionComponents = {
  hero: HeroSection,
  'hero-slider': HeroSlider,
  about: AboutSection,
  services: ServicesSection,
  contact: ContactSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  cta: CTASection,
  blog: BlogSection
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

const SectionRenderer = ({ section, isEditMode = false }) => {
  const { getLocalizedValue } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [localEditMode, setLocalEditMode] = useState(false);

  // Mode édition disponible seulement pour les utilisateurs connectés
  const canEdit = isAuthenticated && (isEditMode || localEditMode);

  // Écouter les changements de mode édition global
  useEffect(() => {
    const handleEditModeChange = (event) => {
      setLocalEditMode(event.detail.isEditMode);
    };

    window.addEventListener('cms:editModeChanged', handleEditModeChange);
    return () => {
      window.removeEventListener('cms:editModeChanged', handleEditModeChange);
    };
  }, []);
  
  // Fonction pour convertir un objet multilingue en string
  const convertMultilingualToString = (value) => {
    // Si c'est déjà une string, la retourner
    if (typeof value === 'string') return value;

    // Si c'est null ou undefined, retourner une string vide
    if (value === null || value === undefined) return '';

    // Si c'est un objet multilingue, le convertir
    if (value && typeof value === 'object') {
      const result = getLocalizedValue(value);

      // S'assurer que le résultat est une string
      if (typeof result === 'string') {
        return result;
      }

      // Si getLocalizedValue retourne encore un objet, logger l'erreur
      if (typeof result === 'object') {
        return '';
      }

      // Convertir en string
      return String(result || '');
    }

    // Pour tout autre type (nombre, boolean, etc.), convertir en string
    return String(value);
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
    
    // Convertir les slides (pour hero-slider)
    if (localized.slides && Array.isArray(localized.slides)) {
      localized.slides = localized.slides.map(slide => {
        const convertedSlide = { ...slide };
        
        // Convertir chaque champ multilingue
        ['title', 'subtitle', 'description', 'buttonText', 'secondaryButtonText'].forEach(field => {
          if (convertedSlide[field] !== undefined && convertedSlide[field] !== null) {
            const converted = convertMultilingualToString(convertedSlide[field]);
            // S'assurer que c'est bien une string
            convertedSlide[field] = typeof converted === 'string' ? converted : String(converted || '');
          } else {
            convertedSlide[field] = '';
          }
        });
        
        return convertedSlide;
      });
      
    }
    
    // Convertir les posts de blog
    if (localized.posts && Array.isArray(localized.posts)) {
      localized.posts = localized.posts.map(post => {
        const convertedPost = { ...post };
        ['title', 'summary', 'content', 'author', 'category'].forEach(field => {
          if (convertedPost[field] !== undefined && convertedPost[field] !== null) {
            const converted = convertMultilingualToString(convertedPost[field]);
            convertedPost[field] = typeof converted === 'string' ? converted : String(converted || '');
          } else {
            convertedPost[field] = '';
          }
        });
        
        return convertedPost;
      });
      
    }
    
    return localized;
  }, [section, getLocalizedValue]);
  
  // Obtenir le thème actif
  const activeThemeId = localStorage.getItem('activeTheme') || 'default';
  const currentTheme = predefinedThemes[activeThemeId];
  const themedComponents = getThemedComponents(activeThemeId);
  
  // Vérifier s'il y a un composant thématique pour cette section
  let Component = sectionComponents[localizedSection.type];

  // Si en mode édition, utiliser les versions éditables
  if (canEdit) {
    switch (localizedSection.type) {
      case 'hero':
        Component = HeroSectionEditable;
        break;
      case 'hero-slider':
        Component = HeroSliderEditable;
        break;
      case 'about':
        Component = AboutSectionEditable;
        break;
      case 'services':
        Component = ServicesSectionEditable;
        break;
      case 'contact':
        Component = ContactSectionEditable;
        break;
      case 'gallery':
        Component = GallerySectionEditable;
        break;
      case 'testimonials':
        Component = TestimonialsSectionEditable;
        break;
      case 'cta':
        Component = CTASectionEditable;
        break;
      case 'blog':
        Component = BlogSectionEditable;
        break;
      default:
        // Garder le composant par défaut
        break;
    }
  }

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

  // Vérifier si la section CTA est vide et ne pas l'afficher (sauf en mode édition)
  if (localizedSection.type === 'cta' && !canEdit) {
    const hasTitle = localizedSection.title && String(localizedSection.title).trim() !== '';
    const hasDescription = localizedSection.description && String(localizedSection.description).trim() !== '';
    const hasButtonText = localizedSection.buttonText && String(localizedSection.buttonText).trim() !== '';
    const hasButtonLink = localizedSection.buttonLink && String(localizedSection.buttonLink).trim() !== '';
    
    if (!hasTitle && !hasDescription && !hasButtonText && !hasButtonLink) {
      return null;
    }
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
        isEditing={canEdit}
      />
    </div>
  );
};

export default SectionRenderer;
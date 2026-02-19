import { useState, useEffect } from 'react';
import { getThemeStyles, getThemeClasses, getThemeInlineStyles, getThemeAnimations } from '../utils/themeStyles';

export const useThemeStyles = () => {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('activeTheme') || 'default';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('activeTheme') || 'default';
      setActiveTheme(newTheme);
    };

    // Écouter les changements dans localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement les changements (pour les changements dans la même fenêtre)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getCurrentTheme = () => activeTheme;
  
  const getStyles = (component = 'section') => getThemeStyles(activeTheme, component);
  
  const getClasses = (component = 'section') => getThemeClasses(activeTheme, component);
  
  const getInlineStyles = (component = 'section') => getThemeInlineStyles(activeTheme, component);
  
  const getAnimations = () => getThemeAnimations(activeTheme);
  
  const isTheme = (themeId) => activeTheme === themeId;
  
  const getThemeCategory = () => {
    const themeCategories = {
      github: 'Tech',
      apple: 'Tech',
      airbnb: 'Lifestyle',
      spotify: 'Entertainment',
      netflix: 'Entertainment',
      youtube: 'Entertainment',
      slack: 'Business',
      linkedin: 'Professional',
      notion: 'Productivity',
      stripe: 'Fintech',
      shopify: 'E-commerce',
      figma: 'Design',
      dribbble: 'Design',
      behance: 'Design',
      discord: 'Gaming',
      twitch: 'Gaming',
      medium: 'Publishing',
      instagram: 'Social',
      whatsapp: 'Communication',
      uber: 'Transport'
    };
    return themeCategories[activeTheme] || 'Tech';
  };

  return {
    activeTheme,
    getCurrentTheme,
    getStyles,
    getClasses,
    getInlineStyles,
    getAnimations,
    isTheme,
    getThemeCategory
  };
};
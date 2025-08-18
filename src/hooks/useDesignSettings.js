import { useState, useEffect, useRef } from 'react';

const DEFAULT_SETTINGS = {
  colors: {
    primary: '#3B82F6',
    secondary: '#64748B',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      light: '#94A3B8'
    }
  },
  typography: {
    fontFamily: 'Inter',
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  layout: {
    containerMaxWidth: '1200px',
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      '2xl': '4rem'
    },
    borderRadius: {
      sm: '0.25rem',
      base: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    }
  },
  animation: {
    duration: '300ms',
    easing: 'ease-in-out'
  }
};

export const useDesignSettings = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('designSettings');
    return savedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_SETTINGS;
  });
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('designSettings', JSON.stringify(settings));
    
    // Debounce DOM updates to prevent focus loss
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      applyDesignToDocument(settings);
    }, 100); // Short delay to batch updates
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [settings]);

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('designSettings');
  };

  const applyTheme = (theme) => {
    const themeSettings = {
      colors: theme.colors,
      typography: theme.typography,
      layout: theme.layout,
      animation: theme.animation || DEFAULT_SETTINGS.animation
    };
    setSettings(themeSettings);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'design-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          const mergedSettings = { ...DEFAULT_SETTINGS, ...importedSettings };
          setSettings(mergedSettings);
          resolve(mergedSettings);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  return {
    settings,
    updateSetting,
    resetSettings,
    applyTheme,
    exportSettings,
    importSettings,
    defaultSettings: DEFAULT_SETTINGS
  };
};

const applyDesignToDocument = (settings) => {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--color-primary', settings.colors.primary);
  root.style.setProperty('--color-secondary', settings.colors.secondary);
  root.style.setProperty('--color-accent', settings.colors.accent);
  root.style.setProperty('--color-success', settings.colors.success);
  root.style.setProperty('--color-warning', settings.colors.warning);
  root.style.setProperty('--color-error', settings.colors.error);
  root.style.setProperty('--color-background', settings.colors.background);
  root.style.setProperty('--color-surface', settings.colors.surface);
  root.style.setProperty('--color-text-primary', settings.colors.text.primary);
  root.style.setProperty('--color-text-secondary', settings.colors.text.secondary);
  root.style.setProperty('--color-text-light', settings.colors.text.light);
  
  root.style.setProperty('--font-family', settings.typography.fontFamily);
  root.style.setProperty('--container-max-width', settings.layout.containerMaxWidth);
  root.style.setProperty('--animation-duration', settings.animation.duration);
  root.style.setProperty('--animation-easing', settings.animation.easing);
  
  // Apply font sizes
  Object.entries(settings.typography.fontSizes).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });
  
  // Apply spacing
  Object.entries(settings.layout.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
  
  // Apply border radius
  Object.entries(settings.layout.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--border-radius-${key}`, value);
  });

  // Removed aggressive DOM manipulation that was causing focus loss
};
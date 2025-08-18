import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import DynamicLanguageRouter from './components/DynamicLanguageRouter';
import { useDesignSettings } from './hooks/useDesignSettings';
import { LanguageProvider } from './contexts/LanguageContext';


function App() {
  console.log('🌟 APP.JS - App component loaded, current URL:', window.location.href);
  const { settings } = useDesignSettings();

  useEffect(() => {
    // Récupérer le thème actuel depuis localStorage (pour éviter les dépendances circulaires)
    const activeThemeId = localStorage.getItem('activeTheme') || 'default';
    
    // Import local des thèmes pour éviter les dépendances circulaires
    const getTheme = (themeId) => {
      const themes = {
        default: {
          colors: { primary: '#3B82F6', secondary: '#64748B', accent: '#F59E0B', background: '#F8FAFC', surface: '#FFFFFF', text: { primary: '#1E293B', secondary: '#64748B', light: '#94A3B8' } },
          typography: { fontFamily: 'Inter', fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' } },
          layout: { containerMaxWidth: '1200px', spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem' }, borderRadius: { sm: '0.25rem', base: '0.5rem', lg: '0.75rem', xl: '1rem' } }
        },
        github: {
          colors: { primary: '#24292f', secondary: '#656d76', accent: '#0969da', background: '#ffffff', surface: '#f6f8fa', text: { primary: '#24292f', secondary: '#656d76', light: '#8b949e' } },
          typography: { fontFamily: 'Inter', fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' } },
          layout: { containerMaxWidth: '1200px', spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem' }, borderRadius: { sm: '0.375rem', base: '0.5rem', lg: '0.75rem', xl: '1rem' } }
        },
        spotify: {
          colors: { primary: '#1db954', secondary: '#1ed760', accent: '#1db954', background: '#191414', surface: '#282828', text: { primary: '#ffffff', secondary: '#b3b3b3', light: '#717171' } },
          typography: { fontFamily: 'Inter', fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' } },
          layout: { containerMaxWidth: '1200px', spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem' }, borderRadius: { sm: '0.25rem', base: '0.5rem', lg: '0.75rem', xl: '1rem' } }
        },
        netflix: {
          colors: { primary: '#e50914', secondary: '#221f1f', accent: '#f5f5f1', background: '#141414', surface: '#222222', text: { primary: '#ffffff', secondary: '#999999', light: '#666666' } },
          typography: { fontFamily: 'Inter', fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' } },
          layout: { containerMaxWidth: '1200px', spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem' }, borderRadius: { sm: '0.125rem', base: '0.25rem', lg: '0.375rem', xl: '0.5rem' } }
        },
        slack: {
          colors: { primary: '#4A154B', secondary: '#611F69', accent: '#007A5A', background: '#ffffff', surface: '#f8f9fa', text: { primary: '#1d1c1d', secondary: '#606060', light: '#868686' } },
          typography: { fontFamily: 'Lato', fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' } },
          layout: { containerMaxWidth: '1200px', spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem' }, borderRadius: { sm: '0.375rem', base: '0.5rem', lg: '0.75rem', xl: '1rem' } }
        },
        cursor: {
          colors: { primary: '#000000', secondary: '#17191d', accent: '#6366f1', background: '#ffffff', surface: '#f8fafc', text: { primary: '#111827', secondary: '#6b7280', light: '#9ca3af' } },
          typography: { fontFamily: 'Inter', fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' } },
          layout: { containerMaxWidth: '1200px', spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem' }, borderRadius: { sm: '0.375rem', base: '0.5rem', lg: '0.75rem', xl: '1rem' } }
        }
      };
      return themes[themeId];
    };
    
    const currentTheme = getTheme(activeThemeId);
    const root = document.documentElement;
    
    // Apply theme-based settings if a theme is active
    if (currentTheme) {
      root.style.setProperty('--color-primary', currentTheme.colors.primary);
      root.style.setProperty('--color-secondary', currentTheme.colors.secondary);
      root.style.setProperty('--color-accent', currentTheme.colors.accent);
      root.style.setProperty('--color-background', currentTheme.colors.background);
      root.style.setProperty('--color-surface', currentTheme.colors.surface);
      root.style.setProperty('--color-text-primary', currentTheme.colors.text.primary);
      root.style.setProperty('--color-text-secondary', currentTheme.colors.text.secondary);
      root.style.setProperty('--color-text-light', currentTheme.colors.text.light);
      root.style.setProperty('--font-family', currentTheme.typography.fontFamily);
      
      // Apply spacing
      Object.entries(currentTheme.layout.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
      
      // Apply border radius
      Object.entries(currentTheme.layout.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--border-radius-${key}`, value);
      });
      
      // Apply container max width
      root.style.setProperty('--container-max-width', currentTheme.layout.containerMaxWidth);
      
      // Apply font sizes
      Object.entries(currentTheme.typography.fontSizes).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });
      
      // Apply to body for immediate effect
      document.body.style.backgroundColor = currentTheme.colors.background;
      document.body.style.color = currentTheme.colors.text.primary;
      document.body.style.fontFamily = currentTheme.typography.fontFamily;
      
    } else {
      // Fallback to design settings
      root.style.setProperty('--color-primary', settings.colors.primary);
      root.style.setProperty('--color-secondary', settings.colors.secondary);
      root.style.setProperty('--font-family', settings.typography.fontFamily);
    }
  }, [settings]);

  console.log('🚦 APP.JS - Rendering routes...');
  
  return (
    <LanguageProvider>
      <DynamicLanguageRouter>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </DynamicLanguageRouter>
    </LanguageProvider>
  );
}

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import DynamicLanguageRouter from './components/DynamicLanguageRouter';
import { useDesignSettings } from './hooks/useDesignSettings';
import { LanguageProvider } from './contexts/LanguageContextDB';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ForcePasswordChange from './components/admin/ForcePasswordChange';
import './utils/dataRecovery'; // Outils de récupération des données
import './styles/inline-editor.css'; // Styles pour l'éditeur inline


// Composant interne pour gérer le blocage de sécurité
const AppContent = () => {
  const { needsPasswordChange, isAuthenticated } = useAuth();
  
  // Si l'utilisateur admin a le mot de passe par défaut, bloquer complètement l'application
  if (isAuthenticated && needsPasswordChange) {

    return <ForcePasswordChange />;
  }
  
  return (
    <DynamicLanguageRouter>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </DynamicLanguageRouter>
  );
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

function App() {

  const { settings } = useDesignSettings();

  useEffect(() => {
    // Récupérer le thème actuel depuis localStorage (pour éviter les dépendances circulaires)
    const activeThemeId = localStorage.getItem('activeTheme') || 'default';
    
    // Import local des thèmes pour éviter les dépendances circulaires
    const getTheme = (themeId) => {
      const themes = {
        default: {
          colors: { primary: '#3f6ff7', secondary: '#333333', accent: '#3f6ff7', background: '#FFFFFF', surface: '#FFFFFF', text: { primary: '#1a1a1a', secondary: '#666666', light: '#999999' } },
          typography: { fontFamily: 'Plus Jakarta Sans', fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' } },
          layout: { containerMaxWidth: '1280px', spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem' }, borderRadius: { sm: '0.5rem', base: '0.75rem', lg: '1rem', xl: '1.25rem' } }
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
    
    let currentTheme = getTheme(activeThemeId);

    // Si le thème n'est pas trouvé dans les prédéfinis, chercher dans les thèmes personnalisés
    if (!currentTheme && activeThemeId.startsWith('Theme-')) {
      const savedTheme = localStorage.getItem(`theme_${activeThemeId}`);
      if (savedTheme) {
        try {
          currentTheme = JSON.parse(savedTheme);

        } catch (e) {

        }
      }
    }

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

      // Variables pour l'éditeur inline
      const primaryRgb = hexToRgb(currentTheme.colors.primary);
      if (primaryRgb) {
        root.style.setProperty('--color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      }

      // Gérer fontFamily pour les thèmes custom (objet) et prédéfinis (string)
      const fontFamily = currentTheme.typography.fontFamily?.primary || currentTheme.typography.fontFamily;
      root.style.setProperty('--font-family', fontFamily);

      // Apply spacing (peut être dans layout.spacing ou spacing directement)
      const spacing = currentTheme.layout?.spacing || currentTheme.spacing;
      if (spacing) {
        Object.entries(spacing).forEach(([key, value]) => {
          root.style.setProperty(`--spacing-${key}`, value);
        });
      }

      // Apply border radius (peut être dans layout.borderRadius ou borderRadius directement)
      const borderRadius = currentTheme.layout?.borderRadius || currentTheme.borderRadius;
      if (borderRadius) {
        Object.entries(borderRadius).forEach(([key, value]) => {
          root.style.setProperty(`--border-radius-${key}`, value);
        });
      }

      // Apply container max width
      const containerMaxWidth = currentTheme.layout?.containerMaxWidth || '1200px';
      root.style.setProperty('--container-max-width', containerMaxWidth);

      // Apply font sizes
      const fontSizes = currentTheme.typography.fontSizes || currentTheme.typography.fontSize;
      if (fontSizes) {
        Object.entries(fontSizes).forEach(([key, value]) => {
          root.style.setProperty(`--font-size-${key}`, value);
        });
      }

      // Apply to body for immediate effect
      document.body.style.backgroundColor = currentTheme.colors.background;
      document.body.style.color = currentTheme.colors.text.primary;
      document.body.style.fontFamily = fontFamily;
      
    } else {
      // Fallback to design settings
      root.style.setProperty('--color-primary', settings.colors.primary);
      root.style.setProperty('--color-secondary', settings.colors.secondary);
      root.style.setProperty('--font-family', settings.typography.fontFamily);
    }
  }, [settings]);

  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

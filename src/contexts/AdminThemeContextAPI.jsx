import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AdminThemeContextAPI = createContext();

export const AdminThemeProviderAPI = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialiser le thème depuis l'API
  useEffect(() => {
    initializeTheme();
  }, []);

  const initializeTheme = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier si l'API est accessible
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        // Charger depuis l'API
        const preferences = await apiService.getUserPreferences();
        const adminTheme = preferences.admin_theme || 'light';
        setIsDark(adminTheme === 'dark');
        console.log('🎨 Thème admin chargé depuis API:', adminTheme);
      } else {
        // Mode dégradé : utiliser localStorage
        console.warn('⚠️ API non accessible, utilisation localStorage pour thème admin');
        const saved = localStorage.getItem('admin-theme');
        if (saved) {
          setIsDark(saved === 'dark');
        } else {
          // Détecter la préférence système
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDark(prefersDark);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement thème admin:', error);
      setError(error.message);
      
      // Fallback vers localStorage
      const saved = localStorage.getItem('admin-theme');
      if (saved) {
        setIsDark(saved === 'dark');
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Appliquer le thème au document
  useEffect(() => {
    if (!isLoading) {
      // Sauvegarder dans l'API et localStorage
      saveTheme(isDark ? 'dark' : 'light');
      
      // Appliquer la classe au document
      if (isDark) {
        document.documentElement.classList.add('admin-dark');
      } else {
        document.documentElement.classList.remove('admin-dark');
      }
    }
  }, [isDark, isLoading]);

  const saveTheme = async (theme) => {
    try {
      // Toujours sauvegarder en localStorage pour la résilience
      localStorage.setItem('admin-theme', theme);
      
      // Essayer de sauvegarder via API
      const isApiAvailable = await apiService.isApiReachable();
      
      if (isApiAvailable) {
        await apiService.setUserPreference('admin_theme', theme);
        console.log('🎨 Thème admin sauvegardé via API:', theme);
      } else {
        console.warn('⚠️ API non accessible, thème sauvé uniquement en localStorage');
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde thème admin:', error);
      // En cas d'erreur API, au moins localStorage est mis à jour
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
  };

  const setDark = async () => {
    setIsDark(true);
  };

  const setLight = async () => {
    setIsDark(false);
  };

  const value = {
    isDark,
    isLight: !isDark,
    theme: isDark ? 'dark' : 'light',
    toggleTheme,
    setDark,
    setLight,
    isLoading,
    error,
    refresh: initializeTheme
  };

  return (
    <AdminThemeContextAPI.Provider value={value}>
      {children}
    </AdminThemeContextAPI.Provider>
  );
};

export const useAdminThemeAPI = () => {
  const context = useContext(AdminThemeContextAPI);
  if (context === undefined) {
    throw new Error('useAdminThemeAPI must be used within an AdminThemeProviderAPI');
  }
  return context;
};

// Hook de migration pour passer de l'ancien système au nouveau
export const useMigrateAdminTheme = () => {
  const migrateToAPI = async () => {
    try {
      console.log('🔄 Migration thème admin localStorage -> API...');
      
      const localTheme = localStorage.getItem('admin-theme');
      if (localTheme) {
        const isApiAvailable = await apiService.isApiReachable();
        
        if (isApiAvailable) {
          await apiService.setUserPreference('admin_theme', localTheme);
          console.log('✅ Thème admin migré vers API:', localTheme);
          return true;
        }
      }
      
      console.log('ℹ️ Aucune migration thème admin nécessaire');
      return false;
    } catch (error) {
      console.error('❌ Erreur migration thème admin:', error);
      return false;
    }
  };

  return { migrateToAPI };
};

export default AdminThemeContextAPI;
import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Récupérer le thème sauvegardé ou utiliser la préférence système
    const saved = localStorage.getItem('admin-theme');
    if (saved) {
      return saved === 'dark';
    }
    // Détecter la préférence système
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Sauvegarder le thème
    localStorage.setItem('admin-theme', isDark ? 'dark' : 'light');
    
    // Appliquer la classe au document pour l'admin
    if (isDark) {
      document.documentElement.classList.add('admin-dark');
    } else {
      document.documentElement.classList.remove('admin-dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const value = {
    isDark,
    isLight: !isDark,
    theme: isDark ? 'dark' : 'light',
    toggleTheme,
    setDark: () => setIsDark(true),
    setLight: () => setIsDark(false)
  };

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};

export default AdminThemeContext;
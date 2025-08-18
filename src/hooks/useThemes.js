import { useState, useEffect } from 'react';
import { predefinedThemes, getThemeById, getThemesByCategory } from '../data/themes';

export const useThemes = () => {
  const [activeTheme, setActiveTheme] = useState(() => {
    const savedTheme = localStorage.getItem('activeTheme');
    return savedTheme || 'github'; // Thème par défaut
  });
  
  const [customThemes, setCustomThemes] = useState(() => {
    const saved = localStorage.getItem('customThemes');
    return saved ? JSON.parse(saved) : {};
  });

  // Sauvegarder le thème actif dans localStorage
  useEffect(() => {
    localStorage.setItem('activeTheme', activeTheme);
  }, [activeTheme]);

  // Sauvegarder les thèmes personnalisés
  useEffect(() => {
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
  }, [customThemes]);

  // Obtenir le thème actuel (prédéfini ou personnalisé)
  const getCurrentTheme = () => {
    return customThemes[activeTheme] || predefinedThemes[activeTheme] || predefinedThemes.github;
  };

  // Changer de thème
  const setTheme = (themeId) => {
    setActiveTheme(themeId);
  };

  // Créer un thème personnalisé basé sur un thème existant
  const createCustomTheme = (baseThemeId, customName, customSettings) => {
    const baseTheme = getThemeById(baseThemeId) || predefinedThemes.github;
    const customThemeId = `custom_${Date.now()}`;
    
    const newCustomTheme = {
      ...baseTheme,
      id: customThemeId,
      name: customName,
      description: `Thème personnalisé basé sur ${baseTheme.name}`,
      category: 'Custom',
      isCustom: true,
      ...customSettings
    };

    setCustomThemes(prev => ({
      ...prev,
      [customThemeId]: newCustomTheme
    }));

    return customThemeId;
  };

  // Supprimer un thème personnalisé
  const deleteCustomTheme = (themeId) => {
    if (customThemes[themeId]) {
      const newCustomThemes = { ...customThemes };
      delete newCustomThemes[themeId];
      setCustomThemes(newCustomThemes);
      
      // Si c'était le thème actif, retourner au thème par défaut
      if (activeTheme === themeId) {
        setActiveTheme('github');
      }
    }
  };

  // Mettre à jour un thème personnalisé
  const updateCustomTheme = (themeId, updates) => {
    if (customThemes[themeId]) {
      setCustomThemes(prev => ({
        ...prev,
        [themeId]: {
          ...prev[themeId],
          ...updates
        }
      }));
    }
  };

  // Obtenir tous les thèmes (prédéfinis + personnalisés)
  const getAllThemes = () => {
    return {
      ...predefinedThemes,
      ...customThemes
    };
  };

  // Obtenir les thèmes par catégorie (incluant les personnalisés)
  const getThemesByCategories = () => {
    const allThemes = getAllThemes();
    const categories = {};
    
    Object.values(allThemes).forEach(theme => {
      const category = theme.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(theme);
    });
    
    return categories;
  };

  // Importer un thème depuis un fichier JSON
  const importTheme = (themeData) => {
    return new Promise((resolve, reject) => {
      try {
        const themeId = `imported_${Date.now()}`;
        const importedTheme = {
          ...themeData,
          id: themeId,
          isCustom: true,
          category: themeData.category || 'Imported'
        };

        setCustomThemes(prev => ({
          ...prev,
          [themeId]: importedTheme
        }));

        resolve(themeId);
      } catch (error) {
        reject(new Error('Format de thème invalide'));
      }
    });
  };

  // Exporter un thème
  const exportTheme = (themeId) => {
    const theme = getAllThemes()[themeId];
    if (!theme) {
      throw new Error('Thème non trouvé');
    }

    const exportData = {
      ...theme,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Dupliquer un thème
  const duplicateTheme = (themeId, newName) => {
    const sourceTheme = getAllThemes()[themeId];
    if (!sourceTheme) {
      throw new Error('Thème source non trouvé');
    }

    const duplicatedThemeId = `duplicate_${Date.now()}`;
    const duplicatedTheme = {
      ...sourceTheme,
      id: duplicatedThemeId,
      name: newName || `${sourceTheme.name} (Copie)`,
      description: `Copie de ${sourceTheme.name}`,
      isCustom: true,
      category: 'Custom'
    };

    setCustomThemes(prev => ({
      ...prev,
      [duplicatedThemeId]: duplicatedTheme
    }));

    return duplicatedThemeId;
  };

  // Réinitialiser aux thèmes par défaut
  const resetToDefaultThemes = () => {
    setCustomThemes({});
    setActiveTheme('github');
    localStorage.removeItem('customThemes');
    localStorage.removeItem('activeTheme');
  };

  return {
    // État actuel
    activeTheme,
    getCurrentTheme,
    
    // Gestion des thèmes
    setTheme,
    getAllThemes,
    getThemesByCategories,
    predefinedThemes,
    customThemes,
    
    // Thèmes personnalisés
    createCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    duplicateTheme,
    
    // Import/Export
    importTheme,
    exportTheme,
    
    // Utilitaires
    resetToDefaultThemes,
    
    // Helpers
    getThemeById: (id) => getAllThemes()[id],
    isCustomTheme: (id) => customThemes.hasOwnProperty(id),
    getThemePreview: (id) => {
      const theme = getAllThemes()[id];
      return theme ? {
        id: theme.id,
        name: theme.name,
        colors: theme.colors,
        category: theme.category
      } : null;
    }
  };
};
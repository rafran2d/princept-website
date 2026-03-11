import React, { useState } from 'react';
import {
  Palette,
  Download,
  Upload,
  Copy,
  Trash2,
  Check,
  Eye,
  Settings,
  Star,
  Zap,
  Crown,
  Filter,
  Search,
  Sparkles,
  Wand2
} from 'lucide-react';
import { predefinedThemes } from '../../data/themes';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';
import AIThemeGenerator from './AIThemeGenerator';


const ThemePreviewCard = ({ theme, isActive, onSelect }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'Tech': Zap,
      'Business': Crown,
      'Design': Palette,
      'Entertainment': Star,
      'Standard': Settings
    };
    return icons[category] || Settings;
  };

  const CategoryIcon = getCategoryIcon(theme.category);

  return (
    <div 
      className={`group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 overflow-hidden admin-card ${
        isActive 
          ? 'admin-section-card border-2 border-blue-300 shadow-xl' 
          : 'border-2 hover:border-blue-200 hover:shadow-2xl'
      }`}
      onClick={onSelect}
    >
      {/* Badge actif avec animation */}
      {isActive && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-2 shadow-lg animate-bounce">
          <Check size={14} />
        </div>
      )}

      {/* Icône de catégorie en fond */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <CategoryIcon size={32} />
      </div>

      {/* Header avec icône et badge premium */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-xl shadow-sm ${
            isActive ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'
          } transition-colors`}>
            <CategoryIcon size={16} className={`${
              isActive ? 'text-blue-600' : 'admin-text-secondary group-hover:text-blue-600'
            } transition-colors`} />
          </div>
          {theme.id === 'default' && (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              <Crown size={10} />
              <span>POPULAIRE</span>
            </div>
          )}
        </div>
      </div>

      {/* Aperçu des couleurs modernisé */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div 
            className="w-12 h-12 rounded-2xl shadow-lg border-4 border-white ring-2 ring-gray-200 group-hover:ring-blue-200 transition-all transform group-hover:scale-110"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div className="flex flex-col space-y-1">
            <div 
              className="w-8 h-3 rounded-full shadow-sm border-2 border-white"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div 
              className="w-6 h-3 rounded-full shadow-sm border-2 border-white"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
        </div>
        
        {/* Mini mockup du site */}
        <div 
          className="h-16 rounded-xl p-3 relative overflow-hidden shadow-inner border-2 border-white/50"
          style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.text.primary
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative">
            <div 
              className="text-xs font-bold mb-1"
              style={{ color: theme.colors.primary }}
            >
              {theme.name}
            </div>
            <div className="text-xs opacity-70">Aa Bb Cc</div>
          </div>
        </div>
      </div>

      {/* Informations du thème */}
      <div className="relative">
        <h3 className={`font-bold text-lg mb-2 transition-colors ${
          isActive ? 'text-blue-900' : 'admin-text-primary group-hover:text-blue-900'
        }`}>
          {theme.name}
        </h3>
        <p className="text-sm admin-text-secondary mb-3 line-clamp-2 leading-relaxed">
          {theme.description}
        </p>
        
        {/* Badge catégorie stylisé */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
            isActive 
              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' 
              : 'bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700'
          }`}>
            {theme.category}
          </span>
          
          {/* Indicateur de statut */}
          <div className={`flex items-center space-x-1 text-xs font-medium ${
            isActive ? 'text-blue-600' : 'admin-text-muted group-hover:text-blue-600'
          } transition-colors`}>
            {isActive ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>ACTIF</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>DISPONIBLE</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
};

const ThemeSelector = () => {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('activeTheme') || 'default';
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [customThemes, setCustomThemes] = useState(() => {
    try {
      const saved = localStorage.getItem('customThemes');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });
  const { message, showSuccess, hideMessage } = useFlashMessage();
  const categories = ['all', 'Standard', 'Tech', 'Lifestyle', 'Entertainment', 'Business', 'Productivity', 'Fintech', 'Design', 'Gaming', 'Professional', 'E-commerce', 'Publishing', 'Social', 'Communication', 'Transport', 'Custom'];

  const handleThemeGenerated = (theme) => {
    // Ajouter le thème personnalisé à la liste
    const updatedCustomThemes = [...customThemes, theme];
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));

    // Appliquer immédiatement le thème généré
    const themeId = theme.name;
    setActiveTheme(themeId);
    localStorage.setItem('activeTheme', themeId);

    // Sauvegarder le thème complet pour réutilisation
    localStorage.setItem(`theme_${themeId}`, JSON.stringify(theme));

    // Appliquer les styles de manière complète
    applyThemeStyles(theme);

    setShowAIGenerator(false);
    showSuccess('Thème créé et appliqué avec succès ! Rechargez la page pour voir tous les changements.');
  };

  const applyThemeStyles = (theme) => {
    const root = document.documentElement;

    // Couleurs
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-success', theme.colors.success || '#10b981');
    root.style.setProperty('--color-warning', theme.colors.warning || '#f59e0b');
    root.style.setProperty('--color-error', theme.colors.error || '#ef4444');
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text-primary', theme.colors.text.primary);
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--color-text-light', theme.colors.text.light || theme.colors.text.secondary);

    // Typographie
    const fontFamily = theme.typography.fontFamily?.primary || theme.typography.fontFamily;
    root.style.setProperty('--font-family', fontFamily);

    if (theme.typography.fontSizes) {
      Object.entries(theme.typography.fontSizes).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });
    }

    // Layout
    if (theme.layout) {
      root.style.setProperty('--container-max-width', theme.layout.containerMaxWidth || '1200px');
      if (theme.layout.fullWidth) {
        root.style.setProperty('--layout-mode', 'fullwidth');
      }
    }

    // Spacing
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
    }

    // Border radius
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--border-radius-${key}`, value);
      });
    }

    // Sauvegarder les configs header/footer
    if (theme.header) {
      localStorage.setItem('themeHeaderConfig', JSON.stringify(theme.header));
    }
    if (theme.footer) {
      localStorage.setItem('themeFooterConfig', JSON.stringify(theme.footer));
    }

    // Appliquer au body
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text.primary;
    document.body.style.fontFamily = fontFamily;

    // Déclencher un événement personnalisé pour notifier les composants
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Standard': '⚙️',
      'Tech': '💻',
      'Lifestyle': '🌟',
      'Entertainment': '🎬',
      'Business': '💼',
      'Productivity': '📈',
      'Fintech': '💰',
      'Design': '🎨',
      'Gaming': '🎮',
      'Professional': '👔',
      'E-commerce': '🛒',
      'Publishing': '📚',
      'Social': '👥',
      'Communication': '💬',
      'Transport': '🚗',
      'Custom': '✨'
    };
    return emojis[category] || '🎨';
  };

  const handleThemeSelect = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('activeTheme', themeId);

    // Appliquer le thème complet immédiatement
    let theme = predefinedThemes[themeId] || customThemes.find(t => t.name === themeId);

    // Si le thème n'est pas trouvé dans customThemes, essayer de le charger depuis localStorage
    if (!theme && themeId.startsWith('Theme-')) {
      const savedTheme = localStorage.getItem(`theme_${themeId}`);
      if (savedTheme) {
        theme = JSON.parse(savedTheme);
      }
    }

    if (theme) {
      applyThemeStyles(theme);
      showSuccess(`Thème "${theme.name || theme.label}" appliqué avec succès !`);
    }
  };

  // Filtrer les thèmes (inclut les thèmes prédéfinis ET personnalisés)
  const filteredThemes = () => {
    // Ne garder que le thème "default" - exclure tous les autres thèmes prédéfinis et personnalisés
    let themes = [];
    
    // Ajouter uniquement le thème default
    if (predefinedThemes.default) {
      themes.push(predefinedThemes.default);
    }
    
    // Ne pas ajouter les thèmes personnalisés (générés par IA)
    // themes = [
    //   ...themes,
    //   ...customThemes.map(ct => ({
    //     ...ct,
    //     id: ct.name,
    //     category: 'Custom',
    //     description: ct.label
    //   }))
    // ];

    if (selectedCategory !== 'all') {
      themes = themes.filter(theme => theme.category === selectedCategory);
    }

    return themes;
  };

  return (
    <div className="w-full">
      {/* Header redesigné */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
              <Palette size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold admin-text-primary">
                Galerie de Thèmes
              </h1>
              <p className="admin-text-secondary mt-1 text-lg">
                Transformez votre site avec des designs époustouflants
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Bouton Générateur IA */}
            <button
              onClick={() => setShowAIGenerator(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Wand2 size={20} />
              <span>Créer avec l'IA</span>
            </button>

            {/* Thème actuel */}
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">
                {predefinedThemes[activeTheme]?.name || customThemes.find(t => t.name === activeTheme)?.label || 'Aucun'}
              </div>
              <div className="text-sm admin-text-muted font-medium">Thème actuel</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="admin-card rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-blue-700 font-medium">Thème disponible</div>
              </div>
            </div>
          </div>
          
          <div className="admin-card rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Filter className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
                <div className="text-sm text-purple-700 font-medium">Catégories</div>
              </div>
            </div>
          </div>
          
          <div className="admin-card rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{filteredThemes().length}</div>
                <div className="text-sm text-green-700 font-medium">Affichés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres modernisés - Masqué car un seul thème */}
      {/* Les filtres sont désactivés car seul le thème default est disponible */}

      {/* Grille des thèmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredThemes().map((theme) => (
          <ThemePreviewCard
            key={theme.id}
            theme={theme}
            isActive={activeTheme === theme.id}
            onSelect={() => handleThemeSelect(theme.id)}
          />
        ))}
      </div>

      {/* Message si aucun thème trouvé */}
      {filteredThemes().length === 0 && (
        <div className="text-center py-12">
          <Palette className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun thème trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de sélectionner une autre catégorie.
          </p>
        </div>
      )}


      {/* Flash Message */}
      <FlashMessage message={message} onClose={hideMessage} />

      {/* AI Theme Generator Modal */}
      {showAIGenerator && (
        <AIThemeGenerator
          onThemeGenerated={handleThemeGenerated}
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector;
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
  Sparkles
} from 'lucide-react';
import { predefinedThemes } from '../../data/themes';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';


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
  const { message, showSuccess, hideMessage } = useFlashMessage();
  const categories = ['all', 'Standard', 'Tech', 'Lifestyle', 'Entertainment', 'Business', 'Productivity', 'Fintech', 'Design', 'Gaming', 'Professional', 'E-commerce', 'Publishing', 'Social', 'Communication', 'Transport'];

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
      'Transport': '🚗'
    };
    return emojis[category] || '🎨';
  };

  const handleThemeSelect = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('activeTheme', themeId);
    
    // Appliquer le thème complet immédiatement
    const theme = predefinedThemes[themeId];
    if (theme) {
      const root = document.documentElement;
      
      // Couleurs
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-accent', theme.colors.accent);
      root.style.setProperty('--color-success', theme.colors.success);
      root.style.setProperty('--color-warning', theme.colors.warning);
      root.style.setProperty('--color-error', theme.colors.error);
      root.style.setProperty('--color-background', theme.colors.background);
      root.style.setProperty('--color-surface', theme.colors.surface);
      root.style.setProperty('--color-text-primary', theme.colors.text.primary);
      root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
      root.style.setProperty('--color-text-light', theme.colors.text.light);
      
      // Typographie
      root.style.setProperty('--font-family', theme.typography.fontFamily);
      Object.entries(theme.typography.fontSizes).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });
      
      // Layout
      root.style.setProperty('--container-max-width', theme.layout.containerMaxWidth);
      Object.entries(theme.layout.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
      Object.entries(theme.layout.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--border-radius-${key}`, value);
      });
      
      // Forcer l'application sur le body pour les thèmes sombres
      document.body.style.backgroundColor = theme.colors.background;
      document.body.style.color = theme.colors.text.primary;
      document.body.style.fontFamily = theme.typography.fontFamily;
      
      showSuccess(`Thème "${theme.name}" appliqué avec succès !`);
    }
  };

  // Filtrer les thèmes
  const filteredThemes = () => {
    let themes = Object.values(predefinedThemes);
    
    if (selectedCategory !== 'all') {
      themes = themes.filter(theme => theme.category === selectedCategory);
    }
    
    return themes;
  };

  return (
    <div className="max-w-7xl mx-auto">
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
            {/* Thème actuel */}
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">
                {predefinedThemes[activeTheme]?.name || 'Aucun'}
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
                <div className="text-2xl font-bold text-blue-600">{Object.keys(predefinedThemes).length}</div>
                <div className="text-sm text-blue-700 font-medium">Thèmes disponibles</div>
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

      {/* Filtres modernisés */}
      <div className="admin-card rounded-2xl shadow-lg p-6 mb-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold admin-text-primary flex items-center">
            <Filter className="w-5 h-5 mr-2 text-purple-600" />
            Filtres et recherche
          </h3>
          <div className="text-sm admin-text-muted">
            {filteredThemes().length} thème{filteredThemes().length > 1 ? 's' : ''} trouvé{filteredThemes().length > 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filtre par catégorie stylisé */}
          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all appearance-none font-medium"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? '🎨 Toutes les catégories' : `${getCategoryEmoji(category)} ${category}`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Tags de catégories populaires */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Accès rapide</label>
            <div className="flex flex-wrap gap-2">
              {['Tech', 'Business', 'Design', 'Entertainment'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  {getCategoryEmoji(category)} {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ThemeSelector;
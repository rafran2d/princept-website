import React, { useState, useCallback, useRef } from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Download, 
  Upload, 
  RotateCcw,
  Sliders,
  Eye,
  Sparkles,
  Settings,
  Wand,
  RefreshCw
} from 'lucide-react';
import { useDesignSettings } from '../../hooks/useDesignSettings';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';

const DesignSettings = () => {
  const { 
    settings, 
    updateSetting, 
    resetSettings, 
    exportSettings, 
    importSettings 
  } = useDesignSettings();
  
  const [activeTab, setActiveTab] = useState('colors');
  const [showPreview, setShowPreview] = useState(false);
  const { message, showSuccess, showError, hideMessage } = useFlashMessage();
  const timeoutRef = useRef(null);

  const tabs = [
    { id: 'colors', label: 'Couleurs', icon: Palette },
    { id: 'typography', label: 'Typographie', icon: Type },
    { id: 'layout', label: 'Mise en page', icon: Layout },
    { id: 'animation', label: 'Animation', icon: Sliders }
  ];

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importSettings(file)
        .then(() => {
          showSuccess('Paramètres importés avec succès !');
        })
        .catch((error) => {
          showError(`Erreur lors de l'import : ${error.message}`);
        });
    }
  };

  const handleExport = () => {
    exportSettings();
    showSuccess('Paramètres exportés avec succès !');
  };

  const handleReset = () => {
    resetSettings();
    showSuccess('Paramètres réinitialisés aux valeurs par défaut !');
  };

  // Removed automatic success message to prevent input focus loss
  const handleSettingChange = useCallback((key, value) => {
    updateSetting(key, value);
  }, [updateSetting]);

  const ColorSection = () => (
    <div className="space-y-8">
      {/* Header de section */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 admin-card rounded-2xl px-6 py-3 shadow-sm" style={{ borderColor: 'var(--admin-border)' }}>
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-purple-900">Palette de Couleurs</h3>
        </div>
        <p className="admin-text-secondary mt-3">Définissez les couleurs principales de votre identité visuelle</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: 'var(--admin-border)' }}>
          <label className="block text-sm font-bold text-purple-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            Couleur principale
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="color"
                value={settings.colors.primary}
                onChange={(e) => updateSetting('colors.primary', e.target.value)}
                className="w-16 h-16 border-4 border-white shadow-lg rounded-2xl cursor-pointer ring-2 ring-purple-200"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Palette size={12} className="text-white" />
              </div>
            </div>
            <input
              type="text"
              value={settings.colors.primary}
              onChange={(e) => updateSetting('colors.primary', e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="#3B82F6"
            />
          </div>
        </div>
        
        <div className="admin-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: 'var(--admin-border)' }}>
          <label className="block text-sm font-bold text-purple-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
            Couleur secondaire
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="color"
                value={settings.colors.secondary}
                onChange={(e) => updateSetting('colors.secondary', e.target.value)}
                className="w-16 h-16 border-4 border-white shadow-lg rounded-2xl cursor-pointer ring-2 ring-indigo-200"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
            </div>
            <input
              type="text"
              value={settings.colors.secondary}
              onChange={(e) => updateSetting('colors.secondary', e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              placeholder="#8B5CF6"
            />
          </div>
        </div>

        <div className="admin-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: 'var(--admin-border)' }}>
          <label className="block text-sm font-bold text-purple-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
            Couleur d'accent
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="color"
                value={settings.colors.accent}
                onChange={(e) => updateSetting('colors.accent', e.target.value)}
                className="w-16 h-16 border-4 border-white shadow-lg rounded-2xl cursor-pointer ring-2 ring-pink-200"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <Wand size={12} className="text-white" />
              </div>
            </div>
            <input
              type="text"
              value={settings.colors.accent}
              onChange={(e) => updateSetting('colors.accent', e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
              placeholder="#EC4899"
            />
          </div>
        </div>

        <div className="admin-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: 'var(--admin-border)' }}>
          <label className="block text-sm font-bold text-purple-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            Arrière-plan
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="color"
                value={settings.colors.background}
                onChange={(e) => updateSetting('colors.background', e.target.value)}
                className="w-16 h-16 border-4 border-white shadow-lg rounded-2xl cursor-pointer ring-2 ring-gray-200"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                <Layout size={12} className="text-white" />
              </div>
            </div>
            <input
              type="text"
              value={settings.colors.background}
              onChange={(e) => updateSetting('colors.background', e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono text-sm"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      {/* Section couleurs de texte modernisée */}
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6" style={{ borderColor: 'var(--admin-border)' }}>
        <h4 className="text-lg font-bold text-purple-900 mb-6 flex items-center">
          <Type className="w-5 h-5 mr-2" />
          Couleurs de texte
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="admin-card rounded-xl p-4 shadow-sm" style={{ borderColor: 'var(--admin-border)' }}>
            <label className="block text-sm font-bold admin-text-primary mb-3">Texte principal</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.colors.text.primary}
                onChange={(e) => updateSetting('colors.text.primary', e.target.value)}
                className="w-12 h-12 border-2 border-white shadow-md rounded-xl cursor-pointer ring-2 ring-gray-200"
              />
              <input
                type="text"
                value={settings.colors.text.primary}
                onChange={(e) => updateSetting('colors.text.primary', e.target.value)}
                className="flex-1 px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                style={{ borderColor: 'var(--admin-border)' }}
              />
            </div>
          </div>
          
          <div className="admin-card rounded-xl p-4 shadow-sm" style={{ borderColor: 'var(--admin-border)' }}>
            <label className="block text-sm font-bold admin-text-primary mb-3">Texte secondaire</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.colors.text.secondary}
                onChange={(e) => updateSetting('colors.text.secondary', e.target.value)}
                className="w-12 h-12 border-2 border-white shadow-md rounded-xl cursor-pointer ring-2 ring-gray-200"
              />
              <input
                type="text"
                value={settings.colors.text.secondary}
                onChange={(e) => updateSetting('colors.text.secondary', e.target.value)}
                className="flex-1 px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                style={{ borderColor: 'var(--admin-border)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TypographySection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium admin-text-secondary mb-2">
          Police principale
        </label>
        <select 
          value={settings.typography.fontFamily}
          onChange={(e) => updateSetting('typography.fontFamily', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderColor: 'var(--admin-border)' }}
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Poppins">Poppins</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Nunito">Nunito</option>
        </select>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Tailles de police</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(settings.typography.fontSizes).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium admin-text-secondary mb-2 capitalize">
                {key === 'xs' ? 'Très petit' : 
                 key === 'sm' ? 'Petit' :
                 key === 'base' ? 'Normal' :
                 key === 'lg' ? 'Grand' :
                 key === 'xl' ? 'Très grand' :
                 key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => updateSetting(`typography.fontSizes.${key}`, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderColor: 'var(--admin-border)' }}
                placeholder="Ex: 1rem, 16px"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4 mt-6">Exemple de rendu</h4>
        <div className="admin-bg-tertiary p-6 rounded-lg space-y-3" style={{ fontFamily: settings.typography.fontFamily }}>
          <h1 style={{ fontSize: settings.typography.fontSizes['4xl'] }}>Titre principal</h1>
          <h2 style={{ fontSize: settings.typography.fontSizes['2xl'] }}>Sous-titre</h2>
          <p style={{ fontSize: settings.typography.fontSizes.base }}>
            Ceci est un exemple de paragraphe avec la police sélectionnée. 
            Vous pouvez voir comment le texte s'affiche avec vos paramètres actuels.
          </p>
        </div>
      </div>
    </div>
  );

  const LayoutSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium admin-text-secondary mb-2">
          Largeur maximale du conteneur
        </label>
        <input
          type="text"
          value={settings.layout.containerMaxWidth}
          onChange={(e) => updateSetting('layout.containerMaxWidth', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderColor: 'var(--admin-border)' }}
          placeholder="Ex: 1200px, 100%, 80rem"
        />
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Espacement</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(settings.layout.spacing).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium admin-text-secondary mb-2 capitalize">
                {key === 'xs' ? 'Très petit' : 
                 key === 'sm' ? 'Petit' :
                 key === 'md' ? 'Moyen' :
                 key === 'lg' ? 'Grand' :
                 key === 'xl' ? 'Très grand' :
                 key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => updateSetting(`layout.spacing.${key}`, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderColor: 'var(--admin-border)' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Bordures arrondies</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(settings.layout.borderRadius).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium admin-text-secondary mb-2 capitalize">
                {key === 'sm' ? 'Petit' :
                 key === 'base' ? 'Normal' :
                 key === 'lg' ? 'Grand' :
                 key === 'xl' ? 'Très grand' :
                 key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => updateSetting(`layout.borderRadius.${key}`, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderColor: 'var(--admin-border)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AnimationSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium admin-text-secondary mb-2">
          Durée d'animation
        </label>
        <input
          type="text"
          value={settings.animation.duration}
          onChange={(e) => updateSetting('animation.duration', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderColor: 'var(--admin-border)' }}
          placeholder="Ex: 300ms, 0.3s"
        />
      </div>

      <div>
        <label className="block text-sm font-medium admin-text-secondary mb-2">
          Courbe d'animation
        </label>
        <select
          value={settings.animation.easing}
          onChange={(e) => updateSetting('animation.easing', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderColor: 'var(--admin-border)' }}
        >
          <option value="ease">Ease</option>
          <option value="ease-in">Ease In</option>
          <option value="ease-out">Ease Out</option>
          <option value="ease-in-out">Ease In Out</option>
          <option value="linear">Linear</option>
          <option value="cubic-bezier(0.4, 0, 0.2, 1)">Custom Cubic Bezier</option>
        </select>
      </div>

      <div className="admin-bg-tertiary p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Aperçu des animations</h4>
        <div className="space-y-4">
          <div 
            className="w-16 h-16 bg-blue-500 rounded-lg transition-transform hover:scale-110 cursor-pointer"
            style={{ 
              transitionDuration: settings.animation.duration,
              transitionTimingFunction: settings.animation.easing
            }}
          />
          <p className="text-sm admin-text-muted">Survolez le carré pour voir l'animation</p>
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Paramètres de Design
              </h1>
              <p className="admin-text-secondary mt-1 text-lg">
                Personnalisez l'apparence de votre site web
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${
                showPreview 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200' 
                  : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
              }`}
            >
              <Eye size={18} />
              <span>{showPreview ? 'Masquer aperçu' : 'Voir aperçu'}</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Download size={18} />
              <span>Exporter</span>
            </button>
            
            <label className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2.5 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              <Upload size={18} />
              <span>Importer</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <RefreshCw size={18} />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">Couleurs</div>
                <div className="text-sm text-purple-700 font-medium">Thème visuel</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Type className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">Typographie</div>
                <div className="text-sm text-blue-700 font-medium">Polices & tailles</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Layout className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">Mise en page</div>
                <div className="text-sm text-green-700 font-medium">Espacement & bordures</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Sliders className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">Animations</div>
                <div className="text-sm text-orange-700 font-medium">Transitions & effets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card rounded-2xl shadow-lg overflow-hidden" style={{ borderColor: 'var(--admin-border)' }}>
        {/* Tabs modernisés */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <nav className="flex px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const getTabColor = (tabId) => {
                const colors = {
                  colors: 'purple',
                  typography: 'blue', 
                  layout: 'green',
                  animation: 'orange'
                };
                return colors[tabId] || 'purple';
              };
              const color = getTabColor(tab.id);
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-3 py-4 px-6 font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? `text-${color}-700 bg-${color}-50 rounded-t-2xl border-b-2 border-${color}-500 shadow-sm`
                      : 'admin-text-secondary hover:admin-text-primary hover:admin-bg-tertiary rounded-t-lg'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    activeTab === tab.id 
                      ? `bg-${color}-100` 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon size={16} className={activeTab === tab.id ? `text-${color}-600` : 'text-gray-500'} />
                  </div>
                  <span className="font-semibold">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-full`}></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content avec fond dégradé selon l'onglet actif */}
        <div className={`p-8 ${
          activeTab === 'colors' ? 'bg-gradient-to-br from-purple-50 via-white to-purple-50' :
          activeTab === 'typography' ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50' :
          activeTab === 'layout' ? 'bg-gradient-to-br from-green-50 via-white to-green-50' :
          'bg-gradient-to-br from-orange-50 via-white to-orange-50'
        }`}>
          {activeTab === 'colors' && <ColorSection />}
          {activeTab === 'typography' && <TypographySection />}
          {activeTab === 'layout' && <LayoutSection />}
          {activeTab === 'animation' && <AnimationSection />}
        </div>
      </div>

      {/* Preview Section modernisée */}
      {showPreview && (
        <div className="mt-8 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-xl overflow-hidden" style={{ borderColor: 'var(--admin-border)' }}>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Aperçu en temps réel</h3>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full"></div>
              </div>
            </div>
            <p className="text-purple-100 text-sm mt-1">Visualisez vos modifications instantanément</p>
          </div>
          
          <div className="p-8">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 space-y-8 relative overflow-hidden"
              style={{ 
                backgroundColor: settings.colors.background,
                fontFamily: settings.typography.fontFamily,
                color: settings.colors.text.primary
              }}
            >
              {/* Effet de grille en arrière-plan */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle, ${settings.colors.primary} 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
              
              <div className="relative">
                <h1 
                  className="font-bold mb-2"
                  style={{ 
                    fontSize: settings.typography.fontSizes['3xl'], 
                    color: settings.colors.primary 
                  }}
                >
                  Titre Principal
                </h1>
                <div className="w-24 h-1 rounded-full" style={{ backgroundColor: settings.colors.accent }}></div>
              </div>
              
              <h2 
                className="font-semibold"
                style={{ 
                  fontSize: settings.typography.fontSizes.xl, 
                  color: settings.colors.secondary 
                }}
              >
                Sous-titre élégant
              </h2>
              
              <p 
                className="leading-relaxed"
                style={{ 
                  fontSize: settings.typography.fontSizes.base, 
                  color: settings.colors.text.secondary 
                }}
              >
                Ceci est un exemple de paragraphe qui montre comment votre contenu s'affichera 
                avec les paramètres de design actuels. Vous pouvez voir l'harmonie des couleurs, 
                la lisibilité de la typographie et l'esthétique générale de votre design.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  style={{ 
                    backgroundColor: settings.colors.primary,
                    borderRadius: settings.layout.borderRadius.base,
                    padding: settings.layout.spacing.sm,
                    color: 'white',
                    transitionDuration: settings.animation.duration,
                    transitionTimingFunction: settings.animation.easing
                  }}
                  className="px-6 py-3 font-semibold transition-all hover:opacity-90 hover:scale-105 shadow-lg"
                >
                  Bouton Principal
                </button>
                <button 
                  style={{ 
                    backgroundColor: settings.colors.accent,
                    borderRadius: settings.layout.borderRadius.base,
                    padding: settings.layout.spacing.sm,
                    color: 'white',
                    transitionDuration: settings.animation.duration,
                    transitionTimingFunction: settings.animation.easing
                  }}
                  className="px-6 py-3 font-semibold transition-all hover:opacity-90 hover:scale-105 shadow-lg"
                >
                  Bouton Accent
                </button>
                <button 
                  style={{ 
                    backgroundColor: 'transparent',
                    borderRadius: settings.layout.borderRadius.base,
                    padding: settings.layout.spacing.sm,
                    color: settings.colors.primary,
                    border: `2px solid ${settings.colors.primary}`,
                    transitionDuration: settings.animation.duration,
                    transitionTimingFunction: settings.animation.easing
                  }}
                  className="px-6 py-3 font-semibold transition-all hover:opacity-90 hover:scale-105"
                >
                  Bouton Outline
                </button>
              </div>
              
              {/* Éléments décoratifs */}
              <div className="flex items-center space-x-4 pt-4 border-t-2 border-dashed border-gray-200">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: settings.colors.primary }}
                ></div>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: settings.colors.secondary }}
                ></div>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: settings.colors.accent }}
                ></div>
                <span className="text-xs font-medium admin-text-muted ml-4">Palette de couleurs active</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Flash Message */}
      <FlashMessage message={message} onClose={hideMessage} />
    </div>
  );
};

export default DesignSettings;
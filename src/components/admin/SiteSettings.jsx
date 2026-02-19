import React, { useState } from 'react';
import { Save, RotateCcw, Upload, Eye, Globe, Mail, Phone, MapPin, Share2, Download, Clock, EyeOff, Settings, Send } from 'lucide-react';
import { ChromePicker } from 'react-color';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import ImageUpload from '../ImageUpload';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';
import AdminLanguageInput from './AdminLanguageInput';
import EmailTemplateInput from '../EmailTemplateInput';

const ColorPicker = ({ label, color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium admin-text-secondary mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center space-x-2 w-full px-3 py-2 border rounded-lg hover:admin-bg-tertiary transition-colors"
          style={{ borderColor: 'var(--admin-border)' }}
        >
          <div
            className="w-6 h-6 rounded border"
            style={{ borderColor: 'var(--admin-border)' }}
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-mono">{color}</span>
        </button>
        
        {showPicker && (
          <div className="absolute top-full mt-2 z-10">
            <div
              className="fixed inset-0"
              onClick={() => setShowPicker(false)}
            />
            <ChromePicker
              color={color}
              onChange={(colorResult) => onChange(colorResult.hex)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const SiteSettings = () => {
  const { settings, updateSettings, updateNestedSetting, resetToDefaults, applyMetaUpdates, saveAllSettings, exportSettings, importSettings } = useSiteSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { message, showSuccess, showError, hideMessage } = useFlashMessage();

  const handleChange = (key, value) => {
    updateSettings({ [key]: value });
    setHasChanges(true);
  };

  const handleNestedChange = (path, value) => {
    updateNestedSetting(path, value);
    setHasChanges(true);
  };

  // Fonction utilitaire pour convertir les objets multilingues en strings
  const getStringValue = (value, fallbackLanguage = 'fr') => {
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'object' && value !== null) {
      // Si c'est un objet multilingue, prendre la valeur française par défaut
      return value[fallbackLanguage] || value['fr'] || value['en'] || Object.values(value)[0] || '';
    }
    
    return '';
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importSettings(file)
        .then(() => {
          showSuccess('Paramètres importés avec succès !');
          setHasChanges(false);
        })
        .catch((error) => {
          showError(`Erreur lors de l'import : ${error.message}`);
        });
    }
  };

  const handleSave = async () => {
    try {
      await saveAllSettings();
      applyMetaUpdates();
      setHasChanges(false);
      showSuccess('Paramètres sauvegardés avec succès !');
    } catch (error) {
      showError(`Erreur lors de la sauvegarde : ${error.message}`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      resetToDefaults();
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'branding', label: 'Image de marque', icon: Eye },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'email', label: 'Template Email', icon: Send },
    { id: 'social', label: 'Réseaux sociaux', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Upload },
    { id: 'advanced', label: 'Avancé', icon: Settings }
  ];

  return (
    <div className="w-full">
      {/* Flash Message */}
      <FlashMessage message={message} onClose={hideMessage} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Globe size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Paramètres du site
              </h1>
              <p className="admin-text-secondary mt-1">Configurez les informations de votre site web</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportSettings}
              className="group flex items-center space-x-2 px-4 py-2.5 admin-card border-2 admin-text-secondary rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 shadow-sm"
              style={{ borderColor: 'var(--admin-border)' }}
            >
              <Download size={18} className="group-hover:text-green-600 transition-colors" />
              <span className="font-medium">Exporter</span>
            </button>

            <label className="group flex items-center space-x-2 px-4 py-2.5 admin-card border-2 admin-text-secondary rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer shadow-sm" style={{ borderColor: 'var(--admin-border)' }}>
              <Upload size={18} className="group-hover:text-blue-600 transition-colors" />
              <span className="font-medium">Importer</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleReset}
              className="group flex items-center space-x-2 px-4 py-2.5 admin-card border-2 admin-text-secondary rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 shadow-sm"
              style={{ borderColor: 'var(--admin-border)' }}
            >
              <RotateCcw size={18} className="group-hover:text-orange-600 transition-colors" />
              <span className="font-medium">Réinitialiser</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
                hasChanges
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105 border-2 border-transparent'
                  : 'admin-bg-tertiary admin-text-muted cursor-not-allowed border-2'
              }`}
              style={!hasChanges ? { borderColor: 'var(--admin-border)' } : {}}
            >
              <Save size={18} className={hasChanges ? 'animate-pulse' : ''} />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>

        {/* Indicateurs de statut */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Système opérationnel</span>
          </div>
          
          {hasChanges && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
              <span className="text-sm font-medium text-amber-700">Modifications non sauvegardées</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="admin-card rounded-2xl shadow-sm p-2" style={{ borderColor: 'var(--admin-border)' }}>
            <div className="mb-4 p-4">
              <h3 className="text-sm font-bold admin-text-muted uppercase tracking-wider">Configuration</h3>
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                
                // Couleurs thématiques pour chaque onglet
                const getTabColors = (tabId) => {
                  const colorMap = {
                    general: { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
                    branding: { bg: 'from-purple-50 to-violet-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600' },
                    contact: { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' },
                    email: { bg: 'from-red-50 to-orange-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600' },
                    social: { bg: 'from-pink-50 to-rose-50', border: 'border-pink-200', text: 'text-pink-700', icon: 'text-pink-600' },
                    seo: { bg: 'from-orange-50 to-amber-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' },
                    advanced: { bg: 'from-gray-50 to-slate-50', border: 'border-gray-200', text: 'admin-text-secondary', icon: 'admin-text-secondary' }
                  };
                  return colorMap[tabId] || colorMap.general;
                };

                const colors = getTabColors(tab.id);
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      active
                        ? `bg-gradient-to-r ${colors.bg} ${colors.border} border ${colors.text} font-semibold shadow-md`
                        : 'admin-text-secondary hover:admin-bg-tertiary hover:admin-text-primary border border-transparent'
                    }`}
                  >
                    {/* Indicateur actif */}
                    {active && (
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 ${colors.icon.replace('text-', 'bg-')} rounded-r-full`} />
                    )}
                    
                    {/* Icône avec design amélioré */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                      active 
                        ? `admin-card/70 ${colors.icon} shadow-sm` 
                        : 'group-hover:admin-bg-tertiary admin-text-muted'
                    }`}>
                      <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                    </div>
                    
                    <span className={`text-sm transition-all duration-200 ${
                      active ? 'font-bold' : 'font-medium group-hover:font-semibold'
                    }`}>
                      {tab.label}
                    </span>

                    {/* Effet de survol */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-white/10 to-white/5 pointer-events-none" />
                  </button>
                );
              })}
            </nav>
            
            {/* Séparateur décoratif */}
            <div className="my-6 flex items-center px-4">
              <div className="flex-1 border-t" style={{ borderColor: 'var(--admin-border)' }}></div>
              <div className="px-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              </div>
              <div className="flex-1 border-t" style={{ borderColor: 'var(--admin-border)' }}></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="admin-card rounded-2xl shadow-lg overflow-hidden" style={{ borderColor: 'var(--admin-border)' }}>
            {/* Tab Header */}
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b px-8 py-6" style={{ borderColor: 'var(--admin-border)' }}>
              <div className="flex items-center space-x-3">
                {tabs.find(tab => tab.id === activeTab) && (
                  <>
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-sm">
                      {React.createElement(tabs.find(tab => tab.id === activeTab).icon, { size: 20, className: "text-white" })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold admin-text-primary">
                        {tabs.find(tab => tab.id === activeTab).label}
                      </h2>
                      <p className="admin-text-muted text-sm mt-1">
                        {activeTab === 'general' && 'Informations de base de votre site'}
                        {activeTab === 'branding' && 'Logo, couleurs et identité visuelle'}
                        {activeTab === 'contact' && 'Coordonnées et informations de contact'}
                        {activeTab === 'email' && 'Templates email multilingues et personnalisation'}
                        {activeTab === 'social' && 'Liens vers vos réseaux sociaux'}
                        {activeTab === 'seo' && 'Optimisation pour les moteurs de recherche'}
                        {activeTab === 'advanced' && 'Configuration avancée et outils'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-8">
            
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <AdminLanguageInput
                      label="Nom du site"
                      value={settings.siteName || {}}
                      onChange={(value) => handleChange('siteName', value)}
                      placeholder="Princept CMS"
                    />
                  </div>

                  <div>
                    <AdminLanguageInput
                      label="Slogan/Tagline"
                      value={settings.siteTagline || {}}
                      onChange={(value) => handleChange('siteTagline', value)}
                      placeholder="Creative & Professional Team"
                    />
                  </div>
                </div>

                <div>
                  <AdminLanguageInput
                    label="Description du site"
                    value={settings.siteDescription || {}}
                    onChange={(value) => handleChange('siteDescription', value)}
                    type="textarea"
                    placeholder="Description de votre site web..."
                  />
                </div>

                <div>
                  <AdminLanguageInput
                    label="Texte de copyright"
                    value={settings.copyrightText || {}}
                    onChange={(value) => handleChange('copyrightText', value)}
                    placeholder="© 2024 Princept CMS. All rights reserved."
                  />
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <ImageUpload
                      label="Logo du site"
                      value={settings.logoUrl || ''}
                      onChange={(value) => handleChange('logoUrl', value)}
                      maxSize={2 * 1024 * 1024} // 2MB
                      preview={true}
                    />
                    <p className="text-xs admin-text-muted mt-1">Logo affiché dans l'en-tête (laissez vide pour utiliser le texte)</p>
                  </div>

                  <div>
                    <AdminLanguageInput
                      label="Texte du logo"
                      value={settings.logoText || {}}
                      onChange={(value) => handleChange('logoText', value)}
                      placeholder="Princept CMS"
                    />
                    <p className="text-xs admin-text-muted mt-1">Texte affiché si pas de logo image</p>
                  </div>
                </div>

                <div className="max-w-md">
                  <ImageUpload
                    label="Favicon"
                    value={settings.favicon || ''}
                    onChange={(value) => handleChange('favicon', value)}
                    maxSize={1 * 1024 * 1024} // 1MB
                    preview={true}
                  />
                  <p className="text-xs admin-text-muted mt-1">Icône affichée dans l'onglet du navigateur (16x16 ou 32x32px recommandé)</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <ColorPicker
                    label="Couleur principale"
                    color={settings.primaryColor || '#3b82f6'}
                    onChange={(color) => handleChange('primaryColor', color)}
                  />
                  
                  <ColorPicker
                    label="Couleur secondaire"
                    color={settings.secondaryColor || '#8b5cf6'}
                    onChange={(color) => handleChange('secondaryColor', color)}
                  />
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: 'var(--admin-border)' }}
                      placeholder="contact@exemple.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={settings.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: 'var(--admin-border)' }}
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Adresse
                  </label>
                  <textarea
                    value={settings.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Rue Example, 75001 Paris, France"
                  />
                </div>

                <div>
                  <AdminLanguageInput
                    label="Texte du footer"
                    value={settings.footerText || {}}
                    onChange={(value) => handleChange('footerText', value)}
                    type="textarea"
                    placeholder="Description de votre entreprise dans le footer..."
                  />
                </div>

                {/* Contact Section Text Translation */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 admin-text-primary">Traductions - Section Contact</h3>
                  <p className="admin-text-secondary text-sm mb-4">
                    Personnalisez les textes affichés dans la section contact pour chaque langue.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <AdminLanguageInput
                        label="Titre du formulaire de contact"
                        value={settings.contactFormTitle || {}}
                        onChange={(value) => handleChange('contactFormTitle', value)}
                        placeholder="Contactez-nous"
                      />
                    </div>
                    <div>
                      <AdminLanguageInput
                        label="Titre des horaires d'ouverture"
                        value={settings.officeHoursTitle || {}}
                        onChange={(value) => handleChange('officeHoursTitle', value)}
                        placeholder="Nos horaires"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <AdminLanguageInput
                        label="Sous-titre des horaires"
                        value={settings.officeHoursSubtitle || {}}
                        onChange={(value) => handleChange('officeHoursSubtitle', value)}
                        placeholder="Nos horaires d'ouverture"
                      />
                    </div>
                    <div>
                      <AdminLanguageInput
                        label="Texte 'Nous ouvrons à'"
                        value={settings.officeHoursCurrentStatusOpening || {}}
                        onChange={(value) => handleChange('officeHoursCurrentStatusOpening', value)}
                        placeholder="Nous ouvrons à"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <AdminLanguageInput
                        label="Label nom complet"
                        value={settings.contactFormNameLabel || {}}
                        onChange={(value) => handleChange('contactFormNameLabel', value)}
                        placeholder="Nom complet"
                      />
                    </div>
                    <div>
                      <AdminLanguageInput
                        label="Label email"
                        value={settings.contactFormEmailLabel || {}}
                        onChange={(value) => handleChange('contactFormEmailLabel', value)}
                        placeholder="Adresse email"
                      />
                    </div>
                    <div>
                      <AdminLanguageInput
                        label="Label sujet"
                        value={settings.contactFormSubjectLabel || {}}
                        onChange={(value) => handleChange('contactFormSubjectLabel', value)}
                        placeholder="Sujet"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <AdminLanguageInput
                        label="Label message"
                        value={settings.contactFormMessageLabel || {}}
                        onChange={(value) => handleChange('contactFormMessageLabel', value)}
                        placeholder="Message"
                      />
                    </div>
                    <div>
                      <AdminLanguageInput
                        label="Texte bouton envoyer"
                        value={settings.contactFormButtonLabel || {}}
                        onChange={(value) => handleChange('contactFormButtonLabel', value)}
                        placeholder="Envoyer le message"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <AdminLanguageInput
                        label="Texte 'Nous sommes ouverts'"
                        value={settings.officeHoursCurrentStatusOpen || {}}
                        onChange={(value) => handleChange('officeHoursCurrentStatusOpen', value)}
                        placeholder="Nous sommes ouverts jusqu'à"
                      />
                    </div>
                    <div>
                      <AdminLanguageInput
                        label="Texte 'Nous sommes fermés'"
                        value={settings.officeHoursCurrentStatusClosed || {}}
                        onChange={(value) => handleChange('officeHoursCurrentStatusClosed', value)}
                        placeholder="Nous sommes fermés"
                      />
                    </div>
                  </div>

                  {/* Jours de la semaine */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-4">Traductions des jours de la semaine</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <AdminLanguageInput
                          label="Lundi"
                          value={settings.dayMonday || {}}
                          onChange={(value) => handleChange('dayMonday', value)}
                          placeholder="Lundi"
                        />
                      </div>
                      <div>
                        <AdminLanguageInput
                          label="Mardi"
                          value={settings.dayTuesday || {}}
                          onChange={(value) => handleChange('dayTuesday', value)}
                          placeholder="Mardi"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <AdminLanguageInput
                          label="Mercredi"
                          value={settings.dayWednesday || {}}
                          onChange={(value) => handleChange('dayWednesday', value)}
                          placeholder="Mercredi"
                        />
                      </div>
                      <div>
                        <AdminLanguageInput
                          label="Jeudi"
                          value={settings.dayThursday || {}}
                          onChange={(value) => handleChange('dayThursday', value)}
                          placeholder="Jeudi"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <AdminLanguageInput
                          label="Vendredi"
                          value={settings.dayFriday || {}}
                          onChange={(value) => handleChange('dayFriday', value)}
                          placeholder="Vendredi"
                        />
                      </div>
                      <div>
                        <AdminLanguageInput
                          label="Samedi"
                          value={settings.daySaturday || {}}
                          onChange={(value) => handleChange('daySaturday', value)}
                          placeholder="Samedi"
                        />
                      </div>
                      <div>
                        <AdminLanguageInput
                          label="Dimanche"
                          value={settings.daySunday || {}}
                          onChange={(value) => handleChange('daySunday', value)}
                          placeholder="Dimanche"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section Display Options */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 admin-text-primary">Options d'affichage - Section Contact</h3>
                  <p className="admin-text-secondary text-sm mb-4">
                    Contrôlez quelles informations de contact sont affichées dans la section "Contactez-nous".
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showContactEmail"
                        checked={settings.showContactEmail ?? true}
                        onChange={(e) => handleChange('showContactEmail', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showContactEmail" className="ml-2 text-sm admin-text-secondary flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Afficher l'email
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showContactPhone"
                        checked={settings.showContactPhone ?? true}
                        onChange={(e) => handleChange('showContactPhone', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showContactPhone" className="ml-2 text-sm admin-text-secondary flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Afficher le téléphone
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showContactAddress"
                        checked={settings.showContactAddress ?? true}
                        onChange={(e) => handleChange('showContactAddress', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showContactAddress" className="ml-2 text-sm admin-text-secondary flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Afficher l'adresse
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showOfficeHours"
                        checked={settings.showOfficeHours ?? true}
                        onChange={(e) => handleChange('showOfficeHours', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showOfficeHours" className="ml-2 text-sm admin-text-secondary flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Afficher les horaires
                      </label>
                    </div>
                  </div>
                </div>

                {/* Map Configuration */}
                <div className="admin-card p-6 rounded-lg shadow" style={{ borderColor: 'var(--admin-border)' }}>
                  <h3 className="text-lg font-semibold admin-text-primary mb-4 flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Configuration de la carte
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showMap"
                        checked={settings.showMap ?? false}
                        onChange={(e) => handleChange('showMap', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showMap" className="ml-2 text-sm admin-text-secondary flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Afficher la carte dans le footer
                      </label>
                    </div>

                    {settings.showMap && (
                      <div className="ml-6 space-y-4 p-4 admin-bg-tertiary rounded-lg">
                        <div>
                          <AdminLanguageInput
                            label="Titre de la carte"
                            value={settings.mapTitle || {}}
                            onChange={(value) => handleChange('mapTitle', value)}
                            placeholder="Notre localisation"
                          />
                        </div>

                        <div>
                          <AdminLanguageInput
                            label="Description"
                            value={settings.mapDescription || {}}
                            onChange={(value) => handleChange('mapDescription', value)}
                            placeholder="Venez nous rendre visite"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium admin-text-secondary mb-2">
                              Latitude
                            </label>
                            <input
                              type="number"
                              step="0.000001"
                              value={settings.mapLatitude || ''}
                              onChange={(e) => handleChange('mapLatitude', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: 'var(--admin-border)' }}
                              placeholder="48.8566"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium admin-text-secondary mb-2">
                              Longitude
                            </label>
                            <input
                              type="number"
                              step="0.000001"
                              value={settings.mapLongitude || ''}
                              onChange={(e) => handleChange('mapLongitude', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: 'var(--admin-border)' }}
                              placeholder="2.3522"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Niveau de zoom (1-18)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="18"
                            value={settings.mapZoom || ''}
                            onChange={(e) => handleChange('mapZoom', parseInt(e.target.value) || 13)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: 'var(--admin-border)' }}
                            placeholder="13"
                          />
                        </div>

                        <div className="text-xs admin-text-muted mt-2">
                          💡 Astuce : Vous pouvez obtenir les coordonnées exactes en recherchant votre adresse sur{' '}
                          <a 
                            href="https://www.openstreetmap.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            OpenStreetMap
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Office Hours Configuration */}
                {settings.showOfficeHours && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 admin-text-primary flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Horaires d'ouverture
                    </h3>
                    <p className="admin-text-secondary text-sm mb-4">
                      Configurez vos horaires d'ouverture pour chaque jour de la semaine.
                    </p>

                    <div className="space-y-4">
                      {[
                        { key: 'monday', label: 'Lundi' },
                        { key: 'tuesday', label: 'Mardi' },
                        { key: 'wednesday', label: 'Mercredi' },
                        { key: 'thursday', label: 'Jeudi' },
                        { key: 'friday', label: 'Vendredi' },
                        { key: 'saturday', label: 'Samedi' },
                        { key: 'sunday', label: 'Dimanche' }
                      ].map(({ key, label }) => {
                        const dayData = settings.officeHours?.[key] || { open: '09:00', close: '18:00', closed: false };
                        
                        return (
                          <div key={key} className="p-4 admin-bg-tertiary rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="w-20 text-sm font-medium admin-text-secondary">
                                {label}
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`${key}-closed`}
                                    checked={!dayData.closed}
                                    onChange={(e) => handleNestedChange(`officeHours.${key}.closed`, !e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`${key}-closed`} className="ml-2 text-sm admin-text-secondary">
                                    Ouvert
                                  </label>
                                </div>

                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`${key}-holiday`}
                                    checked={dayData.isHoliday || false}
                                    onChange={(e) => handleNestedChange(`officeHours.${key}.isHoliday`, e.target.checked)}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`${key}-holiday`} className="ml-2 text-sm text-orange-700">
                                    Férié
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Horaires normaux */}
                            {!dayData.closed && !dayData.isHoliday && (
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <label className="text-sm admin-text-secondary">De</label>
                                  <input
                                    type="time"
                                    value={dayData.open || '09:00'}
                                    onChange={(e) => handleNestedChange(`officeHours.${key}.open`, e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>

                                <div className="flex items-center space-x-2">
                                  <label className="text-sm admin-text-secondary">à</label>
                                  <input
                                    type="time"
                                    value={dayData.close || '18:00'}
                                    onChange={(e) => handleNestedChange(`officeHours.${key}.close`, e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Configuration jour férié */}
                            {dayData.isHoliday && (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-orange-800 mb-1">
                                    Nom du jour férié
                                  </label>
                                  <input
                                    type="text"
                                    value={dayData.holidayName || ''}
                                    onChange={(e) => handleNestedChange(`officeHours.${key}.holidayName`, e.target.value)}
                                    placeholder="ex: Noël, Nouvel An, Fête nationale..."
                                    className="w-full px-3 py-2 border border-orange-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <div className="flex items-center mb-2">
                                    <input
                                      type="checkbox"
                                      id={`${key}-holiday-open`}
                                      checked={!!(dayData.holidayOpen && dayData.holidayClose)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          handleNestedChange(`officeHours.${key}.holidayOpen`, '10:00');
                                          handleNestedChange(`officeHours.${key}.holidayClose`, '16:00');
                                        } else {
                                          handleNestedChange(`officeHours.${key}.holidayOpen`, '');
                                          handleNestedChange(`officeHours.${key}.holidayClose`, '');
                                        }
                                      }}
                                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`${key}-holiday-open`} className="ml-2 text-sm text-orange-800 font-medium">
                                      Ouvert quand même (horaires spéciaux)
                                    </label>
                                  </div>

                                  {dayData.holidayOpen && dayData.holidayClose && (
                                    <div className="flex items-center space-x-4 ml-6">
                                      <div className="flex items-center space-x-2">
                                        <label className="text-sm text-orange-700">De</label>
                                        <input
                                          type="time"
                                          value={dayData.holidayOpen || '10:00'}
                                          onChange={(e) => handleNestedChange(`officeHours.${key}.holidayOpen`, e.target.value)}
                                          className="px-2 py-1 border border-orange-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <label className="text-sm text-orange-700">à</label>
                                        <input
                                          type="time"
                                          value={dayData.holidayClose || '16:00'}
                                          onChange={(e) => handleNestedChange(`officeHours.${key}.holidayClose`, e.target.value)}
                                          className="px-2 py-1 border border-orange-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Status fermé normal */}
                            {dayData.closed && !dayData.isHoliday && (
                              <span className="text-sm admin-text-muted italic">Fermé</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Conseil</h4>
                      <p className="text-sm text-blue-800">
                        Les horaires configurés ici seront affichés dans la section "Contactez-nous" de votre site.
                        Vous pouvez désactiver l'affichage des horaires avec l'option ci-dessus.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
              <div className="space-y-8">
                
                {/* Templates d'email */}
                <div className="admin-card p-6 rounded-lg shadow" style={{ borderColor: 'var(--admin-border)' }}>
                  <h3 className="text-lg font-semibold admin-text-primary mb-4 flex items-center">
                    <Mail className="mr-2" size={20} />
                    Templates d'email
                  </h3>
                  <p className="admin-text-secondary text-sm mb-6">
                    Personnalisez les templates d'emails automatiques. Utilisez {`{{variable}}`} pour insérer des données dynamiques.
                  </p>

                  <div className="space-y-8">
                    {/* Template de contact */}
                    <div className="border rounded-lg p-6 admin-bg-tertiary">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium admin-text-primary">Email de notification de contact</h4>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="contact-enabled"
                            checked={settings.emailConfig?.templates?.contact?.enabled || false}
                            onChange={(e) => handleNestedChange('emailConfig.templates.contact.enabled', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="contact-enabled" className="ml-2 text-sm admin-text-secondary">
                            Activé
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Sujet de l'email
                          </label>
                          <AdminLanguageInput
                            value={settings.emailConfig?.templates?.contact?.subject || {}}
                            onChange={(value) => handleNestedChange('emailConfig.templates.contact.subject', value)}
                            placeholder="Nouveau message de contact"
                            disabled={!settings.emailConfig?.templates?.contact?.enabled}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Template de l'email
                          </label>
                          <AdminLanguageInput
                            type="textarea"
                            value={settings.emailConfig?.templates?.contact?.template || {}}
                            onChange={(value) => handleNestedChange('emailConfig.templates.contact.template', value)}
                            rows={8}
                            disabled={!settings.emailConfig?.templates?.contact?.enabled}
                          />
                          <p className="text-xs admin-text-muted mt-1">
                            Variables disponibles : {`{{name}}`}, {`{{email}}`}, {`{{phone}}`}, {`{{subject}}`}, {`{{message}}`}, {`{{siteName}}`}, {`{{date}}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Template de confirmation */}
                    <div className="border rounded-lg p-6 admin-bg-tertiary">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium admin-text-primary">Email de confirmation automatique</h4>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="confirmation-enabled"
                            checked={settings.emailConfig?.templates?.contactConfirmation?.enabled || false}
                            onChange={(e) => handleNestedChange('emailConfig.templates.contactConfirmation.enabled', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="confirmation-enabled" className="ml-2 text-sm admin-text-secondary">
                            Activé
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Sujet de l'email
                          </label>
                          <AdminLanguageInput
                            value={settings.emailConfig?.templates?.contactConfirmation?.subject || {}}
                            onChange={(value) => handleNestedChange('emailConfig.templates.contactConfirmation.subject', value)}
                            placeholder="Merci pour votre message"
                            disabled={!settings.emailConfig?.templates?.contactConfirmation?.enabled}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Template de l'email
                          </label>
                          <AdminLanguageInput
                            type="textarea"
                            value={settings.emailConfig?.templates?.contactConfirmation?.template || {}}
                            onChange={(value) => handleNestedChange('emailConfig.templates.contactConfirmation.template', value)}
                            rows={8}
                            disabled={!settings.emailConfig?.templates?.contactConfirmation?.enabled}
                          />
                          <p className="text-xs admin-text-muted mt-1">
                            Variables disponibles : {`{{name}}`}, {`{{message}}`}, {`{{siteName}}`}, {`{{email}}`}, {`{{phone}}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Template newsletter */}
                    <div className="border rounded-lg p-6 admin-bg-tertiary">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium admin-text-primary">Email d'inscription newsletter</h4>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="newsletter-enabled"
                            checked={settings.emailConfig?.templates?.newsletter?.enabled || false}
                            onChange={(e) => handleNestedChange('emailConfig.templates.newsletter.enabled', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="newsletter-enabled" className="ml-2 text-sm admin-text-secondary">
                            Activé
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Sujet de l'email
                          </label>
                          <AdminLanguageInput
                            value={settings.emailConfig?.templates?.newsletter?.subject || {}}
                            onChange={(value) => handleNestedChange('emailConfig.templates.newsletter.subject', value)}
                            placeholder="Inscription à la newsletter"
                            disabled={!settings.emailConfig?.templates?.newsletter?.enabled}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Template de l'email
                          </label>
                          <AdminLanguageInput
                            type="textarea"
                            value={settings.emailConfig?.templates?.newsletter?.template || {}}
                            onChange={(value) => handleNestedChange('emailConfig.templates.newsletter.template', value)}
                            rows={6}
                            disabled={!settings.emailConfig?.templates?.newsletter?.enabled}
                          />
                          <p className="text-xs admin-text-muted mt-1">
                            Variables disponibles : {`{{email}}`}, {`{{date}}`}, {`{{siteName}}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section informations */}
                <div className="admin-card p-6 rounded-lg shadow" style={{ borderColor: 'var(--admin-border)' }}>
                  <h3 className="text-lg font-semibold admin-text-primary mb-4 flex items-center">
                    <Settings className="mr-2" size={20} />
                    Informations importantes
                  </h3>
                  <div className="space-y-3">
                    {settings.emailConfig?.provider && (
                      <>
                        <p><strong>Fournisseur actuel :</strong> {settings.emailConfig.provider.toUpperCase()}</p>
                        <p><strong>Configuration :</strong> Les paramètres de connexion email sont gérés dans Admin → Email</p>
                      </>
                    )}
                    <p><strong>Variables :</strong> Utilisez {`{{nom_variable}}`} dans vos templates pour insérer des données dynamiques.</p>
                    <p><strong>Test :</strong> Après configuration, testez l'envoi avec le formulaire de contact de votre site.</p>
                  </div>
                </div>
              </div>
            )}
            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                
                <p className="admin-text-secondary text-sm mb-6">
                  Configurez vos liens de réseaux sociaux. Seuls les réseaux avec une URL et marqués comme visibles apparaîtront sur votre site.
                </p>

                <div className="space-y-6">
                  {settings.social && Object.entries(settings.social).map(([network, data]) => (
                    <div key={network} className="border rounded-lg p-4 admin-bg-tertiary">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium admin-text-primary capitalize">{data.label || network}</h3>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${network}-visible`}
                              checked={data.visible || false}
                              onChange={(e) => handleNestedChange(`social.${network}.visible`, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`${network}-visible`} className="ml-2 text-sm admin-text-secondary">
                              Visible
                            </label>
                          </div>
                        </div>
                        {data.visible && data.url && (
                          <span className="text-green-600 text-sm font-medium">✓ Actif</span>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-2">
                          URL du profil
                        </label>
                        <input
                          type="url"
                          value={data.url || ''}
                          onChange={(e) => handleNestedChange(`social.${network}.url`, e.target.value)}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            !data.visible ? 'opacity-50' : ''
                          }`}
                          placeholder={`https://${network}.com/votreprofil`}
                          disabled={!data.visible}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Conseil</h4>
                  <p className="text-sm text-blue-800">
                    Activez seulement les réseaux sociaux que vous utilisez réellement. 
                    Cela permet une meilleure expérience utilisateur et évite les liens brisés.
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showSocialLinks"
                    checked={settings.showSocialLinks || false}
                    onChange={(e) => handleChange('showSocialLinks', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showSocialLinks" className="ml-2 text-sm admin-text-secondary">
                    Afficher les liens sociaux dans le footer du site
                  </label>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                
                <div>
                  <AdminLanguageInput
                    label="Meta Description"
                    value={settings.metaDescription || {}}
                    onChange={(value) => handleChange('metaDescription', value)}
                    type="textarea"
                    placeholder="Description pour les moteurs de recherche..."
                  />
                  <div className="flex justify-between text-xs admin-text-muted mt-1">
                    <span>Optimisé pour le SEO (150-160 caractères recommandés)</span>
                    <span>Limite : 160 caractères par langue</span>
                  </div>
                </div>

                <div>
                  <AdminLanguageInput
                    label="Mots-clés SEO"
                    value={settings.metaKeywords || {}}
                    onChange={(value) => handleChange('metaKeywords', value)}
                    placeholder="mot-clé1, mot-clé2, mot-clé3"
                  />
                  <p className="text-xs admin-text-muted mt-1">Séparez les mots-clés par des virgules (adaptez aux langues)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={settings.googleAnalytics || ''}
                    onChange={(e) => handleChange('googleAnalytics', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="G-XXXXXXXXXX ou UA-XXXXXXXXX-X"
                  />
                  <p className="text-xs admin-text-muted mt-1">Votre ID de suivi Google Analytics</p>
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">
                    Google Search Console
                  </label>
                  <input
                    type="text"
                    value={settings.googleSearchConsole || ''}
                    onChange={(e) => handleChange('googleSearchConsole', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Code de vérification Google Search Console"
                  />
                  <p className="text-xs admin-text-muted mt-1">Code de vérification pour Google Search Console</p>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showQuickLinks"
                    checked={settings.showQuickLinks || false}
                    onChange={(e) => handleChange('showQuickLinks', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showQuickLinks" className="ml-2 text-sm admin-text-secondary">
                    Afficher les liens rapides dans le footer
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Zone de danger</h4>
                  <p className="text-sm text-yellow-800 mb-4">
                    Ces actions sont irréversibles. Assurez-vous de bien comprendre les conséquences.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Cette action supprimera TOUTES les données du site. Êtes-vous absolument certain ?')) {
                        if (window.confirm('DERNIÈRE CHANCE : Cette action est IRRÉVERSIBLE. Continuer ?')) {
                          resetToDefaults();
                          window.location.reload();
                        }
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Réinitialiser complètement le site
                  </button>
                </div>

                <div className="admin-bg-tertiary border rounded-lg p-4" style={{ borderColor: 'var(--admin-border)' }}>
                  <h4 className="text-sm font-medium admin-text-primary mb-2">📊 Informations techniques</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="admin-text-secondary">Sections actives :</span>
                      <span className="font-medium ml-2">-</span>
                    </div>
                    <div>
                      <span className="admin-text-secondary">Dernière sauvegarde :</span>
                      <span className="font-medium ml-2">-</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
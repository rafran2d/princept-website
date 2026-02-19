import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Settings, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  TestTube, 
  Star,
  HelpCircle,
  ExternalLink,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import emailProvidersService from '../../services/emailProviders';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const EmailProviderSettings = () => {
  const { settings: siteSettings, updateSettings: updateSiteSettings } = useSiteSettings();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerConfig, setProviderConfig] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');
  const [showDocumentation, setShowDocumentation] = useState(false);

  const providers = emailProvidersService.getProvidersByCategory();
  const popularProviders = emailProvidersService.getPopularProviders();
  const recommendations = emailProvidersService.getProviderRecommendations();

  useEffect(() => {
    // Charger la configuration actuelle depuis contact_email ou email (fallback)
    let emailProvider = null;
    let emailConfig = {};
    
    // Priorité à contact_email (nouvelle structure)
    if (siteSettings?.contact_email?.provider) {
      emailProvider = siteSettings.contact_email.provider;
      emailConfig = siteSettings.contact_email.config || {};
    }
    // Fallback sur email (ancienne structure)
    else if (siteSettings?.email?.provider) {
      emailProvider = siteSettings.email.provider;
      emailConfig = siteSettings.email.config || {};
    }
    
    if (emailProvider) {
      const currentProvider = emailProvidersService.getProvider(emailProvider);
      if (currentProvider) {
        setSelectedProvider(currentProvider);
        setProviderConfig(emailConfig);
      }
    }
  }, [siteSettings]);
  
  // Protection contre siteSettings undefined ou non initialisés
  if (!siteSettings || Object.keys(siteSettings).length === 0) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="admin-text-secondary">Chargement des paramètres...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setProviderConfig({});
    setTestResult(null);
    setShowDocumentation(false);
  };

  const handleConfigChange = (field, value) => {
    setProviderConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleTestConnection = async () => {
    if (!selectedProvider) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await emailProvidersService.testProviderConnection(
        selectedProvider.id, 
        providerConfig
      );
      setTestResult({ success: true, ...result });
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: error.message,
        provider: selectedProvider.name 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!selectedProvider) return;

    const validation = emailProvidersService.validateProviderConfig(
      selectedProvider.id, 
      providerConfig
    );

    if (!validation.isValid) {
      setTestResult({ 
        success: false, 
        message: `Configuration invalide: ${validation.errors.join(', ')}`,
        provider: selectedProvider.name 
      });
      return;
    }

    try {
      const finalConfig = emailProvidersService.generateSendConfig(
        selectedProvider.id, 
        providerConfig
      );

      await updateSiteSettings({
        contact_email: {
          provider: selectedProvider.id,
          config: providerConfig,
          finalConfig: finalConfig,
          lastUpdated: new Date().toISOString()
        }
      });

      setTestResult({ 
        success: true, 
        message: `Configuration ${selectedProvider.name} sauvegardée avec succès !`,
        provider: selectedProvider.name 
      });
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Erreur lors de la sauvegarde: ${error.message}`,
        provider: selectedProvider.name 
      });
    }
  };

  const renderProviderCard = (provider, isSelected = false) => (
    <div
      key={provider.id}
      onClick={() => handleProviderSelect(provider)}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300 admin-card'
      }`}
    >
      {provider.isPopular && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Star size={12} className="mr-1" />
          Populaire
        </div>
      )}
      
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-2xl">{provider.icon}</div>
        <div>
          <h3 className="font-bold text-lg admin-text-primary">{provider.name}</h3>
          <p className="text-sm admin-text-secondary">{provider.description}</p>
        </div>
      </div>

      {provider.pricingInfo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2">
          <div className="flex items-center space-x-1 text-green-700">
            <Shield size={14} />
            <span className="text-xs font-medium">{provider.pricingInfo}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          provider.category === 'free' ? 'bg-green-100 text-green-800' :
          provider.category === 'professional' ? 'bg-blue-100 text-blue-800' :
          provider.category === 'enterprise' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {provider.category === 'free' ? 'Gratuit' :
           provider.category === 'professional' ? 'Professionnel' :
           provider.category === 'enterprise' ? 'Entreprise' : 'Avancé'}
        </span>
        
        {isSelected && (
          <div className="flex items-center text-blue-600">
            <Check size={16} />
            <span className="text-sm ml-1">Sélectionné</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderConfigurationForm = () => {
    if (!selectedProvider) return null;

    return (
      <div className="admin-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{selectedProvider.icon}</div>
            <div>
              <h2 className="text-xl font-bold admin-text-primary">
                Configuration {selectedProvider.name}
              </h2>
              <p className="admin-text-secondary">{selectedProvider.description}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDocumentation(!showDocumentation)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <HelpCircle size={16} />
            <span>Aide</span>
          </button>
        </div>

        {showDocumentation && selectedProvider.documentation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Guide de configuration</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm mb-3">
              {selectedProvider.documentation.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            {selectedProvider.documentation.setupUrl && selectedProvider.documentation.setupUrl !== '#' && (
              <a
                href={selectedProvider.documentation.setupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <ExternalLink size={14} />
                <span>Documentation officielle</span>
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {selectedProvider.config.fields.map((field) => (
            <div key={field.key} className={field.type === 'checkbox' ? 'col-span-full' : ''}>
              <label className="block text-sm font-medium admin-text-primary mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={providerConfig[field.key] || ''}
                  onChange={(e) => handleConfigChange(field.key, e.target.value)}
                  className="w-full admin-input rounded-lg px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez...</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={field.key}
                    checked={providerConfig[field.key] || false}
                    onChange={(e) => handleConfigChange(field.key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={field.key} className="text-sm admin-text-secondary">
                    {field.help}
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type={field.type === 'password' && !showPasswords[field.key] ? 'password' : 
                          field.type === 'password' ? 'text' : field.type}
                    value={providerConfig[field.key] || ''}
                    onChange={(e) => handleConfigChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full admin-input rounded-lg px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.key)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              )}
              
              {field.help && field.type !== 'checkbox' && (
                <p className="text-xs admin-text-muted mt-1">{field.help}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <TestTube size={16} />
            <span>{isTesting ? 'Test en cours...' : 'Tester la connexion'}</span>
          </button>
          
          <button
            onClick={handleSaveConfiguration}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings size={16} />
            <span>Sauvegarder</span>
          </button>
        </div>

        {testResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            testResult.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {testResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
              <span className="font-medium">{testResult.message}</span>
            </div>
            
            {testResult.details && (
              <div className="mt-2 text-sm">
                <p>Latence: {testResult.details.latency}ms</p>
                <p>Authentification: {testResult.details.authentication}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Mail size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold admin-text-primary">Configuration Email</h1>
            <p className="admin-text-secondary">
              Choisissez et configurez votre fournisseur d'email
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Zap size={16} className="mr-2" />
            Recommandations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div className="text-blue-800">
              <span className="font-medium">Débutant:</span> Gmail
            </div>
            <div className="text-blue-800">
              <span className="font-medium">Business:</span> SendGrid
            </div>
            <div className="text-blue-800">
              <span className="font-medium">Développeur:</span> Mailgun
            </div>
            <div className="text-blue-800">
              <span className="font-medium">Entreprise:</span> Amazon SES
            </div>
            <div className="text-blue-800">
              <span className="font-medium">Europe:</span> Mailjet
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'popular', label: 'Populaires', icon: Star },
              { id: 'free', label: 'Gratuits', icon: Shield },
              { id: 'professional', label: 'Professionnels', icon: Zap },
              { id: 'enterprise', label: 'Entreprise', icon: Globe },
              { id: 'advanced', label: 'Avancé', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Selection */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold admin-text-primary mb-4">
            {activeTab === 'popular' ? 'Fournisseurs Populaires' : 
             `Fournisseurs ${providers[activeTab]?.name || ''}`}
          </h2>
          
          <div className="space-y-4">
            {activeTab === 'popular' 
              ? popularProviders.map(provider => renderProviderCard(
                  provider, 
                  selectedProvider?.id === provider.id
                ))
              : providers[activeTab]?.providers.map(provider => renderProviderCard(
                  provider, 
                  selectedProvider?.id === provider.id
                ))
            }
          </div>
        </div>

        {/* Configuration Form */}
        <div className="lg:col-span-2">
          {selectedProvider ? (
            renderConfigurationForm()
          ) : (
            <div className="admin-card rounded-xl p-12 text-center">
              <Mail size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium admin-text-primary mb-2">
                Sélectionnez un fournisseur d'email
              </h3>
              <p className="admin-text-secondary">
                Choisissez un fournisseur dans la liste pour configurer vos emails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailProviderSettings;
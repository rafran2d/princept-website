import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Globe, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContextDB';
import { useSiteSettings } from '../hooks/useSiteSettings';
import realEmailService from '../utils/realEmailService';

const EmailTemplateTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [testData, setTestData] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 1 23 45 67 89',
    subject: 'Test du système multilingue',
    message: 'Ceci est un test du nouveau système de templates EmailJS avec contenu personnalisé par langue.'
  });

  const languageContext = useLanguage();
  const { settings } = useSiteSettings();
  const activeLanguages = languageContext.getActiveLanguages();

  // Données de test par langue
  const testDataByLanguage = {
    'fr': {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '+33 1 23 45 67 89',
      subject: 'Test du système multilingue',
      message: 'Ceci est un test du nouveau système de templates EmailJS avec contenu personnalisé par langue.'
    },
    'en': {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 555 123 4567',
      subject: 'Multilingual system test',
      message: 'This is a test of the new EmailJS template system with custom content per language.'
    },
    'es': {
      name: 'Juan García',
      email: 'juan.garcia@example.com',
      phone: '+34 912 345 678',
      subject: 'Prueba del sistema multiidioma',
      message: 'Esta es una prueba del nuevo sistema de plantillas EmailJS con contenido personalizado por idioma.'
    }
  };

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    setTestData(testDataByLanguage[langId] || testDataByLanguage['fr']);
  };

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Enrichir les données avec la langue
      const enrichedData = {
        ...testData,
        language: selectedLanguage,
        detectedLanguage: selectedLanguage
      };

      // Test avec le service réel
      const emailResult = await realEmailService.sendContactEmails(
        enrichedData,
        settings.emailConfig,
        settings,
        selectedLanguage
      );

      setResult({
        success: true,
        data: emailResult,
        language: selectedLanguage
      });

    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        language: selectedLanguage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateConfiguration = () => {
    const errors = [];
    const emailConfig = settings.emailConfig;

    if (!emailConfig) {
      errors.push('Configuration email manquante');
      return errors;
    }

    if (emailConfig.provider === 'emailjs') {
      if (!emailConfig.emailjsServiceId) errors.push('Service ID EmailJS manquant');
      if (!emailConfig.emailjsTemplateId) errors.push('Template ID EmailJS manquant');
      if (!emailConfig.emailjsPublicKey) errors.push('Clé publique EmailJS manquante');
    }

    if (!emailConfig.templates?.contact?.enabled) {
      errors.push('Template de contact désactivé');
    }

    // Vérifier templates par langue
    const currentTemplate = emailConfig.templates?.contact?.template;
    if (!currentTemplate || !currentTemplate[selectedLanguage]) {
      errors.push(`Template manquant pour la langue ${selectedLanguage}`);
    }

    return errors;
  };

  const configErrors = validateConfiguration();
  const canTest = configErrors.length === 0 && settings.emailConfig?.provider === 'emailjs';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Test Template EmailJS Unique</h2>
              <p className="text-gray-600">Testez le nouveau système avec contenu personnalisé par langue</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Sélecteur de langue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Globe className="inline w-4 h-4 mr-2" />
              Langue à tester
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {activeLanguages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`
                    p-3 border-2 rounded-lg transition-all text-sm
                    ${selectedLanguage === lang.id 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.code.toUpperCase()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Données de test */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Données de test</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={testData.name}
                  onChange={(e) => setTestData({ ...testData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={testData.email}
                  onChange={(e) => setTestData({ ...testData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  value={testData.subject}
                  onChange={(e) => setTestData({ ...testData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={testData.phone}
                  onChange={(e) => setTestData({ ...testData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={testData.message}
                  onChange={(e) => setTestData({ ...testData, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Validation */}
          {configErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Configuration incomplète</span>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {configErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Aperçu du template */}
          {canTest && settings.emailConfig?.templates?.contact?.template?.[selectedLanguage] && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Aperçu du template ({activeLanguages.find(l => l.id === selectedLanguage)?.name})
              </h4>
              <div className="text-sm text-gray-700 font-mono bg-white p-3 rounded border overflow-auto">
                {settings.emailConfig.templates.contact.template[selectedLanguage]?.substring(0, 200)}
                {settings.emailConfig.templates.contact.template[selectedLanguage]?.length > 200 && '...'}
              </div>
            </div>
          )}

          {/* Bouton de test */}
          <button
            onClick={handleTest}
            disabled={!canTest || isLoading}
            className={`
              w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
              ${canTest && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
            <span>
              {isLoading 
                ? `Test en cours (${selectedLanguage})...` 
                : `Tester l'envoi (${selectedLanguage})`
              }
            </span>
          </button>

          {/* Résultats */}
          {result && (
            <div className={`
              p-4 rounded-lg border
              ${result.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
              }
            `}>
              <div className="flex items-center space-x-2 mb-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">
                  {result.success ? 'Test réussi !' : 'Test échoué'}
                </span>
                <span className="text-sm">({result.language})</span>
              </div>
              
              {result.success && result.data && (
                <div className="text-sm space-y-1">
                  <div>✅ Notification: {result.data.notification?.success ? 'Envoyée' : 'Échouée'}</div>
                  <div>📧 Confirmation: {result.data.confirmation?.success ? 'Envoyée' : 'Désactivée/Échouée'}</div>
                  {result.data.errors?.length > 0 && (
                    <div className="text-amber-700">⚠️ Avertissements: {result.data.errors.join(', ')}</div>
                  )}
                </div>
              )}
              
              {!result.success && (
                <div className="text-sm mt-1">
                  {result.error}
                </div>
              )}
            </div>
          )}

          {/* Aide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-blue-900 mb-2">💡 Comment ça marche</h5>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. <strong>Un seul template EmailJS</strong> reçoit le contenu déjà localisé</p>
              <p>2. <strong>Contenu personnalisé</strong> sélectionné selon la langue</p>
              <p>3. <strong>Variables remplacées</strong> dans le template approprié</p>
              <p>4. <strong>Email final envoyé</strong> avec {{`email_subject`}} et {{`email_content`}} localisés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateTest;
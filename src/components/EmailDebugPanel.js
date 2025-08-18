import React, { useState } from 'react';
import { Bug, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useLanguageDetection } from '../utils/languageDetection';
import realEmailService from '../utils/realEmailService';

const EmailDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  
  const languageContext = useLanguage();
  const { settings } = useSiteSettings();
  const { getCurrentLanguage } = useLanguageDetection(languageContext);
  
  const activeLanguages = languageContext.getActiveLanguages();
  const currentLang = getCurrentLanguage();

  const analyzeTemplates = () => {
    const emailConfig = settings.emailConfig;
    const analysis = {
      currentLanguage: currentLang,
      selectedLanguage: selectedLanguage,
      emailConfig: emailConfig,
      templates: {},
      issues: []
    };

    // Analyser les templates de contact
    if (emailConfig?.templates?.contact) {
      const contactTemplate = emailConfig.templates.contact.template;
      const contactSubject = emailConfig.templates.contact.subject;
      
      analysis.templates.contact = {
        enabled: emailConfig.templates.contact.enabled,
        template: contactTemplate,
        subject: contactSubject,
        templateType: typeof contactTemplate,
        subjectType: typeof contactSubject
      };

      // Vérifier la structure
      if (typeof contactTemplate === 'string') {
        analysis.issues.push('Template contact est une chaîne simple (ancien format)');
      } else if (typeof contactTemplate === 'object') {
        const availableLanguages = Object.keys(contactTemplate);
        analysis.templates.contact.availableLanguages = availableLanguages;
        
        if (!contactTemplate[selectedLanguage]) {
          analysis.issues.push(`Template contact manquant pour la langue ${selectedLanguage}`);
        }
        
        if (!contactTemplate[currentLang]) {
          analysis.issues.push(`Template contact manquant pour la langue détectée ${currentLang}`);
        }
      } else {
        analysis.issues.push('Template contact structure invalide');
      }

      // Tester la sélection de template
      try {
        const selectedTemplate = realEmailService.getTemplateForLanguage(
          contactTemplate,
          selectedLanguage
        );
        
        analysis.templates.contact.selectedTemplate = selectedTemplate;
        analysis.templates.contact.selectedTemplateLength = selectedTemplate?.length;
        
        if (!selectedTemplate || selectedTemplate.trim() === '') {
          analysis.issues.push(`Template sélectionné vide pour ${selectedLanguage}`);
        }
      } catch (error) {
        analysis.issues.push(`Erreur sélection template: ${error.message}`);
      }
    } else {
      analysis.issues.push('Configuration templates contact manquante');
    }

    // Analyser EmailJS
    if (emailConfig?.provider === 'emailjs') {
      analysis.emailjs = {
        serviceId: emailConfig.emailjsServiceId,
        templateId: emailConfig.emailjsTemplateId,
        publicKey: emailConfig.emailjsPublicKey,
        hasServiceId: !!emailConfig.emailjsServiceId,
        hasTemplateId: !!emailConfig.emailjsTemplateId,
        hasPublicKey: !!emailConfig.emailjsPublicKey
      };

      if (!emailConfig.emailjsServiceId) analysis.issues.push('Service ID EmailJS manquant');
      if (!emailConfig.emailjsTemplateId) analysis.issues.push('Template ID EmailJS manquant');
      if (!emailConfig.emailjsPublicKey) analysis.issues.push('Clé publique EmailJS manquante');
    }

    setDebugInfo(analysis);
  };

  const previewTemplate = (templateData, language) => {
    if (!templateData) return 'Template non configuré';
    
    if (typeof templateData === 'string') {
      return templateData;
    }
    
    if (typeof templateData === 'object') {
      return templateData[language] || templateData['fr'] || Object.values(templateData)[0] || 'Aucun template disponible';
    }
    
    return 'Format invalide';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Bug className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Debug Panel Email</h2>
              <p className="text-gray-600">Diagnostiquer les problèmes de templates d'email</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Sélecteur de langue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Langue à analyser
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {activeLanguages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={`
                    p-3 border-2 rounded-lg transition-all text-sm
                    ${selectedLanguage === lang.id 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
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
            <p className="text-sm text-gray-500 mt-2">
              Langue détectée automatiquement: <strong>{currentLang}</strong>
            </p>
          </div>

          {/* Bouton d'analyse */}
          <button
            onClick={analyzeTemplates}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
          >
            <Eye className="w-5 h-5" />
            <span>Analyser la configuration</span>
          </button>

          {/* Résultats */}
          {debugInfo && (
            <div className="space-y-6">
              {/* Issues */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900">
                    Problèmes détectés ({debugInfo.issues.length})
                  </span>
                </div>
                {debugInfo.issues.length > 0 ? (
                  <ul className="text-sm text-red-700 space-y-1">
                    {debugInfo.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-700">✅ Aucun problème détecté</p>
                )}
              </div>

              {/* Configuration EmailJS */}
              {debugInfo.emailjs && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Configuration EmailJS</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Service ID:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                          {debugInfo.emailjs.serviceId || 'Non configuré'}
                        </span>
                        {debugInfo.emailjs.hasServiceId ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Template ID:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                          {debugInfo.emailjs.templateId || 'Non configuré'}
                        </span>
                        {debugInfo.emailjs.hasTemplateId ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Templates */}
              {debugInfo.templates.contact && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Templates Contact</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Structure:</span>
                      <div className="text-xs text-gray-600">
                        Template: {debugInfo.templates.contact.templateType} | 
                        Sujet: {debugInfo.templates.contact.subjectType}
                      </div>
                      {debugInfo.templates.contact.availableLanguages && (
                        <div className="text-xs text-gray-600">
                          Langues disponibles: {debugInfo.templates.contact.availableLanguages.join(', ')}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Template sélectionné ({selectedLanguage}):
                      </span>
                      <div className="mt-2 p-3 bg-white border rounded text-xs font-mono max-h-40 overflow-auto">
                        {debugInfo.templates.contact.selectedTemplate || 'Aucun template sélectionné'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Longueur: {debugInfo.templates.contact.selectedTemplateLength || 0} caractères
                      </div>
                    </div>

                    {/* Aperçu pour toutes les langues */}
                    <div>
                      <span className="text-sm font-medium text-gray-700">Aperçu par langue:</span>
                      <div className="mt-2 space-y-2">
                        {activeLanguages.map(lang => (
                          <div key={lang.id} className="flex items-start space-x-3">
                            <span className="text-sm font-medium min-w-0 flex items-center space-x-1">
                              <span>{lang.flag}</span>
                              <span>{lang.code.toUpperCase()}</span>
                            </span>
                            <div className="flex-1 p-2 bg-white border rounded text-xs max-h-20 overflow-auto">
                              {previewTemplate(debugInfo.templates.contact.template, lang.id)?.substring(0, 150)}
                              {previewTemplate(debugInfo.templates.contact.template, lang.id)?.length > 150 && '...'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Configuration complète */}
              <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-900">
                  Configuration complète (JSON)
                </summary>
                <pre className="mt-3 text-xs bg-white p-3 rounded border overflow-auto max-h-80">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDebugPanel;
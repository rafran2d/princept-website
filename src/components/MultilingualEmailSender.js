import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLanguageDetection } from '../utils/languageDetection';
import emailService from '../utils/emailService';
import realEmailService from '../utils/realEmailService';
import { useSiteSettings } from '../hooks/useSiteSettings';

const MultilingualEmailSender = ({ 
  className = '',
  emailData,
  emailConfig,
  onSuccess,
  onError,
  useRealEmailService = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  const languageContext = useLanguage();
  const { settings: siteSettings } = useSiteSettings();
  const { getCurrentLanguage, enrichFormData } = useLanguageDetection(languageContext);
  
  const activeLanguages = languageContext.getActiveLanguages();
  const currentLanguage = selectedLanguage || getCurrentLanguage();
  
  const handleSendEmail = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Enrichir les données avec la langue
      const enrichedFormData = enrichFormData(emailData);
      
      // Sélectionner le service d'email approprié
      const service = useRealEmailService ? realEmailService : emailService;
      
      console.log(`📧 [MultilingualEmailSender] Envoi email en langue: ${currentLanguage}`, {
        service: useRealEmailService ? 'realEmailService' : 'emailService',
        language: currentLanguage,
        formData: enrichedFormData
      });
      
      // Envoyer l'email avec la langue spécifiée
      const emailResult = await service.sendContactEmails(
        enrichedFormData,
        emailConfig,
        siteSettings,
        currentLanguage
      );
      
      setResult({
        success: true,
        data: emailResult,
        language: currentLanguage
      });
      
      onSuccess?.(emailResult);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi multilingue:', error);
      
      setResult({
        success: false,
        error: error.message,
        language: currentLanguage
      });
      
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageStatus = (langId) => {
    // Vérifier si la langue a des templates configurés
    const hasContactTemplate = emailConfig?.templates?.contact?.template?.[langId] || 
                              emailConfig?.emailjsTemplates?.contact?.[langId];
    const hasConfirmTemplate = emailConfig?.templates?.contactConfirmation?.template?.[langId] || 
                               emailConfig?.emailjsTemplates?.contactConfirmation?.[langId];
    
    return {
      hasContactTemplate,
      hasConfirmTemplate,
      isComplete: hasContactTemplate && hasConfirmTemplate
    };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sélecteur de langue */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="inline w-4 h-4 mr-2" />
          Langue de l'email
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {activeLanguages.map(lang => {
            const status = getLanguageStatus(lang.id);
            const isSelected = currentLanguage === lang.id;
            
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`
                  relative p-3 border-2 rounded-lg transition-all text-sm
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                  ${!status.isComplete ? 'opacity-75' : ''}
                `}
                title={`${lang.name} - ${status.isComplete ? 'Templates configurés' : 'Templates manquants'}`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.code.toUpperCase()}</span>
                  
                  {/* Indicateur de statut */}
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      status.hasContactTemplate ? 'bg-green-500' : 'bg-red-500'
                    }`} title="Template notification" />
                    <div className={`w-2 h-2 rounded-full ${
                      status.hasConfirmTemplate ? 'bg-green-500' : 'bg-gray-300'
                    }`} title="Template confirmation" />
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Langue détectée automatiquement: <strong>{getCurrentLanguage()}</strong>
          {selectedLanguage && selectedLanguage !== getCurrentLanguage() && (
            <span className="ml-2 text-blue-600">
              (Override: {selectedLanguage})
            </span>
          )}
        </p>
      </div>

      {/* Status des templates */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Configuration pour {activeLanguages.find(l => l.id === currentLanguage)?.name}
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Template notification:</span>
            {getLanguageStatus(currentLanguage).hasContactTemplate ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Template confirmation:</span>
            {getLanguageStatus(currentLanguage).hasConfirmTemplate ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-xs text-gray-500">(optionnel)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bouton d'envoi */}
      <button
        onClick={handleSendEmail}
        disabled={isLoading || !getLanguageStatus(currentLanguage).hasContactTemplate}
        className={`
          w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all
          ${isLoading || !getLanguageStatus(currentLanguage).hasContactTemplate
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
          }
        `}
      >
        <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        <span>
          {isLoading 
            ? `Envoi en cours (${currentLanguage})...` 
            : `Envoyer email (${currentLanguage})`
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
              {result.success ? 'Email envoyé avec succès' : 'Erreur lors de l\'envoi'}
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h5 className="text-sm font-medium text-blue-900 mb-1">💡 Fonctionnement</h5>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• La langue est détectée automatiquement depuis l'URL ou le navigateur</p>
          <p>• Vous pouvez forcer une langue spécifique avec le sélecteur</p>
          <p>• Les templates email appropriés sont sélectionnés automatiquement</p>
          <p>• Le formatage des dates s'adapte à la langue choisie</p>
        </div>
      </div>
    </div>
  );
};

export default MultilingualEmailSender;
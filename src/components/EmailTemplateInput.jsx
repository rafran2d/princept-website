import React, { useState } from 'react';
import { ChevronDown, Globe, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContextDB';

const EmailTemplateInput = ({ 
  label, 
  value = {}, 
  onChange, 
  placeholder = '',
  helpText = '',
  className = '',
  ...props 
}) => {
  const { getActiveLanguages, currentAdminLanguage, setAdminLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const activeLanguages = getActiveLanguages();
  const currentLang = activeLanguages.find(lang => lang.id === currentAdminLanguage) || activeLanguages[0];

  // Gérer le changement de valeur pour la langue courante
  const handleInputChange = (e) => {
    const newValue = {
      ...value,
      [currentAdminLanguage]: e.target.value
    };
    onChange(newValue);
  };

  // Changer de langue
  const handleLanguageChange = (languageId) => {
    setAdminLanguage(languageId);
    setIsDropdownOpen(false);
  };

  // Vérifier si une langue a du contenu
  const hasContent = (langId) => {
    return value[langId] && value[langId].trim() !== '';
  };

  // Obtenir le statut de remplissage
  const getCompletionStatus = () => {
    const filledLanguages = activeLanguages.filter(lang => hasContent(lang.id)).length;
    return {
      filled: filledLanguages,
      total: activeLanguages.length,
      percentage: Math.round((filledLanguages / activeLanguages.length) * 100)
    };
  };

  const completion = getCompletionStatus();

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm font-semibold admin-text-primary">
            <Mail size={16} className="admin-text-muted" />
            <span>{label}</span>
          </label>
          <div className="flex items-center space-x-2 text-xs admin-text-muted">
            <div className="flex space-x-1">
              {activeLanguages.map(lang => (
                <div
                  key={lang.id}
                  className={`w-2 h-2 rounded-full ${
                    hasContent(lang.id) ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  title={`${lang.name}: ${hasContent(lang.id) ? 'Template configuré' : 'Template manquant'}`}
                />
              ))}
            </div>
            <span>{completion.filled}/{completion.total}</span>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        {/* Input principal pour Template ID */}
        <div className="flex-1">
          <input
            type="text"
            value={value[currentAdminLanguage] || ''}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full admin-input rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            {...props}
          />
          {helpText && (
            <p className="text-xs admin-text-muted mt-1">{helpText}</p>
          )}
        </div>

        {/* Sélecteur de langue avec drapeaux */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 admin-button-secondary px-4 py-3 rounded-lg hover:shadow-md transition-all duration-200 min-w-[120px]"
          >
            <span className="text-lg">{getCorrectFlag(currentLang?.flag, currentLang?.code)}</span>
            <span className="text-sm font-medium admin-text-primary">{currentLang?.code.toUpperCase()}</span>
            <ChevronDown size={16} className={`admin-text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 admin-card rounded-lg shadow-xl border z-20 min-w-[200px] overflow-hidden">
                <div className="p-2 border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  <div className="flex items-center space-x-2 text-xs admin-text-muted">
                    <Globe size={14} />
                    <span>Template par langue</span>
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {activeLanguages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:admin-bg-tertiary transition-colors text-left ${
                        lang.id === currentAdminLanguage ? 'admin-bg-tertiary' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getCorrectFlag(lang.flag, lang.code)}</span>
                        <div>
                          <div className="text-sm font-medium admin-text-primary">{lang.name}</div>
                          <div className="text-xs admin-text-muted">{lang.code.toUpperCase()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Indicateur de template configuré */}
                        <div className={`w-2 h-2 rounded-full ${
                          hasContent(lang.id) ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        
                        {/* Indicateur langue courante */}
                        {lang.id === currentAdminLanguage && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        
                        {/* Badge langue par défaut */}
                        {lang.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            Défaut
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Barre de progression de completion avec indicateur EmailJS */}
      {activeLanguages.length > 1 && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>
          <span className="text-xs admin-text-muted font-medium">
            {completion.percentage}% configuré
          </span>
        </div>
      )}

      {/* Aperçu du template actuel */}
      {value[currentAdminLanguage] && value[currentAdminLanguage].trim() && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
          <h5 className="text-xs font-medium text-green-900 mb-1">✅ Template configuré pour {currentLang?.name}</h5>
          <div className="text-xs text-green-800 font-mono bg-white p-2 rounded border">
            {value[currentAdminLanguage].length > 100 
              ? `${value[currentAdminLanguage].substring(0, 100)}...` 
              : value[currentAdminLanguage]
            }
          </div>
        </div>
      )}

      {/* Guide de configuration dynamique */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
        <h5 className="text-xs font-medium text-blue-900 mb-1">💡 Configuration simplifiée</h5>
        <div className="text-xs text-blue-800 space-y-1">
          <p>• <strong>Template unique :</strong> Un seul template EmailJS, contenu personnalisé ici</p>
          <p>• <strong>Sélection automatique :</strong> Le bon contenu est choisi selon la langue du visiteur</p>
          <p>• <strong>Variables disponibles :</strong> <code className="bg-blue-100 px-1 rounded">{`{{name}}`}</code>, <code className="bg-blue-100 px-1 rounded">{`{{email}}`}</code>, <code className="bg-blue-100 px-1 rounded">{`{{message}}`}</code>, <code className="bg-blue-100 px-1 rounded">{`{{siteName}}`}</code>, <code className="bg-blue-100 px-1 rounded">{`{{date}}`}</code></p>
          
          {/* Status des autres langues */}
          <div className="mt-2 pt-2 border-t border-blue-200">
            <p className="font-medium mb-1">Status par langue :</p>
            <div className="grid grid-cols-2 gap-1">
              {activeLanguages.map(lang => (
                <div key={lang.id} className="flex items-center space-x-1">
                  <span className="text-xs">{lang.flag}</span>
                  <span className="text-xs font-medium">{lang.code.toUpperCase()}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    hasContent(lang.id) ? 'bg-green-500' : 'bg-red-300'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateInput;
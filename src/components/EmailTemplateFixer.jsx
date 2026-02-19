import React, { useState } from 'react';
import { Wrench, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useLanguage } from '../contexts/LanguageContextDB';

const EmailTemplateFixer = () => {
  const { settings, updateSettings } = useSiteSettings();
  const languageContext = useLanguage();
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState(null);

  const activeLanguages = languageContext.getActiveLanguages();

  const defaultTemplates = {
    contact: {
      subject: {
        fr: 'Nouveau message de contact - {{subject}}',
        en: 'New contact message - {{subject}}',
        es: 'Nuevo mensaje de contacto - {{subject}}'
      },
      template: {
        fr: `Bonjour,

Vous avez reçu un nouveau message de contact :

Nom : {{name}}
Email : {{email}}
Téléphone : {{phone}}
Sujet : {{subject}}

Message :
{{message}}

---
Cordialement,
L'équipe {{siteName}}`,
        en: `Hello,

You have received a new contact message:

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

---
Best regards,
The {{siteName}} Team`,
        es: `Hola,

Has recibido un nuevo mensaje de contacto:

Nombre: {{name}}
Email: {{email}}
Teléfono: {{phone}}
Asunto: {{subject}}

Mensaje:
{{message}}

---
Saludos cordiales,
El equipo de {{siteName}}`
      }
    },
    contactConfirmation: {
      subject: {
        fr: 'Merci pour votre message - {{siteName}}',
        en: 'Thank you for your message - {{siteName}}',
        es: 'Gracias por su mensaje - {{siteName}}'
      },
      template: {
        fr: `Bonjour {{name}},

Merci pour votre message concernant "{{subject}}".

Nous avons bien reçu votre demande et vous répondrons dans les plus brefs délais.

---
Cordialement,
L'équipe {{siteName}}`,
        en: `Hello {{name}},

Thank you for your message regarding "{{subject}}".

We have received your request and will respond to you as soon as possible.

---
Best regards,
The {{siteName}} Team`,
        es: `Hola {{name}},

Gracias por su mensaje sobre "{{subject}}".

Hemos recibido su solicitud y le responderemos lo antes posible.

---
Saludos cordiales,
El equipo de {{siteName}}`
      }
    }
  };

  const analyzeCurrentTemplates = () => {
    const analysis = {
      issues: [],
      fixes: [],
      currentStructure: {}
    };

    const emailConfig = settings.emailConfig;
    
    if (!emailConfig) {
      analysis.issues.push('Configuration email manquante');
      return analysis;
    }

    // Analyser les templates de contact
    if (!emailConfig.templates?.contact) {
      analysis.issues.push('Templates de contact manquants');
      analysis.fixes.push('Créer les templates de contact');
    } else {
      const contact = emailConfig.templates.contact;
      analysis.currentStructure.contact = {
        enabled: contact.enabled,
        subjectType: typeof contact.subject,
        templateType: typeof contact.template
      };

      // Vérifier si c'est l'ancien format (string)
      if (typeof contact.subject === 'string') {
        analysis.issues.push('Sujet contact en ancien format (string)');
        analysis.fixes.push('Convertir sujet contact vers format multilingue');
      }

      if (typeof contact.template === 'string') {
        analysis.issues.push('Template contact en ancien format (string)');
        analysis.fixes.push('Convertir template contact vers format multilingue');
      }

      // Vérifier si les langues sont présentes
      if (typeof contact.template === 'object') {
        activeLanguages.forEach(lang => {
          if (!contact.template[lang.id]) {
            analysis.issues.push(`Template contact manquant pour ${lang.name} (${lang.id})`);
            analysis.fixes.push(`Ajouter template contact pour ${lang.name}`);
          }
        });
      }
    }

    return analysis;
  };

  const fixTemplates = async () => {
    setIsFixing(true);
    setFixResult(null);

    try {
      const currentConfig = { ...settings };
      
      // Initialiser la configuration email si elle n'existe pas
      if (!currentConfig.emailConfig) {
        currentConfig.emailConfig = {};
      }
      
      if (!currentConfig.emailConfig.templates) {
        currentConfig.emailConfig.templates = {};
      }

      let fixesApplied = [];

      // Fixer les templates de contact
      if (!currentConfig.emailConfig.templates.contact) {
        currentConfig.emailConfig.templates.contact = {
          enabled: true,
          subject: {},
          template: {}
        };
        fixesApplied.push('Création de la structure templates contact');
      }

      const contact = currentConfig.emailConfig.templates.contact;

      // Convertir l'ancien format vers le nouveau
      if (typeof contact.subject === 'string') {
        const oldSubject = contact.subject;
        contact.subject = {};
        activeLanguages.forEach(lang => {
          contact.subject[lang.id] = oldSubject || defaultTemplates.contact.subject[lang.id];
        });
        fixesApplied.push('Conversion sujet contact vers format multilingue');
      }

      if (typeof contact.template === 'string') {
        const oldTemplate = contact.template;
        contact.template = {};
        activeLanguages.forEach(lang => {
          contact.template[lang.id] = oldTemplate || defaultTemplates.contact.template[lang.id];
        });
        fixesApplied.push('Conversion template contact vers format multilingue');
      }

      // Ajouter les langues manquantes
      if (typeof contact.subject === 'object') {
        activeLanguages.forEach(lang => {
          if (!contact.subject[lang.id]) {
            contact.subject[lang.id] = defaultTemplates.contact.subject[lang.id];
            fixesApplied.push(`Ajout sujet contact pour ${lang.name}`);
          }
        });
      }

      if (typeof contact.template === 'object') {
        activeLanguages.forEach(lang => {
          if (!contact.template[lang.id]) {
            contact.template[lang.id] = defaultTemplates.contact.template[lang.id];
            fixesApplied.push(`Ajout template contact pour ${lang.name}`);
          }
        });
      }

      // Faire pareil pour la confirmation
      if (!currentConfig.emailConfig.templates.contactConfirmation) {
        currentConfig.emailConfig.templates.contactConfirmation = {
          enabled: false,
          subject: {},
          template: {}
        };
        
        activeLanguages.forEach(lang => {
          currentConfig.emailConfig.templates.contactConfirmation.subject[lang.id] = defaultTemplates.contactConfirmation.subject[lang.id];
          currentConfig.emailConfig.templates.contactConfirmation.template[lang.id] = defaultTemplates.contactConfirmation.template[lang.id];
        });
        
        fixesApplied.push('Création templates de confirmation');
      }

      // Sauvegarder
      await updateSettings(currentConfig);

      setFixResult({
        success: true,
        fixesApplied: fixesApplied,
        message: `${fixesApplied.length} corrections appliquées avec succès`
      });

    } catch (error) {
      setFixResult({
        success: false,
        error: error.message,
        message: 'Erreur lors de la correction'
      });
    } finally {
      setIsFixing(false);
    }
  };

  const analysis = analyzeCurrentTemplates();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Correcteur de Templates Email</h2>
              <p className="text-gray-600">Diagnostiquer et corriger automatiquement les problèmes</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Analyse */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problèmes */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">
                  Problèmes détectés ({analysis.issues.length})
                </span>
              </div>
              {analysis.issues.length > 0 ? (
                <ul className="text-sm text-red-700 space-y-1">
                  {analysis.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-700">✅ Aucun problème détecté</p>
              )}
            </div>

            {/* Corrections */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Wrench className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Corrections proposées ({analysis.fixes.length})
                </span>
              </div>
              {analysis.fixes.length > 0 ? (
                <ul className="text-sm text-blue-700 space-y-1">
                  {analysis.fixes.map((fix, index) => (
                    <li key={index}>• {fix}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-700">✅ Aucune correction nécessaire</p>
              )}
            </div>
          </div>

          {/* Structure actuelle */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Structure actuelle</h4>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto">
              {JSON.stringify(analysis.currentStructure, null, 2)}
            </pre>
          </div>

          {/* Bouton de correction */}
          {analysis.issues.length > 0 && (
            <button
              onClick={fixTemplates}
              disabled={isFixing}
              className={`
                w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
                ${isFixing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                }
              `}
            >
              <Save className={`w-5 h-5 ${isFixing ? 'animate-pulse' : ''}`} />
              <span>
                {isFixing ? 'Correction en cours...' : 'Corriger automatiquement'}
              </span>
            </button>
          )}

          {/* Résultat */}
          {fixResult && (
            <div className={`
              p-4 rounded-lg border
              ${fixResult.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
              }
            `}>
              <div className="flex items-center space-x-2 mb-2">
                {fixResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{fixResult.message}</span>
              </div>
              
              {fixResult.success && fixResult.fixesApplied && (
                <div className="text-sm space-y-1">
                  <p className="font-medium">Corrections appliquées :</p>
                  <ul className="ml-4">
                    {fixResult.fixesApplied.map((fix, index) => (
                      <li key={index}>• {fix}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {!fixResult.success && (
                <div className="text-sm mt-1">
                  {fixResult.error}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-blue-900 mb-2">💡 Instructions</h5>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. <strong>Analyser</strong> automatiquement les problèmes de configuration</p>
              <p>2. <strong>Corriger</strong> en un clic les problèmes détectés</p>
              <p>3. <strong>Tester</strong> l'envoi d'email après correction</p>
              <p>4. <strong>Personnaliser</strong> les templates dans l'interface admin si besoin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateFixer;
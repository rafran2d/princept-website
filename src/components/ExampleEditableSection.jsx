import React, { useState } from 'react';
import { EditableTitle, EditableSubtitle, EditableDescription, EditableButton } from './EditableText';
import { Edit3, Save, X } from 'lucide-react';

// Exemple d'utilisation du système d'édition inline
const ExampleEditableSection = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Données d'exemple - en vrai ces données viennent du store
  const sectionData = {
    id: 'example-section',
    title: {
      fr: 'Titre de la section',
      en: 'Section Title'
    },
    subtitle: {
      fr: 'Sous-titre explicatif',
      en: 'Explanatory subtitle'
    },
    description: {
      fr: 'Ceci est une description détaillée de la section. Vous pouvez cliquer dessus pour l\'éditer en mode inline.',
      en: 'This is a detailed description of the section. You can click on it to edit it inline.'
    },
    buttonText: {
      fr: 'Bouton d\'action',
      en: 'Action Button'
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">
          Exemple d'édition inline
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isEditing
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Mode lecture
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Mode édition
            </>
          )}
        </button>
      </div>

      {/* Section content */}
      <div className="space-y-6">
        {/* Titre principal */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Titre principal {isEditing && '(cliquez pour éditer)'}
          </label>
          {isEditing ? (
            <EditableTitle
              sectionId={sectionData.id}
              fieldPath="title"
              className="text-3xl font-bold text-gray-900"
              placeholder="Titre de la section"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">
              {typeof sectionData.title === 'object'
                ? sectionData.title.fr || sectionData.title.en
                : sectionData.title
              }
            </h1>
          )}
        </div>

        {/* Sous-titre */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Sous-titre {isEditing && '(cliquez pour éditer)'}
          </label>
          {isEditing ? (
            <EditableSubtitle
              sectionId={sectionData.id}
              fieldPath="subtitle"
              className="text-xl text-gray-700"
              placeholder="Sous-titre de la section"
            />
          ) : (
            <h2 className="text-xl text-gray-700">
              {typeof sectionData.subtitle === 'object'
                ? sectionData.subtitle.fr || sectionData.subtitle.en
                : sectionData.subtitle
              }
            </h2>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Description {isEditing && '(cliquez pour éditer - Ctrl+Entrée pour sauver)'}
          </label>
          {isEditing ? (
            <EditableDescription
              sectionId={sectionData.id}
              fieldPath="description"
              className="text-gray-600 leading-relaxed"
              placeholder="Description détaillée de la section"
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {typeof sectionData.description === 'object'
                ? sectionData.description.fr || sectionData.description.en
                : sectionData.description
              }
            </p>
          )}
        </div>

        {/* Bouton */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Texte du bouton {isEditing && '(cliquez pour éditer)'}
          </label>
          <div className="inline-block">
            {isEditing ? (
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                <EditableButton
                  sectionId={sectionData.id}
                  fieldPath="buttonText"
                  className="bg-transparent border-none text-white"
                  placeholder="Texte du bouton"
                  style={{ background: 'transparent', border: 'none', color: 'white' }}
                />
              </div>
            ) : (
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                {typeof sectionData.buttonText === 'object'
                  ? sectionData.buttonText.fr || sectionData.buttonText.en
                  : sectionData.buttonText
                }
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Instructions :</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Activez le "Mode édition" pour pouvoir modifier les textes</li>
          <li>• Cliquez sur n'importe quel texte pour l'éditer directement</li>
          <li>• Les modifications sont sauvegardées automatiquement en base de données</li>
          <li>• Le système gère automatiquement les langues multiples</li>
          <li>• Utilisez Entrée pour sauver (Ctrl+Entrée pour les textes multilignes)</li>
          <li>• Utilisez Échap pour annuler les modifications</li>
        </ul>
      </div>

      {/* Debug info */}
      {isEditing && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Données actuelles :</h4>
          <pre className="text-xs text-gray-700 overflow-auto">
            {JSON.stringify(sectionData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ExampleEditableSection;
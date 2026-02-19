import React, { useState } from 'react';
import { Plus, Eye, Palette, Code } from 'lucide-react';
import { getThemedComponents, hasThemedComponents } from '../../data/themedComponents';
import { predefinedThemes } from '../../data/themes';

const ThemedSectionSelector = ({ onAddSection }) => {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('activeTheme') || 'default';
  });
  const [showModal, setShowModal] = useState(false);

  // Obtenir les composants thématiques pour le thème sélectionné
  const themedComponents = getThemedComponents(selectedTheme);
  const currentTheme = predefinedThemes[selectedTheme];

  // Sections standard
  const standardSections = [
    { id: 'hero', name: 'Hero Section', description: 'Section d\'accueil avec titre et appel à l\'action' },
    { id: 'about', name: 'About Section', description: 'Section à propos avec texte et image' },
    { id: 'services', name: 'Services Section', description: 'Grille de services avec icônes' },
    { id: 'gallery', name: 'Gallery Section', description: 'Galerie d\'images responsive' },
    { id: 'testimonials', name: 'Testimonials Section', description: 'Témoignages clients' },
    { id: 'contact', name: 'Contact Section', description: 'Formulaire de contact' },
    { id: 'cta', name: 'Call to Action', description: 'Section d\'appel à l\'action' }
  ];

  const handleAddThemedSection = (sectionType) => {
    onAddSection({
      type: sectionType,
      themed: true,
      title: themedComponents.sections.find(s => s.id === sectionType)?.name || sectionType,
      useGlobalStyles: true
    });
    setShowModal(false);
  };

  const handleAddStandardSection = (sectionType) => {
    onAddSection({
      type: sectionType,
      themed: false,
      title: standardSections.find(s => s.id === sectionType)?.name || sectionType,
      useGlobalStyles: true
    });
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Plus size={20} />
        Ajouter une section
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Ajouter une section</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Sélecteur de thème */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème actuel
                </label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(predefinedThemes).map(theme => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name} {hasThemedComponents(theme.id) ? '✨' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  ✨ = Sections thématiques authentiques disponibles
                </p>
              </div>
            </div>

            <div className="p-6">
              {/* Sections thématiques */}
              {themedComponents.sections && themedComponents.sections.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette size={20} className="text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sections authentiques {currentTheme.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Ces sections reproduisent fidèlement le design et la structure de {currentTheme.name}.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {themedComponents.sections.map((section) => (
                      <div 
                        key={section.id}
                        className="border rounded-lg p-4 hover:border-purple-300 transition-colors"
                        style={{ 
                          borderLeft: `4px solid ${currentTheme.colors.primary}` 
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{section.name}</h4>
                          <div className="flex gap-2">
                            {section.component && (
                              <button
                                onClick={() => handleAddThemedSection(section.id)}
                                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {section.description}
                        </p>
                        {!section.component && (
                          <div className="flex items-center gap-2 text-orange-600 text-sm">
                            <Code size={14} />
                            En développement
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections standard */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Eye size={20} className="text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sections standard
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Sections génériques qui s'adaptent à tous les thèmes avec les variables CSS globales.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {standardSections.map((section) => (
                    <div 
                      key={section.id}
                      className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{section.name}</h4>
                        <button
                          onClick={() => handleAddStandardSection(section.id)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemedSectionSelector;
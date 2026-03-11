import React, { useState, useEffect } from 'react';
import { Edit3, Eye, Settings, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContextDB';

// Hook avec fallback sécurisé
const useSafeLanguage = () => {
  try {
    return useLanguage();
  } catch (error) {
    return {
      currentLanguage: 'fr',
      getActiveLanguages: () => [{ id: 'fr', name: 'Français' }]
    };
  }
};

const FloatingEditWidget = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  const { currentLanguage, getActiveLanguages } = useSafeLanguage();

  // Afficher le widget seulement si connecté
  useEffect(() => {
    setIsVisible(isAuthenticated);
  }, [isAuthenticated]);

  // Récupérer la langue courante
  const currentLang = getActiveLanguages().find(l => l.id === currentLanguage);

  if (!isVisible) {
    return null;
  }

  const handleToggleEdit = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);

    // Émettre un événement global
    window.dispatchEvent(new CustomEvent('cms:editModeChanged', {
      detail: { isEditMode: newEditMode }
    }));
  };

  const goToAdmin = () => {
    window.open('/admin', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Widget principal */}
      <div className={`bg-white rounded-lg shadow-xl border transition-all duration-300 ${
        isExpanded ? 'p-4 min-w-[280px]' : 'p-3'
      }`}>
        {!isExpanded ? (
          /* Version compacte */
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleEdit}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                isEditMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title={isEditMode ? 'Désactiver le mode édition' : 'Activer le mode édition'}
            >
              {isEditMode ? (
                <Eye className="w-4 h-4" />
              ) : (
                <Edit3 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Afficher plus d'options"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Version étendue */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">CMS Controls</h3>
                <p className="text-xs text-gray-500">
                  Langue: {currentLang?.name || 'Français'}
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Contrôles */}
            <div className="space-y-3">
              {/* Toggle édition */}
              <button
                onClick={handleToggleEdit}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                  isEditMode
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditMode ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Mode lecture
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    Mode édition
                  </>
                )}
              </button>

              {/* Bouton admin */}
              <button
                onClick={goToAdmin}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                <Settings className="w-4 h-4" />
                Administration
              </button>
            </div>

            {/* Instructions en mode édition */}
            {isEditMode && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-900 text-sm mb-1">
                  Mode édition activé
                </div>
                <div className="text-blue-700 text-xs">
                  Cliquez sur les textes pour les éditer.
                  <br />
                  • Entrée = Sauvegarder
                  <br />
                  • Échap = Annuler
                </div>
              </div>
            )}

            {/* Statut */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${
                  isEditMode ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                }`}></div>
                {isEditMode ? 'Édition active' : 'Mode lecture'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Badge de notification */}
      {isEditMode && (
        <div className="absolute -top-2 -left-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default FloatingEditWidget;
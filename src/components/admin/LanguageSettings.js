import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Settings, 
  Eye, 
  EyeOff, 
  Star, 
  GripVertical,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';

const LanguageSettings = () => {
  const { 
    getAllLanguages, 
    getActiveLanguages,
    getDefaultLanguage,
    toggleLanguage, 
    setDefaultLanguage,
    reorderLanguages 
  } = useLanguage();
  
  const { message, showSuccess, showError, hideMessage } = useFlashMessage();
  const [draggedItem, setDraggedItem] = useState(null);
  
  const allLanguages = getAllLanguages();
  const activeLanguages = getActiveLanguages();
  const defaultLanguage = getDefaultLanguage();

  // Activer/désactiver une langue
  const handleToggleLanguage = (languageId) => {
    const language = allLanguages.find(l => l.id === languageId);
    
    // Empêcher la désactivation de la langue par défaut
    if (language.isDefault && language.isActive) {
      showError('Impossible de désactiver la langue par défaut');
      return;
    }
    
    toggleLanguage(languageId);
    showSuccess(`Langue ${language.name} ${language.isActive ? 'désactivée' : 'activée'}`);
  };

  // Définir comme langue par défaut
  const handleSetDefault = (languageId) => {
    const language = allLanguages.find(l => l.id === languageId);
    setDefaultLanguage(languageId);
    showSuccess(`${language.name} défini comme langue par défaut`);
  };

  // Gestion du drag & drop
  const handleDragStart = (e, languageId) => {
    setDraggedItem(languageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetLanguageId) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetLanguageId) {
      setDraggedItem(null);
      return;
    }

    const currentOrder = allLanguages.map(lang => lang.id);
    const draggedIndex = currentOrder.indexOf(draggedItem);
    const targetIndex = currentOrder.indexOf(targetLanguageId);
    
    // Réorganiser l'array
    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    reorderLanguages(newOrder);
    setDraggedItem(null);
    showSuccess('Ordre des langues mis à jour');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Flash Message */}
      <FlashMessage message={message} onClose={hideMessage} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg">
            <Globe size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold admin-text-primary">
              Gestion des Langues
            </h1>
            <p className="admin-text-secondary mt-1 text-lg">
              Configurez les langues de votre site web
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{activeLanguages.length}</div>
            <div className="text-sm admin-text-muted font-medium">Actives</div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{allLanguages.length}</div>
              <div className="text-sm admin-text-secondary font-medium">Total langues</div>
            </div>
          </div>
        </div>
        
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{activeLanguages.length}</div>
              <div className="text-sm admin-text-secondary font-medium">Langues actives</div>
            </div>
          </div>
        </div>
        
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">{defaultLanguage?.name}</div>
              <div className="text-sm admin-text-secondary font-medium">Langue par défaut</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="admin-card rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold admin-text-primary mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Instructions
        </h3>
        <ul className="space-y-2 admin-text-secondary">
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Glissez-déposez les langues pour changer leur ordre d'affichage</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Activez/désactivez les langues avec le bouton œil</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
            <span>Cliquez sur l'étoile pour définir la langue par défaut</span>
          </li>
        </ul>
      </div>

      {/* Liste des langues */}
      <div className="admin-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          <h2 className="text-xl font-bold admin-text-primary">Langues disponibles</h2>
          <p className="admin-text-secondary mt-1">
            Gérez l'ordre et l'activation des langues de votre site
          </p>
        </div>
        
        <div className="divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'var(--admin-border)' }}>
          {allLanguages.map((language, index) => (
            <div
              key={language.id}
              className={`flex items-center justify-between p-6 transition-all duration-200 ${
                draggedItem === language.id ? 'bg-blue-50' : 'hover:admin-bg-tertiary'
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, language.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, language.id)}
            >
              <div className="flex items-center space-x-4 flex-1">
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing p-2 rounded-lg hover:admin-bg-tertiary">
                  <GripVertical size={20} className="admin-text-muted" />
                </div>
                
                {/* Ordre */}
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-bold admin-text-secondary">
                  {index + 1}
                </div>

                {/* Flag et info */}
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-3xl">{language.flag}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold admin-text-primary">{language.name}</h3>
                      <span className="text-sm admin-text-muted bg-gray-100 px-2 py-1 rounded">
                        {language.code.toUpperCase()}
                      </span>
                      {language.isDefault && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium flex items-center">
                          <Star size={12} className="mr-1" />
                          Défaut
                        </span>
                      )}
                    </div>
                    <p className="text-sm admin-text-muted mt-1">
                      {language.isActive ? 'Langue active' : 'Langue désactivée'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {/* Bouton définir par défaut */}
                <button
                  onClick={() => handleSetDefault(language.id)}
                  disabled={language.isDefault}
                  className={`p-2 rounded-lg transition-colors ${
                    language.isDefault
                      ? 'text-yellow-600 bg-yellow-100 cursor-not-allowed'
                      : 'admin-text-muted hover:text-yellow-600 hover:bg-yellow-50'
                  }`}
                  title={language.isDefault ? 'Langue par défaut' : 'Définir comme défaut'}
                >
                  <Star size={18} className={language.isDefault ? 'fill-current' : ''} />
                </button>

                {/* Bouton activer/désactiver */}
                <button
                  onClick={() => handleToggleLanguage(language.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    language.isActive
                      ? 'text-green-600 hover:bg-green-50'
                      : 'admin-text-muted hover:text-green-600 hover:bg-green-50'
                  }`}
                  title={language.isActive ? 'Désactiver' : 'Activer'}
                >
                  {language.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note importante */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="p-1 bg-yellow-100 rounded-full mt-0.5">
            <Settings className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">Note importante</p>
            <p className="text-sm text-yellow-700 mt-1">
              La langue par défaut ne peut pas être désactivée. 
              Elle sera utilisée comme fallback pour tout contenu non traduit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
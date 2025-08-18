import React, { useState } from 'react';
import { Plus, Trash2, Globe, Flag, Check, X, Edit3, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const LanguageManagement = () => {
  const { 
    getAllLanguages, 
    toggleLanguage, 
    setDefaultLanguage,
    addLanguage,
    updateLanguage,
    removeLanguage
  } = useLanguage();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, language: null });
  const [newLanguage, setNewLanguage] = useState({
    id: '',
    name: '',
    code: '',
    flag: '',
    isActive: true,
    isDefault: false,
    isRTL: false
  });

  const allLanguages = getAllLanguages();

  // Liste des drapeaux couramment utilisés
  const commonFlags = [
    '🇸🇦', '🇦🇪', '🇪🇬', '🇲🇦', '🇹🇳', '🇯🇴', '🇱🇧', '🇮🇶', '🇰🇼', '🇴🇲',
    '🇺🇸', '🇬🇧', '🇫🇷', '🇪🇸', '🇮🇹', '🇩🇪', '🇷🇺', '🇨🇳', '🇯🇵', '🇰🇷',
    '🇧🇷', '🇵🇹', '🇳🇱', '🇸🇪', '🇳🇴', '🇩🇰', '🇫🇮', '🇵🇱', '🇹🇷', '🇬🇷'
  ];

  const handleAddLanguage = () => {
    if (!newLanguage.id || !newLanguage.name || !newLanguage.code) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Vérifier si le code existe déjà
    if (allLanguages.some(lang => lang.code === newLanguage.code)) {
      alert('Ce code de langue existe déjà');
      return;
    }

    // Utiliser la fonction du contexte
    addLanguage(newLanguage);
    
    // Réinitialiser le formulaire
    resetForm();
  };

  const handleEditLanguage = (language) => {
    setEditingLanguage({
      ...language
    });
  };

  const handleSaveLanguage = () => {
    if (!editingLanguage.name || !editingLanguage.code) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Vérifier si le code existe déjà (sauf pour la langue en cours d'édition)
    if (allLanguages.some(lang => lang.code === editingLanguage.code && lang.id !== editingLanguage.id)) {
      alert('Ce code de langue existe déjà');
      return;
    }

    // Utiliser la fonction du contexte pour mettre à jour
    updateLanguage(editingLanguage.id, {
      name: editingLanguage.name,
      code: editingLanguage.code,
      flag: editingLanguage.flag,
      isRTL: editingLanguage.isRTL
      // isActive et isDefault ne sont pas modifiables via l'édition
    });
    
    setEditingLanguage(null);
  };

  const handleCancelEdit = () => {
    setEditingLanguage(null);
  };

  const handleDeleteLanguage = (language) => {
    setDeleteModal({ isOpen: true, language });
  };

  const confirmDelete = () => {
    if (deleteModal.language) {
      removeLanguage(deleteModal.language.id);
      setDeleteModal({ isOpen: false, language: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, language: null });
  };

  const resetForm = () => {
    setNewLanguage({
      id: '',
      name: '',
      code: '',
      flag: '',
      isActive: true,
      isDefault: false,
      isRTL: false
    });
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestion des langues</h2>
            <p className="text-sm text-gray-600">Ajouter, modifier et gérer les langues du site</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une langue</span>
        </button>
      </div>

      {/* Liste des langues existantes */}
      <div className="space-y-3 mb-6">
        {allLanguages.map((language) => (
          <div
            key={language.id}
            className={`rounded-lg border ${
              language.isDefault ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            {editingLanguage && editingLanguage.id === language.id ? (
              /* Mode édition */
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la langue
                    </label>
                    <input
                      type="text"
                      value={editingLanguage.name}
                      onChange={(e) => setEditingLanguage({...editingLanguage, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code langue (ISO)
                    </label>
                    <input
                      type="text"
                      value={editingLanguage.code}
                      onChange={(e) => setEditingLanguage({...editingLanguage, code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drapeau
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editingLanguage.flag}
                        onChange={(e) => setEditingLanguage({...editingLanguage, flag: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="text-2xl">{editingLanguage.flag}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingLanguage.isRTL}
                      onChange={(e) => setEditingLanguage({...editingLanguage, isRTL: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Langue RTL (droite vers gauche)</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveLanguage}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </button>
                  
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Annuler</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Mode affichage */
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{language.flag}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{language.name}</h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded uppercase">
                        {language.code}
                      </span>
                      {language.isDefault && (
                        <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
                          Par défaut
                        </span>
                      )}
                      {language.isRTL && (
                        <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">
                          RTL
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Code: {language.id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Toggle Active */}
                  <button
                    onClick={() => toggleLanguage(language.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      language.isActive
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    title={language.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {language.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>

                  {/* Set Default */}
                  {!language.isDefault && (
                    <button
                      onClick={() => setDefaultLanguage(language.id)}
                      className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                      title="Définir par défaut"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => handleEditLanguage(language)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  {!language.isDefault && (
                    <button
                      onClick={() => handleDeleteLanguage(language)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une nouvelle langue</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de la langue *
              </label>
              <input
                type="text"
                value={newLanguage.id}
                onChange={(e) => setNewLanguage({...newLanguage, id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ar, zh, ja..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code langue (ISO) *
              </label>
              <input
                type="text"
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({...newLanguage, code: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ar, zh, ja..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la langue *
              </label>
              <input
                type="text"
                value={newLanguage.name}
                onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="العربية, 中文, 日本語..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drapeau
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newLanguage.flag}
                  onChange={(e) => setNewLanguage({...newLanguage, flag: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="🇸🇦"
                />
                <div className="text-2xl">{newLanguage.flag}</div>
              </div>
            </div>
          </div>

          {/* Sélection rapide de drapeaux */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélection rapide de drapeaux
            </label>
            <div className="grid grid-cols-10 gap-2">
              {commonFlags.map((flag) => (
                <button
                  key={flag}
                  onClick={() => setNewLanguage({...newLanguage, flag})}
                  className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={flag}
                >
                  {flag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newLanguage.isActive}
                onChange={(e) => setNewLanguage({...newLanguage, isActive: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Activer cette langue</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newLanguage.isRTL}
                onChange={(e) => setNewLanguage({...newLanguage, isRTL: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Langue RTL (droite vers gauche)</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddLanguage}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Ajouter la langue</span>
            </button>
            
            <button
              onClick={resetForm}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Annuler</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Supprimer la langue"
        subtitle="Cette action est irréversible"
        message="Êtes-vous sûr de vouloir supprimer la langue"
        itemName={deleteModal.language?.name}
        warningMessage="Cette action supprimera définitivement la langue et toutes ses traductions associées. Vous ne pourrez pas annuler cette opération."
        confirmButtonText="Supprimer la langue"
      />
    </div>
  );
};

export default LanguageManagement;
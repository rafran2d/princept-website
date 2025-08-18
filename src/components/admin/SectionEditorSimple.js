import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, Trash2, Palette } from 'lucide-react';
import { ChromePicker } from 'react-color';
import { v4 as uuidv4 } from 'uuid';
import { useSections } from '../../hooks/useSections';
import SectionRenderer from '../SectionRenderer';
import ImageUpload from '../ImageUpload';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';

const ColorPicker = ({ label, color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium admin-text-secondary mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center space-x-2 w-full px-3 py-2 border rounded-lg hover:admin-bg-tertiary transition-colors"
          style={{ borderColor: 'var(--admin-border)' }}
        >
          <div
            className="w-6 h-6 rounded border"
            style={{ borderColor: 'var(--admin-border)', backgroundColor: color }}
          />
          <span className="text-sm font-mono">{color}</span>
        </button>
        
        {showPicker && (
          <div className="absolute top-full mt-2 z-10">
            <div
              className="fixed inset-0"
              onClick={() => setShowPicker(false)}
            />
            <ChromePicker
              color={color}
              onChange={(colorResult) => onChange(colorResult.hex)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const SectionEditorSimple = () => {
  const { id } = useParams();
  console.log('🚀 SectionEditorSimple - Composant chargé avec ID:', id);
  
  const navigate = useNavigate();
  const { sections, updateSection } = useSections();
  const [section, setSection] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { message, showSuccess, showError, hideMessage } = useFlashMessage();

  useEffect(() => {
    console.log('🔍 SectionEditorSimple Debug:');
    console.log('  - ID recherché:', id);
    console.log('  - Nombre de sections chargées:', sections.length);
    console.log('  - IDs des sections disponibles:', sections.map(s => s.id));
    
    const foundSection = sections.find(s => s.id === id);
    console.log('  - Section trouvée:', foundSection ? 'OUI' : 'NON');
    
    if (foundSection) {
      setSection(foundSection);
      console.log('  - Section définie');
    } else if (sections.length > 0) {
      console.log('  - ❌ Section non trouvée après chargement complet');
      console.log('  - IDs disponibles:', sections.map(s => ({ id: s.id, type: s.type })));
    } else {
      console.log('  - ⏳ Sections pas encore chargées, attente...');
    }
  }, [id, sections, navigate]);

  const handleChange = (field, value) => {
    setSection(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = React.useCallback(() => {
    if (section && hasChanges) {
      updateSection(section.id, section);
      setHasChanges(false);
      showSuccess('Section sauvegardée avec succès !');
    }
  }, [section, hasChanges, updateSection, showSuccess]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!section) {
    // Si les sections sont chargées mais la section n'est pas trouvée
    if (sections.length > 0) {
      return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Section non trouvée</h1>
            <p className="text-gray-600 mb-4">
              La section avec l'ID "{id}" n'existe pas.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Sections disponibles :</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {sections.map(s => (
                  <div key={s.id} className="flex justify-between">
                    <span>{s.type} - {s.title || 'Sans titre'}</span>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">{s.id}</code>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/admin"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à la liste des sections
            </Link>
          </div>
        </div>
      );
    }
    
    // Sinon, afficher le loader
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la section...</p>
          <p className="text-sm text-gray-400 mt-2">ID: {id}</p>
          <p className="text-xs text-gray-400 mt-1">
            Sections chargées: {sections.length}
          </p>
        </div>
      </div>
    );
  }

  const getSectionTypeName = (type) => {
    const names = {
      hero: 'Hero Section',
      about: 'Section À Propos',
      services: 'Section Services',
      contact: 'Section Contact',
      gallery: 'Section Galerie',
      testimonials: 'Section Témoignages',
      cta: 'Call to Action'
    };
    return names[type] || type;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 admin-text-secondary hover:admin-text-primary"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold admin-text-primary">
              {getSectionTypeName(section.type)}
            </h1>
            <p className="admin-text-secondary">
              Modifiez le contenu et l'apparence de cette section
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-green-100 text-green-700' 
                : 'admin-bg-tertiary admin-text-secondary hover:bg-gray-200'
            }`}
          >
            <Eye size={20} />
            <span>Aperçu</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              hasChanges
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 admin-text-muted cursor-not-allowed'
            }`}
          >
            <Save size={20} />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-2">
          <div className="admin-card rounded-lg shadow-sm p-6" style={{ borderColor: 'var(--admin-border)' }}>
            <div className="space-y-6">
              {/* Basic Fields */}
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={section.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Saisissez le titre de la section..."
                />
              </div>

              {section.type === 'hero' && (
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={section.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Saisissez le sous-titre..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">
                  Description
                </label>
                <textarea
                  value={section.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez cette section..."
                />
              </div>

              {/* Section-specific fields */}
              {section.type === 'hero' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium admin-text-secondary mb-2">
                        Texte du bouton principal
                      </label>
                      <input
                        type="text"
                        value={section.buttonText || ''}
                        onChange={(e) => handleChange('buttonText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Texte du bouton"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium admin-text-secondary mb-2">
                        Lien du bouton principal
                      </label>
                      <input
                        type="text"
                        value={section.buttonLink || ''}
                        onChange={(e) => handleChange('buttonLink', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Colors */}
          <div className="admin-card rounded-lg shadow-sm p-6" style={{ borderColor: 'var(--admin-border)' }}>
            <h3 className="flex items-center text-lg font-semibold admin-text-primary mb-4">
              <Palette className="w-5 h-5 mr-2" />
              Couleurs de la section
            </h3>
            <div className="space-y-4">
              <ColorPicker
                label="Couleur de fond"
                color={section.backgroundColor || '#ffffff'}
                onChange={(color) => handleChange('backgroundColor', color)}
              />
              
              <ImageUpload
                label="Image de fond"
                value={section.backgroundImage || ''}
                onChange={(value) => handleChange('backgroundImage', value)}
                maxSize={10 * 1024 * 1024} // 10MB pour les backgrounds
                preview={true}
              />
              
              <ColorPicker
                label="Couleur du texte"
                color={section.textColor || '#374151'}
                onChange={(color) => handleChange('textColor', color)}
              />
            </div>
          </div>

          {/* Section Status */}
          <div className="admin-card rounded-lg shadow-sm p-6" style={{ borderColor: 'var(--admin-border)' }}>
            <h3 className="text-lg font-semibold admin-text-primary mb-4">État</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm admin-text-secondary">
                  Afficher cette section sur le site
                </span>
              </label>
              
              <div className="text-xs admin-text-muted">
                Position: {section.position + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="mt-8">
          <h2 className="text-xl font-bold admin-text-primary mb-4">Aperçu</h2>
          <div className="border rounded-lg overflow-hidden shadow-lg" style={{ borderColor: 'var(--admin-border)' }}>
            <SectionRenderer section={section} />
          </div>
        </div>
      )}
      
      {/* Flash Message */}
      <FlashMessage message={message} onClose={hideMessage} />
    </div>
  );
};

export default SectionEditorSimple;
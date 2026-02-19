import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContextDB';
import apiService from '../services/apiService';

// Hook avec fallback sécurisé
const useSafeLanguage = () => {
  try {
    return useLanguage();
  } catch (error) {
    console.warn('LanguageContext non disponible, utilisation des valeurs par défaut');
    return {
      currentLanguage: 'fr',
      getLocalizedValue: (value, language = 'fr') => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object') {
          const result = value[language] || value.fr || value.en || Object.values(value)[0] || '';
          return result;
        }
        return '';
      }
    };
  }
};

const InlineTextEditor = ({
  value = '',
  sectionId,
  fieldPath,
  onSave,
  placeholder = 'Cliquez pour éditer...',
  className = '',
  tag = 'div',
  multiline = false,
  disabled = false,
  style = {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [originalValue, setOriginalValue] = useState(value);

  const inputRef = useRef(null);
  const { currentLanguage, getLocalizedValue } = useSafeLanguage();

  console.log('🔍 INIT - InlineTextEditor props:', { sectionId, fieldPath, onSave: !!onSave, value, disabled, isEditing });

  // Obtenir la valeur localisée appropriée
  const displayValue = getLocalizedValue(value, currentLanguage);


  useEffect(() => {
    const localizedValue = getLocalizedValue(value, currentLanguage);
    setEditValue(localizedValue);
    setOriginalValue(localizedValue);
  }, [value, currentLanguage, getLocalizedValue]);

  // Focus automatique quand on entre en mode édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (!multiline) {
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  const handleEdit = useCallback(() => {
    console.log('🔍 EDIT - handleEdit called, disabled:', disabled);
    if (disabled) return;
    console.log('🔍 EDIT - Entering edit mode');
    setIsEditing(true);
    setError(null);
  }, [disabled]);

  const handleCancel = useCallback(() => {
    setEditValue(originalValue);
    setIsEditing(false);
    setError(null);
  }, [originalValue]);

  const handleSave = useCallback(async () => {
    console.log('🔍 SAVE - handleSave called');
    console.log('🔍 SAVE - editValue:', editValue);
    console.log('🔍 SAVE - originalValue:', originalValue);

    if (editValue === originalValue) {
      console.log('🔍 SAVE - No changes, skipping save');
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      console.log('🔍 SAVE - Starting save process...');

      // Préparer la nouvelle valeur multilingue
      let newValue;
      if (typeof value === 'object' && value !== null) {
        // Si c'est déjà un objet multilingue, mettre à jour la langue courante
        newValue = {
          ...value,
          [currentLanguage]: editValue
        };
      } else {
        // Si c'est une valeur simple, créer un objet multilingue
        newValue = {
          [currentLanguage]: editValue
        };
      }

      console.log('🔍 SAVE - Prepared newValue:', newValue);
      console.log('🔍 SAVE - sectionId:', sectionId);
      console.log('🔍 SAVE - fieldPath:', fieldPath);

      // Sauvegarder via le callback principal (qui gère l'API et le store)
      if (onSave) {
        console.log('🔍 SAVE - Calling onSave callback...');
        await onSave(fieldPath, newValue);
        console.log('🔍 SAVE - onSave callback completed');
      } else {
        console.warn('🔍 SAVE - No onSave callback provided, cannot save');
      }

      setOriginalValue(editValue);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur sauvegarde texte inline:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editValue, originalValue, value, currentLanguage, sectionId, fieldPath, onSave]);

  const saveToDatabase = async (sectionId, fieldPath, newValue) => {
    try {
      // Validation des paramètres
      if (!fieldPath || typeof fieldPath !== 'string') {
        throw new Error(`fieldPath invalide: ${fieldPath}`);
      }

      // Récupérer la section complète
      const sections = await apiService.getSections();
      const section = sections.find(s => s.id === sectionId);

      if (!section) {
        throw new Error(`Section ${sectionId} non trouvée`);
      }

      // Mettre à jour le champ spécifique dans les données de section
      const updatedSectionData = { ...section.section_data };

      // Support pour les chemins imbriqués (ex: "contact.email")
      const pathParts = fieldPath.split('.');
      let current = updatedSectionData;

      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }

      current[pathParts[pathParts.length - 1]] = newValue;

      // Sauvegarder en base
      await apiService.updateSection(sectionId, {
        section_data: updatedSectionData
      });

      console.log(`✅ Texte sauvegardé en base: ${fieldPath} = ${editValue}`);
    } catch (error) {
      console.error('❌ Erreur sauvegarde en base:', error);
      throw error;
    }
  };

  const handleKeyDown = useCallback((e) => {
    console.log('🔍 KEY - Key pressed:', e.key, 'multiline:', multiline);
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      console.log('🔍 KEY - Enter pressed, calling handleSave');
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      console.log('🔍 KEY - Escape pressed, calling handleCancel');
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
      console.log('🔍 KEY - Ctrl+Enter pressed, calling handleSave');
      e.preventDefault();
      handleSave();
    }
  }, [handleSave, handleCancel, multiline]);

  const handleBlur = useCallback(() => {
    // Délai pour permettre les clics sur les boutons
    setTimeout(() => {
      if (isEditing && !isSaving) {
        handleSave();
      }
    }, 150);
  }, [isEditing, isSaving, handleSave]);

  console.log('🔍 RENDER - isEditing state:', isEditing);

  if (isEditing) {
    console.log('🔍 RENDER - Rendering edit mode');
    const InputComponent = multiline ? 'textarea' : 'input';

    return (
      <div className={`inline-editor editing ${className}`}>
        <InputComponent
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="inline-editor-input"
          placeholder={placeholder}
          disabled={isSaving}
          style={{
            ...style,
            minWidth: multiline ? '200px' : '100px',
            minHeight: multiline ? '60px' : 'auto',
            padding: '4px 8px',
            border: '2px solid #3b82f6',
            borderRadius: '4px',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            color: 'inherit',
            backgroundColor: '#ffffff',
            outline: 'none',
            resize: multiline ? 'vertical' : 'none'
          }}
        />

        {/* Boutons d'action */}
        <div className="inline-editor-actions" style={{
          display: 'flex',
          gap: '4px',
          marginTop: '4px'
        }}>
          <button
            onClick={() => {
              console.log('🔍 BUTTON - Save button clicked');
              handleSave();
            }}
            disabled={isSaving}
            style={{
              padding: '2px 8px',
              fontSize: '12px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? '...' : '✓'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            style={{
              padding: '2px 8px',
              fontSize: '12px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={{
            color: '#ef4444',
            fontSize: '12px',
            marginTop: '4px'
          }}>
            {error}
          </div>
        )}

        {/* Aide */}
        <div style={{
          fontSize: '10px',
          color: '#6b7280',
          marginTop: '2px'
        }}>
          {multiline
            ? 'Ctrl+Entrée pour sauvegarder, Échap pour annuler'
            : 'Entrée pour sauvegarder, Échap pour annuler'
          }
        </div>
      </div>
    );
  }

  // Mode affichage
  const TagComponent = tag;
  const isEmpty = !displayValue || displayValue.trim() === '';

  return (
    <TagComponent
      className={`inline-editor ${disabled ? 'disabled' : 'editable'} ${isEmpty ? 'empty' : ''} ${className}`}
      onClick={() => {
        console.log('🔍 CLICK - Element clicked!');
        handleEdit();
      }}
      style={{
        ...style,
        cursor: disabled ? 'default' : 'pointer',
        minHeight: isEmpty ? '20px' : 'auto',
        padding: isEmpty ? '4px 8px' : '2px 4px',
        border: isEmpty ? '1px dashed #d1d5db' : '2px solid #3b82f6',
        borderRadius: isEmpty ? '4px' : '4px',
        color: isEmpty ? '#9ca3af' : undefined,
        fontStyle: isEmpty ? 'italic' : undefined,
        backgroundColor: disabled ? undefined : 'rgba(59, 130, 246, 0.15)',
        transition: 'all 0.2s ease',
        pointerEvents: disabled ? 'none' : 'auto',
        position: 'relative',
        zIndex: 10
      }}
      title={disabled ? undefined : 'Cliquez pour éditer'}
    >
      {isEmpty ? placeholder : displayValue}
    </TagComponent>
  );
};

export default InlineTextEditor;
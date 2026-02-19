import { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContextDB';
import sectionStoreAPI from '../store/SectionStoreAPI';

// Hook avec fallback sécurisé
const useSafeLanguage = () => {
  try {
    return useLanguage();
  } catch (error) {
    console.warn('LanguageContext non disponible, utilisation des valeurs par défaut');
    return {
      currentLanguage: 'fr',
      getLocalizedValue: (value) => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object') {
          return value.fr || value.en || Object.values(value)[0] || '';
        }
        return '';
      }
    };
  }
};

export const useInlineEditor = (sectionId) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const { currentLanguage } = useSafeLanguage();

  const updateSectionField = useCallback(async (fieldPath, newValue) => {
    try {
      console.log('🔍 UPDATE - updateSectionField called');
      console.log('🔍 UPDATE - fieldPath:', fieldPath);
      console.log('🔍 UPDATE - newValue:', newValue);
      console.log('🔍 UPDATE - sectionId:', sectionId);

      setIsUpdating(true);
      setError(null);

      // Validation du fieldPath
      if (!fieldPath || typeof fieldPath !== 'string') {
        console.error('🔍 UPDATE - Invalid fieldPath:', fieldPath);
        throw new Error(`fieldPath invalide: ${fieldPath}`);
      }

      // Récupérer la section actuelle
      const sections = sectionStoreAPI.getSections();
      const section = sections.find(s => s.id === sectionId);

      if (!section) {
        throw new Error(`Section ${sectionId} non trouvée`);
      }

      // Créer une copie profonde des données de section
      const updatedSection = JSON.parse(JSON.stringify(section));

      // S'assurer que la section a une structure section_data pour la sauvegarde
      if (!updatedSection.section_data) {
        updatedSection.section_data = {};
        // Copier les champs existants vers section_data si ils existent au niveau racine
        ['title', 'subtitle', 'description', 'buttonText', 'secondaryButtonText', 'ctaTitle', 'ctaDescription', 'ctaButtonText', 'features'].forEach(field => {
          if (updatedSection[field] !== undefined) {
            updatedSection.section_data[field] = updatedSection[field];
          }
        });
      }

      // Mettre à jour le champ spécifique
      // Déterminer le bon chemin pour la sauvegarde
      let finalPath = fieldPath;
      if (!fieldPath.startsWith('section_data.')) {
        // Pour la sauvegarde, toujours utiliser section_data car on sauvegarde au format API
        finalPath = `section_data.${fieldPath}`;
      }

      const finalPathParts = finalPath.split('.');
      let current = updatedSection;

      // Naviguer jusqu'au parent du champ à modifier
      for (let i = 0; i < finalPathParts.length - 1; i++) {
        const part = finalPathParts[i];

        if (!current[part]) {
          // Détecter si la prochaine clé est un nombre (index de tableau)
          const nextPart = finalPathParts[i + 1];
          const isNextPartArrayIndex = !isNaN(parseInt(nextPart));

          // Créer un tableau ou un objet selon le contexte
          current[part] = isNextPartArrayIndex ? [] : {};
        }

        current = current[part];
      }

      // Mettre à jour la valeur
      current[finalPathParts[finalPathParts.length - 1]] = newValue;

      // Sauvegarder via le store
      console.log('🔍 UPDATE - Calling sectionStoreAPI.updateSection...');
      await sectionStoreAPI.updateSection(sectionId, updatedSection);
      console.log('🔍 UPDATE - sectionStoreAPI.updateSection completed');

      console.log(`✅ Section ${sectionId} mise à jour:`, fieldPath, '=', newValue);

      return updatedSection;
    } catch (err) {
      console.error(`❌ Erreur mise à jour section ${sectionId}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [sectionId]);

  const updateMultilingualField = useCallback(async (fieldPath, value, languageId = null) => {
    console.log('🔍 HOOK - updateMultilingualField called');
    console.log('🔍 HOOK - fieldPath:', fieldPath);
    console.log('🔍 HOOK - value:', value);
    console.log('🔍 HOOK - sectionId:', sectionId);

    const targetLanguage = languageId || currentLanguage;

    // Validation du fieldPath
    if (!fieldPath || typeof fieldPath !== 'string') {
      console.error('🔍 HOOK - Invalid fieldPath:', fieldPath);
      throw new Error(`fieldPath invalide: ${fieldPath}`);
    }

    // Si la valeur est déjà un objet multilingue complet, l'utiliser directement
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Vérifier si c'est un objet multilingue (contient des codes de langue)
      const keys = Object.keys(value);
      const isMultilingualObject = keys.some(key => ['fr', 'en', 'es', 'it', 'de', 'pt', 'ar', 'ch', 'jp', 'kr'].includes(key));

      if (isMultilingualObject) {
        console.log('🔍 HOOK - Value is already multilingual object, using directly');
        const result = await updateSectionField(fieldPath, value);
        console.log('🔍 HOOK - updateSectionField completed');
        return result;
      }
    }

    // Récupérer la valeur actuelle du champ pour la fusion
    const sections = sectionStoreAPI.getSections();
    const section = sections.find(s => s.id === sectionId);

    if (!section) {
      throw new Error(`Section ${sectionId} non trouvée`);
    }

    // Naviguer vers le champ
    const pathParts = fieldPath.split('.');
    let current = section;
    for (const part of pathParts) {
      current = current?.[part];
    }

    // Créer/mettre à jour l'objet multilingue
    let multilingualValue;
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      // C'est déjà un objet multilingue
      multilingualValue = {
        ...current,
        [targetLanguage]: value
      };
    } else {
      // Créer un nouvel objet multilingue
      multilingualValue = {
        [targetLanguage]: value
      };
    }

    console.log('🔍 HOOK - Calling updateSectionField with:', fieldPath, multilingualValue);
    const result = await updateSectionField(fieldPath, multilingualValue);
    console.log('🔍 HOOK - updateSectionField completed');
    return result;
  }, [sectionId, currentLanguage, updateSectionField]);

  const getFieldValue = useCallback((fieldPath, section = null) => {
    // Validation du fieldPath
    if (!fieldPath || typeof fieldPath !== 'string') {
      console.warn(`getFieldValue: fieldPath invalide`, fieldPath);
      return null;
    }

    if (!section) {
      const sections = sectionStoreAPI.getSections();
      section = sections.find(s => s.id === sectionId);
    }

    if (!section) {
      const allSections = sectionStoreAPI.getSections();
      console.warn(`getFieldValue: section ${sectionId} non trouvée`);
      console.log('🔍 Available sections:', allSections.map(s => ({ id: s.id, type: s.section_type })));
      return null;
    }

    // Déterminer le bon chemin en fonction de la structure de la section
    let finalPath = fieldPath;
    if (!fieldPath.startsWith('section_data.')) {
      // Vérifier d'abord si le champ existe au niveau racine (section convertie)
      const pathParts = fieldPath.split('.');
      let current = section;
      let existsAtRoot = true;

      for (const part of pathParts) {
        current = current?.[part];
        if (current === undefined) {
          existsAtRoot = false;
          break;
        }
      }

      // Si le champ n'existe pas au niveau racine ET que section_data existe,
      // alors utiliser section_data.fieldPath
      if (!existsAtRoot && section.section_data) {
        finalPath = `section_data.${fieldPath}`;
      }
    }

    const pathParts = finalPath.split('.');
    let current = section;
    for (const part of pathParts) {
      current = current?.[part];
      if (current === undefined) {
        console.warn(`getFieldValue: chemin ${finalPath} non trouvé à l'étape ${part}`);
        return null;
      }
    }
    return current;
  }, [sectionId]);

  const createInlineEditorProps = useCallback((fieldPath, options = {}) => {

    const {
      placeholder = 'Cliquez pour éditer...',
      multiline = false,
      tag = 'div',
      className = '',
      style = {},
      disabled = false
    } = options;

    // Récupérer la section actuelle depuis le store
    const sections = sectionStoreAPI.getSections();
    const section = sections.find(s => s.id === sectionId);


    const value = getFieldValue(fieldPath, section);

    return {
      value,
      sectionId,
      fieldPath,
      onSave: updateMultilingualField,
      placeholder,
      multiline,
      tag,
      className,
      style,
      disabled
    };
  }, [sectionId, getFieldValue, updateMultilingualField]);

  return {
    updateSectionField,
    updateMultilingualField,
    getFieldValue,
    createInlineEditorProps,
    isUpdating,
    error
  };
};
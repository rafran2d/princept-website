import { useState, useEffect } from 'react';
import sectionStore from '../store/SectionStoreAPI';

export const useSections = () => {
  const [sections, setSections] = useState(() => {
    const initialSections = sectionStore.getSections();
    console.log('🎯 useSections - Initialisation avec:', initialSections.length, 'sections');
    return initialSections;
  });
  
  const [loadingState, setLoadingState] = useState(() => {
    return sectionStore.getLoadingState();
  });

  useEffect(() => {
    console.log('🎯 useSections - Configuration du listener');
    const unsubscribe = sectionStore.subscribe((updatedSections, isLoading, initialized) => {
      console.log('🎯 useSections - Sections mises à jour:', updatedSections.length, '| Chargement:', isLoading, '| Initialisé:', initialized);
      setSections([...updatedSections].sort((a, b) => a.position - b.position));
      setLoadingState({ isLoading, initialized, error: sectionStore.error });
    });

    return unsubscribe;
  }, []);

  return {
    sections,
    enabledSections: sections.filter(section => section.enabled),
    isLoading: loadingState.isLoading,
    initialized: loadingState.initialized,
    error: loadingState.error,
    addSection: (sectionData) => sectionStore.addSection(sectionData),
    updateSection: (id, updates) => sectionStore.updateSection(id, updates),
    deleteSection: (id) => sectionStore.deleteSection(id),
    toggleSection: (id) => sectionStore.toggleSection(id),
    reorderSections: (newOrder) => sectionStore.reorderSections(newOrder),
    getSectionTemplates: () => sectionStore.getSectionTemplates()
  };
};
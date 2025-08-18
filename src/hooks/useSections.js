import { useState, useEffect } from 'react';
import sectionStore from '../store/SectionStore';

export const useSections = () => {
  const [sections, setSections] = useState(() => {
    const initialSections = sectionStore.getSections();
    console.log('🎯 useSections - Initialisation avec:', initialSections.length, 'sections');
    return initialSections;
  });

  useEffect(() => {
    console.log('🎯 useSections - Configuration du listener');
    const unsubscribe = sectionStore.subscribe((updatedSections) => {
      console.log('🎯 useSections - Sections mises à jour:', updatedSections.length);
      setSections([...updatedSections].sort((a, b) => a.position - b.position));
    });

    return unsubscribe;
  }, []);

  return {
    sections,
    enabledSections: sections.filter(section => section.enabled),
    addSection: (sectionData) => sectionStore.addSection(sectionData),
    updateSection: (id, updates) => sectionStore.updateSection(id, updates),
    deleteSection: (id) => sectionStore.deleteSection(id),
    toggleSection: (id) => sectionStore.toggleSection(id),
    reorderSections: (newOrder) => sectionStore.reorderSections(newOrder),
    getSectionTemplates: () => sectionStore.getSectionTemplates()
  };
};
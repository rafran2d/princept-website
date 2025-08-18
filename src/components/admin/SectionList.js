import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Edit, 
  Eye, 
  EyeOff, 
  Trash2, 
  GripVertical,
  Copy,
  MoreVertical,
  LayoutGrid,
  AlertTriangle,
  X
} from 'lucide-react';
import { useSections } from '../../hooks/useSections';

const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners)}
    </div>
  );
};

const SectionCard = ({ section, onToggle, onDelete, onDuplicate, dragListeners }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { getLocalizedValue } = useLanguage();

  const getSectionTypeLabel = (type) => {
    const labels = {
      hero: 'Hero',
      about: 'À propos',
      services: 'Services',
      contact: 'Contact',
      gallery: 'Galerie',
      testimonials: 'Témoignages',
      cta: 'Call to Action'
    };
    return labels[type] || type;
  };

  const getSectionTypeColor = (type) => {
    const colors = {
      hero: 'bg-purple-100 text-purple-700',
      about: 'bg-blue-100 text-blue-700',
      services: 'bg-green-100 text-green-700',
      contact: 'bg-orange-100 text-orange-700',
      gallery: 'bg-pink-100 text-pink-700',
      testimonials: 'bg-yellow-100 text-yellow-700',
      cta: 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div 
      className={`group relative admin-card rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
        section.enabled 
          ? 'admin-section-card hover:shadow-xl' 
          : 'opacity-60 hover:opacity-80'
      } transform hover:scale-[1.02]`}
      data-section-id={section.id}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Drag Handle amélioré */}
            <div 
              {...dragListeners}
              className="cursor-grab active:cursor-grabbing p-2 rounded-lg hover:admin-bg-tertiary transition-colors"
            >
              <GripVertical size={20} className="admin-text-muted hover:text-blue-600 transition-colors" />
            </div>

            {/* Section Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm ${getSectionTypeColor(section.type)} border-2 border-white/50`}>
                  {getSectionTypeLabel(section.type)}
                </span>
                {!section.enabled && (
                  <span className="px-3 py-1.5 text-xs font-bold rounded-xl admin-card admin-text-secondary border-2">
                    <EyeOff size={12} className="inline mr-1" />
                    Masqué
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold admin-text-primary mb-2 group-hover:text-blue-600 transition-colors">
                {getLocalizedValue(section.title) || 'Section sans titre'}
              </h3>
              {section.description && (
                <p className="text-sm admin-text-secondary line-clamp-2 leading-relaxed">
                  {getLocalizedValue(section.description)}
                </p>
              )}
            </div>
          </div>

          {/* Actions améliorées */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggle(section.id)}
              className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm admin-button-secondary ${
                section.enabled
                  ? 'text-green-600 hover:bg-green-50'
                  : 'admin-text-muted hover:text-green-600'
              }`}
              title={section.enabled ? 'Masquer la section' : 'Afficher la section'}
            >
              {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            <Link
              to={`/admin/section/${section.id}`}
              className="p-3 text-blue-600 hover:bg-blue-50 admin-button-secondary rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm"
              title="Modifier la section"
            >
              <Edit size={18} />
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 admin-text-muted admin-button-secondary rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:admin-text-primary"
                title="Plus d'actions"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 admin-card rounded-2xl shadow-2xl z-10 min-w-[180px] overflow-hidden">
                  <button
                    onClick={() => {
                      onDuplicate(section);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm admin-text-primary hover:admin-bg-tertiary transition-colors border-b" style={{ borderColor: 'var(--admin-border)' }}
                  >
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Copy size={14} className="text-blue-600" />
                    </div>
                    <span className="font-medium">Dupliquer</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(section.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <Trash2 size={14} className="text-red-600" />
                    </div>
                    <span className="font-medium">Supprimer</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Color Preview amélioré */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--admin-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium admin-text-secondary">Arrière-plan</span>
                <div 
                  className="w-8 h-8 rounded-xl shadow-sm border-2 border-white ring-2 ring-gray-200 transform hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: section.backgroundColor }}
                  title={`Couleur: ${section.backgroundColor}`}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600">Texte</span>
                <div 
                  className="w-8 h-8 rounded-xl shadow-sm border-2 border-white ring-2 ring-gray-200 transform hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: section.textColor }}
                  title={`Couleur: ${section.textColor}`}
                />
              </div>
            </div>
            
            {/* Position indicator */}
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-medium">
              Position #{section.position + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Modal de confirmation personnalisée
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, sectionTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop avec animation */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 overflow-hidden transform transition-all duration-300 scale-100">
          
          {/* Header avec dégradé rouge */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 relative">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Confirmer la suppression</h3>
                <p className="text-red-100 text-sm">Cette action est irréversible</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu */}
          <div className="px-6 py-6">
            <p className="admin-text-primary text-base leading-relaxed mb-2">
              Êtes-vous sûr de vouloir supprimer la section
            </p>
            <p className="font-bold admin-text-primary text-lg mb-4">
              "{sectionTitle}" ?
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 text-sm font-medium">Attention</p>
                  <p className="text-amber-700 text-sm">
                    Cette action supprimera définitivement la section et tout son contenu. 
                    Vous ne pourrez pas annuler cette opération.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-200"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-red-300 shadow-lg hover:shadow-xl"
            >
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionList = () => {
  const { 
    sections, 
    toggleSection, 
    deleteSection, 
    reorderSections,
    addSection
  } = useSections();
  
  const { message, showSuccess, hideMessage } = useFlashMessage();
  const { getLocalizedValue } = useLanguage();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, section: null });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex);
      const newOrder = newSections.map(section => section.id);
      reorderSections(newOrder);
    }
  };

  const handleDelete = (id) => {
    const section = sections.find(s => s.id === id);
    setDeleteModal({ isOpen: true, section });
  };

  const confirmDelete = () => {
    if (deleteModal.section) {
      deleteSection(deleteModal.section.id);
      showSuccess(`Section "${getLocalizedValue(deleteModal.section.title)}" supprimée avec succès !`);
      setDeleteModal({ isOpen: false, section: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, section: null });
  };

  const handleDuplicate = (section) => {
    // Créer une copie en excluant explicitement l'ID
    const { id, ...sectionWithoutId } = section;
    const duplicatedSection = {
      ...sectionWithoutId,
      title: typeof section.title === 'string' ? `${section.title} (copie)` : { ...section.title, fr: `${getLocalizedValue(section.title)} (copie)` }
      // L'ID sera généré automatiquement par addSection
    };
    console.log('🔄 Section originale ID:', id);
    const newSection = addSection(duplicatedSection);
    console.log('✨ Nouvelle section créée avec ID:', newSection.id);
    showSuccess(`Section "${getLocalizedValue(section.title)}" dupliquée avec succès !`);
    
    // Scroll vers la nouvelle section après un court délai pour s'assurer qu'elle est rendue
    setTimeout(() => {
      const newSectionElement = document.querySelector(`[data-section-id="${newSection.id}"]`);
      if (newSectionElement) {
        newSectionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleToggle = (id) => {
    const section = sections.find(s => s.id === id);
    toggleSection(id);
    if (section) {
      const newStatus = section.enabled ? 'désactivée' : 'activée';
      showSuccess(`Section "${getLocalizedValue(section.title)}" ${newStatus} !`);
    }
  };

  if (sections.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-12 max-w-lg mx-auto">
          <div className="mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LayoutGrid size={48} className="text-blue-600" />
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-lg">✨</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold admin-text-primary mb-4">
              Créez votre première section
            </h2>
            <p className="admin-text-secondary mb-8 text-lg leading-relaxed">
              Donnez vie à votre site web en ajoutant des sections personnalisées. 
              Chaque section raconte une partie de votre histoire.
            </p>
          </div>
          
          <div className="space-y-6">
            <p className="text-sm font-semibold admin-text-secondary uppercase tracking-wider">
              Suggestions populaires
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-2xl mb-2">🚀</div>
                <strong className="text-purple-700 font-bold block">Hero Section</strong>
                <span className="text-purple-600 text-sm">Impact visuel fort</span>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-2xl mb-2">👋</div>
                <strong className="text-blue-700 font-bold block">À propos</strong>
                <span className="text-blue-600 text-sm">Votre histoire</span>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-2xl mb-2">⭐</div>
                <strong className="text-green-700 font-bold block">Services</strong>
                <span className="text-green-600 text-sm">Vos expertises</span>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-2xl mb-2">📞</div>
                <strong className="text-orange-700 font-bold block">Contact</strong>
                <span className="text-orange-600 text-sm">Restez connectés</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                💡 <strong>Astuce :</strong> Utilisez le bouton "Ajouter Section" en haut à droite pour commencer
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header amélioré */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <LayoutGrid size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold admin-text-primary">
                Gestion des Sections
              </h1>
              <p className="admin-text-secondary mt-1 text-lg">
                Organisez et personnalisez votre contenu
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-sm admin-text-muted font-medium">
                Section{sections.length > 1 ? 's' : ''} créée{sections.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions et statistiques */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Instructions */}
          <div className="lg:col-span-2 admin-card rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <GripVertical className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold admin-text-primary mb-2">Comment organiser vos sections</h3>
                <ul className="space-y-2 admin-text-secondary">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Glissez-déposez les sections pour les réorganiser</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Utilisez l'œil pour afficher/masquer une section</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Cliquez sur "Modifier" pour personnaliser le contenu</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3"></div>
              Statistiques
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sections actives</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-green-600">
                    {sections.filter(s => s.enabled).length}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sections masquées</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="font-bold text-gray-600">
                    {sections.filter(s => !s.enabled).length}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Visibilité</span>
                  <span className="text-xs font-bold text-gray-900">
                    {Math.round((sections.filter(s => s.enabled).length / Math.max(sections.length, 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(sections.filter(s => s.enabled).length / Math.max(sections.length, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sections.map((section) => (
              <SortableItem key={section.id} id={section.id}>
                {(listeners) => (
                  <SectionCard
                    section={section}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    dragListeners={listeners}
                  />
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* Flash Message */}
      <FlashMessage message={message} onClose={hideMessage} />
      
      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        sectionTitle={getLocalizedValue(deleteModal.section?.title) || 'Section sans titre'}
      />
    </div>
  );
};

export default SectionList;
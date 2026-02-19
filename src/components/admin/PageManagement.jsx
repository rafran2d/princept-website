import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Save, X } from 'lucide-react';
import apiService from '../../services/apiService';
import { useFrontendLanguage } from '../LanguageSelector';
import AdminLanguageInput from './AdminLanguageInput';
import RichTextEditor from './RichTextEditor';
import { useAdminLanguage } from '../../hooks/useAdminLanguage';
import { useLanguage } from '../../contexts/LanguageContextDB';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const PageManagement = () => {
  const { t, currentLanguage } = useFrontendLanguage();
  const { createMultilingualObject } = useAdminLanguage();
  const { getActiveLanguages } = useLanguage();
  const { message, showSuccess, showError, hideMessage } = useFlashMessage();
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, page: null });
  const [formData, setFormData] = useState({
    title: createMultilingualObject(''),
    slug: '',
    content: createMultilingualObject(''),
    isPublished: true
  });

  useEffect(() => {
    loadPages();
  }, []);

  const normalizeMultilingualValue = (value) => {
    if (!value) return createMultilingualObject('');
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' ? parsed : createMultilingualObject(value);
      } catch {
        return createMultilingualObject(value);
      }
    }
    if (typeof value === 'object') {
      // S'assurer que toutes les langues actives sont présentes
      const normalized = { ...value };
      const activeLanguages = getActiveLanguages();
      activeLanguages.forEach(lang => {
        // Vérifier avec code et id pour compatibilité
        if (!normalized[lang.code] && !normalized[lang.id]) {
          normalized[lang.code] = '';
        }
      });
      return normalized;
    }
    return createMultilingualObject('');
  };

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getPages();
      // Normaliser les valeurs multilingues pour chaque page
      const normalizedPages = (data || []).map(page => ({
        ...page,
        title: normalizeMultilingualValue(page.title),
        content: normalizeMultilingualValue(page.content)
      }));
      setPages(normalizedPages);
    } catch (error) {
      console.error('Erreur chargement pages:', error);
      showError('Erreur lors du chargement des pages');
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Valider les données avant envoi
      if (!formData.slug || !formData.slug.trim()) {
        showError('Le slug est obligatoire');
        return;
      }

      // Préparer les données pour l'API
      const pageData = {
        title: formData.title || createMultilingualObject(''),
        slug: formData.slug.trim(),
        content: formData.content || createMultilingualObject(''),
        isPublished: formData.isPublished !== false
      };

      console.log('📤 Envoi des données:', {
        ...pageData,
        title: typeof pageData.title === 'object' ? 'object' : typeof pageData.title,
        content: typeof pageData.content === 'object' ? 'object' : typeof pageData.content
      });

      if (editingPage) {
        await apiService.updatePage(editingPage.id, pageData);
        showSuccess('Page modifiée avec succès !');
      } else {
        await apiService.createPage(pageData);
        showSuccess('Page créée avec succès !');
      }
      await loadPages();
      resetForm();
    } catch (error) {
      console.error('❌ Erreur sauvegarde page:', error);
      const errorMessage = error.message || 'Erreur lors de la sauvegarde de la page';
      showError(`Erreur lors de la sauvegarde de la page : ${errorMessage}`);
    }
  };

  const handleDelete = (id) => {
    const page = pages.find(p => p.id === id);
    setDeleteModal({ isOpen: true, page });
  };

  const confirmDelete = async () => {
    if (deleteModal.page) {
      try {
        const pageTitle = getText(deleteModal.page.title, 'fr');
        await apiService.deletePage(deleteModal.page.id);
        showSuccess(`Page "${pageTitle}" supprimée avec succès !`);
        await loadPages();
        setDeleteModal({ isOpen: false, page: null });
      } catch (error) {
        console.error('Erreur suppression page:', error);
        showError('Erreur lors de la suppression de la page');
        setDeleteModal({ isOpen: false, page: null });
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, page: null });
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title || createMultilingualObject(''),
      slug: page.slug || '',
      content: page.content || createMultilingualObject(''),
      isPublished: page.isPublished !== false
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      title: createMultilingualObject(''),
      slug: '',
      content: createMultilingualObject(''),
      isPublished: true
    });
    setShowForm(false);
  };

  const getText = (value, lang = null) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // Utiliser la langue courante de l'admin ou la langue par défaut
      const activeLanguages = getActiveLanguages();
      const defaultLang = activeLanguages.find(l => l.isDefault) || activeLanguages[0];
      const targetLang = lang || defaultLang?.code || 'fr';
      
      // Essayer avec code, puis id, puis valeurs par défaut
      return value[targetLang] || 
             value[defaultLang?.code] || 
             value[defaultLang?.id] ||
             value.fr || 
             value.en || 
             Object.values(value).find(v => typeof v === 'string' && v.trim() !== '') || 
             '';
    }
    return String(value);
  };

  return (
    <div className="p-6">
      <FlashMessage message={message} onClose={hideMessage} />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold admin-text-primary mb-2">Gestion des Pages</h1>
          <p className="text-sm admin-text-secondary">Créez et gérez des pages dynamiques pour votre site</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nouvelle page</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold admin-text-primary">
              {editingPage ? 'Modifier la page' : 'Nouvelle page'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <AdminLanguageInput
                label="Titre"
                value={formData.title || createMultilingualObject('')}
                onChange={(value) => {
                  setFormData({ ...formData, title: value });
                  // Générer automatiquement le slug depuis le titre français si le slug est vide
                  if (!formData.slug && value.fr) {
                    const autoSlug = value.fr.toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    setFormData(prev => ({ ...prev, slug: autoSlug }));
                  }
                }}
                placeholder="Saisissez le titre de la page..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ex: politique-confidentialite"
                required
              />
              <p className="text-xs text-gray-500 mt-1">L'URL sera : /{currentLanguage || 'fr'}/page/[slug]</p>
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                Contenu <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.content || createMultilingualObject('')}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Saisissez le contenu de la page..."
                className="mb-4"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublished" className="text-sm admin-text-secondary">
                Page publiée (visible dans le footer)
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={18} />
                <span>{editingPage ? 'Enregistrer' : 'Créer'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="admin-text-secondary">Chargement...</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="admin-text-secondary mb-4">Aucune page créée</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer votre première page
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium admin-text-primary">
                      {getText(page.title, 'fr')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm admin-text-secondary">
                      /page/{page.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      page.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.isPublished ? 'Publiée' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmer la suppression de la page"
        subtitle="Cette action est irréversible"
        message="Êtes-vous sûr de vouloir supprimer la page"
        itemName={deleteModal.page ? getText(deleteModal.page.title, 'fr') : ''}
        warningMessage="Cette action supprimera définitivement la page et tout son contenu. Vous ne pourrez pas annuler cette opération."
        confirmButtonText="Supprimer définitivement"
      />
    </div>
  );
};

export default PageManagement;

import React, { useState } from 'react';
import { Calendar, Clock, User, Image as ImageIcon, Video, ExternalLink, Heart, Plus, X, Trash2, Edit2, Save } from 'lucide-react';
import BlogSection from './BlogSection';
import { useFrontendLanguage } from '../LanguageSelector';

const BlogSectionEditable = ({ section, onUpdate, useGlobalStyles }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSection, setLocalSection] = useState(section || {});
  const [editingPostIndex, setEditingPostIndex] = useState(null);
  const { t } = useFrontendLanguage();

  const primaryColor = '#2563EB';
  const accentColor = '#F59E0B';

  // Initialiser les données par défaut
  React.useEffect(() => {
    if (!localSection.posts) {
      setLocalSection(prev => ({
        ...prev,
        posts: [],
        postsPerPage: prev.postsPerPage || 6,
        title: prev.title || 'Nos activités récentes',
        subtitle: prev.subtitle || '',
        description: prev.description || 'Suivez nos dernières actions et événements pour rester informé de nos activités.'
      }));
    }
  }, [localSection.posts]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(localSection);
    }
    setIsEditing(false);
    setEditingPostIndex(null);
  };

  const handleAddPost = () => {
    const newPost = {
      id: `post-${Date.now()}`,
      title: 'Nouvelle activité',
      summary: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      category: '',
      featuredImage: '',
      images: [],
      videos: []
    };
    setLocalSection(prev => ({
      ...prev,
      posts: [...(prev.posts || []), newPost]
    }));
    setEditingPostIndex(localSection.posts?.length || 0);
  };

  const handleUpdatePost = (index, updates) => {
    const updatedPosts = [...(localSection.posts || [])];
    updatedPosts[index] = { ...updatedPosts[index], ...updates };
    setLocalSection(prev => ({ ...prev, posts: updatedPosts }));
  };

  const handleDeletePost = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      const updatedPosts = localSection.posts.filter((_, i) => i !== index);
      setLocalSection(prev => ({ ...prev, posts: updatedPosts }));
      if (editingPostIndex === index) {
        setEditingPostIndex(null);
      } else if (editingPostIndex > index) {
        setEditingPostIndex(editingPostIndex - 1);
      }
    }
  };

  const handleAddImage = (postIndex) => {
    const url = prompt('URL de l\'image :');
    if (url) {
      const caption = prompt('Légende (optionnel) :') || '';
      const updatedPosts = [...localSection.posts];
      updatedPosts[postIndex].images = [
        ...(updatedPosts[postIndex].images || []),
        { url, caption, alt: caption || 'Image' }
      ];
      setLocalSection(prev => ({ ...prev, posts: updatedPosts }));
    }
  };

  const handleAddVideo = (postIndex) => {
    const url = prompt('URL de la vidéo (YouTube, Vimeo) :');
    if (url) {
      const title = prompt('Titre (optionnel) :') || '';
      const caption = prompt('Légende (optionnel) :') || '';
      const updatedPosts = [...localSection.posts];
      updatedPosts[postIndex].videos = [
        ...(updatedPosts[postIndex].videos || []),
        { url, title, caption }
      ];
      setLocalSection(prev => ({ ...prev, posts: updatedPosts }));
    }
  };

  const handleRemoveImage = (postIndex, imageIndex) => {
    const updatedPosts = [...localSection.posts];
    updatedPosts[postIndex].images = updatedPosts[postIndex].images.filter((_, i) => i !== imageIndex);
    setLocalSection(prev => ({ ...prev, posts: updatedPosts }));
  };

  const handleRemoveVideo = (postIndex, videoIndex) => {
    const updatedPosts = [...localSection.posts];
    updatedPosts[postIndex].videos = updatedPosts[postIndex].videos.filter((_, i) => i !== videoIndex);
    setLocalSection(prev => ({ ...prev, posts: updatedPosts }));
  };

  if (!isEditing) {
    return (
      <div className="relative group">
        <div 
          className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-white rounded-lg shadow-lg border-2 flex items-center space-x-2 hover:shadow-xl transition-all"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            <Edit2 className="w-4 h-4" />
            <span>Modifier</span>
          </button>
        </div>
        <BlogSection section={localSection} useGlobalStyles={useGlobalStyles} />
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg border-2 p-6" style={{ borderColor: primaryColor }}>
      {/* Barre d'outils */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h3 className="text-xl font-bold" style={{ color: primaryColor }}>
          Édition de la section Blog
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-white font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditingPostIndex(null);
            }}
            className="px-4 py-2 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Annuler
          </button>
        </div>
      </div>

      {/* Configuration générale */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-2">Titre principal</label>
          <input
            type="text"
            value={localSection.title || ''}
            onChange={(e) => setLocalSection(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: `${primaryColor}40`, focusRingColor: `${primaryColor}20` }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Sous-titre</label>
          <input
            type="text"
            value={localSection.subtitle || ''}
            onChange={(e) => setLocalSection(prev => ({ ...prev, subtitle: e.target.value }))}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: `${primaryColor}40` }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={localSection.description || ''}
            onChange={(e) => setLocalSection(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: `${primaryColor}40` }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Nombre de posts par page</label>
          <input
            type="number"
            value={localSection.postsPerPage || 6}
            onChange={(e) => setLocalSection(prev => ({ ...prev, postsPerPage: parseInt(e.target.value) || 6 }))}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: `${primaryColor}40` }}
            min="1"
            max="12"
          />
        </div>
      </div>

      {/* Liste des posts */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">Posts de blog</h4>
          <button
            onClick={handleAddPost}
            className="px-4 py-2 rounded-lg text-white font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un post</span>
          </button>
        </div>

        <div className="space-y-4">
          {(localSection.posts || []).map((post, index) => (
            <div
              key={post.id || index}
              className="border-2 rounded-lg p-4"
              style={{ 
                borderColor: editingPostIndex === index ? primaryColor : `${primaryColor}30`,
                backgroundColor: editingPostIndex === index ? `${primaryColor}05` : 'white'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg">{post.title || 'Sans titre'}</span>
                  {post.date && (
                    <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingPostIndex(editingPostIndex === index ? null : index)}
                    className="p-2 rounded hover:bg-gray-100 transition-colors"
                    style={{ color: primaryColor }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(index)}
                    className="p-2 rounded hover:bg-red-50 transition-colors text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editingPostIndex === index && (
                <div className="mt-4 space-y-4 pt-4 border-t" style={{ borderColor: `${primaryColor}20` }}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Titre</label>
                      <input
                        type="text"
                        value={post.title || ''}
                        onChange={(e) => handleUpdatePost(index, { title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Date</label>
                      <input
                        type="date"
                        value={post.date || ''}
                        onChange={(e) => handleUpdatePost(index, { date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Auteur</label>
                      <input
                        type="text"
                        value={post.author || ''}
                        onChange={(e) => handleUpdatePost(index, { author: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Catégorie</label>
                      <input
                        type="text"
                        value={post.category || ''}
                        onChange={(e) => handleUpdatePost(index, { category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Image de couverture (URL)</label>
                    <input
                      type="text"
                      value={post.featuredImage || ''}
                      onChange={(e) => handleUpdatePost(index, { featuredImage: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Résumé</label>
                    <textarea
                      value={post.summary || ''}
                      onChange={(e) => handleUpdatePost(index, { summary: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Résumé court du post"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Contenu</label>
                    <textarea
                      value={post.content || ''}
                      onChange={(e) => handleUpdatePost(index, { content: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Contenu complet du post (HTML autorisé)"
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold">Images</label>
                      <button
                        onClick={() => handleAddImage(index)}
                        className="px-3 py-1 text-sm rounded text-white flex items-center space-x-1"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(post.images || []).map((image, imgIndex) => (
                        <div key={imgIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <img src={typeof image === 'string' ? image : image.url} alt="" className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1 text-sm">
                            <div>{typeof image === 'string' ? image : image.url}</div>
                            {typeof image === 'object' && image.caption && (
                              <div className="text-gray-500">{image.caption}</div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveImage(index, imgIndex)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vidéos */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold">Vidéos</label>
                      <button
                        onClick={() => handleAddVideo(index)}
                        className="px-3 py-1 text-sm rounded text-white flex items-center space-x-1"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(post.videos || []).map((video, vidIndex) => {
                        const videoUrl = typeof video === 'string' ? video : video.url;
                        return (
                          <div key={vidIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <Video className="w-8 h-8" style={{ color: primaryColor }} />
                            <div className="flex-1 text-sm">
                              <div>{videoUrl}</div>
                              {typeof video === 'object' && video.title && (
                                <div className="text-gray-500">{video.title}</div>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveVideo(index, vidIndex)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSectionEditable;

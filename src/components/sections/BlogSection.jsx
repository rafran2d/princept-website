import React, { useState, useEffect } from 'react';
import { Calendar, User, Image as ImageIcon, Video, ExternalLink, X } from 'lucide-react';
import { useFrontendLanguage } from '../LanguageSelector';

const BlogSection = ({ section = {}, theme = {}, useGlobalStyles = true }) => {
  const { t } = useFrontendLanguage();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    title = 'Nos activités récentes',
    subtitle = '',
    description = 'Suivez nos dernières actions et événements pour rester informé de nos activités.',
    posts = [],
    postsPerPage = 6,
    backgroundColor = '#FFFFFF',
    textColor = '#1F2937'
  } = section;

  // Fonction pour obtenir la valeur du subtitle et vérifier si elle doit être affichée
  const getSubtitleValue = () => {
    if (!subtitle) return null;
    const subtitleValue = typeof subtitle === 'string' ? subtitle : t(subtitle, subtitle?.fr || subtitle?.en || '');
    if (!subtitleValue || subtitleValue.trim() === '' || subtitleValue === 'Découvrez ce que fait notre association') {
      return null;
    }
    return subtitleValue;
  };

  const displaySubtitle = getSubtitleValue();

  const textSecondary = '#6B7280';
  const borderColor = 'rgba(0, 0, 0, 0.08)';
  const elegantBlue = '#3B82F6'; // Couleur pour les lignes décoratives

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour extraire l'ID d'une vidéo YouTube/Vimeo
  const getVideoId = (url) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) return { type: 'youtube', id: youtubeMatch[1] };
    const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
    if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1] };
    return null;
  };

  // Rendre le contenu d'un post (texte, images, vidéos)
  const renderPostContent = (post) => {
    const content = [];
    
    // Convertir le contenu multilingue en string
    const getContentString = (value) => {
      if (typeof value === 'string') return value;
      if (value && typeof value === 'object') {
        return t(value, value?.fr || value?.en || '');
      }
      return '';
    };
    
    // Contenu texte
    if (post.content) {
      const contentString = getContentString(post.content);
      if (contentString) {
        content.push(
          <div 
            key="text" 
            className="prose prose-lg max-w-none mb-8"
            style={{ color: textColor }}
            dangerouslySetInnerHTML={{ __html: contentString }}
          />
        );
      }
    }

    // Images
    if (post.images && post.images.length > 0) {
      content.push(
        <div key="images" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {post.images.map((image, idx) => (
            <div 
              key={idx}
              className="relative overflow-hidden bg-gray-100"
            >
              <img
                src={image.url || image}
                alt={image.alt || image.caption || `Image ${idx + 1}`}
                className="w-full h-auto object-cover"
              />
              {image.caption && (
                <div className="p-4 bg-white border-t" style={{ borderColor }}>
                  <p className="text-sm" style={{ color: textSecondary }}>
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Vidéos
    if (post.videos && post.videos.length > 0) {
      content.push(
        <div key="videos" className="space-y-8 mb-8">
          {post.videos.map((video, idx) => {
            const videoData = typeof video === 'string' ? { url: video } : video;
            const videoId = getVideoId(videoData.url);
            
            if (videoId) {
              const embedUrl = videoId.type === 'youtube'
                ? `https://www.youtube.com/embed/${videoId.id}`
                : `https://player.vimeo.com/video/${videoId.id}`;
              
              return (
                <div key={idx} className="relative bg-black">
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={videoData.title || `Vidéo ${idx + 1}`}
                    />
                  </div>
                  {videoData.caption && (
                    <div className="p-4 bg-white border-t" style={{ borderColor }}>
                      <p className="text-sm" style={{ color: textSecondary }}>
                        {videoData.caption}
                      </p>
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <div key={idx} className="p-8 text-center border" style={{ borderColor }}>
                <Video className="w-12 h-12 mx-auto mb-4" style={{ color: textSecondary }} />
                <a
                  href={videoData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-lg font-medium hover:opacity-70"
                  style={{ color: textColor }}
                >
                  <span>Voir la vidéo</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                {videoData.title && (
                  <p className="mt-2" style={{ color: textSecondary }}>{videoData.title}</p>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return content;
  };

  // Fonction pour ouvrir la modale avec un post
  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    // Empêcher le scroll du body quand la modale est ouverte
    document.body.style.overflow = 'hidden';
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    // Réactiver le scroll du body
    document.body.style.overflow = 'unset';
  };

  // Fermer la modale avec la touche Escape
  useEffect(() => {
    if (!isModalOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedPost(null);
        document.body.style.overflow = 'unset';
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  return (
    <section 
      id="blog"
      className="blog-section py-8 md:py-12"
      style={{ 
        backgroundColor,
        color: textColor
      }}
    >
      <div className="w-full px-6 lg:px-8">
        {/* En-tête */}
        <div className="w-full mb-8">
          {displaySubtitle && (
            <p className="text-sm md:text-base mb-4 font-normal tracking-wide uppercase text-center"
               style={{ color: textSecondary }}>
              {displaySubtitle}
            </p>
          )}

          {/* Titre avec lignes décoratives pleine largeur */}
          {title && (
            <div className="w-full mb-6">
              <div className="flex items-center justify-center">
                <div 
                  className="flex-1 h-[2px]"
                  style={{ backgroundColor: elegantBlue }}
                />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold px-8 leading-tight tracking-tight whitespace-nowrap"
                    style={{ color: textColor }}>
                  {t(title, title)}
                </h2>
                <div 
                  className="flex-1 h-[2px]"
                  style={{ backgroundColor: elegantBlue }}
                />
              </div>
            </div>
          )}

          {description && (
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg md:text-xl leading-relaxed font-light max-w-2xl mx-auto"
                 style={{ color: textSecondary }}>
                {t(description, description)}
              </p>
            </div>
          )}
        </div>

        {/* Liste des posts */}
        {posts && posts.length > 0 ? (
          <>
            {/* Posts en grille */}
            <div className="w-full mb-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, postsPerPage).map((post, index) => (
                  <article
                    key={post.id || index}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg border"
                    style={{ 
                      borderColor: 'rgba(59, 130, 246, 0.1)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(post);
                    }}
                  >
                    {/* Image de couverture */}
                    {post.featuredImage && (
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={post.featuredImage}
                          alt={t(post.title, post.title)}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {post.category && (
                          <div className="absolute top-4 left-4">
                            <span 
                              className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded"
                            >
                              {t(post.category, post.category)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contenu */}
                    <div className="p-6">
                      {/* Métadonnées */}
                      <div className="flex items-center space-x-4 text-xs mb-3"
                           style={{ color: textSecondary }}>
                        {post.date && (
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                        )}
                        {post.author && (
                          <div className="flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{t(post.author, post.author)}</span>
                          </div>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2 leading-tight"
                          style={{ color: textColor }}>
                        {t(post.title, post.title)}
                      </h3>

                      {/* Résumé */}
                      {post.summary && (
                        <p className="text-sm mb-3 line-clamp-3 leading-relaxed font-light"
                           style={{ color: textSecondary }}>
                          {t(post.summary, post.summary)}
                        </p>
                      )}

                      {/* Lien "Lire la suite" */}
                      <div 
                        className="flex items-center space-x-2 text-sm font-medium mt-4 cursor-pointer"
                        style={{ color: elegantBlue }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(post);
                        }}
                      >
                        <span>Lire la suite</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl" style={{ color: textSecondary }}>
              Aucune activité récente pour le moment. Revenez bientôt !
            </p>
          </div>
        )}
      </div>

      {/* Modale pour afficher le contenu détaillé */}
      {isModalOpen && selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}
          >
            {/* Bouton de fermeture */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Fermer la modale"
            >
              <X className="w-6 h-6" style={{ color: textColor }} />
            </button>

            {/* Image de couverture (si disponible) */}
            {selectedPost.featuredImage && (
              <div className="relative h-64 md:h-80 overflow-hidden bg-gray-100">
                <img
                  src={selectedPost.featuredImage}
                  alt={t(selectedPost.title, selectedPost.title)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Contenu de la modale */}
            <div className="p-8 md:p-12">
              {/* En-tête du post avec lignes décoratives */}
              <div className="mb-10">
                {selectedPost.category && (
                  <span 
                    className="inline-block px-3 py-1.5 bg-black text-white text-xs font-semibold mb-6 rounded"
                  >
                    {t(selectedPost.category, selectedPost.category)}
                  </span>
                )}
                
                {/* Titre avec lignes décoratives */}
                <div className="w-full mb-6">
                  <div className="flex items-center justify-center">
                    <div 
                      className="flex-1 h-[2px]"
                      style={{ backgroundColor: elegantBlue }}
                    />
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold px-6 md:px-8 leading-tight tracking-tight"
                        style={{ color: textColor }}>
                      {t(selectedPost.title, selectedPost.title)}
                    </h2>
                    <div 
                      className="flex-1 h-[2px]"
                      style={{ backgroundColor: elegantBlue }}
                    />
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="flex flex-wrap items-center justify-center space-x-6 text-sm"
                     style={{ color: textSecondary }}>
                  {selectedPost.date && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedPost.date)}</span>
                    </div>
                  )}
                  {selectedPost.author && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{t(selectedPost.author, selectedPost.author)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contenu complet */}
              <div className="prose prose-lg max-w-none">
                {renderPostContent(selectedPost)}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;

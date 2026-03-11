import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Check, Loader } from 'lucide-react';
import { useInlineEditor } from '../hooks/useInlineEditor';

const InlineImageEditor = ({
  sectionId,
  fieldPath,
  currentImageUrl = '',
  placeholder = 'Cliquez pour changer l\'image',
  className = '',
  style = {},
  width = '100%',
  height = 'auto',
  disabled = false,
  onImageChange
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const { updateSectionField } = useInlineEditor(sectionId);

  // Synchroniser previewUrl avec currentImageUrl quand il change (ex: suppression d'image)
  useEffect(() => {
    // Convertir null/undefined en chaîne vide pour la comparaison
    const normalizedCurrent = currentImageUrl || '';
    
    // Mettre à jour previewUrl seulement si currentImageUrl a changé
    setPreviewUrl(normalizedCurrent);
  }, [currentImageUrl]);

  const handleImageClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Convertir en base64 ou uploader vers un serveur
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result;
        setPreviewUrl(base64String);

        // Sauvegarder l'URL de l'image dans la section
        await updateSectionField(fieldPath, base64String);

        // Callback optionnel
        if (onImageChange) {
          onImageChange(base64String);
        }

        setIsUploading(false);
      };

      reader.onerror = () => {
        setError('Erreur lors de la lecture du fichier');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();

    try {
      setPreviewUrl('');
      await updateSectionField(fieldPath, '');

      if (onImageChange) {
        onImageChange('');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`inline-image-editor relative ${className}`}
      style={{
        width,
        height: height === 'auto' ? 'auto' : height,
        minHeight: '200px',
        cursor: disabled ? 'default' : 'pointer',
        ...style
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleImageClick}
    >
      {/* Image actuelle ou placeholder */}
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Section background"
          className="w-full h-full object-cover rounded-lg"
          style={{ opacity: isUploading ? 0.5 : 1 }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center p-8">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 font-medium">{placeholder}</p>
            <p className="text-sm text-gray-400 mt-2">Formats acceptés: JPG, PNG, GIF, WebP</p>
            <p className="text-sm text-gray-400">Taille max: 5MB</p>
          </div>
        </div>
      )}

      {/* Overlay au hover */}
      {isHovering && !disabled && !isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg transition-all duration-200">
          <div className="text-center text-white">
            <Upload className="w-12 h-12 mx-auto mb-3" />
            <p className="font-semibold text-lg">
              {previewUrl ? 'Changer l\'image' : 'Ajouter une image'}
            </p>
            <p className="text-sm opacity-90 mt-1">Cliquez pour sélectionner</p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
          <div className="text-center text-white">
            <Loader className="w-12 h-12 mx-auto mb-3 animate-spin" />
            <p className="font-semibold">Upload en cours...</p>
          </div>
        </div>
      )}

      {/* Bouton supprimer */}
      {previewUrl && isHovering && !disabled && !isUploading && (
        <button
          onClick={handleRemoveImage}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
          title="Supprimer l'image"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Success indicator */}
      {previewUrl && !isUploading && isHovering && (
        <div className="absolute top-4 left-4 bg-green-500 text-white rounded-full p-2 shadow-lg">
          <Check className="w-5 h-5" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default InlineImageEditor;

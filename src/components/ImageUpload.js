import React, { useState, useRef } from 'react';
import { Upload, Link, X, Image as ImageIcon, Eye } from 'lucide-react';

const ImageUpload = ({ 
  value = '', 
  onChange, 
  label = 'Image', 
  acceptedTypes = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  preview = true,
  className = ''
}) => {
  const [inputMethod, setInputMethod] = useState(value && value.startsWith('http') ? 'url' : 'upload');
  const [urlInput, setUrlInput] = useState(value && value.startsWith('http') ? value : '');
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Vérifier la taille
    if (file.size > maxSize) {
      alert(`Le fichier est trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    // Créer une URL de prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setPreviewUrl(base64);
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrlInput(url);
    setPreviewUrl(url);
    onChange(url);
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      setPreviewUrl(urlInput);
      onChange(urlInput);
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMethodChange = (method) => {
    setInputMethod(method);
    clearImage();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        
        {/* Sélecteur de méthode */}
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => handleMethodChange('upload')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputMethod === 'upload'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Upload size={16} />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={() => handleMethodChange('url')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputMethod === 'url'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Link size={16} />
            <span>URL</span>
          </button>
        </div>

        {/* Zone d'upload */}
        {inputMethod === 'upload' && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Glissez-déposez une image ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-500 mb-2">
              PNG, JPG, JPEG jusqu'à {Math.round(maxSize / 1024 / 1024)}MB
            </p>
            <p className="text-xs text-blue-600">
              💡 Astuce : Vous pouvez aussi utiliser des images gratuites d'Unsplash.com
            </p>
          </div>
        )}

        {/* Champ URL */}
        {inputMethod === 'url' && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="url"
                value={urlInput}
                onChange={handleUrlChange}
                onBlur={handleUrlSubmit}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Prévisualisation */}
      {preview && previewUrl && (
        <div className="relative">
          <div className="relative bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors z-10"
            >
              <X size={16} />
            </button>
            
            <img
              src={previewUrl}
              alt="Prévisualisation"
              className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            
            {/* Fallback en cas d'erreur de chargement */}
            <div className="hidden text-center py-8 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm">Impossible de charger l'image</p>
              <p className="text-xs text-gray-400 mt-1">{previewUrl}</p>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            {previewUrl.startsWith('data:') ? (
              <span>Image uploadée ({Math.round(previewUrl.length * 0.75 / 1024)}KB)</span>
            ) : (
              <span className="break-all">{previewUrl}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
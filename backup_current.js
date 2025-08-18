import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, Trash2, Palette } from 'lucide-react';
import { ChromePicker } from 'react-color';
import { v4 as uuidv4 } from 'uuid';
import { useSections } from '../../hooks/useSections';
import SectionRenderer from '../SectionRenderer';
import ImageUpload from '../ImageUpload';
import { useFlashMessage } from '../../hooks/useFlashMessage';
import FlashMessage from '../FlashMessage';
import LanguageInput from '../LanguageInput';
import { useLanguage } from '../../contexts/LanguageContext';

const ColorPicker = ({ label, color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium admin-text-secondary mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center space-x-2 w-full px-3 py-2 border rounded-lg hover:admin-bg-tertiary transition-colors"
          style={{ borderColor: 'var(--admin-border)' }}
        >
          <div
            className="w-6 h-6 rounded border"
            style={{ borderColor: 'var(--admin-border)' }}
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-mono">{color}</span>
        </button>
        
        {showPicker && (
          <div className="absolute top-full mt-2 z-10">
            <div
              className="fixed inset-0"
              onClick={() => setShowPicker(false)}
            />
            <ChromePicker
              color={color}
              onChange={(colorResult) => onChange(colorResult.hex)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureEditor = ({ features = [], onChange }) => {
  const { createMultilingualObject } = useLanguage();
  const iconOptions = [
    'Star', 'Shield', 'Zap', 'Globe', 'Settings', 'Heart', 
    'Award', 'CheckCircle', 'Target', 'User', 'Smartphone', 'Search'
  ];

  const addFeature = () => {
    const newFeature = {
      id: uuidv4(),
      title: createMultilingualObject('Nouvelle fonctionnalité'),
      description: createMultilingualObject('Description de la fonctionnalité'),
      icon: 'Star'
    };
    onChange([...features, newFeature]);
  };

  const updateFeature = (id, updates) => {
    const updatedFeatures = features.map(feature =>
      feature.id === id ? { ...feature, ...updates } : feature
    );
    onChange(updatedFeatures);
  };

  const removeFeature = (id) => {
    onChange(features.filter(feature => feature.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium admin-text-secondary">
          Fonctionnalités
        </label>
        <button
          type="button"
          onClick={addFeature}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={feature.id} className="admin-bg-tertiary rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium admin-text-secondary">
                Fonctionnalité {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeFeature(feature.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <LanguageInput
                  label="Titre"
                  value={feature.title || {}}
                  onChange={(value) => updateFeature(feature.id, { title: value })}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium admin-text-secondary mb-1">
                  Icône
                </label>
                <select
                  value={feature.icon}
                  onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <LanguageInput
                  label="Description"
                  value={feature.description || {}}
                  onChange={(value) => updateFeature(feature.id, { description: value })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        {features.length === 0 && (
          <div className="text-center py-8 admin-text-muted">
            <p className="text-sm mb-2">Aucune fonctionnalité ajoutée</p>
            <button
              type="button"
              onClick={addFeature}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Ajouter la première fonctionnalité
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ServiceEditor = ({ services = [], onChange }) => {
  const iconOptions = [
    'Code', 'Palette', 'TrendingUp', 'Headphones', 'Globe', 'Settings',
    'Smartphone', 'Zap', 'Shield', 'Star', 'Target', 'Award'
  ];

  const addService = () => {
    const newService = {
      id: uuidv4(),
      title: 'Nouveau service',
      description: 'Description du service',
      icon: 'Code'
    };
    onChange([...services, newService]);
  };

  const updateService = (id, updates) => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, ...updates } : service
    );
    onChange(updatedServices);
  };

  const removeService = (id) => {
    onChange(services.filter(service => service.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium admin-text-secondary">
          Services
        </label>
        <button
          type="button"
          onClick={addService}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={service.id} className="admin-bg-tertiary rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium admin-text-secondary">
                Service {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeService(service.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <LanguageInput
                  label="Titre"
                  value={service.title}
                  onChange={(value) => updateService(service.id, { title: value })}
                  placeholder="Titre du service"
                />
              </div>

              <div>
                <label className="block text-xs font-medium admin-text-secondary mb-1">
                  Icône
                </label>
                <select
                  value={service.icon}
                  onChange={(e) => updateService(service.id, { icon: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <LanguageInput
                  label="Description"
                  value={service.description}
                  onChange={(value) => updateService(service.id, { description: value })}
                  placeholder="Description du service"
                  type="textarea"
                />
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-8 admin-text-muted">
            <p className="text-sm mb-2">Aucun service ajouté</p>
            <button
              type="button"
              onClick={addService}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Ajouter le premier service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const GalleryEditor = ({ images = [], onChange }) => {
  const addImage = () => {
    const newImage = {
      id: uuidv4(),
      src: '',
      alt: 'Nouvelle image'
    };
    onChange([...images, newImage]);
  };

  const updateImage = (id, updates) => {
    const updatedImages = images.map(image =>
      image.id === id ? { ...image, ...updates } : image
    );
    onChange(updatedImages);
  };

  const removeImage = (id) => {
    onChange(images.filter(image => image.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium admin-text-secondary">
          Images de la galerie
        </label>
        <button
          type="button"
          onClick={addImage}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="space-y-6">
        {images.map((image, index) => (
          <div key={image.id} className="admin-bg-tertiary rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium admin-text-secondary">
                Image {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <ImageUpload
                label={`Image ${index + 1}`}
                value={image.src || ''}
                onChange={(value) => updateImage(image.id, { src: value })}
                maxSize={5 * 1024 * 1024} // 5MB
                preview={true}
              />
              
              <div>
                <LanguageInput
                  label="Texte alternatif (Alt)"
                  value={image.alt || {}}
                  onChange={(value) => updateImage(image.id, { alt: value })}
                  placeholder="Description de l'image"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="text-center py-8 admin-text-muted">
            <p className="text-sm mb-2">Aucune image ajoutée</p>
            <button
              type="button"
              onClick={addImage}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Ajouter la première image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TestimonialsEditor = ({ testimonials = [], onChange }) => {
  const addTestimonial = () => {
    const newTestimonial = {
      id: uuidv4(),
      name: 'Nouveau client',
      role: 'Poste',
      company: 'Entreprise',
      content: 'Témoignage du client...',
      rating: 5,
      avatar: ''
    };
    onChange([...testimonials, newTestimonial]);
  };

  const updateTestimonial = (id, updates) => {
    const updatedTestimonials = testimonials.map(testimonial =>
      testimonial.id === id ? { ...testimonial, ...updates } : testimonial
    );
    onChange(updatedTestimonials);
  };

  const removeTestimonial = (id) => {
    onChange(testimonials.filter(testimonial => testimonial.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium admin-text-secondary">
          Témoignages
        </label>
        <button
          type="button"
          onClick={addTestimonial}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Plus size={16} />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className="admin-bg-tertiary rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium admin-text-secondary">
                Témoignage {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeTestimonial(testimonial.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LanguageInput
                    label="Nom"
                    value={testimonial.name}
                    onChange={(value) => updateTestimonial(testimonial.id, { name: value })}
                    placeholder="Nom de la personne"
                  />
                </div>
                
                <div>
                  <LanguageInput
                    label="Poste"
                    value={testimonial.role}
                    onChange={(value) => updateTestimonial(testimonial.id, { role: value })}
                    placeholder="Poste occupé"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LanguageInput
                    label="Entreprise"
                    value={testimonial.company}
                    onChange={(value) => updateTestimonial(testimonial.id, { company: value })}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium admin-text-secondary mb-1">
                    Note (1-5 étoiles)
                  </label>
                  <select
                    value={testimonial.rating || 5}
                    onChange={(e) => updateTestimonial(testimonial.id, { rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 étoiles</option>
                    <option value={4}>4 étoiles</option>
                    <option value={3}>3 étoiles</option>
                    <option value={2}>2 étoiles</option>
                    <option value={1}>1 étoile</option>
                  </select>
                </div>
              </div>

              <div>
                <LanguageInput
                  label="Témoignage"
                  value={testimonial.content}
                  onChange={(value) => updateTestimonial(testimonial.id, { content: value })}
                  type="textarea"
                  placeholder="Le témoignage du client..."
                />
              </div>

              <ImageUpload
                label="Photo de profil"
                value={testimonial.avatar || ''}
                onChange={(value) => updateTestimonial(testimonial.id, { avatar: value })}
                maxSize={2 * 1024 * 1024} // 2MB pour les avatars
                preview={true}
              />
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-8 admin-text-muted">
            <p className="text-sm mb-2">Aucun témoignage ajouté</p>
            <button
              type="button"
              onClick={addTestimonial}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Ajouter le premier témoignage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionEditor = () => {
  const { id } = useParams();
  console.log('🚀 SectionEditor - Composant chargé avec ID:', id);
  
  const navigate = useNavigate();
  const { sections, updateSection } = useSections();
  const [section, setSection] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { message, showSuccess, showError, hideMessage } = useFlashMessage();
  const { createMultilingualObject, getLocalizedValue } = useLanguage();

  // Helper pour migrer les données existantes vers le format multilingue
  const migrateToMultilingual = useCallback((sectionData) => {
    const migrated = { ...sectionData };
    
    // Champs à migrer vers le format multilingue
    const textFields = ['title', 'subtitle', 'description', 'ctaTitle', 'ctaDescription', 'ctaButtonText', 'buttonText'];
    
    textFields.forEach(field => {
      if (migrated[field] && typeof migrated[field] === 'string') {
        // Si c'est une chaîne, la convertir en objet multilingue
        const multilingualValue = createMultilingualObject(migrated[field]);
        migrated[field] = multilingualValue;
      } else if (!migrated[field]) {
        // Si le champ n'existe pas, créer un objet vide
        migrated[field] = createMultilingualObject('');
      }
    });
    
    // Migrer les services si ils existent
    if (migrated.services && Array.isArray(migrated.services)) {
      migrated.services = migrated.services.map(service => {
        const migratedService = { ...service };
        ['title', 'description'].forEach(field => {
          if (migratedService[field] && typeof migratedService[field] === 'string') {
            migratedService[field] = createMultilingualObject(migratedService[field]);
          } else if (!migratedService[field]) {
            migratedService[field] = createMultilingualObject('');
          }
        });
        return migratedService;
      });
    }
    
    // Migrer les témoignages si ils existent
    if (migrated.testimonials && Array.isArray(migrated.testimonials)) {
      migrated.testimonials = migrated.testimonials.map(testimonial => {
        const migratedTestimonial = { ...testimonial };
        ['name', 'role', 'company', 'content'].forEach(field => {
          if (migratedTestimonial[field] && typeof migratedTestimonial[field] === 'string') {
            migratedTestimonial[field] = createMultilingualObject(migratedTestimonial[field]);
          } else if (!migratedTestimonial[field]) {
            migratedTestimonial[field] = createMultilingualObject('');
          }
        });
        return migratedTestimonial;
      });
    }
    
    return migrated;
  }, [createMultilingualObject]);

  useEffect(() => {
    console.log('🔍 SectionEditor Debug:');
    console.log('  - ID recherché:', id);
    console.log('  - Nombre de sections chargées:', sections.length);
    console.log('  - IDs des sections disponibles:', sections.map(s => s.id));
    
    const foundSection = sections.find(s => s.id === id);
    console.log('  - Section trouvée:', foundSection ? 'OUI' : 'NON');
    
    if (foundSection) {
      // Migrer automatiquement les données vers le format multilingue
      const migratedSection = migrateToMultilingual(foundSection);
      setSection(migratedSection);
      console.log('  - Section migrée et définie');
    } else if (sections.length > 0) {
      // Section non trouvée après chargement des sections
      console.log('  - ❌ Section non trouvée après chargement complet');
      console.log('  - IDs disponibles:', sections.map(s => ({ id: s.id, type: s.type })));
      // Ne pas rediriger immédiatement, laisser un message d'erreur
    } else {
      console.log('  - ⏳ Sections pas encore chargées, attente...');
    }
  }, [id, sections, navigate, migrateToMultilingual]);

  const handleChange = (field, value) => {
    setSection(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = React.useCallback(() => {
    if (section && hasChanges) {
      updateSection(section.id, section);
      setHasChanges(false);
      showSuccess('Section sauvegardée avec succès !');
    }
  }, [section, hasChanges, updateSection, showSuccess]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!section) {
    // Si les sections sont chargées mais la section n'est pas trouvée
    if (sections.length > 0) {
      return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Section non trouvée</h1>
            <p className="text-gray-600 mb-4">
              La section avec l'ID "{id}" n'existe pas.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Sections disponibles :</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {sections.map(s => (
                  <div key={s.id} className="flex justify-between">
                    <span>{s.type} - {s.title || 'Sans titre'}</span>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded">{s.id}</code>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/admin"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à la liste des sections
            </Link>
          </div>
        </div>
      );
    }
    
    // Sinon, afficher le loader
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la section...</p>
          <p className="text-sm text-gray-400 mt-2">ID: {id}</p>
          <p className="text-xs text-gray-400 mt-1">
            Sections chargées: {sections.length}
          </p>
        </div>
      </div>
    );
  }

  const getSectionTypeName = (type) => {
    const names = {
      hero: 'Hero Section',
      about: 'Section À Propos',
      services: 'Section Services',
      contact: 'Section Contact',
      gallery: 'Section Galerie',
      testimonials: 'Section Témoignages',
      cta: 'Call to Action'
    };
    return names[type] || type;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 admin-text-secondary hover:admin-text-primary"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold admin-text-primary">
              {getSectionTypeName(section.type)}
            </h1>
            <p className="admin-text-secondary">
              Modifiez le contenu et l'apparence de cette section
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-green-100 text-green-700' 
                : 'admin-bg-tertiary admin-text-secondary hover:bg-gray-200'
            }`}
          >
            <Eye size={20} />
            <span>Aperçu</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              hasChanges
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 admin-text-muted cursor-not-allowed'
            }`}
          >
            <Save size={20} />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-2">
          <div className="admin-card rounded-lg shadow-sm p-6" style={{ borderColor: 'var(--admin-border)' }}>
            <div className="space-y-6">
              {/* Basic Fields */}
              <div>
                <LanguageInput
                  label="Titre"
                  value={section.title || {}}
                  onChange={(value) => handleChange('title', value)}
                  placeholder="Saisissez le titre de la section..."
                  required
                />
              </div>

              {section.type === 'hero' && (
                <div>
                  <LanguageInput
                    label="Sous-titre"
                    value={section.subtitle || {}}
                    onChange={(value) => handleChange('subtitle', value)}
                    placeholder="Saisissez le sous-titre..."
                  />
                </div>
              )}

              <div>
                <LanguageInput
                  label="Description"
                  value={section.description || {}}
                  onChange={(value) => handleChange('description', value)}
                  placeholder="Décrivez cette section..."
                  type="textarea"
                />
              </div>

              {/* Section-specific fields */}
              {section.type === 'hero' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <LanguageInput
                          label="Texte du bouton principal"
                          value={section.buttonText}
                          onChange={(value) => handleChange('buttonText', value)}
                          placeholder="Texte du bouton"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-2">
                          Lien du bouton principal
                        </label>
                        <input
                          type="text"
                          value={section.buttonLink || ''}
                          onChange={(e) => handleChange('buttonLink', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <LanguageInput
                          label="Texte du bouton secondaire"
                          value={section.secondaryButtonText || {}}
                          onChange={(value) => handleChange('secondaryButtonText', value)}
                          placeholder="En savoir plus"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-2">
                          Lien du bouton secondaire
                        </label>
                        <input
                          type="text"
                          value={section.secondaryButtonLink || ''}
                          onChange={(e) => handleChange('secondaryButtonLink', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#about"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {section.type === 'about' && (
                <>
                  <FeatureEditor
                    features={section.features}
                    onChange={(features) => handleChange('features', features)}
                  />
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium admin-text-primary mb-4">Call-to-Action Section</h4>
                    <div className="space-y-4">
                      <div>
                        <LanguageInput
                          label="Titre du CTA"
                          value={section.ctaTitle || {}}
                          onChange={(value) => handleChange('ctaTitle', value)}
                          placeholder="Ready to get started?"
                        />
                      </div>
                      <div>
                        <LanguageInput
                          label="Description du CTA"
                          value={section.ctaDescription || {}}
                          onChange={(value) => handleChange('ctaDescription', value)}
                          placeholder="Contact us today and let's discuss how we can help your business grow."
                          type="textarea"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <LanguageInput
                            label="Texte du bouton"
                            value={section.ctaButtonText || {}}
                            onChange={(value) => handleChange('ctaButtonText', value)}
                            placeholder="Get Started"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Lien du bouton
                          </label>
                          <input
                            type="text"
                            value={section.ctaButtonLink || ''}
                            onChange={(e) => handleChange('ctaButtonLink', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#contact"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {section.type === 'services' && (
                <>
                  <ServiceEditor
                    services={section.services}
                    onChange={(services) => handleChange('services', services)}
                  />
                  
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium admin-text-primary mb-4">Call-to-Action Section</h4>
                    <div className="space-y-4">
                      <div>
                        <LanguageInput
                          label="Titre du CTA"
                          value={section.ctaTitle || {}}
                          onChange={(value) => handleChange('ctaTitle', value)}
                          placeholder="Un projet en tête ?"
                        />
                      </div>
                      <div>
                        <LanguageInput
                          label="Description du CTA"
                          value={section.ctaDescription || {}}
                          onChange={(value) => handleChange('ctaDescription', value)}
                          placeholder="Discutons de votre projet et voyons comment nous pouvons aider votre entreprise à se développer."
                          type="textarea"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <LanguageInput
                            label="Texte du bouton"
                            value={section.ctaButtonText || {}}
                            onChange={(value) => handleChange('ctaButtonText', value)}
                            placeholder="Commencer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Lien du bouton
                          </label>
                          <input
                            type="text"
                            value={section.ctaButtonLink || ''}
                            onChange={(e) => handleChange('ctaButtonLink', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#contact"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {section.type === 'contact' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Informations de contact centralisées
                      </h4>
                      <p className="text-sm text-blue-800 mb-2">
                        Les informations de contact (email, téléphone, adresse, horaires) sont maintenant gérées dans <strong>Paramètres du site → Contact</strong>.
                      </p>
                      <p className="text-sm text-blue-800">
                        Vous pouvez contrôler quelles informations afficher dans cette section depuis les paramètres du site.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {section.type === 'gallery' && (
                <>
                  <GalleryEditor
                    images={section.images || []}
                    onChange={(images) => handleChange('images', images)}
                  />
                  
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="text-sm font-medium admin-text-primary mb-4">Bouton de la galerie</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <LanguageInput
                          label="Texte du bouton"
                          value={section.ctaButtonText || {}}
                          onChange={(value) => handleChange('ctaButtonText', value)}
                          placeholder="Voir plus de projets"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-2">
                          Lien du bouton
                        </label>
                        <input
                          type="text"
                          value={section.ctaButtonLink || ''}
                          onChange={(e) => handleChange('ctaButtonLink', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#contact"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {section.type === 'testimonials' && (
                <>
                  <TestimonialsEditor
                    testimonials={section.testimonials || []}
                    onChange={(testimonials) => handleChange('testimonials', testimonials)}
                  />
                  
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-medium admin-text-primary mb-4">Bouton des témoignages</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <LanguageInput
                          label="Texte du bouton"
                          value={section.ctaButtonText || {}}
                          onChange={(value) => handleChange('ctaButtonText', value)}
                          placeholder="Rejoignez nos clients satisfaits"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-2">
                          Lien du bouton
                        </label>
                        <input
                          type="text"
                          value={section.ctaButtonLink || ''}
                          onChange={(e) => handleChange('ctaButtonLink', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#contact"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {section.type === 'cta' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <LanguageInput
                      label="Texte du bouton"
                      value={section.buttonText || {}}
                      onChange={(value) => handleChange('buttonText', value)}
                      placeholder="Texte du bouton"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Lien du bouton
                    </label>
                    <input
                      type="text"
                      value={section.buttonLink || ''}
                      onChange={(e) => handleChange('buttonLink', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Colors */}
          <div className="admin-card rounded-lg shadow-sm p-6" style={{ borderColor: 'var(--admin-border)' }}>
            <h3 className="flex items-center text-lg font-semibold admin-text-primary mb-4">
              <Palette className="w-5 h-5 mr-2" />
              Couleurs de la section
            </h3>
            {section.useGlobalStyles ? (
              <div className="text-center py-4">
                <div className="admin-text-muted text-sm">
                  Les styles globaux sont activés pour cette section.
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Décochez "Utiliser les styles globaux" pour personnaliser les couleurs.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ColorPicker
                  label="Couleur de fond"
                  color={section.backgroundColor || '#ffffff'}
                  onChange={(color) => handleChange('backgroundColor', color)}
                />
                
                <ImageUpload
                  label="Image de fond"
                  value={section.backgroundImage || ''}
                  onChange={(value) => handleChange('backgroundImage', value)}
                  maxSize={10 * 1024 * 1024} // 10MB pour les backgrounds
                  preview={true}
                />
                
                {section.backgroundImage && (
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Mode d'affichage de l'image
                    </label>
                    <select
                      value={section.backgroundSize || 'cover'}
                      onChange={(e) => handleChange('backgroundSize', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cover">Couvrir (cover)</option>
                      <option value="contain">Contenir (contain)</option>
                      <option value="auto">Taille automatique</option>
                      <option value="100% 100%">Étirer (100%)</option>
                    </select>
                  </div>
                )}
                
                {section.backgroundImage && (
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Position de l'image
                    </label>
                    <select
                      value={section.backgroundPosition || 'center center'}
                      onChange={(e) => handleChange('backgroundPosition', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="center center">Centre</option>
                      <option value="top center">Haut centre</option>
                      <option value="bottom center">Bas centre</option>
                      <option value="left center">Gauche centre</option>
                      <option value="right center">Droite centre</option>
                      <option value="top left">Haut gauche</option>
                      <option value="top right">Haut droite</option>
                      <option value="bottom left">Bas gauche</option>
                      <option value="bottom right">Bas droite</option>
                    </select>
                  </div>
                )}
                
                <ColorPicker
                  label="Couleur du texte"
                  color={section.textColor || '#374151'}
                  onChange={(color) => handleChange('textColor', color)}
                />
              </div>
            )}
          </div>

          {/* Custom CSS */}
          <div className="admin-card rounded-lg shadow-sm p-6" style={{ borderColor: 'var(--admin-border)' }}>
            <h3 className="text-lg font-semibold admin-text-primary mb-4">CSS Personnalisé</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">
                  Code CSS libre
                </label>
                <textarea
                  value={section.customCss || ''}
                  onChange={(e) => handleChange('customCss', e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="/* CSS personnalisé - !important automatique */&#10;background: linear-gradient(45deg, #ff6b6b, #4ecdc4);&#10;color: white;&#10;padding: 20px;&#10;border-radius: 10px;&#10;transform: scale(1.05);&#10;box-shadow: 0 10px 25px rgba(0,0,0,0.1)"
                />
                <p className="text-xs admin-text-muted mt-2">
                  <strong>!important automatique :</strong> Toutes les propriétés CSS saisies ici sont automatiquement prioritaires.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">🎯 Priorité des styles</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>1. <strong>CSS libre</strong> (cette zone) - ⚡ Auto !important</li>
                  {!section.useGlobalStyles ? (
                    <li>2. <strong>Styles de section</strong> (couleurs) - Priorité moyenne</li>
                  ) : (
                    <li>2. <em>Styles de section désactivés</em> (styles globaux activés)</li>
                  )}
                  <li>3. <strong>Styles globaux</strong> (design settings) - Priorité de base</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-yellow-300">
                  <div className="text-xs text-yellow-600 space-y-1">
                    <p>💡 Utilisez var(--color-primary) pour les variables globales</p>
                    <p>⚡ Pas besoin d'ajouter !important - c'est automatique !</p>
                    {section.useGlobalStyles && (
                      <p>🌐 Cette section utilise les styles globaux uniquement</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Status */}
          <div className="admin-card rounded-lg shadow-sm p-6" style={{ borderColor: 'var(--admin-border)' }}>
            <h3 className="text-lg font-semibold admin-text-primary mb-4">État</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm admin-text-secondary">
                  Afficher cette section sur le site
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={section.useGlobalStyles || false}
                  onChange={(e) => handleChange('useGlobalStyles', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm admin-text-secondary">
                  Utiliser les styles globaux
                </span>
              </label>
              
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">
                  Mode de navigation
                </label>
                <select
                  value={section.navigationMode || 'onepage'}
                  onChange={(e) => handleChange('navigationMode', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="onepage">Une seule page (scroll)</option>
                  <option value="newpage">Nouvelle page</option>
                </select>
                <p className="text-xs admin-text-muted mt-1">
                  Choisissez comment les liens vers cette section se comportent
                </p>
              </div>
              
              <div className="text-xs admin-text-muted">
                Position: {section.position + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="mt-8">
          <h2 className="text-xl font-bold admin-text-primary mb-4">Aperçu</h2>
          <div className="border rounded-lg overflow-hidden shadow-lg" style={{ borderColor: 'var(--admin-border)' }}>
            <SectionRenderer section={section} />
          </div>
        </div>
      )}
      
      {/* Flash Message */}
      <FlashMessage message={message} onClose={hideMessage} />
    </div>
  );
};

export default SectionEditor;
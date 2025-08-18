import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Version admin de LanguageInput avec vrais sélecteurs de langue
 */
const AdminLanguageInput = ({ 
  label, 
  value = {}, 
  onChange, 
  type = "input", 
  placeholder = "", 
  className = "",
  required = false 
}) => {
  const { getActiveLanguages, getDefaultLanguage } = useLanguage();
  const activeLanguages = getActiveLanguages();
  const defaultLanguage = getDefaultLanguage();
  
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage?.code || 'fr');
  
  // Utiliser les langues actives du contexte
  const languages = activeLanguages.map(lang => ({
    code: lang.code,
    name: lang.name,
    flag: lang.flag
  }));
  
  // Normaliser la valeur en objet multilingue pour toutes les langues actives
  const normalizedValue = (() => {
    if (typeof value === 'string') {
      // Si c'est une string, l'assigner à toutes les langues
      const obj = {};
      languages.forEach(lang => {
        obj[lang.code] = value;
      });
      return obj;
    }
    if (value && typeof value === 'object') {
      // Si c'est un objet, s'assurer que toutes les langues actives sont présentes
      const obj = {};
      languages.forEach(lang => {
        obj[lang.code] = value[lang.code] || '';
      });
      return obj;
    }
    // Valeur par défaut : objet vide pour toutes les langues
    const obj = {};
    languages.forEach(lang => {
      obj[lang.code] = '';
    });
    return obj;
  })();
  
  const handleChange = (newValue, lang) => {
    const updatedValue = {
      ...normalizedValue,
      [lang]: newValue
    };
    onChange(updatedValue);
  };

  const inputProps = {
    value: normalizedValue[activeLanguage] || '',
    onChange: (e) => handleChange(e.target.value, activeLanguage),
    className: `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`,
    placeholder,
    required
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium admin-text-secondary mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Input avec sélecteur de langue à côté */}
      <div className={`flex gap-2 ${type === "textarea" ? "items-start" : "items-center"}`}>
        {/* Input principal */}
        {type === "textarea" ? (
          <textarea
            {...inputProps}
            rows={4}
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
          />
        ) : (
          <input
            type="text"
            {...inputProps}
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
          />
        )}
        
        {/* Sélecteur de langue */}
        <select
          value={activeLanguage}
          onChange={(e) => setActiveLanguage(e.target.value)}
          className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[80px] flex-shrink-0 ${type === "textarea" ? "self-start" : ""}`}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.code.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      
      {/* Indicateur de contenu dans les autres langues */}
      <div className="flex items-center justify-between mt-1">
        <div className="text-xs text-gray-500">
          Édition en {languages.find(l => l.code === activeLanguage)?.name}
        </div>
        <div className="flex space-x-2">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`text-xs px-2 py-1 rounded ${
                normalizedValue[lang.code] 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {lang.flag} {normalizedValue[lang.code] ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLanguageInput;
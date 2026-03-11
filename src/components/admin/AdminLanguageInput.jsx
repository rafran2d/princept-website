import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContextDB';

// Fonction helper pour obtenir le drapeau à partir du code de langue
const getFlagFromCode = (code) => {
  const flagMap = {
    'fr': '🇫🇷',
    'en': '🇺🇸',
    'es': '🇪🇸',
    'it': '🇮🇹',
    'de': '🇩🇪',
    'pt': '🇵🇹',
    'ar': '🇸🇦',
    'ch': '🇨🇭',
    'jp': '🇯🇵',
    'kr': '🇰🇷',
    'sa': '🇸🇦',
    'ae': '🇦🇪',
    'eg': '🇪🇬',
    'ma': '🇲🇦',
    'tn': '🇹🇳',
    'jo': '🇯🇴',
    'lb': '🇱🇧',
    'iq': '🇮🇶',
    'kw': '🇰🇼',
    'om': '🇴🇲',
    'gb': '🇬🇧',
    'ru': '🇷🇺',
    'cn': '🇨🇳',
    'br': '🇧🇷',
    'nl': '🇳🇱',
    'se': '🇸🇪',
    'no': '🇳🇴',
    'dk': '🇩🇰',
    'fi': '🇫🇮',
    'pl': '🇵🇱',
    'tr': '🇹🇷',
    'gr': '🇬🇷'
  };
  
  return flagMap[code?.toLowerCase()] || '🌐';
};

// Fonction pour vérifier si un string est un emoji valide ou corrompu
const isValidEmoji = (str) => {
  if (!str) return false;
  // Vérifier si c'est un emoji corrompu (contient des caractères comme ð, Ÿ, etc.)
  if (/[ðŸ]/.test(str)) return false;
  // Vérifier si c'est un emoji valide (contient des caractères emoji)
  return /[\u{1F300}-\u{1F9FF}]|[\u{1F1E6}-\u{1F1FF}]{2}/u.test(str);
};

// Fonction pour obtenir le drapeau correct
const getCorrectFlag = (flag, code) => {
  // Si le drapeau est valide, l'utiliser
  if (isValidEmoji(flag)) {
    return flag;
  }
  // Sinon, générer à partir du code
  return getFlagFromCode(code);
};

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
  
  // Normaliser les valeurs depuis les props
  const getNormalizedValue = () => {
    if (typeof value === 'string') {
      // Ne pas assigner la même valeur à toutes les langues
      // La valeur string peut être une valeur par défaut ou une migration
      const obj = {};
      languages.forEach(lang => {
        obj[lang.code] = '';
      });
      // Assigner la valeur string seulement à la langue par défaut
      obj[defaultLanguage?.code || 'fr'] = value;
      return obj;
    }
    if (value && typeof value === 'object') {
      // Vérifier si c'est un objet corrompu (clés numériques)
      const keys = Object.keys(value);
      const hasNumericKeys = keys.some(key => !isNaN(key));
      
      if (hasNumericKeys || Array.isArray(value)) {
        // Objet corrompu détecté, essayer de récupérer les valeurs utilisables
        const obj = {};
        languages.forEach(lang => {
          obj[lang.code] = '';
        });
        
        // Essayer de récupérer les valeurs par langue
        if (value.fr && typeof value.fr === 'string') {
          obj.fr = value.fr;
        }
        if (value.en && typeof value.en === 'string') {
          obj.en = value.en;
        }
        
        // Si aucune valeur de langue trouvée, essayer la première valeur string disponible
        // mais seulement pour la langue par défaut
        if (!obj.fr && !obj.en && keys.length > 0) {
          const firstStringValue = Object.values(value).find(v => typeof v === 'string');
          if (firstStringValue) {
            obj[defaultLanguage?.code || 'fr'] = firstStringValue;
          }
        }
        
        return obj;
      }
      
      // Objet normal, s'assurer que toutes les langues actives sont présentes
      const obj = {};
      languages.forEach(lang => {
        let langValue = value[lang.code];
        
        // Si la valeur n'existe pas avec le code, essayer avec l'ID de la langue
        if (langValue === undefined) {
          const langById = languages.find(l => l.code === lang.code);
          if (langById && value[langById.code]) {
            langValue = value[langById.code];
          }
        }
        
        // Si c'est une string, l'utiliser directement
        if (typeof langValue === 'string') {
          obj[lang.code] = langValue;
        }
        // Si c'est un objet imbriqué, essayer d'extraire une valeur string
        else if (langValue && typeof langValue === 'object' && !Array.isArray(langValue)) {
          // Essayer fr ou en dans l'objet imbriqué
          const nestedValue = langValue.fr || langValue.en || Object.values(langValue).find(v => typeof v === 'string');
          obj[lang.code] = typeof nestedValue === 'string' ? nestedValue : '';
        }
        // Si c'est null ou undefined, utiliser une string vide
        else if (langValue === null || langValue === undefined) {
          obj[lang.code] = '';
        }
        // Sinon, convertir en string (mais logger un avertissement)
        else {
          obj[lang.code] = String(langValue || '');
        }
      });
      
      // Vérification finale : s'assurer qu'aucune valeur n'est un objet
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
          obj[key] = '';
        }
      });
      
      return obj;
    }
    // Valeur par défaut : objet vide pour toutes les langues
    const obj = {};
    languages.forEach(lang => {
      obj[lang.code] = '';
    });
    return obj;
  };

  // Utiliser directement les props normalisées
  const normalizedValue = getNormalizedValue();
  
  const handleChange = (newValue, lang) => {
    // Créer le nouvel objet avec la modification
    const updatedValues = {
      ...normalizedValue,
      [lang]: newValue
    };
    
    // Notifier le parent directement
    onChange(updatedValues);
  };

  // S'assurer que la valeur affichée est toujours une string
  const displayValue = normalizedValue[activeLanguage];
  const safeDisplayValue = typeof displayValue === 'string' ? displayValue : (displayValue ? String(displayValue) : '');
  
  const inputProps = {
    value: safeDisplayValue,
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
              {getCorrectFlag(lang.flag, lang.code)} {lang.code.toUpperCase()}
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
              {getCorrectFlag(lang.flag, lang.code)} {normalizedValue[lang.code] ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLanguageInput;
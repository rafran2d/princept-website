import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContextDB';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Code, Eye } from 'lucide-react';

// Fonctions helper pour gérer les drapeaux
const getFlagFromCode = (code) => {
  const flagMap = {
    'fr': '🇫🇷', 'en': '🇬🇧', 'es': '🇪🇸', 'de': '🇩🇪', 'it': '🇮🇹', 'pt': '🇵🇹',
    'ar': '🇸🇦', 'zh': '🇨🇳', 'ja': '🇯🇵', 'ko': '🇰🇷', 'ru': '🇷🇺', 'nl': '🇳🇱',
    'sv': '🇸🇪', 'no': '🇳🇴', 'da': '🇩🇰', 'fi': '🇫🇮', 'pl': '🇵🇱', 'tr': '🇹🇷',
    'el': '🇬🇷', 'he': '🇮🇱', 'hi': '🇮🇳', 'th': '🇹🇭', 'vi': '🇻🇳', 'id': '🇮🇩',
    'ms': '🇲🇾', 'cs': '🇨🇿', 'sk': '🇸🇰', 'hu': '🇭🇺', 'ro': '🇷🇴', 'bg': '🇧🇬',
    'hr': '🇭🇷', 'sr': '🇷🇸', 'sl': '🇸🇮', 'et': '🇪🇪', 'lv': '🇱🇻', 'lt': '🇱🇹',
    'uk': '🇺🇦', 'be': '🇧🇾', 'ka': '🇬🇪', 'hy': '🇦🇲', 'az': '🇦🇿', 'kk': '🇰🇿',
    'uz': '🇺🇿', 'mn': '🇲🇳', 'my': '🇲🇲', 'km': '🇰🇭', 'lo': '🇱🇦', 'ne': '🇳🇵',
    'bn': '🇧🇩', 'si': '🇱🇰', 'ta': '🇱🇰', 'te': '🇮🇳', 'ml': '🇮🇳', 'kn': '🇮🇳',
    'gu': '🇮🇳', 'pa': '🇮🇳', 'or': '🇮🇳', 'as': '🇮🇳', 'mr': '🇮🇳', 'sa': '🇮🇳',
    'af': '🇿🇦', 'sw': '🇹🇿', 'am': '🇪🇹', 'yo': '🇳🇬', 'ig': '🇳🇬', 'ha': '🇳🇬',
    'zu': '🇿🇦', 'xh': '🇿🇦', 'st': '🇿🇦', 'tn': '🇿🇦', 've': '🇿🇦', 'ts': '🇿🇦',
    'ss': '🇿🇦', 'nr': '🇿🇦', 'nso': '🇿🇦', 'zu': '🇿🇦', 'xh': '🇿🇦'
  };
  return flagMap[code?.toLowerCase()] || '🌐';
};

const isValidEmoji = (str) => {
  if (!str || typeof str !== 'string') return false;
  // Regex pour détecter les emojis (y compris les drapeaux)
  const emojiRegex = /^[\u{1F300}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]{2}$/u;
  return emojiRegex.test(str.trim());
};

const getCorrectFlag = (flag, code) => {
  if (isValidEmoji(flag)) {
    return flag;
  }
  return getFlagFromCode(code);
};

// Supprimer les avertissements findDOMNode en développement (provenant de react-quill)
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('findDOMNode') || args[0].includes('DOMNodeInserted'))
    ) {
      return; // Ignorer les avertissements findDOMNode de react-quill
    }
    originalError.apply(console, args);
  };
}

const RichTextEditor = ({ value = {}, onChange, placeholder = '', className = '' }) => {
  const { getActiveLanguages, currentAdminLanguage, setAdminLanguage } = useLanguage();
  const activeLanguages = getActiveLanguages();
  const currentLang = activeLanguages.find(lang => lang.id === currentAdminLanguage) || activeLanguages[0];
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');

  // Normaliser la valeur pour la langue courante
  const normalizedValue = useMemo(() => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value[currentLang.code] || value[currentLang.id] || value.fr || value.en || '';
    }
    return '';
  }, [value, currentLang]);

  // Synchroniser htmlSource quand on bascule vers le mode HTML
  useEffect(() => {
    if (showHtmlSource) {
      setHtmlSource(normalizedValue);
    }
  }, [showHtmlSource, normalizedValue]);

  const handleChange = (content) => {
    const newValue = {
      ...(typeof value === 'object' && value !== null ? value : {}),
      [currentLang.code]: content
    };
    onChange(newValue);
  };

  const handleHtmlSourceChange = (e) => {
    setHtmlSource(e.target.value);
  };

  const handleHtmlSourceSave = () => {
    handleChange(htmlSource);
    setShowHtmlSource(false);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Sélecteur de langue */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {activeLanguages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setAdminLanguage(lang.id)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                currentLang.id === lang.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCorrectFlag(lang.flag, lang.code)} {lang.name}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">
            Édition en {currentLang.name}
          </div>
          <button
            type="button"
            onClick={() => {
              if (showHtmlSource) {
                handleHtmlSourceSave();
              } else {
                setShowHtmlSource(true);
              }
            }}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-lg transition-colors ${
              showHtmlSource
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={showHtmlSource ? 'Sauvegarder et revenir à l\'éditeur visuel' : 'Éditer le HTML source'}
          >
            {showHtmlSource ? (
              <>
                <Eye size={16} />
                <span>Visuel</span>
              </>
            ) : (
              <>
                <Code size={16} />
                <span>HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Éditeur HTML source ou Quill */}
      {showHtmlSource ? (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Édition HTML source</span>
            <button
              type="button"
              onClick={handleHtmlSourceSave}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Sauvegarder
            </button>
          </div>
          <textarea
            value={htmlSource}
            onChange={handleHtmlSourceChange}
            placeholder={placeholder || 'Entrez votre HTML ici...'}
            className="w-full px-4 py-3 font-mono text-sm border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            style={{
              minHeight: '300px',
              fontFamily: 'monospace',
              lineHeight: '1.5'
            }}
          />
        </div>
      ) : (
        <ReactQuill
          theme="snow"
          value={normalizedValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{
            backgroundColor: 'white',
            minHeight: '300px'
          }}
        />
      )}

      {/* Indicateur de contenu dans les autres langues */}
      <div className="flex items-center justify-end space-x-2 mt-2">
        {activeLanguages.map((lang) => {
          const langValue = typeof value === 'object' && value !== null 
            ? (value[lang.code] || value[lang.id] || '')
            : '';
          const hasContent = langValue && langValue.trim() !== '' && langValue !== '<p><br></p>';
          return (
            <div
              key={lang.id}
              className={`text-xs px-2 py-1 rounded ${
                hasContent
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {getCorrectFlag(lang.flag, lang.code)} {hasContent ? '✓' : '✗'}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RichTextEditor;

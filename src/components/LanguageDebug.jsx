import React from 'react';
import { useLanguage } from '../contexts/LanguageContextDB';

const LanguageDebug = () => {
  const { 
    getActiveLanguages, 
    getAllLanguages, 
    getDefaultLanguage,
    toggleLanguage
  } = useLanguage();

  const activeLanguages = getActiveLanguages();
  const allLanguages = getAllLanguages();
  const defaultLanguage = getDefaultLanguage();

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h4 className="font-bold text-red-600 mb-2">Language Debug</h4>
      
      <div className="mb-3">
        <button 
          onClick={() => toggleLanguage('en')}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2"
        >
          Toggle English
        </button>
        <button 
          onClick={() => toggleLanguage('es')}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Toggle Spanish
        </button>
      </div>
      
      <div className="text-xs space-y-2">
        <div>
          <strong>Default:</strong> {defaultLanguage?.name || 'None'} ({defaultLanguage?.id})
        </div>
        
        <div>
          <strong>Active Languages ({activeLanguages.length}):</strong>
          <ul className="ml-2">
            {activeLanguages.map(lang => (
              <li key={lang.id}>
                {lang.flag} {lang.name} ({lang.id})
                {lang.isDefault && <span className="text-yellow-600"> [DEFAULT]</span>}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <strong>All Languages:</strong>
          <ul className="ml-2">
            {allLanguages.map(lang => (
              <li key={lang.id} className={lang.isActive ? 'text-green-600' : 'text-red-600'}>
                {lang.flag} {lang.name} ({lang.id}) - {lang.isActive ? 'ACTIVE' : 'INACTIVE'}
                {lang.isDefault && <span className="text-yellow-600"> [DEFAULT]</span>}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <strong>LocalStorage frontend-language:</strong> {localStorage.getItem('frontend-language') || 'None'}
        </div>
        
        <div>
          <strong>LocalStorage site-languages:</strong>
          <pre className="text-xs bg-gray-100 p-1 rounded">
            {JSON.stringify(JSON.parse(localStorage.getItem('site-languages') || '{}'), null, 1)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LanguageDebug;
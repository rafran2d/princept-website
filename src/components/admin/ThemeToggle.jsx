import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useAdminThemeAPI } from '../../contexts/AdminThemeContextAPI';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useAdminThemeAPI();

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
          ${isDark 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
        title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
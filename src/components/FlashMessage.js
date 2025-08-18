import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const FlashMessage = ({ message, onClose }) => {
  if (!message) return null;

  const { text, type } = message;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md w-full z-50 transform transition-all duration-500 ease-in-out`}>
      <div className={`border rounded-lg p-4 shadow-lg ${getStyles()}`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${getIconColor()}`}>
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              {text}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success' ? 'text-green-400 hover:text-green-600 focus:ring-green-500' :
                type === 'error' ? 'text-red-400 hover:text-red-600 focus:ring-red-500' :
                type === 'info' ? 'text-blue-400 hover:text-blue-600 focus:ring-blue-500' :
                'text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500'
              }`}
            >
              <span className="sr-only">Fermer</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashMessage;
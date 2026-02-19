import React, { useState } from 'react';
import { AlertTriangle, X, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DefaultPasswordAlert = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [showCredentials, setShowCredentials] = useState(false);

  // N'afficher l'alerte que si l'utilisateur utilise encore le mot de passe par défaut
  if (!user?.isDefaultPassword || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleToggleCredentials = () => {
    setShowCredentials(!showCredentials);
  };

  return (
    <div className="mx-6 mb-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-red-800 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Sécurité : Identifiants par défaut détectés
              </h3>
              <button
                onClick={handleDismiss}
                className="text-red-400 hover:text-red-600 transition-colors"
                title="Masquer temporairement"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-red-700 mb-3 text-sm leading-relaxed">
              <strong>Action requise :</strong> Vous utilisez encore les identifiants par défaut. 
              Pour sécuriser votre site, veuillez changer votre mot de passe immédiatement.
            </p>


            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.location.href = '/admin/user'}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <Shield className="w-4 h-4 mr-2" />
                Changer le mot de passe
              </button>
              
              <span className="text-xs text-red-600">
                Cette alerte disparaîtra après changement du mot de passe
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPasswordAlert;
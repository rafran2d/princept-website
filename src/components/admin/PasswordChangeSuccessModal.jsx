import React, { useState, useEffect } from 'react';
import { CheckCircle, Shield, Clock, Lock } from 'lucide-react';

const PasswordChangeSuccessModal = ({ onComplete }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 transform animate-scale-in">
        {/* En-tête de succès */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🎉 Mot de passe modifié avec succès !
          </h3>
          <p className="text-sm text-gray-600">
            Votre mot de passe a été mis à jour en toute sécurité
          </p>
        </div>

        {/* Mesures de sécurité */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Sécurité renforcée
              </h4>
              <p className="text-xs text-blue-700">
                Par mesure de sécurité, vous allez être déconnecté(e) automatiquement. 
                Vous devrez vous reconnecter avec votre nouveau mot de passe.
              </p>
            </div>
          </div>
        </div>

        {/* Compte à rebours */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Déconnexion automatique dans
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {countdown}
          </div>
          <div className="text-xs text-gray-500">
            secondes
          </div>
          
          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <Lock className="w-4 h-4 mr-2" />
            Se déconnecter maintenant
          </button>
          <p className="text-xs text-gray-500 text-center">
            Cette action se fera automatiquement dans {countdown} seconde{countdown > 1 ? 's' : ''}
          </p>
        </div>

        {/* Conseils de sécurité */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="text-xs font-medium text-yellow-800 mb-1">
            💡 Conseils de sécurité
          </h5>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Utilisez un mot de passe unique et complexe</li>
            <li>• Ne partagez jamais vos identifiants</li>
            <li>• Changez régulièrement votre mot de passe</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Styles pour l'animation
const styles = `
  @keyframes scale-in {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default PasswordChangeSuccessModal;
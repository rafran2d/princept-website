import React, { useState } from 'react';
import { AlertTriangle, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import PasswordChangeSuccessModal from './PasswordChangeSuccessModal';
import FlashMessage from '../FlashMessage';
import { useFlashMessage } from '../../hooks/useFlashMessage';

const ForcePasswordChange = () => {
  const { user, logout } = useAuth();
  const { message, showError, hideMessage } = useFlashMessage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('Tous les champs sont obligatoires');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      showError('Le nouveau mot de passe doit faire au moins 6 caractères');
      return;
    }

    if (newPassword === 'admin123') {
      showError('Vous ne pouvez pas utiliser "admin123" comme nouveau mot de passe');
      return;
    }

    setIsLoading(true);

    try {
      // Utiliser le service d'authentification
      await authService.changePassword({
        currentPassword,
        newPassword
      });

      // Mot de passe changé avec succès - Afficher le modal
      setShowSuccessModal(true);
      
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccessModal(false);
    logout();
  };

  // Si le modal de succès est affiché, l'afficher à la place du formulaire
  if (showSuccessModal) {
    return <PasswordChangeSuccessModal onComplete={handleSuccessComplete} />;
  }

  return (
    <>
      <FlashMessage message={message} onClose={hideMessage} />
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
        {/* En-tête d'alerte critique */}
        <div className="flex items-center mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-red-600 mr-3 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-red-800 mb-1">
              🚨 SÉCURITÉ CRITIQUE
            </h2>
            <p className="text-sm text-red-700">
              Mot de passe par défaut détecté ! Vous devez le changer immédiatement pour continuer.
            </p>
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="mb-6 p-3 bg-gray-50 rounded border">
          <p className="text-sm text-gray-600">
            <strong>Utilisateur :</strong> {user.username} ({user.role})
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Pour des raisons de sécurité, le navigation est bloquée jusqu'au changement du mot de passe.
          </p>
        </div>

        {/* Formulaire de changement de mot de passe */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mot de passe actuel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                placeholder="Entrez votre mot de passe actuel"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                placeholder="Nouveau mot de passe (min. 6 caractères)"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmation nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                placeholder="Confirmez le nouveau mot de passe"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Critères de sécurité */}
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border">
            <p className="font-medium mb-1">Critères de sécurité :</p>
            <ul className="space-y-1">
              <li className={newPassword.length >= 6 ? 'text-green-600' : ''}>
                • Au moins 6 caractères
              </li>
              <li className={newPassword !== 'admin123' ? 'text-green-600' : 'text-red-600'}>
                • Différent de "admin123"
              </li>
              <li className={newPassword === confirmPassword && newPassword ? 'text-green-600' : ''}>
                • Confirmation identique
              </li>
            </ul>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Modification en cours...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Changer le mot de passe maintenant
              </>
            )}
          </button>
        </form>

        {/* Avertissement */}
        <div className="mt-4 text-xs text-gray-500 text-center bg-yellow-50 p-2 rounded border">
          ⚠️ Après changement, vous serez automatiquement déconnecté(e) pour des raisons de sécurité.
        </div>
        </div>
      </div>
    </>
  );
};

export default ForcePasswordChange;
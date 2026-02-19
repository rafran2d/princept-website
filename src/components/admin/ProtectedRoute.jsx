import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Vérification des permissions</h2>
          <p className="text-gray-600">Authentification en cours...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si pas authentifié
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Rediriger si admin requis mais utilisateur pas admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">Vous n'avez pas les permissions administrateur.</p>
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Se reconnecter
          </button>
        </div>
      </div>
    );
  }

  // Afficher le contenu protégé
  return children;
};

export default ProtectedRoute;
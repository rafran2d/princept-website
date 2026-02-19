import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmer la suppression",
  subtitle = "Cette action est irréversible",
  message,
  itemName,
  warningMessage = "Cette action supprimera définitivement l'élément. Vous ne pourrez pas annuler cette opération.",
  confirmButtonText = "Supprimer définitivement"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop avec animation */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 overflow-hidden transform transition-all duration-300 scale-100">
          
          {/* Header avec dégradé rouge */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 relative">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-red-100 text-sm">{subtitle}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu */}
          <div className="px-6 py-6">
            {message && (
              <p className="admin-text-primary text-base leading-relaxed mb-2">
                {message}
              </p>
            )}
            {itemName && (
              <p className="font-bold admin-text-primary text-lg mb-4">
                "{itemName}" ?
              </p>
            )}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 text-sm font-medium">Attention</p>
                  <p className="text-amber-700 text-sm">
                    {warningMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-200"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-red-300 shadow-lg hover:shadow-xl"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
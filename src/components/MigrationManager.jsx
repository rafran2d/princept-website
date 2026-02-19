import React, { useState, useEffect } from 'react';
import migrationManager from '../utils/migrationManager';
import apiService from '../services/apiService';

const MigrationManager = () => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const migrationStatus = migrationManager.getStatus();
      const haStatus = await apiService.getHAStatus();
      
      setStatus(migrationStatus);
      setApiStatus(haStatus);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMigration = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await migrationManager.migrateAll();
      setMigrationResult(result);
      
      // Rafraîchir le statut
      await checkStatus();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await migrationManager.cleanupLocalStorage();
      setMigrationResult(result);
      
      // Rafraîchir le statut
      await checkStatus();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await migrationManager.restoreFromBackup();
      setMigrationResult(result);
      
      // Rafraîchir le statut
      await checkStatus();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!status) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Vérification du statut...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔄 Gestionnaire de Migration localStorage → API HA
      </h2>

      {/* Statut API */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📡 Statut du Système HA</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {apiStatus ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">API:</span>{' '}
                <span className={apiStatus.available ? 'text-green-600' : 'text-red-600'}>
                  {apiStatus.available ? '✅ Accessible' : '❌ Inaccessible'}
                </span>
              </div>
              <div>
                <span className="font-medium">Base:</span>{' '}
                <span className={apiStatus.mysql ? 'text-green-600' : 'text-yellow-600'}>
                  '💾 MySQL'
                </span>
              </div>
              <div>
                <span className="font-medium">Mode:</span>{' '}
                <span className={apiStatus.degraded ? 'text-yellow-600' : 'text-green-600'}>
                  {apiStatus.degraded ? '⚠️ Dégradé' : '✅ Normal'}
                </span>
              </div>
              {apiStatus.error && (
                <div className="col-span-2">
                  <span className="font-medium text-red-600">Erreur:</span>{' '}
                  <span className="text-red-600 text-sm">{apiStatus.error}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Vérification en cours...</p>
          )}
        </div>
      </div>

      {/* Statut Migration */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Statut de la Migration</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Migration:</span>{' '}
              <span className={status.isCompleted ? 'text-green-600' : 'text-yellow-600'}>
                {status.isCompleted ? '✅ Terminée' : '⏳ En attente'}
              </span>
            </div>
            <div>
              <span className="font-medium">Sauvegarde:</span>{' '}
              <span className={status.hasBackup ? 'text-green-600' : 'text-gray-600'}>
                {status.hasBackup ? '💾 Disponible' : '❌ Aucune'}
              </span>
            </div>
            {status.migrationDate && (
              <div className="md:col-span-2">
                <span className="font-medium">Date:</span>{' '}
                <span className="text-gray-600">
                  {status.migrationDate.toLocaleString('fr-FR')}
                </span>
              </div>
            )}
            {status.remainingLocalStorageKeys.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-medium text-orange-600">
                  LocalStorage restant ({status.remainingLocalStorageKeys.length}):</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {status.remainingLocalStorageKeys.map(key => (
                    <span key={key} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {!status.isCompleted && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🚀 Migration recommandée</h4>
            <p className="text-blue-700 text-sm mb-4">
              Votre application utilise encore localStorage. Migrez vers l'API HA pour bénéficier de la haute disponibilité.
            </p>
            <button
              onClick={handleMigration}
              disabled={isLoading || !apiStatus?.available}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '🔄 Migration en cours...' : '🚀 Démarrer la migration'}
            </button>
            {!apiStatus?.available && (
              <p className="text-red-600 text-sm mt-2">
                ⚠️ API non accessible - vérifiez que le serveur HA est démarré
              </p>
            )}
          </div>
        )}

        {status.isCompleted && status.needsCleanup && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">🧹 Nettoyage recommandé</h4>
            <p className="text-yellow-700 text-sm mb-4">
              Migration terminée ! Vous pouvez maintenant nettoyer localStorage pour libérer de l'espace.
            </p>
            <button
              onClick={handleCleanup}
              disabled={isLoading}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              {isLoading ? '🔄 Nettoyage...' : '🗑️ Nettoyer localStorage'}
            </button>
          </div>
        )}

        {status.isCompleted && status.remainingLocalStorageKeys.length === 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">🎉 Migration complète !</h4>
            <p className="text-green-700 text-sm">
              Votre application utilise maintenant entièrement l'API HA. 
              Toutes les données sont sécurisées et bénéficient de la haute disponibilité.
            </p>
          </div>
        )}

        {status.hasBackup && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">💾 Sauvegarde disponible</h4>
            <p className="text-gray-700 text-sm mb-4">
              Une sauvegarde de vos données localStorage est disponible en cas de problème.
            </p>
            <button
              onClick={handleRestore}
              disabled={isLoading}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {isLoading ? '🔄 Restauration...' : '🔄 Restaurer la sauvegarde'}
            </button>
          </div>
        )}
      </div>

      {/* Résultats */}
      {migrationResult && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">📊 Résultats de l'opération</h4>
          <pre className="text-xs text-gray-600 overflow-auto max-h-40">
            {JSON.stringify(migrationResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Erreurs */}
      {error && (
        <div className="mt-6 bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">❌ Erreur</h4>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Actions de rafraîchissement */}
      <div className="mt-6 text-center">
        <button
          onClick={checkStatus}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 text-sm"
        >
          🔄 Actualiser le statut
        </button>
      </div>
    </div>
  );
};

export default MigrationManager;
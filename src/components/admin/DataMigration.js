import React, { useState } from 'react';
import dataStorage from '../../utils/dataStorage';
import { Download, Upload, RefreshCw, Database, HardDrive } from 'lucide-react';

const DataMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState('');
  const [storageType, setStorageType] = useState(dataStorage.storageType);
  const [isLoading, setIsLoading] = useState(false);

  const handleStorageTypeChange = async (newType) => {
    setIsLoading(true);
    setMigrationStatus(`Changement vers ${newType}...`);
    
    try {
      // Sauvegarder les données actuelles avant le changement
      if (storageType === 'localStorage' && newType === 'json') {
        const result = await dataStorage.migrateToJSON();
        setMigrationStatus(`Migration vers JSON: ${result.success.length} réussies, ${result.failed.length} échouées`);
      } else if (storageType === 'json' && newType === 'localStorage') {
        const result = await dataStorage.migrateToLocalStorage();
        setMigrationStatus(`Migration vers localStorage: ${result.success.length} réussies, ${result.failed.length} échouées`);
      }
      
      dataStorage.setStorageType(newType);
      setStorageType(newType);
      
      // Recharger la page pour appliquer les changements
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      setMigrationStatus(`Erreur lors de la migration: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const handleExport = () => {
    try {
      dataStorage.exportAllData();
      setMigrationStatus('Export réussi - fichier téléchargé');
    } catch (error) {
      setMigrationStatus(`Erreur lors de l'export: ${error.message}`);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setMigrationStatus('Import en cours...');

    dataStorage.importFromFile(file)
      .then(result => {
        setMigrationStatus(`Import réussi: ${result.message} (${result.timestamp})`);
        // Recharger la page pour afficher les nouvelles données
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        setMigrationStatus(`Erreur lors de l'import: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
        // Reset input
        event.target.value = '';
      });
  };

  const checkJSONAvailability = async () => {
    setIsLoading(true);
    setMigrationStatus('Vérification de la disponibilité JSON...');
    
    const isAvailable = await dataStorage.checkJSONAvailability();
    setMigrationStatus(
      isAvailable 
        ? 'API JSON disponible ✓' 
        : 'API JSON non disponible - utilisation localStorage uniquement'
    );
    
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Migration des Données
      </h2>
      
      {/* Status */}
      {migrationStatus && (
        <div className={`p-4 mb-6 rounded-lg ${
          migrationStatus.includes('Erreur') 
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {migrationStatus}
        </div>
      )}

      {/* Type de stockage actuel */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Type de stockage actuel
        </h3>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center p-3 rounded-lg border-2 ${
            storageType === 'localStorage' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <HardDrive className="w-5 h-5 mr-2" />
            <span>localStorage (Navigateur)</span>
          </div>
          <div className={`flex items-center p-3 rounded-lg border-2 ${
            storageType === 'json' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <Database className="w-5 h-5 mr-2" />
            <span>JSON (Fichiers)</span>
          </div>
        </div>
      </div>

      {/* Actions de migration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Changer de type de stockage
          </h3>
          
          <button
            onClick={() => handleStorageTypeChange('json')}
            disabled={isLoading || storageType === 'json'}
            className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="w-5 h-5 mr-2" />
            Migrer vers JSON
          </button>
          
          <button
            onClick={() => handleStorageTypeChange('localStorage')}
            disabled={isLoading || storageType === 'localStorage'}
            className="w-full flex items-center justify-center p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HardDrive className="w-5 h-5 mr-2" />
            Migrer vers localStorage
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Import/Export
          </h3>
          
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="w-full flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="w-5 h-5 mr-2" />
            Exporter les données
          </button>
          
          <label className="w-full flex items-center justify-center p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            Importer des données
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {/* Test de connectivité */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Test de connectivité
        </h3>
        <button
          onClick={checkJSONAvailability}
          disabled={isLoading}
          className="flex items-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Tester l'API JSON
        </button>
      </div>

      {/* Informations */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">À propos des types de stockage :</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li><strong>localStorage :</strong> Données stockées dans le navigateur (par défaut)</li>
          <li><strong>JSON :</strong> Données stockées dans des fichiers JSON via API</li>
          <li><strong>Export/Import :</strong> Sauvegarde manuelle des données</li>
        </ul>
      </div>
    </div>
  );
};

export default DataMigration;
// Système de gestion de données avec support JSON et localStorage
class DataStorage {
  constructor() {
    this.storageType = 'localStorage'; // Retour à localStorage temporaire
    this.jsonEndpoint = '/api/data'; // Endpoint pour les opérations JSON
    // this.initializeStorage(); // Désactivé temporairement
  }

  // Initialiser le stockage et migrer les données si nécessaire
  async initializeStorage() {
    // Vérifier si l'API JSON est disponible
    const jsonAvailable = await this.checkJSONAvailability();
    
    if (!jsonAvailable) {
      this.storageType = 'localStorage';
      return;
    }

    // Migrer les données existantes de localStorage vers JSON
    await this.autoMigrateFromLocalStorage();
  }

  // Définir le type de stockage
  setStorageType(type) {
    if (['localStorage', 'json'].includes(type)) {
      this.storageType = type;
    }
  }

  // Charger les données
  async load(key) {
    if (this.storageType === 'localStorage') {
      return this.loadFromLocalStorage(key);
    } else if (this.storageType === 'json') {
      return await this.loadFromJSON(key);
    }
    return null;
  }

  // Sauvegarder les données
  async save(key, data) {
    if (this.storageType === 'localStorage') {
      return this.saveToLocalStorage(key, data);
    } else if (this.storageType === 'json') {
      return await this.saveToJSON(key, data);
    }
    return false;
  }

  // Charger depuis localStorage
  loadFromLocalStorage(key) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  // Sauvegarder vers localStorage
  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Charger depuis un fichier JSON
  async loadFromJSON(key) {
    try {
      const response = await fetch(`${this.jsonEndpoint}/${key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        // Fichier n'existe pas encore
        return null;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // Sauvegarder vers un fichier JSON
  async saveToJSON(key, data) {
    try {
      const response = await fetch(`${this.jsonEndpoint}/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Migrer les données de localStorage vers JSON
  async migrateToJSON() {
    const keys = ['onepress-sections', 'princept-site-settings'];
    const results = { success: [], failed: [] };

    for (const key of keys) {
      try {
        const data = this.loadFromLocalStorage(key);
        if (data) {
          const success = await this.saveToJSON(key, data);
          if (success) {
            results.success.push(key);
          } else {
            results.failed.push(key);
          }
        }
      } catch (error) {
        results.failed.push(key);
      }
    }

    return results;
  }

  // Migrer les données de JSON vers localStorage
  async migrateToLocalStorage() {
    const keys = ['onepress-sections', 'princept-site-settings'];
    const results = { success: [], failed: [] };

    for (const key of keys) {
      try {
        const data = await this.loadFromJSON(key);
        if (data) {
          const success = this.saveToLocalStorage(key, data);
          if (success) {
            results.success.push(key);
          } else {
            results.failed.push(key);
          }
        }
      } catch (error) {
        results.failed.push(key);
      }
    }

    return results;
  }

  // Exporter toutes les données vers un fichier JSON téléchargeable
  exportAllData() {
    const sections = this.loadFromLocalStorage('onepress-sections');
    const settings = this.loadFromLocalStorage('princept-site-settings');
    
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {
        sections,
        settings
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `princept-cms-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Importer des données depuis un fichier JSON
  async importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          if (importData.data) {
            // Importer les sections si présentes
            if (importData.data.sections) {
              this.saveToLocalStorage('onepress-sections', importData.data.sections);
            }
            
            // Importer les paramètres si présents
            if (importData.data.settings) {
              this.saveToLocalStorage('princept-site-settings', importData.data.settings);
            }
            
            resolve({
              success: true,
              message: 'Import réussi',
              timestamp: importData.timestamp,
              version: importData.version
            });
          } else {
            reject(new Error('Format de fichier invalide'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsText(file);
    });
  }

  // Vérifier la disponibilité du stockage JSON
  async checkJSONAvailability() {
    try {
      const response = await fetch(`${this.jsonEndpoint}/health`, {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Migration automatique depuis localStorage vers JSON
  async autoMigrateFromLocalStorage() {
    const keys = ['onepress-sections', 'princept-site-settings'];
    
    for (const key of keys) {
      try {
        // Vérifier si les données existent déjà en JSON
        const jsonData = await this.loadFromJSON(key);
        if (jsonData) {
          continue;
        }

        // Vérifier si des données existent en localStorage
        const localData = this.loadFromLocalStorage(key);
        if (localData) {
          const success = await this.saveToJSON(key, localData);
        }
      } catch (error) {
      }
    }
  }
}

// Instance globale
const dataStorage = new DataStorage();

export default dataStorage;
// Outil de récupération des données perdues
class DataRecovery {
  
  // Vérifier tout le localStorage
  checkLocalStorage() {
    console.log('=== DIAGNOSTIC LOCALSTORAGE ===');
    
    const keys = Object.keys(localStorage);
    console.log('Toutes les clés localStorage:', keys);
    
    // Vérifier les clés spécifiques
    const sectionsData = localStorage.getItem('onepress-sections');
    const settingsData = localStorage.getItem('princept-site-settings');
    
    console.log('onepress-sections:', sectionsData ? JSON.parse(sectionsData) : 'VIDE');
    console.log('princept-site-settings:', settingsData ? JSON.parse(settingsData) : 'VIDE');
    
    // Chercher d'autres clés similaires
    const relatedKeys = keys.filter(key => 
      key.includes('section') || 
      key.includes('princept') || 
      key.includes('onepress') ||
      key.includes('site')
    );
    
    console.log('Clés potentiellement liées:', relatedKeys);
    
    relatedKeys.forEach(key => {
      console.log(`${key}:`, localStorage.getItem(key));
    });
    
    return {
      allKeys: keys,
      sectionsData,
      settingsData,
      relatedKeys,
      hasData: !!(sectionsData || settingsData)
    };
  }
  
  // Restaurer des données d'urgence
  restoreEmergencyData() {
    console.log('=== RESTAURATION D\'URGENCE ===');
    
    const emergencySections = [
      {
        id: 'emergency-hero-' + Date.now(),
        type: 'hero',
        position: 0,
        title: 'Données Récupérées - Princept',
        subtitle: 'Vos données ont été restaurées',
        description: 'Cette section a été créée automatiquement pour restaurer votre site.',
        buttonText: 'En savoir plus',
        buttonLink: '#about',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        textColor: '#ffffff',
        backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3',
        enabled: true,
        navigationMode: 'onepage'
      },
      {
        id: 'emergency-about-' + Date.now(),
        type: 'about',
        position: 1,
        title: 'À Propos',
        description: 'Section restaurée automatiquement. Vous pouvez modifier ce contenu dans l\'administration.',
        features: [
          { id: 'f1-' + Date.now(), title: 'Récupération', description: 'Données restaurées', icon: 'RefreshCw' },
          { id: 'f2-' + Date.now(), title: 'Sauvegarde', description: 'Système sécurisé', icon: 'Shield' }
        ],
        backgroundColor: '#ffffff',
        textColor: '#374151',
        enabled: true,
        navigationMode: 'onepage'
      }
    ];
    
    const emergencySettings = {
      siteName: 'Princept CMS - Récupéré',
      siteTagline: 'Site restauré automatiquement',
      siteDescription: 'Données restaurées après incident technique',
      email: 'contact@example.com',
      phone: '+33 1 23 45 67 89',
      social: {
        facebook: { url: '', visible: false, label: 'Facebook' },
        twitter: { url: '', visible: false, label: 'Twitter' },
        instagram: { url: '', visible: false, label: 'Instagram' },
        linkedin: { url: '', visible: false, label: 'LinkedIn' }
      },
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6'
    };
    
    localStorage.setItem('onepress-sections', JSON.stringify(emergencySections));
    localStorage.setItem('princept-site-settings', JSON.stringify(emergencySettings));
    
    console.log('Données d\'urgence restaurées');
    return { sections: emergencySections, settings: emergencySettings };
  }
  
  // Chercher dans toutes les clés pour des patterns
  searchForBackups() {
    console.log('=== RECHERCHE DE SAUVEGARDES ===');
    
    const allKeys = Object.keys(localStorage);
    const backupKeys = [];
    
    // Patterns de recherche
    const patterns = [
      /backup/i,
      /old/i,
      /prev/i,
      /temp/i,
      /section.*\d/i,
      /princept.*\d/i,
      /onepress.*\d/i
    ];
    
    allKeys.forEach(key => {
      patterns.forEach(pattern => {
        if (pattern.test(key)) {
          backupKeys.push(key);
        }
      });
    });
    
    console.log('Sauvegardes potentielles trouvées:', backupKeys);
    
    backupKeys.forEach(key => {
      const data = localStorage.getItem(key);
      console.log(`Contenu de ${key}:`, data ? data.substring(0, 200) + '...' : 'VIDE');
    });
    
    return backupKeys;
  }
  
  // Exporter tout le localStorage pour analyse
  exportAllLocalStorage() {
    const allData = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      try {
        allData[key] = localStorage.getItem(key);
      } catch (error) {
        allData[key] = `ERREUR: ${error.message}`;
      }
    });
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Export localStorage terminé');
  }
}

// Fonction globale pour diagnostic immédiat
window.diagnoseData = () => {
  const recovery = new DataRecovery();
  const diagnostic = recovery.checkLocalStorage();
  
  if (!diagnostic.hasData) {
    console.warn('AUCUNE DONNÉE TROUVÉE - RESTAURATION D\'URGENCE');
    recovery.restoreEmergencyData();
    window.location.reload();
  }
  
  return diagnostic;
};

// Fonction pour restauration d'urgence
window.emergencyRestore = () => {
  const recovery = new DataRecovery();
  recovery.restoreEmergencyData();
  window.location.reload();
};

// Fonction pour rechercher des sauvegardes
window.searchBackups = () => {
  const recovery = new DataRecovery();
  return recovery.searchForBackups();
};

// Export pour analyse
window.exportLocalStorage = () => {
  const recovery = new DataRecovery();
  recovery.exportAllLocalStorage();
};

export default DataRecovery;
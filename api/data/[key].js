import fs from 'fs';
import path from 'path';

// Répertoire de stockage des données
const DATA_DIR = path.join(process.cwd(), 'data');

// S'assurer que le répertoire existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Fonction pour obtenir le chemin du fichier
const getFilePath = (key) => {
  const sanitizedKey = key.replace(/[^a-zA-Z0-9-_]/g, '');
  return path.join(DATA_DIR, `${sanitizedKey}.json`);
};

export default function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'Clé requise' });
  }

  const filePath = getFilePath(key);

  try {
    switch (req.method) {
      case 'GET':
        // Lire les données
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          res.status(200).json(data);
        } else {
          res.status(404).json({ error: 'Fichier non trouvé' });
        }
        break;

      case 'POST':
        // Sauvegarder les données
        const dataToSave = req.body;
        fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf8');
        res.status(200).json({ success: true, message: 'Données sauvegardées' });
        break;

      case 'DELETE':
        // Supprimer le fichier
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          res.status(200).json({ success: true, message: 'Fichier supprimé' });
        } else {
          res.status(404).json({ error: 'Fichier non trouvé' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
        break;
    }
  } catch (error) {
    console.error('Erreur API data:', error);
    res.status(500).json({ 
      error: 'Erreur interne du serveur',
      details: error.message 
    });
  }
}
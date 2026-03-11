const Language = require('../models/Language');

class LanguageController {
  // GET /api/languages - Récupérer toutes les langues
  static async getAllLanguages(req, res) {
    try {
      const languages = await Language.findAll();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // GET /api/languages/active - Récupérer les langues actives
  static async getActiveLanguages(req, res) {
    try {
      const languages = await Language.findActive();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // GET /api/languages/default - Récupérer la langue par défaut
  static async getDefaultLanguage(req, res) {
    try {
      const language = await Language.findDefault();
      if (!language) {
        return res.status(404).json({ error: 'Aucune langue par défaut trouvée' });
      }
      res.json(language);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // GET /api/languages/:id - Récupérer une langue par ID
  static async getLanguageById(req, res) {
    try {
      const { id } = req.params;
      const language = await Language.findById(id);
      
      if (!language) {
        return res.status(404).json({ error: 'Langue introuvable' });
      }
      
      res.json(language);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // POST /api/languages - Créer une nouvelle langue
  static async createLanguage(req, res) {
    try {
      const { id, name, code, flag, is_active, is_default, is_rtl, sort_order } = req.body;

      // Validation des champs requis
      if (!id || !name || !code) {
        return res.status(400).json({ 
          error: 'Les champs id, name et code sont obligatoires' 
        });
      }

      // Vérifier si l'ID ou le code existe déjà
      const existingById = await Language.findById(id);
      const existingByCode = await Language.findByCode(code);

      if (existingById) {
        return res.status(409).json({ error: 'Une langue avec cet ID existe déjà' });
      }

      if (existingByCode) {
        return res.status(409).json({ error: 'Une langue avec ce code existe déjà' });
      }

      const languageData = {
        id,
        name,
        code,
        flag: flag || '',
        is_active: is_active !== undefined ? is_active : true,
        is_default: is_default || false,
        is_rtl: is_rtl || false,
        sort_order: sort_order || 0
      };

      const newLanguage = await Language.create(languageData);
      res.status(201).json(newLanguage);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // PUT /api/languages/:id - Mettre à jour une langue
  static async updateLanguage(req, res) {
    try {
      const { id } = req.params;
      const { name, code, flag, is_active, is_default, is_rtl, sort_order } = req.body;

      // Vérifier si la langue existe
      const existingLanguage = await Language.findById(id);
      if (!existingLanguage) {
        return res.status(404).json({ error: 'Langue introuvable' });
      }

      // Vérifier si le nouveau code est déjà utilisé par une autre langue
      if (code && code !== existingLanguage.code) {
        const existingByCode = await Language.findByCode(code);
        if (existingByCode && existingByCode.id !== id) {
          return res.status(409).json({ error: 'Une langue avec ce code existe déjà' });
        }
      }

      const languageData = {
        name: name || existingLanguage.name,
        code: code || existingLanguage.code,
        flag: flag !== undefined ? flag : existingLanguage.flag,
        is_active: is_active !== undefined ? is_active : existingLanguage.is_active,
        is_default: is_default !== undefined ? is_default : existingLanguage.is_default,
        is_rtl: is_rtl !== undefined ? is_rtl : existingLanguage.is_rtl,
        sort_order: sort_order !== undefined ? sort_order : existingLanguage.sort_order
      };

      const updatedLanguage = await Language.update(id, languageData);
      res.json(updatedLanguage);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // PATCH /api/languages/:id/toggle - Basculer l'état actif/inactif
  static async toggleLanguage(req, res) {
    try {
      const { id } = req.params;
      const updatedLanguage = await Language.toggleActive(id);
      res.json(updatedLanguage);
    } catch (error) {
      if (error.message === 'Langue introuvable') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Impossible de désactiver la langue par défaut') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // PATCH /api/languages/:id/default - Définir comme langue par défaut
  static async setDefaultLanguage(req, res) {
    try {
      const { id } = req.params;
      const updatedLanguage = await Language.setAsDefault(id);
      res.json(updatedLanguage);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // DELETE /api/languages/:id - Supprimer une langue
  static async deleteLanguage(req, res) {
    try {
      const { id } = req.params;
      await Language.delete(id);
      res.json({ message: 'Langue supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Langue introuvable') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Impossible de supprimer la langue par défaut') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // PUT /api/languages/reorder - Réorganiser l'ordre des langues
  static async reorderLanguages(req, res) {
    try {
      const { languageOrder } = req.body;
      
      if (!Array.isArray(languageOrder)) {
        return res.status(400).json({ error: 'languageOrder doit être un tableau' });
      }

      const reorderedLanguages = await Language.reorder(languageOrder);
      res.json(reorderedLanguages);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = LanguageController;
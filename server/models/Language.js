const db = require('../config/database');

class Language {
  // Récupérer toutes les langues
  static async findAll() {
    const sql = 'SELECT * FROM languages ORDER BY sort_order ASC';
    return await db.query(sql);
  }

  // Récupérer les langues actives
  static async findActive() {
    const sql = 'SELECT * FROM languages WHERE is_active = TRUE ORDER BY sort_order ASC';
    return await db.query(sql);
  }

  // Récupérer la langue par défaut
  static async findDefault() {
    const sql = 'SELECT * FROM languages WHERE is_default = TRUE LIMIT 1';
    const results = await db.query(sql);
    return results[0] || null;
  }

  // Récupérer une langue par ID
  static async findById(id) {
    const sql = 'SELECT * FROM languages WHERE id = ?';
    const results = await db.query(sql, [id]);
    return results[0] || null;
  }

  // Récupérer une langue par code
  static async findByCode(code) {
    const sql = 'SELECT * FROM languages WHERE code = ?';
    const results = await db.query(sql, [code]);
    return results[0] || null;
  }

  // Créer une nouvelle langue
  static async create(languageData) {
    const { id, name, code, flag, is_active, is_default, is_rtl, sort_order } = languageData;
    
    // Si c'est la langue par défaut, désactiver les autres
    if (is_default) {
      await this.clearDefaultLanguage();
    }

    const sql = `
      INSERT INTO languages (id, name, code, flag, is_active, is_default, is_rtl, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.query(sql, [id, name, code, flag, is_active, is_default, is_rtl, sort_order]);
    return await this.findById(id);
  }

  // Mettre à jour une langue
  static async update(id, languageData) {
    const { name, code, flag, is_active, is_default, is_rtl, sort_order } = languageData;
    
    // Si c'est la langue par défaut, désactiver les autres
    if (is_default) {
      await this.clearDefaultLanguage();
    }

    const sql = `
      UPDATE languages 
      SET name = ?, code = ?, flag = ?, is_active = ?, is_default = ?, is_rtl = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await db.query(sql, [name, code, flag, is_active, is_default, is_rtl, sort_order, id]);
    return await this.findById(id);
  }

  // Basculer l'état actif/inactif
  static async toggleActive(id) {
    const language = await this.findById(id);
    if (!language) throw new Error('Langue introuvable');

    // Empêcher la désactivation de la langue par défaut
    if (language.is_default && language.is_active) {
      throw new Error('Impossible de désactiver la langue par défaut');
    }

    const sql = 'UPDATE languages SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await db.query(sql, [id]);
    return await this.findById(id);
  }

  // Définir comme langue par défaut
  static async setAsDefault(id) {
    // Désactiver toutes les langues par défaut
    await this.clearDefaultLanguage();
    
    // Activer la nouvelle langue par défaut (et la rendre active)
    const sql = `
      UPDATE languages 
      SET is_default = TRUE, is_active = TRUE, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await db.query(sql, [id]);
    return await this.findById(id);
  }

  // Supprimer une langue
  static async delete(id) {
    const language = await this.findById(id);
    if (!language) throw new Error('Langue introuvable');
    
    if (language.is_default) {
      throw new Error('Impossible de supprimer la langue par défaut');
    }

    const sql = 'DELETE FROM languages WHERE id = ?';
    await db.query(sql, [id]);
    return true;
  }

  // Réorganiser l'ordre des langues
  static async reorder(languageOrder) {
    for (let i = 0; i < languageOrder.length; i++) {
      const sql = 'UPDATE languages SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      await db.query(sql, [i + 1, languageOrder[i]]);
    }
    return await this.findAll();
  }

  // Fonction utilitaire : désactiver toutes les langues par défaut
  static async clearDefaultLanguage() {
    const sql = 'UPDATE languages SET is_default = FALSE WHERE is_default = TRUE';
    await db.query(sql);
  }
}

module.exports = Language;
const database = require('../config/database');

const SectionsController = {
  // GET /api/sections
  async getAll(req, res) {
    try {
      const { language_id, section_type, enabled_only } = req.query;
      let sql = 'SELECT * FROM sections';
      const conditions = [];
      const params = [];

      if (language_id) { conditions.push('language_id = ?'); params.push(language_id); }
      if (section_type) { conditions.push('section_type = ?'); params.push(section_type); }
      if (enabled_only === 'true') { conditions.push('is_enabled = 1'); }

      if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
      sql += ' ORDER BY sort_order ASC';

      const rows = await database.query(sql, params);
      // Parse section_data JSON
      const data = rows.map(row => ({
        ...row,
        section_data: row.section_data ? JSON.parse(row.section_data) : null
      }));
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // GET /api/sections/:id
  async getById(req, res) {
    try {
      const rows = await database.query('SELECT * FROM sections WHERE id = ?', [req.params.id]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: 'Section non trouvée' });
      }
      const row = rows[0];
      row.section_data = row.section_data ? JSON.parse(row.section_data) : null;
      res.json({ success: true, data: row });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/sections
  async create(req, res) {
    try {
      const { id, section_type, section_data, is_enabled, sort_order, language_id } = req.body;
      const sectionId = id || `section-${Date.now()}`;
      const dataStr = section_data ? JSON.stringify(section_data) : null;

      await database.run(
        'INSERT INTO sections (id, section_type, section_data, is_enabled, sort_order, language_id) VALUES (?, ?, ?, ?, ?, ?)',
        [sectionId, section_type, dataStr, is_enabled ?? 1, sort_order ?? 0, language_id || null]
      );

      res.status(201).json({ success: true, data: { id: sectionId, ...req.body } });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // PUT /api/sections/:id
  async update(req, res) {
    try {
      const { section_type, section_data, is_enabled, sort_order, language_id } = req.body;
      const dataStr = section_data ? JSON.stringify(section_data) : null;

      await database.run(
        'UPDATE sections SET section_type = ?, section_data = ?, is_enabled = ?, sort_order = ?, language_id = ? WHERE id = ?',
        [section_type, dataStr, is_enabled ?? 1, sort_order ?? 0, language_id || null, req.params.id]
      );

      res.json({ success: true, data: { id: req.params.id, ...req.body } });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // DELETE /api/sections/:id
  async delete(req, res) {
    try {
      await database.run('DELETE FROM sections WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Section supprimée' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = SectionsController;

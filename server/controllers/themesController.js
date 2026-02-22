const database = require('../config/database');

const ThemesController = {
  // GET /api/themes
  async getAll(req, res) {
    try {
      const rows = await database.query('SELECT * FROM custom_themes');
      const data = rows.map(row => ({
        ...row,
        theme_config: row.theme_config ? JSON.parse(row.theme_config) : null
      }));
      res.json({ success: true, data });
    } catch (error) {
      console.error('❌ Erreur getThemes:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/themes
  async create(req, res) {
    try {
      const { id, theme_name, theme_config, is_active } = req.body;
      const themeId = id || `theme-${Date.now()}`;
      const configStr = theme_config ? JSON.stringify(theme_config) : null;

      await database.run(
        'INSERT INTO custom_themes (id, theme_name, theme_config, is_active) VALUES (?, ?, ?, ?)',
        [themeId, theme_name, configStr, is_active ?? 0]
      );

      res.status(201).json({ success: true, data: { id: themeId, ...req.body } });
    } catch (error) {
      console.error('❌ Erreur createTheme:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // PATCH /api/themes/:id/activate
  async activate(req, res) {
    try {
      // Désactiver tous les thèmes
      await database.run('UPDATE custom_themes SET is_active = 0');
      // Activer le thème sélectionné
      await database.run('UPDATE custom_themes SET is_active = 1 WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: { id: req.params.id, is_active: 1 } });
    } catch (error) {
      console.error('❌ Erreur activateTheme:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = ThemesController;

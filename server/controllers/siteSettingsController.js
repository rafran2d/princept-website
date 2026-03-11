const database = require('../config/database');

const SiteSettingsController = {
  // GET /api/site-settings
  async getAll(req, res) {
    try {
      const rows = await database.query('SELECT * FROM site_settings');
      const data = {};
      rows.forEach(row => {
        let value = row.setting_value;
        if (row.setting_type === 'json') {
          try { value = JSON.parse(value); } catch {}
        } else if (row.setting_type === 'boolean') {
          value = value === 'true' || value === '1';
        } else if (row.setting_type === 'number') {
          value = Number(value);
        }
        data[row.setting_key] = value;
      });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/site-settings
  async set(req, res) {
    try {
      const { setting_key, setting_value, setting_type, description } = req.body;
      const valueStr = typeof setting_value === 'object' ? JSON.stringify(setting_value) : String(setting_value);

      await database.run(
        `INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_type = VALUES(setting_type), description = VALUES(description)`,
        [setting_key, valueStr, setting_type || 'string', description || null]
      );

      res.json({ success: true, data: { setting_key, setting_value } });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = SiteSettingsController;

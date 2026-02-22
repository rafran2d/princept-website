const database = require('../config/database');

const DesignSettingsController = {
  // GET /api/design-settings
  async getAll(req, res) {
    try {
      const rows = await database.query('SELECT * FROM design_settings');
      const data = {};
      rows.forEach(row => {
        try { data[row.setting_name] = JSON.parse(row.setting_value); } catch {
          data[row.setting_name] = row.setting_value;
        }
      });
      res.json({ success: true, data });
    } catch (error) {
      console.error('❌ Erreur getDesignSettings:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/design-settings
  async set(req, res) {
    try {
      const { setting_name, setting_value } = req.body;
      const valueStr = typeof setting_value === 'object' ? JSON.stringify(setting_value) : String(setting_value);

      await database.run(
        `INSERT INTO design_settings (setting_name, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [setting_name, valueStr]
      );

      res.json({ success: true, data: { setting_name, setting_value } });
    } catch (error) {
      console.error('❌ Erreur setDesignSetting:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = DesignSettingsController;

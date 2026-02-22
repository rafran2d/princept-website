const database = require('../config/database');

const UserPreferencesController = {
  // GET /api/user-preferences
  async getAll(req, res) {
    try {
      const rows = await database.query('SELECT * FROM user_preferences');
      const data = {};
      rows.forEach(row => {
        let value = row.preference_value;
        if (row.preference_type === 'json') {
          try { value = JSON.parse(value); } catch {}
        } else if (row.preference_type === 'boolean') {
          value = value === 'true' || value === '1';
        } else if (row.preference_type === 'number') {
          value = Number(value);
        }
        data[row.preference_key] = value;
      });
      res.json({ success: true, data });
    } catch (error) {
      console.error('❌ Erreur getUserPreferences:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/user-preferences
  async set(req, res) {
    try {
      const { preference_key, preference_value, preference_type } = req.body;
      const valueStr = typeof preference_value === 'object' ? JSON.stringify(preference_value) : String(preference_value);

      await database.run(
        `INSERT INTO user_preferences (preference_key, preference_value, preference_type)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE preference_value = VALUES(preference_value), preference_type = VALUES(preference_type)`,
        [preference_key, valueStr, preference_type || 'string']
      );

      res.json({ success: true, data: { preference_key, preference_value } });
    } catch (error) {
      console.error('❌ Erreur setUserPreference:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = UserPreferencesController;

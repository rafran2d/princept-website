const database = require('../config/database');

const BackupController = {
  async exportBackup(req, res) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      const backup = {
        meta: {
          version: '1.0',
          timestamp,
          source: 'MYSQL',
          dbType: 'mysql'
        },
        data: {}
      };

      backup.data.languages = await database.query('SELECT * FROM languages ORDER BY sort_order');
      backup.data.sections = await database.query('SELECT * FROM sections ORDER BY created_at');
      backup.data.site_settings = await database.query('SELECT * FROM site_settings ORDER BY setting_key');
      backup.data.custom_themes = await database.query('SELECT * FROM custom_themes ORDER BY created_at');

      try {
        backup.data.design_settings = await database.query('SELECT * FROM design_settings ORDER BY setting_name');
      } catch { backup.data.design_settings = []; }

      try {
        backup.data.user_preferences = await database.query('SELECT * FROM user_preferences ORDER BY preference_key');
      } catch { backup.data.user_preferences = []; }

      const stats = {
        languages: backup.data.languages.length,
        sections: backup.data.sections.length,
        site_settings: backup.data.site_settings.length,
        custom_themes: backup.data.custom_themes.length,
        design_settings: backup.data.design_settings.length,
        user_preferences: backup.data.user_preferences.length
      };

      backup.meta.stats = stats;
      backup.meta.totalRecords = Object.values(stats).reduce((sum, n) => sum + n, 0);

      const filename = `backup-princept-cms-${timestamp}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.json(backup);
    } catch (error) {
      res.status(500).json({ error: 'Erreur export backup', details: error.message });
    }
  },

  async getBackupInfo(req, res) {
    try {
      const languages = await database.query('SELECT COUNT(*) as count FROM languages');
      const sections = await database.query('SELECT COUNT(*) as count FROM sections');
      const site_settings = await database.query('SELECT COUNT(*) as count FROM site_settings');
      const custom_themes = await database.query('SELECT COUNT(*) as count FROM custom_themes');

      let design_settings = [{ count: 0 }];
      try { design_settings = await database.query('SELECT COUNT(*) as count FROM design_settings'); } catch {}

      let user_preferences = [{ count: 0 }];
      try { user_preferences = await database.query('SELECT COUNT(*) as count FROM user_preferences'); } catch {}

      const totals = {
        languages: languages[0].count,
        sections: sections[0].count,
        site_settings: site_settings[0].count,
        custom_themes: custom_themes[0].count,
        design_settings: design_settings[0].count,
        user_preferences: user_preferences[0].count
      };

      const totalRecords = Object.values(totals).reduce((a, b) => a + b, 0);
      const status = database.getStatus();

      res.json({
        database: {
          type: 'MYSQL',
          status: status.isConnected ? 'PRIMARY' : 'DOWN',
          isHealthy: status.isConnected
        },
        tables: totals,
        meta: {
          totalRecords,
          timestamp: new Date().toISOString(),
          backupReady: true
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur info backup', details: error.message });
    }
  }
};

module.exports = BackupController;

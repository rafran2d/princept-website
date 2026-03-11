const database = require('../config/database');

const StatsController = {
  async getStats(req, res) {
    try {
      const status = database.getStatus();
      const startTime = Date.now();

      await database.query('SELECT 1');
      const dbResponseTime = Date.now() - startTime;

      const langStats = await database.query(
        'SELECT COUNT(*) as total, COUNT(CASE WHEN is_active = 1 THEN 1 END) as active FROM languages'
      );
      const secStats = await database.query(
        'SELECT COUNT(*) as total, COUNT(CASE WHEN is_enabled = 1 THEN 1 END) as enabled FROM sections'
      );
      const themeStats = await database.query('SELECT COUNT(*) as total FROM custom_themes');
      const settingsStats = await database.query('SELECT COUNT(*) as total FROM site_settings');

      const mem = process.memoryUsage();

      res.json({
        system: {
          database: {
            currentDatabase: 'mysql',
            isConnected: status.isConnected,
            isError: status.isError,
            monitoringActive: status.isMonitoring,
            uptime: process.uptime()
          },
          performance: {
            dbResponseTime: `${dbResponseTime}ms`,
            memoryUsage: {
              rss: Math.round(mem.rss / 1024 / 1024) + ' MB',
              heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + ' MB',
              heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + ' MB'
            },
            nodeVersion: process.version,
            platform: process.platform
          }
        },
        data: {
          languages: { total: langStats[0].total, active: langStats[0].active },
          sections: { total: secStats[0].total, enabled: secStats[0].enabled || 0 },
          themes: { total: themeStats[0].total },
          settings: { total: settingsStats[0].total }
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          apiEndpoint: '/api/stats'
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur génération stats', details: error.message });
    }
  },

  async getDetailedStats(req, res) {
    try {
      const status = database.getStatus();

      const languageDetails = await database.query(`
        SELECT
          COUNT(*) as total,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as active,
          COUNT(CASE WHEN is_default = 1 THEN 1 END) as default_count,
          COUNT(CASE WHEN is_rtl = 1 THEN 1 END) as rtl_count
        FROM languages
      `);

      const sectionTypes = await database.query(`
        SELECT
          section_type,
          COUNT(*) as count,
          COUNT(CASE WHEN is_enabled = 1 THEN 1 END) as enabled
        FROM sections
        GROUP BY section_type
      `);

      const themeUsage = await database.query(`
        SELECT
          COUNT(*) as total_themes,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_themes
        FROM custom_themes
      `);

      const summary = sectionTypes.reduce((acc, t) => ({
        totalTypes: acc.totalTypes + 1,
        totalSections: acc.totalSections + t.count,
        enabledSections: acc.enabledSections + t.enabled
      }), { totalTypes: 0, totalSections: 0, enabledSections: 0 });

      res.json({
        languages: {
          overview: languageDetails[0],
          distribution: {
            activePercent: languageDetails[0].total
              ? Math.round((languageDetails[0].active / languageDetails[0].total) * 100)
              : 0,
            rtlSupport: languageDetails[0].rtl_count > 0
          }
        },
        sections: {
          byType: sectionTypes,
          summary
        },
        themes: {
          usage: themeUsage[0],
          utilizationRate: themeUsage[0].total_themes > 0
            ? Math.round((themeUsage[0].active_themes / themeUsage[0].total_themes) * 100)
            : 0
        },
        database: {
          type: 'mysql',
          connected: status.isConnected,
          monitoring: status.isMonitoring
        },
        meta: {
          timestamp: new Date().toISOString(),
          generatedBy: 'Stats API v1.0'
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur stats détaillées', details: error.message });
    }
  }
};

module.exports = StatsController;

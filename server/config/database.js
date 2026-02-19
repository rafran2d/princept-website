const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
    this.initialized = false;
    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      this.initMySQL();
      const connected = await this.testConnection();
      if (connected) {
        console.log('✅ Utilisation de MySQL');
        this.initialized = true;
      }
    } catch (error) {
      console.error('❌ Erreur initialisation base:', error.message);
    }
  }

  initMySQL() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3310,
      user: process.env.DB_USER || 'princept_website_user',
      password: process.env.DB_PASSWORD || 'princept_website_pass456',
      database: process.env.DB_NAME || 'princept_website',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 10000,
      timeout: 10000,
    });
  }

  // Exécuter une requête
  async query(sql, params = []) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Erreur base de données:', error);
      throw error;
    }
  }

  // Exécuter une requête de modification
  async run(sql, params = []) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Erreur base de données:', error);
      throw error;
    }
  }

  // Tester la connexion
  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      console.log('✅ Connexion MySQL réussie');
      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Erreur connexion:', error.message);
      return false;
    }
  }

  // Fermer le pool de connexions
  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

// Instance singleton
const database = new Database();

module.exports = database;

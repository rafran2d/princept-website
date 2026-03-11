const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
    this.initialized = false;
    this.isMonitoring = false;
    this.currentStatus = 'disconnected';
    this.healthInterval = null;
  }

  async initialize() {
    await this.connectMySQL();
    this.startHealthMonitoring();
  }

  async connectMySQL(retries = 5, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (attempt > 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        if (this.pool) {
          try { await this.pool.end(); } catch (_) {}
        }

        this.pool = mysql.createPool({
          host: process.env.DB_HOST,
          port: process.env.DB_PORT || 3306,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          charset: 'utf8mb4',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          acquireTimeout: 10000,
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
        });

        const connection = await this.pool.getConnection();
        await connection.ping();
        connection.release();

        this.initialized = true;
        this.currentStatus = 'connected';
        return true;
      } catch (error) {
        if (attempt === retries) {
          this.currentStatus = 'error';
          throw new Error(`MySQL unavailable after ${retries} attempts: ${error.message}`);
        }
      }
    }
  }

  startHealthMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    this.healthInterval = setInterval(async () => {
      try {
        if (this.currentStatus === 'connected') {
          const connection = await this.pool.getConnection();
          await connection.ping();
          connection.release();
        } else {
          try {
            await this.connectMySQL();
          } catch (_) {}
        }
      } catch (_) {
        this.currentStatus = 'error';
      }
    }, 30000);
  }

  async query(sql, params = []) {
    const [results] = await this.pool.execute(sql, params);
    return results;
  }

  async run(sql, params = []) {
    const [results] = await this.pool.execute(sql, params);
    return results;
  }

  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      connection.release();
      return true;
    } catch (_) {
      return false;
    }
  }

  getStatus() {
    return {
      currentDB: this.currentStatus,
      isConnected: this.currentStatus === 'connected',
      isError: this.currentStatus === 'error',
      isMonitoring: this.isMonitoring,
    };
  }

  async close() {
    this.isMonitoring = false;
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
    }
    if (this.pool) {
      await this.pool.end();
    }
  }
}

const database = new Database();

module.exports = database;

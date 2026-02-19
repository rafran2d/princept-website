const mysql = require('mysql2/promise');
const EventEmitter = require('events');

class DatabaseHA extends EventEmitter {
  constructor() {
    super();
    
    this.primaryDB = null;      // MySQL pool
    this.currentDB = 'unknown'; // 'mysql', 'error'
    this.isMonitoring = false;
    this.lastSyncTime = null;
    
    this.config = {
      mysql: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3310,
        user: process.env.DB_USER || 'princept_website_user',
        password: process.env.DB_PASSWORD || 'princept_website_pass456',
        database: process.env.DB_NAME || 'princept_website',
        acquireTimeout: 3000,
        timeout: 3000,
        reconnectDelay: 5000,    // Temps avant retry MySQL
        healthCheckInterval: 10000, // Vérification santé MySQL
      }
    };
    
    this.initialize();
  }

  async initialize() {
    console.log('🏥 Initialisation système MySQL...');
    
    // Connecter MySQL
    await this.connectMySQL();
    
    // Démarrer le monitoring
    this.startHealthMonitoring();
    
    this.emit('initialized', this.currentDB);
  }

  async connectMySQL(retries = 5, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`🔄 Tentative de connexion MySQL (${attempt}/${retries})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.log('🔍 Tentative de connexion MySQL...');
        }
        
        // Fermer l'ancien pool si nécessaire
        if (this.primaryDB) {
          try {
            await this.primaryDB.end();
          } catch (error) {
            console.log('⚠️ Erreur fermeture pool MySQL:', error.message);
          }
        }

        this.primaryDB = mysql.createPool({
          host: this.config.mysql.host,
          port: this.config.mysql.port,
          user: this.config.mysql.user,
          password: this.config.mysql.password,
          database: this.config.mysql.database,
          charset: 'utf8mb4',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          acquireTimeout: this.config.mysql.acquireTimeout,
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
        });

        // Tester la connexion avec un timeout
        const connection = await Promise.race([
          this.primaryDB.getConnection(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout de connexion')), 5000)
          )
        ]);
        
        // Configurer l'encodage UTF-8 pour cette connexion
        await connection.execute('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
        await connection.ping();
        connection.release();

        this.currentDB = 'mysql';
        
        console.log('✅ MySQL connecté');
        this.emit('mysql_connected');

        return true;
      } catch (error) {
        if (attempt === retries) {
          console.error(`❌ MySQL connexion échouée après ${retries} tentatives: ${error.message}`);
          console.error(`   Host: ${this.config.mysql.host}:${this.config.mysql.port}`);
          console.error(`   Database: ${this.config.mysql.database}`);
          console.error(`   User: ${this.config.mysql.user}`);
          this.currentDB = 'error';
          this.emit('mysql_disconnected', error);
          throw new Error(`MySQL indisponible - ${error.message}`);
        }
        console.log(`⚠️ Tentative ${attempt} échouée: ${error.message}`);
      }
    }
  }

  startHealthMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('💓 Monitoring de santé démarré');

    setInterval(async () => {
      await this.healthCheck();
    }, this.config.mysql.healthCheckInterval);
  }

  async healthCheck() {
    try {
      if (this.currentDB === 'mysql') {
        // Vérifier si MySQL est toujours vivant
        const connection = await this.primaryDB.getConnection();
        await connection.ping();
        connection.release();
        // MySQL OK
      } else if (this.currentDB === 'error') {
        // Tenter de reconnecter à MySQL
        try {
          await this.connectMySQL();
          console.log('🔄 MySQL reconnecté automatiquement');
        } catch (error) {
          // Connexion échouée, on reste en erreur
        }
      }
    } catch (error) {
      if (this.currentDB === 'mysql') {
        console.error('💔 MySQL déconnecté');
        this.currentDB = 'error';
        this.emit('mysql_disconnected', error);
      }
    }
  }


  async query(sql, params = []) {
    if (this.currentDB !== 'mysql') {
      throw new Error('MySQL non disponible');
    }
    
    try {
      // S'assurer que la connexion utilise utf8mb4
      await this.primaryDB.execute('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
      const [results] = await this.primaryDB.execute(sql, params);
      return results;
    } catch (error) {
      console.error('❌ Erreur requête MySQL:', error.message);
      this.currentDB = 'error';
      this.emit('mysql_disconnected', error);
      throw error;
    }
  }

  async execute(sql, params = []) {
    if (this.currentDB !== 'mysql') {
      throw new Error('MySQL non disponible');
    }
    
    try {
      // S'assurer que la connexion utilise utf8mb4
      await this.primaryDB.execute('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
      const [results] = await this.primaryDB.execute(sql, params);
      return results;
    } catch (error) {
      console.error('❌ Erreur exécution MySQL:', error.message);
      this.currentDB = 'error';
      this.emit('mysql_disconnected', error);
      throw error;
    }
  }


  getStatus() {
    return {
      currentDB: this.currentDB,
      isMySQL: this.currentDB === 'mysql',
      isError: this.currentDB === 'error',
      lastSyncTime: this.lastSyncTime,
      isMonitoring: this.isMonitoring,
    };
  }

  async close() {
    console.log('🔄 Fermeture système MySQL...');
    this.isMonitoring = false;
    
    if (this.primaryDB) {
      await this.primaryDB.end();
    }
    
    console.log('✅ Système MySQL fermé');
  }
}

module.exports = DatabaseHA;
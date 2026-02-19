const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3003;

// Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL uniquement
let mysqlPool = null;

async function initializeDatabase() {
  console.log('🔍 Connexion MySQL...');
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3310,
    user: process.env.DB_USER || 'princept_website_user',
    password: process.env.DB_PASSWORD || 'princept_website_pass456',
    database: process.env.DB_NAME || 'princept_website',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 5000,
    timeout: 5000,
  });

  const connection = await mysqlPool.getConnection();
  await connection.ping();
  connection.release();
  console.log('✅ MySQL connecté');
}

async function query(sql, params = []) {
  const [results] = await mysqlPool.execute(sql, params);
  return results;
}

async function execute(sql, params = []) {
  const [results] = await mysqlPool.execute(sql, params);
  return results;
}

// Routes

app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysqlPool.getConnection();
    const [rows] = await connection.execute('SELECT VERSION() as version');
    connection.release();
    res.json({
      status: 'OK',
      database: 'MySQL Connected',
      dbType: 'mysql',
      dbInfo: { version: rows[0].version },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      dbType: 'mysql',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/languages', async (req, res) => {
  try {
    const languages = await query('SELECT * FROM languages ORDER BY sort_order ASC');
    res.json(languages);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/languages/active', async (req, res) => {
  try {
    const languages = await query('SELECT * FROM languages WHERE is_active = 1 ORDER BY sort_order ASC');
    res.json(languages);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/languages/default', async (req, res) => {
  try {
    const languages = await query('SELECT * FROM languages WHERE is_default = 1 LIMIT 1');
    if (languages.length === 0) {
      return res.status(404).json({ error: 'Aucune langue par défaut trouvée' });
    }
    res.json(languages[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/languages', async (req, res) => {
  try {
    const { id, name, code, flag, is_active, is_default, is_rtl, sort_order } = req.body;

    if (!id || !name || !code) {
      return res.status(400).json({ error: 'Les champs id, name et code sont obligatoires' });
    }

    if (is_default) {
      await execute('UPDATE languages SET is_default = 0 WHERE is_default = 1');
    }

    await execute(
      'INSERT INTO languages (id, name, code, flag, is_active, is_default, is_rtl, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, code || '', flag || '', is_active !== undefined ? (is_active ? 1 : 0) : 1, is_default ? 1 : 0, is_rtl ? 1 : 0, sort_order || 0]
    );

    const created = await query('SELECT * FROM languages WHERE id = ?', [id]);
    res.status(201).json(created[0]);
  } catch (error) {
    console.error('Erreur:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Une langue avec cet ID ou code existe déjà' });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
});

app.patch('/api/languages/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM languages WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Langue introuvable' });
    }
    if (existing[0].is_default && existing[0].is_active) {
      return res.status(400).json({ error: 'Impossible de désactiver la langue par défaut' });
    }
    await execute('UPDATE languages SET is_active = NOT is_active WHERE id = ?', [id]);
    const updated = await query('SELECT * FROM languages WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/languages/:id/default', async (req, res) => {
  try {
    const { id } = req.params;
    await execute('UPDATE languages SET is_default = 0 WHERE is_default = 1');
    await execute('UPDATE languages SET is_default = 1, is_active = 1 WHERE id = ?', [id]);
    const updated = await query('SELECT * FROM languages WHERE id = ?', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Langue introuvable' });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`\n🚀 Serveur API (MySQL) démarré sur le port ${PORT}`);
      console.log(`💾 Base de données: MySQL`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 API Languages: http://localhost:${PORT}/api/languages`);
    });
  } catch (error) {
    console.error('❌ MySQL requis. Lancez: npm run docker:up');
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('🔄 Arrêt du serveur...');
  if (mysqlPool) await mysqlPool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Arrêt du serveur...');
  if (mysqlPool) await mysqlPool.end();
  process.exit(0);
});

startServer();

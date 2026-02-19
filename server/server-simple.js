const express = require('express');
const cors = require('cors');
require('dotenv').config();

const database = require('./config/database');
const languageRoutes = require('./routes/languages');

const app = express();
const PORT = process.env.API_PORT || 3003;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/languages', languageRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const connected = await database.testConnection();
    res.json({
      status: 'OK',
      database: connected ? 'MySQL Connected' : 'Disconnected',
      dbType: 'mysql',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

async function start() {
  try {
    const dbConnected = await database.testConnection();
    if (!dbConnected) {
      console.error('❌ MySQL requis. Lancez: npm run docker:up');
      process.exit(1);
    }
    app.listen(PORT, () => {
      console.log(`\n🚀 Serveur API (MySQL) démarré sur le port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 API Languages: http://localhost:${PORT}/api/languages`);
    });
  } catch (error) {
    console.error('❌ Erreur démarrage:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await database.close();
  process.exit(0);
});

start();

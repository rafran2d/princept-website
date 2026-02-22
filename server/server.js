const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const database = require('./config/database');
const languageRoutes = require('./routes/languages');
const authRoutes = require('./routes/auth');
const sectionsRoutes = require('./routes/sections');
const siteSettingsRoutes = require('./routes/siteSettings');
const pagesRoutes = require('./routes/pages');
const themesRoutes = require('./routes/themes');
const designSettingsRoutes = require('./routes/designSettings');
const userPreferencesRoutes = require('./routes/userPreferences');

const path = require('path');
const app = express();
const PORT = process.env.API_PORT || 3003;

// Middlewares de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: false,
  originAgentCluster: false,
  hsts: false
}));

// Configuration CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/themes', themesRoutes);
app.use('/api/design-settings', designSettingsRoutes);
app.use('/api/user-preferences', userPreferencesRoutes);

// Check default admin
app.get('/api/check-default-admin', async (req, res) => {
  try {
    const users = await database.query('SELECT id, is_default_password FROM users WHERE username = ? AND is_active = 1', ['admin']);
    res.json({ isDefaultAdmin: users.length > 0 && users[0].is_default_password === 1 });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Monitoring
app.get('/api/monitoring', async (req, res) => {
  try {
    const dbConnected = await database.testConnection();
    res.json({
      status: 'OK',
      database: dbConnected ? 'Connected' : 'Disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

// Route de santé
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await database.testConnection();
    res.json({
      status: 'OK',
      database: dbConnected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// En production, servir le build React
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(buildPath));

  // SPA fallback : toutes les routes non-API renvoient index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // En dev, 404 pour les routes non trouvées
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
  });
}

// Middleware de gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    // Tester la connexion à la base de données
    const dbConnected = await database.testConnection();
    if (!dbConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Serveur API démarré sur le port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 API Languages: http://localhost:${PORT}/api/languages`);
      console.log(`🔗 CORS autorisé pour: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  console.log('🔄 Arrêt du serveur...');
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Arrêt du serveur...');
  await database.close();
  process.exit(0);
});

startServer();
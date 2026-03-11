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
const emailRoutes = require('./routes/email');
const backupRoutes = require('./routes/backup');
const statsRoutes = require('./routes/stats');
const EmailController = require('./controllers/emailController');

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
  windowMs: 15 * 60 * 1000,
  max: 100,
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
app.use('/api/email', emailRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/stats', statsRoutes);
app.post('/api/send-email', EmailController.sendEmail);

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
    const status = database.getStatus();
    res.json({
      status: 'OK',
      database: status,
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

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
  });
}

// Middleware de gestion des erreurs globales
app.use((error, req, res, next) => {
  res.status(500).json({
    error: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    await database.initialize();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await database.close();
  process.exit(0);
});

startServer();

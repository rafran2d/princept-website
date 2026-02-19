// production-ha.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DatabaseHA = require('./server/DatabaseHA');
const mailjet = require('node-mailjet');
const nodemailer = require('nodemailer');
const sendgrid = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

// Clé secrète JWT (en production, utiliser une variable d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || 'princept-cms-secret-key-2024-very-secure';

// Middleware simple
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Autoriser toutes les origines en développement
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware pour garantir l'encodage UTF-8 dans les réponses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Initialiser le système HA (MySQL only)
const dbHA = new DatabaseHA();

// MySQL uniquement - pas de fallback SQLite

// Événements du système HA (logs production)
dbHA.on('initialized', (dbType) => {
  console.log(`🎯 Système HA initialisé: ${String(dbType || 'mysql').toUpperCase()}`);
});

dbHA.on('mysql_connected', async () => {
  console.log('✅ MySQL connecté et prêt');
});

dbHA.on('mysql_disconnected', (error) => {
  console.log(`⚠️ MySQL déconnecté: ${error.message}`);
});

dbHA.on('sync_completed', (info) => {
  console.log(`🔄 Synchronisation: ${info.syncCount} éléments à ${info.timestamp.toLocaleString()}`);
});

dbHA.on('sync_failed', (error) => {
  console.error('❌ SYNC ÉCHEC:', error.message);
});

// -------------------- Routes --------------------

// Fonction utilitaire pour corriger les noms de langues mal encodés
function correctLanguageName(language) {
  if (!language || !language.name) return language;
  
  const correctNames = {
    'fr': 'Français',
    'es': 'Español',
    'pt': 'Português',
    'ar': 'العربية'
  };
  
  // Détecter les encodages corrompus
  if (language.name.includes('Ã') || 
      language.name.includes('FranAgais') || 
      language.name.includes('Ø') ||
      language.name.includes('Õ')) {
    const correctName = correctNames[language.code];
    if (correctName) {
      return { ...language, name: correctName };
    }
  }
  
  return language;
}

// Route pour vérifier si l'admin utilise le mot de passe par défaut
app.get('/api/check-default-admin', async (req, res) => {
  try {
    const users = await dbHA.query(
        'SELECT is_default_password FROM users WHERE username = ? AND role = ?',
        ['admin', 'admin']
    );
    if (users.length === 0) {
      return res.json({ hasDefaultPassword: false });
    }
    const hasDefaultPassword = users[0].is_default_password === 1;
    res.json({ hasDefaultPassword });
  } catch (error) {
    console.error('❌ Erreur check default admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const status = dbHA.getStatus();
    let dbInfo = {};
    if (status.isMySQL) {
      try {
        const version = await dbHA.query('SELECT VERSION() as version');
        dbInfo = {
          type: 'MySQL',
          version: version[0]?.version
        };
      } catch (error) {
        dbInfo = { type: 'MySQL (Test failed)', error: error.message };
      }
    }
    res.json({
      status: status.isMySQL ? 'OK' : 'DOWN',
      database: status.isMySQL ? 'MYSQL Connected' : 'MYSQL Disconnected',
      dbType: 'mysql',
      dbInfo,
      monitoring: {
        active: status.isMonitoring,
        lastCheck: status.lastSyncTime
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/languages', async (req, res) => {
  try {
    const languages = await dbHA.query('SELECT * FROM languages ORDER BY sort_order ASC');
    const status = dbHA.getStatus();
    
    // Corriger les noms mal encodés avant de les renvoyer
    const correctedLanguages = languages.map(lang => correctLanguageName(lang));
    
    res.json({
      data: correctedLanguages,
      meta: {
        count: correctedLanguages.length,
        dbType: 'mysql',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Erreur languages:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      dbType: 'mysql',
      details: error.message
    });
  }
});

app.get('/api/languages/active', async (req, res) => {
  try {
    const languages = await dbHA.query(
        'SELECT * FROM languages WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    
    // Corriger les noms mal encodés
    const correctedLanguages = languages.map(lang => correctLanguageName(lang));
    
    res.json({ data: correctedLanguages });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour corriger manuellement l'encodage des langues
app.post('/api/languages/fix-encoding', async (req, res) => {
  try {
    await fixLanguagesEncoding();
    const languages = await dbHA.query('SELECT * FROM languages ORDER BY sort_order ASC');
    const correctedLanguages = languages.map(lang => correctLanguageName(lang));
    res.json({ 
      success: true,
      message: 'Encodage corrigé avec succès',
      data: correctedLanguages 
    });
  } catch (error) {
    console.error('❌ Erreur correction encodage:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

app.get('/api/languages/default', async (req, res) => {
  try {
    const languages = await dbHA.query(
        'SELECT * FROM languages WHERE is_default = 1 LIMIT 1'
    );
    if (languages.length === 0) {
      return res.status(404).json({ error: 'Aucune langue par défaut' });
    }
    
    // Corriger le nom mal encodé si nécessaire
    let language = correctLanguageName(languages[0]);
    
    res.json({ data: language });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/languages', async (req, res) => {
  try {
    const { id, name, code, flag, is_active, is_default, is_rtl, sort_order } = req.body;

    if (!id || !name || !code) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    if (is_default) {
      await dbHA.execute('UPDATE languages SET is_default = 0 WHERE is_default = 1');
    }

    const sql = `INSERT INTO languages
      (id, name, code, flag, is_active, is_default, is_rtl, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      code = VALUES(code),
      flag = VALUES(flag),
      is_active = VALUES(is_active),
      is_default = VALUES(is_default),
      is_rtl = VALUES(is_rtl),
      sort_order = VALUES(sort_order),
      updated_at = NOW()`;

    await dbHA.execute(sql, [
      id, name, code, flag || '',
      is_active ? 1 : 0, is_default ? 1 : 0, is_rtl ? 1 : 0, sort_order || 0
    ]);

    const created = await dbHA.query('SELECT * FROM languages WHERE id = ?', [id]);
    
    // Corriger le nom mal encodé si nécessaire
    let language = correctLanguageName(created[0]);
    
    res.status(201).json({ data: language });
  } catch (error) {
    console.error('❌ Erreur création:', error);
    res.status(500).json({ error: 'Erreur création', details: error.message });
  }
});

app.delete('/api/languages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la langue existe
    const language = await dbHA.query('SELECT * FROM languages WHERE id = ?', [id]);
    if (!language || language.length === 0) {
      return res.status(404).json({ error: 'Langue introuvable' });
    }

    // Vérifier que ce n'est pas la langue par défaut
    if (language[0].is_default === 1 || language[0].is_default === true) {
      return res.status(400).json({ error: 'Impossible de supprimer la langue par défaut' });
    }

    // Vérifier s'il y a des sections qui utilisent cette langue et les mettre à NULL
    // (la contrainte FOREIGN KEY devrait le faire automatiquement avec ON DELETE SET NULL,
    // mais on le fait explicitement pour être sûr)
    try {
      const sectionsCount = await dbHA.query(
        'SELECT COUNT(*) as count FROM sections WHERE language_id = ?',
        [id]
      );
      
      if (sectionsCount[0]?.count > 0) {
        await dbHA.execute('UPDATE sections SET language_id = NULL WHERE language_id = ?', [id]);
        console.log(`⚠️ ${sectionsCount[0].count} section(s) mise(s) à NULL pour la langue ${id}`);
      }
    } catch (updateError) {
      console.warn('⚠️ Erreur lors de la mise à NULL des sections:', updateError.message);
      // Continuer quand même la suppression
    }

    // Supprimer la langue
    const deleteResult = await dbHA.execute('DELETE FROM languages WHERE id = ?', [id]);
    
    // Vérifier que la suppression a réussi
    if (deleteResult[0]?.affectedRows === 0) {
      return res.status(404).json({ error: 'Langue non trouvée ou déjà supprimée' });
    }

    console.log(`🗑️ Langue supprimée: ${id}`);
    res.json({ 
      success: true,
      message: 'Langue supprimée avec succès',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Erreur suppression langue:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la suppression', 
      details: error.message 
    });
  }
});

// ================================
// ROUTES SECTIONS (CMS Content)
// ================================

app.get('/api/sections', async (req, res) => {
  try {
    const { language_id, section_type, enabled_only } = req.query;

    let sql = 'SELECT * FROM sections';
    const params = [];
    const conditions = [];

    if (language_id) {
      conditions.push('language_id = ?');
      params.push(language_id);
    }
    if (section_type) {
      conditions.push('section_type = ?');
      params.push(section_type);
    }
    if (enabled_only === 'true') {
      conditions.push('is_enabled = 1');
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY sort_order ASC';

    const sections = await dbHA.query(sql, params);

    const parsedSections = sections.map(section => ({
      ...section,
      section_data: section.section_data ? JSON.parse(section.section_data) : null
    }));

    res.json({
      data: parsedSections,
      meta: {
        count: sections.length,
        dbType: 'mysql',
        filters: { language_id, section_type, enabled_only }
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur sections',
      details: error.message
    });
  }
});

app.post('/api/sections', async (req, res) => {
  try {
    const { id, section_type, section_data, is_enabled, sort_order, language_id } = req.body;

    if (!id || !section_type) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants',
        required: ['id', 'section_type']
      });
    }

    const sql = `INSERT INTO sections
      (id, section_type, section_data, is_enabled, sort_order, language_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
      section_type = VALUES(section_type),
      section_data = VALUES(section_data),
      is_enabled = VALUES(is_enabled),
      sort_order = VALUES(sort_order),
      language_id = VALUES(language_id),
      updated_at = NOW()`;

    await dbHA.execute(sql, [
      id,
      section_type,
      section_data ? JSON.stringify(section_data) : null,
      is_enabled ? 1 : 0,
      sort_order || 0,
      language_id || null
    ]);

    const created = await dbHA.query('SELECT * FROM sections WHERE id = ?', [id]);
    const result = {
      ...created[0],
      section_data: created[0].section_data ? JSON.parse(created[0].section_data) : null
    };

    // Pas de synchronisation en mode MySQL uniquement

    res.status(201).json({
      data: result,
      meta: { dbType: 'mysql' }
    });
  } catch (error) {
    console.error('Erreur création section:', error);
    res.status(500).json({ error: 'Erreur création section', details: error.message });
  }
});

app.put('/api/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { section_type, section_data, is_enabled, sort_order, language_id } = req.body;
    
    console.log(`🔍 Mise à jour section ${id}:`);
    console.log('  - section_data reçu:', JSON.stringify(section_data, null, 2));

    const existingSection = await dbHA.query('SELECT * FROM sections WHERE id = ?', [id]);
    if (existingSection.length === 0) {
      return res.status(404).json({ error: 'Section non trouvée' });
    }

    const updates = [];
    const params = [];

    if (section_type !== undefined) {
      updates.push('section_type = ?');
      params.push(section_type);
    }
    if (section_data !== undefined) {
      updates.push('section_data = ?');
      params.push(typeof section_data === 'object' ? JSON.stringify(section_data) : section_data);
    }
    if (is_enabled !== undefined) {
      updates.push('is_enabled = ?');
      params.push(is_enabled ? 1 : 0);
    }
    if (sort_order !== undefined) {
      updates.push('sort_order = ?');
      params.push(sort_order);
    }
    if (language_id !== undefined) {
      updates.push('language_id = ?');
      params.push(language_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune mise à jour fournie' });
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    const sql = `UPDATE sections SET ${updates.join(', ')} WHERE id = ?`;
    await dbHA.execute(sql, params);

    const updatedSection = await dbHA.query('SELECT * FROM sections WHERE id = ?', [id]);
    const section = updatedSection[0];

    if (section.section_data) {
      try {
        section.section_data = JSON.parse(section.section_data);
      } catch (e) { /* ignore */ }
    }

    console.log(`✏️ Section mise à jour: ${id}`);

    // Pas de synchronisation en mode MySQL uniquement

    res.json({
      data: section,
      message: 'Section mise à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour section:', error.message);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la section' });
  }
});

app.delete('/api/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingSection = await dbHA.query('SELECT * FROM sections WHERE id = ?', [id]);
    if (existingSection.length === 0) {
      return res.status(404).json({ error: 'Section non trouvée' });
    }

    await dbHA.execute('DELETE FROM sections WHERE id = ?', [id]);

    res.json({
      message: 'Section supprimée avec succès',
      id: id
    });

    console.log(`🗑️ Section supprimée: ${id}`);
  } catch (error) {
    console.error('❌ Erreur suppression section:', error.message);
    res.status(500).json({ error: 'Erreur lors de la suppression de la section' });
  }
});

// ================================
// ROUTES SITE SETTINGS
// ================================

app.get('/api/site-settings', async (req, res) => {
  try {
    const settings = await dbHA.query('SELECT * FROM site_settings ORDER BY setting_key');

    const settingsObject = {};
    settings.forEach(setting => {
      let value = setting.setting_value;
      try {
        if (setting.setting_type === 'json') {
          value = JSON.parse(value);
        } else if (setting.setting_type === 'boolean') {
          value = value === 'true' || value === true;
        } else if (setting.setting_type === 'number') {
          value = Number(value);
        }
      } catch (e) { /* ignore */ }
      settingsObject[setting.setting_key] = value;
    });

    res.json({
      data: settingsObject,
      meta: {
        count: settings.length,
        dbType: 'mysql',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur site-settings',
      details: error.message
    });
  }
});

app.post('/api/site-settings', async (req, res) => {
  try {
    const { setting_key, setting_value, description } = req.body;

    if (!setting_key) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants',
        required: ['setting_key']
      });
    }

    let setting_type = 'string';
    let value = setting_value;

    if (typeof setting_value === 'object' && setting_value !== null) {
      setting_type = 'json';
      value = JSON.stringify(setting_value);
    } else if (typeof setting_value === 'boolean') {
      setting_type = 'boolean';
      value = String(setting_value);
    } else if (typeof setting_value === 'number') {
      setting_type = 'number';
      value = String(setting_value);
    } else {
      value = String(setting_value);
    }

    const sql = `INSERT INTO site_settings
      (setting_key, setting_value, setting_type, description, updated_at)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
      setting_value = VALUES(setting_value),
      setting_type = VALUES(setting_type),
      description = VALUES(description),
      updated_at = NOW()`;

    await dbHA.execute(sql, [setting_key, value, setting_type, description || null]);

    res.json({
      data: { setting_key, setting_value, setting_type },
      meta: { dbType: 'mysql' }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur création site-setting',
      details: error.message
    });
  }
});

// ================================
// ROUTES PAGES DYNAMIQUES
// ================================

// Créer la table pages si elle n'existe pas (MySQL uniquement)
async function ensurePagesTable() {
  const status = dbHA.getStatus();
  
  if (!status.isMySQL) {
    throw new Error('MySQL non disponible - impossible de créer la table pages');
  }
  
  try {
    const tables = await dbHA.query("SHOW TABLES LIKE 'pages'");
    
    if (tables.length === 0) {
      await dbHA.execute(`
        CREATE TABLE pages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title TEXT NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          content TEXT NOT NULL,
          is_published BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_slug (slug),
          INDEX idx_published (is_published)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Table pages créée (MySQL)');
    } else {
      const columns = await dbHA.query("SHOW COLUMNS FROM pages WHERE Field IN ('title', 'content')");
      for (const col of columns) {
        if (col.Type.toUpperCase().includes('JSON')) {
          console.log(`⚠️ Conversion de la colonne ${col.Field} de JSON vers TEXT`);
          await dbHA.execute(`ALTER TABLE pages MODIFY COLUMN ${col.Field} TEXT NOT NULL`);
        }
      }
      console.log('✅ Table pages vérifiée (MySQL)');
    }
  } catch (error) {
    console.error('❌ Erreur création/vérification table pages (MySQL):', error.message);
    throw error;
  }
}

// Corriger l'encodage de la table languages
async function fixLanguagesEncoding() {
  const status = dbHA.getStatus();
  
  if (!status.isMySQL) {
    return;
  }
  
  try {
    // Vérifier et corriger le charset de la table
    const tableInfo = await dbHA.query("SHOW CREATE TABLE languages");
    if (tableInfo.length > 0) {
      const createTable = tableInfo[0]['Create Table'];
      
      // Si la table n'utilise pas utf8mb4, la corriger
      if (!createTable.includes('utf8mb4')) {
        console.log('🔧 Correction du charset de la table languages...');
        await dbHA.execute(`
          ALTER TABLE languages 
          CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
        console.log('✅ Charset de la table languages corrigé');
      }
      
      // Corriger les données mal encodées
      const languages = await dbHA.query('SELECT * FROM languages');
      const correctNames = {
        'fr': 'Français',
        'es': 'Español',
        'pt': 'Português',
        'ar': 'العربية'
      };
      
      for (const lang of languages) {
        const correctName = correctNames[lang.code];
        if (correctName && lang.name !== correctName) {
          // Vérifier si le nom est mal encodé
          if (lang.name.includes('Ã') || lang.name.includes('FranAgais') || lang.name.includes('Ø') || lang.name.includes('Õ')) {
            console.log(`🔧 Correction du nom pour ${lang.code}: "${lang.name}" -> "${correctName}"`);
            await dbHA.execute(
              'UPDATE languages SET name = ? WHERE id = ?',
              [correctName, lang.id]
            );
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur correction encodage languages:', error.message);
  }
}

// Initialiser la table au démarrage (MySQL requis)
dbHA.once('initialized', async () => {
  try {
    await ensurePagesTable();
    await fixLanguagesEncoding();
  } catch (err) {
    console.error('❌ Erreur initialisation tables:', err.message);
  }
});

// Helper pour exécuter une requête sur MySQL uniquement
async function queryPages(sql, params = []) {
  const status = dbHA.getStatus();
  
  if (!status.isMySQL) {
    throw new Error('MySQL non disponible');
  }
  
  return await dbHA.query(sql, params);
}

// Helper pour exécuter une requête INSERT/UPDATE/DELETE (MySQL uniquement)
async function executePages(sql, params = []) {
  const status = dbHA.getStatus();
  
  if (!status.isMySQL) {
    throw new Error('MySQL non disponible');
  }
  
  return await dbHA.execute(sql, params);
}

// GET toutes les pages
app.get('/api/pages', async (req, res) => {
  try {
    // S'assurer que la table existe
    await ensurePagesTable();

    const pages = await queryPages('SELECT * FROM pages ORDER BY created_at DESC');
    const formattedPages = pages.map(page => ({
      id: page.id,
      title: typeof page.title === 'string' ? (() => {
        try { return JSON.parse(page.title); } catch { return page.title; }
      })() : page.title,
      slug: page.slug,
      content: typeof page.content === 'string' ? (() => {
        try { return JSON.parse(page.content); } catch { return page.content; }
      })() : page.content,
      isPublished: page.is_published === 1 || page.is_published === true,
      createdAt: page.created_at,
      updatedAt: page.updated_at
    }));
    res.json({ data: formattedPages });
  } catch (error) {
    console.error('❌ Erreur récupération pages:', error);
    res.status(500).json({ error: 'Erreur serveur pages', details: error.message });
  }
});

// GET une page par slug
app.get('/api/pages/:slug', async (req, res) => {
  try {
    // S'assurer que la table existe
    await ensurePagesTable();

    const { slug } = req.params;
    const pages = await queryPages('SELECT * FROM pages WHERE slug = ?', [slug]);
    if (pages.length === 0) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }
    const page = pages[0];
    res.json({
      data: {
        id: page.id,
        title: typeof page.title === 'string' ? JSON.parse(page.title) : page.title,
        slug: page.slug,
        content: typeof page.content === 'string' ? JSON.parse(page.content) : page.content,
        isPublished: page.is_published === 1 || page.is_published === true,
        createdAt: page.created_at,
        updatedAt: page.updated_at
      }
    });
  } catch (error) {
    console.error('❌ Erreur récupération page:', error);
    res.status(500).json({ error: 'Erreur serveur page', details: error.message });
  }
});

// POST créer une page
app.post('/api/pages', async (req, res) => {
  try {
    // S'assurer que la table existe
    await ensurePagesTable();

    const { title, slug, content, isPublished } = req.body;
    
    // Validation améliorée
    if (!slug || !slug.trim()) {
      return res.status(400).json({
        error: 'Le slug est obligatoire'
      });
    }

    // Vérifier que title et content existent et ne sont pas vides
    const hasTitle = title && (
      typeof title === 'string' ? title.trim() !== '' :
      typeof title === 'object' ? Object.values(title).some(v => v && String(v).trim() !== '') :
      false
    );

    const hasContent = content && (
      typeof content === 'string' ? content.trim() !== '' :
      typeof content === 'object' ? Object.values(content).some(v => v && String(v).trim() !== '' && String(v).trim() !== '<p><br></p>') :
      false
    );

    if (!hasTitle) {
      return res.status(400).json({
        error: 'Le titre est obligatoire et doit contenir au moins une valeur'
      });
    }

    if (!hasContent) {
      return res.status(400).json({
        error: 'Le contenu est obligatoire et doit contenir au moins une valeur'
      });
    }

    // Convertir en JSON si nécessaire (éviter double encodage)
    let titleJson;
    if (typeof title === 'string') {
      try {
        // Si c'est déjà du JSON valide, le garder tel quel
        JSON.parse(title);
        titleJson = title;
      } catch {
        // Sinon, créer un objet multilingue par défaut
        titleJson = JSON.stringify({ fr: title });
      }
    } else {
      titleJson = JSON.stringify(title);
    }

    let contentJson;
    if (typeof content === 'string') {
      try {
        // Si c'est déjà du JSON valide, le garder tel quel
        JSON.parse(content);
        contentJson = content;
      } catch {
        // Sinon, créer un objet multilingue par défaut
        contentJson = JSON.stringify({ fr: content });
      }
    } else {
      contentJson = JSON.stringify(content);
    }

    const isPublishedValue = isPublished !== false ? 1 : 0;

    console.log('📝 Données à insérer:', {
      titleJson: titleJson.substring(0, 100),
      slug: slug.trim(),
      contentJson: contentJson.substring(0, 100),
      isPublished: isPublishedValue
    });

    // Insérer directement (TEXT accepte les chaînes JSON)
    const result = await executePages(
      'INSERT INTO pages (title, slug, content, is_published) VALUES (?, ?, ?, ?)',
      [titleJson, slug.trim(), contentJson, isPublishedValue]
    );

    const newPage = await queryPages('SELECT * FROM pages WHERE id = ?', [result.insertId]);
    const page = newPage[0];
    
    res.json({
      data: {
        id: page.id,
        title: typeof page.title === 'string' ? (() => {
          try { return JSON.parse(page.title); } catch { return page.title; }
        })() : page.title,
        slug: page.slug,
        content: typeof page.content === 'string' ? (() => {
          try { return JSON.parse(page.content); } catch { return page.content; }
        })() : page.content,
        isPublished: page.is_published === 1 || page.is_published === true,
        createdAt: page.created_at,
        updatedAt: page.updated_at
      }
    });
  } catch (error) {
    console.error('❌ Erreur création page:', error);
    console.error('❌ Stack:', error.stack);
    console.error('❌ Code:', error.code);
    if (error.code === 'ER_DUP_ENTRY' || error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Une page avec ce slug existe déjà' });
    }
    res.status(500).json({ 
      error: 'Erreur création page', 
      details: error.message,
      code: error.code
    });
  }
});

// PUT mettre à jour une page
app.put('/api/pages/:id', async (req, res) => {
  try {
    // S'assurer que la table existe
    await ensurePagesTable();

    const { id } = req.params;
    const { title, slug, content, isPublished } = req.body;

    // Validation améliorée
    if (!slug || !slug.trim()) {
      return res.status(400).json({
        error: 'Le slug est obligatoire'
      });
    }

    // Vérifier que title et content existent et ne sont pas vides
    const hasTitle = title && (
      typeof title === 'string' ? title.trim() !== '' :
      typeof title === 'object' ? Object.values(title).some(v => v && String(v).trim() !== '') :
      false
    );

    const hasContent = content && (
      typeof content === 'string' ? content.trim() !== '' :
      typeof content === 'object' ? Object.values(content).some(v => v && String(v).trim() !== '' && String(v).trim() !== '<p><br></p>') :
      false
    );

    if (!hasTitle) {
      return res.status(400).json({
        error: 'Le titre est obligatoire et doit contenir au moins une valeur'
      });
    }

    if (!hasContent) {
      return res.status(400).json({
        error: 'Le contenu est obligatoire et doit contenir au moins une valeur'
      });
    }

    // Convertir en JSON si nécessaire (éviter double encodage)
    let titleJson;
    if (typeof title === 'string') {
      try {
        // Si c'est déjà du JSON valide, le garder tel quel
        JSON.parse(title);
        titleJson = title;
      } catch {
        // Sinon, créer un objet multilingue par défaut
        titleJson = JSON.stringify({ fr: title });
      }
    } else {
      titleJson = JSON.stringify(title);
    }

    let contentJson;
    if (typeof content === 'string') {
      try {
        // Si c'est déjà du JSON valide, le garder tel quel
        JSON.parse(content);
        contentJson = content;
      } catch {
        // Sinon, créer un objet multilingue par défaut
        contentJson = JSON.stringify({ fr: content });
      }
    } else {
      contentJson = JSON.stringify(content);
    }

    const isPublishedValue = isPublished !== false ? 1 : 0;

    console.log('📝 Données à mettre à jour:', {
      id,
      titleJson: titleJson.substring(0, 100),
      slug: slug.trim(),
      contentJson: contentJson.substring(0, 100),
      isPublished: isPublishedValue
    });

    // Mettre à jour directement (TEXT accepte les chaînes JSON)
    await executePages(
      'UPDATE pages SET title = ?, slug = ?, content = ?, is_published = ? WHERE id = ?',
      [titleJson, slug.trim(), contentJson, isPublishedValue, id]
    );

    const updatedPages = await queryPages('SELECT * FROM pages WHERE id = ?', [id]);
    if (updatedPages.length === 0) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }
    
    const page = updatedPages[0];
    res.json({
      data: {
        id: page.id,
        title: typeof page.title === 'string' ? (() => {
          try { return JSON.parse(page.title); } catch { return page.title; }
        })() : page.title,
        slug: page.slug,
        content: typeof page.content === 'string' ? (() => {
          try { return JSON.parse(page.content); } catch { return page.content; }
        })() : page.content,
        isPublished: page.is_published === 1 || page.is_published === true,
        createdAt: page.created_at,
        updatedAt: page.updated_at
      }
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour page:', error);
    console.error('❌ Stack:', error.stack);
    console.error('❌ Code:', error.code);
    if (error.code === 'ER_DUP_ENTRY' || error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Une page avec ce slug existe déjà' });
    }
    res.status(500).json({ 
      error: 'Erreur mise à jour page', 
      details: error.message,
      code: error.code
    });
  }
});

// DELETE supprimer une page
app.delete('/api/pages/:id', async (req, res) => {
  try {
    // S'assurer que la table existe
    await ensurePagesTable();

    const { id } = req.params;
    await executePages('DELETE FROM pages WHERE id = ?', [id]);
    res.json({ message: 'Page supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression page:', error);
    res.status(500).json({ error: 'Erreur suppression page', details: error.message });
  }
});

// ================================
// ROUTES THEMES
// ================================

app.get('/api/themes', async (req, res) => {
  try {
    const themes = await dbHA.query('SELECT * FROM custom_themes ORDER BY theme_name');

    res.json({
      data: themes.map(theme => ({
        ...theme,
        theme_config: theme.theme_config ? JSON.parse(theme.theme_config) : null,
        is_active: Boolean(theme.is_active)
      })),
      meta: {
        count: themes.length,
        dbType: 'mysql',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur themes',
      details: error.message
    });
  }
});

app.post('/api/themes', async (req, res) => {
  try {
    const { id, theme_name, theme_config, is_active } = req.body;

    if (!id || !theme_name) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants',
        required: ['id', 'theme_name']
      });
    }

    const sql = `INSERT INTO custom_themes
      (id, theme_name, theme_config, is_active, updated_at)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
      theme_name = VALUES(theme_name),
      theme_config = VALUES(theme_config),
      is_active = VALUES(is_active),
      updated_at = NOW()`;

    await dbHA.execute(sql, [
      id,
      theme_name,
      theme_config ? JSON.stringify(theme_config) : null,
      is_active ? 1 : 0
    ]);

    const created = await dbHA.query('SELECT * FROM custom_themes WHERE id = ?', [id]);
    res.json({
      data: created[0],
      meta: { dbType: 'mysql' }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur création theme',
      details: error.message
    });
  }
});

// ================================
// ROUTES DESIGN SETTINGS
// ================================

app.get('/api/design-settings', async (req, res) => {
  try {
    const settings = await dbHA.query('SELECT * FROM design_settings ORDER BY setting_name');

    const settingsObject = {};
    settings.forEach(setting => {
      let value = setting.setting_value;
      try {
        value = JSON.parse(value);
      } catch (e) { /* ignore */ }
      settingsObject[setting.setting_name] = value;
    });

    res.json({
      data: settingsObject,
      meta: {
        count: settings.length,
        dbType: 'mysql',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur design-settings',
      details: error.message
    });
  }
});

app.post('/api/design-settings', async (req, res) => {
  try {
    const { setting_name, setting_value } = req.body;

    if (!setting_name) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants',
        required: ['setting_name']
      });
    }

    const value = typeof setting_value === 'object'
        ? JSON.stringify(setting_value)
        : String(setting_value);

    const sql = `INSERT INTO design_settings
      (setting_name, setting_value, updated_at)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE
      setting_value = VALUES(setting_value),
      updated_at = NOW()`;

    await dbHA.execute(sql, [setting_name, value]);

    res.json({
      data: { setting_name, setting_value },
      meta: { dbType: 'mysql' }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur création design-setting',
      details: error.message
    });
  }
});

// ================================
// ROUTES USER PREFERENCES
// ================================

app.get('/api/user-preferences', async (req, res) => {
  try {
    const prefs = await dbHA.query('SELECT * FROM user_preferences ORDER BY preference_key');

    const prefsObject = {};
    prefs.forEach(pref => {
      let value = pref.preference_value;
      try {
        value = JSON.parse(value);
      } catch (e) { /* ignore */ }
      prefsObject[pref.preference_key] = value;
    });

    res.json({
      data: prefsObject,
      meta: {
        count: prefs.length,
        dbType: 'mysql',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur user-preferences',
      details: error.message
    });
  }
});

app.post('/api/user-preferences', async (req, res) => {
  try {
    const { preference_key, preference_value } = req.body;

    if (!preference_key) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants',
        required: ['preference_key']
      });
    }

    const value = typeof preference_value === 'object'
        ? JSON.stringify(preference_value)
        : String(preference_value);

    const sql = `INSERT INTO user_preferences
      (preference_key, preference_value, updated_at)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE
      preference_value = VALUES(preference_value),
      updated_at = NOW()`;

    await dbHA.execute(sql, [preference_key, value]);

    res.json({
      data: { preference_key, preference_value },
      meta: { dbType: 'mysql' }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur création user-preference',
      details: error.message
    });
  }
});

// ================================
// API BACKUP - Sauvegarde
// ================================

app.get('/api/backup/export', async (req, res) => {
  try {
    const status = dbHA.getStatus();
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

    backup.data.languages = await dbHA.query('SELECT * FROM languages ORDER BY sort_order');
    backup.data.sections = await dbHA.query('SELECT * FROM sections ORDER BY created_at');
    backup.data.site_settings = await dbHA.query('SELECT * FROM site_settings ORDER BY setting_key');
    backup.data.custom_themes = await dbHA.query('SELECT * FROM custom_themes ORDER BY created_at');

    let design_settings = [];
    try {
      design_settings = await dbHA.query('SELECT * FROM design_settings ORDER BY setting_name');
    } catch { design_settings = []; }
    backup.data.design_settings = design_settings;

    let user_preferences = [];
    try {
      user_preferences = await dbHA.query('SELECT * FROM user_preferences ORDER BY preference_key');
    } catch { user_preferences = []; }
    backup.data.user_preferences = user_preferences;

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

    console.log(`📦 Backup exporté: ${backup.meta.totalRecords} enregistrements (MySQL)`);
  } catch (error) {
    console.error('❌ Erreur export backup:', error);
    res.status(500).json({
      error: 'Erreur export backup',
      details: error.message
    });
  }
});

app.get('/api/backup/info', async (req, res) => {
  try {
    const status = dbHA.getStatus();

    const languages = await dbHA.query('SELECT COUNT(*) as count FROM languages');
    const sections = await dbHA.query('SELECT COUNT(*) as count FROM sections');
    const site_settings = await dbHA.query('SELECT COUNT(*) as count FROM site_settings');
    const custom_themes = await dbHA.query('SELECT COUNT(*) as count FROM custom_themes');

    let design_settings = [{ count: 0 }];
    try { design_settings = await dbHA.query('SELECT COUNT(*) as count FROM design_settings'); } catch {}

    let user_preferences = [{ count: 0 }];
    try { user_preferences = await dbHA.query('SELECT COUNT(*) as count FROM user_preferences'); } catch {}

    const totals = {
      languages: languages[0].count,
      sections: sections[0].count,
      site_settings: site_settings[0].count,
      custom_themes: custom_themes[0].count,
      design_settings: design_settings[0].count,
      user_preferences: user_preferences[0].count
    };

    const totalRecords = Object.values(totals).reduce((a, b) => a + b, 0);

    const info = {
      database: {
        type: 'MYSQL',
        status: status.isMySQL ? 'PRIMARY' : 'DOWN',
        isHealthy: status.isMySQL
      },
      tables: totals,
      meta: {
        totalRecords,
        timestamp: new Date().toISOString(),
        backupReady: true
      }
    };

    res.json(info);
  } catch (error) {
    console.error('❌ Erreur info backup:', error);
    res.status(500).json({
      error: 'Erreur info backup',
      details: error.message
    });
  }
});

// ================================
// API STATS - Statistiques système
// ================================

app.get('/api/stats', async (req, res) => {
  try {
    const status = dbHA.getStatus();
    const startTime = Date.now();

    await dbHA.query('SELECT 1');
    const dbResponseTime = Date.now() - startTime;

    const langStats = await dbHA.query(
        'SELECT COUNT(*) as total, COUNT(CASE WHEN is_active = 1 THEN 1 END) as active FROM languages'
    );
    const secStats = await dbHA.query(
        'SELECT COUNT(*) as total, COUNT(CASE WHEN is_enabled = 1 THEN 1 END) as enabled FROM sections'
    );
    const themeStats = await dbHA.query('SELECT COUNT(*) as total FROM custom_themes');
    const settingsStats = await dbHA.query('SELECT COUNT(*) as total FROM site_settings');

    const dbStats = {
      currentDatabase: 'mysql',
      isMySQL: status.isMySQL,
      isError: status.isError,
      monitoringActive: status.isMonitoring,
      lastCheck: status.lastSyncTime || null,
      uptime: process.uptime()
    };

    const performanceStats = {
      dbResponseTime: `${dbResponseTime}ms`,
      memoryUsage: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
      },
      nodeVersion: process.version,
      platform: process.platform
    };

    const stats = {
      system: {
        database: dbStats,
        performance: performanceStats
      },
      data: {
        languages: {
          total: langStats[0].total,
          active: langStats[0].active
        },
        sections: {
          total: secStats[0].total,
          enabled: secStats[0].enabled || 0
        },
        themes: {
          total: themeStats[0].total
        },
        settings: {
          total: settingsStats[0].total
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        apiEndpoint: `/api/stats`
      }
    };

    res.json(stats);

    console.log(`📊 Stats générées: DB:${dbResponseTime}ms, RAM:${performanceStats.memoryUsage.heapUsed}`);
  } catch (error) {
    console.error('❌ Erreur stats:', error);
    res.status(500).json({
      error: 'Erreur génération stats',
      details: error.message
    });
  }
});

app.get('/api/stats/detailed', async (req, res) => {
  try {
    const status = dbHA.getStatus();

    const languageDetails = await dbHA.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active,
        COUNT(CASE WHEN is_default = 1 THEN 1 END) as default_count,
        COUNT(CASE WHEN is_rtl = 1 THEN 1 END) as rtl_count
      FROM languages
    `);

    const sectionTypes = await dbHA.query(`
      SELECT 
        section_type,
        COUNT(*) as count,
        COUNT(CASE WHEN is_enabled = 1 THEN 1 END) as enabled
      FROM sections
      GROUP BY section_type
    `);

    const themeUsage = await dbHA.query(`
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

    const detailed = {
      languages: {
        overview: languageDetails[0],
        distribution: {
          activePercent: languageDetails[0].total ? Math.round((languageDetails[0].active / languageDetails[0].total) * 100) : 0,
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
        connected: status.isMySQL,
        monitoring: status.isMonitoring
      },
      meta: {
        timestamp: new Date().toISOString(),
        generatedBy: 'Stats API v1.0'
      }
    };

    res.json(detailed);
  } catch (error) {
    console.error('❌ Erreur stats détaillées:', error);
    res.status(500).json({
      error: 'Erreur stats détaillées',
      details: error.message
    });
  }
});

// ================================
// ENDPOINT ENVOI EMAIL (Multi-Provider)
// ================================

app.post('/api/send-email', async (req, res) => {
  try {
    const { provider, config, email, type } = req.body;

    if (!provider || !config || !email) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        required: ['provider', 'config', 'email']
      });
    }

    console.log(`📧 [${provider.toUpperCase()}] Tentative d'envoi email:`, {
      to: email.to,
      subject: email.subject,
      type: type || 'unknown'
    });

    let result;

    switch (provider) {
      case 'mailjet':
        result = await sendWithMailjet(config, email);
        break;
      case 'sendgrid':
        result = await sendWithSendGrid(config, email);
        break;
      case 'gmail':
        result = await sendWithSMTP(config, email, 'gmail');
        break;
      case 'outlook':
        result = await sendWithSMTP(config, email, 'outlook');
        break;
      case 'smtpCustom':
      case 'smtp':
        result = await sendWithSMTP(config, email, 'custom');
        break;
      default:
        throw new Error(`Provider non supporté: ${provider}`);
    }

    console.log(`✅ [${provider.toUpperCase()}] Email envoyé avec succès:`, result.messageId);
    res.json({
      success: true,
      provider: provider,
      messageId: result.messageId,
      message: result.message || 'Email envoyé avec succès'
    });

  } catch (error) {
    console.error(`❌ [EMAIL] Erreur envoi:`, error.message);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message,
      provider: req.body.provider
    });
  }
});

// Fonction d'envoi Mailjet
async function sendWithMailjet(config, email) {
  try {
    const mailjetConnect = mailjet.apiConnect(
        config.apiKey,
        config.secretKey
    );

    const request = mailjetConnect
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: email.from.email,
                Name: email.from.name || 'Website'
              },
              To: [
                {
                  Email: email.to,
                  Name: email.toName || ''
                }
              ],
              Subject: email.subject,
              TextPart: email.text,
              HTMLPart: email.html || email.text.replace(/\n/g, '<br>'),
              ReplyTo: email.replyTo ? {
                Email: email.replyTo,
                Name: email.from.name || 'Website'
              } : undefined
            }
          ],
          SandboxMode: config.sandboxMode || false
        });

    const result = await request;

    return {
      messageId: result.body.Messages[0].To[0].MessageID,
      message: 'Email envoyé via Mailjet',
      response: result.body
    };
  } catch (error) {
    throw new Error(`Mailjet Error: ${error.message}`);
  }
}

// Fonction d'envoi SendGrid
async function sendWithSendGrid(config, email) {
  try {
    sendgrid.setApiKey(config.apiKey);

    const msg = {
      to: email.to,
      from: {
        email: config.senderEmail,
        name: config.senderName || 'Website'
      },
      subject: email.subject,
      text: email.text,
      html: email.html || email.text.replace(/\n/g, '<br>'),
      replyTo: config.replyTo || email.replyTo
    };

    const result = await sendgrid.send(msg);

    return {
      messageId: result[0].headers['x-message-id'],
      message: 'Email envoyé via SendGrid',
      response: result[0]
    };
  } catch (error) {
    throw new Error(`SendGrid Error: ${error.message}`);
  }
}

// Fonction d'envoi SMTP (Gmail, Outlook, Custom)
async function sendWithSMTP(config, email, provider) {
  try {
    let transportConfig;

    switch (provider) {
      case 'gmail':
        transportConfig = {
          service: 'gmail',
          auth: {
            user: config.username,
            pass: config.password
          }
        };
        break;
      case 'outlook':
        transportConfig = {
          service: 'hotmail',
          auth: {
            user: config.username,
            pass: config.password
          }
        };
        break;
      case 'custom':
      default:
        transportConfig = {
          host: config.host,
          port: parseInt(config.port),
          secure: !!config.secure,
          auth: {
            user: config.username,
            pass: config.password
          }
        };
        break;
    }

    const transporter = nodemailer.createTransport(transportConfig);

    const mailOptions = {
      from: {
        name: config.senderName || 'Website',
        address: config.senderEmail || config.username
      },
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html || (email.text ? email.text.replace(/\n/g, '<br>') : undefined),
      replyTo: config.replyTo || email.replyTo
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      messageId: result.messageId,
      message: `Email envoyé via ${provider.toUpperCase()} SMTP`,
      response: result
    };
  } catch (error) {
    throw new Error(`SMTP ${provider} Error: ${error.message}`);
  }
}

// ================================
// MIDDLEWARES AUTHENTIFICATION
// ================================

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await dbHA.query(
        'SELECT id, username, email, role, is_active FROM users WHERE id = ? AND is_active = 1',
        [decoded.userId]
    );

    if (!user || user.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé ou inactif' });
    }

    req.user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      ...user[0]
    };

    next();
  } catch (error) {
    console.error('❌ Erreur vérification token:', error);
    return res.status(403).json({ error: 'Token invalide' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Accès administrateur requis' });
  }
  next();
};

// ================================
// ROUTES AUTHENTIFICATION
// ================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' });
    }

    const users = await dbHA.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, username]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Compte désactivé' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isUsingDefaultPassword = (password === 'admin123');

    // Mettre à jour last_login
    await dbHA.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.last_login,
        isDefaultPassword: isUsingDefaultPassword
      }
    });

    console.log(`🔐 Login réussi: ${user.username} (${user.role})`);
  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const users = await dbHA.query('SELECT * FROM users WHERE id = ?', [req.user.id]);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const user = users[0];

    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isDefaultPassword: user.is_default_password === 1
      }
    });
  } catch (error) {
    console.error('❌ Erreur verify token:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 6 caractères' });
    }

    const user = await dbHA.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user[0].password_hash);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const isSettingDefaultPassword = (newPassword === 'admin123');

    console.log('🔐 Changement mot de passe:', {
      user: req.user.username,
      newPasswordIsDefault: isSettingDefaultPassword
    });

    const defaultPasswordFlag = isSettingDefaultPassword ? 1 : 0;
    await dbHA.query(
        'UPDATE users SET password_hash = ?, is_default_password = ?, updated_at = NOW() WHERE id = ?',
        [newPasswordHash, defaultPasswordFlag, req.user.id]
    );

    res.json({ message: 'Mot de passe modifié avec succès' });
    console.log(`🔒 Mot de passe changé: ${req.user.username}`);
  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
  }
});

app.post('/api/auth/update-profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword } = req.body;

    if (!username || !email || !currentPassword) {
      return res.status(400).json({ error: 'Username, email et mot de passe actuel requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: 'Username doit contenir au moins 3 caractères (lettres, chiffres, _)' });
    }

    const user = await dbHA.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const existingUser = await dbHA.query(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
        [username, email, req.user.id]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Username ou email déjà utilisé' });
    }

    await dbHA.query(
        'UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?',
        [username, email, req.user.id]
    );

    const updatedUser = await dbHA.query('SELECT id, username, email, role FROM users WHERE id = ?', [req.user.id]);

    res.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser[0]
    });

    console.log(`👤 Profil modifié: ${req.user.username} → ${username}`);
  } catch (error) {
    console.error('❌ Erreur modification profil:', error);
    res.status(500).json({ error: 'Erreur lors de la modification du profil' });
  }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbHA.query(
        'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = ?',
        [req.user.id]
    );

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user: user[0] });
  } catch (error) {
    console.error('❌ Erreur récupération profil:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// ================================
// ENDPOINT MONITORING
// ================================

app.get('/api/monitoring', (req, res) => {
  const status = dbHA.getStatus();

  res.json({
    service: 'princept-cms-api',
    version: '1.0.0',
    status: status.isMySQL ? 'healthy' : 'down',
    database: {
      primary: {
        type: 'MySQL',
        connected: status.isMySQL,
        preferred: true
      }
    },
    monitoring: {
      active: status.isMonitoring,
      lastCheck: status.lastSyncTime
    },
    alerts: status.isMySQL ? [] : ['MySQL indisponible'],
    timestamp: new Date().toISOString()
  });
});

// ================================
// Démarrage
// ================================

async function start() {
  try {
    await new Promise((resolve) => {
      dbHA.once('initialized', resolve);
    });

    app.listen(PORT, () => {
      const status = dbHA.getStatus();

      console.log(`\n🚀 API Production HA (MySQL only) - Port ${PORT}`);
      console.log(`💾 Base: MYSQL`);
      console.log(`🏥 Status: ${status.isMySQL ? 'PRIMAIRE' : 'DOWN'}`);
      console.log(`📊 Health: http://localhost:${PORT}/api/health`);
      console.log(`📈 Monitor: http://localhost:${PORT}/api/monitoring`);
      console.log(`🌍 API: http://localhost:${PORT}/api/languages`);
    });
  } catch (error) {
    console.error('❌ Démarrage échoué:', error);
    process.exit(1);
  }
}

// Arrêt gracieux
process.on('SIGINT', async () => {
  console.log('\n🔄 Arrêt gracieux...');
  await dbHA.close();
  process.exit(0);
});

start();

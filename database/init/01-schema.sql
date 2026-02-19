-- Base de données Princept Website
-- Créée automatiquement au démarrage du container MySQL

USE princept_website;

-- Table des langues
CREATE TABLE languages (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  flag VARCHAR(10) DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  is_rtl BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des paramètres du site
CREATE TABLE site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value LONGTEXT,
  setting_type ENUM('string', 'json', 'boolean', 'number') DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des sections (contenu CMS)
CREATE TABLE sections (
  id VARCHAR(50) PRIMARY KEY,
  section_type VARCHAR(50) NOT NULL,
  section_data LONGTEXT, -- JSON data
  is_enabled BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  language_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL
);

-- Table des thèmes personnalisés
CREATE TABLE custom_themes (
  id VARCHAR(50) PRIMARY KEY,
  theme_name VARCHAR(100) NOT NULL,
  theme_config LONGTEXT, -- JSON configuration
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des paramètres de design
CREATE TABLE design_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_name VARCHAR(100) NOT NULL UNIQUE,
  setting_value LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des préférences utilisateur/admin
CREATE TABLE user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  preference_key VARCHAR(100) NOT NULL UNIQUE,
  preference_value LONGTEXT,
  preference_type ENUM('string', 'json', 'boolean', 'number') DEFAULT 'string',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des utilisateurs admin
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  is_default_password BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Utilisateur admin par défaut (password: admin123)
INSERT INTO users (username, email, password_hash, role, is_active, is_default_password) VALUES 
('admin', 'admin@princept-cms.local', '$2b$10$3h.sy0V.1LTl.oI0FUeuvuZREcAdBNF4fgJLnefGdQfOtriPGjoom', 'admin', TRUE, TRUE)
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), is_default_password=VALUES(is_default_password);

-- Préférences utilisateur par défaut
INSERT INTO user_preferences (preference_key, preference_value, preference_type) VALUES
('current_admin_language', 'fr', 'string'),
('admin_theme', 'light', 'string'),
('active_theme', 'default', 'string')
ON DUPLICATE KEY UPDATE preference_value=VALUES(preference_value);

-- Index pour les performances
CREATE INDEX idx_sections_language ON sections(language_id);
CREATE INDEX idx_sections_type ON sections(section_type);
CREATE INDEX idx_sections_enabled ON sections(is_enabled);
CREATE INDEX idx_languages_active ON languages(is_active);
CREATE INDEX idx_languages_default ON languages(is_default);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_design_settings_name ON design_settings(setting_name);
CREATE INDEX idx_user_preferences_key ON user_preferences(preference_key);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
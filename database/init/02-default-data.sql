-- Données par défaut pour Princept CMS

USE princept_website;

-- Insertion des langues par défaut
INSERT INTO languages (id, name, code, flag, is_active, is_default, is_rtl, sort_order) VALUES
('fr', 'Français', 'fr', '🇫🇷', TRUE, TRUE, FALSE, 1),
('en', 'English', 'en', '🇺🇸', TRUE, FALSE, FALSE, 2),
('es', 'Español', 'es', '🇪🇸', TRUE, FALSE, FALSE, 3),
('de', 'Deutsch', 'de', '🇩🇪', TRUE, FALSE, FALSE, 4),
('it', 'Italiano', 'it', '🇮🇹', TRUE, FALSE, FALSE, 5),
('ar', 'العربية', 'ar', '🇸🇦', TRUE, FALSE, TRUE, 6);

-- Paramètres par défaut du site
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', 'Princept CMS', 'string', 'Titre principal du site'),
('site_description', 'Un CMS moderne et flexible', 'string', 'Description du site'),
('active_theme', 'default', 'string', 'Thème actuellement actif'),
('current_admin_language', 'fr', 'string', 'Langue de l\'interface admin'),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance activé/désactivé'),
('created_at', NOW(), 'string', 'Date de création du site');

-- Paramètres de design par défaut
INSERT INTO design_settings (setting_name, setting_value) VALUES
('header_style', 'default'),
('footer_style', 'default'),
('color_scheme', 'default'),
('typography', 'default');
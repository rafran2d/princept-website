-- Données initiales pour Princept CMS
-- Langues de base avec CH (Suisse) incluse

USE princept_website;

-- Langues existantes du système
INSERT INTO languages (id, name, code, flag, is_active, is_default, is_rtl, sort_order) VALUES
('fr', 'Français', 'fr', '🇫🇷', 1, 1, 0, 1),
('en', 'English', 'en', '🇺🇸', 1, 0, 0, 2),
('es', 'Español', 'es', '🇪🇸', 1, 0, 0, 3),
('it', 'Italiano', 'it', '🇮🇹', 1, 0, 0, 4),
('de', 'Deutsch', 'de', '🇩🇪', 1, 0, 0, 5),
('pt', 'Português', 'pt', '🇵🇹', 1, 0, 0, 6),
('ar', 'العربية', 'ar', '🇸🇦', 1, 0, 1, 7),
('ch', 'Schweizerdeutsch', 'ch', '🇨🇭', 1, 0, 0, 8),
('jp', '日本語', 'jp', '🇯🇵', 1, 0, 0, 9),
('kr', '한국어', 'kr', '🇰🇷', 1, 0, 0, 10);

-- Paramètres de site par défaut
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', 'Princept CMS', 'string', 'Titre principal du site'),
('site_description', 'Système de gestion de contenu moderne', 'string', 'Description du site'),
('default_language', 'fr', 'string', 'Langue par défaut du site'),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance activé'),
('contact_email', 'contact@princept.com', 'string', 'Email de contact principal'),
('social_links', '{"facebook": "", "twitter": "", "instagram": ""}', 'json', 'Liens réseaux sociaux'),
('seo_settings', '{"meta_title": "", "meta_description": "", "keywords": ""}', 'json', 'Paramètres SEO globaux');

-- Préférences utilisateur/admin par défaut
INSERT INTO user_preferences (preference_key, preference_value, preference_type) VALUES
('current_admin_language', 'fr', 'string'),
('admin_theme', 'light', 'string'),
('active_theme', 'default', 'string'),
('auto_save', 'true', 'boolean'),
('show_tips', 'true', 'boolean');

-- Paramètres de design par défaut
INSERT INTO design_settings (setting_name, setting_value) VALUES
('primary_color', '#3B82F6'),
('secondary_color', '#10B981'),
('font_family', 'Inter, system-ui, sans-serif'),
('layout_mode', 'full-width'),
('header_height', '64'),
('sidebar_width', '280');
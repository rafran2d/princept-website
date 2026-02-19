import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Palette,
  Settings,
  Eye,
  Home,
  Plus,
  Brush,
  Globe,
  LogOut,
  User,
  Mail,
  FileText,
  Database
} from 'lucide-react';
import { useSections } from '../../hooks/useSections';
import { AdminThemeProviderAPI, useAdminThemeAPI } from '../../contexts/AdminThemeContextAPI';
import { useAuth } from '../../contexts/AuthContext';
import SectionList from './SectionList';
import SectionEditor from './SectionEditor';
import SiteSettings from './SiteSettings';
import UserSettings from './UserSettings';
import ThemeToggle from './ThemeToggle';
import DesignSettings from './DesignSettings';
import LanguageManagement from './LanguageManagement';
import DefaultPasswordAlert from './DefaultPasswordAlert';
import EmailProviderSettings from './EmailProviderSettings';
import PageManagement from './PageManagement';
import ContentFiller from './ContentFiller';
import { predefinedThemes } from '../../data/themes';

const AdminLayoutContent = () => {
  console.log('🏠 AdminLayoutContent - Début du chargement');
  
  const location = useLocation();
  console.log('📍 Location récupéré:', location.pathname);
  
  const navigate = useNavigate();
  console.log('🧭 Navigate récupéré');
  
  const { sections, getSectionTemplates } = useSections();
  console.log('📦 useSections récupéré, sections:', sections.length);
  const { isDark } = useAdminThemeAPI();
  const { user, logout } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [forceRender, setForceRender] = useState(0);
  
  // Force re-render when location changes
  useEffect(() => {
    if (currentPath !== location.pathname) {
      console.log('🔄 URL changed to:', location.pathname);
      setCurrentPath(location.pathname);
      setForceRender(prev => prev + 1);
    }
  }, [location.pathname, currentPath]);
  
  // Récupération du thème actuel depuis localStorage
  const getCurrentTheme = () => {
    const activeTheme = localStorage.getItem('activeTheme') || 'default';
    return predefinedThemes[activeTheme] || predefinedThemes.default;
  };

  const sidebarItems = [
    { id: 'sections', label: 'Sections', icon: LayoutGrid, path: '/admin' },
    { id: 'design', label: 'Design', icon: Palette, path: '/admin/design' },
    { id: 'languages', label: 'Langues', icon: Globe, path: '/admin/languages' },
    { id: 'pages', label: 'Pages', icon: FileText, path: '/admin/pages' },
    { id: 'content', label: 'Générateur', icon: Database, path: '/admin/content' },
    { id: 'email', label: 'Email', icon: Mail, path: '/admin/email' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/admin/settings' },
    { id: 'user', label: 'Utilisateur', icon: User, path: '/admin/user' }
  ];

  const isActive = (path) => {
    // Normaliser les chemins pour éviter les problèmes avec les barres obliques finales
    const currentPath = location.pathname.replace(/\/$/, '') || '/admin';
    const targetPath = path.replace(/\/$/, '') || '/admin';
    
    // Cas spécial pour la page sections
    if (targetPath === '/admin' && (currentPath === '/admin' || currentPath.startsWith('/admin/section'))) {
      return true;
    }
    
    return currentPath === targetPath;
  };

  const { addSection } = useSections();

  try {
    console.log('🔧 AdminLayoutContent - Début du rendu');

  const handleAddSection = (template) => {
    const sectionData = {
      type: template.type,
      ...template.defaultData
    };
    
    addSection(sectionData);
    setShowAddModal(false);
    navigate('/admin');
  };

  return (
    <div className={`min-h-screen admin-container ${isDark ? 'admin-dark' : ''}`} style={{ backgroundColor: 'var(--admin-bg-secondary)' }}>
      {/* Header */}
      <header className="admin-header">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center space-x-6">
            <Link to="/fr" className="group flex items-center space-x-3 admin-text-secondary hover:admin-text-primary transition-all duration-200">
              <div className="p-2 rounded-lg admin-card group-hover:bg-blue-100 transition-colors duration-200">
                <Home size={18} className="group-hover:text-blue-600 transition-colors duration-200" />
              </div>
              <span className="font-medium admin-text-primary">Retour au site</span>
            </Link>
            <div className="h-8 w-px" style={{ backgroundColor: 'var(--admin-border)' }} />
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <LayoutGrid size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold admin-text-primary">
                  Administration
                </h1>
                <p className="text-xs admin-text-muted font-medium">Panneau de contrôle</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Bouton Ajouter Section */}
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              style={{ color: 'white !important' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-2" style={{ color: 'white' }}>
                <div className="p-1 bg-white/20 rounded-lg">
                  <Plus size={18} className="transition-transform duration-200 group-hover:rotate-90" style={{ color: 'white' }} />
                </div>
                <span style={{ color: 'white' }}>Ajouter Section</span>
              </div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            {/* Bouton Aperçu */}
            <Link
              to="/fr"
              target="_blank"
              className="group relative flex items-center space-x-2 bg-gradient-to-r from-slate-500 to-slate-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              style={{ color: 'white !important' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-2" style={{ color: 'white' }}>
                <div className="p-1 bg-white/20 rounded-lg">
                  <Eye size={18} className="transition-transform duration-200 group-hover:scale-110" style={{ color: 'white' }} />
                </div>
                <span style={{ color: 'white' }}>Aperçu</span>
              </div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-3">
              {/* User Info Button */}
              <Link
                to="/admin/user"
                className="group relative flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                style={{ color: 'white !important' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center space-x-2" style={{ color: 'white' }}>
                  <div className="p-1 bg-white/20 rounded-lg">
                    <User size={18} className="transition-transform duration-200 group-hover:scale-110" style={{ color: 'white' }} />
                  </div>
                  <span style={{ color: 'white' }}>{user?.username}</span>
                </div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="group relative flex items-center space-x-2 bg-gradient-to-r from-zinc-500 to-zinc-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                title="Se déconnecter"
                style={{ color: 'white !important' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-600 to-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center space-x-2" style={{ color: 'white' }}>
                  <div className="p-1 bg-white/20 rounded-lg">
                    <LogOut size={18} className="transition-transform duration-200 group-hover:rotate-12" style={{ color: 'white' }} />
                  </div>
                  <span style={{ color: 'white' }}>Déconnexion</span>
                </div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 admin-sidebar shadow-sm min-h-screen">
          <nav className="p-6">
            <div className="mb-6">
              <h2 className="text-xs font-bold admin-text-muted uppercase tracking-wider mb-4">Navigation</h2>
            </div>
            <ul className="space-y-3">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                // Couleurs spécifiques pour chaque section
                const getItemColors = (itemId) => {
                  const colorMap = {
                    sections: { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600', shadow: 'shadow-blue-100' },
                    themes: { bg: 'from-purple-50 to-violet-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600', shadow: 'shadow-purple-100' },
                    design: { bg: 'from-pink-50 to-rose-50', border: 'border-pink-200', text: 'text-pink-700', icon: 'text-pink-600', shadow: 'shadow-pink-100' },
                    languages: { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600', shadow: 'shadow-green-100' },
                    pages: { bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600', shadow: 'shadow-indigo-100' },
                    content: { bg: 'from-teal-50 to-cyan-50', border: 'border-teal-200', text: 'text-teal-700', icon: 'text-teal-600', shadow: 'shadow-teal-100' },
                    email: { bg: 'from-cyan-50 to-sky-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'text-cyan-600', shadow: 'shadow-cyan-100' },
                    settings: { bg: 'from-gray-50 to-slate-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-600', shadow: 'shadow-gray-100' },
                    user: { bg: 'from-orange-50 to-amber-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600', shadow: 'shadow-orange-100' }
                  };
                  return colorMap[itemId] || colorMap.settings;
                };

                const colors = getItemColors(item.id);

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        console.log('🖱️ Clicking nav button:', item.label, 'to:', item.path);
                        // Simple navigation - useEffect will handle the state update
                        navigate(item.path, { replace: true });
                      }}
                      className={`w-full text-left group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        active
                          ? `bg-gradient-to-r ${colors.bg} ${colors.border} border ${colors.text} font-semibold shadow-lg ${colors.shadow}`
                          : 'admin-nav-item border border-transparent'
                      }`}
                    >
                      {/* Indicateur actif */}
                      {active && (
                        <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 ${colors.icon.replace('text-', 'bg-')} rounded-r-full`} />
                      )}
                      
                      {/* Icône avec design amélioré */}
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                        active 
                          ? `bg-white/70 ${colors.icon} shadow-sm` 
                          : 'group-hover:admin-bg-tertiary admin-text-secondary'
                      }`}>
                        <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      
                      <span className={`text-sm transition-all duration-200 ${
                        active ? 'font-bold' : 'font-medium group-hover:font-semibold'
                      }`}>
                        {item.label}
                      </span>

                      {/* Badge de notification si nécessaire */}
                      {item.id === 'sections' && sections.length > 0 && (
                        <div className={`ml-auto flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                          active 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {sections.length}
                        </div>
                      )}

                      {/* Effet de survol */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-white/10 to-white/5 pointer-events-none" />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Séparateur décoratif */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <div className="px-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              </div>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
          </nav>

          {/* Current Theme - Design amélioré */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <Brush className="w-4 h-4 mr-2 text-blue-600" />
              Thème actuel
            </h3>
            {getCurrentTheme() && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-md border-2 border-white flex items-center justify-center"
                    style={{ backgroundColor: getCurrentTheme().colors.primary }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full bg-white opacity-80"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{getCurrentTheme().name}</div>
                    <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full inline-block">
                      {getCurrentTheme().category}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  {getCurrentTheme().description}
                </div>
                <div className="flex items-center space-x-1 mt-3">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: getCurrentTheme().colors.primary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: getCurrentTheme().colors.secondary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: getCurrentTheme().colors.accent }}
                  />
                  <span className="text-xs text-gray-500 ml-2">Palette</span>
                </div>
              </div>
            )}
          </div>

          {/* Sections Summary - Design amélioré */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <LayoutGrid className="w-4 h-4 mr-2 text-green-600" />
              Résumé
            </h3>
            <div className="space-y-3">
              {/* Total sections */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-700">Total sections</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{sections.length}</span>
                </div>
              </div>
              
              {/* Sections actives */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-700">Sections actives</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {sections.filter(s => s.enabled).length}
                  </span>
                </div>
              </div>
              
              {/* Sections masquées */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-700">Sections masquées</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {sections.filter(s => !s.enabled).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3" style={{ backgroundColor: 'var(--admin-bg-secondary)' }}>
          {/* Alerte pour les identifiants par défaut */}
          <DefaultPasswordAlert />
          
          {console.log('🔀 AdminLayout - Route actuelle:', location.pathname)}
          <Routes key={`${currentPath}-${forceRender}`}>
            <Route path="/" element={
              <>
                {console.log('📍 Route: Admin home')}
                <SectionList key={`sections-${forceRender}`} />
              </>
            } />
            <Route path="section" element={
              <>
                {console.log('📍 Route: Section list')}
                <SectionList key={`sections-list-${forceRender}`} />
              </>
            } />
            <Route path="section/:id" element={
              <>
                {console.log('📍 Route: Section editor avec ID')}
                <SectionEditor key={`editor-${currentPath}-${forceRender}`} />
              </>
            } />
            <Route path="design" element={<DesignSettings key={`design-${forceRender}`} />} />
            <Route path="languages" element={<LanguageManagement key={`languages-${forceRender}`} />} />
            <Route path="pages" element={<PageManagement key={`pages-${forceRender}`} />} />
            <Route path="content" element={<ContentFiller key={`content-${forceRender}`} />} />
            <Route path="email" element={<EmailProviderSettings key={`email-${forceRender}`} />} />
            <Route path="settings" element={<SiteSettings key={`settings-${forceRender}`} />} />
            <Route path="user" element={<UserSettings key={`user-${forceRender}`} />} />
          </Routes>
        </main>
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="admin-card rounded-xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold admin-text-primary">Ajouter une section</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="admin-text-muted hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSectionTemplates().map((template) => (
                <div
                  key={template.type}
                  className="admin-section-card rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleAddSection(template)}
                >
                  <h3 className="text-lg font-semibold mb-2 admin-text-primary">{template.name}</h3>
                  <p className="admin-text-secondary text-sm mb-4">{template.description}</p>
                  <button className="w-full admin-button-primary py-2 px-4 rounded-lg transition-colors">
                    Ajouter
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  } catch (error) {
    console.error('❌ AdminLayoutContent - Erreur:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: '#ff5722', color: '#fff' }}>
        <h1>❌ Erreur AdminLayoutContent</h1>
        <p>Message: {error.message}</p>
        <p>Stack: {error.stack}</p>
      </div>
    );
  }
};

const AdminLayout = () => {
  console.log('🏗️ AdminLayout - Composant principal chargé');
  
  try {
    console.log('🏗️ AdminLayout - Tentative de chargement AdminThemeProviderAPI');
    return (
      <AdminThemeProviderAPI>
        <AdminLayoutContent />
      </AdminThemeProviderAPI>
    );
  } catch (error) {
    console.error('❌ AdminLayout - Erreur:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffeb3b', color: '#000' }}>
        <h1>❌ Erreur AdminLayout</h1>
        <p>Message: {error.message}</p>
        <p>Stack: {error.stack}</p>
      </div>
    );
  }
};

export default AdminLayout;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Frontend from './Frontend';
import SectionPage from './SectionPage';
import PageView from './PageView';
import LanguageRouter from './LanguageRouter';
import AdminLayout from './admin/AdminLayout';
import LoginPage from './admin/LoginPage';
import ProtectedRoute from './admin/ProtectedRoute';
import DefaultLanguageRedirect from './DefaultLanguageRedirect';
import { useLanguage } from '../contexts/LanguageContextDB';

/**
 * Composant qui gère toutes les routes de l'application
 */
const AppRoutes = () => {
  const { getActiveLanguages, isLoading } = useLanguage();
  const activeLanguages = getActiveLanguages();

  console.log('🛣️ AppRoutes - Loading:', isLoading, 'Languages:', activeLanguages.map(l => l.code));

  // Si les langues sont en cours de chargement, ne pas afficher les routes de redirection
  if (isLoading) {
    return (
      <Routes>
        {/* Route de login admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        
        {/* Routes admin protégées */}
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        } />
        
        {/* Pendant le chargement, ne pas rediriger */}
        <Route path="*" element={<div></div>} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Route de login admin */}
      <Route path="/admin/login" element={<LoginPage />} />
      
      {/* Routes admin protégées */}
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout />
        </ProtectedRoute>
      } />
      
      {/* Redirection de la racine vers la langue par défaut */}
      <Route path="/" element={<DefaultLanguageRedirect />} />
      
      {/* Routes multilingues dynamiques basées sur les langues actives */}
      {activeLanguages.map((language) => (
        <React.Fragment key={language.code}>
          {/* Route principale pour la langue */}
          <Route 
            path={`/${language.code}`} 
            element={
              <LanguageRouter>
                <Frontend />
              </LanguageRouter>
            } 
          />
          
          {/* Route pour les sections de la langue */}
          <Route 
            path={`/${language.code}/section/:sectionType`} 
            element={
              <LanguageRouter>
                <SectionPage />
              </LanguageRouter>
            } 
          />
          
          {/* Route pour les pages dynamiques */}
          <Route 
            path={`/${language.code}/page/:slug`} 
            element={
              <LanguageRouter>
                <PageView />
              </LanguageRouter>
            } 
          />
        </React.Fragment>
      ))}
      
      {/* Route pour les pages sans préfixe de langue (redirection vers la langue par défaut) */}
      <Route 
        path="/page/:slug" 
        element={<DefaultLanguageRedirect />} 
      />
      
      {/* Redirection pour toute autre route vers la langue par défaut */}
      <Route path="*" element={<DefaultLanguageRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
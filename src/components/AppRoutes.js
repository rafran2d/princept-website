import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Frontend from './Frontend';
import SectionPage from './SectionPage';
import LanguageRouter from './LanguageRouter';
import AdminLayout from './admin/AdminLayout';
import DefaultLanguageRedirect from './DefaultLanguageRedirect';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Composant qui gère toutes les routes de l'application
 */
const AppRoutes = () => {
  const { getActiveLanguages } = useLanguage();
  const activeLanguages = getActiveLanguages();

  console.log('🛣️ AppRoutes - Generating routes for languages:', activeLanguages.map(l => l.code));

  return (
    <Routes>
      {/* Admin reste sans préfixe de langue - DOIT être avant les autres routes */}
      <Route path="/admin/*" element={<AdminLayout />} />
      
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
        </React.Fragment>
      ))}
      
      {/* Redirection pour toute autre route vers la langue par défaut */}
      <Route path="*" element={<DefaultLanguageRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
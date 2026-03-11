import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContextDB';

const DefaultLanguageRedirect = () => {
  const { getDefaultLanguage, isLoading } = useLanguage();
  const defaultLanguage = getDefaultLanguage();
  
  // Si les langues sont en cours de chargement, attendre
  if (isLoading) {
    return null;
  }
  
  return <Navigate to={`/${defaultLanguage?.code || 'fr'}`} replace />;
};

export default DefaultLanguageRedirect;
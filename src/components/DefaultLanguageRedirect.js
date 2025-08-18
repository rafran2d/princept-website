import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const DefaultLanguageRedirect = () => {
  const { getDefaultLanguage } = useLanguage();
  const defaultLanguage = getDefaultLanguage();
  
  return <Navigate to={`/${defaultLanguage?.code || 'fr'}`} replace />;
};

export default DefaultLanguageRedirect;
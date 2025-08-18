import { useEffect } from 'react';

/**
 * Composant qui écoute les changements de langues et force le rechargement de l'app si nécessaire
 */
const DynamicLanguageRouter = ({ children }) => {

  useEffect(() => {
    // Écouter les événements de mise à jour des langues
    const handleLanguagesUpdated = () => {
      console.log('🔄 Languages updated, refreshing app routes...');
      // Forcer le rechargement de l'application pour que les nouvelles routes soient prises en compte
      window.location.reload();
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('languagesUpdated', handleLanguagesUpdated);

    // Nettoyer l'écouteur au démontage
    return () => {
      window.removeEventListener('languagesUpdated', handleLanguagesUpdated);
    };
  }, []);

  return children;
};

export default DynamicLanguageRouter;
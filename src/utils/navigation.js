/**
 * Navigation intelligente qui gère automatiquement les redirections
 * en fonction du mode de navigation des sections
 */

/**
 * Navigue vers un lien en gérant automatiquement les sections avec mode "nouvelle page"
 * @param {string} link - Le lien de destination (ex: "#contact", "https://example.com", "/about")
 * @param {Array} enabledSections - Liste des sections activées avec leur configuration
 * @param {string} currentLang - Langue courante pour les redirections (optionnel, par défaut 'fr')
 */
export const smartNavigate = (link, enabledSections, currentLang = 'fr') => {
  if (!link) return;

  // Si le lien commence par #, c'est une ancre vers une section
  if (link.startsWith('#')) {
    const sectionId = link.substring(1); // Enlever le #
    
    // Chercher la section correspondante dans les sections activées
    const targetSection = enabledSections.find(section => section.type === sectionId);
    
    if (targetSection && targetSection.navigationMode === 'newpage') {
      // Si la section est en mode "nouvelle page", rediriger vers la route dédiée avec préfixe langue
      window.location.href = `/${currentLang}/section/${sectionId}`;
      return;
    }
    
    // Sinon, comportement normal de scroll vers l'ancre
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const headerOffset = 80; // Offset pour le header fixe
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // Si l'élément n'existe pas sur la page actuelle, rediriger vers la homepage avec ancre et langue
      window.location.href = `/${currentLang}/${link}`;
    }
  } else {
    // Pour tous les autres liens (externes, absolus, relatifs), redirection normale
    if (link.startsWith('http') || link.startsWith('//')) {
      // Lien externe - ouvrir dans un nouvel onglet
      window.open(link, '_blank');
    } else {
      // Lien interne - ajouter le préfixe de langue si ce n'est pas déjà fait
      if (link.startsWith('/admin')) {
        // Les liens admin restent sans préfixe de langue
        window.location.href = link;
      } else if (link.startsWith(`/${currentLang}`) || link.includes('/admin')) {
        // Le lien a déjà un préfixe de langue ou c'est un lien admin
        window.location.href = link;
      } else {
        // Ajouter le préfixe de langue
        const cleanLink = link.startsWith('/') ? link : `/${link}`;
        window.location.href = `/${currentLang}${cleanLink}`;
      }
    }
  }
};

/**
 * Hook personnalisé pour utiliser la navigation intelligente
 * @param {Array} enabledSections - Liste des sections activées
 * @param {string} currentLang - Langue courante (optionnel, par défaut 'fr')
 * @returns {Function} - Fonction de navigation intelligente avec les sections pré-chargées
 */
export const useSmartNavigation = (enabledSections, currentLang = 'fr') => {
  return (link) => smartNavigate(link, enabledSections, currentLang);
};
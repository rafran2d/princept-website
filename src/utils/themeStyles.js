// Styles spécifiques pour chaque thème
export const getThemeStyles = (themeId) => {
  const themeStyles = {
    default: {
      heroStyle: {
        layout: 'centered',
        backgroundStyle: 'clean',
        buttonStyle: 'rounded-lg',
        textAlign: 'center',
        spacing: 'comfortable',
        animation: 'subtle'
      },
      sectionStyle: {
        padding: 'normal',
        borderRadius: 'small',
        shadowLevel: 'subtle',
        borderStyle: 'none'
      },
      cardStyle: {
        style: 'flat',
        hover: 'lift',
        borderRadius: 'lg'
      }
    },

    github: {
      // Style GitHub - Clean et technique
      heroStyle: {
        layout: 'centered',
        backgroundStyle: 'gradient', // solid, gradient, pattern
        buttonStyle: 'rounded-md',
        textAlign: 'center',
        spacing: 'comfortable',
        animation: 'subtle'
      },
      sectionStyle: {
        padding: 'normal',
        borderRadius: 'small',
        shadowLevel: 'subtle',
        borderStyle: 'subtle'
      },
      cardStyle: {
        style: 'flat',
        hover: 'lift',
        borderRadius: 'md'
      }
    },
    
    airbnb: {
      // Style Airbnb - Chaleureux et accueillant
      heroStyle: {
        layout: 'asymmetric',
        backgroundStyle: 'image-overlay',
        buttonStyle: 'rounded-full',
        textAlign: 'left',
        spacing: 'generous',
        animation: 'smooth'
      },
      sectionStyle: {
        padding: 'generous',
        borderRadius: 'large',
        shadowLevel: 'medium',
        borderStyle: 'none'
      },
      cardStyle: {
        style: 'elevated',
        hover: 'scale',
        borderRadius: 'lg'
      }
    },

    spotify: {
      // Style Spotify - Sombre et vibrant
      heroStyle: {
        layout: 'full-width',
        backgroundStyle: 'dark-gradient',
        buttonStyle: 'rounded-full',
        textAlign: 'center',
        spacing: 'tight',
        animation: 'dynamic'
      },
      sectionStyle: {
        padding: 'compact',
        borderRadius: 'minimal',
        shadowLevel: 'strong',
        borderStyle: 'glow'
      },
      cardStyle: {
        style: 'dark-glass',
        hover: 'glow',
        borderRadius: 'sm'
      }
    },

    slack: {
      // Style Slack - Copie conforme du vrai design Slack
      heroStyle: {
        layout: 'slack-fullwidth',
        backgroundStyle: 'slack-gradient',
        buttonStyle: 'slack-rounded',
        textAlign: 'center',
        spacing: 'slack-generous',
        animation: 'slack-smooth'
      },
      sectionStyle: {
        padding: 'slack-fullwidth',
        borderRadius: 'none',
        shadowLevel: 'none',
        borderStyle: 'none',
        fullWidth: true
      },
      cardStyle: {
        style: 'slack-card',
        hover: 'slack-lift',
        borderRadius: 'lg',
        shadow: 'slack-subtle'
      },
      navigation: {
        style: 'slack-nav',
        background: 'white',
        sticky: true
      },
      footer: {
        style: 'slack-footer',
        background: 'slack-dark',
        fullWidth: true
      }
    },

    notion: {
      // Style Notion - Minimaliste et clean
      heroStyle: {
        layout: 'minimal',
        backgroundStyle: 'clean',
        buttonStyle: 'minimal',
        textAlign: 'left',
        spacing: 'minimal',
        animation: 'subtle'
      },
      sectionStyle: {
        padding: 'minimal',
        borderRadius: 'subtle',
        shadowLevel: 'none',
        borderStyle: 'minimal'
      },
      cardStyle: {
        style: 'minimal',
        hover: 'subtle',
        borderRadius: 'sm'
      }
    },

    netflix: {
      // Style Netflix - Cinématique
      heroStyle: {
        layout: 'cinematic',
        backgroundStyle: 'dark-image',
        buttonStyle: 'bold',
        textAlign: 'center',
        spacing: 'cinematic',
        animation: 'dramatic'
      },
      sectionStyle: {
        padding: 'cinematic',
        borderRadius: 'minimal',
        shadowLevel: 'dramatic',
        borderStyle: 'none'
      },
      cardStyle: {
        style: 'cinematic',
        hover: 'zoom',
        borderRadius: 'minimal'
      }
    },

    apple: {
      // Style Apple - Premium et épuré
      heroStyle: {
        layout: 'premium',
        backgroundStyle: 'clean-gradient',
        buttonStyle: 'premium',
        textAlign: 'center',
        spacing: 'premium',
        animation: 'elegant'
      },
      sectionStyle: {
        padding: 'premium',
        borderRadius: 'large',
        shadowLevel: 'elegant',
        borderStyle: 'none'
      },
      cardStyle: {
        style: 'premium',
        hover: 'elegant',
        borderRadius: 'xl'
      }
    },

    discord: {
      // Style Discord - Gaming
      heroStyle: {
        layout: 'gaming',
        backgroundStyle: 'dark-pattern',
        buttonStyle: 'gaming',
        textAlign: 'center',
        spacing: 'gaming',
        animation: 'energetic'
      },
      sectionStyle: {
        padding: 'gaming',
        borderRadius: 'gaming',
        shadowLevel: 'neon',
        borderStyle: 'neon'
      },
      cardStyle: {
        style: 'gaming',
        hover: 'neon',
        borderRadius: 'lg'
      }
    },

    figma: {
      // Style Figma - Créatif et coloré
      heroStyle: {
        layout: 'creative',
        backgroundStyle: 'colorful-gradient',
        buttonStyle: 'creative',
        textAlign: 'dynamic',
        spacing: 'creative',
        animation: 'playful'
      },
      sectionStyle: {
        padding: 'creative',
        borderRadius: 'varied',
        shadowLevel: 'colorful',
        borderStyle: 'creative'
      },
      cardStyle: {
        style: 'creative',
        hover: 'colorful',
        borderRadius: 'varied'
      }
    },

    medium: {
      // Style Medium - Lecture optimisée
      heroStyle: {
        layout: 'article',
        backgroundStyle: 'clean',
        buttonStyle: 'minimal',
        textAlign: 'left',
        spacing: 'reading',
        animation: 'gentle'
      },
      sectionStyle: {
        padding: 'reading',
        borderRadius: 'minimal',
        shadowLevel: 'subtle',
        borderStyle: 'minimal'
      },
      cardStyle: {
        style: 'article',
        hover: 'gentle',
        borderRadius: 'minimal'
      }
    }
  };

  return themeStyles[themeId] || themeStyles.default;
};

// Fonction pour générer les classes CSS basées sur le style du thème
export const getThemeClasses = (themeId, component = 'section') => {
  const styles = getThemeStyles(themeId);
  
  const classMap = {
    // Padding styles with fixed heights to match Hero sections
    padding: {
      minimal: 'min-h-[70vh] flex items-center justify-center py-8 px-4',
      compact: 'min-h-[75vh] flex items-center justify-center py-12 px-6',
      normal: 'min-h-[80vh] flex items-center justify-center py-16 px-6',
      comfortable: 'min-h-[80vh] flex items-center justify-center py-20 px-8',
      generous: 'min-h-[85vh] flex items-center justify-center py-24 px-8',
      structured: 'min-h-[80vh] flex items-center justify-center py-20 px-6',
      professional: 'min-h-[80vh] flex items-center justify-center py-18 px-6',
      premium: 'min-h-[85vh] flex items-center justify-center py-28 px-8',
      gaming: 'min-h-[85vh] flex items-center justify-center py-16 px-6',
      creative: 'min-h-[80vh] flex items-center justify-center py-20 px-8',
      reading: 'min-h-[70vh] flex items-center justify-center py-16 px-6',
      cinematic: 'min-h-[85vh] flex items-center justify-center py-32 px-8',
      'slack-fullwidth': 'min-h-[80vh] flex items-center justify-center py-16 px-0',
      'slack-generous': 'min-h-[80vh] flex items-center justify-center py-20 px-0'
    },
    
    // Border radius styles
    borderRadius: {
      minimal: 'rounded-sm',
      subtle: 'rounded',
      small: 'rounded-md',
      medium: 'rounded-lg',
      large: 'rounded-xl',
      gaming: 'rounded-lg',
      varied: 'rounded-2xl',
      xl: 'rounded-2xl'
    },
    
    // Shadow styles
    shadowLevel: {
      none: '',
      subtle: 'shadow-sm',
      medium: 'shadow-md',
      strong: 'shadow-lg',
      crisp: 'shadow-lg',
      dramatic: 'shadow-2xl',
      elegant: 'shadow-xl',
      neon: 'shadow-2xl shadow-purple-500/20',
      colorful: 'shadow-lg shadow-pink-500/20'
    },
    
    // Border styles
    borderStyle: {
      none: '',
      minimal: 'border border-gray-100',
      subtle: 'border border-gray-200',
      accent: 'border-l-4 border-primary',
      glow: 'border border-primary/30',
      neon: 'border border-primary/50',
      creative: 'border-2 border-dashed border-primary/30'
    }
  };

  if (component === 'section') {
    const sectionStyle = styles.sectionStyle;
    return [
      classMap.padding[sectionStyle.padding] || classMap.padding.normal,
      classMap.borderRadius[sectionStyle.borderRadius] || classMap.borderRadius.medium,
      classMap.shadowLevel[sectionStyle.shadowLevel] || classMap.shadowLevel.subtle,
      classMap.borderStyle[sectionStyle.borderStyle] || classMap.borderStyle.none
    ].filter(Boolean).join(' ');
  }
  
  if (component === 'card') {
    const cardStyle = styles.cardStyle;
    return [
      classMap.borderRadius[cardStyle.borderRadius] || classMap.borderRadius.medium,
      classMap.shadowLevel[cardStyle.shadowLevel] || classMap.shadowLevel.subtle
    ].filter(Boolean).join(' ');
  }
  
  return '';
};

// Fonction pour obtenir les styles inline spécifiques au thème
export const getThemeInlineStyles = (themeId, component = 'section') => {
  const styles = getThemeStyles(themeId);
  
  if (component === 'hero') {
    const heroStyle = styles.heroStyle;
    
    const backgroundStyles = {
      solid: { background: 'var(--color-background)' },
      gradient: { 
        background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)` 
      },
      'dark-gradient': { 
        background: `linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%)` 
      },
      'image-overlay': { 
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      },
      'dark-image': { 
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1489599408084-0e13e4bb9a8b?ixlib=rb-4.0.3')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      },
      'colorful-gradient': { 
        background: `linear-gradient(45deg, var(--color-primary), var(--color-accent), var(--color-secondary))` 
      },
      pattern: {
        background: `var(--color-background)`,
        backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-primary)20 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, var(--color-accent)20 0%, transparent 50%)`
      },
      'dark-pattern': {
        background: `var(--color-background)`,
        backgroundImage: `radial-gradient(circle at 20% 80%, var(--color-primary)30 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, var(--color-accent)30 0%, transparent 50%)`
      },
      clean: { background: 'var(--color-background)' },
      'clean-gradient': { 
        background: `linear-gradient(180deg, var(--color-background) 0%, var(--color-surface) 100%)` 
      },
      'slack-gradient': {
        background: `linear-gradient(135deg, #4A154B 0%, #350D36 25%, #2D0B31 50%, #4A154B 75%, #611F69 100%)`,
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        minHeight: '100vh'
      },
      'agency-gradient': {
        background: `linear-gradient(160deg, #0F172A 0%, #1E1B4B 35%, #312E81 70%, #0F172A 100%)`,
        backgroundSize: '400% 400%',
        animation: 'agency-gradient-shift 20s ease infinite',
        position: 'relative',
        overflow: 'hidden'
      },
      'hairnet-clean': {
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }
    };
    
    return backgroundStyles[heroStyle.backgroundStyle] || backgroundStyles.clean;
  }
  
  return {};
};

// Fonction pour obtenir les classes d'animation
export const getThemeAnimations = (themeId) => {
  const styles = getThemeStyles(themeId);
  const animationType = styles?.heroStyle?.animation;
  
  const animations = {
    subtle: 'transition-all duration-300 ease-in-out',
    smooth: 'transition-all duration-500 ease-out',
    dynamic: 'transition-all duration-200 ease-in-out',
    professional: 'transition-all duration-300 ease-in-out',
    dramatic: 'transition-all duration-700 ease-out',
    elegant: 'transition-all duration-400 ease-out',
    energetic: 'transition-all duration-150 ease-in',
    playful: 'transition-all duration-300 ease-bounce',
    gentle: 'transition-all duration-400 ease-in-out',
    agency: 'transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1)',
    'slack-smooth': 'transition-all duration-500 ease-out'
  };
  
  return animations[animationType] || animations.subtle;
};
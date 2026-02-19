// Collection de thèmes inspirés de sites populaires
export const predefinedThemes = {
  // Thème Default - Design hairnet.fr (copie conforme)
  default: {
    id: 'default',
    name: 'Default',
    description: 'Thème professionnel inspiré de hairnet.fr : design épuré et moderne',
    category: 'Standard',
    colors: {
      primary: '#3f6ff7',
      secondary: '#333333',
      accent: '#3f6ff7',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: {
        primary: '#1a1a1a',
        secondary: '#666666',
        light: '#999999'
      }
    },
    typography: {
      fontFamily: 'Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },
  // 1. GitHub - Couleurs authentiques
  github: {
    id: 'github',
    name: 'GitHub',
    description: 'Thème authentique avec les vraies couleurs de GitHub',
    category: 'Tech',
    colors: {
      primary: '#0969da',
      secondary: '#656d76',
      accent: '#1a7f37',
      success: '#1a7f37',
      warning: '#fb8500',
      error: '#d1242f',
      background: '#ffffff',
      surface: '#f6f8fa',
      text: {
        primary: '#24292f',
        secondary: '#656d76',
        light: '#8b949e'
      }
    },
    typography: {
      fontFamily: 'Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.375rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 2. Airbnb - Couleurs authentiques
  airbnb: {
    id: 'airbnb',
    name: 'Airbnb',
    description: 'Thème authentique avec les vraies couleurs coral d\'Airbnb',
    category: 'Lifestyle',
    colors: {
      primary: '#FF385C',
      secondary: '#C13515',
      accent: '#428BFF',
      success: '#008A05',
      warning: '#E07912',
      error: '#C13515',
      background: '#FFFFFF',
      surface: '#F7F7F7',
      text: {
        primary: '#222222',
        secondary: '#6A6A6A',
        light: '#B0B0B0'
      }
    },
    typography: {
      fontFamily: 'Airbnb Cereal VF, Circular, Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1128px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.5rem',
        base: '0.75rem',
        lg: '1rem',
        xl: '1.25rem'
      }
    }
  },

  // 3. Spotify - Thème sombre et vibrant
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    description: 'Thème sombre avec le vert signature de Spotify',
    category: 'Entertainment',
    colors: {
      primary: '#1db954',
      secondary: '#1ed760',
      accent: '#1db954',
      success: '#1db954',
      warning: '#f59e0b',
      error: '#e22134',
      background: '#191414',
      surface: '#282828',
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
        light: '#717171'
      }
    },
    typography: {
      fontFamily: 'Spotify Circular',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 4. Slack - Design professionnel
  slack: {
    id: 'slack',
    name: 'Slack',
    description: 'Design professionnel avec les couleurs vives de Slack',
    category: 'Business',
    colors: {
      primary: '#4a154b',
      secondary: '#ecb22e',
      accent: '#e01e5a',
      success: '#2eb67d',
      warning: '#ecb22e',
      error: '#e01e5a',
      background: '#ffffff',
      surface: '#f8f8f8',
      text: {
        primary: '#1d1c1d',
        secondary: '#616061',
        light: '#868686'
      }
    },
    typography: {
      fontFamily: 'Lato',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 5. Notion - Minimaliste et moderne
  notion: {
    id: 'notion',
    name: 'Notion',
    description: 'Design minimaliste et moderne inspiré de Notion',
    category: 'Productivity',
    colors: {
      primary: '#2f3437',
      secondary: '#37352f',
      accent: '#2eaadc',
      success: '#448361',
      warning: '#d9730d',
      error: '#eb5757',
      background: '#ffffff',
      surface: '#f7f6f3',
      text: {
        primary: '#37352f',
        secondary: '#6f6f6f',
        light: '#9b9b9b'
      }
    },
    typography: {
      fontFamily: 'Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '900px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.1875rem',
        base: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
      }
    }
  },

  // 6. Stripe - Design fin et élégant
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    description: 'Design fin et élégant avec les couleurs de Stripe',
    category: 'Fintech',
    colors: {
      primary: '#635bff',
      secondary: '#0a2540',
      accent: '#a960ee',
      success: '#00d924',
      warning: '#ffcb57',
      error: '#ff333d',
      background: '#f6f9fb',
      surface: '#ffffff',
      text: {
        primary: '#0a2540',
        secondary: '#3f4b66',
        light: '#727f96'
      }
    },
    typography: {
      fontFamily: 'Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 7. Figma - Créatif et coloré
  figma: {
    id: 'figma',
    name: 'Figma',
    description: 'Design créatif avec les couleurs vives de Figma',
    category: 'Design',
    colors: {
      primary: '#000000',
      secondary: '#697485',
      accent: '#f24e1e',
      success: '#0acf83',
      warning: '#ffcd29',
      error: '#f24e1e',
      background: '#ffffff',
      surface: '#ffffff',
      text: {
        primary: '#000000',
        secondary: '#697485',
        light: '#697485'
      }
    },
    typography: {
      fontFamily: 'Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 8. Discord - Gaming et communauté
  discord: {
    id: 'discord',
    name: 'Discord',
    description: 'Thème gaming avec le blurple signature de Discord',
    category: 'Gaming',
    colors: {
      primary: '#161CBB',
      secondary: '#1f1d5d',
      accent: '#ffffff',
      success: '#57f287',
      warning: '#fee75c',
      error: '#ed4245',
      background: '#23272A',
      surface: '#ffffff',
      text: {
        primary: '#ffffff',
        secondary: '#23272A',
        light: '#72767d'
      }
    },
    typography: {
      fontFamily: 'Whitney',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.1875rem',
        base: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
      }
    }
  },

  // 9. LinkedIn - Professionnel en bleu
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Design professionnel avec le bleu signature de LinkedIn',
    category: 'Professional',
    colors: {
      primary: '#0A66C2',
      secondary: '#004182',
      accent: '#70B5F9',
      success: '#057642',
      warning: '#f5c75d',
      error: '#cc1016',
      background: '#ffffff',
      surface: '#F3F2EF',
      text: {
        primary: '#000000',
        secondary: '#666666',
        light: '#999999'
      }
    },
    typography: {
      fontFamily: '-apple-system',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1128px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.125rem',
        base: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem'
      }
    }
  },

  // 10. Shopify - E-commerce vert
  shopify: {
    id: 'shopify',
    name: 'Shopify',
    description: 'Thème e-commerce avec le vert signature de Shopify',
    category: 'E-commerce',
    colors: {
      primary: '#95BF47',
      secondary: '#7AB55C',
      accent: '#5E8E3E',
      success: '#95BF47',
      warning: '#FFC700',
      error: '#D72C0D',
      background: '#ffffff',
      surface: '#FAFBFB',
      text: {
        primary: '#202223',
        secondary: '#6D7175',
        light: '#9CA3AF'
      }
    },
    typography: {
      fontFamily: 'Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 11. Netflix - Rouge et noir
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    description: 'Thème sombre avec le rouge signature de Netflix',
    category: 'Entertainment',
    colors: {
      primary: '#E50914',
      secondary: '#B81D24',
      accent: '#f5f5f1',
      success: '#46d369',
      warning: '#f9ca24',
      error: '#E50914',
      background: '#000000',
      surface: '#141414',
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
        light: '#808080'
      }
    },
    typography: {
      fontFamily: 'Netflix Sans',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.125rem',
        base: '0.25rem',
        lg: '0.375rem',
        xl: '0.5rem'
      }
    }
  },

  // 12. Apple - Minimalisme premium
  apple: {
    id: 'apple',
    name: 'Apple',
    description: 'Design minimaliste et premium inspiré d\'Apple',
    category: 'Tech',
    colors: {
      primary: '#000000',
      secondary: '#3d3d3f',
      accent: '#007aff',
      success: '#34c759',
      warning: '#ff9500',
      error: '#ff3b30',
      background: '#ffffff',
      surface: '#f2f2f2',
      text: {
        primary: '#0c0c0c',
        secondary: '#3d3d3d',
        light: '#8e8e93'
      }
    },
    typography: {
      fontFamily: '-apple-system',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.5rem',
        base: '0.75rem',
        lg: '1rem',
        xl: '1.25rem'
      }
    }
  },

  // 13. Dribbble - Créatif et rose
  dribbble: {
    id: 'dribbble',
    name: 'Dribbble',
    description: 'Design créatif avec le rose signature de Dribbble',
    category: 'Design',
    colors: {
      primary: '#e8308c',
      secondary: '#ee66aa',
      accent: '#3080e8',
      success: '#d1faf0',
      warning: '#f4b69c',
      error: '#e83a30',
      background: '#ffffff',
      surface: '#fafafa',
      text: {
        primary: '#000000',
        secondary: '#666666',
        light: '#999999'
      }
    },
    typography: {
      fontFamily: 'Marta',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 14. YouTube - Rouge et blanc
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    description: 'Design avec le rouge signature de YouTube',
    category: 'Entertainment',
    colors: {
      primary: '#FF0000',
      secondary: '#CC0000',
      accent: '#065fd4',
      success: '#00c851',
      warning: '#ffbb33',
      error: '#FF0000',
      background: '#ffffff',
      surface: '#f9f9f9',
      text: {
        primary: '#0f0f0f',
        secondary: '#606060',
        light: '#909090'
      }
    },
    typography: {
      fontFamily: 'Roboto',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.125rem',
        base: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem'
      }
    }
  },

  // 15. Medium - Lecture et écriture
  medium: {
    id: 'medium',
    name: 'Medium',
    description: 'Design optimisé pour la lecture inspiré de Medium',
    category: 'Publishing',
    colors: {
      primary: '#00ab6c',
      secondary: '#1a8917',
      accent: '#03dac6',
      success: '#1a8917',
      warning: '#f57c00',
      error: '#d32f2f',
      background: '#ffffff',
      surface: '#fafafa',
      text: {
        primary: '#242424',
        secondary: '#757575',
        light: '#b3b3b3'
      }
    },
    typography: {
      fontFamily: 'charter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.375rem',
        '2xl': '1.625rem',
        '3xl': '2rem',
        '4xl': '2.5rem'
      }
    },
    layout: {
      containerMaxWidth: '680px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.125rem',
        base: '0.25rem',
        lg: '0.375rem',
        xl: '0.5rem'
      }
    }
  },

  // 16. Twitch - Gaming violet
  twitch: {
    id: 'twitch',
    name: 'Twitch',
    description: 'Thème gaming avec le violet signature de Twitch',
    category: 'Gaming',
    colors: {
      primary: '#9147ff',
      secondary: '#18181b',
      accent: '#00faa0',
      success: '#00faa0',
      warning: '#ff8500',
      error: '#ff6b8a',
      background: '#000000',
      surface: '#fafafa',
      text: {
        primary: '#ffffff',
        secondary: '#000000',
        light: '#808080'
      }
    },
    typography: {
      fontFamily: 'Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 17. Instagram - Gradients et couleurs vives
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Design coloré avec les gradients d\'Instagram',
    category: 'Social',
    colors: {
      primary: '#0095F6',
      secondary: '#00376B',
      accent: '#e41e3f',
      success: '#45BD62',
      warning: '#f0ad4e',
      error: '#e41e3f',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: {
        primary: '#1C1E21',
        secondary: '#8e8e8e',
        light: '#c7c7c7'
      }
    },
    typography: {
      fontFamily: '-apple-system',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '975px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.1875rem',
        base: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
      }
    }
  },

  // 18. WhatsApp - Vert messaging
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Design messaging avec le vert de WhatsApp',
    category: 'Communication',
    colors: {
      primary: '#25D366',
      secondary: '#128C7E',
      accent: '#075E54',
      success: '#25D366',
      warning: '#ffc107',
      error: '#dc3545',
      background: '#ffffff',
      surface: '#f0f2f5',
      text: {
        primary: '#111B21',
        secondary: '#667781',
        light: '#8696a0'
      }
    },
    typography: {
      fontFamily: 'Segoe UI',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  },

  // 19. Behance - Portfolio créatif
  behance: {
    id: 'behance',
    name: 'Behance',
    description: 'Design portfolio avec le bleu de Behance',
    category: 'Design',
    colors: {
      primary: '#1769FF',
      secondary: '#0057FF',
      accent: '#FF3366',
      success: '#05ce78',
      warning: '#ffc107',
      error: '#FF1744',
      background: '#ffffff',
      surface: '#f3f3f4',
      text: {
        primary: '#191919',
        secondary: '#696969',
        light: '#a2a2a2'
      }
    },
    typography: {
      fontFamily: 'Adobe Clean',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.125rem',
        base: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem'
      }
    }
  },

  // 20. Uber - Design moderne et clean
  uber: {
    id: 'uber',
    name: 'Uber',
    description: 'Design moderne et clean inspiré d\'Uber',
    category: 'Transport',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#09B3AF',
      success: '#5fb709',
      warning: '#FFC72C',
      error: '#CD201F',
      background: '#ffffff',
      surface: '#f6f6f6',
      text: {
        primary: '#000000',
        secondary: '#545454',
        light: '#939393'
      }
    },
    typography: {
      fontFamily: 'UberMove',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.125rem',
        base: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem'
      }
    }
  },

  // 21. Cursor - AI Code Editor
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    description: 'Thème moderne et minimaliste inspiré de l\'éditeur Cursor',
    category: 'Tech',
    colors: {
      primary: '#000000',
      secondary: '#17191d',
      accent: '#6366f1',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#111827',
        secondary: '#6b7280',
        light: '#9ca3af'
      }
    },
    typography: {
      fontFamily: 'Inter',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    layout: {
      containerMaxWidth: '1200px',
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      borderRadius: {
        sm: '0.375rem',
        base: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      }
    }
  }
};

// Fonction pour obtenir la liste des thèmes par catégorie
export const getThemesByCategory = () => {
  const categories = {};
  
  Object.values(predefinedThemes).forEach(theme => {
    if (!categories[theme.category]) {
      categories[theme.category] = [];
    }
    categories[theme.category].push(theme);
  });
  
  return categories;
};

// Fonction pour obtenir un thème par ID
export const getThemeById = (themeId) => {
  return predefinedThemes[themeId] || null;
};

// Liste des catégories disponibles
export const themeCategories = [
  'Tech',
  'Lifestyle',
  'Entertainment',
  'Business',
  'Productivity',
  'Fintech',
  'Design',
  'Gaming',
  'Professional',
  'E-commerce',
  'Publishing',
  'Social',
  'Communication',
  'Transport'
];
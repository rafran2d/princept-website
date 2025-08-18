// Composants thématiques pour chaque marque
import { 
  GitHubHeroSection, 
  GitHubFeaturesSection, 
  GitHubTestimonialsSection,
  AirbnbHeroSection, 
  AirbnbCategoriesSection, 
  AirbnbListingsSection,
  AirbnbHostSection,
  SpotifyHeroSection, 
  SpotifyPlaylistsSection, 
  SpotifyPlayerSection,
  SpotifyFeaturesSection,
  themedSections
} from '../components/sections/themed/AllThemedSections';

// Import all headers
import {
  GitHubHeader,
  AirbnbHeader,
  SpotifyHeader,
  DefaultHeader,
  SlackHeader,
  NotionHeader,
  StripeHeader,
  FigmaHeader,
  DiscordHeader,
  LinkedInHeader,
  ShopifyHeader,
  NetflixHeader,
  AppleHeader,
  DribbbleHeader,
  YoutubeHeader,
  MediumHeader,
  TwitchHeader,
  InstagramHeader,
  WhatsAppHeader,
  BehanceHeader,
  UberHeader,
  CursorHeader
} from '../components/headers/AllThemedHeaders';

// Import all footers
import {
  GitHubFooter,
  AirbnbFooter,
  SpotifyFooter,
  DefaultFooter,
  SlackFooter,
  NotionFooter,
  StripeFooter,
  FigmaFooter,
  DiscordFooter,
  LinkedInFooter,
  ShopifyFooter,
  NetflixFooter,
  AppleFooter,
  DribbbleFooter,
  YoutubeFooter,
  MediumFooter,
  TwitchFooter,
  InstagramFooter,
  WhatsAppFooter,
  BehanceFooter,
  UberFooter,
  CursorFooter
} from '../components/footers/AllThemedFooters';

// Configuration des composants thématiques pour tous les 22 thèmes
export const themedComponents = {
  default: {
    header: DefaultHeader,
    sections: [
      {
        id: 'hero',
        name: 'Default Hero',
        component: themedSections.default.hero,
        description: 'Section hero moderne et équilibrée'
      }
    ],
    footer: DefaultFooter
  },
  
  github: {
    header: GitHubHeader,
    sections: [
      {
        id: 'hero',
        name: 'GitHub Hero',
        component: GitHubHeroSection,
        description: 'Section hero authentique de GitHub avec carousel de fonctionnalités'
      },
      {
        id: 'features',
        name: 'GitHub Features',
        component: GitHubFeaturesSection,
        description: 'Sections de fonctionnalités avec icônes et descriptions'
      },
      {
        id: 'testimonials',
        name: 'GitHub Testimonials',
        component: GitHubTestimonialsSection,
        description: 'Témoignages clients avec logos d\'entreprises'
      }
    ],
    footer: GitHubFooter
  },

  airbnb: {
    header: AirbnbHeader,
    sections: [
      {
        id: 'hero',
        name: 'Airbnb Hero',
        component: AirbnbHeroSection,
        description: 'Hero avec recherche intégrée style Airbnb'
      },
      {
        id: 'categories',
        name: 'Airbnb Categories',
        component: AirbnbCategoriesSection,
        description: 'Barre de catégories horizontale avec icônes'
      },
      {
        id: 'listings',
        name: 'Airbnb Listings',
        component: AirbnbListingsSection,
        description: 'Grille de logements avec photos et détails'
      },
      {
        id: 'host',
        name: 'Airbnb Host',
        component: AirbnbHostSection,
        description: 'Section incitative pour devenir hôte'
      }
    ],
    footer: AirbnbFooter
  },

  spotify: {
    header: SpotifyHeader,
    sections: [
      {
        id: 'hero',
        name: 'Spotify Hero',
        component: SpotifyHeroSection,
        description: 'Hero minimaliste avec gradient et CTA'
      },
      {
        id: 'playlists',
        name: 'Spotify Playlists',
        component: SpotifyPlaylistsSection,
        description: 'Grille de playlists avec boutons play au hover'
      },
      {
        id: 'player',
        name: 'Spotify Player',
        component: SpotifyPlayerSection,
        description: 'Mockup du lecteur Spotify avec contrôles'
      },
      {
        id: 'features',
        name: 'Spotify Features',
        component: SpotifyFeaturesSection,
        description: 'Fonctionnalités principales avec icônes'
      }
    ],
    footer: SpotifyFooter
  },

  slack: {
    header: SlackHeader,
    sections: [
      {
        id: 'hero',
        name: 'Slack Hero',
        component: themedSections.slack.hero,
        description: 'Hero Slack avec gradient animé et collaboration'
      }
    ],
    footer: SlackFooter
  },

  notion: {
    header: NotionHeader,
    sections: [
      {
        id: 'hero',
        name: 'Notion Hero',
        component: themedSections.notion.hero,
        description: 'Hero avec "AI workspace" et grille bento'
      }
    ],
    footer: NotionFooter
  },

  stripe: {
    header: StripeHeader,
    sections: [
      {
        id: 'hero',
        name: 'Stripe Hero',
        component: themedSections.stripe.hero,
        description: 'Hero avec gradient et dashboard mockup'
      }
    ],
    footer: StripeFooter
  },

  figma: {
    header: FigmaHeader,
    sections: [
      {
        id: 'hero',
        name: 'Figma Hero',
        component: themedSections.figma.hero,
        description: 'Hero minimaliste noir et blanc'
      }
    ],
    footer: FigmaFooter
  },

  discord: {
    header: DiscordHeader,
    sections: [
      {
        id: 'hero',
        name: 'Discord Hero',
        component: themedSections.discord.hero,
        description: 'Hero avec illustrations Wumpus et gaming'
      }
    ],
    footer: DiscordFooter
  },

  linkedin: {
    header: LinkedInHeader,
    sections: [
      {
        id: 'hero',
        name: 'LinkedIn Hero',
        component: themedSections.linkedin.hero,
        description: 'Hero professionnel avec networking'
      }
    ],
    footer: LinkedInFooter
  },

  shopify: {
    header: ShopifyHeader,
    sections: [
      {
        id: 'hero',
        name: 'Shopify Hero',
        component: themedSections.shopify.hero,
        description: 'Hero e-commerce avec focus sur les ventes'
      }
    ],
    footer: ShopifyFooter
  },

  netflix: {
    header: NetflixHeader,
    sections: [
      {
        id: 'hero',
        name: 'Netflix Hero',
        component: themedSections.netflix.hero,
        description: 'Hero sombre avec streaming focus'
      }
    ],
    footer: NetflixFooter
  },

  apple: {
    header: AppleHeader,
    sections: [
      {
        id: 'hero',
        name: 'Apple Hero',
        component: themedSections.apple.hero,
        description: 'Hero minimaliste et premium'
      }
    ],
    footer: AppleFooter
  },

  dribbble: {
    header: DribbbleHeader,
    sections: [
      {
        id: 'hero',
        name: 'Dribbble Hero',
        component: themedSections.dribbble.hero,
        description: 'Hero créatif avec portfolio focus'
      }
    ],
    footer: DribbbleFooter
  },

  youtube: {
    header: YoutubeHeader,
    sections: [
      {
        id: 'hero',
        name: 'YouTube Hero',
        component: themedSections.youtube.hero,
        description: 'Hero plateforme vidéo avec création focus'
      }
    ],
    footer: YoutubeFooter
  },

  medium: {
    header: MediumHeader,
    sections: [
      {
        id: 'hero',
        name: 'Medium Hero',
        component: themedSections.medium.hero,
        description: 'Hero publication avec focus lecture'
      }
    ],
    footer: MediumFooter
  },

  twitch: {
    header: TwitchHeader,
    sections: [
      {
        id: 'hero',
        name: 'Twitch Hero',
        component: themedSections.twitch.hero,
        description: 'Hero streaming gaming avec communauté'
      }
    ],
    footer: TwitchFooter
  },

  instagram: {
    header: InstagramHeader,
    sections: [
      {
        id: 'hero',
        name: 'Instagram Hero',
        component: themedSections.instagram.hero,
        description: 'Hero photo-centric avec partage social'
      }
    ],
    footer: InstagramFooter
  },

  whatsapp: {
    header: WhatsAppHeader,
    sections: [
      {
        id: 'hero',
        name: 'WhatsApp Hero',
        component: themedSections.whatsapp.hero,
        description: 'Hero messaging sécurisé et simple'
      }
    ],
    footer: WhatsAppFooter
  },

  behance: {
    header: BehanceHeader,
    sections: [
      {
        id: 'hero',
        name: 'Behance Hero',
        component: themedSections.behance.hero,
        description: 'Hero portfolio créatif et professionnel'
      }
    ],
    footer: BehanceFooter
  },

  uber: {
    header: UberHeader,
    sections: [
      {
        id: 'hero',
        name: 'Uber Hero',
        component: themedSections.uber.hero,
        description: 'Hero transport moderne et efficace'
      }
    ],
    footer: UberFooter
  },

  cursor: {
    header: CursorHeader,
    sections: [
      {
        id: 'hero',
        name: 'Cursor Hero',
        component: themedSections.cursor.hero,
        description: 'Hero éditeur AI avec développement focus'
      }
    ],
    footer: CursorFooter
  }
};

// Fonction pour obtenir les composants d'un thème
export const getThemedComponents = (themeId) => {
  return themedComponents[themeId] || themedComponents.default;
};

// Fonction pour obtenir toutes les sections disponibles pour un thème
export const getThemeSections = (themeId) => {
  const themed = themedComponents[themeId];
  return themed ? themed.sections : [];
};

// Fonction pour vérifier si un thème a des composants authentiques
export const hasThemedComponents = (themeId) => {
  const themed = themedComponents[themeId];
  return themed && (themed.header || themed.footer || themed.sections.length > 0);
};
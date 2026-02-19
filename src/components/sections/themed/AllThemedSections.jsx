import React from 'react';
import { ChevronRight, Star, GitBranch, Users, Shield, Play, Search, Heart, ShoppingBag, Globe, Award, Zap, Target, TrendingUp, Code, Briefcase, Camera, Music, Video, Mic, Trophy, Compass, Lightbulb, Rocket, Coffee, Palette } from 'lucide-react';

// Import existing themed sections
import {
  GitHubHeroSection,
  GitHubFeaturesSection,
  GitHubTestimonialsSection
} from './GitHubSections';

import {
  AirbnbHeroSection,
  AirbnbCategoriesSection,
  AirbnbListingsSection,
  AirbnbHostSection
} from './AirbnbSections';

import {
  SpotifyHeroSection,
  SpotifyPlaylistsSection,
  SpotifyPlayerSection,
  SpotifyFeaturesSection
} from './SpotifySections';

// Default Theme Sections
export const DefaultHeroSection = ({ theme, section }) => {
  return (
    <section className="py-20" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Bienvenue sur notre plateforme"}
          </h1>
          <p className="text-xl mb-8" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Découvrez une expérience unique et innovante"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-lg font-semibold" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
              {section?.buttonText || "Commencer"}
            </button>
            <button className="px-8 py-4 rounded-lg font-semibold border-2" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Slack Hero Section - Corporate workspace style
export const SlackHeroSection = ({ theme, section }) => {
  return (
    <section className="py-24" style={{ backgroundColor: theme.colors.surface }}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6">
              <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: theme.colors.primary + '20', color: theme.colors.primary }}>
                NOUVEAU - Collaboration avancée
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
              {section?.title || "Transformez votre façon de travailler"}
            </h1>
            <p className="text-lg mb-8" style={{ color: theme.colors.text.secondary }}>
              {section?.subtitle || "Avec nos outils de collaboration, votre équipe peut accomplir plus, ensemble."}
            </p>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 rounded-lg font-semibold" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
                {section?.buttonText || "Essayer gratuitement"}
              </button>
              <button className="px-6 py-3 rounded-lg font-semibold border" style={{ borderColor: theme.colors.text.light, color: theme.colors.text.primary }}>
                Voir la démo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-80 rounded-2xl" style={{ backgroundColor: theme.colors.primary + '10' }}>
              <div className="absolute inset-4 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 rounded" style={{ backgroundColor: theme.colors.surface }}></div>
                  <div className="h-4 rounded w-3/4" style={{ backgroundColor: theme.colors.surface }}></div>
                  <div className="h-4 rounded w-1/2" style={{ backgroundColor: theme.colors.surface }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Notion Hero Section - Clean minimal style
export const NotionHeroSection = ({ theme, section }) => {
  return (
    <section className="py-20" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: theme.colors.text.light + '30' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
              <span className="text-sm" style={{ color: theme.colors.text.secondary }}>Nouveau design, nouvelles possibilités</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Un espace de travail connecté"}
          </h1>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Écrivez, planifiez et collaborez. Tout en un seul endroit."}
          </p>
          <button className="px-6 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: theme.colors.text.primary, color: theme.colors.background }}>
            {section?.buttonText || "Commencer gratuitement"}
          </button>
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {['Pages', 'Bases de données', 'Collaboration'].map((feature, index) => (
              <div key={index} className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
                <h3 className="font-semibold mb-2" style={{ color: theme.colors.text.primary }}>{feature}</h3>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                  Découvrez des fonctionnalités puissantes pour votre workflow.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Stripe Hero Section - Payment focus
export const StripeHeroSection = ({ theme, section }) => {
  return (
    <section className="py-24" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Paiements pour l'internet"}
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Des millions d'entreprises de toutes tailles utilisent nos solutions pour accepter les paiements et gérer leurs revenus en ligne."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded-full font-semibold" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
              {section?.buttonText || "Commencer maintenant"}
            </button>
            <button className="px-8 py-4 rounded-full font-semibold border" style={{ borderColor: theme.colors.text.light, color: theme.colors.text.primary }}>
              Contacter les ventes
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: theme.colors.primary }}>135+</div>
              <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Devises supportées</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: theme.colors.primary }}>40+</div>
              <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Méthodes de paiement</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: theme.colors.primary }}>99.9%</div>
              <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Temps de disponibilité</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Figma Hero Section - Design-focused
export const FigmaHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-black text-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            {section?.title || "Nothing great is made alone"}
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            {section?.subtitle || "Design, prototype, and gather feedback all in one place with Figma."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100">
              {section?.buttonText || "Get started for free"}
            </button>
            <button className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:border-gray-400">
              Try in browser
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Palette size={32} />, title: "Design" },
              { icon: <Code size={32} />, title: "Prototype" },
              { icon: <Users size={32} />, title: "Collaborate" },
              { icon: <Zap size={32} />, title: "Handoff" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 text-gray-400">{item.icon}</div>
                <h3 className="font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Discord Hero Section - Gaming community
export const DiscordHeroSection = ({ theme, section }) => {
  return (
    <section style={{ backgroundColor: theme.colors.background }} className="text-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {section?.title || "IMAGINE UN ENDROIT..."}
          </h1>
          <p className="text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            {section?.subtitle || "...où vous pouvez faire partie d'un club scolaire, d'un groupe de gamers, ou d'une communauté artistique mondiale. Un endroit qui rend facile de parler chaque jour et de passer plus de temps ensemble."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100">
              {section?.buttonText || "Télécharger pour Mac"}
            </button>
            <button className="bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-700">
              Ouvrir Discord dans votre navigateur
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mt-20">
            {[
              { title: "Créez un serveur", desc: "Créez un serveur sur invitation uniquement où vos amis et vous pouvez passer du temps ensemble." },
              { title: "Rejoignez un serveur", desc: "Trouvez et rejoignez des serveurs communautaires avec des personnes qui partagent vos centres d'intérêt." },
              { title: "Restez connecté", desc: "Avec les messages vocaux, vous pouvez envoyer des messages vocaux rapides à vos amis." }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// LinkedIn Hero Section - Professional networking
export const LinkedInHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
              {section?.title || "Bienvenue dans votre communauté professionnelle"}
            </h1>
            <p className="text-lg mb-8" style={{ color: theme.colors.text.secondary }}>
              {section?.subtitle || "Connectez-vous avec des personnes qui peuvent vous aider. Recherchez des emplois. Développez vos compétences. Restez informé de votre secteur."}
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
                  <Users size={14} className="text-white" />
                </div>
                <span style={{ color: theme.colors.text.secondary }}>Connectez-vous avec 800M+ de professionnels</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
                  <Briefcase size={14} className="text-white" />
                </div>
                <span style={{ color: theme.colors.text.secondary }}>Explorez des millions d'offres d'emploi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.primary }}>
                  <TrendingUp size={14} className="text-white" />
                </div>
                <span style={{ color: theme.colors.text.secondary }}>Développez votre carrière</span>
              </div>
            </div>
            
            <button className="px-8 py-4 rounded font-semibold text-white text-lg" style={{ backgroundColor: theme.colors.primary }}>
              {section?.buttonText || "Rejoindre maintenant"}
            </button>
          </div>
          
          <div className="relative">
            <div className="w-full h-96 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
              <div className="absolute inset-8">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-lg p-4 flex flex-col justify-center items-center" style={{ backgroundColor: theme.colors.primary + '10' }}>
                      <div className="w-12 h-12 rounded-full mb-2" style={{ backgroundColor: theme.colors.primary }}></div>
                      <div className="w-16 h-2 rounded" style={{ backgroundColor: theme.colors.text.light }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Shopify Hero Section - E-commerce focus
export const ShopifyHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: theme.colors.primary + '10', color: theme.colors.primary }}>
              E-COMMERCE SOLUTION
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Créez votre boutique en ligne"}
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Lancez votre business et vendez partout avec notre plateforme e-commerce complète."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded-lg font-semibold text-white" style={{ backgroundColor: theme.colors.primary }}>
              {section?.buttonText || "Commencer gratuitement"}
            </button>
            <button className="px-8 py-4 rounded-lg font-semibold border" style={{ borderColor: theme.colors.text.light, color: theme.colors.text.primary }}>
              Voir les tarifs
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <ShoppingBag size={24} />, title: "Boutique", desc: "Créez votre site" },
              { icon: <Globe size={24} />, title: "Marketing", desc: "Attirez des clients" },
              { icon: <TrendingUp size={24} />, title: "Paiements", desc: "Vendez en ligne" },
              { icon: <Target size={24} />, title: "Shipping", desc: "Expédiez partout" }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
                <div className="mb-4" style={{ color: theme.colors.primary }}>{item.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: theme.colors.text.primary }}>{item.title}</h3>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Netflix Hero Section - Entertainment platform
export const NetflixHeroSection = ({ theme, section }) => {
  return (
    <section style={{ backgroundColor: theme.colors.background }} className="text-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {section?.title || "Films, séries TV et bien plus en illimité"}
          </h1>
          <p className="text-xl mb-8">
            {section?.subtitle || "Où que vous soyez. Annulez à tout moment."}
          </p>
          
          <div className="mb-12">
            <p className="text-lg mb-6">Prêt à regarder ? Saisissez votre adresse e-mail pour vous abonner ou réactiver votre abonnement.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Adresse e-mail" 
                className="flex-1 px-4 py-3 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400"
              />
              <button className="px-8 py-3 rounded font-semibold text-lg" style={{ backgroundColor: theme.colors.primary }}>
                {section?.buttonText || "Commencer >"}
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              { title: "Profitez sur votre TV", desc: "Regardez sur Smart TV, PlayStation, Xbox, Chromecast, Apple TV, lecteurs Blu-ray et bien plus." },
              { title: "Téléchargez vos séries", desc: "Sauvegardez facilement vos séries préférées et regardez-les toujours hors connexion." },
              { title: "Regardez partout", desc: "Regardez des films et séries en illimité sur votre téléphone, tablette, ordinateur portable et TV." }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Apple Hero Section - Product showcase
export const AppleHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-thin mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Think different."}
          </h1>
          <p className="text-2xl font-light mb-12" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "L'innovation à portée de main."}
          </p>
          
          <div className="flex justify-center gap-8 mb-16">
            <button className="px-6 py-3 rounded-full text-sm font-medium text-white" style={{ backgroundColor: theme.colors.primary }}>
              {section?.buttonText || "En savoir plus"}
            </button>
            <button className="px-6 py-3 rounded-full text-sm font-medium border" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
              Regarder l'événement
            </button>
          </div>
          
          <div className="w-full max-w-2xl mx-auto">
            <div className="aspect-video rounded-2xl" style={{ backgroundColor: theme.colors.surface }}>
              <div className="w-full h-full flex items-center justify-center">
                <Play size={64} style={{ color: theme.colors.primary }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Continue with remaining sections for all other themes...
// Dribbble, YouTube, Medium, Twitch, Instagram, WhatsApp, Behance, Uber, Cursor sections...

// Dribbble Hero Section - Creative showcase
export const DribbbleHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Découvrez le travail créatif du monde entier"}
          </h1>
          <p className="text-xl mb-12" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Dribbble est la première destination pour découvrir et se connecter avec les designers du monde entier."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded-full font-semibold text-white" style={{ backgroundColor: theme.colors.primary }}>
              {section?.buttonText || "S'inscrire"}
            </button>
            <button className="px-8 py-4 rounded-full font-semibold border-2" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
              Explorer les designs
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={32} style={{ color: theme.colors.primary }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// YouTube Hero Section - Video platform
export const YoutubeHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Partagez vos passions avec le monde"}
          </h1>
          <p className="text-xl mb-12" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Créez, partagez et découvrez des contenus extraordinaires sur la plus grande plateforme vidéo au monde."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded font-semibold text-white" style={{ backgroundColor: theme.colors.primary }}>
              {section?.buttonText || "Créer une chaîne"}
            </button>
            <button className="px-8 py-4 rounded font-semibold border" style={{ borderColor: theme.colors.text.light, color: theme.colors.text.primary }}>
              Explorer YouTube
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Video size={32} />, title: "Créer", desc: "Uploadez et partagez vos vidéos" },
              { icon: <Users size={32} />, title: "Communauté", desc: "Connectez-vous avec votre audience" },
              { icon: <Trophy size={32} />, title: "Monétiser", desc: "Gagnez de l'argent avec vos contenus" }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
                <div className="mb-4" style={{ color: theme.colors.primary }}>{item.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: theme.colors.text.primary }}>{item.title}</h3>
                <p style={{ color: theme.colors.text.secondary }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Medium Hero Section - Publishing platform
export const MediumHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Un lieu pour lire, écrire et développer sa compréhension"}
          </h1>
          <p className="text-xl mb-12" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Découvrez des histoires, des idées et de l'expertise de tous horizons."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded-full font-medium text-white" style={{ backgroundColor: theme.colors.primary }}>
              {section?.buttonText || "Commencer à lire"}
            </button>
            <button className="px-8 py-4 rounded-full font-medium border" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
              Commencer à écrire
            </button>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="prose prose-lg text-left" style={{ color: theme.colors.text.secondary }}>
              <p className="leading-relaxed">
                "Medium est un endroit pour lire des articles sur les sujets qui vous tiennent à cœur et pour découvrir des idées qui méritent d'être partagées."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Twitch Hero Section - Streaming platform
export const TwitchHeroSection = ({ theme, section }) => {
  return (
    <section style={{ backgroundColor: theme.colors.background }} className="text-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">
              {section?.title || "Vous êtes déjà incroyable"}
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              {section?.subtitle || "Nous sommes ici pour vous aider à le partager avec le monde. Streamez, chattez, créez des communautés autour de vos passions."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="px-8 py-4 rounded font-semibold text-lg" style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}>
                {section?.buttonText || "Commencer à streamer"}
              </button>
              <button className="px-8 py-4 rounded font-semibold border text-lg" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
                Regarder des streams
              </button>
            </div>
            
            <div className="flex gap-6">
              {[
                { icon: <Video size={24} />, text: "Streaming en direct" },
                { icon: <Mic size={24} />, text: "Chat interactif" },
                { icon: <Users size={24} />, text: "Communautés" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div style={{ color: theme.colors.primary }}>{item.icon}</div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video rounded-lg" style={{ backgroundColor: theme.colors.primary + '20' }}>
              <div className="w-full h-full flex items-center justify-center">
                <Play size={64} style={{ color: theme.colors.primary }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Instagram Hero Section - Photo sharing
export const InstagramHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Partagez vos moments"}
          </h1>
          <p className="text-xl mb-12" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Connectez-vous avec vos amis, partagez ce que vous faites et découvrez les moments des personnes qui vous tiennent à cœur."}
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={32} style={{ color: theme.colors.primary }} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 rounded-lg font-semibold text-white" style={{ backgroundColor: theme.colors.primary }}>
              {section?.buttonText || "Télécharger l'app"}
            </button>
            <button className="px-8 py-4 rounded-lg font-semibold border" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
              Explorer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// WhatsApp Hero Section - Messaging app
export const WhatsAppHeroSection = ({ theme, section }) => {
  return (
    <section style={{ backgroundColor: theme.colors.primary }} className="text-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6">
            {section?.title || "Simple. Sécurisé. Fiable."}
          </h1>
          <p className="text-xl mb-12 text-green-100">
            {section?.subtitle || "Avec WhatsApp, vous obtenez une messagerie et des appels rapides, simples, sécurisés et gratuits*, disponibles partout dans le monde."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-white px-8 py-4 rounded-full font-semibold text-lg" style={{ color: theme.colors.primary }}>
              {section?.buttonText || "Télécharger maintenant"}
            </button>
            <button className="border-2 border-white px-8 py-4 rounded-full font-semibold text-lg text-white hover:bg-white" style={{ '&:hover': { color: theme.colors.primary } }}>
              WhatsApp Web
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Messages", desc: "Envoyez des messages texte et vocaux, partagez des photos, vidéos, documents et emojis." },
              { title: "Appels", desc: "Passez des appels vocaux et vidéo gratuits* avec une connexion sécurisée de bout en bout." },
              { title: "Groupes", desc: "Restez en contact avec vos groupes de famille et d'amis." }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-green-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Behance Hero Section - Creative portfolio
export const BehanceHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "Showcase et découvrez les travaux créatifs"}
          </h1>
          <p className="text-xl mb-12" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Behance est le réseau créatif numéro un au monde pour présenter et découvrir des travaux créatifs."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded font-semibold text-white" style={{ backgroundColor: theme.colors.primary }}>
              {section?.buttonText || "Rejoindre Behance"}
            </button>
            <button className="px-8 py-4 rounded font-semibold border" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
              Explorer les projets
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/3] rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
                <div className="w-full h-full flex items-center justify-center">
                  <Palette size={28} style={{ color: theme.colors.primary }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Uber Hero Section - Transportation service
export const UberHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-black text-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {section?.title || "Bougez avec Uber"}
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            {section?.subtitle || "Demandez une course, passez commande ou réservez un trajet en quelques clics."}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-lg bg-gray-900">
              <h3 className="text-xl font-semibold mb-4">Courses</h3>
              <p className="text-gray-300 mb-4">Déplacez-vous dans votre ville</p>
              <button className="bg-white text-black px-6 py-3 rounded font-semibold w-full">
                {section?.buttonText || "Commander maintenant"}
              </button>
            </div>
            <div className="p-6 rounded-lg bg-gray-900">
              <h3 className="text-xl font-semibold mb-4">Livraison</h3>
              <p className="text-gray-300 mb-4">Faites-vous livrer vos plats favoris</p>
              <button className="bg-white text-black px-6 py-3 rounded font-semibold w-full">
                Commander à manger
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Sécurité", desc: "Votre sécurité est notre priorité absolue" },
              { title: "Fiabilité", desc: "Arrivez à destination en toute confiance" },
              { title: "Simplicité", desc: "Quelques clics suffisent" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Cursor Hero Section - AI-powered code editor
export const CursorHeroSection = ({ theme, section }) => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: theme.colors.text.light + '20', color: theme.colors.text.secondary }}>
              AI-POWERED CODING
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
            {section?.title || "L'éditeur de code du futur"}
          </h1>
          <p className="text-xl mb-12" style={{ color: theme.colors.text.secondary }}>
            {section?.subtitle || "Écrivez du code plus rapidement avec l'intelligence artificielle. Cursor comprend votre codebase et vous aide à développer plus efficacement."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded-lg font-semibold text-white" style={{ backgroundColor: theme.colors.text.primary }}>
              {section?.buttonText || "Télécharger gratuitement"}
            </button>
            <button className="px-8 py-4 rounded-lg font-semibold border" style={{ borderColor: theme.colors.text.light, color: theme.colors.text.primary }}>
              Voir la démo
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap size={24} />, title: "IA intégrée", desc: "Assistant IA qui comprend votre code" },
              { icon: <Code size={24} />, title: "Multi-langage", desc: "Support pour tous les langages populaires" },
              { icon: <Rocket size={24} />, title: "Performance", desc: "Éditeur ultra-rapide et réactif" }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.surface }}>
                <div className="mb-4" style={{ color: theme.colors.text.primary }}>{item.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: theme.colors.text.primary }}>{item.title}</h3>
                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Export mapping object for easy access
export const themedSections = {
  default: { 
    hero: DefaultHeroSection
  },
  github: {
    hero: GitHubHeroSection,
    features: GitHubFeaturesSection,
    testimonials: GitHubTestimonialsSection
  },
  airbnb: {
    hero: AirbnbHeroSection,
    categories: AirbnbCategoriesSection,
    listings: AirbnbListingsSection,
    host: AirbnbHostSection
  },
  spotify: {
    hero: SpotifyHeroSection,
    playlists: SpotifyPlaylistsSection,
    player: SpotifyPlayerSection,
    features: SpotifyFeaturesSection
  },
  slack: { 
    hero: SlackHeroSection
  },
  notion: { 
    hero: NotionHeroSection
  },
  stripe: { 
    hero: StripeHeroSection
  },
  figma: { 
    hero: FigmaHeroSection
  },
  discord: { 
    hero: DiscordHeroSection
  },
  linkedin: { 
    hero: LinkedInHeroSection
  },
  shopify: { 
    hero: ShopifyHeroSection
  },
  netflix: { 
    hero: NetflixHeroSection
  },
  apple: { 
    hero: AppleHeroSection
  },
  dribbble: { 
    hero: DribbbleHeroSection
  },
  youtube: { 
    hero: YoutubeHeroSection
  },
  medium: { 
    hero: MediumHeroSection
  },
  twitch: { 
    hero: TwitchHeroSection
  },
  instagram: { 
    hero: InstagramHeroSection
  },
  whatsapp: { 
    hero: WhatsAppHeroSection
  },
  behance: { 
    hero: BehanceHeroSection
  },
  uber: { 
    hero: UberHeroSection
  },
  cursor: { 
    hero: CursorHeroSection
  }
};

// Export individual sections for easy access
export {
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
  SpotifyFeaturesSection
};
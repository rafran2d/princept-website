import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Heart, Download, Shuffle, Repeat } from 'lucide-react';

export const SpotifyHeroSection = ({ theme }) => {
  return (
    <section 
      className="relative py-24 md:py-32 bg-gradient-to-b"
      style={{ 
        backgroundColor: theme.colors.background,
        backgroundImage: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.background})`
      }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ 
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily 
            }}
          >
            Music for everyone.
          </h1>
          <p 
            className="text-xl mb-8"
            style={{ color: theme.colors.text.secondary }}
          >
            Millions of songs. No credit card needed.
          </p>
          <button 
            className="px-12 py-4 rounded-full font-bold text-lg"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.background
            }}
          >
            GET SPOTIFY FREE
          </button>
        </div>
      </div>
    </section>
  );
};

export const SpotifyPlaylistsSection = ({ theme }) => {
  const playlists = [
    {
      title: "Today's Top Hits",
      description: "The most played songs right now",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3",
      songs: "50 songs"
    },
    {
      title: "RapCaviar",
      description: "New music from Drake, Travis Scott and more",
      image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3",
      songs: "65 songs"
    },
    {
      title: "All Out 2010s",
      description: "The biggest songs of the 2010s",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3",
      songs: "75 songs"
    },
    {
      title: "Rock Classics",
      description: "Rock legends & epic songs that continue to inspire",
      image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3",
      songs: "80 songs"
    }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <h2 
          className="text-3xl font-bold mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          Made for you
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {playlists.map((playlist, index) => (
            <div 
              key={index} 
              className="group cursor-pointer"
            >
              <div className="relative mb-4">
                <img 
                  src={playlist.image}
                  alt={playlist.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button 
                  className="absolute bottom-2 right-2 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Play size={20} style={{ color: theme.colors.background }} fill="currentColor" />
                </button>
              </div>
              <h3 
                className="font-bold mb-1 truncate"
                style={{ color: theme.colors.text.primary }}
              >
                {playlist.title}
              </h3>
              <p 
                className="text-sm mb-1"
                style={{ color: theme.colors.text.secondary }}
              >
                {playlist.description}
              </p>
              <span 
                className="text-xs"
                style={{ color: theme.colors.text.light }}
              >
                {playlist.songs}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SpotifyPlayerSection = ({ theme }) => {
  return (
    <section 
      className="py-16"
      style={{ backgroundColor: theme.colors.surface }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl font-bold text-center mb-12"
            style={{ color: theme.colors.text.primary }}
          >
            Your music, everywhere
          </h2>
          
          {/* Mock Player */}
          <div 
            className="rounded-xl p-6 shadow-xl"
            style={{ backgroundColor: theme.colors.background }}
          >
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3"
                alt="Now Playing"
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <h3 
                  className="font-bold"
                  style={{ color: theme.colors.text.primary }}
                >
                  As It Was
                </h3>
                <p style={{ color: theme.colors.text.secondary }}>
                  Harry Styles
                </p>
              </div>
              <button>
                <Heart size={20} style={{ color: theme.colors.text.secondary }} />
              </button>
              <button>
                <Download size={20} style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2" style={{ color: theme.colors.text.light }}>
                <span>1:23</span>
                <span>2:58</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-1">
                <div 
                  className="h-1 rounded-full"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    width: '45%'
                  }}
                ></div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button>
                <Shuffle size={20} style={{ color: theme.colors.text.secondary }} />
              </button>
              <button>
                <SkipBack size={20} style={{ color: theme.colors.text.primary }} />
              </button>
              <button 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <Play size={20} style={{ color: theme.colors.background }} fill="currentColor" />
              </button>
              <button>
                <SkipForward size={20} style={{ color: theme.colors.text.primary }} />
              </button>
              <button>
                <Repeat size={20} style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SpotifyFeaturesSection = ({ theme }) => {
  const features = [
    {
      title: "Play millions of songs",
      description: "Listen to the songs you love, and discover new music and podcasts.",
      icon: "🎵"
    },
    {
      title: "Playlists made easy",
      description: "We'll help you make playlists. Or enjoy playlists made by music experts.",
      icon: "📋"
    },
    {
      title: "Make it yours",
      description: "Tell us what you like, and we'll recommend music for you.",
      icon: "❤️"
    }
  ];

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: theme.colors.text.primary }}
        >
          Why Spotify?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 
                className="text-xl font-bold mb-3"
                style={{ color: theme.colors.text.primary }}
              >
                {feature.title}
              </h3>
              <p style={{ color: theme.colors.text.secondary }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
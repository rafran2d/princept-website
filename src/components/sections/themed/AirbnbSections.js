import React from 'react';
import { Search, MapPin, Calendar, Users, Star, Heart } from 'lucide-react';

export const AirbnbHeroSection = ({ theme }) => {
  return (
    <section 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1520637836862-4d197d17c86a?ixlib=rb-4.0.3')",
        backgroundColor: theme.colors.background
      }}
    >
      <div className="container mx-auto px-6 py-24 flex items-center min-h-screen">
        <div className="max-w-2xl">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ 
              color: '#ffffff',
              fontFamily: theme.typography.fontFamily 
            }}
          >
            Belong anywhere
          </h1>
          
          {/* Search Box */}
          <div 
            className="bg-white rounded-full shadow-lg p-4 flex flex-col md:flex-row gap-4"
            style={{ backgroundColor: theme.colors.surface }}
          >
            <div className="flex-1 flex items-center gap-3 px-4">
              <MapPin size={20} style={{ color: theme.colors.text.secondary }} />
              <input 
                type="text" 
                placeholder="Where are you going?"
                className="flex-1 outline-none"
                style={{ color: theme.colors.text.primary }}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4">
              <Calendar size={20} style={{ color: theme.colors.text.secondary }} />
              <input 
                type="text" 
                placeholder="Add dates"
                className="flex-1 outline-none"
                style={{ color: theme.colors.text.primary }}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4">
              <Users size={20} style={{ color: theme.colors.text.secondary }} />
              <input 
                type="text" 
                placeholder="Add guests"
                className="flex-1 outline-none"
                style={{ color: theme.colors.text.primary }}
              />
            </div>
            <button 
              className="px-8 py-3 rounded-full font-semibold flex items-center gap-2"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: '#ffffff'
              }}
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AirbnbCategoriesSection = ({ theme }) => {
  const categories = [
    { name: "Beachfront", icon: "🏖️" },
    { name: "Cabins", icon: "🏠" },
    { name: "Trending", icon: "🔥" },
    { name: "Luxury", icon: "💎" },
    { name: "Amazing pools", icon: "🏊‍♀️" },
    { name: "Countryside", icon: "🌾" },
    { name: "Design", icon: "🎨" },
    { name: "Castles", icon: "🏰" }
  ];

  return (
    <section className="py-8 border-b" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <div className="flex overflow-x-auto gap-8 pb-4">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="flex flex-col items-center min-w-fit cursor-pointer group"
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <span 
                className="text-sm whitespace-nowrap group-hover:underline"
                style={{ color: theme.colors.text.secondary }}
              >
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const AirbnbListingsSection = ({ theme }) => {
  const listings = [
    {
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3",
      location: "Paris, France",
      host: "Hosted by Marie",
      dates: "Nov 1-6",
      price: "$89",
      rating: "4.9"
    },
    {
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3",
      location: "Tokyo, Japan",
      host: "Hosted by Yuki",
      dates: "Dec 12-17",
      price: "$125",
      rating: "4.8"
    },
    {
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3",
      location: "New York, USA",
      host: "Hosted by Sarah",
      dates: "Jan 5-10",
      price: "$199",
      rating: "4.7"
    }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <h2 
          className="text-2xl font-semibold mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          Stays nearby
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative mb-3">
                <img 
                  src={listing.image}
                  alt={listing.location}
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button 
                  className="absolute top-3 right-3 p-2 rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <Heart size={16} className="text-white" />
                </button>
              </div>
              <div className="flex justify-between items-start mb-1">
                <h3 
                  className="font-semibold"
                  style={{ color: theme.colors.text.primary }}
                >
                  {listing.location}
                </h3>
                <div className="flex items-center gap-1">
                  <Star size={12} style={{ color: theme.colors.primary }} fill="currentColor" />
                  <span 
                    className="text-sm"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {listing.rating}
                  </span>
                </div>
              </div>
              <p 
                className="text-sm mb-1"
                style={{ color: theme.colors.text.secondary }}
              >
                {listing.host}
              </p>
              <p 
                className="text-sm mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                {listing.dates}
              </p>
              <p style={{ color: theme.colors.text.primary }}>
                <span className="font-semibold">{listing.price}</span>
                <span style={{ color: theme.colors.text.secondary }}> night</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const AirbnbHostSection = ({ theme }) => {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: theme.colors.surface }}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: theme.colors.text.primary }}
            >
              Try hosting
            </h2>
            <p 
              className="text-lg mb-8"
              style={{ color: theme.colors.text.secondary }}
            >
              Earn extra income and unlock new opportunities by sharing your space.
            </p>
            <button 
              className="px-8 py-4 rounded-lg font-semibold"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: '#ffffff'
              }}
            >
              Learn more
            </button>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3"
              alt="Hosting"
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
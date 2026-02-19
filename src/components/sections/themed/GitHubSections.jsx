import React from 'react';
import { ChevronRight, Star, GitBranch, Users, Shield } from 'lucide-react';

export const GitHubHeroSection = ({ theme, section }) => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ 
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily 
            }}
          >
{section?.title || "Build and ship software on a single, collaborative platform"}
          </h1>
          <p 
            className="text-lg md:text-xl mb-8"
            style={{ color: theme.colors.text.secondary }}
          >
{section?.subtitle || "Join over 100 million developers using GitHub to build, scale, and deliver secure software."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: '#ffffff'
              }}
            >
{section?.buttonText || "Start building for free"}
              <ChevronRight size={20} />
            </button>
            <button 
              className="px-8 py-4 rounded-lg font-semibold border-2"
              style={{ 
                borderColor: theme.colors.primary,
                color: theme.colors.primary,
                backgroundColor: 'transparent'
              }}
            >
              Start a free enterprise trial
            </button>
          </div>
        </div>
        
        {/* Carousel */}
        <div className="mt-16">
          <div className="flex justify-center space-x-8 mb-8">
            {['Code', 'Plan', 'Collaborate', 'Automate', 'Secure'].map((item, index) => (
              <div 
                key={item}
                className="px-4 py-2 rounded-full border"
                style={{ 
                  borderColor: index === 0 ? theme.colors.primary : theme.colors.text.light,
                  backgroundColor: index === 0 ? theme.colors.surface : 'transparent',
                  color: index === 0 ? theme.colors.primary : theme.colors.text.secondary
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const GitHubFeaturesSection = ({ theme }) => {
  const features = [
    {
      icon: <GitBranch size={24} />,
      title: "Collaboration",
      description: "Make it easy for your entire team to work together using issues, pull requests, and built-in code review."
    },
    {
      icon: <Star size={24} />,
      title: "Automation",
      description: "Automate your build, test, and deployment pipeline with world-class CI/CD."
    },
    {
      icon: <Shield size={24} />,
      title: "Security",
      description: "Keep your code secure with automated security fixes and vulnerability alerts."
    }
  ];

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: theme.colors.surface }}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: theme.colors.primary + '10', color: theme.colors.primary }}
              >
                {feature.icon}
              </div>
              <h3 
                className="text-xl font-semibold mb-3"
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

export const GitHubTestimonialsSection = ({ theme }) => {
  const testimonials = [
    {
      company: "Shopify",
      quote: "GitHub helps us ensure that we have our security controls baked into our whole software development life cycle.",
      author: "Patricia Nakache"
    },
    {
      company: "SAP",
      quote: "GitHub is our tool of choice for transparent, collaborative development.",
      author: "Cornelius Schumacher"
    }
  ];

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: theme.colors.background }}>
      <div className="container mx-auto px-6">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: theme.colors.text.primary }}
        >
          Trusted by developers
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-8 rounded-lg"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>
                {testimonial.company}
              </div>
              <blockquote 
                className="text-lg mb-4"
                style={{ color: theme.colors.text.primary }}
              >
                "{testimonial.quote}"
              </blockquote>
              <cite style={{ color: theme.colors.text.secondary }}>
                — {testimonial.author}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
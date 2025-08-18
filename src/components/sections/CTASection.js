import React from 'react';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';

const CTASection = ({ section, useGlobalStyles }) => {
  const { title, description, buttonText, buttonLink, backgroundColor, textColor } = section;
  const { getClasses, getAnimations, isTheme } = useThemeStyles();

  const sectionStyle = useGlobalStyles ? {} : {
    backgroundColor,
    color: textColor
  };

  return (
    <section 
      id="cta"
      className={`${isTheme('slack') ? 'min-h-[80vh] flex items-center justify-center py-16' : 'min-h-[80vh] flex items-center justify-center py-20'} relative overflow-hidden ${getAnimations()}`}
      style={isTheme('slack') ? { 
        background: 'linear-gradient(135deg, #4A154B 0%, #350D36 25%, #2D0B31 50%, #4A154B 75%, #611F69 100%)',
        ...sectionStyle 
      } : sectionStyle}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className={`${isTheme('slack') ? 'w-full px-6 max-w-5xl mx-auto' : 'container mx-auto px-6'} relative z-10`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white bg-opacity-20 mb-6">
              <Star className={`w-10 h-10 ${isTheme('slack') ? 'text-white' : 'text-current'}`} />
            </div>
            
            <h2 className={`${
              isTheme('slack') ? 'text-4xl md:text-6xl' :
              'text-3xl md:text-5xl'
            } font-bold mb-6 leading-tight ${isTheme('slack') ? 'text-white' : 'text-current'}`}>
              {title}
            </h2>
            
            <p className={`${
              isTheme('slack') ? 'text-xl md:text-2xl' : 'text-xl md:text-2xl'
            } opacity-90 mb-8 leading-relaxed ${isTheme('slack') ? 'text-white' : 'text-current'}`}>
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <div className="flex items-center">
              <CheckCircle className={`w-6 h-6 mr-3 ${isTheme('slack') ? 'text-green-300' : 'text-green-300'}`} />
              <span className={`text-lg opacity-90 ${isTheme('slack') ? 'text-white' : 'text-current'}`}>Essai gratuit 30 jours</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className={`w-6 h-6 mr-3 ${isTheme('slack') ? 'text-green-300' : 'text-green-300'}`} />
              <span className={`text-lg opacity-90 ${isTheme('slack') ? 'text-white' : 'text-current'}`}>Sans engagement</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className={`w-6 h-6 mr-3 ${isTheme('slack') ? 'text-green-300' : 'text-green-300'}`} />
              <span className={`text-lg opacity-90 ${isTheme('slack') ? 'text-white' : 'text-current'}`}>Support 24/7</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {buttonText && buttonLink && (
              <a
                href={buttonLink}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                style={{
                  backgroundColor: isTheme('slack') ? '#007A5A' : 'var(--color-surface)',
                  color: isTheme('slack') ? 'white' : 'var(--color-text-primary)',
                  borderRadius: isTheme('slack') ? '0.5rem' : 'var(--border-radius-lg)'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                {buttonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            )}
            
            <button className={`inline-flex items-center border-2 border-white border-opacity-50 px-8 py-4 text-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all duration-300 ${
              isTheme('slack') ? 'rounded-lg text-white' : 'rounded-lg text-white'
            }`}>
              En savoir plus
            </button>
          </div>

          <div className="mt-12 text-center opacity-75">
            <p className={`text-sm mb-4 ${isTheme('slack') ? 'text-white' : 'text-current'}`}>Déjà utilisé par plus de 10,000 entreprises</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Company logos placeholder */}
              <div className="w-24 h-8 bg-white bg-opacity-20 rounded"></div>
              <div className="w-24 h-8 bg-white bg-opacity-20 rounded"></div>
              <div className="w-24 h-8 bg-white bg-opacity-20 rounded"></div>
              <div className="w-24 h-8 bg-white bg-opacity-20 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <div className="w-4 h-4 bg-white rounded-full"></div>
      </div>
      <div className="absolute top-1/3 right-10 opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>
        <div className="w-6 h-6 bg-white rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}>
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
    </section>
  );
};

export default CTASection;
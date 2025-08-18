import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Github,
  Hash // Pour TikTok car il n'y a pas d'icône TikTok dans lucide-react
} from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const SocialLinks = ({ className = '', size = 18, showLabels = false, iconStyle = {}, linkClassName = '', customStyles = false, circularStyle = false, circularBgStyle = {} }) => {
  const { settings, getVisibleSocialNetworks } = useSiteSettings();
  
  // Mapping des icônes pour chaque réseau social
  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    github: Github,
    tiktok: Hash // Utilise Hash comme icône temporaire pour TikTok
  };

  // Couleurs hover pour chaque réseau
  const hoverColors = {
    facebook: 'hover:bg-blue-600',
    twitter: 'hover:bg-blue-400',
    instagram: 'hover:bg-pink-600',
    linkedin: 'hover:bg-blue-700',
    youtube: 'hover:bg-red-600',
    github: 'hover:bg-gray-700',
    tiktok: 'hover:bg-black'
  };

  const visibleNetworks = getVisibleSocialNetworks();

  if (!settings.showSocialLinks || visibleNetworks.length === 0) {
    return null;
  }

  return (
    <div className={`flex ${customStyles ? 'gap-4' : 'space-x-4'} ${className}`}>
      {visibleNetworks.map(({ name, url, label }) => {
        const IconComponent = socialIcons[name];
        const hoverColor = hoverColors[name] || 'hover:bg-gray-600';
        
        if (!IconComponent || !url) return null;

        const linkClasses = circularStyle 
          ? "w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
          : customStyles 
            ? `hover:opacity-70 ${linkClassName}` 
            : `w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center ${hoverColor} transition-colors duration-200 group`;
        
        const linkStyle = circularStyle ? circularBgStyle : {};

        return (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
            style={linkStyle}
            title={label || name}
          >
            <IconComponent size={size} style={customStyles || circularStyle ? iconStyle : {}} />
            {showLabels && (
              <span className="ml-2 text-sm font-medium group-hover:text-white">
                {label || name}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
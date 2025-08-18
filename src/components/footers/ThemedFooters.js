import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Github } from 'lucide-react';
import { useFrontendLanguage } from '../LanguageSelector';

export const GitHubFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  // Adaptation des sections avec le contenu utilisateur
  const footerSections = [
    {
      title: "Navigation",
      links: navigationItems?.map(item => ({
        label: item.label,
        onClick: () => scrollToSection?.(item.type, item.sectionId)
      })) || []
    },
    {
      title: "Contact",
      links: [
        settings?.email && { label: settings.email, href: `mailto:${settings.email}` },
        settings?.phone && { label: settings.phone, href: `tel:${settings.phone}` },
        { label: "Administration", href: "/admin" }
      ].filter(Boolean)
    }
  ];

  return (
    <footer 
      className="border-t"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.text.light + '20'
      }}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Logo and Social */}
          <div className="md:col-span-1">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-8 w-auto object-contain mb-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <div 
              className={`text-2xl font-bold mb-4 ${settings?.logoUrl ? 'hidden' : 'block'}`}
              style={{ color: theme.colors.text.primary }}
            >
              {settings?.logoText || ''}
            </div>
            <p 
              className="text-sm mb-6"
              style={{ color: theme.colors.text.secondary }}
            >
              {settings?.footerText || settings?.siteDescription || ''}
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-70">
                <Twitter size={20} style={{ color: theme.colors.text.secondary }} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Facebook size={20} style={{ color: theme.colors.text.secondary }} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Youtube size={20} style={{ color: theme.colors.text.secondary }} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Linkedin size={20} style={{ color: theme.colors.text.secondary }} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 
                className="font-semibold mb-4"
                style={{ color: theme.colors.text.primary }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.onClick ? (
                      <button 
                        onClick={link.onClick}
                        className="text-sm hover:underline text-left"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a 
                        href={link.href || "#"}
                        className="text-sm hover:underline"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t pt-8 mt-12 flex flex-col md:flex-row justify-between items-center"
          style={{ borderColor: theme.colors.text.light + '20' }}
        >
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <a 
              href="#"
              className="text-sm hover:underline"
              style={{ color: theme.colors.text.secondary }}
            >
              © 2024 GitHub, Inc.
            </a>
            <a 
              href="#"
              className="text-sm hover:underline"
              style={{ color: theme.colors.text.secondary }}
            >
              Terms
            </a>
            <a 
              href="#"
              className="text-sm hover:underline"
              style={{ color: theme.colors.text.secondary }}
            >
              Privacy
            </a>
            <a 
              href="#"
              className="text-sm hover:underline"
              style={{ color: theme.colors.text.secondary }}
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const AirbnbFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  const footerSections = [
    {
      title: "Navigation",
      links: navigationItems?.map(item => ({
        label: item.label,
        onClick: () => scrollToSection?.(item.type, item.sectionId)
      })) || []
    },
    {
      title: "Contact",
      links: [
        settings?.email && { label: settings.email, href: `mailto:${settings.email}` },
        settings?.phone && { label: settings.phone, href: `tel:${settings.phone}` },
        settings?.address && { label: "Adresse", href: "#" }
      ].filter(Boolean)
    },
    {
      title: "Informations",
      links: [
        { label: "Administration", href: "/admin" },
        { label: "Mentions légales", href: "#" },
        { label: "Confidentialité", href: "#" }
      ]
    }
  ];

  return (
    <footer 
      className="border-t"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.text.light + '20'
      }}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 
                className="font-semibold mb-4"
                style={{ color: theme.colors.text.primary }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.onClick ? (
                      <button 
                        onClick={link.onClick}
                        className="text-sm hover:underline text-left"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a 
                        href={link.href || "#"}
                        className="text-sm hover:underline"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t pt-8 mt-12 flex flex-col md:flex-row justify-between items-center"
          style={{ borderColor: theme.colors.text.light + '20' }}
        >
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <p 
              className="text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              © 2024 {settings?.siteName || 'Mon Site'}, Inc.
            </p>
            <a 
              href="#"
              className="text-sm hover:underline"
              style={{ color: theme.colors.text.secondary }}
            >
              Privacy
            </a>
            <a 
              href="#"
              className="text-sm hover:underline"
              style={{ color: theme.colors.text.secondary }}
            >
              Terms
            </a>
            <a 
              href="#"
              className="text-sm hover:underline"
              style={{ color: theme.colors.text.secondary }}
            >
              Sitemap
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-70">
                <Facebook size={20} style={{ color: theme.colors.text.secondary }} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Twitter size={20} style={{ color: theme.colors.text.secondary }} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Instagram size={20} style={{ color: theme.colors.text.secondary }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const SpotifyFooter = ({ theme, settings, navigationItems, scrollToSection }) => {
  const footerSections = [
    {
      title: "Navigation",
      links: navigationItems?.map(item => ({
        label: item.label,
        onClick: () => scrollToSection?.(item.type, item.sectionId)
      })) || []
    },
    {
      title: "Contact",
      links: [
        settings?.email && { label: settings.email, href: `mailto:${settings.email}` },
        settings?.phone && { label: settings.phone, href: `tel:${settings.phone}` }
      ].filter(Boolean)
    },
    {
      title: "Liens utiles",
      links: [
        { label: "Administration", href: "/admin" },
        { label: "Support", href: "#" }
      ]
    }
  ];

  return (
    <footer 
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary
      }}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="md:col-span-2">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.siteName || 'Logo'} 
                className="h-10 w-auto object-contain mb-8"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <div 
              className={`text-3xl font-bold mb-8 ${settings?.logoUrl ? 'hidden' : 'block'}`}
              style={{ color: theme.colors.text.primary }}
            >
              {settings?.logoText || ''}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 
                className="font-bold mb-6"
                style={{ color: theme.colors.text.primary }}
              >
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#"
                      className="hover:underline hover:opacity-70 transition-opacity"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media */}
        <div className="flex justify-end mt-16 mb-12">
          <div className="flex gap-4">
            <a 
              href="#" 
              className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ backgroundColor: theme.colors.text.secondary }}
            >
              <Instagram size={20} style={{ color: theme.colors.background }} />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ backgroundColor: theme.colors.text.secondary }}
            >
              <Twitter size={20} style={{ color: theme.colors.background }} />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ backgroundColor: theme.colors.text.secondary }}
            >
              <Facebook size={20} style={{ color: theme.colors.background }} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t pt-8"
          style={{ borderColor: theme.colors.text.light }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <a 
                href="#"
                className="text-xs hover:underline"
                style={{ color: theme.colors.text.light }}
              >
                Legal
              </a>
              <a 
                href="#"
                className="text-xs hover:underline"
                style={{ color: theme.colors.text.light }}
              >
                Privacy Center
              </a>
              <a 
                href="#"
                className="text-xs hover:underline"
                style={{ color: theme.colors.text.light }}
              >
                Privacy Policy
              </a>
              <a 
                href="#"
                className="text-xs hover:underline"
                style={{ color: theme.colors.text.light }}
              >
                Cookies
              </a>
              <a 
                href="#"
                className="text-xs hover:underline"
                style={{ color: theme.colors.text.light }}
              >
                About Ads
              </a>
            </div>
            <p 
              className="text-xs"
              style={{ color: theme.colors.text.light }}
            >
              © 2024 {settings?.siteName || 'Mon Site'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
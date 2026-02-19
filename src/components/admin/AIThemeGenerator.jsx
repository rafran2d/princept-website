import React, { useState } from 'react';
import { Sparkles, Wand2, Loader, Check, X, Palette, RefreshCw } from 'lucide-react';

const AIThemeGenerator = ({ onThemeGenerated, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState(null);
  const [error, setError] = useState(null);

  // Exemples de prompts
  const examplePrompts = [
    "Un thème moderne et professionnel avec des tons bleus, menu horizontal centré, logo à gauche, footer complet, largeur maximale 1200px",
    "Un thème chaleureux avec couleurs terre (marron, beige), menu sticky transparent, logo centré, footer minimaliste, pleine largeur",
    "Un thème élégant minimaliste noir/blanc/or, menu latéral, logo en haut à gauche, footer avec 3 colonnes, largeur standard",
    "Un thème vibrant violet/rose néon, mega menu, logo centré grand, footer sombre pleine largeur, container 1400px",
    "Un thème nature écologique avec verts, menu simple horizontal, logo petit à gauche, footer léger, largeur 1100px",
    "Un thème luxe bordeaux/doré, menu avec dropdown, logo centré élégant, footer riche avec réseaux sociaux, pleine largeur"
  ];

  // Fonction pour générer un thème basé sur le prompt
  const generateThemeFromPrompt = (userPrompt) => {
    // Analyse du prompt pour extraire les intentions
    const promptLower = userPrompt.toLowerCase();

    // === DÉTECTION DU LAYOUT ===

    // Largeur du container
    let containerWidth = '1200px';
    if (promptLower.includes('pleine largeur') || promptLower.includes('full width') || promptLower.includes('fullwidth')) {
      containerWidth = '100%';
    } else if (promptLower.includes('1400px') || promptLower.includes('large') || promptLower.includes('extra large')) {
      containerWidth = '1400px';
    } else if (promptLower.includes('1100px') || promptLower.includes('compact')) {
      containerWidth = '1100px';
    } else if (promptLower.includes('1000px') || promptLower.includes('petit') || promptLower.includes('small')) {
      containerWidth = '1000px';
    }

    // Style du header/menu
    let headerStyle = 'horizontal';
    let headerPosition = 'top';
    let isHeaderSticky = false;
    let isHeaderTransparent = false;

    if (promptLower.includes('menu latéral') || promptLower.includes('sidebar') || promptLower.includes('menu vertical')) {
      headerStyle = 'sidebar';
    } else if (promptLower.includes('mega menu') || promptLower.includes('megamenu')) {
      headerStyle = 'mega';
    } else if (promptLower.includes('dropdown') || promptLower.includes('déroulant')) {
      headerStyle = 'dropdown';
    }

    if (promptLower.includes('sticky') || promptLower.includes('fixe') || promptLower.includes('fixed')) {
      isHeaderSticky = true;
    }

    if (promptLower.includes('transparent') || promptLower.includes('translucide')) {
      isHeaderTransparent = true;
    }

    // Position du logo
    let logoPosition = 'left';
    let logoSize = 'medium';

    if (promptLower.includes('logo centré') || promptLower.includes('logo au centre') || promptLower.includes('logo center')) {
      logoPosition = 'center';
    } else if (promptLower.includes('logo à droite') || promptLower.includes('logo right')) {
      logoPosition = 'right';
    }

    if (promptLower.includes('logo grand') || promptLower.includes('logo large') || promptLower.includes('big logo')) {
      logoSize = 'large';
    } else if (promptLower.includes('logo petit') || promptLower.includes('logo small') || promptLower.includes('petit logo')) {
      logoSize = 'small';
    }

    // Style du footer
    let footerStyle = 'default';
    let footerColumns = 4;

    if (promptLower.includes('footer minimaliste') || promptLower.includes('footer simple') || promptLower.includes('footer léger')) {
      footerStyle = 'minimal';
      footerColumns = 1;
    } else if (promptLower.includes('footer complet') || promptLower.includes('footer riche') || promptLower.includes('footer avec')) {
      footerStyle = 'rich';
      footerColumns = 4;
    } else if (promptLower.includes('footer sombre') || promptLower.includes('footer dark')) {
      footerStyle = 'dark';
    } else if (promptLower.includes('3 colonnes')) {
      footerColumns = 3;
    } else if (promptLower.includes('2 colonnes')) {
      footerColumns = 2;
    }

    // === DÉTECTION DES COULEURS ===

    // Détection des couleurs mentionnées
    const colorKeywords = {
      bleu: ['#2563eb', '#3b82f6', '#60a5fa'],
      rouge: ['#dc2626', '#ef4444', '#f87171'],
      vert: ['#16a34a', '#22c55e', '#4ade80'],
      jaune: ['#ca8a04', '#eab308', '#facc15'],
      violet: ['#7c3aed', '#8b5cf6', '#a78bfa'],
      rose: ['#db2777', '#ec4899', '#f472b6'],
      orange: ['#ea580c', '#f97316', '#fb923c'],
      marron: ['#78350f', '#92400e', '#a16207'],
      noir: ['#171717', '#262626', '#404040'],
      gris: ['#52525b', '#71717a', '#a1a1aa'],
      blanc: ['#ffffff', '#f9fafb', '#f3f4f6'],
      beige: ['#d6c7a8', '#e5d4b4', '#f5e6d3'],
      bordeaux: ['#7f1d1d', '#991b1b', '#b91c1c'],
      or: ['#ca8a04', '#d97706', '#f59e0b'],
      doré: ['#ca8a04', '#d97706', '#f59e0b'],
      turquoise: ['#0891b2', '#06b6d4', '#22d3ee'],
      cyan: ['#0891b2', '#06b6d4', '#22d3ee']
    };

    let primaryColor = '#3b82f6'; // Bleu par défaut
    let secondaryColor = '#8b5cf6'; // Violet par défaut

    // Trouver les couleurs dans le prompt
    for (const [keyword, colors] of Object.entries(colorKeywords)) {
      if (promptLower.includes(keyword)) {
        primaryColor = colors[0];
        secondaryColor = colors[1] || colors[0];
        break;
      }
    }

    // Détection du style
    let fontPrimary = 'Inter, sans-serif';
    let fontSecondary = 'Inter, sans-serif';
    let borderRadius = '0.5rem';

    if (promptLower.includes('moderne') || promptLower.includes('tech') || promptLower.includes('professionnel')) {
      fontPrimary = 'Inter, system-ui, sans-serif';
      fontSecondary = 'Inter, system-ui, sans-serif';
      borderRadius = '0.5rem';
    } else if (promptLower.includes('élégant') || promptLower.includes('luxe') || promptLower.includes('sophistiqué')) {
      fontPrimary = 'Playfair Display, Georgia, serif';
      fontSecondary = 'Lato, sans-serif';
      borderRadius = '0.25rem';
    } else if (promptLower.includes('minimaliste') || promptLower.includes('simple') || promptLower.includes('épuré')) {
      fontPrimary = 'Helvetica Neue, Arial, sans-serif';
      fontSecondary = 'Helvetica Neue, Arial, sans-serif';
      borderRadius = '0.125rem';
    } else if (promptLower.includes('chaleureux') || promptLower.includes('accueillant') || promptLower.includes('convivial')) {
      fontPrimary = 'Nunito, sans-serif';
      fontSecondary = 'Nunito, sans-serif';
      borderRadius = '1rem';
    } else if (promptLower.includes('créatif') || promptLower.includes('artistique') || promptLower.includes('original')) {
      fontPrimary = 'Poppins, sans-serif';
      fontSecondary = 'Poppins, sans-serif';
      borderRadius = '1.5rem';
    }

    // Générer un nom de thème basé sur le prompt
    const themeName = `Theme-${Date.now()}`;
    const themeLabel = userPrompt.substring(0, 50) + (userPrompt.length > 50 ? '...' : '');

    // Créer le thème complet
    const theme = {
      name: themeName,
      label: themeLabel,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: adjustColor(primaryColor, 20),
        background: '#ffffff',
        surface: '#f9fafb',
        text: {
          primary: '#111827',
          secondary: '#6b7280',
          muted: '#9ca3af',
          light: '#d1d5db'
        },
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      },
      header: {
        style: headerStyle,
        position: headerPosition,
        sticky: isHeaderSticky,
        transparent: isHeaderTransparent,
        logo: {
          position: logoPosition,
          size: logoSize
        }
      },
      footer: {
        style: footerStyle,
        columns: footerColumns
      },
      layout: {
        containerMaxWidth: containerWidth,
        fullWidth: containerWidth === '100%'
      },
      typography: {
        fontFamily: {
          primary: fontPrimary,
          secondary: fontSecondary
        },
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem'
        },
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
          extrabold: '800'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem'
      },
      borderRadius: {
        sm: borderRadius === '0.125rem' ? '0.125rem' : '0.25rem',
        md: borderRadius,
        lg: borderRadius === '0.125rem' ? '0.25rem' : (borderRadius === '0.25rem' ? '0.5rem' : '0.75rem'),
        xl: borderRadius === '0.125rem' ? '0.5rem' : (borderRadius === '0.25rem' ? '0.75rem' : '1rem'),
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      },
      animations: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        },
        easing: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          in: 'cubic-bezier(0.4, 0, 1, 1)',
          out: 'cubic-bezier(0, 0, 0.2, 1)',
          inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    };

    return theme;
  };

  // Fonction utilitaire pour ajuster une couleur (éclaircir/assombrir)
  const adjustColor = (color, amount) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setError('Veuillez entrer une description du thème');
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Simuler un délai de génération pour l'effet IA
    setTimeout(() => {
      try {
        const theme = generateThemeFromPrompt(prompt);
        setGeneratedTheme(theme);
        setIsGenerating(false);
      } catch (err) {
        setError('Erreur lors de la génération du thème');
        setIsGenerating(false);
      }
    }, 1500);
  };

  const handleApply = () => {
    if (generatedTheme) {
      onThemeGenerated(generatedTheme);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Générateur de Thème IA</h2>
                <p className="text-purple-100 text-sm">Décrivez votre thème idéal, l'IA le créera pour vous</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Décrivez votre thème
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Un thème moderne et professionnel pour une entreprise tech avec des tons bleus et blancs..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Example Prompts */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">💡 Exemples de descriptions :</p>
            <div className="grid md:grid-cols-2 gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-lg text-sm text-gray-600 hover:text-purple-700 transition-colors border border-gray-200 hover:border-purple-300"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Générer le thème avec l'IA
              </>
            )}
          </button>

          {/* Generated Theme Preview */}
          {generatedTheme && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 rounded-full p-2">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-900">Thème généré avec succès !</h3>
              </div>

              {/* Color Preview */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">🎨 Palette de couleurs</p>
                <div className="flex gap-2">
                  <div className="flex-1 text-center">
                    <div
                      className="h-16 rounded-lg shadow-md mb-2"
                      style={{ backgroundColor: generatedTheme.colors.primary }}
                    />
                    <p className="text-xs text-gray-600">Primaire</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div
                      className="h-16 rounded-lg shadow-md mb-2"
                      style={{ backgroundColor: generatedTheme.colors.secondary }}
                    />
                    <p className="text-xs text-gray-600">Secondaire</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div
                      className="h-16 rounded-lg shadow-md mb-2"
                      style={{ backgroundColor: generatedTheme.colors.accent }}
                    />
                    <p className="text-xs text-gray-600">Accent</p>
                  </div>
                </div>
              </div>

              {/* Typography Preview */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">✍️ Typographie</p>
                <div className="bg-white rounded-lg p-4">
                  <p style={{ fontFamily: generatedTheme.typography.fontFamily.primary }} className="text-lg font-bold mb-1">
                    {generatedTheme.typography.fontFamily.primary}
                  </p>
                  <p className="text-xs text-gray-500">Police principale</p>
                </div>
              </div>

              {/* Layout Preview */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">📐 Configuration Layout</p>
                <div className="bg-white rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Largeur:</span>
                    <span className="font-semibold text-gray-900">{generatedTheme.layout.containerMaxWidth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Menu:</span>
                    <span className="font-semibold text-gray-900">{generatedTheme.header.style}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Logo:</span>
                    <span className="font-semibold text-gray-900">{generatedTheme.header.logo.position} - {generatedTheme.header.logo.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Footer:</span>
                    <span className="font-semibold text-gray-900">{generatedTheme.footer.style} ({generatedTheme.footer.columns} col.)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <Check className="w-5 h-5" />
                  Appliquer ce thème
                </button>
                <button
                  onClick={handleGenerate}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Régénérer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIThemeGenerator;

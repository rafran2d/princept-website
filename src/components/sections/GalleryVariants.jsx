import React from 'react';
import { ArrowRight } from 'lucide-react';

// Proposition de refonte de la section "Notre galerie" (Tour 4, direction 4a ↔ hero/about/services 1a/2a/3a).
// Légende sous la plaque (client, secteur, année) au lieu de la barre grise — les logos respirent.
// Pilotée par les données réelles de la section (section.images), sauf l'accroche éditoriale (fixe).

export const GalleryVariant4a = ({ images, onCtaClick, ctaLabel }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-20 lg:py-28">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-20 mb-16 lg:mb-18">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-10 h-px flex-shrink-0" style={{ background: 'var(--color-primary, #2563EB)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--color-primary, #2563EB)' }}>
              Notre galerie
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[1.06] tracking-tight text-slate-900">
            Nos réalisations,<br />
            <span className="text-slate-400">et les marques qui nous font confiance.</span>
          </h2>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-5">
          <span className="font-heading text-[13px] font-semibold text-slate-900 tracking-wide whitespace-nowrap">
            {String(images.length).padStart(2, '0')}
            <span className="text-slate-300"> projets publiés</span>
          </span>
          {ctaLabel && onCtaClick && (
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2.5 pb-1 border-b border-slate-300 text-[15px] font-semibold text-slate-900 hover:border-blue-600 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {ctaLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {images.map((image) => {
          const Wrapper = image.link ? 'a' : 'div';
          const wrapperProps = image.link
            ? {
                href: image.link,
                target: image.link.startsWith('http') ? '_blank' : '_self',
                rel: image.link.startsWith('http') ? 'noopener noreferrer' : undefined,
                onClick: image.onLinkClick
              }
            : {};

          return (
            <div key={image.id} className="flex flex-col">
              <Wrapper {...wrapperProps} className="group relative aspect-[4/3] overflow-hidden block p-10 lg:p-12" style={{ background: '#1E293B' }}>
                <img src={image.src} alt={image.title} className="relative w-full h-full object-contain" />
                <span className="absolute inset-0 bg-[#0F172A] opacity-0 group-hover:opacity-35 transition-opacity duration-300" />
              </Wrapper>
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-5 pt-6 mt-6 border-t border-slate-200">
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-xl font-semibold text-slate-900 tracking-tight">
                    {image.title}
                  </h3>
                  {image.category && (
                    <span className="text-sm text-slate-500">{image.category}</span>
                  )}
                </div>
                {image.year && (
                  <span className="text-xs font-semibold text-slate-300 tracking-wide">{image.year}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
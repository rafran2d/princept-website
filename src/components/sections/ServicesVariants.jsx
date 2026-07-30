import React from 'react';
import { ArrowRight } from 'lucide-react';

// Proposition de refonte de la section "Nos services" (Tour 3, direction 3a ↔ hero 1a).
// Pilotée par les données réelles de la section (section.services), sauf l'accroche
// éditoriale (éyebrow/titre/CTA) qui reprend le texte fixe de la maquette.

const SERVICE_0_TAGS = ['PrestaShop', 'Magento', 'Drupal', 'WordPress'];

export const ServicesVariant3a = ({ services, onServiceClick, onCtaClick }) => {
  const [mainService, ...otherServices] = services;

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-20 lg:py-28">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-20 mb-16 lg:mb-18">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-10 h-px flex-shrink-0" style={{ background: 'var(--color-primary, #2563EB)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--color-primary, #2563EB)' }}>
              Nos services
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[1.06] tracking-tight text-slate-900">
            Des solutions complètes<br />
            <span className="text-slate-400">pour tous vos besoins digitaux.</span>
          </h2>
        </div>
        {onCtaClick && (
          <button
            type="button"
            onClick={onCtaClick}
            className="px-7 py-4 rounded-md text-white text-[15px] font-semibold whitespace-nowrap transition-colors self-start"
            style={{ background: '#0F172A' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary, #2563EB)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#0F172A'; }}
          >
            Demander un devis
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.86fr_1.14fr] gap-14 lg:gap-16 items-stretch">
        {mainService && (
          <div className="flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 mb-8 flex items-center justify-center">
              {mainService.image ? (
                <img
                  src={mainService.image}
                  alt={mainService.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                mainService.IconComponent && <mainService.IconComponent className="w-16 h-16 text-slate-300" strokeWidth={1.5} />
              )}
            </div>
            <span className="text-[12px] font-semibold tracking-[0.16em] mb-4" style={{ color: 'var(--color-primary, #2563EB)' }}>
              01
            </span>
            <h3 className="font-heading text-2xl lg:text-[2.1rem] font-bold leading-[1.12] tracking-tight text-slate-900 mb-4">
              {mainService.title}
            </h3>
            <p className="text-base lg:text-[17px] leading-[1.7] text-slate-600 mb-6">
              {mainService.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {SERVICE_0_TAGS.map((tag) => (
                <span key={tag} className="px-3 py-1.5 border border-slate-200 text-xs font-medium text-slate-500 tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onServiceClick(mainService)}
              className="self-start inline-flex items-center gap-2.5 pb-1 border-b border-slate-300 text-[15px] font-semibold text-slate-900 hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              Découvrir ce service
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="grid border-t border-slate-100" style={{ gridTemplateRows: `repeat(${otherServices.length}, 1fr)` }}>
          {otherServices.map((service, i) => {
            const isLast = i === otherServices.length - 1;
            return (
              <div
                key={service.id}
                className={`grid grid-cols-[36px_1fr] sm:grid-cols-[44px_240px_1fr] gap-3 sm:gap-7 items-start py-6 lg:py-7 ${!isLast ? 'border-b border-slate-100' : ''}`}
              >
                <span className="font-heading text-sm font-semibold text-slate-300 tracking-wider pt-1.5">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <h3 className="font-heading text-lg lg:text-[1.4rem] font-semibold text-slate-900 tracking-tight leading-snug">
                  {service.title}
                </h3>
                <div className="flex flex-col gap-3 pt-1">
                  <p className="hidden sm:block text-sm lg:text-[15px] leading-[1.7] text-slate-500">
                    {service.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => onServiceClick(service)}
                    className="self-start inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    Découvrir ce service
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { ArrowRight } from 'lucide-react';

// Trois propositions de refonte de la section "À propos" (Tour 2), chacune
// déclinée depuis une direction de hero : 2a ↔ 1a, 2b ↔ 1b, 2c ↔ 1c.
// Pilotées par les données réelles de la section (title/description/features).

export const AboutVariant2a = ({ description, features }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pb-14 lg:pb-20">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="w-10 h-px flex-shrink-0" style={{ background: 'var(--color-primary, #2563EB)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--color-primary, #2563EB)' }}>
              À propos de nous
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[1.06] tracking-tight text-slate-900">
            Une équipe d'ingénieurs<br />
            <span className="text-slate-400">à Antananarivo.</span>
          </h2>
        </div>

        <div className="pt-2 lg:pt-3">
          {description && (
            <p className="text-lg leading-[1.7] text-slate-700 mb-8">
              {description}
            </p>
          )}
          <div className="flex items-stretch gap-8 md:gap-10 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="font-heading text-[34px] font-bold text-slate-900 tracking-tight">30+</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.14em]">Technologies</span>
            </div>
            <span className="w-px bg-slate-200" />
            <div className="flex flex-col gap-1">
              <span className="font-heading text-[34px] font-bold text-slate-900 tracking-tight">2021</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.14em]">Création</span>
            </div>
            <span className="w-px bg-slate-200" />
            <div className="flex flex-col gap-1">
              <span className="font-heading text-[34px] font-bold text-slate-900 tracking-tight">{features.length || 4}</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-[0.14em]">Pôles d'expertise</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-slate-200">
        {features.map((feature, i) => {
          const isFirst = i === 0;
          const isLast = i === features.length - 1;
          return (
            <div
              key={feature.id}
              className={`py-9 lg:py-11 flex flex-col gap-4 ${!isLast ? 'lg:border-r border-slate-100' : ''} ${isFirst ? 'pr-4 lg:pr-8' : isLast ? 'pl-4 lg:pl-8' : 'px-4 lg:px-8'}`}
            >
              <span className="text-[11px] font-semibold tracking-wider" style={{ color: isFirst ? 'var(--color-primary, #2563EB)' : '#CBD5E1' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-lg lg:text-xl font-semibold text-slate-900 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm leading-[1.7] text-slate-500">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AboutVariant2b = ({ title, description, features }) => {
  return (
    <div className="relative max-w-[1400px] mx-auto px-6 lg:px-14 py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[360px] lg:w-[760px] lg:h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, rgba(37,99,235,0) 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mb-16 lg:mb-20">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50 mb-7">
          À propos de nous
        </span>
        <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[1.08] tracking-tight text-white mb-6">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-base md:text-lg leading-[1.75] text-white/60">
            {description}
          </p>
        )}
      </div>

      <div
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
        style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        {features.map((feature, i) => (
          <div
            key={feature.id}
            className="p-8 lg:p-9 flex flex-col gap-4 transition-colors duration-300"
            style={{ background: '#1E293B' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#243449'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#1E293B'; }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-heading text-lg font-semibold text-white tracking-tight">
                {feature.title}
              </h3>
              <span className="font-heading text-2xl font-bold text-white/[0.13] tracking-tight flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <p className="text-sm leading-[1.7] text-white/55">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AboutVariant2c = ({ title, description, features, onFeatureClick }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-20 lg:py-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16 mb-14 lg:mb-16">
        <div className="max-w-2xl">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 mb-6">
            À propos de nous
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-base md:text-[17px] leading-[1.75] text-slate-600">
              {description}
            </p>
          )}
        </div>
        <span className="hidden sm:inline-flex items-center gap-2.5 pb-1.5 border-b border-slate-300 text-[15px] font-semibold text-slate-900 whitespace-nowrap">
          Notre histoire
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => {
          const isFirst = i === 0;
          return (
            <div
              key={feature.id}
              className="bg-white border border-slate-200 flex flex-col gap-4 p-8 transition-shadow duration-300 hover:shadow-lg"
              style={{ borderTop: `2px solid ${isFirst ? 'var(--color-primary, #2563EB)' : '#E2E8F0'}` }}
              onMouseEnter={(e) => { if (!isFirst) e.currentTarget.style.borderTopColor = 'var(--color-primary, #2563EB)'; }}
              onMouseLeave={(e) => { if (!isFirst) e.currentTarget.style.borderTopColor = '#E2E8F0'; }}
            >
              <span className="text-[11px] font-semibold tracking-wider" style={{ color: isFirst ? 'var(--color-primary, #2563EB)' : '#CBD5E1' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-lg font-semibold text-slate-900 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm leading-[1.7] text-slate-500">
                {feature.description}
              </p>
              <button
                type="button"
                onClick={() => onFeatureClick(feature)}
                className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold self-start"
                style={{ color: 'var(--color-primary, #2563EB)' }}
              >
                En savoir plus
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
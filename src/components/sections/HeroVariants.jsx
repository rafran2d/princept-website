import React from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// Trois propositions de refonte du hero (thème default), pilotées par les
// mêmes données dynamiques que le hero "classique" (slides, boutons, images).

export const HeroVariant1a = ({
  slides,
  currentSlide,
  title,
  subtitle,
  description,
  buttonText,
  secondaryButtonText,
  backgroundImage,
  hasPrimaryLink,
  hasSecondaryLink,
  onPrimaryClick,
  onSecondaryClick,
  prevSlide,
  nextSlide
}) => {
  const hasMultiple = slides.length > 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px] lg:min-h-[680px]">
      <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:px-14 lg:py-20">
        {subtitle && (
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-px flex-shrink-0" style={{ background: 'var(--color-primary, #2563EB)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--color-primary, #2563EB)' }}>
              {subtitle}
            </span>
          </div>
        )}

        <h1 className="font-heading text-4xl md:text-6xl lg:text-[4.6rem] font-bold leading-[1.02] tracking-tight text-slate-900 mb-8">
          {title}
        </h1>

        {description && (
          <p className="max-w-md text-base md:text-[17px] leading-[1.75] text-slate-600 mb-10">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 mb-14">
          {buttonText && hasPrimaryLink && (
            <button
              onClick={onPrimaryClick}
              className="px-7 py-4 rounded-md text-white text-[15px] font-semibold transition-colors"
              style={{ background: '#0F172A' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary, #2563EB)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#0F172A'; }}
            >
              {buttonText}
            </button>
          )}
          {secondaryButtonText && hasSecondaryLink && (
            <button
              onClick={onSecondaryClick}
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 border-b border-slate-300 pb-1 hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              {secondaryButtonText}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {hasMultiple && (
          <div className="flex items-center gap-7 mt-auto">
            <span className="font-heading text-[13px] font-semibold text-slate-900 tracking-wide whitespace-nowrap">
              {String(currentSlide + 1).padStart(2, '0')}
              <span className="text-slate-300"> / {String(slides.length).padStart(2, '0')}</span>
            </span>
            <div className="flex gap-2 flex-1 max-w-[220px]">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className="h-0.5 flex-1 rounded-full transition-colors"
                  style={{ background: i === currentSlide ? 'var(--color-primary, #2563EB)' : '#E2E8F0' }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                aria-label="Slide précédent"
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Slide suivant"
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative min-h-[320px] lg:min-h-0 bg-slate-100 overflow-hidden">
        {backgroundImage && (
          <img
            key={`v1a-${currentSlide}`}
            src={backgroundImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 30%)' }}
        />
        {title && (
          <div className="absolute left-6 bottom-6 lg:left-10 lg:bottom-10 px-5 py-4 rounded-xl bg-white/95 backdrop-blur-sm flex flex-col gap-1 max-w-[80%]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--color-primary, #2563EB)' }}>
              Étude de cas
            </span>
            <span className="font-heading text-sm font-semibold text-slate-900 truncate">{title}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const HeroVariant1b = ({
  slides,
  currentSlide,
  title,
  subtitle,
  description,
  buttonText,
  secondaryButtonText,
  backgroundImage,
  hasPrimaryLink,
  hasSecondaryLink,
  onPrimaryClick,
  onSecondaryClick,
  prevSlide,
  nextSlide,
  goToSlide
}) => {
  const hasMultiple = slides.length > 1;

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[560px] lg:min-h-[680px] overflow-hidden">
      <div
        className="absolute -top-24 right-10 lg:right-32 w-64 h-64 lg:w-[420px] lg:h-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0) 70%)', animation: 'float 9s ease-in-out infinite' }}
      />

      <div className="relative z-10 flex flex-col justify-center px-6 py-16 md:px-12 lg:px-14 lg:py-24">
        {subtitle && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60 mb-8">
            {subtitle}
          </span>
        )}

        <h1 className="font-heading text-4xl md:text-6xl lg:text-[4.4rem] font-bold leading-[1.02] tracking-tight text-white mb-8">
          {title}
        </h1>

        {description && (
          <p className="max-w-md text-base md:text-[17px] leading-[1.75] text-white/70 mb-12">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {buttonText && hasPrimaryLink && (
            <button
              onClick={onPrimaryClick}
              className="px-7 py-4 rounded-md bg-white text-[#131C2E] text-[15px] font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              {buttonText}
            </button>
          )}
          {secondaryButtonText && hasSecondaryLink && (
            <button
              onClick={onSecondaryClick}
              className="px-7 py-4 rounded-md border border-white/20 text-white text-[15px] font-semibold hover:border-white/50 transition-colors"
            >
              {secondaryButtonText}
            </button>
          )}
        </div>

        {hasMultiple && (
          <div className="flex items-center gap-7 mt-14">
            <span className="font-heading text-[13px] font-semibold text-white tracking-wide whitespace-nowrap">
              {String(currentSlide + 1).padStart(2, '0')}
              <span className="text-white/30"> / {String(slides.length).padStart(2, '0')}</span>
            </span>
            <div className="flex gap-2 flex-1 max-w-[220px]">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className="h-0.5 flex-1 rounded-full transition-colors"
                  style={{ background: i === currentSlide ? 'var(--color-primary, #2563EB)' : 'rgba(255,255,255,0.18)' }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                aria-label="Slide précédent"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Slide suivant"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#1E293B] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative min-h-[320px] lg:min-h-0 overflow-hidden">
        {backgroundImage && (
          <img
            key={`v1b-${currentSlide}`}
            src={backgroundImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, #1E293B 0%, rgba(30,41,59,0.85) 10%, rgba(30,41,59,0.4) 28%, rgba(30,41,59,0.08) 48%, rgba(30,41,59,0) 62%, rgba(30,41,59,0.22) 100%)' }}
        />
        <div
          className="hidden lg:block absolute left-0 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(37,99,235,0.55) 20%, rgba(37,99,235,0.55) 80%, transparent 100%)', boxShadow: '0 0 24px 1px rgba(37,99,235,0.35)' }}
        />
        {hasMultiple && (
          <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Aller au slide ${i + 1}`}
                className="flex items-center gap-2.5 group"
              >
                <span className={`text-[11px] font-semibold tracking-wider ${i === currentSlide ? 'text-white' : 'text-white/35 group-hover:text-white/60'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`h-px transition-all ${i === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/30 group-hover:bg-white/50'}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const HeroVariant1c = ({
  slides,
  currentSlide,
  title,
  subtitle,
  description,
  buttonText,
  secondaryButtonText,
  backgroundImage,
  hasPrimaryLink,
  hasSecondaryLink,
  onPrimaryClick,
  onSecondaryClick,
  goToSlide
}) => {
  const hasMultiple = slides.length > 1;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px] lg:min-h-[520px]">
        <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:pl-14 lg:pr-16 lg:py-20">
          {subtitle && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 mb-7">
              {subtitle}
            </span>
          )}

          <h1 className="font-heading text-4xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.03] tracking-tight text-slate-900 mb-7">
            {title}
          </h1>

          {description && (
            <p className="max-w-md text-base md:text-[17px] leading-[1.75] text-slate-600 mb-11">
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6">
            {buttonText && hasPrimaryLink && (
              <button
                onClick={onPrimaryClick}
                className="px-7 py-4 rounded-md text-white text-[15px] font-semibold transition-colors"
                style={{ background: 'var(--color-primary, #2563EB)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-dark, #1D4ED8)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-primary, #2563EB)'; }}
              >
                {buttonText}
              </button>
            )}
            {secondaryButtonText && hasSecondaryLink && (
              <button
                onClick={onSecondaryClick}
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900 hover:text-blue-600 transition-colors"
              >
                {secondaryButtonText}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="relative m-6 lg:my-14 lg:mr-14 lg:ml-0 rounded-2xl overflow-hidden bg-slate-100 min-h-[260px]">
          {backgroundImage && (
            <img
              key={`v1c-${currentSlide}`}
              src={backgroundImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {hasMultiple && (
        <div
          className="border-t border-slate-200 bg-white grid"
          style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}
        >
          {slides.map((slide, i) => {
            const label = (typeof slide.subtitle === 'string' && slide.subtitle)
              ? slide.subtitle
              : ((typeof slide.title === 'string' && slide.title) ? slide.title : `Slide ${i + 1}`);
            const active = i === currentSlide;
            return (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`text-left px-6 py-7 md:px-8 flex flex-col gap-2.5 border-r border-slate-100 last:border-r-0 transition-colors ${active ? '' : 'hover:bg-slate-50'}`}
                style={active ? { boxShadow: 'inset 0 2px 0 var(--color-primary, #2563EB)' } : undefined}
              >
                <span
                  className="text-[11px] font-semibold tracking-wider"
                  style={{ color: active ? 'var(--color-primary, #2563EB)' : '#CBD5E1' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`font-heading text-sm font-semibold truncate ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
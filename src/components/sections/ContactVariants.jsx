import React from 'react';
import { ArrowRight, Loader } from 'lucide-react';

// Proposition de refonte de la section "Contactez-nous" (Tour 5, direction 5a ↔ hero/about/services/gallery 1a/2a/3a/4a).
// Champs soulignés, libellés en capitales, bouton rectangulaire — plus de carte grise.
// Réutilise la logique réelle du formulaire (envoi d'email, chargement, erreurs) fournie par le parent.

const FIELD_CLASS = 'w-full py-3 border-0 border-b bg-transparent font-sans text-[17px] text-slate-900 outline-none transition-colors';

export const ContactVariant5a = ({
  description,
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  isSubmitted,
  submitError,
  submitSuccess
}) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-16 lg:gap-24 items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-px flex-shrink-0" style={{ background: 'var(--color-primary, #2563EB)' }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--color-primary, #2563EB)' }}>
                Contactez-nous
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[1.06] tracking-tight text-slate-900 mb-7">
              Parlons de<br />
              <span className="text-slate-400">votre projet.</span>
            </h2>
            {description && (
              <p className="max-w-sm text-base md:text-[17px] leading-[1.75] text-slate-600">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3.5 pt-14">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">Antananarivo, Madagascar</span>
            <span className="w-5 h-px bg-slate-200" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">Depuis 2021</span>
          </div>
        </div>

        <div>
          {submitError && (
            <div className="mb-6 text-sm text-red-600">{submitError}</div>
          )}

          {isSubmitted ? (
            <div className="py-12 text-center">
              <h4 className="font-heading text-xl font-semibold text-slate-900 mb-3">Message envoyé !</h4>
              <p className="text-slate-600">
                {submitSuccess || 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-11">
              <label className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                  Nom <span style={{ color: 'var(--color-primary, #2563EB)' }}>*</span>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                  className={FIELD_CLASS}
                  style={{ borderColor: '#CBD5E1' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary, #2563EB)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                  Email <span style={{ color: 'var(--color-primary, #2563EB)' }}>*</span>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="vous@entreprise.com"
                  className={FIELD_CLASS}
                  style={{ borderColor: '#CBD5E1' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary, #2563EB)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
                />
              </label>

              <label className="flex flex-col gap-3 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                  Objet <span style={{ color: 'var(--color-primary, #2563EB)' }}>*</span>
                </span>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Sujet de votre demande"
                  className={FIELD_CLASS}
                  style={{ borderColor: '#CBD5E1' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary, #2563EB)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
                />
              </label>

              <label className="flex flex-col gap-3 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900">
                  Message <span style={{ color: 'var(--color-primary, #2563EB)' }}>*</span>
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Décrivez votre besoin en quelques lignes"
                  className={`${FIELD_CLASS} leading-[1.7] resize-none`}
                  style={{ borderColor: '#CBD5E1' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary, #2563EB)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
                />
              </label>

              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-8 pt-2">
                <span className="text-[13px] text-slate-400">
                  Les champs marqués <span style={{ color: 'var(--color-primary, #2563EB)' }}>*</span> sont obligatoires.
                </span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-4 rounded-md text-white text-[15px] font-semibold inline-flex items-center gap-2.5 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  style={{ background: '#0F172A' }}
                  onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = 'var(--color-primary, #2563EB)'; }}
                  onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = '#0F172A'; }}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
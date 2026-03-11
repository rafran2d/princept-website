import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useFrontendLanguage } from '../LanguageSelector';
import unifiedEmailService from '../../services/unifiedEmailService';

const ContactSection = ({ section, useGlobalStyles }) => {
  const { title, description, backgroundColor, textColor, backgroundImage } = section;
  const { settings } = useSiteSettings();
  const { t } = useFrontendLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const { isTheme } = useThemeStyles();

  const sectionStyle = useGlobalStyles ? {} : {
    ...(backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    } : {
      backgroundColor: backgroundColor || '#ffffff'
    }),
    color: textColor || '#333333'
  };

  // Vérifier si les paramètres sont chargés (évite plein écran au premier rendu avant l'API)
  // On vérifie la présence des flags d'affichage plutôt que les valeurs elles-mêmes
  const isSettingsLoaded = Boolean(
    settings &&
    (typeof settings.showContactEmail !== 'undefined' ||
      typeof settings.showContactPhone !== 'undefined' ||
      typeof settings.showContactAddress !== 'undefined' ||
      typeof settings.showOfficeHours !== 'undefined')
  );

  // Au moins une option d'affichage contact activée (explicitement cochée) ET une valeur présente
  // On vérifie explicitement === true pour éviter les cas où la valeur serait undefined ou autre chose
  const hasContactInfo = Boolean(
    (settings.showContactEmail === true && settings.email) ||
    (settings.showContactPhone === true && settings.phone) ||
    (settings.showContactAddress === true && settings.address) ||
    (settings.showOfficeHours === true && settings.officeHours && typeof settings.officeHours === 'object')
  );

  // Plein écran uniquement quand paramètres chargés ET aucune info contact affichée (formulaire seul)
  const contactFullScreen = isSettingsLoaded && !hasContactInfo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // Utiliser le service email unifié qui récupère la configuration depuis la nouvelle API
      const result = await unifiedEmailService.sendContactEmails(formData, settings);

      // Succès
      setSubmitSuccess('Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.');
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset automatique après 5 secondes
      setTimeout(() => {
        setIsSubmitted(false);
        setSubmitSuccess(null);
      }, 5000);

    } catch (error) {
      // Messages d'erreur plus spécifiques
      let errorMessage = 'Une erreur est survenue lors de l\'envoi du message.';
      
      if (error.message.includes('Configuration email non trouvée')) {
        errorMessage = 'Configuration email manquante. Veuillez configurer un provider email dans l\'administration.';
      } else if (error.message.includes('Template de contact non activé')) {
        errorMessage = 'Le template de contact n\'est pas activé. Veuillez l\'activer dans la configuration email.';
      } else if (error.message.includes('Provider non supporté')) {
        errorMessage = 'Provider email non configuré. Veuillez configurer un provider dans l\'administration.';
      } else {
        errorMessage = `Erreur d'envoi: ${error.message}`;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatOfficeHours = (officeHours) => {
    if (!officeHours) return [];
    
    // Utiliser les traductions depuis les paramètres du site
    const days = {
      monday: t(settings.dayMonday, 'Lundi'),
      tuesday: t(settings.dayTuesday, 'Mardi'),
      wednesday: t(settings.dayWednesday, 'Mercredi'),
      thursday: t(settings.dayThursday, 'Jeudi'),
      friday: t(settings.dayFriday, 'Vendredi'),
      saturday: t(settings.daySaturday, 'Samedi'),
      sunday: t(settings.daySunday, 'Dimanche')
    };

    return Object.entries(days).map(([key, label]) => {
      const dayInfo = officeHours[key];
      
      // Cas jour férié
      if (dayInfo && dayInfo.isHoliday) {
        if (dayInfo.holidayOpen && dayInfo.holidayClose) {
          return { 
            label, 
            text: `${dayInfo.holidayOpen} - ${dayInfo.holidayClose}`,
            isHoliday: true,
            holidayName: dayInfo.holidayName
          };
        } else {
          return { 
            label, 
            text: 'Fermé - Férié',
            isHoliday: true,
            holidayName: dayInfo.holidayName
          };
        }
      }
      
      // Cas normal fermé
      if (!dayInfo || dayInfo.closed) {
        return { label, text: 'Fermé', isHoliday: false };
      }
      
      // Cas normal ouvert
      return {
        label,
        text: `${dayInfo.open} - ${dayInfo.close}`,
        isHoliday: false
      };
    });
  };

  // Fonction pour vérifier si l'établissement est actuellement ouvert
  const getCurrentOpenStatus = (officeHours, settings) => {
    if (!officeHours) return { isOpen: false, message: 'Horaires non configurés' };
    
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes(); // Format HHMM
    
    // Convertir le jour de la semaine JS en clé des horaires
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = dayKeys[currentDay];
    
    const todaySchedule = officeHours[todayKey];
    
    if (!todaySchedule) {
      return { isOpen: false, message: t(settings.officeHoursCurrentStatusClosed, 'Nous sommes fermés aujourd\'hui') };
    }
    
    // Vérifier si c'est un jour férié
    if (todaySchedule.isHoliday) {
      if (todaySchedule.holidayOpen && todaySchedule.holidayClose) {
        const openTime = parseInt(todaySchedule.holidayOpen.replace(':', ''));
        const closeTime = parseInt(todaySchedule.holidayClose.replace(':', ''));
        
        if (currentTime >= openTime && currentTime < closeTime) {
          return { isOpen: true, message: `${t(settings.officeHoursCurrentStatusOpen, 'Nous sommes ouverts jusqu\'à')} ${todaySchedule.holidayClose} (${todaySchedule.holidayName})` };
        } else {
          return { isOpen: false, message: `${t(settings.officeHoursCurrentStatusClosed, 'Nous sommes fermés')} - ${todaySchedule.holidayName}` };
        }
      } else {
        return { isOpen: false, message: `Fermé - ${todaySchedule.holidayName || 'Jour férié'}` };
      }
    }
    
    // Vérifier si normalement fermé
    if (todaySchedule.closed) {
      return { isOpen: false, message: t(settings.officeHoursCurrentStatusClosed, 'Nous sommes fermés aujourd\'hui') };
    }
    
    // Vérifier les heures normales
    if (todaySchedule.open && todaySchedule.close) {
      const openTime = parseInt(todaySchedule.open.replace(':', ''));
      const closeTime = parseInt(todaySchedule.close.replace(':', ''));
      
      if (currentTime >= openTime && currentTime < closeTime) {
        return { isOpen: true, message: `${t(settings.officeHoursCurrentStatusOpen, 'Nous sommes ouverts jusqu\'à')} ${todaySchedule.close}` };
      } else if (currentTime < openTime) {
        return { isOpen: false, message: `${t(settings.officeHoursCurrentStatusOpening, 'Nous ouvrons à')} ${todaySchedule.open}` };
      } else {
        return { isOpen: false, message: t(settings.officeHoursCurrentStatusClosed, 'Nous sommes fermés pour aujourd\'hui') };
      }
    }
    
    return { isOpen: false, message: 'Horaires non définis pour aujourd\'hui' };
  };

  const innerWrapperStyle = contactFullScreen
    ? { minHeight: '100vh', minBlockSize: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', width: '100%' }
    : undefined;

  return (
    <section 
      id="contact"
      className={`${contactFullScreen ? 'contact-fullscreen' : ''} ${isTheme('slack') ? 'py-12 lg:py-16' : contactFullScreen ? '' : 'py-12 lg:py-20'} ${backgroundImage ? 'relative' : ''}`}
      style={sectionStyle}
      data-fullscreen={contactFullScreen ? 'true' : undefined}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      <div
        className={contactFullScreen ? 'contact-fullscreen-inner' : ''}
        style={innerWrapperStyle}
      >
      <div className={`${isTheme('slack') ? 'w-full px-6 max-w-5xl mx-auto' : 'container mx-auto px-6'} ${backgroundImage ? 'relative z-10' : ''} ${contactFullScreen ? 'py-8' : ''}`}>
        {/* OnePress style section header */}
        <div className={`text-center ${contactFullScreen ? 'mb-10' : 'mb-20'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            {t(title, 'Contactez-nous')}
          </h2>
          <div className="w-20 h-1 mx-auto mb-8" style={{ backgroundColor: 'var(--color-primary)' }}></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            {t(description, 'N\'hésitez pas à nous contacter.')}
          </p>
        </div>

        <div className={`grid gap-12 ${contactFullScreen ? '' : 'max-w-6xl mx-auto'} ${hasContactInfo ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Contact Information - OnePress Style */}
          {hasContactInfo && (
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {settings.showContactEmail && settings.email && (
                  <div className="flex items-start group">
                    <div 
                      className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-6 transition-all duration-300"
                      style={{ 
                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                        color: 'var(--color-primary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.querySelector('svg').style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
                        e.currentTarget.style.color = 'var(--color-primary)';
                        e.currentTarget.querySelector('svg').style.color = 'var(--color-primary)';
                      }}
                    >
                      <Mail className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-gray-800">Email Address</h4>
                      <a 
                        href={`mailto:${settings.email}`}
                        className="text-gray-600 transition-colors duration-200 font-light"
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.target.style.color = ''}
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {settings.showContactPhone && settings.phone && (
                  <div className="flex items-start group">
                    <div className="flex-shrink-0 w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mr-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                      <Phone className="w-6 h-6 text-green-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-gray-800">Phone Number</h4>
                      <a 
                        href={`tel:${settings.phone}`}
                        className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-light"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings.showContactAddress && settings.address && (
                  <div className="flex items-start group">
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mr-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <MapPin className="w-6 h-6 text-purple-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-gray-800">Office Address</h4>
                      <p className="text-gray-600 font-light">{settings.address}</p>
                    </div>
                  </div>
                )}

                {settings.showOfficeHours && settings.officeHours && (
                  <div className="group">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                           style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` }}>
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-1">{t(settings.officeHoursTitle, 'Horaires d\'ouverture')}</h4>
                        <p className="text-sm text-gray-500">{t(settings.officeHoursSubtitle, 'Nos horaires d\'ouverture')}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner">
                      <div className="grid gap-3">
                        {formatOfficeHours(settings.officeHours).map((day, index) => {
                          const isToday = new Date().getDay() === (index + 1) % 7;
                          const isClosed = day.text.includes('Fermé');
                          const isHoliday = day.isHoliday;
                          
                          return (
                            <div 
                              key={index} 
                              className={`p-3 rounded-xl transition-all duration-200 ${
                                isToday 
                                  ? 'text-white shadow-md transform scale-[1.02]' 
                                  : 'bg-white/70 hover:bg-white hover:shadow-sm'
                              } ${isHoliday ? 'border-2 border-orange-200' : ''}`}
                              style={isToday ? { background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` } : {}}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {isToday && (
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                  )}
                                  <div>
                                    <span className={`font-semibold text-sm ${
                                      isToday ? 'text-white' : 'text-gray-800'
                                    }`}>
                                      {day.label}
                                    </span>
                                    {isHoliday && day.holidayName && (
                                      <div className={`text-xs mt-1 ${
                                        isToday ? 'text-white/90' : 'text-orange-600'
                                      }`}>
                                        🎉 {day.holidayName}
                                      </div>
                                    )}
                                  </div>
                                  {isToday && (
                                    <span className="px-2 py-1 bg-white/20 text-xs rounded-full font-medium">
                                      Aujourd'hui
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {!isClosed && (
                                    <div className={`w-2 h-2 rounded-full ${
                                      isToday ? 'bg-green-300' : isHoliday ? 'bg-orange-500' : 'bg-green-500'
                                    }`}></div>
                                  )}
                                  <span className={`text-sm font-medium ${
                                    isToday ? 'text-white' : 
                                    isClosed ? 'text-red-500' : 
                                    isHoliday ? 'text-orange-600' : 'text-gray-700'
                                  }`}>
                                    {day.text}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Status actuel */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                          {(() => {
                            const status = getCurrentOpenStatus(settings.officeHours, settings);
                            return (
                              <>
                                <div className={`w-3 h-3 rounded-full ${
                                  status.isOpen 
                                    ? 'bg-green-500 animate-pulse' 
                                    : 'bg-red-500'
                                }`}></div>
                                <span className={`text-sm font-medium ${
                                  status.isOpen ? 'text-green-700' : 'text-red-600'
                                }`}>
                                  {status.message}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Form - OnePress Style */}
          <div className={hasContactInfo ? "lg:col-span-2" : `lg:col-span-1 ${contactFullScreen ? '' : 'max-w-4xl mx-auto'}`}>
            <div className="bg-gray-50 rounded-lg p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-8 text-gray-800">{t(settings.contactFormTitle, 'Contactez-nous')}</h3>
              
              {/* Messages d'erreur */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-2">Erreur d'envoi</h4>
                      <p className="text-red-700">{submitError}</p>
                      <p className="text-red-600 text-sm mt-2">
                        Vérifiez la configuration email dans l'admin ou contactez-nous directement.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                  <h4 className="text-xl font-semibold text-green-800 mb-4">Message envoyé !</h4>
                  <p className="text-green-700 font-light">
                    {submitSuccess || "Votre message a été envoyé avec succès. Nous vous répondrons bientôt."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700">
                        {t(settings.contactFormNameLabel, 'Nom complet')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200 bg-white"
                        style={{
                          '--tw-ring-color': 'var(--color-primary)',
                          '--tw-border-opacity': '1'
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = `2px solid var(--color-primary)`;
                          e.target.style.borderColor = 'var(--color-primary)';
                        }}
                        onBlur={(e) => {
                          e.target.style.outline = 'none';
                          e.target.style.borderColor = '';
                        }}
                        placeholder={t(settings.contactFormNameLabel, 'Nom complet')}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                        {t(settings.contactFormEmailLabel, 'Adresse email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200 bg-white"
                        style={{
                          '--tw-ring-color': 'var(--color-primary)',
                          '--tw-border-opacity': '1'
                        }}
                        onFocus={(e) => {
                          e.target.style.outline = `2px solid var(--color-primary)`;
                          e.target.style.borderColor = 'var(--color-primary)';
                        }}
                        onBlur={(e) => {
                          e.target.style.outline = 'none';
                          e.target.style.borderColor = '';
                        }}
                        placeholder={t(settings.contactFormEmailLabel, 'Adresse email')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold mb-2 text-gray-700">
                      {t(settings.contactFormSubjectLabel, 'Sujet')} *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200 bg-white"
                      style={{
                        '--tw-ring-color': 'var(--color-primary)',
                        '--tw-border-opacity': '1'
                      }}
                      onFocus={(e) => {
                        e.target.style.outline = `2px solid var(--color-primary)`;
                        e.target.style.borderColor = 'var(--color-primary)';
                      }}
                      onBlur={(e) => {
                        e.target.style.outline = 'none';
                        e.target.style.borderColor = '';
                      }}
                      placeholder={t(settings.contactFormSubjectLabel, 'Sujet')}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-700">
                      {t(settings.contactFormMessageLabel, 'Message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200 bg-white"
                      style={{
                        '--tw-ring-color': 'var(--color-primary)',
                        '--tw-border-opacity': '1'
                      }}
                      onFocus={(e) => {
                        e.target.style.outline = `2px solid var(--color-primary)`;
                        e.target.style.borderColor = 'var(--color-primary)';
                      }}
                      onBlur={(e) => {
                        e.target.style.outline = 'none';
                        e.target.style.borderColor = '';
                      }}
                      placeholder={t(settings.contactFormMessageLabel, 'Message')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`text-white py-4 px-8 rounded-full font-medium transition-all duration-200 flex items-center shadow-lg ${
                      isLoading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:shadow-xl transform hover:-translate-y-1'
                    }`}
                    style={{ backgroundColor: 'var(--color-primary)' }}
                    onMouseEnter={(e) => !isLoading && (e.target.style.filter = 'brightness(0.9)')}
                    onMouseLeave={(e) => !isLoading && (e.target.style.filter = 'brightness(1)')}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t(settings.contactFormButtonLabel, 'Envoyer le message')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default ContactSection;
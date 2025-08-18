# Guide d'utilisation - Templates d'email multilingues

## 🌍 Vue d'ensemble

Ce système permet d'envoyer automatiquement des emails dans la langue appropriée en fonction de la langue du visiteur. Les templates sont sélectionnés dynamiquement selon la langue détectée ou spécifiée.

## 📧 Fonctionnalités

### ✅ Ce qui a été implémenté

1. **Détection automatique de langue**
   - Depuis l'URL (`/fr/contact`, `/en/about`)
   - Depuis les préférences utilisateur (localStorage)
   - Depuis les paramètres du navigateur
   - Fallback vers français par défaut

2. **Sélection dynamique des templates**
   - Templates EmailJS par langue
   - Templates SMTP/Mailjet par langue
   - Fallback intelligent vers la langue par défaut

3. **Interface utilisateur améliorée**
   - Composant `EmailTemplateInput` avec gestion multi-langue
   - Indicateur visuel de configuration par langue
   - Aperçu des templates configurés

4. **Support complet des services d'email**
   - EmailJS avec templates dynamiques
   - Mailjet/SMTP avec contenu localisé
   - Mode simulation pour les tests

## 🚀 Configuration

### 1. Configuration des templates EmailJS

Dans l'interface d'administration, section **Configuration Email** :

```javascript
// Structure des templates EmailJS
emailConfig.emailjsTemplates = {
  contact: {
    'fr': 'template_fr_contact',
    'en': 'template_en_contact', 
    'es': 'template_es_contact'
  },
  contactConfirmation: {
    'fr': 'template_fr_confirmation',
    'en': 'template_en_confirmation',
    'es': 'template_es_confirmation'
  }
}
```

### 2. Configuration des templates SMTP/Mailjet

```javascript
// Structure des templates de contenu
emailConfig.templates = {
  contact: {
    enabled: true,
    subject: {
      'fr': 'Nouveau message de contact',
      'en': 'New contact message',
      'es': 'Nuevo mensaje de contacto'
    },
    template: {
      'fr': 'Bonjour,\n\nVous avez reçu un nouveau message de {{name}}...',
      'en': 'Hello,\n\nYou received a new message from {{name}}...',
      'es': 'Hola,\n\nHas recibido un nuevo mensaje de {{name}}...'
    }
  }
}
```

### 3. Utilisation dans les composants

```javascript
import { useLanguageDetection } from '../utils/languageDetection';
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const languageContext = useLanguage();
  const { getCurrentLanguage, enrichFormData } = useLanguageDetection(languageContext);
  
  const handleSubmit = async (formData) => {
    // Enrichir avec la langue détectée
    const enrichedData = enrichFormData(formData);
    
    // Envoyer avec la langue spécifiée
    await emailService.sendContactEmails(
      enrichedData, 
      emailConfig, 
      settings, 
      getCurrentLanguage()
    );
  };
};
```

## 🔧 API des fonctions

### `getTemplateForLanguage(templateConfig, language, fallback)`

Sélectionne le template approprié pour une langue donnée.

```javascript
// Exemple d'utilisation
const template = emailService.getTemplateForLanguage(
  {
    'fr': 'Template français',
    'en': 'English template',
    'es': 'Plantilla española'
  },
  'en', // langue demandée
  'fr'  // langue de fallback
);
// Retourne: "English template"
```

### `getEmailLanguage(formData, siteSettings)`

Détermine la langue à utiliser selon plusieurs critères.

```javascript
const language = emailService.getEmailLanguage(
  { language: 'en', detectedLanguage: 'fr' },
  { defaultLanguage: 'fr' }
);
// Retourne: "en" (priorité au formulaire)
```

### `detectCurrentLanguage()`

Détecte automatiquement la langue depuis l'environnement.

```javascript
import { detectCurrentLanguage } from '../utils/languageDetection';

const currentLang = detectCurrentLanguage();
// Retourne: "fr", "en", etc.
```

## 🎯 Variables disponibles dans les templates

### Variables communes

- `{{name}}` - Nom de l'utilisateur
- `{{email}}` - Email de l'utilisateur  
- `{{message}}` - Message du formulaire
- `{{subject}}` - Sujet du message
- `{{siteName}}` - Nom du site (localisé)
- `{{date}}` - Date formatée selon la langue
- `{{language}}` - Code de langue (fr, en, etc.)

### Variables spécifiques notification

- `{{phone}}` - Téléphone de l'utilisateur

### Variables spécifiques confirmation

- `{{phone}}` - Téléphone du site
- `{{email}}` - Email du site

## 📱 Exemples d'utilisation

### 1. Formulaire de contact basique

```javascript
const ContactForm = () => {
  const languageContext = useLanguage();
  const { enrichFormData } = useLanguageDetection(languageContext);
  
  const handleSubmit = async (formData) => {
    const enrichedData = enrichFormData(formData);
    await realEmailService.sendContactEmails(enrichedData, emailConfig, settings);
  };
};
```

### 2. Avec sélection manuelle de langue

```javascript
const AdvancedContactForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  
  const handleSubmit = async (formData) => {
    await realEmailService.sendContactEmails(
      formData, 
      emailConfig, 
      settings, 
      selectedLanguage
    );
  };
};
```

### 3. Utilisation du composant MultilingualEmailSender

```javascript
<MultilingualEmailSender
  emailData={formData}
  emailConfig={settings.emailConfig}
  useRealEmailService={true}
  onSuccess={(result) => console.log('Email envoyé:', result)}
  onError={(error) => console.error('Erreur:', error)}
/>
```

## 🛠️ Tests et débogage

### Mode simulation

Pour tester sans envoyer de vrais emails :

```javascript
import emailService from '../utils/emailService'; // Mode simulation

const result = await emailService.sendContactEmails(formData, emailConfig, settings, 'fr');
console.log('Résultat simulation:', result);
```

### Mode réel

Pour envoyer de vrais emails :

```javascript
import realEmailService from '../utils/realEmailService'; // Mode réel

const result = await realEmailService.sendContactEmails(formData, emailConfig, settings, 'fr');
console.log('Email réellement envoyé:', result);
```

### Logs de débogage

Le système génère des logs détaillés :

```javascript
// Console logs automatiques
🌍 [ContactSection] Envoi email multilingue: { language: 'fr', service: 'RÉEL' }
📧 [EmailJS] Utilisation template template_fr_contact pour langue fr
📧 [RealEmail MultiLang] Emails envoyés en fr: { notification: true, confirmation: true }
```

## ⚠️ Points d'attention

### 1. Configuration des templates

- Assurez-vous que chaque langue active a ses templates configurés
- Les templates manquants utilisent la langue de fallback (français par défaut)
- Testez avec le composant `MultilingualEmailSender` pour vérifier la configuration

### 2. Variables de templates

- Utilisez toujours la syntaxe `{{variable}}` pour les variables
- La variable `{{language}}` est automatiquement ajoutée
- Les dates sont formatées selon la locale de la langue

### 3. Performance

- La détection de langue est mise en cache
- Les templates sont sélectionnés à l'exécution (pas de cache)
- Préférez la détection automatique à la sélection manuelle

## 🔄 Migration depuis l'ancien système

Si vous avez des templates configurés dans l'ancien format (chaîne simple), ils continueront de fonctionner. Pour migrer vers le nouveau système :

1. **Sauvegardez** vos templates existants
2. **Convertissez** le format :
   ```javascript
   // Ancien format
   subject: "Mon sujet"
   
   // Nouveau format  
   subject: {
     'fr': "Mon sujet",
     'en': "My subject"
   }
   ```
3. **Testez** avec le mode simulation
4. **Déployez** progressivement

## 🆘 Résolution de problèmes

### Template non trouvé

```
Erreur: Template non trouvé pour la langue 'es'
```
**Solution :** Configurez le template pour cette langue ou vérifiez la langue de fallback.

### Variable non remplacée

```
Email contient: "Bonjour {{name}}"
```
**Solution :** Vérifiez que la variable est bien passée dans les données du formulaire.

### Langue non détectée

```
Langue détectée: undefined
```
**Solution :** Vérifiez la configuration du `LanguageContext` et que les langues sont actives.

---

## 📚 Ressources supplémentaires

- [Documentation EmailJS](https://www.emailjs.com/docs/)
- [API Mailjet](https://dev.mailjet.com/)
- [Contexte de langues React](./src/contexts/LanguageContext.js)
- [Utilitaires de détection](./src/utils/languageDetection.js)

---

*Ce guide est maintenu à jour avec les dernières fonctionnalités. Pour toute question, consultez le code source ou créez une issue.*
# Guide EmailJS - Template unique avec contenu multilingue

## 🎯 Concept

Au lieu de créer plusieurs templates EmailJS (un par langue), vous créez **UN SEUL template** EmailJS et personnalisez le contenu pour chaque langue directement dans votre interface d'administration.

## ✅ Avantages

- **Plus simple** : Un seul template à créer et maintenir sur EmailJS
- **Plus flexible** : Contenu entièrement personnalisable par langue dans votre admin
- **Plus économique** : Moins de templates = compte EmailJS gratuit plus longtemps
- **Plus maintenable** : Modifications du contenu sans toucher à EmailJS

## 🚀 Configuration

### 1. Création du template EmailJS

Connectez-vous à [EmailJS](https://www.emailjs.com/) et créez UN SEUL template avec ce contenu :

#### Template HTML (recommandé) :
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{email_subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">{{email_subject}}</h2>
        
        <div style="margin: 20px 0;">
            {{email_content}}
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <div style="color: #666; font-size: 12px;">
            <p>Email envoyé depuis {{site_name}}</p>
            <p>Langue: {{language}} | Date: {{current_date}}</p>
        </div>
    </div>
</body>
</html>
```

#### Template texte (fallback) :
```
{{email_subject}}

{{email_content}}

---
Email envoyé depuis {{site_name}}
Langue: {{language}} | Date: {{current_date}}
```

### 2. Variables disponibles

Le système envoie automatiquement ces variables à EmailJS :

#### Variables principales :
- `{{email_subject}}` - Le sujet (déjà localisé selon la langue)
- `{{email_content}}` - Le contenu (déjà localisé selon la langue)
- `{{email_html}}` - Version HTML du contenu (avec `<br>` pour les retours à la ligne)

#### Variables d'informations :
- `{{from_name}}` - Nom de l'expéditeur configuré
- `{{from_email}}` - Email de l'expéditeur configuré
- `{{to_email}}` - Email du destinataire
- `{{reply_to}}` - Email de réponse
- `{{language}}` - Code de langue (fr, en, es, etc.)
- `{{email_type}}` - Type d'email (contact_notification, contact_confirmation)

#### Variables de formulaire (pour compatibilité) :
- `{{user_name}}` - Nom de l'utilisateur
- `{{user_email}}` - Email de l'utilisateur
- `{{user_phone}}` - Téléphone de l'utilisateur
- `{{user_subject}}` - Sujet du message
- `{{user_message}}` - Message de l'utilisateur
- `{{site_name}}` - Nom du site
- `{{current_date}}` - Date formatée

### 3. Configuration dans l'admin

Dans **Paramètres → Configuration Email → EmailJS** :

1. **Service ID** : Votre service EmailJS
2. **Template ID** : L'ID de votre template unique
3. **Clé publique** : Votre clé publique EmailJS

Dans **Templates d'email**, configurez le contenu pour chaque langue :

#### Exemple notification français :
```
Sujet : Nouveau message de contact

Template :
Bonjour,

Vous avez reçu un nouveau message de {{name}} ({{email}}) :

Sujet : {{subject}}
Message : {{message}}
Téléphone : {{phone}}

Cordialement,
{{siteName}}
```

#### Exemple notification anglais :
```
Subject: New contact message

Template:
Hello,

You received a new message from {{name}} ({{email}}):

Subject: {{subject}}
Message: {{message}}
Phone: {{phone}}

Best regards,
{{siteName}}
```

## 🔄 Fonctionnement

1. **Utilisateur remplit le formulaire** (sur `/en/contact` par exemple)
2. **Langue détectée** automatiquement : `en`
3. **Template anglais sélectionné** depuis votre configuration
4. **Variables remplacées** dans le template anglais
5. **Contenu final envoyé** à EmailJS via le template unique
6. **EmailJS reçoit** le contenu déjà localisé dans `{{email_content}}`

## 📧 Exemple de flux

### Formulaire rempli en anglais :
```javascript
formData = {
  name: "John Doe",
  email: "john@example.com", 
  subject: "Partnership inquiry",
  message: "I would like to discuss a partnership..."
}
// Langue détectée: 'en'
```

### Template admin anglais sélectionné :
```
Subject: New contact message
Template: Hello, You received a new message from {{name}}...
```

### Variables remplacées :
```
Subject: New contact message
Content: Hello, You received a new message from John Doe...
```

### Envoyé à EmailJS :
```javascript
templateParams = {
  email_subject: "New contact message",
  email_content: "Hello, You received a new message from John Doe...",
  language: "en",
  from_name: "Your Website",
  to_email: "admin@yoursite.com"
  // ... autres variables
}
```

## 🎨 Personnalisation avancée

### Templates avec HTML :
```html
Bonjour,<br><br>

<strong>Nouveau message de {{name}}</strong><br>
Email : <a href="mailto:{{email}}">{{email}}</a><br>
Téléphone : {{phone}}<br><br>

<div style="border-left: 3px solid #007cba; padding-left: 15px; margin: 20px 0;">
  <strong>{{subject}}</strong><br>
  {{message}}
</div>

<p>Cordialement,<br>{{siteName}}</p>
```

### Variables conditionnelles :
```
{{#if phone}}Téléphone : {{phone}}{{/if}}
```

### Templates avec styles :
Dans EmailJS, vous pouvez styliser le HTML reçu dans `{{email_content}}`.

## 🐛 Résolution de problèmes

### Template EmailJS non trouvé
```
Erreur: Template ID non valide
```
**Solution :** Vérifiez l'ID du template dans EmailJS et l'interface admin.

### Variables non remplacées
```
Email contient: "Hello {{name}}"
```
**Solution :** Vérifiez que les templates dans l'admin utilisent la bonne syntaxe `{{variable}}`.

### Contenu vide
```
Email reçu vide ou avec "undefined"
```
**Solution :** Vérifiez que les templates pour la langue détectée sont bien configurés.

### Langue non détectée
```
Template français utilisé au lieu de l'anglais
```
**Solution :** Vérifiez l'URL (doit contenir `/en/`) ou la configuration des langues.

## 🔧 Migration depuis l'ancien système

Si vous aviez plusieurs templates EmailJS :

1. **Supprimez** les anciens templates `template_fr_contact`, `template_en_contact`, etc.
2. **Créez** le nouveau template unique avec le code HTML ci-dessus
3. **Configurez** le contenu pour chaque langue dans l'admin
4. **Testez** avec différentes langues

## 📚 Exemple complet

### Template EmailJS unique :
```html
<h2>{{email_subject}}</h2>
<div>{{email_content}}</div>
<p>Langue: {{language}}</p>
```

### Configuration admin français :
```
Sujet: Nouveau message de contact
Template: Bonjour, vous avez reçu un message de {{name}}...
```

### Configuration admin anglais :
```
Subject: New contact message  
Template: Hello, you received a message from {{name}}...
```

### Résultat pour un visiteur anglais :
EmailJS reçoit automatiquement :
```javascript
{
  email_subject: "New contact message",
  email_content: "Hello, you received a message from John...",
  language: "en"
}
```

---

Ce système vous donne le **meilleur des deux mondes** : la simplicité de gestion d'EmailJS avec la flexibilité complète de personnalisation multilingue ! 🚀
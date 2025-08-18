# Guide - Utilisation de votre template EmailJS existant

## 🎯 Objectif

Utiliser votre template EmailJS existant `template_bxltl6i` avec des contenus multilingues configurés dans l'interface admin.

## ✅ Fonctionnement

### 1. **Votre template EmailJS** (template_bxltl6i)
- **Un seul template** sur EmailJS
- **Reçoit le contenu déjà localisé** depuis votre interface admin
- **Variables principales** : `{{email_subject}}` et `{{email_content}}`

### 2. **Interface admin** (nouvelles fonctionnalités)
- **Sélecteurs multilingues** pour chaque template (comme les autres sections)
- **Configuration par langue** directement dans l'admin
- **Aperçu en temps réel** du contenu pour chaque langue

### 3. **Sélection automatique**
- **Langue détectée** depuis l'URL du visiteur (`/fr/contact`, `/en/contact`)
- **Template approprié sélectionné** automatiquement
- **Contenu envoyé** à EmailJS déjà localisé

## 🛠️ Configuration

### 1. Template EmailJS (template_bxltl6i)

Assurez-vous que votre template contient ces variables :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{email_subject}}</title>
</head>
<body>
    <h2>{{email_subject}}</h2>
    
    <div style="white-space: pre-line;">
        {{email_content}}
    </div>
    
    <hr>
    <p><small>
        Envoyé depuis {{site_name}} | 
        Langue: {{language}} | 
        Date: {{current_date}}
    </small></p>
</body>
</html>
```

### 2. Interface Admin

Dans **Paramètres → Configuration Email → Templates d'email** :

#### Template de notification (Admin)
Chaque langue aura son propre contenu :

**Français :**
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

**Anglais :**
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

**Espagnol :**
```
Asunto: Nuevo mensaje de contacto

Plantilla:
Hola,

Has recibido un nuevo mensaje de {{name}} ({{email}}):

Asunto: {{subject}}
Mensaje: {{message}}
Teléfono: {{phone}}

Saludos cordiales,
{{siteName}}
```

## 🔄 Flux de fonctionnement

### Exemple avec un visiteur anglais :

1. **Visiteur** va sur `/en/contact`
2. **Langue détectée** : `en`
3. **Template anglais** sélectionné depuis l'admin
4. **Variables remplacées** :
   ```
   Subject: New contact message
   Content: Hello, You received a new message from John...
   ```
5. **Envoyé à EmailJS** :
   ```javascript
   {
     email_subject: "New contact message",
     email_content: "Hello, You received a new message from John...",
     language: "en",
     // ... autres variables
   }
   ```
6. **EmailJS template_bxltl6i** reçoit le contenu déjà localisé

## 🎨 Avantages

### ✅ **Plus simple**
- Un seul template EmailJS à maintenir
- Pas besoin de créer template_fr, template_en, etc.

### ✅ **Plus flexible**
- Modification du contenu directement dans l'admin
- Aperçu en temps réel pour chaque langue
- Interface familière (comme les autres sections)

### ✅ **Plus maintenable**
- Changements sans toucher à EmailJS
- Gestion centralisée des contenus
- Sauvegarde avec les autres paramètres du site

## 🧪 Test

1. **Configurez vos templates** pour différentes langues
2. **Allez sur `/fr/contact`** et envoyez un message → Template français
3. **Allez sur `/en/contact`** et envoyez un message → Template anglais
4. **Vérifiez les emails reçus** avec le bon contenu et la bonne langue

## 📧 Variables disponibles

### Dans vos templates admin :
- `{{name}}` - Nom du visiteur
- `{{email}}` - Email du visiteur
- `{{phone}}` - Téléphone du visiteur
- `{{subject}}` - Sujet du message
- `{{message}}` - Message du visiteur
- `{{siteName}}` - Nom de votre site (localisé)
- `{{date}}` - Date formatée selon la langue

### Reçues par EmailJS :
- `{{email_subject}}` - Le sujet déjà localisé
- `{{email_content}}` - Le contenu déjà localisé
- `{{language}}` - Code de langue (fr, en, es)
- `{{from_name}}`, `{{to_email}}`, etc. - Infos techniques

## 🔧 Migration

Si vous aviez des templates EmailJS multiples, vous pouvez maintenant :

1. **Supprimer** les anciens templates (template_fr_contact, template_en_contact)
2. **Garder** uniquement template_bxltl6i
3. **Configurer** les contenus dans l'interface admin
4. **Tester** avec différentes langues

---

Votre template `template_bxltl6i` est maintenant **plus puissant** et **plus facile à gérer** ! 🚀
# API Backend pour l'envoi d'emails

Cette API permet d'envoyer des emails via différents providers (Mailjet, SMTP) depuis votre application React.

## Installation

1. Naviguez dans le dossier api-backend-example :
```bash
cd api-backend-example
```

2. Installez les dépendances :
```bash
npm install
```

3. Copiez le fichier de configuration :
```bash
cp .env.example .env
```

4. Modifiez le fichier `.env` avec vos paramètres

5. Démarrez le serveur :
```bash
npm start
# ou pour le développement :
npm run dev
```

## Configuration

### Mailjet
1. Créez un compte sur [mailjet.com](https://www.mailjet.com/)
2. Obtenez vos clés API dans "Account Settings > API Keys"
3. Configurez les clés dans votre frontend ou dans le fichier `.env`

### SMTP
1. Configurez vos paramètres SMTP (Gmail, Outlook, etc.)
2. Pour Gmail, utilisez un mot de passe d'application
3. Configurez les paramètres dans votre frontend ou dans le fichier `.env`

## Utilisation

L'API expose un endpoint POST `/api/send-email` qui accepte :

```json
{
  "provider": "mailjet|smtp",
  "config": {
    "mailjetApiKey": "...",
    "mailjetSecretKey": "...",
    "smtpHost": "...",
    "smtpPort": 587,
    "smtpUser": "...",
    "smtpPassword": "..."
  },
  "email": {
    "from": { "email": "...", "name": "..." },
    "to": "destinataire@exemple.com",
    "subject": "Sujet",
    "text": "Message texte",
    "html": "Message HTML",
    "replyTo": "reponse@exemple.com"
  },
  "type": "contact_notification|contact_confirmation"
}
```

## Déploiement

### Vercel
1. Installez Vercel CLI : `npm i -g vercel`
2. Déployez : `vercel`
3. Configurez les variables d'environnement dans le dashboard Vercel

### Heroku
1. Créez une app Heroku
2. Configurez les variables d'environnement
3. Déployez avec `git push heroku main`

### Autres
L'API peut être déployée sur n'importe quel service supportant Node.js (Railway, DigitalOcean, AWS, etc.)

## Sécurité

- Les clés API peuvent être configurées côté frontend ou serveur
- Utilisez HTTPS en production
- Configurez CORS correctement
- Ne loggez jamais les mots de passe ou clés secrètes

## Test

Test de santé :
```bash
curl http://localhost:3001/api/health
```

Test d'envoi :
```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"provider":"mailjet","config":{...},"email":{...}}'
```
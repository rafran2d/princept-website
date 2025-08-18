// Fonction Netlify pour envoyer des emails via Mailjet
// Déploiement automatique si vous hébergez sur Netlify

const mailjet = require('node-mailjet');

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Gérer les requêtes OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { config, email, type } = JSON.parse(event.body);

    console.log(`📧 [Netlify Function] Envoi ${type}:`, {
      to: email.to,
      subject: email.subject
    });

    // Initialiser Mailjet
    const mailjetClient = mailjet.connect(
      config.mailjetApiKey,
      config.mailjetSecretKey
    );

    // Préparer le payload
    const request = {
      Messages: [
        {
          From: {
            Email: email.from.email,
            Name: email.from.name
          },
          To: [
            {
              Email: email.to,
              Name: email.toName || ''
            }
          ],
          Subject: email.subject,
          TextPart: email.text,
          HTMLPart: email.html || email.text.replace(/\n/g, '<br>'),
          ReplyTo: email.replyTo ? {
            Email: email.replyTo,
            Name: email.from.name
          } : undefined
        }
      ]
    };

    if (config.mailjetSandboxMode) {
      request.SandboxMode = true;
    }

    // Envoyer l'email
    const response = await mailjetClient
      .post('send', { version: 'v3.1' })
      .request(request);

    console.log('✅ [Netlify Function] Email envoyé:', response.body);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: response.body.Messages[0].To[0].MessageID,
        message: 'Email envoyé avec succès via Netlify + Mailjet'
      }),
    };

  } catch (error) {
    console.error('❌ [Netlify Function] Erreur:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      }),
    };
  }
};
// Fonction Vercel pour envoyer des emails via Mailjet
// Déploiement automatique si vous hébergez sur Vercel

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { config, email, type } = req.body;

    console.log(`📧 [Vercel Function] Envoi ${type}:`, {
      to: email.to,
      subject: email.subject
    });

    // Préparer le payload Mailjet
    const payload = {
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
      payload.SandboxMode = true;
    }

    // Appel à l'API Mailjet depuis le serveur
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${config.mailjetApiKey}:${config.mailjetSecretKey}`).toString('base64')
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Mailjet API Error: ${errorData.ErrorMessage || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ [Vercel Function] Email envoyé:', result);

    res.status(200).json({
      success: true,
      messageId: result.Messages[0].To[0].MessageID,
      message: 'Email envoyé avec succès via Vercel + Mailjet',
      provider: 'mailjet'
    });

  } catch (error) {
    console.error('❌ [Vercel Function] Erreur:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
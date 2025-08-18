// Exemple d'API backend pour l'envoi d'emails
// Installation : npm install express cors dotenv nodemailer mailjet-api-v3

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import des services d'email
const nodemailer = require('nodemailer');
const mailjet = require('node-mailjet');

// Endpoint d'envoi d'email
app.post('/api/send-email', async (req, res) => {
  try {
    const { provider, config, email, type } = req.body;

    console.log(`📧 [API Backend] Réception demande d'envoi: ${type}`, {
      provider,
      to: email.to,
      subject: email.subject
    });

    let result;

    switch (provider) {
      case 'mailjet':
        result = await sendWithMailjet(email, config);
        break;
      case 'smtp':
        result = await sendWithSMTP(email, config);
        break;
      default:
        throw new Error(`Provider non supporté: ${provider}`);
    }

    console.log('✅ [API Backend] Email envoyé avec succès:', result);

    res.json({
      success: true,
      messageId: result.messageId,
      message: `Email envoyé avec succès via ${provider}`,
      provider: provider
    });

  } catch (error) {
    console.error('❌ [API Backend] Erreur lors de l\'envoi:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Fonction d'envoi via Mailjet
async function sendWithMailjet(emailData, config) {
  const mailjetClient = mailjet.connect(config.mailjetApiKey, config.mailjetSecretKey);

  const request = {
    Messages: [
      {
        From: {
          Email: emailData.from.email,
          Name: emailData.from.name
        },
        To: [
          {
            Email: emailData.to,
            Name: emailData.toName || ''
          }
        ],
        Subject: emailData.subject,
        TextPart: emailData.text,
        HTMLPart: emailData.html || emailData.text.replace(/\n/g, '<br>'),
        ReplyTo: emailData.replyTo ? {
          Email: emailData.replyTo,
          Name: emailData.from.name
        } : undefined
      }
    ]
  };

  if (config.mailjetSandboxMode) {
    request.SandboxMode = true;
  }

  const response = await mailjetClient
    .post('send', { version: 'v3.1' })
    .request(request);

  return {
    messageId: response.body.Messages[0].To[0].MessageID,
    response: response.body
  };
}

// Fonction d'envoi via SMTP (nodemailer)
async function sendWithSMTP(emailData, config) {
  const transporter = nodemailer.createTransporter({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure, // true pour 465, false pour autres ports
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });

  const mailOptions = {
    from: `"${emailData.from.name}" <${emailData.from.email}>`,
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.text,
    html: emailData.html || emailData.text.replace(/\n/g, '<br>'),
    replyTo: emailData.replyTo
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    messageId: info.messageId,
    response: info
  };
}

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Email Backend opérationnelle' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur API Email démarré sur le port ${PORT}`);
  console.log(`📧 Endpoint disponible: http://localhost:${PORT}/api/send-email`);
});

module.exports = app;
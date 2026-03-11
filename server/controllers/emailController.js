const mailjet = require('node-mailjet');
const nodemailer = require('nodemailer');
const sendgrid = require('@sendgrid/mail');

async function sendWithMailjet(config, email) {
  const mailjetConnect = mailjet.apiConnect(config.apiKey, config.secretKey);

  const result = await mailjetConnect
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: email.from.email,
            Name: email.from.name || 'Website'
          },
          To: [
            {
              Email: email.to,
              Name: email.toName || ''
            }
          ],
          Subject: email.subject,
          TextPart: typeof email.text === 'string' ? email.text : String(email.text || ''),
          HTMLPart: email.html || (typeof email.text === 'string' ? email.text : String(email.text || '')).replace(/\n/g, '<br>'),
          ReplyTo: email.replyTo ? {
            Email: email.replyTo,
            Name: email.from.name || 'Website'
          } : undefined
        }
      ],
      SandboxMode: config.sandboxMode || false
    });

  return {
    messageId: result.body.Messages[0].To[0].MessageID,
    message: 'Email envoyé via Mailjet'
  };
}

async function sendWithSendGrid(config, email) {
  sendgrid.setApiKey(config.apiKey);

  const msg = {
    to: email.to,
    from: {
      email: config.senderEmail,
      name: config.senderName || 'Website'
    },
    subject: email.subject,
    text: typeof email.text === 'string' ? email.text : String(email.text || ''),
    html: email.html || (typeof email.text === 'string' ? email.text : String(email.text || '')).replace(/\n/g, '<br>'),
    replyTo: config.replyTo || email.replyTo
  };

  const result = await sendgrid.send(msg);

  return {
    messageId: result[0].headers['x-message-id'],
    message: 'Email envoyé via SendGrid'
  };
}

async function sendWithSMTP(config, email, provider) {
  let transportConfig;

  switch (provider) {
    case 'gmail':
      transportConfig = {
        service: 'gmail',
        auth: { user: config.username, pass: config.password }
      };
      break;
    case 'outlook':
      transportConfig = {
        service: 'hotmail',
        auth: { user: config.username, pass: config.password }
      };
      break;
    case 'custom':
    default:
      transportConfig = {
        host: config.host,
        port: parseInt(config.port),
        secure: !!config.secure,
        auth: { user: config.username, pass: config.password }
      };
      break;
  }

  const transporter = nodemailer.createTransport(transportConfig);

  const mailOptions = {
    from: {
      name: config.senderName || 'Website',
      address: config.senderEmail || config.username
    },
    to: email.to,
    subject: email.subject,
    text: typeof email.text === 'string' ? email.text : String(email.text || ''),
    html: email.html || (email.text != null ? String(email.text).replace(/\n/g, '<br>') : undefined),
    replyTo: config.replyTo || email.replyTo
  };

  const result = await transporter.sendMail(mailOptions);

  return {
    messageId: result.messageId,
    message: `Email envoyé via ${provider.toUpperCase()} SMTP`
  };
}

const EmailController = {
  async sendEmail(req, res) {
    try {
      const { provider, config, email, type } = req.body;

      if (!provider || !config || !email) {
        return res.status(400).json({
          error: 'Paramètres manquants',
          required: ['provider', 'config', 'email']
        });
      }

      let result;

      switch (provider) {
        case 'mailjet':
          result = await sendWithMailjet(config, email);
          break;
        case 'sendgrid':
          result = await sendWithSendGrid(config, email);
          break;
        case 'gmail':
          result = await sendWithSMTP(config, email, 'gmail');
          break;
        case 'outlook':
          result = await sendWithSMTP(config, email, 'outlook');
          break;
        case 'smtpCustom':
        case 'smtp':
          result = await sendWithSMTP(config, email, 'custom');
          break;
        default:
          throw new Error(`Provider non supporté: ${provider}`);
      }

      res.json({
        success: true,
        provider,
        messageId: result.messageId,
        message: result.message || 'Email envoyé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error.message,
        provider: req.body.provider
      });
    }
  }
};

module.exports = EmailController;

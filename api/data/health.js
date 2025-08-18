export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }

  res.status(200).json({ 
    status: 'OK',
    message: 'API de stockage JSON opérationnelle',
    timestamp: new Date().toISOString()
  });
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const TOKEN_EXPIRY = '24h';

const AuthController = {
  // POST /api/auth/login
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username et mot de passe requis' });
      }

      // Chercher par username ou email
      const users = await database.query(
        'SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1',
        [username, username]
      );

      if (!users || users.length === 0) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      // Mettre à jour last_login
      await database.run('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

      // Générer le token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          is_default_password: user.is_default_password
        }
      });
    } catch (error) {
      console.error('❌ Erreur login:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/auth/logout
  async logout(req, res) {
    res.json({ message: 'Déconnexion réussie' });
  },

  // GET /api/auth/verify
  async verify(req, res) {
    try {
      const user = req.user;
      const users = await database.query('SELECT id, username, email, role, is_default_password FROM users WHERE id = ? AND is_active = 1', [user.id]);

      if (!users || users.length === 0) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ user: users[0] });
    } catch (error) {
      console.error('❌ Erreur verify:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/auth/change-password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });
      }

      const users = await database.query('SELECT * FROM users WHERE id = ?', [userId]);
      if (!users || users.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const valid = await bcrypt.compare(currentPassword, users[0].password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
      }

      const hash = await bcrypt.hash(newPassword, 10);
      await database.run('UPDATE users SET password_hash = ?, is_default_password = 0 WHERE id = ?', [hash, userId]);

      res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
      console.error('❌ Erreur change-password:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // POST /api/auth/update-profile
  async updateProfile(req, res) {
    try {
      const { username, email } = req.body;
      const userId = req.user.id;

      const updates = [];
      const params = [];

      if (username) { updates.push('username = ?'); params.push(username); }
      if (email) { updates.push('email = ?'); params.push(email); }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
      }

      params.push(userId);
      await database.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

      const users = await database.query('SELECT id, username, email, role, is_default_password FROM users WHERE id = ?', [userId]);
      res.json({ message: 'Profil mis à jour', user: users[0] });
    } catch (error) {
      console.error('❌ Erreur update-profile:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = AuthController;

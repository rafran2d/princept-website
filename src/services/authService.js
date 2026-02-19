import apiConfig, { API_ENDPOINTS } from '../config/api.js';

// Service d'authentification pour l'admin
class AuthService {
  constructor() {
    this.apiConfig = apiConfig;
    this.tokenKey = 'admin_token';
  }

  // Login
  async login(username, password) {
    try {
      const response = await fetch(this.apiConfig.getURL(API_ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Sauvegarder le token
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('❌ Erreur login:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(this.apiConfig.getURL(API_ENDPOINTS.LOGOUT), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
      }
    } catch (error) {
      console.error('❌ Erreur logout:', error);
    } finally {
      // Nettoyer le localStorage
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('admin_user');
    }
  }

  // Vérifier le token
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await fetch(this.apiConfig.getURL(API_ENDPOINTS.VERIFY_TOKEN), {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        this.logout(); // Token invalide, nettoyer
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('❌ Erreur vérification token:', error);
      this.logout();
      return null;
    }
  }

  // Obtenir le token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Obtenir l'utilisateur courant
  getCurrentUser() {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('❌ Erreur parsing user:', error);
        return null;
      }
    }
    return null;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.getToken();
  }

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Changer le mot de passe
  async changePassword(passwordData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(this.apiConfig.getURL(API_ENDPOINTS.CHANGE_PASSWORD), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du changement de mot de passe');
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur changement mot de passe:', error);
      throw error;
    }
  }

  // Mettre à jour le profil
  async updateProfile(profileData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(this.apiConfig.getURL(API_ENDPOINTS.UPDATE_PROFILE), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du profil');
      }

      // Mettre à jour l'utilisateur en localStorage
      if (data.user) {
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error);
      throw error;
    }
  }
}

export default new AuthService();
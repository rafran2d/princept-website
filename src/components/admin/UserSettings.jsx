import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

const UserSettings = () => {
  const { user, updateUserInfo, changePassword } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profilePassword: '', // Mot de passe pour confirmer les changements de profil
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    profile: false,
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState({
    profile: false,
    password: false
  });
  const [messages, setMessages] = useState({
    profile: { type: '', text: '' },
    password: { type: '', text: '' }
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const clearMessage = (section) => {
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [section]: { type: '', text: '' }
      }));
    }, 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setMessages(prev => ({ ...prev, profile: { type: '', text: '' } }));

    try {
      // Validation basique
      if (!formData.username.trim() || !formData.email.trim() || !formData.profilePassword.trim()) {
        throw new Error('Le nom d\'utilisateur, l\'email et le mot de passe sont requis');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Format d\'email invalide');
      }

      if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
        throw new Error('Le nom d\'utilisateur doit contenir 3-20 caractères (lettres, chiffres, underscore)');
      }

      const response = await authService.updateProfile({
        username: formData.username,
        email: formData.email,
        currentPassword: formData.profilePassword
      });

      if (response.success) {
        // Mettre à jour le contexte utilisateur
        updateUserInfo({
          ...user,
          username: formData.username,
          email: formData.email
        });

        // Nettoyer le mot de passe
        setFormData(prev => ({
          ...prev,
          profilePassword: ''
        }));

        setMessages(prev => ({
          ...prev,
          profile: { type: 'success', text: 'Profil mis à jour avec succès' }
        }));
        clearMessage('profile');
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setMessages(prev => ({
        ...prev,
        profile: { type: 'error', text: error.message }
      }));
      clearMessage('profile');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, password: true }));
    setMessages(prev => ({ ...prev, password: { type: '', text: '' } }));

    try {
      // Validation
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        throw new Error('Tous les champs de mot de passe sont requis');
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('La confirmation du mot de passe ne correspond pas');
      }

      if (formData.newPassword.length < 6) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      }

      await changePassword(formData.currentPassword, formData.newPassword);

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setMessages(prev => ({
        ...prev,
        password: { type: 'success', text: 'Mot de passe modifié avec succès. Déconnexion automatique dans un instant...' }
      }));
    } catch (error) {
      setMessages(prev => ({
        ...prev,
        password: { type: 'error', text: error.message }
      }));
      clearMessage('password');
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const MessageAlert = ({ message, type }) => {
    if (!message) return null;

    return (
      <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium ${
        type === 'success' 
          ? 'bg-green-50 text-green-700 border border-green-200' 
          : 'bg-red-50 text-red-700 border border-red-200'
      }`}>
        {type === 'success' ? (
          <Check className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Paramètres utilisateur</h1>
            <p className="text-blue-100">Gérer votre profil et sécurité</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Informations personnelles</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Sécurité</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du profil</h3>
                <p className="text-gray-600 mb-6">Modifiez vos informations personnelles d'administration.</p>
              </div>

              <MessageAlert message={messages.profile.text} type={messages.profile.type} />

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nom d'utilisateur"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">3-20 caractères, lettres, chiffres et underscore uniquement</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.profile ? 'text' : 'password'}
                      value={formData.profilePassword}
                      onChange={(e) => handleInputChange('profilePassword', e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Confirmer avec votre mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('profile')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.profile ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Requis pour confirmer les modifications</p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading.profile}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.profile ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Mise à jour...</span>
                      </div>
                    ) : (
                      'Mettre à jour le profil'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
                <p className="text-gray-600 mb-6">Assurez-vous d'utiliser un mot de passe fort et unique.</p>
              </div>

              <MessageAlert message={messages.password.text} type={messages.password.type} />

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Mot de passe actuel"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nouveau mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Confirmer le mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading.password}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.password ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Modification...</span>
                      </div>
                    ) : (
                      'Changer le mot de passe'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const user = await authService.verifyToken();
      
      if (user) {
        setUser(user);
        setIsAuthenticated(true);

      } else {
        setUser(null);
        setIsAuthenticated(false);

      }
    } catch (error) {

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (error) {

      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);

    } catch (error) {

    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      });
      

      
      // Déconnexion automatique pour des raisons de sécurité
      // L'utilisateur devra se reconnecter avec son nouveau mot de passe
      setTimeout(() => {
        logout();
      }, 1000); // Délai pour permettre l'affichage du message de succès
      
      return result;
    } catch (error) {

      throw error;
    }
  };

  const updateUserInfo = (updatedUserInfo) => {
    setUser(prev => ({ ...prev, ...updatedUserInfo }));

  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isDefaultPassword: user?.isDefaultPassword === true,
    needsPasswordChange: user?.isDefaultPassword === true && user?.role === 'admin',
    login,
    logout,
    changePassword,
    updateUserInfo,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
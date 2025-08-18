import { useState, useCallback } from 'react';

export const useFlashMessage = () => {
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    // Auto-hide après 5 secondes
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const hideMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const showSuccess = useCallback((text) => {
    showMessage(text, 'success');
  }, [showMessage]);

  const showError = useCallback((text) => {
    showMessage(text, 'error');
  }, [showMessage]);

  const showInfo = useCallback((text) => {
    showMessage(text, 'info');
  }, [showMessage]);

  const showWarning = useCallback((text) => {
    showMessage(text, 'warning');
  }, [showMessage]);

  return {
    message,
    showMessage,
    hideMessage,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};
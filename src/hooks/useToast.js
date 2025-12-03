import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    
    const toast = {
      id,
      type,
      title,
      message,
      duration,
      isOpen: true
    };

    setToasts(prev => [...prev, toast]);

    // Remove automaticamente após um tempo
    setTimeout(() => {
      removeToast(id);
    }, duration + 500);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = 'Sucesso') => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((message, title = 'Erro') => {
    return addToast({ type: 'error', title, message });
  }, [addToast]);

  const showWarning = useCallback((message, title = 'Atenção') => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const showInfo = useCallback((message, title = 'Informação') => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast
  };
};
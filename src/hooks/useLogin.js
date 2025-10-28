import { login } from '../services/authService';
import { useState } from 'react';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await login(credentials);
      return data; 
    } catch (err) {
      const data = err.response?.data;

      
      setError(data?.mensagem || 'Erro ao fazer login');

    
      return data || { mensagem: 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
};

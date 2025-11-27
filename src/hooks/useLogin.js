import { login, getColaborador } from '../services/authService';
import { useState, useEffect } from 'react';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Função para buscar dados do usuário logado
  const fetchUserData = async () => {
    setUserLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Assumindo que você salva o ID também
      
      if (!token || !userId) {
        setUser(null);
        return;
      }

      const userData = await getColaborador(userId);
      setUser(userData);
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      setUser(null);
      // Se der erro de autenticação, limpa o localStorage
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    } finally {
      setUserLoading(false);
    }
  };

  // Busca dados do usuário quando o hook é inicializado
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await login(credentials);
      
      // Se o login foi bem-sucedido e retornou dados
      if (data.token && data.usuario) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.usuario.id);
        
        // Busca os dados completos do usuário após login
        await fetchUserData();
      }
      
      return data; 
    } catch (err) {
      const data = err.response?.data;
      setError(data?.mensagem || 'Erro ao fazer login');
      return data || { mensagem: 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return { 
    handleLogin, 
    error, 
    loading, 
    user, 
    userLoading: userLoading || loading, 
    logout,
    refreshUser: fetchUserData
  };
};
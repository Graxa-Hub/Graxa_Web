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
      const userId = localStorage.getItem('userId');
      
      console.log('fetchUserData - token:', token ? 'existe' : 'não existe');
      console.log('fetchUserData - userId:', userId);
      
      if (!token || !userId) {
        setUser(null);
        setUserLoading(false);
        return;
      }

      const userData = await getColaborador(userId);
      console.log('userData obtido:', userData);
      setUser(userData);
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      setUser(null);
      // Se der erro de autenticação, limpa o localStorage
      if (err.response?.status === 401) {
        console.warn('⚠️ Erro 401 ao buscar usuário - limpando localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    } finally {
      setUserLoading(false);
    }
  };

  // Busca dados do usuário quando o hook é inicializado (somente se tiver token E userId)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      fetchUserData();
    } else {
      setUserLoading(false);
    }
  }, []);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await login(credentials);
      console.log('🟢 useLogin - Dados retornados do authService.login:', data);
      
      // Se o login foi bem-sucedido e retornou dados
      // Backend retorna 'user', mas o AuthContext espera 'usuario'
      if (data.token && data.user) {
        console.log('🟢 Token e user existem, normalizando para usuario...');
        // Normaliza para 'usuario' para consistência no app
        data.usuario = data.user;
        localStorage.setItem('userId', data.user.id);
        
        console.log('🟢 Chamando fetchUserData...');
        // Busca os dados completos do usuário após login
        await fetchUserData();
      } else {
        console.warn('⚠️ Login sem token ou user:', { hasToken: !!data.token, hasUser: !!data.user });
      }
      
      console.log('🟢 handleLogin - Retornando data:', data);
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
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_SPRING,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUEST - adiciona token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - detecta usuário removido/inválido
api.interceptors.response.use(
  (response) => {
    // Se a resposta é OK, retorna normalmente
    return response;
  },
  (error) => {
    // Verifica erros de autenticação
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.mensagem || error.response.data?.message || '';

      // 401 = Não autorizado (token inválido, usuário removido, etc)
      // 403 = Forbidden (sem permissão)
      if (status === 401 || status === 403) {
        console.warn('🚨 Sessão inválida. Fazendo logout...');
        
        // Remove dados do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redireciona para login
        window.location.href = '/login';
        
        return Promise.reject(new Error('Sessão expirada. Faça login novamente.'));
      }

      // Se usuário foi deletado especificamente
      if (message.toLowerCase().includes('usuário não encontrado') || 
          message.toLowerCase().includes('user not found') ||
          message.toLowerCase().includes('deletado')) {
        console.warn('🚨 Usuário removido do sistema. Fazendo logout...');
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        window.location.href = '/login';
        
        return Promise.reject(new Error('Usuário removido do sistema.'));
      }
    }

    // Se não for erro de autenticação, retorna o erro normalmente
    return Promise.reject(error);
  }
);

export { api };

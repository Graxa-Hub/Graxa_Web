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
    
    // Remove Content-Type se for FormData (deixa o browser definir com boundary correto)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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

      console.warn('🔴 Interceptor axios - Status:', status, 'Message:', message);

      // 401 = Não autorizado (token inválido, usuário removido, etc)
      if (status === 401) {
        // Remove dados do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('usuario');
        localStorage.removeItem('userId');
        localStorage.removeItem('ultimaRota');
        // window.location.href = '/login';
        return Promise.reject(new Error('Sessão expirada. Faça login novamente.'));
      }

      // Se usuário foi deletado especificamente
      if (message.toLowerCase().includes('usuário não encontrado') || 
          message.toLowerCase().includes('user not found') ||
          message.toLowerCase().includes('deletado')) {
        console.warn('🚨 Usuário removido do sistema. Fazendo logout...');
        
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('roles');
        localStorage.removeItem('ultimaRota');
        localStorage.removeItem('userId');
        
        window.location.href = '/login';
        
        return Promise.reject(new Error('Usuário removido do sistema.'));
      }
    }

    // Se não for erro de autenticação, retorna o erro normalmente
    return Promise.reject(error);
  }
);

export { api };

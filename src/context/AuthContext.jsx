// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem('usuario');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false); // Sem validação ao carregar
  const isAuthenticated = !!token && !!usuario;

  const loginToContext = (data) => {
  console.log('📌 loginToContext - Dados recebidos:', data);
  console.log('📌 token:', data.token);
  console.log('📌 usuario:', data.usuario);
  
  if (!data.token) {
    console.error('❌ Token não encontrado nos dados!');
    return;
  }
  
  if (!data.usuario) {
    console.error('❌ Usuario não encontrado nos dados!');
    return;
  }
  
  setToken(data.token);
  setUsuario(data.usuario);

  localStorage.setItem('token', data.token);       // sem stringify
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  localStorage.setItem('roles', JSON.stringify(data.roles || []));
  
  console.log('✅ loginToContext concluído - token e usuario salvos');
};


  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('roles');
    localStorage.removeItem('userId');
    localStorage.removeItem('ultimaRota');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        usuario, 
        setUsuario,     // <-- ADICIONE
        setToken,       // <-- opcional, mas útil
        loginToContext, 
        logout, 
        isAuthenticated, 
        loading 
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

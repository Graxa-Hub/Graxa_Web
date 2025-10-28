// context/AuthContext.js
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(null);
  const isAuthenticated = !!token;

  const loginToContext = (data) => {
    setToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, usuario, loginToContext, logout, isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

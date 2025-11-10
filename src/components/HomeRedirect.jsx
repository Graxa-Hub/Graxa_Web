import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomeRedirect = () => {
  const { isAuthenticated, token, loading } = useAuth();

  // Aguarda validação do token
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se estiver autenticado, vai para dashboard
  if (isAuthenticated && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não estiver autenticado, vai para login
  return <Navigate to="/login" replace />;
};

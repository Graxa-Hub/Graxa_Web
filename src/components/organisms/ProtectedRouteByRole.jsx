import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';

/**
 * Componente protetor de rota baseado em role
 * 
 * Uso:
 * <ProtectedRouteByRole allowedRoles={['produtor']} element={<CriarEvento />} />
 * 
 * @param {string[]} allowedRoles - Array de roles permitidas (ex: ['produtor', 'artista'])
 * @param {JSX.Element} element - Elemento a ser renderizado se acesso permitido
 * @returns {JSX.Element}
 */
export function ProtectedRouteByRole({ allowedRoles = [], element }) {
  const { checkRoles, isAuthenticated } = useRole();
  const { usuario } = useRole();

  // Se não autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se não tem role, redireciona para home
  if (!checkRoles(allowedRoles)) {
    console.warn(
      `⛔ Acesso negado. Role necessária: ${allowedRoles.join(', ')}. Role atual: ${usuario?.tipoUsuario}`
    );
    return <Navigate to="/calendario" replace />;
  }

  // Se passou nas verificações, renderiza o elemento
  return element;
}

import { useAuth } from '../context/AuthContext';

export function useRole() {
  const { usuario } = useAuth();
  const isAuthenticated = !!usuario;

  const checkRole = (roleRequired) => {
    if (!usuario) return false;
    
    // Converte para lowercase para comparação case-insensitive
    const userRole = usuario.tipoUsuario?.toLowerCase();
    const required = roleRequired.toLowerCase();
    
    return userRole === required;
  };

  const checkRoles = (rolesRequired = []) => {
    if (!usuario) return false;
    
    const userRole = usuario.tipoUsuario?.toLowerCase();
    return rolesRequired.some(role => userRole === role.toLowerCase());
  };

  const isProducer = () => checkRole('produtor');
  const isArtist = () => checkRole('artista');
  const isCollaborator = () => checkRole('colaborador');

  return {
    usuario,
    isAuthenticated,
    checkRole,
    checkRoles,
    isProducer,
    isArtist,
    isCollaborator,
    tipoUsuario: usuario?.tipoUsuario,
  };
}

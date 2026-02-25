import { useAuth } from '../../context/AuthContext';

/**
 * RoleGuard: Componente para proteger ações por role.
 * Uso:
 * <RoleGuard allowedRoles={["admin", "produtor"]}>
 *   <button>Botão restrito</button>
 * </RoleGuard>
 */
export const RoleGuard = ({ allowedRoles, children, fallback = null }) => {
  const { usuario } = useAuth();

  if (!usuario || !usuario.roles) return fallback;

  // Normaliza allowedRoles para formato ROLE_...
  const normalizedAllowed = allowedRoles.map(r => r.startsWith('ROLE_') ? r : `ROLE_${r.toUpperCase()}`);
  const hasAccess = usuario.roles.some(role => normalizedAllowed.includes(role));
  return hasAccess ? children : fallback;
};

/**
 * Função utilitária para uso em lógica JS
 * Exemplo: if (canEdit(usuario)) { ... }
 */
export function canEdit(usuario) {
  if (!usuario || !usuario.roles) return false;
  return usuario.roles.includes('ROLE_ADMIN') || usuario.roles.includes('ROLE_PRODUTOR');
}

/**
 * Função para visualizar/aceitar/recusar locações
 * Exemplo: if (canAcceptLocacao(usuario)) { ... }
 */
export function canAcceptLocacao(usuario) {
  if (!usuario || !usuario.roles) return false;
  // Aqui pode customizar para as roles que podem aceitar/recusar
  return !canEdit(usuario); // Só quem NÃO é admin/produtor
}

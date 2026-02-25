// Utilitário para checar permissão de edição
export function canEditRole() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  return usuario.roles && usuario.roles.some(role => ['ROLE_ADMIN','ROLE_PRODUTOR'].includes(role));
}

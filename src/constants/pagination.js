/**
 * Constantes de paginação compartilhadas entre páginas
 * Centralize aqui o tamanho padrão para manter consistência
 */

// Tamanho padrão de itens por página em listas paginadas
export const DEFAULT_PAGE_SIZE = 1;

// Tamanhos específicos por contexto
export const PAGINATION_SIZES = {
  // Listas paginadas (Turne.jsx, ArtistaApp.jsx)
  LIST: DEFAULT_PAGE_SIZE,
  
  // Calendário (precisa carregar muitos)
  CALENDAR: 100,
  
  // Modais de seleção
  MODAL: 50,
  
  // Dropdowns reutilizáveis
  DROPDOWN: 10,
  
  // Modal de evento (precisa de muitas opções)
  EVENT_MODAL: 100,
};

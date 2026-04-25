import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Componente de Paginação reutilizável
 * @param {Object} pagination - Objeto de paginação (pageNumber, totalPages, first, last)
 * @param {Function} onNextPage - Callback para próxima página
 * @param {Function} onPrevPage - Callback para página anterior
 * @param {Function} onGoToPage - Callback para ir para página específica
 * @param {boolean} disabled - Desabilitar controles
 */
export const Pagination = ({
  pagination,
  onNextPage,
  onPrevPage,
  onGoToPage,
  disabled = false,
}) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const pageButtons = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(0, pagination.pageNumber - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pagination.totalPages - 1, startPage + maxVisiblePages - 1);

  // Ajustar se não há páginas suficientes No final
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }

  return (
    <div className="flex items-center justify-end gap-2 px-1">
      {/* Primeira página */}
      <button
        onClick={() => onGoToPage(0)}
        disabled={disabled || pagination.first}
        className="p-1.5 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Primeira página"
        title="Primeira página"
      >
        <ChevronsLeft size={18} />
      </button>

      {/* Página anterior */}
      <button
        onClick={onPrevPage}
        disabled={disabled || pagination.first}
        className="p-1.5 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Página anterior"
        title="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Números de páginas */}
      <div className="flex items-center gap-1">
        {startPage > 0 && (
          <span className="px-0.5 text-xs text-[var(--text-muted)]">…</span>
        )}

        {pageButtons.map((page) => (
          <button
            key={page}
            onClick={() => onGoToPage(page)}
            disabled={disabled}
            className={`
              w-7 h-7 rounded-md text-xs font-semibold transition-all
              ${pagination.pageNumber === page
                ? 'text-blue-500 border border-blue-500 hover:bg-blue-50'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-30'
              }
            `}
          >
            {page + 1}
          </button>
        ))}

        {endPage < pagination.totalPages - 1 && (
          <span className="px-0.5 text-xs text-[var(--text-muted)]">…</span>
        )}
      </div>

      {/* Próxima página */}
      <button
        onClick={onNextPage}
        disabled={disabled || pagination.last}
        className="p-1.5 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Próxima página"
        title="Próxima página"
      >
        <ChevronRight size={18} />
      </button>

      {/* Última página */}
      <button
        onClick={() => onGoToPage(pagination.totalPages - 1)}
        disabled={disabled || pagination.last}
        className="p-1.5 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Última página"
        title="Última página"
      >
        <ChevronsRight size={18} />
      </button>

      {/* Info página atual */}
      <span className="text-xs text-[var(--text-muted)] ml-1 hidden sm:inline">
        {pagination.pageNumber + 1} de {pagination.totalPages}
      </span>
    </div>
  );
};

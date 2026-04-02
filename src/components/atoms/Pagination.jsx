import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage = 0,
  totalPages = 0,
  onPageChange,
  isLoading = false,
  className = ""
}) {
  // Não renderiza se houver apenas 1 página ou 0 páginas
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex items-center justify-end gap-3 py-2 px-1 ${className}`}>
      {/* Indicador texto */}
      <span className="text-xs text-gray-500 font-medium">
        {currentPage + 1} / {totalPages}
      </span>

      {/* Botão Anterior */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0 || isLoading}
        className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Página anterior"
        title="Página anterior"
      >
        <ChevronLeft className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      </button>

      {/* Botão Próximo */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1 || isLoading}
        className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Próxima página"
        title="Próxima página"
      >
        <ChevronRight className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}

/**
 * Componente para seleção de tamanho de página
 * @param {number} pageSize - Tamanho atual da página
 * @param {Function} onPageSizeChange - Callback quando tamanho muda
 * @param {Array<number>} options - Opções de tamanho disponíveis (padrão: [5, 10, 15, 20, 50])
 * @param {boolean} disabled - Desabilitar seleção
 */
export const PageSizeSelector = ({
  pageSize,
  onPageSizeChange,
  options = [5, 10, 15, 20, 50],
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="page-size" className="text-sm font-medium text-gray-700">
        Itens por página:
      </label>
      <select
        id="page-size"
        value={pageSize}
        onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="
          px-3 py-2 border border-gray-300 rounded-lg
          bg-white text-sm font-medium
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed transition
        "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

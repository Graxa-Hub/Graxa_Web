import React from "react";

export function BandaInput({
  label,
  placeholder = "Pesquisar banda...",
  value,
  searchText,
  onSearchChange,
  onFocus,
  showDropdown,
  filteredBandas,
  onSelectBanda,
  error,
  disabled = false,
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={showDropdown ? searchText : value}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
          disabled={disabled}
        />

        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredBandas.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                Nenhuma banda encontrada
              </div>
            ) : (
              filteredBandas.map((banda) => (
                <button
                  key={banda.id}
                  type="button"
                  onClick={() => onSelectBanda(banda)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {banda.nome}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

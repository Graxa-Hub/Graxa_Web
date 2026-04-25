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
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
        {label}
        {required && <span className="text-[var(--accent)]">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={showDropdown ? searchText : value}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          className="w-full form-input focus:outline-none  focus:ring-0 shadow-[var(--shadow-soft)]"
          disabled={disabled}
        />

        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-sm)] shadow-[var(--shadow-soft)] max-h-40 overflow-y-auto">
            {filteredBandas.length === 0 ? (
              <div className="px-3 py-2 text-[var(--text-muted)] text-sm">
                Nenhuma banda encontrada
              </div>
            ) : (
              filteredBandas.map((banda) => (
                <button
                  key={banda.id}
                  type="button"
                  onClick={() => onSelectBanda(banda)}
                  className="w-full text-left px-3 py-2 hover:bg-[var(--surface-hover)] focus:bg-[var(--surface-hover)] focus:outline-none"
                >
                  {banda.nome}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-[var(--accent)] text-sm mt-1">{error}</p>}
    </div>
  );
}

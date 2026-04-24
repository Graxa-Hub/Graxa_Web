import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Pagination } from "./Pagination";

const ITEMS_PER_PAGE = 5;

export const BandaDropdown = ({ bandas = [], selectedBand, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Filtrar bandas
  const bandasFiltradas = bandas.filter((banda) =>
    banda.nome.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Paginação
  const pageCount = Math.ceil(bandasFiltradas.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const bandasPaginadas = bandasFiltradas.slice(start, end);

  const pagination = {
    pageNumber: page,
    totalPages: pageCount,
    first: page === 0,
    last: page === pageCount - 1 || pageCount === 0,
  };

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="surface-card w-full min-h-[72px] flex items-center justify-between px-4 py-3 hover:border-[var(--border-hover)] transition-all"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] font-semibold flex-shrink-0">
            {selectedBand?.imagemUrl ? (
              <img
                src={selectedBand.imagemUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : selectedBand ? (
              selectedBand.nome?.charAt(0)?.toUpperCase()
            ) : (
              "∗"
            )}
          </div>
          <div className="min-w-0 text-left">
            <div className="font-semibold text-[var(--text-primary)] text-sm truncate">
              {selectedBand?.nome || "Todas as bandas"}
            </div>
            <div className="text-xs text-[var(--text-muted)] truncate">
              {selectedBand ? "Banda selecionada" : "Ver todas as turnes"}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ml-3 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 surface-card w-full z-50 overflow-hidden shadow-lg rounded-[var(--radius-sm)] border border-[var(--border)]">
          {/* Search input */}
          <div className="p-2 border-b border-[var(--border)]">
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-3 text-[var(--text-muted)]"
              />
              <input
                type="text"
                autoFocus
                placeholder="Buscar banda..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setPage(0);
                }}
                className="form-input pl-9 py-1.5 text-sm w-full"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchText("");
                    setPage(0);
                  }}
                  className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Lista de bandas */}
          <div className="max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
                setSearchText("");
                setPage(0);
              }}
              className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors border-b border-[var(--border)]"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--text-muted)] font-semibold flex-shrink-0">
                ∗
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[var(--text-primary)] text-sm truncate">
                  Todas as bandas
                </div>
                <div className="text-xs text-[var(--text-muted)] truncate">
                  Ver todas as turnes
                </div>
              </div>
            </button>

            {bandasFiltradas.length > 0 ? (
              bandasPaginadas.map((banda) => (
                <button
                  key={banda.id}
                  type="button"
                  onClick={() => {
                    onSelect(banda);
                    setIsOpen(false);
                    setSearchText("");
                    setPage(0);
                  }}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors ${
                    selectedBand?.id === banda.id
                      ? "bg-blue-50 border-l-2 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] font-semibold flex-shrink-0">
                    {banda.imagemUrl ? (
                      <img
                        src={banda.imagemUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      banda.nome?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div className="font-medium text-[var(--text-primary)] text-sm truncate">
                    {banda.nome}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-sm text-[var(--text-muted)] text-center">
                Nenhuma banda encontrada
              </div>
            )}
          </div>

          {/* Paginação */}
          {pageCount > 1 && (
            <div className="flex items-center justify-center p-2 border-t border-[var(--border)] bg-[var(--surface-hover)]">
              <Pagination
                pagination={pagination}
                onNextPage={() => setPage((p) => p + 1)}
                onPrevPage={() => setPage((p) => p - 1)}
                onGoToPage={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BandaDropdown;

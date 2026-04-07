import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const BandaDropdown = ({ bandas = [], selectedBand, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
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
        <div className="absolute top-[calc(100%+8px)] left-0 surface-card w-full z-50 overflow-hidden py-1 shadow-lg rounded-[var(--radius-sm)]">
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors"
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
          {bandas.map((banda) => (
            <button
              key={banda.id}
              type="button"
              onClick={() => {
                onSelect(banda);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors"
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
          ))}
        </div>
      )}
    </div>
  );
};
export default BandaDropdown;

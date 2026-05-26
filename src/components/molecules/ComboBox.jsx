import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const ComboBox = ({
  label,
  value,
  onChange,
  options = [],
  error,
  placeholder = "Selecione...",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = options.find((o) => o.value === value);
  return (
    <div className="relative w-full" ref={ref}>
      {label && (
        <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
          {label}
          {required && <span className="text-[var(--accent)] ml-1">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`form-input flex items-center justify-between cursor-pointer ${error ? "border-[var(--accent)]" : ""}`}
      >
        <span
          className={
            selected
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-placeholder)]"
          }
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {error && <p className="text-[var(--accent)] text-xs mt-1">{error}</p>}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 surface-card overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="form-input text-sm py-1.5"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-[var(--text-muted)] text-center">
                Nenhum resultado
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)] transition-colors ${opt.value === value ? "text-[var(--text-primary)] font-medium bg-[var(--surface-hover)]" : "text-[var(--text-secondary)]"}`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ComboBox;

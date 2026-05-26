import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const DropdownGenerico = ({
  selected,
  options = [],
  onSelect,
  allLabel = "Todos",
  allSubLabel = "",
  placeholder = "Selecione...",
  renderAvatar,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = search
    ? options.filter((o) =>
        (o.nome || o.label || "").toLowerCase().includes(search.toLowerCase()),
      )
    : options;
  const selectedItem = options.find(
    (o) => o.id === selected || o.value === selected,
  );
  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="surface-card w-full flex items-center justify-between px-4 py-3 hover:border-[var(--border-hover)] transition-all"
      >
        <div className="flex items-center gap-3">
          {renderAvatar ? (
            renderAvatar(selectedItem)
          ) : (
            <div className="w-9 h-9 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] overflow-hidden flex items-center justify-center text-[var(--text-muted)] text-sm font-semibold">
              {selectedItem ? (
                selectedItem.imagemUrl ? (
                  <img
                    src={selectedItem.imagemUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (selectedItem.nome || selectedItem.label || "?").charAt(0)
                )
              ) : (
                "?"
              )}
            </div>
          )}
          <div>
            <div className="font-semibold text-[var(--text-primary)] text-sm">
              {selectedItem
                ? selectedItem.nome || selectedItem.label
                : allLabel}
            </div>
            {allSubLabel && !selectedItem && (
              <div className="text-xs text-[var(--text-muted)]">
                {allSubLabel}
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 surface-card w-full z-50 overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="form-input text-sm py-1.5"
            />
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
                setSearch("");
              }}
              className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--text-muted)] text-xs font-semibold">
                ∗
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)] text-sm">
                  {allLabel}
                </div>
                {allSubLabel && (
                  <div className="text-xs text-[var(--text-muted)]">
                    {allSubLabel}
                  </div>
                )}
              </div>
            </button>
            {filtered.length === 0 ? (
              <div className="px-4 py-2 text-sm text-[var(--text-muted)]">
                Nenhum resultado
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id || item.value}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] text-xs font-semibold flex-shrink-0">
                    {item.imagemUrl ? (
                      <img
                        src={item.imagemUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (item.nome || item.label || "?").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--text-primary)] text-sm truncate">
                      {item.nome || item.label}
                    </div>
                    {item.sub && (
                      <div className="text-xs text-[var(--text-muted)] truncate">
                        {item.sub}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default DropdownGenerico;

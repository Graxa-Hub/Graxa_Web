import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const GENEROS = [
    { value: "ROCK", label: "Rock" }, { value: "POP", label: "Pop" },
    { value: "MPB", label: "MPB" }, { value: "SERTANEJO", label: "Sertanejo" },
    { value: "FORRO", label: "Forró" }, { value: "PAGODE", label: "Pagode" },
    { value: "SAMBA", label: "Samba" }, { value: "FUNK", label: "Funk" },
    { value: "RAP", label: "Rap / Hip-Hop" }, { value: "ELETRONICA", label: "Eletrônica" },
    { value: "JAZZ", label: "Jazz" }, { value: "BLUES", label: "Blues" },
    { value: "GOSPEL", label: "Gospel" }, { value: "CLASSICA", label: "Clássica" },
    { value: "OUTROS", label: "Outros" },
];

export const GeneroCombobox = ({ value, onChange, error, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    const filtered = search ? GENEROS.filter(g => g.label.toLowerCase().includes(search.toLowerCase())) : GENEROS;
    const selected = GENEROS.find(g => g.value === value);
    return (
        <div className="relative w-full" ref={ref}>
            <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
                Gênero Musical{required && <span className="text-[var(--accent)] ml-1">*</span>}
            </label>
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className={`form-input flex items-center justify-between cursor-pointer ${error ? "border-[var(--accent)]" : ""}`}>
                <span className={selected ? "text-[var(--text-primary)]" : "text-[var(--text-placeholder)]"}>
                    {selected ? selected.label : "Selecione o gênero"}
                </span>
                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {error && <p className="text-[var(--accent)] text-xs mt-1">{error}</p>}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 surface-card overflow-hidden">
                    <div className="p-2 border-b border-[var(--border)]">
                        <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar gênero..." className="form-input text-sm py-1.5" />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                        {filtered.length === 0
                            ? <div className="px-3 py-4 text-sm text-[var(--text-muted)] text-center">Nenhum resultado</div>
                            : filtered.map(g => (
                                <button key={g.value} type="button"
                                    onClick={() => { onChange(g.value); setIsOpen(false); setSearch(""); }}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)] transition-colors ${g.value === value ? "text-[var(--text-primary)] font-medium bg-[var(--surface-hover)]" : "text-[var(--text-secondary)]"}`}>
                                    {g.label}
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};
export default GeneroCombobox;

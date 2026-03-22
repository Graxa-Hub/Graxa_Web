import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const BandaDropdown = ({ bandas = [], selectedBand, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    return (
        <div className="relative w-full" ref={ref}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="surface-card w-full flex items-center justify-between px-4 py-3 hover:border-[var(--border-hover)] transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] font-semibold">
                        {selectedBand?.imagemUrl ? <img src={selectedBand.imagemUrl} alt="" className="w-full h-full object-cover" /> : (selectedBand ? selectedBand.nome?.charAt(0)?.toUpperCase() : "∗")}
                    </div>
                    <div>
                        <div className="font-semibold text-[var(--text-primary)] text-sm">{selectedBand?.nome || "Todas as bandas"}</div>
                        <div className="text-xs text-[var(--text-muted)]">{selectedBand ? "Banda selecionada" : "Ver todas as turnês"}</div>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 surface-card w-full z-50 overflow-hidden py-1">
                    <button type="button" onClick={() => { onSelect(null); setIsOpen(false); }} className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--text-muted)] font-semibold">∗</div>
                        <div>
                            <div className="font-semibold text-[var(--text-primary)] text-sm">Todas as bandas</div>
                            <div className="text-xs text-[var(--text-muted)]">Ver todas as turnês</div>
                        </div>
                    </button>
                    {bandas.map(banda => (
                        <button key={banda.id} type="button" onClick={() => { onSelect(banda); setIsOpen(false); }} className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-[var(--surface-hover)] transition-colors">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] font-semibold">
                                {banda.imagemUrl ? <img src={banda.imagemUrl} alt="" className="w-full h-full object-cover" /> : banda.nome?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="font-medium text-[var(--text-primary)] text-sm">{banda.nome}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
export default BandaDropdown;

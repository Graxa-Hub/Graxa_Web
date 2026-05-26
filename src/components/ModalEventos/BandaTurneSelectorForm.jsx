import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { bandaService } from "../../services/bandaService";
import {
  buscarTurnesPorBanda,
  getTurnesPaginadasPorBanda,
} from "../../services/turneService";

const ITEMS_PER_PAGE = 5;
const DEBOUNCE_DELAY = 200;

export const BandaTurneSelectorForm = ({
  bandas = [],
  turnes = [],
  selectedBandaId = "",
  selectedTurneId = "",
  onBandaChange,
  onTurneChange,
  bandaError,
  turneError,
  clearBandaError,
  clearTurneError,
  turneRequired = false,
}) => {
  // Banda search state
  const [bandaSearchOpen, setBandaSearchOpen] = useState(false);
  const [bandaSearchText, setBandaSearchText] = useState("");
  const [bandasBuscadas, setBandasBuscadas] = useState(bandas);
  const [bandaPage, setBandaPage] = useState(0);
  const [loadingBandas, setLoadingBandas] = useState(false);

  // Turne state (paginados quando banda selected)
  const [turneSearchText, setTurneSearchText] = useState("");
  const [turnesPageBanda, setTurnesPageBanda] = useState({
    content: [],
    totalPages: 0,
    pageNumber: 0,
  });
  const [turnePageBanda, setTurnePageBanda] = useState(0);
  const [loadingTurnes, setLoadingTurnes] = useState(false);
  const [turneSearchOpen, setTurneSearchOpen] = useState(false);

  const bandaInputRef = useRef(null);
  const turneInputRef = useRef(null);
  const containerRef = useRef(null);

  // Memoizar busca de banda selecionada para evitar recálculos desnecessários
  const selectedBanda = useMemo(() => {
    const bandaId = String(selectedBandaId).trim();
    if (!bandaId) return null;
    return bandasBuscadas.find((b) => String(b.id) === bandaId);
  }, [selectedBandaId, bandasBuscadas]);

  // Memoizar busca de turnê selecionada
  const selectedTurne = useMemo(() => {
    const turneId = String(selectedTurneId).trim();
    if (!turneId) return null;
    return turnesPageBanda.content?.find((t) => String(t.id) === turneId);
  }, [selectedTurneId, turnesPageBanda.content]);

  // Fechar dropdowns ao clicar fora com verificação mais robusta
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current) return;

      // Verificar se o clique foi dentro do container (mais robusto)
      const isClickInside = containerRef.current.contains(event.target);

      if (!isClickInside) {
        setBandaSearchOpen(false);
        setTurneSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sincronizar bandas com o array recebido via props
  useEffect(() => {
    if (!bandaSearchText.trim() && bandas && bandas.length > 0) {
      setBandasBuscadas(bandas);
    }
  }, [bandas, bandaSearchText]);

  // Buscar bandas quando texto muda
  useEffect(() => {
    const buscarBandas = async () => {
      setLoadingBandas(true);
      try {
        const resultado = bandaSearchText
          ? await bandaService.buscarBandas(bandaSearchText)
          : bandas;
        setBandasBuscadas(Array.isArray(resultado) ? resultado : []);
        setBandaPage(0);
      } catch (error) {
        console.error("Erro ao buscar bandas:", error);
        setBandasBuscadas(bandaSearchText ? [] : bandas);
      } finally {
        setLoadingBandas(false);
      }
    };

    const timer = setTimeout(buscarBandas, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [bandaSearchText, bandas]);

  // Carregar turnês quando banda é selecionada
  useEffect(() => {
    const carregarTurnesDaBanda = async () => {
      if (selectedBandaId) {
        setLoadingTurnes(true);
        try {
          const resultado = await getTurnesPaginadasPorBanda(
            selectedBandaId,
            0,
            ITEMS_PER_PAGE,
          );
          setTurnesPageBanda(resultado);
          setTurnePageBanda(0);
        } catch (error) {
          console.error("Erro ao carregar turnês da banda:", error);
          setTurnesPageBanda({ content: [], totalPages: 0, pageNumber: 0 });
        } finally {
          setLoadingTurnes(false);
        }
      }
    };

    carregarTurnesDaBanda();
  }, [selectedBandaId]);

  const handleBandaSelect = (banda) => {
    onBandaChange(String(banda.id));
    setBandaSearchOpen(false);
    setBandaSearchText("");
    onTurneChange("");
    if (clearBandaError) clearBandaError();
  };

  const handleTurneSelect = (turne) => {
    onTurneChange(String(turne.id));
    setTurneSearchOpen(false);
    if (clearTurneError) clearTurneError();
  };

  const nextPageTurnes = useCallback(async () => {
    if (selectedBandaId && turnePageBanda < turnesPageBanda.totalPages - 1) {
      setLoadingTurnes(true);
      try {
        const resultado = await getTurnesPaginadasPorBanda(
          selectedBandaId,
          turnePageBanda + 1,
          ITEMS_PER_PAGE,
        );
        setTurnesPageBanda(resultado);
        setTurnePageBanda(turnePageBanda + 1);
      } catch (error) {
        console.error("Erro ao paginar turnês:", error);
      } finally {
        setLoadingTurnes(false);
      }
    }
  }, [selectedBandaId, turnePageBanda, turnesPageBanda.totalPages]);

  const prevPageTurnes = useCallback(async () => {
    if (selectedBandaId && turnePageBanda > 0) {
      setLoadingTurnes(true);
      try {
        const resultado = await getTurnesPaginadasPorBanda(
          selectedBandaId,
          turnePageBanda - 1,
          ITEMS_PER_PAGE,
        );
        setTurnesPageBanda(resultado);
        setTurnePageBanda(turnePageBanda - 1);
      } catch (error) {
        console.error("Erro ao paginar turnês:", error);
      } finally {
        setLoadingTurnes(false);
      }
    }
  }, [selectedBandaId, turnePageBanda]);

  // Paginação de bandas
  const bandaPageCount = Math.ceil(bandasBuscadas.length / ITEMS_PER_PAGE);
  const bandaStart = bandaPage * ITEMS_PER_PAGE;
  const bandaEnd = bandaStart + ITEMS_PER_PAGE;
  const bandasPaginadas = bandasBuscadas.slice(bandaStart, bandaEnd);

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* BANDA FIELD */}
      <div className="relative">
        <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
          Banda do Show <span className="text-[var(--accent)]">*</span>
        </label>

        {selectedBanda && (
          <div className="mb-2 p-3 surface-card flex justify-between items-center">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {selectedBanda.nome}
            </span>
            <button
              type="button"
              onClick={() => {
                onBandaChange("");
                onTurneChange("");
              }}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <Search size={16} />
          </div>
          <input
            ref={bandaInputRef}
            type="text"
            placeholder="Pesquisar banda..."
            value={bandaSearchText}
            onChange={(e) => setBandaSearchText(e.target.value)}
            onFocus={() => setBandaSearchOpen(true)}
            className={`w-full pl-10 pr-3 py-2 border rounded-[var(--radius-md)] ${
              bandaError ? "border-[var(--accent)]" : "border-[var(--border)]"
            }`}
          />
          {bandaSearchText && (
            <button
              type="button"
              onClick={() => setBandaSearchText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {bandaError && (
          <p className="text-[var(--accent)] text-xs mt-1">{bandaError}</p>
        )}

        {/* Banda Dropdown */}
        {bandaSearchOpen && (
          <div className="absolute z-50 w-full mt-1 surface-card max-h-60 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)]">
            {loadingBandas ? (
              <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                Buscando...
              </div>
            ) : bandasPaginadas.length > 0 ? (
              <>
                {bandasPaginadas.map((banda) => (
                  <button
                    key={banda.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBandaSelect(banda);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[var(--surface-hover)] border-b border-[var(--border)] last:border-0 transition-colors"
                  >
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {banda.nome}
                    </p>
                  </button>
                ))}

                {/* Pagination controls for bandas */}
                {bandaPageCount > 1 && (
                  <div className="flex items-center justify-center gap-2 p-2 border-t border-[var(--border)] bg-[var(--surface-hover)]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBandaPage((p) => Math.max(0, p - 1));
                      }}
                      disabled={bandaPage === 0}
                      className="p-1 hover:bg-[var(--surface)] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs text-[var(--text-muted)]">
                      {bandaPage + 1}/{bandaPageCount}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBandaPage((p) =>
                          Math.min(bandaPageCount - 1, p + 1),
                        );
                      }}
                      disabled={bandaPage === bandaPageCount - 1}
                      className="p-1 hover:bg-[var(--surface)] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
                Nenhuma banda encontrada
              </div>
            )}
          </div>
        )}
      </div>

      {/* TURNE FIELD (Always visible, but disabled if no banda is selected) */}
      <div className="relative">
        <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
          {turneRequired ? "Turnê *" : "Turnê"}
        </label>

        {!selectedBandaId ? (
          <div className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface-hover)] text-left cursor-not-allowed opacity-60">
            <span className="text-sm text-[var(--text-muted)]">
              Selecione uma banda primeiro...
            </span>
          </div>
        ) : (
          <>
            {selectedTurne && (
              <div className="mb-2 p-3 surface-card flex justify-between items-center">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {selectedTurne.name || selectedTurne.nomeTurne}
                </span>
                <button
                  type="button"
                  onClick={() => onTurneChange("")}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setTurneSearchOpen(!turneSearchOpen)}
              className={`w-full px-3 py-2 border rounded-[var(--radius-md)] text-left flex items-center justify-between ${
                turneError ? "border-[var(--accent)]" : "border-[var(--border)]"
              }`}
            >
              <span className="text-sm text-[var(--text-muted)]">
                {selectedTurne
                  ? selectedTurne.name || selectedTurne.nomeTurne
                  : "Selecionar turnê..."}
              </span>
              <ChevronLeft
                size={16}
                className={`transition-transform ${
                  turneSearchOpen ? "rotate-90" : "-rotate-90"
                }`}
              />
            </button>

            {turneError && (
              <p className="text-[var(--accent)] text-xs mt-1">{turneError}</p>
            )}

            {/* Turne Dropdown */}
            {turneSearchOpen && (
              <div className="absolute z-50 w-full mt-1 surface-card max-h-60 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)]">
                {loadingTurnes ? (
                  <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                    Buscando...
                  </div>
                ) : turnesPageBanda.content &&
                  turnesPageBanda.content.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTurneChange("");
                        setTurneSearchOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-[var(--surface-hover)] border-b border-[var(--border)] transition-colors"
                    >
                      <p className="text-sm text-[var(--text-muted)]">
                        Sem turnê
                      </p>
                    </button>

                    {turnesPageBanda.content.map((turne) => (
                      <button
                        key={turne.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTurneSelect(turne);
                        }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-[var(--surface-hover)] border-b border-[var(--border)] last:border-0 transition-colors ${
                          String(selectedTurneId) === String(turne.id)
                            ? "bg-[var(--surface-hover)]"
                            : ""
                        }`}
                      >
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {turne.name || turne.nomeTurne}
                        </p>
                      </button>
                    ))}

                    {/* Discrete pagination controls */}
                    {turnesPageBanda.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1 p-2 border-t border-[var(--border)] bg-[var(--surface-hover)]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            prevPageTurnes();
                          }}
                          disabled={turnePageBanda === 0}
                          className="p-1 hover:bg-[var(--surface)] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Página anterior"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-xs text-[var(--text-muted)] mx-2">
                          {turnePageBanda + 1}/{turnesPageBanda.totalPages}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            nextPageTurnes();
                          }}
                          disabled={
                            turnePageBanda >= turnesPageBanda.totalPages - 1
                          }
                          className="p-1 hover:bg-[var(--surface)] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Próxima página"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    Nenhuma turnê encontrada para esta banda
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

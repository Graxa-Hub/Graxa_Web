import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { Pagination } from "../molecules/Pagination";
import { bandaService } from "../../services/bandaService";
import { getTurnes, buscarTurnes, buscarTurnesPorBanda, getTurnesPaginadasPorBanda } from "../../services/turneService";

const ITEMS_PER_PAGE = 5;

export const BandaTurneSelector = ({
  open,
  bandas = [],
  turnes = [],
  bandaSelecionada,
  turneSelecionada,
  onOpenArtist,
  onOpenTour,
  onBandaSelect,
  onTurneSelect,
  showBandaSelector = true,
  showTurneSelector = true,
}) => {
  const [bandaSearchText, setBandaSearchText] = useState("");
  const [turneSearchText, setTurneSearchText] = useState("");
  const [bandaPage, setBandaPage] = useState(0);
  const [turnePage, setTurnePage] = useState(0);
  const [turnePageBanda, setTurnePageBanda] = useState(0);
  const [bandasBuscadas, setBandasBuscadas] = useState(bandas);
  const [turnesBuscadas, setTurnesBuscadas] = useState([]);
  const [turnesPageBanda, setTurnesPageBanda] = useState({
    content: [],
    totalPages: 0,
    pageNumber: 0,
  });
  const [loadingBandas, setLoadingBandas] = useState(false);
  const [loadingTurnes, setLoadingTurnes] = useState(false);
  const bandasIniciaisRef = useRef(false);

  // Carregar bandas apenas na primeira montagem se vazio
  useEffect(() => {
    if (!bandasIniciaisRef.current && bandas.length > 0) {
      setBandasBuscadas(bandas);
      bandasIniciaisRef.current = true;
    }
  }, [bandas.length]);

  // Carregar turnês gerais ao montar o componente
  useEffect(() => {
    const carregarTurnesIniciais = async () => {
      setLoadingTurnes(true);
      try {
        const resultado = await getTurnes();
        setTurnesBuscadas(resultado);
      } catch (error) {
        console.error("[BandaTurneSelector] ❌ Erro ao carregar turnês iniciais:", error);
        setTurnesBuscadas([]);
      } finally {
        setLoadingTurnes(false);
      }
    };

    if (open) {
      carregarTurnesIniciais();
    }
  }, [open]);

  // Buscar bandas quando o texto muda
  useEffect(() => {
    if (!bandaSearchText.trim() && bandasIniciaisRef.current) {
      // Se não tem texto e já carregou inicial, mostrar todas
      setBandasBuscadas(bandas);
      setBandaPage(0);
      return;
    }

    const buscarBandas = async () => {
      setLoadingBandas(true);
      try {
        const resultado = await bandaService.buscarBandas(bandaSearchText);
        setBandasBuscadas(resultado);
        setBandaPage(0);
      } catch (error) {
        console.error("[BandaTurneSelector] Erro ao buscar bandas:", error);
        setBandasBuscadas([]);
      } finally {
        setLoadingBandas(false);
      }
    };

    // Usar 200ms de debounce para não fazer muitas requisições
    const timer = setTimeout(() => {
      if (bandaSearchText.trim()) {
        buscarBandas();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [bandaSearchText]);

  // Carregar turnês da banda quando bandaSelecionada muda
  useEffect(() => {
    const carregarTurnesDaBanda = async () => {
      if (bandaSelecionada?.id) {
        setLoadingTurnes(true);
        try {
          const resultado = await getTurnesPaginadasPorBanda(bandaSelecionada.id, 0, 5);
          setTurnesPageBanda(resultado);
          setTurnePageBanda(0);
        } catch (error) {
          console.error("[BandaTurneSelector] Erro ao carregar turnês da banda:", error);
          setTurnesPageBanda({ content: [], totalPages: 0, pageNumber: 0 });
        } finally {
          setLoadingTurnes(false);
        }
      }
    };

    carregarTurnesDaBanda();
  }, [bandaSelecionada?.id]);

  // Navegar páginas de turnês da banda
  const nextPageTurnesBanda = useCallback(async () => {
    if (bandaSelecionada?.id && turnePageBanda < turnesPageBanda.totalPages - 1) {
      setLoadingTurnes(true);
      try {
        const resultado = await getTurnesPaginadasPorBanda(bandaSelecionada.id, turnePageBanda + 1, 5);
        setTurnesPageBanda(resultado);
        setTurnePageBanda(turnePageBanda + 1);
      } catch (error) {
        console.error("[BandaTurneSelector] Erro ao paginar turnês da banda:", error);
      } finally {
        setLoadingTurnes(false);
      }
    }
  }, [bandaSelecionada?.id, turnePageBanda, turnesPageBanda.totalPages]);

  const prevPageTurnesBanda = useCallback(async () => {
    if (bandaSelecionada?.id && turnePageBanda > 0) {
      setLoadingTurnes(true);
      try {
        const resultado = await getTurnesPaginadasPorBanda(bandaSelecionada.id, turnePageBanda - 1, 5);
        setTurnesPageBanda(resultado);
        setTurnePageBanda(turnePageBanda - 1);
      } catch (error) {
        console.error("[BandaTurneSelector] Erro ao paginar turnês da banda:", error);
      } finally {
        setLoadingTurnes(false);
      }
    }
  }, [bandaSelecionada?.id, turnePageBanda]);

  // Buscar turnês somente quando há texto de busca
  useEffect(() => {
    // Se não há texto de busca, não fazer nada (deixar paginação de banda cuidar)
    if (!turneSearchText.trim()) {
      return;
    }

    const buscarTurnesFunc = async () => {
      setLoadingTurnes(true);
      try {
        let resultado;
        // Se tem banda selecionada E texto de busca, busca turnês daquela banda especificamente
        if (bandaSelecionada?.id && turneSearchText.trim()) {
          resultado = await buscarTurnesPorBanda(bandaSelecionada.id, turneSearchText);
        } else if (turneSearchText.trim()) {
          // Se tem texto de busca e SEM banda selecionada, busca no geral
          resultado = await buscarTurnes(turneSearchText);
        }

        setTurnesBuscadas(resultado || []);
        setTurnePage(0);
      } catch (error) {
        console.error("[BandaTurneSelector] Erro ao buscar turnês:", error);
        setTurnesBuscadas([]);
      } finally {
        setLoadingTurnes(false);
      }
    };

    // Usar 200ms de debounce para não fazer muitas requisições
    const timer = setTimeout(() => {
      buscarTurnesFunc();
    }, 200);

    return () => clearTimeout(timer);
  }, [turneSearchText, bandaSelecionada?.id]);

  // Usar bandas buscadas (sempre do endpoint)
  const bandasFiltradas = bandasBuscadas;

  // Usar turnês buscadas (sempre do endpoint)
  const turnesFiltradas = turnesBuscadas;

  if (!open) return null;

  // Paginação bandas
  const bandaPageCount = Math.ceil(bandasFiltradas.length / ITEMS_PER_PAGE);
  const bandaStart = bandaPage * ITEMS_PER_PAGE;
  const bandaEnd = bandaStart + ITEMS_PER_PAGE;
  const bandasPaginadas = bandasFiltradas.slice(bandaStart, bandaEnd);

  // Paginação turnês: quando tem banda selecionada e SEM busca, usar paginação do backend
  // Caso contrário, paginar localmente os resultados buscados
  const usarPaginacaoBanda = bandaSelecionada?.id && !turneSearchText.trim();

  let turnesPaginadas = [];
  let turnePageCount = 0;
  let turnePaginationObj = null;

  if (usarPaginacaoBanda) {
    // Usar dados paginados da banda (backend pagination)
    turnesPaginadas = turnesPageBanda.content || [];
    turnePageCount = turnesPageBanda.totalPages || 0;
    turnePaginationObj = {
      pageNumber: turnePageBanda.pageNumber || 0,
      totalPages: turnePageCount,
      first: (turnePageBanda.pageNumber || 0) === 0,
      last: (turnePageBanda.pageNumber || 0) === turnePageCount - 1 || turnePageCount === 0,
    };
  } else {
    // Paginar localmente os turnês filtrados (search results or all)
    turnePageCount = Math.ceil(turnesFiltradas.length / ITEMS_PER_PAGE);
    const turneStart = turnePage * ITEMS_PER_PAGE;
    const turneEnd = turneStart + ITEMS_PER_PAGE;
    turnesPaginadas = turnesFiltradas.slice(turneStart, turneEnd);
    turnePaginationObj = {
      pageNumber: turnePage,
      totalPages: turnePageCount,
      first: turnePage === 0,
      last: turnePage === turnePageCount - 1 || turnePageCount === 0,
    };
  }

  const bandaPagination = {
    pageNumber: bandaPage,
    totalPages: bandaPageCount,
    first: bandaPage === 0,
    last: bandaPage === bandaPageCount - 1 || bandaPageCount === 0,
  };

  const turnePagination = turnePaginationObj;

  return (
    <div 
      className={`absolute top-full left-0 mt-2 z-50 shadow-[var(--shadow-card)] rounded-lg border border-[var(--border)] max-h-[85vh] overflow-y-auto md:overflow-visible surface-card ${
        showBandaSelector && showTurneSelector 
          ? "w-[95vw] sm:w-[450px] md:w-[600px] lg:w-[700px]" 
          : "w-[95vw] sm:w-[350px]"
      } max-w-[95vw]`} 
      role="menu"
    >
      <div className="w-full flex flex-col md:flex-row">
          {/* ===== BANDAS ===== */}
          {showBandaSelector && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  🎸 Bandas
                </span>
                <button
                  onClick={onOpenArtist}
                  className="text-xs text-[var(--accent)] hover:text-[var(--text-primary)] font-medium transition-colors"
                >
                  + Gerenciar
                </button>
              </div>

              {/* Search input */}
              <div className="p-2 border-b border-[var(--border)]">
                <div className="relative flex items-center">
                  {/* <Search
                    size={14}
                    className="absolute left-3 text-[var(--text-muted)]"
                  /> */}
                  <input
                    type="text"
                    placeholder="Buscar banda..."
                    value={bandaSearchText}
                    onChange={(e) => {
                      setBandaSearchText(e.target.value);
                      setBandaPage(0);
                    }}
                    className="form-input p py-1.5 text-sm w-full"
                  />
                  {bandaSearchText && (
                    <button
                      type="button"
                      onClick={() => {
                        setBandaSearchText("");
                        setBandaPage(0);
                      }}
                      className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Lista bandas */}
              <div className="max-h-64 overflow-y-auto">
                {loadingBandas ? (
                  <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                    Buscando...
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onBandaSelect && onBandaSelect(null);
                        setTurnePage(0);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors border-l-2 ${bandaSelecionada === null
                        ? "bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--accent)] font-medium"
                        : "text-[var(--text-secondary)] border-transparent"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {bandaSelecionada === null && (
                          <span className="text-[var(--accent)]">✓</span>
                        )}
                        <span>🎵 Todas as Bandas</span>
                      </div>
                    </button>
                    {bandasFiltradas.length > 0 ? (
                      bandasPaginadas.map((banda) => (
                        <button
                          key={banda.id}
                          onClick={() => {
                            onBandaSelect && onBandaSelect(banda);
                            setTurnePage(0); // Reset turnê page ao mudar banda
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors border-l-2 ${bandaSelecionada?.id === banda.id
                            ? "bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--accent)] font-medium"
                            : "text-[var(--text-secondary)] border-transparent"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {bandaSelecionada?.id === banda.id && (
                              <span className="text-[var(--accent)]">✓</span>
                            )}
                            <span>{banda.nome}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center">
                        Nenhuma banda encontrada
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Paginação bandas */}
              {bandaPageCount > 1 && (
                <div className="flex items-center justify-center p-2 border-t border-[var(--border)] bg-[var(--surface-hover)]">
                  <Pagination
                    pagination={bandaPagination}
                    onNextPage={() => setBandaPage((p) => p + 1)}
                    onPrevPage={() => setBandaPage((p) => p - 1)}
                    onGoToPage={setBandaPage}
                  />
                </div>
              )}
            </div>
          )}

          {/* Divisória vertical / horizontal */}
          {showBandaSelector && showTurneSelector && (
            <div className="w-full h-[2px] md:w-[2px] md:h-auto bg-[var(--accent)] opacity-60 flex-shrink-0" />
          )}

          {/* ===== TURNÊS ===== */}
          {showTurneSelector && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  🎤 Turnês
                </span>
                <button
                  onClick={onOpenTour}
                  className="text-xs text-[var(--accent)] hover:text-[var(--text-primary)] font-medium transition-colors"
                >
                  + Gerenciar
                </button>
              </div>

              {/* Search input */}
              <div className="p-2 border-b border-[var(--border)]">
                <div className="relative flex items-center">
                  {/* <Search
                    size={14}
                    className="absolute left-3 text-[var(--text-muted)]"
                  /> */}
                  <input
                    type="text"
                    placeholder="Buscar turnê..."
                    value={turneSearchText}
                    onChange={(e) => {
                      setTurneSearchText(e.target.value);
                      setTurnePage(0);
                    }}
                    className="form-input py-1.5 text-sm w-full"
                style={{ paddingLeft: "2.5rem" }}
                  />
                  {turneSearchText && (
                    <button
                      type="button"
                      onClick={() => {
                        setTurneSearchText("");
                        setTurnePage(0);
                      }}
                      className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Lista turnês */}
              <div className="max-h-64 overflow-y-auto">
                {loadingTurnes ? (
                  <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                    Buscando...
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onTurneSelect && onTurneSelect(null)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors border-l-2 ${turneSelecionada === null
                        ? "bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--accent)] font-medium"
                        : "text-[var(--text-secondary)] border-transparent"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {turneSelecionada === null && (
                          <span className="text-[var(--accent)]">✓</span>
                        )}
                        <span>📋 Todas as Turnês</span>
                      </div>
                    </button>

                    {turnesPaginadas && turnesPaginadas.length > 0 ? (
                      turnesPaginadas.map((turne) => (
                        <button
                          key={turne.id}
                          onClick={() => onTurneSelect && onTurneSelect(turne)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors border-l-2 ${turneSelecionada?.id === turne.id
                            ? "bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--accent)] font-medium"
                            : "text-[var(--text-secondary)] border-transparent"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {turneSelecionada?.id === turne.id && (
                              <span className="text-[var(--accent)]">✓</span>
                            )}
                            <span>{turne.name || turne.nomeTurne}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center">
                        Nenhuma turnê encontrada
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Paginação turnês */}
              {turnePageCount > 1 && (
                <div className="flex items-center justify-center p-2 border-t border-[var(--border)] bg-[var(--surface-hover)]">
                  <Pagination
                    pagination={turnePagination}
                    onNextPage={usarPaginacaoBanda ? nextPageTurnesBanda : () => setTurnePage((p) => p + 1)}
                    onPrevPage={usarPaginacaoBanda ? prevPageTurnesBanda : () => setTurnePage((p) => p - 1)}
                    onGoToPage={usarPaginacaoBanda ? undefined : setTurnePage}
                  />
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default BandaTurneSelector;

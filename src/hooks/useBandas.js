import { useState, useCallback, useRef } from "react";
import { bandaService } from "../services/bandaService";
import { imagemService } from "../services/imagemService";

// 🎚️ MUDAR AQUI PARA ALTERAR TAMANHO DE PÁGINA PADRÃO DE BANDAS
const DEFAULT_PAGE_SIZE = 3;

// Utilitário para processar imagens — evita duplicar lógica
async function processarImagens(bandasArray, cacheRef) {
  return Promise.all(
    bandasArray.map(async (banda) => {
      if (cacheRef.current.has(banda.id)) {
        return cacheRef.current.get(banda.id);
      }

      let imagemUrl = null;
      if (banda.nomeFoto) {
        try {
          imagemUrl = await imagemService(banda.nomeFoto);
        } catch (err) {
          console.error("[useBandas] Erro ao carregar imagem:", err);
        }
      }

      const bandaComImagem = {
        ...banda,
        imagemUrl:
          imagemUrl ||
          "https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Imagem",
      };
      cacheRef.current.set(banda.id, bandaComImagem);
      return bandaComImagem;
    })
  );
}

export function useBandas() {
  const [bandas, setBandas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buscaAtiva, setBuscaAtiva] = useState(false);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });

  const jaCarregouImagens = useRef(new Set());
  const bandaCacheRef = useRef(new Map());

  // ─── Listar sem paginação ──────────────────────────────────────────────────
  const listarBandas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bandaService.listarBandas();
      const bandasArray = Array.isArray(data) ? data : [];
      const bandasComImagem = await processarImagens(bandasArray, bandaCacheRef);
      setBandas(bandasComImagem);
      return bandasComImagem;
    } catch (err) {
      setError(err.message);
      console.error("[useBandas] Erro ao listar bandas:", err);
      setBandas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Listar com paginação ──────────────────────────────────────────────────
  const listarBandasPaginadas = useCallback(
    async (page = 0, size = DEFAULT_PAGE_SIZE) => {
      setLoading(true);
      setError(null);
      setBuscaAtiva(false);
      try {
        const response = await bandaService.listarBandasPaginadas(page, size);
        const bandasComImagem = await processarImagens(response.content, bandaCacheRef);

        setPagination({
          pageNumber: response.pageable?.pageNumber ?? page,
          pageSize: response.pageable?.pageSize ?? size,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          first: response.first,
          last: response.last,
        });

        setBandas(bandasComImagem);
        return bandasComImagem;
      } catch (err) {
        setError(err.message);
        console.error("[useBandas] Erro ao listar bandas paginadas:", err);
        setBandas([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ─── Buscar por query ──────────────────────────────────────────────────────
  const buscarBandas = useCallback(async (query) => {
    // Query vazia volta para a listagem paginada normal
    if (!query?.trim()) {
      setBuscaAtiva(false);
      await listarBandasPaginadas(0, DEFAULT_PAGE_SIZE);
      return;
    }

    setLoading(true);
    setError(null);
    setBuscaAtiva(true);
    try {
      const data = await bandaService.buscarBandas(query.trim());
      const bandasArray = Array.isArray(data) ? data : [];
      const bandasComImagem = await processarImagens(bandasArray, bandaCacheRef);
      setBandas(bandasComImagem);
      return bandasComImagem;
    } catch (err) {
      setError(err.message);
      console.error("[useBandas] Erro ao buscar bandas:", err);
      setBandas([]);
    } finally {
      setLoading(false);
    }
  }, [listarBandasPaginadas]);

  // ─── Paginação ─────────────────────────────────────────────────────────────
  const nextPage = useCallback(async () => {
    if (!pagination.last && !loading) {
      await listarBandasPaginadas(pagination.pageNumber + 1, pagination.pageSize);
    }
  }, [pagination, loading, listarBandasPaginadas]);

  const prevPage = useCallback(async () => {
    if (!pagination.first && !loading) {
      await listarBandasPaginadas(pagination.pageNumber - 1, pagination.pageSize);
    }
  }, [pagination, loading, listarBandasPaginadas]);

  const goToPage = useCallback(
    async (pageNumber) => {
      if (pageNumber >= 0 && pageNumber < pagination.totalPages && !loading) {
        await listarBandasPaginadas(pageNumber, pagination.pageSize);
      }
    },
    [pagination, loading, listarBandasPaginadas]
  );

  const setPageSize = useCallback(
    async (newSize) => {
      if (newSize > 0 && newSize !== pagination.pageSize && !loading) {
        await listarBandasPaginadas(0, newSize);
      }
    },
    [pagination.pageSize, loading, listarBandasPaginadas]
  );

  // ─── CRUD ──────────────────────────────────────────────────────────────────
  const buscarBandaPorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await bandaService.buscarBandaPorId(id);
    } catch (err) {
      setError(err.message);
      console.error("[useBandas] Erro ao buscar banda:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarBanda = useCallback(async (dados, foto) => {
    setLoading(true);
    setError(null);
    try {
      const novaBanda = await bandaService.criarBanda(dados, foto);

      let imagemUrl = null;
      const nomeImagem = novaBanda.nomeFoto || novaBanda.imagem || novaBanda.fotoNome;
      if (nomeImagem) {
        try {
          imagemUrl = await imagemService(nomeImagem);
          jaCarregouImagens.current.add(novaBanda.id);
        } catch (err) {
          console.error("[useBandas] Erro ao carregar imagem da nova banda:", err);
        }
      }

      const bandaComImagem = {
        ...novaBanda,
        imagemUrl: imagemUrl || "https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Imagem",
      };

      setBandas((prev) => [...prev, bandaComImagem]);
      return bandaComImagem;
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.mensagem || err.message;
      setError(backendMessage);
      console.error("[useBandas] Erro ao criar banda:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarBanda = useCallback(async (id, dados, foto) => {
    setLoading(true);
    setError(null);
    try {
      const bandaAtualizada = await bandaService.atualizarBanda(id, dados, foto);

      let imagemUrl = null;
      const nomeImagem = bandaAtualizada.nomeFoto || bandaAtualizada.imagem || bandaAtualizada.fotoNome;
      if (nomeImagem) {
        try {
          imagemUrl = await imagemService(nomeImagem);
          jaCarregouImagens.current.add(id);
        } catch (err) {
          console.error("[useBandas] Erro ao carregar imagem da banda atualizada:", err);
        }
      }

      const bandaComImagem = {
        ...bandaAtualizada,
        imagemUrl: imagemUrl || "https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Imagem",
      };

      // Invalida cache para forçar reprocessamento
      bandaCacheRef.current.delete(id);
      setBandas((prev) => prev.map((b) => (b.id === id ? bandaComImagem : b)));
      return bandaComImagem;
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.mensagem || err.message;
      setError(backendMessage);
      console.error("[useBandas] Erro ao atualizar banda:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirBanda = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await bandaService.excluirBanda(id);
      jaCarregouImagens.current.delete(id);
      bandaCacheRef.current.delete(id);
      setBandas((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("[useBandas] Erro ao excluir banda:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarIntegrantes = useCallback(async (bandaId, artistasIds) => {
    setLoading(true);
    setError(null);
    try {
      const bandaAtualizada = await bandaService.adicionarIntegrantes(bandaId, artistasIds);
      setBandas((prev) =>
        prev.map((b) =>
          b.id === bandaId ? { ...b, integrantes: bandaAtualizada.integrantes } : b
        )
      );
      return bandaAtualizada;
    } catch (err) {
      setError(err.message);
      console.error("[useBandas] Erro ao adicionar integrantes:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bandas,
    loading,
    error,
    buscaAtiva,
    pagination,
    listarBandas,
    listarBandasPaginadas,
    buscarBandas,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    buscarBandaPorId,
    criarBanda,
    atualizarBanda,
    excluirBanda,
    adicionarIntegrantes,
  };
}
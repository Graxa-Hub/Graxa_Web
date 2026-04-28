import { useState, useCallback, useRef } from 'react';
import { getTurnes, getTurnesPaginadas, criarTurne as criarTurneService } from '../services/turneService';
import { imagemService } from '../services/imagemService';
import { adaptTurneFromBackend } from '../utils/turneAdapter';

// 🎚️ MUDAR AQUI PARA ALTERAR TAMANHO DE PÁGINA PADRÃO DE TURNÊS
const DEFAULT_PAGE_SIZE = 3;

export function useTurnes() {
  const [turnes, setTurnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });
  const jaCarregouImagens = useRef(new Set());
  const turnesCacheRef = useRef(new Map()); // ✅ Cache com Ref

  const listarTurnes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // getTurnes() já aplica o adapter, então não precisa adaptar novamente
      const turnesAdaptados = await getTurnes();
      
      setTurnes(turnesAdaptados);
      return turnesAdaptados;
    } catch (err) {
      console.error('Erro ao listar turnês:', err);
      setError(err.response?.data?.message || 'Erro ao carregar turnês');
      setTurnes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // ✅ SEM dependências

  // Listar turnês com paginação
  const listarTurnesPaginadas = useCallback(
    async (page = 0, size = DEFAULT_PAGE_SIZE) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTurnesPaginadas(page, size);
        
        // getTurnesPaginadas() já retorna dados adaptados em response.content
        const turnesAdaptados = response.content;

        setPagination({
          pageNumber: response.pageable?.pageNumber ?? page,
          pageSize: response.pageable?.pageSize ?? size,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          first: response.first,
          last: response.last,
        });

        setTurnes(turnesAdaptados);
        return turnesAdaptados;
      } catch (err) {
        setError(err.message);
        console.error('[useTurnes] Erro ao listar turnês paginadas:', err);
        setTurnes([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Navegar próxima página
  const nextPage = useCallback(async () => {
    if (!pagination.last && !loading) {
      await listarTurnesPaginadas(
        pagination.pageNumber + 1,
        pagination.pageSize
      );
    }
  }, [pagination, loading, listarTurnesPaginadas]);

  // Navegar página anterior
  const prevPage = useCallback(async () => {
    if (!pagination.first && !loading) {
      await listarTurnesPaginadas(
        pagination.pageNumber - 1,
        pagination.pageSize
      );
    }
  }, [pagination, loading, listarTurnesPaginadas]);

  // Ir para página específica
  const goToPage = useCallback(
    async (pageNumber) => {
      if (pageNumber >= 0 && pageNumber < pagination.totalPages && !loading) {
        await listarTurnesPaginadas(pageNumber, pagination.pageSize);
      }
    },
    [pagination, loading, listarTurnesPaginadas]
  );

  // Mudar tamanho de página
  const setPageSize = useCallback(
    async (newSize) => {
      if (newSize > 0 && newSize !== pagination.pageSize && !loading) {
        await listarTurnesPaginadas(0, newSize);
      }
    },
    [pagination.pageSize, loading, listarTurnesPaginadas]
  );

  const criar = useCallback(async (dados) => {
    try {
      setLoading(true);
      setError(null);
      const novaTurne = await criarTurneService(dados);
      
      // Adaptar dados da nova turnê usando o adapter
      const turneAdaptado = await adaptTurneFromBackend(novaTurne);
      
      setTurnes((prev) => [...prev, turneAdaptado]);
      return turneAdaptado;
    } catch (err) {
      console.error('Erro ao criar turnê:', err);
      setError(err.response?.data?.message || 'Erro ao criar turnê');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    turnes,
    loading,
    error,
    pagination,
    listarTurnes,
    listarTurnesPaginadas,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    criarTurne: criar,
  };
}
import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar estado de paginação
 * @param {Function} fetchFn - Função que faz a requisição com (page, size) como parâmetros
 * @param {number} initialSize - Tamanho inicial de items por página (padrão: 10)
 * @returns {Object} Estado e funções de paginação
 */
export function usePagination(fetchFn, initialSize = 10) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: initialSize,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    empty: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Função para carregar dados com paginação
  const loadPage = useCallback(
    async (pageNumber = 0, pageSize = pagination.pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchFn(pageNumber, pageSize);

        // Garantir estrutura correta de resposta paginada
        const adaptedResponse = {
          content: Array.isArray(response.content) ? response.content : [],
          pageNumber: response.pageable?.pageNumber ?? 0,
          pageSize: response.pageable?.pageSize ?? pageSize,
          totalPages: response.totalPages ?? 1,
          totalElements: response.totalElements ?? 0,
          first: response.first ?? true,
          last: response.last ?? true,
          empty: response.empty ?? true,
        };

        setData(adaptedResponse.content);
        setPagination({
          pageNumber: adaptedResponse.pageNumber,
          pageSize: adaptedResponse.pageSize,
          totalPages: adaptedResponse.totalPages,
          totalElements: adaptedResponse.totalElements,
          first: adaptedResponse.first,
          last: adaptedResponse.last,
          empty: adaptedResponse.empty,
        });

        return adaptedResponse;
      } catch (err) {
        console.error('[usePagination] Erro ao carregar página:', err);
        setError(err.message);
        setData([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize]
  );

  // ✅ Ir para próxima página
  const nextPage = useCallback(() => {
    if (!pagination.last && !loading) {
      loadPage(pagination.pageNumber + 1, pagination.pageSize);
    }
  }, [pagination, loading, loadPage]);

  // ✅ Ir para página anterior
  const prevPage = useCallback(() => {
    if (!pagination.first && !loading) {
      loadPage(pagination.pageNumber - 1, pagination.pageSize);
    }
  }, [pagination, loading, loadPage]);

  // ✅ Ir para página específica
  const goToPage = useCallback(
    (pageNumber) => {
      if (pageNumber >= 0 && pageNumber < pagination.totalPages && !loading) {
        loadPage(pageNumber, pagination.pageSize);
      }
    },
    [pagination, loading, loadPage]
  );

  // ✅ Mudar tamanho da página
  const setPageSize = useCallback(
    (newSize) => {
      if (newSize > 0 && newSize !== pagination.pageSize) {
        loadPage(0, newSize); // Reset para primeira página ao mudar size
      }
    },
    [pagination.pageSize, loadPage]
  );

  return {
    data,
    loading,
    error,
    pagination,
    loadPage,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  };
}

import { api } from "./axios";

function buildBandaFormData(dados, foto) {
  const formData = new FormData();

  // Backend espera @RequestPart("dados") com JSON
  const dadosBlob = new Blob([JSON.stringify(dados)], {
    type: "application/json",
  });
  formData.append("dados", dadosBlob);

  // Enviar foto no part "foto" (opcional)
  if (foto) {
    formData.append("foto", foto);
  }

  return formData;
}

export const bandaService = {
  // Listar todas as bandas (sem paginação - backward compatibility)
  async listarBandas() {
    try {
      console.log("[bandaService] 🔄 Iniciando requisição GET /bandas");
      const response = await api.get("/bandas");
      console.log("[bandaService] ✅ Resposta recebida:", response.data);
      // Handle both array and paginated object responses
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.content) {
        return response.data.content;
      } else {
        return [];
      }
    } catch (error) {
      // Se o erro for "Não há bandas salvas", retorna lista vazia ao invés de erro
      const errorMessage =
        error.response?.data?.message || error.response?.data?.mensagem || "";
      if (
        error.response?.status === 500 &&
        errorMessage.includes("Não há bandas salvas")
      ) {
        console.warn(
          "[bandaService] Nenhuma banda encontrada, retornando lista vazia",
        );
        return [];
      }

      console.error("[bandaService] Erro ao listar bandas:", {
        status: error.response?.status,
        message: errorMessage,
      });
      throw error;
    }
  },

  // Listar bandas com paginação
  async listarBandasPaginadas(page = 0, size = 10) {
    try {
      const response = await api.get("/bandas", {
        params: { page, size },
      });
      
      // Retornar resposta paginada com estrutura normalizada
      return {
        content: Array.isArray(response.data.content) ? response.data.content : [],
        pageable: response.data.pageable || { pageNumber: page, pageSize: size },
        totalPages: response.data.totalPages || 1,
        totalElements: response.data.totalElements || 0,
        first: response.data.first ?? true,
        last: response.data.last ?? false,
        empty: response.data.empty ?? true,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.mensagem || "";
      
      console.error("[bandaService] Erro ao listar bandas com paginação:", {
        status: error.response?.status,
        message: errorMessage,
      });
      throw error;
    }
  },

  // Buscar bandas por nome/query
  async buscarBandas(query) {
    try {
      const response = await api.get("/bandas/buscar", {
        params: { nome: query },
      });
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.content) {
        return response.data.content;
      } else {
        return [];
      }
    } catch (error) {
      console.error("[bandaService] Erro ao buscar bandas:", {
        status: error.response?.status,
        message: error.response?.data?.mensagem || error.message,
      });
      // Se erro, retorna array vazio ao invés de quebrar
      return [];
    }
  },

  // Buscar banda por ID
  async buscarBandaPorId(id) {
    const response = await api.get(`/bandas/${id}`);
    return response.data;
  },

  // Criar banda (com foto opcional)
  async criarBanda(dados, foto) {
    try {
      const formData = buildBandaFormData(dados, foto);

      // Let the browser / axios set the Content-Type (includes the boundary)
      const response = await api.post("/bandas", formData);
      return response.data;
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.mensagem ||
        error.response?.data?.error ||
        error.message;
      
      // Para logging melhor do erro
      const fullError = error.response?.data || error;
      
      console.error("[bandaService] Erro ao criar banda:", {
        status: error.response?.status,
        message: serverMessage,
        fullData: fullError,
      });
      throw error;
    }
  },

  // Atualizar banda (com foto opcional)
  async atualizarBanda(id, dados, foto) {
    try {
      const formData = buildBandaFormData(dados, foto);

      const response = await api.put(`/bandas/${id}`, formData);
      return response.data;
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.mensagem ||
        error.response?.data?.error ||
        error.message;
      
      const fullError = error.response?.data || error;
      
      console.error("[bandaService] Erro ao atualizar banda:", {
        status: error.response?.status,
        message: serverMessage,
        fullData: fullError,
      });
      throw error;
    }
  },

  // Excluir banda
  async excluirBanda(id) {
    const response = await api.delete(`/bandas/${id}`);
    return response.data;
  },

  // Adicionar integrantes à banda
  async adicionarIntegrantes(bandaId, integrantesIds) {
    const response = await api.post(`/bandas/${bandaId}/integrantes`, {
      integrantesIds: integrantesIds,
    });
    return response.data;
  },
};

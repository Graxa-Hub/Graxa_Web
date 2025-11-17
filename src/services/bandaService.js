import { api } from './axios';

export const bandaService = {
  // Listar todas as bandas
  async listarBandas() {
    try {
      const response = await api.get('/bandas');
      return response.data;
    } catch (error) {
      // Se o erro for "Não há bandas salvas", retorna lista vazia ao invés de erro
      const errorMessage = error.response?.data?.message || error.response?.data?.mensagem || '';
      if (error.response?.status === 500 && errorMessage.includes('Não há bandas salvas')) {
        console.warn('[bandaService] Nenhuma banda encontrada, retornando lista vazia');
        return [];
      }
      
      console.error('[bandaService] Erro ao listar bandas:', {
        status: error.response?.status,
        message: errorMessage
      });
      throw error;
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
      const formData = new FormData();

      formData.append('dados', new Blob([JSON.stringify(dados)], {
        type: 'application/json'
      }));

      if (foto) {
        formData.append('foto', foto);
      }

      // Let the browser / axios set the Content-Type (includes the boundary)
      const response = await api.post('/bandas', formData);
      return response.data;
    } catch (error) {
      console.error('[bandaService] Erro ao criar banda:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.response?.data?.mensagem
      });
      
      throw error;
    }
  },

  // Atualizar banda (com foto opcional)
  async atualizarBanda(id, dados, foto) {
    const formData = new FormData();

    formData.append('dados', new Blob([JSON.stringify(dados)], {
      type: 'application/json'
    }));

    if (foto) {
      formData.append('foto', foto);
    }

    // Do not manually set Content-Type for FormData
    const response = await api.put(`/bandas/${id}`, formData);
    return response.data;
  },

  // Excluir banda
  async excluirBanda(id) {
    const response = await api.delete(`/bandas/${id}`);
    return response.data;
  },

  // Adicionar integrantes à banda
  async adicionarIntegrantes(bandaId, integrantesIds) {
    const response = await api.post(`/bandas/${bandaId}/integrantes`, {
      integrantesIds: integrantesIds
    });
    return response.data;
  }
};
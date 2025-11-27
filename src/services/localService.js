import {api} from './axios';

export const localService = {
  // Cria um novo local
  async criar(localData) {
    try {
      const response = await api.post('/locais', localData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar local:', error);
      throw error;
    }
  },

  // Busca um local por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/locais/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar local ${id}:`, error);
      throw error;
    }
  },

  // Lista todos os locais
  async listar() {
    try {
      const response = await api.get('/locais');
 
      return response.data;
    } catch (error) {
      console.error('Erro ao listar locais:', error);
      throw error;
    }
  },

  // Atualiza um local
  async atualizar(id, localData) {
    try {
      const response = await api.put(`/locais/${id}`, localData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar local ${id}:`, error);
      throw error;
    }
  },

  // Deleta um local
  async deletar(id) {
    try {
      await api.delete(`/locais/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar local ${id}:`, error);
      throw error;
    }
  }
};
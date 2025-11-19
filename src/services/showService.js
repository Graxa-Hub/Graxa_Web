import {api} from './axios';

export const showService = {
  // Cria um novo show
  async criar(showData) {
    try {
      const response = await api.post('/shows', showData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar show:', error);
      throw error;
    }
  },

  // Busca um show por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/shows/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar show ${id}:`, error);
      throw error;
    }
  },

  // Lista todos os shows
  async listar() {
    try {
      const response = await api.get('/shows');
    
      return response.data;
    } catch (error) {
      console.error('Erro ao listar shows:', error);
      throw error;
    }
  },

  // Atualiza um show
  async atualizar(id, showData) {
    try {
      const response = await api.put(`/shows/${id}`, showData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar show ${id}:`, error);
      throw error;
    }
  },

  // Deleta um show
  async deletar(id) {
    try {
      await api.delete(`/shows/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar show ${id}:`, error);
      throw error;
    }
  },

  // Adiciona bandas a um show
  async adicionarBandas(showId, bandasIds) {
    try {
      const response = await api.put('/shows/bandas', {
        showId,
        bandasIds
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar bandas ao show:', error);
      throw error;
    }
  }
};
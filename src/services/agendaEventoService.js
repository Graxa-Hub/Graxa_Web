import { api } from './axios';

export const agendaEventoService = {
  // Criar agenda para um show
  async criar(dto) {
    try {
      const response = await api.post('/agenda-evento', dto);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar agenda:', error);
      throw error;
    }
  },

  // Listar agenda por showId
  async listarPorShow(showId) {
    try {
      const response = await api.get(`/agenda-evento/show/${showId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar agenda:', error);
      throw error;
    }
  },

  // Atualizar agenda
  async atualizar(id, dto) {
    try {
      const response = await api.put(`/agenda-evento/${id}`, dto);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar agenda:', error);
      throw error;
    }
  },

  // Remover agenda
  async remover(id) {
    try {
      const response = await api.delete(`/agenda-evento/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao remover agenda:', error);
      throw error;
    }
  },
};
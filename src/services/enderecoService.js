import {api} from './axios';

export const enderecoService = {
  // Cria um novo endereço
  async criar(enderecoData) {
    try {
      const response = await api.post('/enderecos', enderecoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      throw error;
    }
  },

  // Busca um endereço por ID
  async buscarPorId(id) {
    try {
      const response = await api.get(`/enderecos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar endereço ${id}:`, error);
      throw error;
    }
  },

  // Lista todos os endereços
  async listar() {
    try {
      const response = await api.get('/enderecos');
      console.log('Response do backend - endereços:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar endereços:', error);
      throw error;
    }
  },

  // Atualiza um endereço
  async atualizar(id, enderecoData) {
    try {
      const response = await api.put(`/enderecos/${id}`, enderecoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar endereço ${id}:`, error);
      throw error;
    }
  },

  // Deleta um endereço
  async deletar(id) {
    try {
      await api.delete(`/enderecos/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar endereço ${id}:`, error);
      throw error;
    }
  }
};
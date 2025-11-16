import {api} from './axios';

export const viagemService = {
  async listar() {
    const response = await api.get('/viagem');
    return response.data;
  },

  async buscarPorId(id) {
    const response = await api.get(`/viagem/${id}`);
    return response.data;
  },

  async buscarPorNome(nome) {
    const response = await api.get('/viagem/buscar', { params: { nome } });
    return response.data;
  },

  async criar(viagemData) {
    const response = await api.post('/viagem', viagemData);
    return response.data;
  },

  async atualizar(id, viagemData) {
    const response = await api.put(`/viagem/${id}`, viagemData);
    return response.data;
  },

  async deletar(id) {
    await api.delete(`/viagem/${id}`);
  }
};
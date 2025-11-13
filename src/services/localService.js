import { api } from './axios';

export const localService = {
  async listarLocais() {
    const response = await api.get('/locais');
    return response.data;
  },

  async criarLocal(dados) {
    const response = await api.post('/locais', dados);
    return response.data;
  },
};
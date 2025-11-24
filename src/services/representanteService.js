import { api } from './axios';

export const representanteService = {
  // Listar todos os representantes
  async listarRepresentantes() {
    const response = await api.get('/representantes');
    return response.data;
  },

  // Buscar representante por ID
  async buscarPorId(id) {
    const response = await api.get(`/representantes/${id}`);
    return response.data;
  },

  // Buscar por email
  async buscarPorEmail(email) {
    const response = await api.get(`/representantes/email/${email}`);
    return response.data;
  },

  // Criar novo representante
  async criarRepresentante(dados) {
    const response = await api.post('/representantes', dados);
    return response.data;
  },

  // Atualizar representante
  async atualizarRepresentante(id, dados) {
    const response = await api.put(`/representantes/${id}`, dados);
    return response.data;
  }
};
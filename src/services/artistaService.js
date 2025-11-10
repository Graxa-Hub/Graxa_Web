import { api } from './axios';

export const artistaService = {
  // Listar todos os artistas
  async listarArtistas() {
    const response = await api.get('/artistas');
    return response.data;
  },

  // Criar novo artista
  async criarArtista(dados) {
    const response = await api.post('/artistas', dados);
    return response.data;
  },

  // Buscar artista por ID
  async buscarPorId(id) {
    const response = await api.get(`/artistas/${id}`);
    return response.data;
  }
};
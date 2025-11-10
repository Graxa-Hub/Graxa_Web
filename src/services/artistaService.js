import {api} from './axios'; // ajuste conforme seu export atual

export const artistaService = {
  // Listar todos os artistas
  async listarArtistas() {
    const response = await api.get('/artistas');
    return response.data;
  },

  // Criar novo artista
  async criarArtista(dados) {
    try {
      console.log("[artistaService] criarArtista payload:", dados);

      // se houver campo de arquivo (ex: foto) envie como multipart/form-data
      const maybeFile = dados?.foto || dados?.file;
      if (maybeFile instanceof File || maybeFile instanceof Blob) {
        const form = new FormData();
        Object.keys(dados).forEach((k) => {
          const v = dados[k];
          if (v !== undefined && v !== null && !(v instanceof File) && !(v instanceof Blob)) {
            form.append(k, v);
          }
        });
        // append file campo com nome 'foto' ou 'file'
        form.append('foto', maybeFile);

        const resp = await api.post('/artistas', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return resp.data;
      }

      // caso comum: JSON
      const resp = await api.post('/artistas', dados);
      return resp.data;
    } catch (err) {
      console.error("[artistaService] erro ao criar artista:", err?.response?.status, err?.response?.data || err.message);
      throw err;
    }
  },

  // Buscar artista por ID
  async buscarPorId(id) {
    const response = await api.get(`/artistas/${id}`);
    return response.data;
  }
};
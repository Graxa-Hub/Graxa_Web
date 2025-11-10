import { api } from './axios';

export const bandaService = {
  // Listar todas as bandas
  async listarBandas() {
    const response = await api.get('/bandas');
    return response.data;
  },

  // Buscar banda por ID
  async buscarBandaPorId(id) {
    const response = await api.get(`/bandas/${id}`);
    return response.data;
  },

  // Criar banda (com foto opcional)
  async criarBanda(dados, foto) {
    const formData = new FormData();
    
    // Adiciona os dados da banda como JSON
    formData.append('dados', new Blob([JSON.stringify(dados)], {
      type: 'application/json'
    }));
    
    // Adiciona a foto se existir
    if (foto) {
      formData.append('foto', foto);
    }

    const response = await api.post('/bandas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Adicionar integrantes à banda
  async adicionarIntegrantes(bandaId, integrantesIds) {
    const response = await api.post(`/bandas/${bandaId}/integrantes`, {
      integrantesIds
    });
    return response.data;
  },

  // Buscar imagem da banda
  async buscarImagem(nomeArquivo) {
    const response = await api.get(`/imagens/${nomeArquivo}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  }
};
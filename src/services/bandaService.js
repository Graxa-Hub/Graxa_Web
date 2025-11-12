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
    
    formData.append('dados', new Blob([JSON.stringify(dados)], {
      type: 'application/json'
    }));
    
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

  // Atualizar banda (com foto opcional)
  async atualizarBanda(id, dados, foto) {
    const formData = new FormData();
    
    formData.append('dados', new Blob([JSON.stringify(dados)], {
      type: 'application/json'
    }));
    
    if (foto) {
      formData.append('foto', foto);
    }

    const response = await api.put(`/bandas/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Excluir banda
  async excluirBanda(id) {
    const response = await api.delete(`/bandas/${id}`);
    return response.data;
  },

  // Adicionar integrantes à banda
  async adicionarIntegrantes(bandaId, integrantesIds) {
    const response = await api.post(`/bandas/${bandaId}/integrantes`, {
      integrantesIds: integrantesIds
    });
    return response.data;
  }
};
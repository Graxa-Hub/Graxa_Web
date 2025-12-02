import { api } from './axios';

export const colaboradorService = {
  async listarColaboradores() {
    try {
      const response = await api.get('/colaboradores');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.mensagem || '';
      if (error.response?.status === 500 && errorMessage.includes('Não há colaboradores')) {
        console.warn('[colaboradorService] Nenhum colaborador encontrado, retornando lista vazia');
        return [];
      }

      console.error('[colaboradorService] Erro ao listar colaboradores:', {
        status: error.response?.status,
        message: errorMessage
      });
      throw error;
    }
  },

  async buscarColaboradorPorId(id) {
    const response = await api.get(`/colaboradores/${id}`);
    return response.data;
  },

  async buscarTelefonesPorUsuarioId(usuarioId) {
    const response = await api.get(`/telefones/${usuarioId}`);
    return response.data;
  },

  async buscarCredencialPorUsuarioId(usuarioId) {
    const response = await api.get(`/credenciais/${usuarioId}`);
    return response.data;
  },

  async uploadFoto(arquivo) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    const response = await api.post('/imagens/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.nomeArquivo;
  },

  async criarColaborador(dados) {
    const response = await api.post('/colaboradores', dados);
    return response.data;
  },

  async atualizarColaborador(id, dados) {
    const response = await api.put(`/colaboradores/${id}`, dados);
    return response.data;
  },

  async atualizarCredencial(usuarioId, dados) {
    const response = await api.put(`/credenciais/${usuarioId}`, dados);
    return response.data;
  },

  async excluirColaborador(id) {
    const response = await api.delete(`/colaboradores/${id}`);
    return response.data;
  },

  async validarSenha(email, senha) {
    try {
      const response = await api.post('/credenciais/login', {
        identificador: email,
        senha: senha,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
};
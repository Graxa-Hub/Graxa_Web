import { api } from './axios';

// ✅ CORRETO: Enviar como JSON body, não query params
export const criarNotificacao = async (colaboradorId, mensagem, tipo) => {
  console.log('📧 [notificacaoService] Criando notificação:', { colaboradorId, mensagem, tipo });

  try {
    // ✅ CORRETO: POST com body JSON
    const response = await api.post('/notificacoes', {
      colaboradorId: colaboradorId,
      mensagem: mensagem,
      tipo: tipo
    });

    console.log('✅ [notificacaoService] Notificação criada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [notificacaoService] Erro ao criar notificação:', error.response || error);
    throw error;
  }
};

export const listarPorColaborador = async (colaboradorId) => {
  try {
    const response = await api.get(`/notificacoes/colaborador/${colaboradorId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn('[notificacaoService] Endpoint de notificações não implementado');
      return [];
    }
    console.error('Erro ao listar notificações:', error);
    throw error;
  }
};

export const listarNaoLidas = async (colaboradorId) => {
  try {
    // Tentar endpoint específico primeiro
    try {
      const response = await api.get(`/notificacoes/colaborador/${colaboradorId}/nao-lidas`);
      return response.data;
    } catch (error) {
      // Se não existir, buscar todas e filtrar no frontend
      if (error.response?.status === 404) {
        console.warn('[notificacaoService] Endpoint /nao-lidas não existe, usando fallback');
        try {
          const response = await api.get(`/notificacoes/colaborador/${colaboradorId}`);
          // Filtrar apenas não lidas
          const naoLidas = response.data.filter(notif => !notif.lida);
          return naoLidas;
        } catch (err) {
          if (err.response?.status === 404) {
            console.warn('[notificacaoService] Endpoint de notificações não implementado');
            return [];
          }
          throw err;
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('Erro ao listar notificações não lidas:', error);
    return []; // Retornar array vazio em vez de quebrar
  }
};

export const marcarComoLida = async (notificacaoId) => {
  try {
    const response = await api.put(`/notificacoes/${notificacaoId}/lida`);
    return response.data;
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error;
  }
};

export const contarNaoLidas = async (colaboradorId) => {
  try {
    const response = await api.get(`/notificacoes/colaborador/${colaboradorId}/contar-nao-lidas`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn('[notificacaoService] Endpoint de contagem não implementado');
      return 0;
    }
    console.error('Erro ao contar notificações não lidas:', error);
    return 0;
  }
};
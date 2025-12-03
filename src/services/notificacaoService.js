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
    console.error('Erro ao listar notificações:', error);
    throw error;
  }
};

export const listarNaoLidas = async (colaboradorId) => {
  try {
    const response = await api.get(`/notificacoes/colaborador/${colaboradorId}/nao-lidas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar notificações não lidas:', error);
    throw error;
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
    console.error('Erro ao contar notificações não lidas:', error);
    throw error;
  }
};
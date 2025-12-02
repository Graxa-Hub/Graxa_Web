import { api } from './axios';

export const alocacaoService = {
  async criarAlocacao(dados) {
    try {
      console.log('[alocacaoService] Criando alocação:', dados);
      const response = await api.post('/alocacoes', dados);
      console.log('[alocacaoService] Alocação criada:', response.data);
      return response.data;
    } catch (error) {
      console.error('[alocacaoService] Erro ao criar alocação:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.response?.data?.mensagem,
        dadosEnviados: dados
      });
      throw error;
    }
  },

  async criarAlocacoes(showId, colaboradores) {
    try {
      console.log('[alocacaoService] Criando alocações em lote:', { showId, colaboradores });
      
      const alocacoes = await Promise.all(
        colaboradores.map(async (colaboradorId) => {
          const dados = { 
            showId: Number(showId), 
            colaboradorId: Number(colaboradorId) 
          };
          console.log('[alocacaoService] Enviando:', dados);
          return await this.criarAlocacao(dados);
        })
      );
      
      console.log('[alocacaoService] Todas alocações criadas:', alocacoes);
      return alocacoes;
    } catch (error) {
      console.error('[alocacaoService] Erro ao criar alocações em lote:', error);
      throw error;
    }
  },

  async responderAlocacao(id, aceita) {
    try {
      console.log('[alocacaoService] Respondendo alocação:', { id, aceita });
      const response = await api.put(`/alocacoes/${id}/responder`, null, {
        params: { aceita }
      });
      console.log('[alocacaoService] Resposta registrada:', response.data);
      return response.data;
    } catch (error) {
      console.error('[alocacaoService] Erro ao responder alocação:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.response?.data?.mensagem
      });
      throw error;
    }
  },

  // ✅ NOVA FUNÇÃO: Atualizar status da alocação
  async atualizarStatus(alocacaoId, novoStatus) {
    try {
      console.log('[alocacaoService] Atualizando status:', { alocacaoId, novoStatus });
      const response = await api.put(`/alocacoes/${alocacaoId}/status`, { status: novoStatus });
      console.log('[alocacaoService] Status atualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('[alocacaoService] Erro ao atualizar status:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.response?.data?.mensagem
      });
      throw error;
    }
  },

  async listarPorShow(showId) {
    try {
      console.log('[alocacaoService] Listando alocações do show:', showId);
      const response = await api.get(`/alocacoes/show/${showId}`);
      console.log('[alocacaoService] Alocações encontradas:', response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.mensagem || '';
      
      if (error.response?.status === 404 || errorMessage.includes('Não há alocações')) {
        console.warn('[alocacaoService] Nenhuma alocação encontrada para o show:', showId);
        return [];
      }

      console.error('[alocacaoService] Erro ao listar alocações:', {
        status: error.response?.status,
        data: error.response?.data,
        message: errorMessage
      });
      throw error;
    }
  },
};
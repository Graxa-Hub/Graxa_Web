import { useState, useCallback, useEffect } from 'react';
import * as notificacaoService from '../services/notificacaoService'; // ✅ CORRETO
import { webSocketService } from '../services/webSocketService';

export function useNotificacoes(colaboradorId) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [notificacaoNaoLidas, setNotificacaoNaoLidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const unreadCount = notificacaoNaoLidas.length;

  const connectWebSocket = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !colaboradorId) return;

    try {
      await webSocketService.connect(token);

      webSocketService.subscribeToNotifications((novaNotificacao) => {
        setNotificacoes(prev => [novaNotificacao, ...prev]);
        
        if (!novaNotificacao.lida) {
          setNotificacaoNaoLidas(prev => [novaNotificacao, ...prev]);
        }
        
        if (Notification.permission === 'granted') {
          // ✅ PERSONALIZAR notificação baseada no tipo
          let title = 'Nova notificação Graxa';
          let icon = '/favicon.ico';
          
          if (novaNotificacao.tipo === 'ALOCACAO_CANCELADA') {
            title = '🚫 Alocação Cancelada';
            icon = '🚫';
          } else if (novaNotificacao.tipo === 'CONVITE_ALOCACAO') {
            title = '🎭 Novo Convite para Show';
            icon = '🎭';
          }
          
          new Notification(title, {
            body: novaNotificacao.mensagem,
            icon: icon,
            tag: `notificacao-${novaNotificacao.id}`,
            requireInteraction: novaNotificacao.tipo === 'ALOCACAO_CANCELADA'
          });
        }
      });

      webSocketService.subscribeToCounter((novoContador) => {
        listarNaoLidas();
      });

    } catch (error) {
      console.error('❌ Erro ao conectar WebSocket:', error);
    }
  }, [colaboradorId]);

  const disconnectWebSocket = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  const criarNotificacao = useCallback(async (colaboradorIdTarget = null, mensagem, tipo) => {
    const targetId = colaboradorIdTarget || colaboradorId;
    
    if (!targetId) {
      console.warn('❌ [useNotificacoes] Nenhum colaboradorId fornecido para criar notificação');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('📧 [useNotificacoes] Criando notificação:', {
        colaboradorId: targetId,
        mensagem,
        tipo
      });
      
      const novaNotificacao = await notificacaoService.criarNotificacao(targetId, mensagem, tipo);
      
      console.log('✅ [useNotificacoes] Notificação criada:', novaNotificacao);
      
      if (targetId === colaboradorId) {
        setNotificacoes(prev => [novaNotificacao, ...prev]);
        if (!novaNotificacao.lida) {
          setNotificacaoNaoLidas(prev => [novaNotificacao, ...prev]);
        }
      }
      
      return novaNotificacao;
    } catch (err) {
      console.error('❌ [useNotificacoes] Erro ao criar notificação:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [colaboradorId]);

  const listarNotificacoes = useCallback(async () => {
    if (!colaboradorId) {
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const data = await notificacaoService.listarPorColaborador(colaboradorId);
      const notificacoesArray = data || [];
      
      // ✅ LOG SIMPLIFICADO: Apenas resumo das notificações
      console.log('📦 [useNotificacoes] Notificações carregadas:', notificacoesArray.length);
      console.log('🔍 [useNotificacoes] Resumo:', notificacoesArray.map(n => ({
        id: n.id,
        tipo: n.tipo,
        temAlocacao: !!n.alocacao,
        temShow: !!n.alocacao?.show,
        nomeShow: n.alocacao?.show?.nomeEvento,
        colaborador: n.alocacao?.colaborador?.nome,
        funcao: n.alocacao?.colaborador?.tipoUsuario
      })));
      
      setNotificacoes(notificacoesArray);
      return notificacoesArray;
    } catch (err) {
      setError(err.message);
      setNotificacoes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [colaboradorId]);

  const listarNaoLidas = useCallback(async () => {
    if (!colaboradorId) {
      return [];
    }

    try {
      const data = await notificacaoService.listarNaoLidas(colaboradorId);
      const notificacoesArray = data || [];
      
      setNotificacaoNaoLidas(notificacoesArray);
      return notificacoesArray;
    } catch (err) {
      setError(err.message);
      setNotificacaoNaoLidas([]);
      return [];
    }
  }, [colaboradorId]);

  const marcarComoLida = useCallback(async (notificacaoId) => {
    try {
      setNotificacaoNaoLidas(prev => prev.filter(n => n.id !== notificacaoId));
      setNotificacoes(prev => prev.map(n => 
        n.id === notificacaoId ? { ...n, lida: true } : n
      ));

      const notificacaoAtualizada = await notificacaoService.marcarComoLida(notificacaoId);
      
      setNotificacoes(prev => prev.map(n => 
        n.id === notificacaoId ? notificacaoAtualizada : n
      ));
      
      return notificacaoAtualizada;
    } catch (err) {
      console.error('❌ Erro ao marcar como lida, revertendo estado:', err);
      setError(err.message);
      
      await listarNotificacoes();
      await listarNaoLidas();
      
      throw err;
    }
  }, [listarNotificacoes, listarNaoLidas]);

  const marcarTodasComoLidas = useCallback(async () => {
    if (!colaboradorId) return;

    try {
      setNotificacaoNaoLidas([]);
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));

      const response = await fetch(`${import.meta.env.VITE_API_SPRING || 'http://localhost:8080'}/notificacoes/colaborador/${colaboradorId}/marcar-todas-lidas`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao marcar todas como lidas');
      }
      
    } catch (err) {
      console.error('[useNotificacoes] Erro ao marcar todas como lidas:', err);
      await listarNotificacoes();
      await listarNaoLidas();
      throw err;
    }
  }, [colaboradorId, listarNotificacoes, listarNaoLidas]);

  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (colaboradorId) {
      listarNaoLidas();
      connectWebSocket();
      requestNotificationPermission();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [colaboradorId, listarNaoLidas, connectWebSocket, disconnectWebSocket, requestNotificationPermission]);

  return {
    notificacoes,
    notificacaoNaoLidas,
    unreadCount,
    loading,
    error,
    criarNotificacao,
    listarNotificacoes,
    listarNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
  };
}
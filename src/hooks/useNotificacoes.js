import { useState, useCallback, useEffect, useRef } from 'react';
import * as notificacaoService from '../services/notificacaoService';
import { webSocketService } from '../services/webSocketService';

// ✅ Helper para mostrar notificação do browser
const showBrowserNotification = (notification) => {
  if (Notification.permission !== 'granted') return;

  const notificationConfig = {
    'ALOCACAO_CANCELADA': {
      title: '🚫 Alocação Cancelada',
      requireInteraction: true
    },
    'CONVITE_ALOCACAO': {
      title: '🎭 Novo Convite para Show',
      requireInteraction: false
    }
  };

  const config = notificationConfig[notification.tipo] || {
    title: 'Nova notificação Graxa',
    requireInteraction: false
  };

  new Notification(config.title, {
    body: notification.mensagem,
    icon: '/favicon.ico',
    tag: `notificacao-${notification.id}`,
    requireInteraction: config.requireInteraction
  });
};

export function useNotificacoes(colaboradorId) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [notificacaoNaoLidas, setNotificacaoNaoLidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // ✅ Ref para evitar múltiplas subscriptions
  const wsSubscribedRef = useRef(false);

  // ✅ Carregar lista inicial de notificações não lidas
  const listarNaoLidas = useCallback(async () => {
    if (!colaboradorId) return [];

    try {
      const data = await notificacaoService.listarNaoLidas(colaboradorId);
      const notificacoesArray = data || [];
      console.log('📋 Notificações não lidas carregadas:', notificacoesArray.length);
      setNotificacaoNaoLidas(notificacoesArray);
      setError(null);
      return notificacoesArray;
    } catch (err) {
      console.error('❌ Erro ao listar notificações não lidas:', err);
      setError(err.message);
      return [];
    }
  }, [colaboradorId]);

  // ✅ Carregar todas as notificações
  const listarNotificacoes = useCallback(async () => {
    if (!colaboradorId) return [];

    setLoading(true);
    try {
      const data = await notificacaoService.listarPorColaborador(colaboradorId);
      const notificacoesArray = data || [];
      console.log('📦 Todas as notificações carregadas:', notificacoesArray.length);
      setNotificacoes(notificacoesArray);
      setError(null);
      return notificacoesArray;
    } catch (err) {
      console.error('❌ Erro ao listar notificações:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [colaboradorId]);

  // ✅ NOVO: Criar notificação para qualquer colaborador
  const criarNotificacao = useCallback(async (colaboradorIdTarget, mensagem, tipo) => {
    try {
      console.log('📧 Criando notificação:', { colaboradorIdTarget, tipo });
      const novaNotificacao = await notificacaoService.criarNotificacao(
        colaboradorIdTarget,
        mensagem,
        tipo
      );
      console.log('✅ Notificação criada:', novaNotificacao.id);
      return novaNotificacao;
    } catch (err) {
      console.error('❌ Erro ao criar notificação:', err);
      throw err;
    }
  }, []);

  // ✅ Marcar notificação como lida (otimista)
  const marcarComoLida = useCallback(async (notificacaoId) => {
    const notificacaoAnterior = notificacaoNaoLidas.find(n => n.id === notificacaoId);

    try {
      // Atualização otimista
      setNotificacaoNaoLidas(prev => prev.filter(n => n.id !== notificacaoId));
      setNotificacoes(prev => prev.map(n => 
        n.id === notificacaoId ? { ...n, lida: true } : n
      ));

      // Chamada à API
      await notificacaoService.marcarComoLida(notificacaoId);
      setError(null);
    } catch (err) {
      console.error('❌ Erro ao marcar como lida:', err);
      // Reverter estado em caso de erro
      if (notificacaoAnterior) {
        setNotificacaoNaoLidas(prev => [notificacaoAnterior, ...prev]);
      }
      setError(err.message);
      throw err;
    }
  }, [notificacaoNaoLidas]);

  // ✅ Marcar todas como lidas
  const marcarTodasComoLidas = useCallback(async () => {
    if (!colaboradorId) return;

    const backup = notificacaoNaoLidas;

    try {
      // Atualização otimista
      setNotificacaoNaoLidas([]);
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));

      // Chamada à API
      const apiUrl = `${import.meta.env.VITE_API_SPRING || 'http://localhost:8080'}/notificacoes/colaborador/${colaboradorId}/marcar-todas-lidas`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao marcar todas como lidas');
      setError(null);
    } catch (err) {
      console.error('❌ Erro ao marcar todas como lidas:', err);
      // Reverter estado
      setNotificacaoNaoLidas(backup);
      setError(err.message);
      throw err;
    }
  }, [colaboradorId, notificacaoNaoLidas]);

  // ✅ Conectar WebSocket (apenas uma vez por colaborador)
  useEffect(() => {
    if (!colaboradorId) return;

    let isMounted = true;
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('⚠️ Token não encontrado');
      return;
    }

    const initializeWebSocket = async () => {
      try {
        console.log('🔌 Conectando WebSocket...');
        await webSocketService.connect(token);

        if (!isMounted) return;
        setIsConnected(true);
        console.log('✅ WebSocket conectado');

        // ✅ Subscrever apenas uma vez
        if (!wsSubscribedRef.current) {
          wsSubscribedRef.current = true;

          webSocketService.subscribeToNotifications((novaNotificacao) => {
            if (!isMounted) return;

            console.log('🔔 Nova notificação via WebSocket:', novaNotificacao.id, 'lida:', novaNotificacao.lida);

            // Adicionar à lista geral (verificar duplicatas)
            setNotificacoes(prev => {
              const jaExiste = prev.some(n => n.id === novaNotificacao.id);
              if (jaExiste) return prev;
              return [novaNotificacao, ...prev];
            });

            // ✅ CRUCIAL: Adicionar ao contador se não lida
            if (!novaNotificacao.lida) {
              setNotificacaoNaoLidas(prev => {
                const jaExiste = prev.some(n => n.id === novaNotificacao.id);
                if (jaExiste) return prev;
                
                const novo = [novaNotificacao, ...prev];
                console.log('📊 Contador atualizado:', prev.length, '→', novo.length);
                return novo;
              });
            }

            // Notificação do browser
            showBrowserNotification(novaNotificacao);
          });

          webSocketService.subscribeToCounter(() => {
            if (!isMounted) return;
            console.log('📊 Evento de contador recebido via WebSocket');
          });
        }

      } catch (err) {
        if (isMounted) {
          console.error('❌ Erro ao conectar WebSocket:', err);
          setIsConnected(false);
          setError(err.message);
        }
      }
    };

    initializeWebSocket();

    return () => {
      isMounted = false;
    };
  }, [colaboradorId]);

  // ✅ Carregar dados iniciais e pedir permissão
  useEffect(() => {
    if (!colaboradorId) return;

    listarNaoLidas();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [colaboradorId, listarNaoLidas]);

  // ✅ Desconectar ao desmontar
  useEffect(() => {
    return () => {
      webSocketService.disconnect();
      wsSubscribedRef.current = false;
    };
  }, []);

  return {
    notificacoes,
    notificacaoNaoLidas,
    loading,
    error,
    isConnected,
    criarNotificacao,
    listarNotificacoes,
    listarNaoLidas,
    marcarComoLida,
    marcarTodasComoLidas,
  };
}
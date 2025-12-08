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
    body: notification.mensagem,
    icon: '/favicon.ico',
    tag: `notificacao-${notification.id}`,
    requireInteraction: false // Valor padrão se não estiver em notificationConfig
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

  // ✅ Ref para evitar múltiplas subscriptions (mantido)
  const wsSubscribedRef = useRef(false);

  // ✅ Carregar lista inicial de notificações não lidas (SEM LOGS)
  const listarNaoLidas = useCallback(async () => {
    if (!colaboradorId) return [];

    try {
      const data = await notificacaoService.listarNaoLidas(colaboradorId);
      const notificacoesArray = data || [];
      // console.log(`📋 Notificações não lidas carregadas:`, notificacoesArray.length); // DEBUG REMOVIDO
      setNotificacaoNaoLidas(notificacoesArray);
      setError(null);
      return notificacoesArray;
    } catch (err) {
      console.error('❌ Erro ao listar notificações não lidas:', err);
      setError(err.message);
      return [];
    }
  }, [colaboradorId]);

  // ✅ Carregar todas as notificações (SEM LOGS)
  const listarNotificacoes = useCallback(async () => {
    if (!colaboradorId) return [];

    setLoading(true);
    try {
      const data = await notificacaoService.listarPorColaborador(colaboradorId);
      const notificacoesArray = data || [];
      // console.log(`📦 Todas as notificações carregadas:`, notificacoesArray.length); // DEBUG REMOVIDO
      setNotificacoes(notificacoesArray);
      
      // ✅ TAMBÉM ATUALIZA AS NÃO LIDAS
      await listarNaoLidas();
      
      setError(null);
      return notificacoesArray;
    } catch (err) {
      console.error('❌ Erro ao listar notificações:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [colaboradorId, listarNaoLidas]);

  // ✅ NOVO: Criar notificação para qualquer colaborador (SEM LOGS)
  const criarNotificacao = useCallback(async (colaboradorIdTarget, mensagem, tipo) => {
    try {
      // console.log(`📧 Criando notificação:`, { colaboradorIdTarget, tipo }); // DEBUG REMOVIDO
      const novaNotificacao = await notificacaoService.criarNotificacao(
        colaboradorIdTarget,
        mensagem,
        tipo
      );
      // console.log(`✅ Notificação criada:`, novaNotificacao); // DEBUG REMOVIDO
      return novaNotificacao;
    } catch (err) {
      console.error('❌ Erro ao criar notificação:', err);
      throw err;
    }
  }, []);

  // ✅ Marcar notificação como lida (otimista) (MANTIDO)
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

  // ✅ Marcar todas como lidas (MANTIDO)
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

// ---------------------------------------------
// 🔄 EFEITOS (Conexão WS e Polling)
// ---------------------------------------------

  // ✅ Conectar WebSocket (APENAS COM LOGS ESSENCIAIS E OTIMIZADO)
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
        // console.log(`🔌 Iniciando conexão WebSocket... ColaboradorId: ${colaboradorId}`); // DEBUG REMOVIDO
        
        await webSocketService.connect(token);

        if (!isMounted) return;
        setIsConnected(true);
        // console.log(`✅ WebSocket CONECTADO com sucesso!`); // DEBUG REMOVIDO

        // ✅ Subscrever apenas uma vez
        if (!wsSubscribedRef.current) {
          wsSubscribedRef.current = true;
          // console.log('🎧 Registrando listeners do WebSocket...'); // DEBUG REMOVIDO

          // 🔔 LISTENER DE NOTIFICAÇÕES
          webSocketService.subscribeToNotifications((novaNotificacao) => {
            if (!isMounted) return;

            // Atualizar lista completa (SEM LOGS INTERNOS DETALHADOS)
            setNotificacoes(prev => {
              const jaExiste = prev.some(n => n.id === novaNotificacao.id);
              if (jaExiste) return prev;
              return [novaNotificacao, ...prev];
            });

            // Se não lida, adicionar ao contador (SEM LOGS INTERNOS DETALHADOS)
            if (!novaNotificacao.lida) {
              setNotificacaoNaoLidas(prev => {
                const jaExiste = prev.some(n => n.id === novaNotificacao.id);
                if (jaExiste) return prev;
                return [novaNotificacao, ...prev];
              });
            } 
            
            // Notificação do browser
            showBrowserNotification(novaNotificacao);
          });

          // 📊 LISTENER DE CONTADOR (AGORA CHAMA listarNaoLidas)
          webSocketService.subscribeToCounter(async (contador) => {
            // console.log(`📊 EVENTO CONTADOR RECEBIDO: ${contador}`); // DEBUG REMOVIDO
            if (!isMounted) return;

            // ✅ Chama a função centralizada para buscar as não lidas
            await listarNaoLidas(); 
          });
        }

      } catch (err) {
        if (isMounted) {
          console.error(`❌ ERRO ao conectar WebSocket:`, err);
          setIsConnected(false);
          setError(err.message);
        }
      }
    };

    initializeWebSocket();

    return () => {
      isMounted = false;
      
      // ✅ AJUSTE NO CLEANUP: Verifica se o cliente existe antes de desconectar
      if (webSocketService.isWebSocketConnected && webSocketService.isWebSocketConnected()) {
        webSocketService.disconnect();
      }
      wsSubscribedRef.current = false;
    };
    // ✅ DEPENDÊNCIA DE listarNaoLidas É CRÍTICA PARA EVITAR STALE CLOSURES
  }, [colaboradorId, listarNaoLidas]);

  // ---------------------------------------------
  // ⏰ EFEITO DE POLLING (Busca a cada 4 segundos)
  // ---------------------------------------------
  useEffect(() => {
    if (!colaboradorId) return;

    // ✅ Define o intervalo de 4000ms (4 segundos)
    const intervalId = setInterval(() => {
      // console.log('🔄 Polling: Buscando notificações não lidas...'); // DEBUG REMOVIDO
      listarNaoLidas();
    }, 4000);

    // Limpa o intervalo quando o componente desmonta ou colaboradorId/listarNaoLidas muda
    return () => {
      clearInterval(intervalId);
    };
  }, [colaboradorId, listarNaoLidas]); // Depende de listarNaoLidas para usar a versão atualizada


  // ✅ Carregar dados iniciais (MANTIDO)
  useEffect(() => {
    if (!colaboradorId) return;

    // Carregar ambas as listas (o Polling fará isso de forma recorrente)
    listarNaoLidas();
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [colaboradorId, listarNaoLidas]);

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
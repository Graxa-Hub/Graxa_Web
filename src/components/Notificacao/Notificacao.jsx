import { useState, useEffect } from "react";
import { IconeNotificao } from "./IconeAlt";
import { Modal } from "./Modal";
import { useNotificacoes } from "../../hooks/useNotificacoes";
import { useAuth } from "../../context/AuthContext";

export const Notificacao = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario } = useAuth();
  
  const {
    notificacoes,
    notificacaoNaoLidas,
    unreadCount,
    loading,
    error,
    listarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas
  } = useNotificacoes(usuario?.id);

  // ✅ Carregar notificações quando abrir modal
  useEffect(() => {
    if (isOpen && usuario?.id) {
      listarNotificacoes();
    }
  }, [isOpen, usuario?.id, listarNotificacoes]);

  // ✅ Pedir permissão para notificações do browser
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMarkAsRead = async (notificacaoId) => {
    try {
      await marcarComoLida(notificacaoId);
      // ✅ Estado já foi atualizado otimisticamente no hook
    } catch (error) {
      console.error('❌ Erro ao marcar notificação como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await marcarTodasComoLidas();
      // ✅ Estado já foi atualizado otimisticamente no hook
    } catch (error) {
      console.error('❌ Erro ao marcar todas as notificações como lidas:', error);
    }
  };

  if (!usuario?.id) {
    return null;
  }

  return (
    <>
      <IconeNotificao 
        handleOpen={handleOpen} 
        unreadCount={unreadCount || 0}
        loading={loading}
      />

      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        notificacaoLista={notificacoes || []}
        loading={loading}
        error={error}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
};

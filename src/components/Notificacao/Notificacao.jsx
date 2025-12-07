import { useState, useEffect } from 'react';
import { IconeNotificao } from './IconeAlt';
import { Modal } from './Modal';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { useAuth } from '../../context/AuthContext';

export const Notificacao = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario } = useAuth();
  const {
    notificacoes,
    notificacaoNaoLidas,
    loading,
    error,
    isConnected,
    listarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas
  } = useNotificacoes(usuario?.id);

  // Atualiza a contagem em tempo real sempre que notificacaoNaoLidas mudar
  const contagemNotificacoes = notificacaoNaoLidas?.length || 0;

  // Carrega notificações inicialmente
  useEffect(() => {
    if (usuario?.id) {
      listarNotificacoes();
    }
  }, [usuario?.id, listarNotificacoes]);

  // Recarrega quando abrir o modal
  useEffect(() => {
    if (isOpen && usuario?.id) {
      listarNotificacoes();
    }
  }, [isOpen, usuario?.id, listarNotificacoes]);

  if (!usuario?.id) {
    return null;
  }

  return (
    <>
      <IconeNotificao
        handleOpen={() => setIsOpen(true)}
        unreadCount={contagemNotificacoes}
        loading={loading}
      />

      <Modal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        notificacaoLista={notificacoes || []}
        loading={loading}
        error={error}
        isConnected={isConnected}
        onMarkAsRead={marcarComoLida}
        onMarkAllAsRead={marcarTodasComoLidas}
        onRefreshNotifications={listarNotificacoes}
      />
    </>
  );
};

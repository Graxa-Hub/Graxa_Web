import { useState, useEffect } from 'react';
import { IconeNotificao } from './IconeAlt';
import { Modal } from './Modal';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { useAuth } from '../../context/AuthContext';

export const Notificacao = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario } = useAuth();
  const [contagemNotificacoes, setContagemNotificacoes] = useState(0);
  const {
    notificacoes,
    notificacaoNaoLidas, // ✅ ADICIONE
    loading,
    error,
    isConnected,
    listarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas
  } = useNotificacoes(usuario?.id);

  

  // ✅ Carregar notificações ao abrir modal
  useEffect(() => {
    if (isOpen && usuario?.id) {
      listarNotificacoes();
    }
    setContagemNotificacoes(notificacaoNaoLidas?.length || 0);
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

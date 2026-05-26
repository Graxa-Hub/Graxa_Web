import React, { useState } from "react";
import { X, CheckCheck } from "lucide-react";
import { ListaNotificacao } from "./ListaNotificacao";
import { AlocacaoModal } from "./AlocacaoModal";

export const Modal = ({
  isOpen,
  handleClose,
  notificacaoLista = [],
  loading = false,
  error = null,
  onMarkAsRead,
  onMarkAllAsRead,
  onRefreshNotifications,
}) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isAlocacaoModalOpen, setIsAlocacaoModalOpen] = useState(false);

  const handleNotificationClick = (notificacao) => {
    setSelectedNotification(notificacao);
    setIsAlocacaoModalOpen(true);

    if (!notificacao.lida && onMarkAsRead) onMarkAsRead(notificacao.id);
  };

  const handleAlocacaoResponse = (aceito, alocacaoAtualizada) => {
    if (selectedNotification && alocacaoAtualizada) {
      setSelectedNotification({
        ...selectedNotification,
        alocacao: alocacaoAtualizada,
      });
    }
    if (onRefreshNotifications) {
      setTimeout(() => onRefreshNotifications(), 1000);
    }
  };

  const closeAlocacaoModal = () => {
    setIsAlocacaoModalOpen(false);
    setSelectedNotification(null);
  };

  if (!isOpen) return null;

  const hasUnreadNotifications = notificacaoLista.some((n) => !n.lida);

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={handleClose} />

      <div className="fixed top-16 right-4 z-40 w-80 sm:w-96 max-h-[80vh] bg-[var(--surface-elevated)] rounded-[var(--radius-md)] shadow-[var(--shadow-card)] border border-[var(--border)] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Notificações
            </h2>
            {notificacaoLista.length > 0 && (
              <span className="bg-[var(--surface-hover)] border border-[var(--border)] text-[11px] px-2 py-0.5 rounded-full text-[var(--text-secondary)]">
                {notificacaoLista.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasUnreadNotifications && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-md transition-colors"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--accent)]"></div>
                <p className="text-[var(--text-muted)]">
                  Carregando notificações...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-[var(--accent)] mb-2">Erro: {error}</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-full">
              <ListaNotificacao
                notificacaoLista={notificacaoLista}
                onMarkAsRead={onMarkAsRead}
                onNotificationClick={handleNotificationClick}
              />
            </div>
          )}
        </div>
      </div>

      {isAlocacaoModalOpen && (
        <AlocacaoModal
          isOpen={isAlocacaoModalOpen}
          onClose={closeAlocacaoModal}
          notificacao={selectedNotification}
          onResponse={handleAlocacaoResponse}
        />
      )}
    </>
  );
};

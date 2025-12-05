import React, { useState } from "react";
import { X, CheckCheck } from "lucide-react";
import { Footer } from "./Footer";
import { Header } from "./Header";
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
  onRefreshNotifications  // ✅ NOVO
}) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isAlocacaoModalOpen, setIsAlocacaoModalOpen] = useState(false);

  const handleNotificationClick = (notificacao) => {
    setSelectedNotification(notificacao);
    setIsAlocacaoModalOpen(true);
    
    if (!notificacao.lida && onMarkAsRead) {
      onMarkAsRead(notificacao.id);
    }
  };

  const handleAlocacaoResponse = (aceito, alocacaoAtualizada) => {
    // ✅ Atualizar a notificação selecionada com novo status
    if (selectedNotification && alocacaoAtualizada) {
      setSelectedNotification({
        ...selectedNotification,
        alocacao: alocacaoAtualizada
      });
    }
    
    // ✅ Recarregar lista após responder
    if (onRefreshNotifications) {
      setTimeout(() => {
        onRefreshNotifications();
      }, 1000);
    }
  };

  const closeAlocacaoModal = () => {
    setIsAlocacaoModalOpen(false);
    setSelectedNotification(null);
  };

  if (!isOpen) return null;

  const hasUnreadNotifications = notificacaoLista.some(n => !n.lida);

  return (
    <>
      {/* Overlay invisível para fechar ao clicar fora */}
      <div 
        className="fixed inset-0 z-30" 
        onClick={handleClose}
      />

      {/* Modal de Notificações */}
      <div className="fixed top-16 right-4 z-40 w-80 sm:w-96 max-h-[80vh] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Notificações
            </h2>
            
            {/* ✅ Contador simples */}
            {notificacaoLista.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {notificacaoLista.length}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {hasUnreadNotifications && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-gray-500">Carregando notificações...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-red-500 mb-2">Erro: {error}</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-full">
              {/* ✅ SIMPLES: Apenas um componente que trata tudo */}
              <ListaNotificacao
                notificacaoLista={notificacaoLista}
                onMarkAsRead={onMarkAsRead}
                onNotificationClick={handleNotificationClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de Alocação */}
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

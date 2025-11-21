import { Bell, X } from "lucide-react";
import { useState } from "react";
import { IconeNotificao } from "./IconeAlt";

export const Notificacao = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notificacaoLista = [
    {
      id: 1,
      text: "Nova banda cadastrada: Boogarins",
      time: "Há 5 minutos",
      read: false,
    },
    {
      id: 2,
      text: "Show adicionado ao calendário",
      time: "Há 1 hora",
      read: false,
    },
    {
      id: 3,
      text: "Viagem confirmada para São Paulo",
      time: "Há 2 horas",
      read: true,
    },
  ];

  // Seleciona o componente de ícone baseado na existência de notificações não lidas
  const unreadCount = notificacaoLista.filter((n) => !n.read).length;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão de notificação */}
      <IconeNotificao />

      {/* Modal de notificações */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed top-20 right-8 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Notificações
              </h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Lista de notificações */}
            <div className="flex-1 overflow-y-auto">
              {notificacaoLista.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {notificacaoLista.map((notificacao) => (
                    <li
                      key={notificacao.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notificacao.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!notificacao.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${
                              !notificacao.read
                                ? "font-medium text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {notificacao.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notificacao.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell size={48} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notificacaoLista.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded transition-colors">
                  Marcar todas como lidas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

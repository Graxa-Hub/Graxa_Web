import React from "react";
import { Bell } from "lucide-react";

export const ListaNotificacao = ({ notificacaoLista }) => {
  return (
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
  );
};

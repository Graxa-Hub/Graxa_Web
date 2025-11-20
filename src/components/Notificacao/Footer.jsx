import React from "react";

export const Footer = ({ notificacaoLista }) => {
  if (notificacaoLista.length === 0) {
    return null;
  }

  return (
    <div className="p-3 border-t border-gray-200">
      <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded transition-colors">
        Marcar todas como lidas
      </button>
    </div>
  );
};

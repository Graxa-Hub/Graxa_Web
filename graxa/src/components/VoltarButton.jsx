// BUTTON PARA CASOS DE:
// VOLTAR UMA SESSÃO ATRÁS

import { MoveLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const VoltarButton = ({ children, to }) => {
  return (
    <Link 
    to={to}
    className="flex items-center w-full">
      <div className="flex justify-center items-center h-13 w-13 bg-gray-700 rounded-full">
        <MoveLeft className="text-white" size={16} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 ml-4">{children}</h2>
    </Link>
  );
};

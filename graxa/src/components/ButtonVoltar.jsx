// BUTTON PARA CASOS DE:
// VOLTAR UMA SESSÃO ATRÁS

import { MoveLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const ButtonVoltar = ({ children, to }) => {
  return (
    <div className="px-2 bg-red-100">
      <Link to={to} className="flex items-center justify-start">
        <div className="flex justify-center items-center h-13 w-13 bg-gray-700 rounded-full text-white">
          <MoveLeft size={16} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 ml-4">{children}</h2>
      </Link>
    </div>
  );
};

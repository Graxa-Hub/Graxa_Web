// src/components/Input.jsx (Melhor Prática)
import React from "react";

export const Input = ({ children, placeholder, type }) => {
  return (
    <div>
      {/* Agora você usa a variável 'children' diretamente */}
      {children}
      <input
        placeholder={placeholder}
        type={type}
        className="w-full py-2 px-3 bg-white rounded-sm border border-gray-400 outline-none bg-transparent"
      />
    </div>
  );
};

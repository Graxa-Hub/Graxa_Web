// src/components/Input.jsx (Melhor Prática)
import React from "react";

export const Input = ({ children, placeholder }) => {
  return (
    <div>
      {/* Agora você usa a variável 'children' diretamente */}
      {children}
      <input
        placeholder={placeholder}
        type="text"
        className="py-5 px-2 bg-white"
      />
    </div>
  );
};

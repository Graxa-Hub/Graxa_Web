import React from "react";

export const Titulo = ({ titulo, descricao }) => {
  return (
    <div className="mt-8 text-gray-900">
      <h2 className="text-3xl font-bold">{titulo}</h2>
      <p className="mt-2">{descricao}</p>
    </div>
  );
};

import React from "react";

// Layout genérico para telas de autenticação.
// Agora aceita a prop `columns` para definir se será split (2 colunas) ou single (1 coluna).
// Uso: <Layout columns={1}> ... </Layout> em RecuperarSenha.
export const Layout = ({
  children,
  padding = "",
  columns = 2,
  className = "",
}) => {
  const colsClass =
    columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";
  // Ajusta a largura máxima: single fica um pouco mais estreito (max-w-xl) para foco.
  const maxWidthClass = columns === 1 ? "max-w-xl" : "max-w-4xl";

  return (
    <div
      className={`w-full min-h-screen ${padding} flex justify-center items-center bg-gradient-to-b from-gray-800 to-gray-600`}
    >
      <div
        className={`w-full ${maxWidthClass} mx-4 sm:mx-20 grid ${colsClass} shadow-md rounded-xl overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

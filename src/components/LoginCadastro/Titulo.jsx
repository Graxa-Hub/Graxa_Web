import React from "react";

export const Titulo = ({ titulo, descricao }) => {
  return (
    <div className="mt-8 text-[var(--text-primary)]">
      <h2 className="text-3xl font-bold tracking-tight">{titulo}</h2>
      <p className="mt-2 text-[var(--text-muted)]">{descricao}</p>
    </div>
  );
};

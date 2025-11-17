import { Search } from "lucide-react";
import React from "react";

// Revertido: este botão já não abre mais o EventoModal.
export const ModalButton = () => {
  return (
    <button
      className="flex items-center justify-center bg-white rounded-lg px-4 ml-10 shadow-lg"
      type="button"
      aria-label="Buscar"
    >
      <Search className="w-5 h-5" />
    </button>
  );
};

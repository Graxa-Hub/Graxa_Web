import React from "react";

const SidebarDireita = ({ etapaAtual }) => {
  return (
    <div className="w-96 bg-white border-l shadow p-6">
      <h3 className="font-semibold text-gray-800 mb-2">
        Informações da Etapa
      </h3>

      {etapaAtual === 1 && (
        <p className="text-sm text-gray-600">Selecione funções e a equipe.</p>
      )}
      {etapaAtual === 2 && (
        <p className="text-sm text-gray-600">
          Adicione hotéis, voos e transportes.
        </p>
      )}
      {etapaAtual === 3 && (
        <p className="text-sm text-gray-600">Informe o local do show.</p>
      )}
      {etapaAtual === 4 && (
        <p className="text-sm text-gray-600">Monte a agenda completa.</p>
      )}
      {etapaAtual === 5 && (
        <p className="text-sm text-gray-600">Finalize com informações extras.</p>
      )}
    </div>
  );
};

export default SidebarDireita;

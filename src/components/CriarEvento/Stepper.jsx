import React from "react";

const Stepper = ({ etapaAtual, setEtapaAtual, etapas, onVisaoEvento }) => {
  return (
    <div className="flex gap-8 items-center border-b pb-4 border-gray-200">
      {etapas.map((etapa, index) => {
        const stepNum = index + 1;
        return (
          <div
            key={index}
            className="flex items-center cursor-pointer group"
            onClick={() => setEtapaAtual(stepNum)}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                etapaAtual === stepNum
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
              }`}
            >
              {stepNum}
            </div>
            <span className={`ml-3 text-sm font-medium ${etapaAtual === stepNum ? "text-gray-900 font-semibold" : "text-gray-500"}`}>{etapa.label}</span>
            {index < etapas.length - 1 && (
              <span className="mx-6 text-gray-300">/</span>
            )}
          </div>
        );
      })}
      {/* Botão Visão do Evento */}
      {onVisaoEvento && (
        <button
          className="ml-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          onClick={onVisaoEvento}
        >
          Visão do Evento
        </button>
      )}
    </div>
  );
};

export default Stepper;
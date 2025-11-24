import React from "react";

const Stepper = ({ etapaAtual, setEtapaAtual }) => {
  const steps = [
    "Local do Evento",
    "Funções & Equipe",
    "Logística",
    "Agenda",
    "Informações Extras"
  ];

  return (
    <div className="flex gap-8 items-center border-b pb-4 border-gray-200">
      {steps.map((label, index) => {
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
                  ? "bg-green-600 text-white hover:bg-green-700" // Mantendo green-600 como cor primária por enquanto
                  : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
              }`}
            >
              {stepNum}
            </div>

            <span className={`ml-3 text-sm font-medium ${etapaAtual === stepNum ? "text-gray-900 font-semibold" : "text-gray-500"}`}>{label}</span>

            {index < steps.length - 1 && (
              <span className="mx-6 text-gray-300">/</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
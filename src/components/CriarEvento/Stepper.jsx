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
    <div className="flex gap-6 items-center">
      {steps.map((label, index) => {
        const stepNum = index + 1;

        return (
          <div
            key={index}
            className="flex items-center cursor-pointer"
            onClick={() => setEtapaAtual(stepNum)}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                etapaAtual === stepNum
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {stepNum}
            </div>

            <span className="ml-3 text-sm font-medium">{label}</span>

            {index < steps.length - 1 && (
              <span className="mx-4 text-gray-400">—</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;

import React from "react";

export const Header = () => {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <div className="flex flex-col items-center flex-1">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>

        {/* Indicadores de etapa */}
        {showNavigation && totalSteps > 1 && (
          <div className="flex items-center gap-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index + 1 === currentStep
                    ? "bg-red-500"
                    : index + 1 < currentStep
                    ? "bg-gray-300"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleClose}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};

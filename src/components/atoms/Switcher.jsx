import React from "react";
import { Sun } from "lucide-react";

export const Switcher = ({ activeView, onViewChange }) => {
    return (
        <div className="flex flex-col items-center bg-gray-200 w-10 h-48 rounded-xl p-1 relative shadow-inner cursor-pointer select-none">
            {/* Indicador Deslizante (Pill) */}
            <div
                className={`absolute w-8 h-[88px] bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out transform ${activeView === "weather" ? "translate-y-[92px]" : "translate-y-0"
                    }`}
            />

            {/* Opção Porcentagem */}
            <button
                onClick={() => onViewChange("progress")}
                className={`z-10 flex-1 flex items-center justify-center w-full transition-colors duration-300 ${activeView === "progress" ? "text-gray-900" : "text-gray-500"
                    }`}
            >
                <span className="text-xl font-bold font-mono">%</span>
            </button>

            {/* Opção Clima */}
            <button
                onClick={() => onViewChange("weather")}
                className={`z-10 flex-1 flex items-center justify-center w-full transition-colors duration-300 ${activeView === "weather" ? "text-yellow-500" : "text-gray-500"
                    }`}
            >
                <Sun size={24} strokeWidth={activeView === "weather" ? 2.5 : 2} />
            </button>
        </div>
    );
};

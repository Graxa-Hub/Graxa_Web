import React from "react";

export const Porcentagem = ({ percent = 0 }) => {
  const clamped = Math.max(0, Math.min(100, Number(percent)));
  const circumference = 2 * Math.PI * 36; // 2πr with r=36
  return (
    <div className="w-40 h-50 flex flex-col items-center justify-between bg-white rounded-xl shadow-lg p-4">
      <p className="text-lg text-gray-600 mb-2 text-center leading-tight">
        Progresso do cronograma:
      </p>
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#16a34a"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${
              (clamped / 100) * circumference
            } ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-sm font-semibold text-gray-700">
          {clamped}%
        </span>
      </div>
    </div>
  );
};

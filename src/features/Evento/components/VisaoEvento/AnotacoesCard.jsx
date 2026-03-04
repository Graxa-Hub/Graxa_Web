// src/components/VisaoEvento/ANotacoesCard.jsx
import React from "react";
import { FileText } from "lucide-react";

export const AnotacoesCard = ({ titulo, descricao }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b flex-shrink-0">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-800 text-sm truncate">{titulo}</h3>
      </div>

      <div className="flex-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto">
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {descricao || "Nenhuma observação cadastrada."}
        </p>
      </div>
    </div>
  );
};
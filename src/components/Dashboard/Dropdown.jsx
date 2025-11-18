import React from "react";

export const Dropdown = ({
  open,
  active,
  bandas = [],
  turnes = [],
  bandaSelecionada,
  turneSelecionada,
  onOpenArtist,
  onOpenTour,
  onBandaSelect,
  onTurneSelect,
}) => {
  if (!open) return null;

  return (
    <div
      className="absolute top-full mt-2 z-50 translate-x-[-15px]"
      role="menu"
    >
      {/* Area do DropDown */}
      <div className="w-[320px] bg-white shadow-lg rounded-md overflow-hidden">
        
        {/* ========== SEÇÃO DE BANDAS ========== */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700">
              🎸 Bandas
            </span>
            <button
              onClick={onOpenArtist}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              + Gerenciar
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {bandas.length > 0 ? (
              bandas.map((banda) => (
                <button
                  key={banda.id}
                  onClick={() => onBandaSelect && onBandaSelect(banda)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                    bandaSelecionada?.id === banda.id
                      ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {bandaSelecionada?.id === banda.id && (
                      <span className="text-blue-500">✓</span>
                    )}
                    <span>{banda.nome}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Nenhuma banda cadastrada
              </div>
            )}
          </div>
        </div>

        {/* ========== SEÇÃO DE TURNÊS ========== */}
        <div>
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700">
              🎤 Turnês
            </span>
            <button
              onClick={onOpenTour}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              + Gerenciar
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {/* ✅ Opção "Todas as Turnês" */}
            <button
              onClick={() => onTurneSelect && onTurneSelect(null)}
              className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                turneSelecionada === null
                  ? "bg-purple-50 text-purple-700 font-medium border-l-4 border-purple-500"
                  : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {turneSelecionada === null && (
                  <span className="text-purple-500">✓</span>
                )}
                <span>📋 Todas as Turnês</span>
              </div>
            </button>

            {/* Lista de turnês filtradas pela banda */}
            {turnes.length > 0 ? (
              turnes.map((turne) => (
                <button
                  key={turne.id}
                  onClick={() => onTurneSelect && onTurneSelect(turne)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                    turneSelecionada?.id === turne.id
                      ? "bg-purple-50 text-purple-700 font-medium border-l-4 border-purple-500"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {turneSelecionada?.id === turne.id && (
                      <span className="text-purple-500">✓</span>
                    )}
                    <span>{turne.nomeTurne || turne.nome}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {bandaSelecionada
                  ? "Nenhuma turnê cadastrada para esta banda"
                  : "Selecione uma banda"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;

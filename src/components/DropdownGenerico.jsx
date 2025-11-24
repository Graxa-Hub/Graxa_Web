import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function DropdownGenerico({
  options = [],
  selected,
  onSelect,
  getLabel = (item) => item.nome,
  getSubLabel,
  getImage,
  placeholder = "Selecione...",
  showAllOption = false,
  allLabel = "Todos",
  allSubLabel,
  allImage,
  minWidth = "min-w-110",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedDisplay = selected
    ? {
        name: getLabel(selected),
        sub: getSubLabel ? getSubLabel(selected) : "",
        imagemUrl: getImage ? getImage(selected) : null,
      }
    : {
        name: allLabel,
        sub: allSubLabel,
        imagemUrl: allImage,
      };

  // Filtragem das opções pelo campo de busca
  const filteredOptions = options.filter((item) =>
    getLabel(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative max-w-md ${minWidth}`}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="bg-white rounded-lg shadow-sm p-4 w-full"
        type="button"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden border-2 border-green-500">
              {selectedDisplay.imagemUrl ? (
                <img
                  src={selectedDisplay.imagemUrl}
                  alt={selectedDisplay.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{selectedDisplay.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {selectedDisplay.name || placeholder}
              </div>
              {selectedDisplay.sub && (
                <div className="text-sm text-gray-500">{selectedDisplay.sub}</div>
              )}
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-full z-10 max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              autoFocus
            />
          </div>
          {showAllOption && (
            <button
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
                setSearch("");
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 ${
                !selected ? "bg-gray-50" : ""
              }`}
            >
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                {allLabel?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{allLabel}</div>
                {allSubLabel && (
                  <div className="text-sm text-gray-500">{allSubLabel}</div>
                )}
              </div>
            </button>
          )}
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 bg-gray-200 flex items-center justify-center">
                    {getImage && getImage(item) ? (
                      <img
                        src={getImage(item)}
                        alt={getLabel(item)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">
                        {getLabel(item)?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span>{getLabel(item)}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-sm">Nenhum resultado encontrado</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
import React from "react";

const FlightCard = ({ flight, colaboradores, onChange, onRemove }) => {
  const updateField = (field, value) => {
    onChange({ ...flight, [field]: value });
  };

  const togglePassageiro = (id) => {
    const exists = flight.passageiros.includes(id);
    const novaLista = exists
      ? flight.passageiros.filter((h) => h !== id)
      : [...flight.passageiros, id];

    updateField("passageiros", novaLista);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 space-y-5 border border-gray-100">

      {/* BOTÃO REMOVER */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
      >
        ×
      </button>

      <h3 className="font-bold text-gray-900 text-xl">Voo</h3>

      {/* CAMPOS */}
      <input
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Companhia aérea"
        value={flight.cia}
        onChange={(e) => updateField("cia", e.target.value)}
      />

      <input
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Número do voo"
        value={flight.numero}
        onChange={(e) => updateField("numero", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Origem"
          value={flight.origem}
          onChange={(e) => updateField("origem", e.target.value)}
        />

        <input
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Destino"
          value={flight.destino}
          onChange={(e) => updateField("destino", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Saída</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={flight.saida}
            onChange={(e) => updateField("saida", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Chegada</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={flight.chegada}
            onChange={(e) => updateField("chegada", e.target.value)}
          />
        </div>
      </div>

      {/* PASSAGEIROS */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Passageiros</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const selected = flight.passageiros.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => togglePassageiro(c.id)}
                className={`w-full flex justify-between p-3 border rounded-lg transition-colors ${
                  selected ? "bg-blue-50 border-blue-400 hover:bg-blue-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span>{c.nome}</span>
                {selected && <span className="text-blue-600 font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
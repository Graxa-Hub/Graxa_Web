import React from "react";

const FlightCard = ({ flight, colaboradores, onChange }) => {
  const updateField = (field, value) => {
    onChange({ ...flight, [field]: value });
  };

  const togglePassageiro = (id) => {
    const jaTem = flight.passageiros.includes(id);
    let novaLista;

    if (jaTem) {
      novaLista = flight.passageiros.filter((p) => p !== id);
    } else {
      novaLista = [...flight.passageiros, id];
    }

    updateField("passageiros", novaLista);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Informações do Voo</h3>

      <input
        className="w-full p-2 border rounded"
        placeholder="Companhia aérea"
        value={flight.cia}
        onChange={(e) => updateField("cia", e.target.value)}
      />

      <input
        className="w-full p-2 border rounded"
        placeholder="Número do voo"
        value={flight.numero}
        onChange={(e) => updateField("numero", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          className="p-2 border rounded"
          placeholder="Origem"
          value={flight.origem}
          onChange={(e) => updateField("origem", e.target.value)}
        />

        <input
          className="p-2 border rounded"
          placeholder="Destino"
          value={flight.destino}
          onChange={(e) => updateField("destino", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Horário de saída</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={flight.saida}
            onChange={(e) => updateField("saida", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Horário de chegada</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={flight.chegada}
            onChange={(e) => updateField("chegada", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-sm block mb-2">Passageiros</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const selected = flight.passageiros.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => togglePassageiro(c.id)}
                className={`w-full flex justify-between p-2 border rounded ${
                  selected ? "bg-green-100 border-green-500" : "bg-gray-50"
                }`}
              >
                <span>{c.nome}</span>
                {selected && <span className="text-green-600 font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlightCard;

import React from "react";

const TransporteCard = ({ transporte, colaboradores, onChange }) => {
  const updateField = (field, value) => {
    onChange({ ...transporte, [field]: value });
  };

  const togglePassageiro = (id) => {
    const jaTem = transporte.passageiros.includes(id);
    let novaLista;

    if (jaTem) {
      novaLista = transporte.passageiros.filter((p) => p !== id);
    } else {
      novaLista = [...transporte.passageiros, id];
    }

    updateField("passageiros", novaLista);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Transporte</h3>

      <input
        className="w-full p-2 border rounded"
        placeholder="Tipo (van, micro-ônibus...)"
        value={transporte.tipo}
        onChange={(e) => updateField("tipo", e.target.value)}
      />

      <div>
        <label className="text-sm">Horário de saída</label>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded mt-1"
          value={transporte.saida}
          onChange={(e) => updateField("saida", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm">Horário previsto de chegada</label>
        <input
          type="datetime-local"
          className="w-full p-2 border rounded mt-1"
          value={transporte.chegada}
          onChange={(e) => updateField("chegada", e.target.value)}
        />
      </div>

      <input
        className="w-full p-2 border rounded"
        placeholder="Responsável / Motorista"
        value={transporte.responsavel}
        onChange={(e) => updateField("responsavel", e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        placeholder="Observações"
        value={transporte.observacao}
        onChange={(e) => updateField("observacao", e.target.value)}
      />

      <div>
        <label className="text-sm block mb-2">Passageiros</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const selected = transporte.passageiros.includes(c.id);

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

export default TransporteCard;

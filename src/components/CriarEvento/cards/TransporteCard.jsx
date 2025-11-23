import React from "react";

const TransporteCard = ({
  transporte,
  colaboradores,
  onChange,
  onRemove
}) => {
  const updateField = (field, value) => {
    onChange({ ...transporte, [field]: value });
  };

  const togglePassageiro = (id) => {
    const exists = transporte.passageiros.includes(id);
    const novaLista = exists
      ? transporte.passageiros.filter((h) => h !== id)
      : [...transporte.passageiros, id];

    updateField("passageiros", novaLista);
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-6 space-y-5">

      {/* BOTÃO REMOVER */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
      >
        ×
      </button>

      <h3 className="font-semibold text-gray-900 text-lg">
        Transporte
      </h3>

      {/* TIPO */}
      <select
        className="w-full p-2 border rounded"
        value={transporte.tipo}
        onChange={(e) => updateField("tipo", e.target.value)}
      >
        <option value="">Selecione o tipo</option>
        <option value="van">Van</option>
        <option value="carro">Carro</option>
        <option value="onibus">Ônibus</option>
        <option value="voo">Voo</option>
      </select>

      {/* INFORMAÇÕES */}
      <input
        className="w-full p-2 border rounded"
        placeholder="Responsável"
        value={transporte.responsavel}
        onChange={(e) => updateField("responsavel", e.target.value)}
      />

      <label className="text-sm">Horário de Saída</label>
      <input
        type="datetime-local"
        className="w-full p-2 border rounded"
        value={transporte.saida}
        onChange={(e) => updateField("saida", e.target.value)}
      />

      <label className="text-sm">Horário de Chegada</label>
      <input
        type="datetime-local"
        className="w-full p-2 border rounded"
        value={transporte.chegada}
        onChange={(e) => updateField("chegada", e.target.value)}
      />

      {/* PASSAGEIROS */}
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
                  selected ? "bg-purple-100 border-purple-500" : "bg-gray-50"
                }`}
              >
                <span>{c.nome}</span>
                {selected && (
                  <span className="text-purple-600 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* OBSERVAÇÃO */}
      <textarea
        className="w-full p-2 border rounded"
        rows="3"
        placeholder="Observações"
        value={transporte.observacao}
        onChange={(e) => updateField("observacao", e.target.value)}
      />
    </div>
  );
};

export default TransporteCard;

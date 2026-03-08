import React from "react";

const TransporteCard = ({ transporte = {}, colaboradores = [], onChange, onRemove }) => {
  const get = (field, alt) => {
    if (transporte[field] !== undefined && transporte[field] !== null) return transporte[field];
    if (alt && transporte[alt] !== undefined && transporte[alt] !== null) return transporte[alt];
    return "";
  };

  const updateField = (field, value) => {
    onChange({ ...transporte, [field]: value });
  };

  const togglePassageiro = (id) => {
    const passageiros = Array.isArray(transporte.passageiros) ? transporte.passageiros : [];
    const exists = passageiros.includes(id);
    const novaLista = exists ? passageiros.filter((h) => h !== id) : [...passageiros, id];
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

      <h3 className="font-bold text-gray-900 text-xl">
        Transporte
      </h3>

      {/* TIPO */}
      <select
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={get("tipo", "tipo")}
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
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Responsável"
        value={get("responsavel", "motorista")}
        onChange={(e) => updateField("responsavel", e.target.value)}
      />

      <label className="text-sm font-medium text-gray-700">Horário de Saída</label>
      <input
        type="datetime-local"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={get("saida", "saida")}
        onChange={(e) => updateField("saida", e.target.value)}
      />

      <label className="text-sm font-medium text-gray-700">Horário de Chegada</label>
      <input
        type="datetime-local"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={get("chegada", "chegada") || ""}
        onChange={(e) => updateField("chegada", e.target.value)}
      />

      {/* PASSAGEIROS */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Passageiros</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const passageiros = Array.isArray(transporte.passageiros) ? transporte.passageiros : [];
            const selected = passageiros.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => togglePassageiro(c.id)}
                className={`w-full flex justify-between p-3 border rounded-lg transition-colors ${
                  selected ? "bg-purple-50 border-purple-400 hover:bg-purple-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
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
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows="3"
        placeholder="Observações"
        value={get("observacao", "observacao")}
        onChange={(e) => updateField("observacao", e.target.value)}
      />
    </div>
  );
};

export default TransporteCard;

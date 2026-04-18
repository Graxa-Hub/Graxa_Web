import React from "react";

const TransporteCard = ({
  transporte = {},
  colaboradores = [],
  onChange,
  onRemove,
}) => {
  const get = (field, alt) => {
    if (transporte[field] !== undefined && transporte[field] !== null)
      return transporte[field];
    if (alt && transporte[alt] !== undefined && transporte[alt] !== null)
      return transporte[alt];
    return "";
  };

  const updateField = (field, value) => {
    onChange({ ...transporte, [field]: value });
  };

  const togglePassageiro = (id) => {
    const passageiros = Array.isArray(transporte.passageiros)
      ? transporte.passageiros
      : [];
    const exists = passageiros.includes(id);
    const novaLista = exists
      ? passageiros.filter((h) => h !== id)
      : [...passageiros, id];
    updateField("passageiros", novaLista);
  };

  return (
    <div className="surface-card p-6 space-y-5 relative">
      {/* BOTÃO REMOVER */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-[var(--accent)] hover:text-[var(--accent)] font-bold text-xl"
      >
        ×
      </button>

      <h3 className="font-bold text-[var(--text-primary)] text-base font-semibold">
        Transporte
      </h3>

      {/* TIPO */}
      <select
        className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
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
        className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
        placeholder="Responsável"
        value={get("responsavel", "motorista")}
        onChange={(e) => updateField("responsavel", e.target.value)}
      />

      <label className="text-sm font-medium text-[var(--text-secondary)]">
        Horário de Saída
      </label>
      <input
        type="datetime-local"
        className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
        value={get("saida", "saida")}
        onChange={(e) => updateField("saida", e.target.value)}
      />

      <label className="text-sm font-medium text-[var(--text-secondary)]">
        Horário de Chegada
      </label>
      <input
        type="datetime-local"
        className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
        value={get("chegada", "chegada") || ""}
        onChange={(e) => updateField("chegada", e.target.value)}
      />

      {/* PASSAGEIROS */}
      <div>
        <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
          Passageiros
        </label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const passageiros = Array.isArray(transporte.passageiros)
              ? transporte.passageiros
              : [];
            const selected = passageiros.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => togglePassageiro(c.id)}
                className={`w-full flex justify-between p-3 border rounded-[var(--radius-md)] transition-colors ${
                  selected
                    ? "bg-[var(--surface)] border-[var(--info)] hover:bg-[var(--surface-hover)]"
                    : "bg-[var(--surface-hover)] border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                <span>{c.nome}</span>
                {selected && (
                  <span className="text-[var(--info)] font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* OBSERVAÇÃO */}
      <textarea
        className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
        rows="3"
        placeholder="Observações"
        value={get("observacao", "observacao")}
        onChange={(e) => updateField("observacao", e.target.value)}
      />
    </div>
  );
};

export default TransporteCard;

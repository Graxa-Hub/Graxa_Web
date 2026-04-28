import React from "react";

const FlightCard = ({ flight = {}, colaboradores = [], onChange, onRemove }) => {
  // suporte a campos vindos do backend (ciaAerea/codigoVoo/partida/chegada)
  const get = (field, alt) => {
    if (flight[field] !== undefined && flight[field] !== null) return flight[field];
    if (alt && flight[alt] !== undefined && flight[alt] !== null) return flight[alt];
    return "";
  };

  const updateField = (field, value) => {
    onChange({ ...flight, [field]: value });
  };

  const togglePassageiro = (id) => {
    const passageiros = Array.isArray(flight.passageiros) ? flight.passageiros : (flight.passageiros = []);
    const exists = passageiros.includes(id);
    const novaLista = exists ? passageiros.filter((h) => h !== id) : [...passageiros, id];
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

      <h3 className="font-bold text-[var(--text-primary)] text-base font-semibold">Voo</h3>

      {/* CAMPOS */}
      <input
        className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
        placeholder="Companhia aérea"
        value={get("cia", "ciaAerea")}
        onChange={(e) => updateField("cia", e.target.value)}
      />

      <input
        className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
        placeholder="Número do voo"
        value={get("numero", "codigoVoo")}
        onChange={(e) => updateField("numero", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          className="p-3 border border-[var(--border)] rounded-[var(--radius-md)]  focus:ring-0 focus:border-[var(--border-strong)]"
          placeholder="Origem"
          value={get("origem", "origem")}
          onChange={(e) => updateField("origem", e.target.value)}
        />

        <input
          className="p-3 border border-[var(--border)] rounded-[var(--radius-md)]  focus:ring-0 focus:border-[var(--border-strong)]"
          placeholder="Destino"
          value={get("destino", "destino")}
          onChange={(e) => updateField("destino", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">Saída</label>
          <input
            type="datetime-local"
            className="form-input mt-1  focus:ring-0 focus:border-[var(--border-strong)]"
            // backend pode enviar partida (LocalDateTime) ou frontend usa saida
            value={get("saida", "partida")}
            onChange={(e) => updateField("saida", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">Chegada</label>
          <input
            type="datetime-local"
            className="form-input mt-1  focus:ring-0 focus:border-[var(--border-strong)]"
            value={get("chegada", "chegada")}
            onChange={(e) => updateField("chegada", e.target.value)}
          />
        </div>
      </div>

      {/* PASSAGEIROS */}
      <div>
        <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Passageiros</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const passageiros = Array.isArray(flight.passageiros) ? flight.passageiros : [];
            const selected = passageiros.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => togglePassageiro(c.id)}
                className={`w-full flex justify-between p-3 border rounded-[var(--radius-md)] transition-colors ${
                  selected ? "bg-[var(--surface)] border-blue-400 hover:bg-[var(--surface-hover)]" : "bg-[var(--surface-hover)] border-[var(--border)] hover:bg-[#383838]"
                }`}
              >
                <span>{c.nome}</span>
                {selected && <span className="text-[var(--info)] font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlightCard;

import React from "react";

const Etapa5Extras = ({ extras, setExtras, onSave, showId }) => {
  const updateField = (field, value) => {
    setExtras({ ...extras, [field]: value });
  };

  const handleSave = () => {
    if (onSave && typeof onSave === "function") {
      onSave();
    }
  };

  return (
    <div className="space-y-8">
      {/* BOTÃO SALVAR NO TOPO */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)]"
        >
          Salvar Extras
        </button>
      </div>

      <h2 className="text-xl font-bold text-[var(--text-primary)]">
        Informações Extras
      </h2>

      <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] space-y-4 border border-[var(--border)]">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Observações Gerais
          </label>
          <textarea
            className="w-full p-3 mt-1 border border-[var(--border)] rounded-[var(--radius-md)]  focus:ring-0 focus:border-[var(--border-strong)]"
            rows="5"
            value={extras.obs || ""}
            onChange={(e) => updateField("obs", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Contatos Importantes
          </label>
          <textarea
            className="w-full p-3 mt-1 border border-[var(--border)] rounded-[var(--radius-md)]  focus:ring-0 focus:border-[var(--border-strong)]"
            rows="5"
            value={extras.contatos || ""}
            onChange={(e) => updateField("contatos", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Etapa5Extras;

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
    <div className="space-y-6">
      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Informações Extras
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Registre observações e contatos relevantes para a operação do
              evento.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] font-medium"
          >
            Salvar Extras
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4">
          <label className="text-sm font-semibold text-[var(--text-secondary)]">
            Observações Gerais
          </label>
          <textarea
            className="w-full p-3 mt-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text-[var(--text-primary)] focus:ring-0 focus:border-[var(--border-strong)]"
            rows="5"
            value={extras.obs || ""}
            onChange={(e) => updateField("obs", e.target.value)}
            placeholder="Ex: restrições do local, instruções de montagem, observações de operação..."
          />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4">
          <label className="text-sm font-semibold text-[var(--text-secondary)]">
            Contatos Importantes
          </label>
          <textarea
            className="w-full p-3 mt-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface-elevated)] text-[var(--text-primary)] focus:ring-0 focus:border-[var(--border-strong)]"
            rows="5"
            value={extras.contatos || ""}
            onChange={(e) => updateField("contatos", e.target.value)}
            placeholder="Ex: produção local, segurança, responsável técnico, emergência..."
          />
        </div>

        {!showId && (
          <p className="text-xs text-[var(--warning)]">
            Salve o evento para vincular estas informações ao show.
          </p>
        )}
      </div>
    </div>
  );
};

export default Etapa5Extras;

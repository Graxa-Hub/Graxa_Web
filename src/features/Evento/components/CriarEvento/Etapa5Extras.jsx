import React from "react";
import { FileText, Phone, Save } from "lucide-react";
import { buttonStyles, cn, sectionHeader, sectionSubtitle, sectionTitle, textareaBase, surfaceCard } from "./uiStyles";

const Etapa5Extras = ({ extras, setExtras, onSave }) => {
  const updateField = (field, value) => {
    setExtras({ ...extras, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className={sectionHeader}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={sectionTitle}>Informações Extras</h2>
            <p className={sectionSubtitle}>Registre observações operacionais e contatos importantes para centralizar o contexto do evento.</p>
          </div>
          <button onClick={onSave} className={buttonStyles.primary}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Extras
          </button>
        </div>
      </div>

      <div className={cn(surfaceCard, "grid gap-6 p-6 xl:grid-cols-2")}>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Observações gerais</h3>
              <p className="text-sm text-slate-500">Combine detalhes técnicos, acessos, restrições e lembretes gerais.</p>
            </div>
          </div>
          <textarea
            className={textareaBase}
            rows="7"
            value={extras.obs || ""}
            onChange={(e) => updateField("obs", e.target.value)}
            placeholder="Ex: entrada técnica liberada às 09h, backstage com acesso restrito, briefing às 14h..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Contatos importantes</h3>
              <p className="text-sm text-slate-500">Mantenha produção, venue, fornecedores e pontos focais em um só lugar.</p>
            </div>
          </div>
          <textarea
            className={textareaBase}
            rows="7"
            value={extras.contatos || ""}
            onChange={(e) => updateField("contatos", e.target.value)}
            placeholder="Ex: João Produção - (11) 99999-0000 | Venue manager - Maria..."
          />
        </div>
      </div>
    </div>
  );
};

export default Etapa5Extras;

import React, { useState } from "react";
import { Calendar, Copy, MapPin, Save, Trash2, Wrench } from "lucide-react";
import { useAgendaEvento } from "../../../../hooks/useAgendaEvento";
import { useToast } from "../../../../hooks/useToast";
import { ConfirmModal } from "../../../../components/molecules/ConfirmModal";
import { buttonStyles, cn, inputBase, sectionHeader, sectionSubtitle, sectionTitle, selectBase, surfaceCard, textareaBase } from "./uiStyles";

const TIPOS_ENUM = {
  DESLOCAMENTO: "DESLOCAMENTO",
  TECNICO: "TECNICO",
};

const makeEmptyItem = (tipo = TIPOS_ENUM.TECNICO) => ({
  id: null,
  tipo,
  titulo: "",
  origem: "",
  destino: "",
  dataHoraInicio: "",
  dataHoraFim: "",
  descricao: "",
  tempId: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
});

const tipoStyles = {
  [TIPOS_ENUM.DESLOCAMENTO]: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    border: "border-emerald-200",
    iconWrap: "bg-emerald-50 text-emerald-600",
    icon: MapPin,
    label: "Deslocamento",
  },
  [TIPOS_ENUM.TECNICO]: {
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    border: "border-sky-200",
    iconWrap: "bg-sky-50 text-sky-600",
    icon: Wrench,
    label: "Técnico",
  },
};

const Etapa4Agenda = ({ agenda, setAgenda, onSave, showId }) => {
  const { remover: removerDoBanco } = useAgendaEvento();
  const { showSuccess, showError } = useToast();
  const [confirmModal, setConfirmModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const sortByInicio = (lista) =>
    lista.slice().sort((a, b) => (a.dataHoraInicio || "").localeCompare(b.dataHoraInicio || ""));

  const adicionarItem = (tipo = TIPOS_ENUM.TECNICO) => {
    setAgenda((prev) => sortByInicio([...prev, makeEmptyItem(tipo)]));
  };

  const updateItem = (tempId, field, value) => {
    setAgenda((prev) => {
      const newAgenda = prev.map((item) => {
        if (item.tempId === tempId || item.id === tempId) {
          const updated = { ...item, [field]: value };
          if (field === "tipo" && value === TIPOS_ENUM.TECNICO) {
            updated.origem = "";
            updated.destino = "";
          }
          return updated;
        }
        return item;
      });

      return sortByInicio(newAgenda);
    });
  };

  const handleRemoverClick = (item) => {
    setConfirmModal({
      item,
      title: "Remover item da agenda?",
      message: `Tem certeza que deseja remover "${item.titulo || "este item"}"? Esta ação não pode ser desfeita.`,
    });
  };

  const confirmarRemocao = async () => {
    if (!confirmModal?.item) return;
    const item = confirmModal.item;

    try {
      setLoading(true);
      if (item.id && typeof item.id === "number") {
        await removerDoBanco(item.id);
      }
      setAgenda((prev) => prev.filter((i) => (i.tempId || i.id) !== (item.tempId || item.id)));
      showSuccess("Item removido com sucesso!");
      setConfirmModal(null);
    } catch (error) {
      console.error("Erro ao remover item:", error);
      showError("Erro ao remover item da agenda");
    } finally {
      setLoading(false);
    }
  };

  const duplicarItem = (item) => {
    const duplicated = { ...item, id: null, tempId: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` };
    setAgenda((prev) => {
      const itemKey = item.tempId || item.id;
      const index = prev.findIndex((i) => (i.tempId || i.id) === itemKey);
      const newAgenda = [...prev];
      newAgenda.splice(index + 1, 0, duplicated);
      return sortByInicio(newAgenda);
    });
  };

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={confirmarRemocao}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmText="Sim, remover"
        cancelText="Cancelar"
        type="error"
        loading={loading}
      />

      <div className={sectionHeader}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className={cn(sectionTitle, "flex items-center gap-3")}>
              <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-600"><Calendar className="h-5 w-5" /></span>
              Agenda do Evento
            </h2>
            <p className={sectionSubtitle}>Organize atividades técnicas e deslocamentos na ordem em que o evento acontece.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => adicionarItem(TIPOS_ENUM.TECNICO)} className={buttonStyles.secondary}>
              <Wrench className="mr-2 h-4 w-4" />
              Adicionar Técnico
            </button>
            <button onClick={() => adicionarItem(TIPOS_ENUM.DESLOCAMENTO)} className={buttonStyles.tinted}>
              <MapPin className="mr-2 h-4 w-4" />
              Adicionar Deslocamento
            </button>
            <button
              onClick={() => {
                if (!showId) {
                  showError("Salve/abra o evento antes de salvar a agenda.");
                  return;
                }
                if (onSave && typeof onSave === "function") onSave();
              }}
              className={buttonStyles.primary}
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Agenda
            </button>
          </div>
        </div>
      </div>

      {agenda.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-14 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-base font-medium text-slate-700">Nenhum item de agenda criado.</p>
          <p className="mt-1 text-sm text-slate-500">Use os botões acima para começar a montar a operação do evento.</p>
        </div>
      )}

      <div className="space-y-4">
        {agenda.map((item) => {
          const itemKey = item.tempId || item.id;
          const styles = tipoStyles[item.tipo] || tipoStyles[TIPOS_ENUM.TECNICO];
          const Icon = styles.icon;

          return (
            <div key={itemKey} className={cn(surfaceCard, "overflow-hidden border p-6", styles.border)}>
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-2xl p-3", styles.iconWrap)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", styles.badge)}>
                      {styles.label}
                    </span>
                    {item.id && <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">Registro #{item.id}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className={buttonStyles.secondary} onClick={() => duplicarItem(item)}>
                    <Copy className="mr-2 h-4 w-4" />Duplicar
                  </button>
                  <button className={buttonStyles.danger} onClick={() => handleRemoverClick(item)}>
                    <Trash2 className="mr-2 h-4 w-4" />Remover
                  </button>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
                  <select className={selectBase} value={item.tipo} onChange={(e) => updateItem(itemKey, "tipo", e.target.value)}>
                    <option value={TIPOS_ENUM.TECNICO}>Técnico</option>
                    <option value={TIPOS_ENUM.DESLOCAMENTO}>Deslocamento</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Título</label>
                  <input
                    className={inputBase}
                    value={item.titulo}
                    placeholder="Ex: Montagem de palco"
                    onChange={(e) => updateItem(itemKey, "titulo", e.target.value)}
                  />
                </div>

                {item.tipo === TIPOS_ENUM.DESLOCAMENTO && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Origem</label>
                      <input className={inputBase} value={item.origem} onChange={(e) => updateItem(itemKey, "origem", e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Destino</label>
                      <input className={inputBase} value={item.destino} onChange={(e) => updateItem(itemKey, "destino", e.target.value)} />
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Início</label>
                  <input type="datetime-local" className={inputBase} value={item.dataHoraInicio || ""} onChange={(e) => updateItem(itemKey, "dataHoraInicio", e.target.value)} />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Fim</label>
                  <input type="datetime-local" className={inputBase} value={item.dataHoraFim || ""} onChange={(e) => updateItem(itemKey, "dataHoraFim", e.target.value)} />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
                <textarea className={textareaBase} rows="4" value={item.descricao || ""} onChange={(e) => updateItem(itemKey, "descricao", e.target.value)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Etapa4Agenda;

import React, { useState } from "react";
import { Calendar, MapPin, Wrench, Trash2, Copy } from "lucide-react";
import { useAgendaEvento } from "../../hooks/useAgendaEvento";
import { useToast } from "../../hooks/useToast";
import { ConfirmModal } from "../UI/ConfirmModal";

const TIPOS_ENUM = {
  DESLOCAMENTO: "DESLOCAMENTO",
  TECNICO: "TECNICO",
};

const makeEmptyItem = (tipo = TIPOS_ENUM.TECNICO) => ({
  id: null, // ID null significa que ainda não foi salvo no banco
  tipo,
  titulo: "",
  origem: "",
  destino: "",
  dataHoraInicio: "",
  dataHoraFim: "",
  descricao: "",
  tempId: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`, // ID temporário para React key
});

const Etapa4Agenda = ({ agenda, setAgenda, onSave, showId }) => {
  const { remover: removerDoBanco } = useAgendaEvento();
  const { showSuccess, showError } = useToast();
  const [confirmModal, setConfirmModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const adicionarItem = (tipo = TIPOS_ENUM.TECNICO) => {
    setAgenda((prev) => {
      const next = [...prev, makeEmptyItem(tipo)];
      return sortByInicio(next);
    });
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
      message: `Tem certeza que deseja remover "${item.titulo || 'este item'}"? Esta ação não pode ser desfeita.`,
    });
  };

  const confirmarRemocao = async () => {
    if (!confirmModal?.item) return;

    const item = confirmModal.item;
    
    try {
      setLoading(true);

      // Se o item tem ID (já foi salvo no banco), remove do banco
      if (item.id && typeof item.id === "number") {
        await removerDoBanco(item.id);
      }

      // Remove do estado local
      setAgenda((prev) =>
        prev.filter((i) => {
          const itemKey = i.tempId || i.id;
          const targetKey = item.tempId || item.id;
          return itemKey !== targetKey;
        })
      );

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
    const duplicated = {
      ...item,
      id: null, // Novo item, sem ID do banco
      tempId: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };

    setAgenda((prev) => {
      const itemKey = item.tempId || item.id;
      const index = prev.findIndex((i) => (i.tempId || i.id) === itemKey);
      const newAgenda = [...prev];
      newAgenda.splice(index + 1, 0, duplicated);

      return sortByInicio(newAgenda);
    });
  };

  const sortByInicio = (lista) => {
    return lista.slice().sort((a, b) => {
      const ai = a.dataHoraInicio || "";
      const bi = b.dataHoraInicio || "";
      return ai.localeCompare(bi);
    });
  };

  return (
    <div className="space-y-6">
      {/* Modal de Confirmação */}
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

      {/* Título da Seção */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Agenda do Evento
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure as atividades técnicas e deslocamentos do evento
        </p>
      </div>

      {/* Botões de Adicionar */}
      <div className="flex gap-3">
        <button
          onClick={() => adicionarItem(TIPOS_ENUM.TECNICO)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Wrench className="w-4 h-4" />
          Adicionar Técnico
        </button>

        <button
          onClick={() => adicionarItem(TIPOS_ENUM.DESLOCAMENTO)}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
        >
          <MapPin className="w-4 h-4" />
          Adicionar Deslocamento
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            if (!showId) {
              showError("Salve/abra o evento antes de salvar a agenda.");
              return;
            }
            if (onSave && typeof onSave === "function") onSave();
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Salvar Agenda
        </button>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-4 mt-6">
        {agenda.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Nenhum item de agenda criado.</p>
            <p className="text-xs text-gray-400 mt-1">
              Clique nos botões acima para adicionar
            </p>
          </div>
        )}

        {agenda.map((item) => {
          const itemKey = item.tempId || item.id;

          return (
            <div
              key={itemKey}
              className={`bg-white p-6 rounded-xl shadow-md space-y-4 border-l-4 ${
                item.tipo === TIPOS_ENUM.DESLOCAMENTO
                  ? "border-l-green-500"
                  : "border-l-blue-500"
              }`}
            >
              {/* Badge de Tipo */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    item.tipo === TIPOS_ENUM.DESLOCAMENTO
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.tipo === TIPOS_ENUM.DESLOCAMENTO ? (
                    <>
                      <MapPin className="w-3 h-3" /> Deslocamento
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3 h-3" /> Técnico
                    </>
                  )}
                </span>
                {item.id && (
                  <span className="text-xs text-gray-400">ID: {item.id}</span>
                )}
              </div>

              {/* TIPO */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Tipo</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={item.tipo}
                  onChange={(e) => updateItem(itemKey, "tipo", e.target.value)}
                >
                  <option value={TIPOS_ENUM.TECNICO}>Técnico</option>
                  <option value={TIPOS_ENUM.DESLOCAMENTO}>Deslocamento</option>
                </select>
              </div>

              {/* TITULO */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Título</label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={item.titulo}
                  placeholder="Ex: Montagem de palco"
                  onChange={(e) => updateItem(itemKey, "titulo", e.target.value)}
                />
              </div>

              {/* ORIGEM / DESTINO (apenas Deslocamento) */}
              {item.tipo === TIPOS_ENUM.DESLOCAMENTO && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Origem</label>
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg mt-1
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={item.origem}
                      placeholder="Ex: Hotel X"
                      onChange={(e) => updateItem(itemKey, "origem", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">Destino</label>
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg mt-1
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={item.destino}
                      placeholder="Ex: Estádio Y"
                      onChange={(e) => updateItem(itemKey, "destino", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* DATA HORA INICIO / FIM */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Data e Hora - Início
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={item.dataHoraInicio || ""}
                    onChange={(e) => updateItem(itemKey, "dataHoraInicio", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Data e Hora - Fim
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={item.dataHoraFim || ""}
                    onChange={(e) => updateItem(itemKey, "dataHoraFim", e.target.value)}
                  />
                </div>
              </div>

              {/* DESCRIÇÃO */}
              <div>
                <label className="text-sm font-semibold text-gray-700">Descrição</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="3"
                  value={item.descricao}
                  placeholder="Adicione detalhes sobre esta atividade..."
                  onChange={(e) => updateItem(itemKey, "descricao", e.target.value)}
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => handleRemoverClick(item)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover
                </button>

                <button
                  onClick={() => duplicarItem(item)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Duplicar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Etapa4Agenda;

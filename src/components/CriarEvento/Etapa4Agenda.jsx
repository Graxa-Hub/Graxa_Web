import React from "react";

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
});

const Etapa4Agenda = ({ agenda, setAgenda }) => {
 
  const adicionarItem = (tipo = TIPOS_ENUM.TECNICO) => {
    setAgenda((prev) => {
      const next = [...prev, makeEmptyItem(tipo)];
      return sortByInicio(next);
    });
  };

  const updateItem = (index, field, value) => {
    setAgenda((prev) => {
      const newAgenda = [...prev];
      newAgenda[index] = { ...newAgenda[index], [field]: value };

      if (field === "tipo" && value === TIPOS_ENUM.TECNICO) {
        newAgenda[index].origem = "";
        newAgenda[index].destino = "";
      }

      return sortByInicio(newAgenda);
    });
  };

  const removerItem = (index) => {
    setAgenda((prev) => prev.filter((_, i) => i !== index));
  };

  const sortByInicio = (lista) => {
    return lista.slice().sort((a, b) => {
      const ai = a.dataHoraInicio || "";
      const bi = b.dataHoraInicio || "";
      return ai.localeCompare(bi);
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900">Agenda do Evento</h2>

      <div className="flex gap-3">
        <button
          onClick={() => adicionarItem(TIPOS_ENUM.TECNICO)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Adicionar Técnico
        </button>

        <button
          onClick={() => adicionarItem(TIPOS_ENUM.DESLOCAMENTO)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Adicionar Deslocamento
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {agenda.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum item de agenda criado.</p>
        )}

        {agenda.map((item, index) => (
          <div
            key={item.id ?? index}
            className="bg-white p-5 rounded-xl shadow-md space-y-4 border border-gray-100"
          >
            {/* TIPO */}
            <div>
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mt-1
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={item.tipo}
                onChange={(e) => updateItem(index, "tipo", e.target.value)}
              >
                <option value={TIPOS_ENUM.TECNICO}>Técnico</option>
                <option value={TIPOS_ENUM.DESLOCAMENTO}>Deslocamento</option>
              </select>
            </div>

            {/* TITULO */}
            <div>
              <label className="text-sm font-medium text-gray-700">Título</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg mt-1
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={item.titulo}
                placeholder="Ex: Montagem de palco"
                onChange={(e) => updateItem(index, "titulo", e.target.value)}
              />
            </div>

            {/* ORIGEM / DESTINO (apenas Deslocamento) */}
            {item.tipo === TIPOS_ENUM.DESLOCAMENTO && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Origem</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={item.origem}
                    placeholder="Ex: Hotel X"
                    onChange={(e) => updateItem(index, "origem", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Destino</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={item.destino}
                    placeholder="Ex: Estádio Y"
                    onChange={(e) => updateItem(index, "destino", e.target.value)}
                  />
                </div>
              </>
            )}

            {/* DATA HORA INICIO */}
            <div>
              <label className="text-sm font-medium text-gray-700">Data e Hora - Início</label>
              <input
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={item.dataHoraInicio || ""}
                onChange={(e) => updateItem(index, "dataHoraInicio", e.target.value)}
              />
            </div>

            {/* DATA HORA FIM */}
            <div>
              <label className="text-sm font-medium text-gray-700">Data e Hora - Fim</label>
              <input
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={item.dataHoraFim || ""}
                onChange={(e) => updateItem(index, "dataHoraFim", e.target.value)}
              />
            </div>

            {/* DESCRIÇÃO */}
            <div>
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg mt-1
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                value={item.descricao}
                onChange={(e) => updateItem(index, "descricao", e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => removerItem(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Remover
              </button>

              {/* Botão pra copiar / duplicar item */}
              <button
                onClick={() =>
                  setAgenda((prev) => {
                    const copy = [...prev];
                    const itemToCopy = { ...copy[index], id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}` };
                    copy.splice(index + 1, 0, itemToCopy);
                    return sortByInicio(copy);
                  })
                }
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                Duplicar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Etapa4Agenda;

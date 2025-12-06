import React from "react";

const Etapa4Agenda = ({ agenda, setAgenda }) => {

  const emptyItem = {
    dataHora: "",   // datetime-local
    titulo: "",
    descricao: ""
  };

  const adicionarItem = () => {
    setAgenda([...agenda, emptyItem]);
  };

  const updateItem = (index, field, value) => {
    const newAgenda = [...agenda];
    newAgenda[index] = { ...newAgenda[index], [field]: value };

    // Ordena por data real (ISO ordena corretamente por string também)
    const sorted = newAgenda.sort((a, b) =>
      (a.dataHora || "").localeCompare(b.dataHora || "")
    );

    setAgenda(sorted);
  };

  const removerItem = (index) => {
    const newAgenda = agenda.filter((_, i) => i !== index);
    setAgenda(newAgenda);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900">Agenda do Evento</h2>

      <button
        onClick={adicionarItem}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Adicionar Item de Agenda
      </button>

      <div className="space-y-4 mt-8">
        {agenda.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-md space-y-4 border border-gray-100"
          >

            {/* DATA E HORA */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Data e Horário
              </label>
              <input
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={item.dataHora || ""}
                onChange={(e) => updateItem(index, "dataHora", e.target.value)}
              />
            </div>

            {/* TÍTULO */}
            <div>
              <label className="text-sm font-medium text-gray-700">Título</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg mt-1
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={item.titulo}
                placeholder="Ex: Passagem de som"
                onChange={(e) => updateItem(index, "titulo", e.target.value)}
              />
            </div>

            {/* DESCRIÇÃO */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg mt-1
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                value={item.descricao}
                onChange={(e) => updateItem(index, "descricao", e.target.value)}
              />
            </div>

            <button
              onClick={() => removerItem(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Etapa4Agenda;
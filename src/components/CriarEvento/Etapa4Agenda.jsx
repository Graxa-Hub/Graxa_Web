import React, { useState } from "react";

const Etapa4Agenda = ({ agenda, setAgenda }) => {
  const emptyItem = { hora: "", titulo: "", descricao: "" };

  const adicionarItem = () => {
    setAgenda([...agenda, emptyItem]);
  };

  const updateItem = (index, field, value) => {
    const newAgenda = [...agenda];
    newAgenda[index] = { ...newAgenda[index], [field]: value };

    // Ordenação automática por horário
    const sorted = newAgenda.sort((a, b) => a.hora.localeCompare(b.hora));

    setAgenda(sorted);
  };

  const removerItem = (index) => {
    const newAgenda = agenda.filter((_, i) => i !== index);
    setAgenda(newAgenda);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Agenda do Evento</h2>

      <button
        onClick={adicionarItem}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Adicionar Item de Agenda
      </button>

      <div className="space-y-4 mt-6">
        {agenda.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow space-y-4">

            {/* HORÁRIO */}
            <div>
              <label className="text-sm font-medium">Horário</label>
              <input
                type="time"
                className="w-full p-2 border rounded mt-1"
                value={item.hora}
                onChange={(e) => updateItem(index, "hora", e.target.value)}
              />
            </div>

            {/* TÍTULO */}
            <div>
              <label className="text-sm font-medium">Título</label>
              <input
                className="w-full p-2 border rounded mt-1"
                value={item.titulo}
                placeholder="Ex: Passagem de som"
                onChange={(e) => updateItem(index, "titulo", e.target.value)}
              />
            </div>

            {/* DESCRIÇÃO */}
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <textarea
                className="w-full p-2 border rounded mt-1"
                rows="2"
                value={item.descricao}
                onChange={(e) => updateItem(index, "descricao", e.target.value)}
              />
            </div>

            <button
              onClick={() => removerItem(index)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
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

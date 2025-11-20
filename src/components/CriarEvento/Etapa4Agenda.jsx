import React from "react";

const Etapa4Agenda = ({ agenda, setAgenda }) => {
  const addItem = () => {
    setAgenda([
      ...agenda,
      { id: Date.now(), horario: "", titulo: "", descricao: "" }
    ]);
  };

  const updateItem = (index, field, value) => {
    const newList = [...agenda];
    newList[index][field] = value;
    setAgenda(newList);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Agenda do Evento</h2>

      <button
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
        onClick={addItem}
      >
        Adicionar Atividade
      </button>

      <div className="space-y-4 mt-4">
        {agenda.map((item, index) => (
          <div key={item.id} className="bg-white p-6 shadow rounded-lg">

            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder="Horário"
              value={item.horario}
              onChange={(e) =>
                updateItem(index, "horario", e.target.value)
              }
            />

            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder="Título"
              value={item.titulo}
              onChange={(e) =>
                updateItem(index, "titulo", e.target.value)
              }
            />

            <textarea
              className="w-full p-2 border rounded"
              placeholder="Descrição"
              value={item.descricao}
              rows={3}
              onChange={(e) =>
                updateItem(index, "descricao", e.target.value)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Etapa4Agenda;

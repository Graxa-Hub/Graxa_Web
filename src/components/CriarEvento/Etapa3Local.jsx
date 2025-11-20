import React from "react";

const Etapa3Local = ({ localShow, setLocalShow }) => {
  const updateField = (field, value) => {
    setLocalShow({ ...localShow, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Local do Evento</h2>

      <div className="bg-white shadow p-6 rounded-lg space-y-4">
        <div>
          <label className="text-sm">Nome do Local</label>
          <input
            className="w-full mt-1 p-2 border rounded"
            value={localShow.nome || ""}
            onChange={(e) => updateField("nome", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Endereço Completo</label>
          <input
            className="w-full mt-1 p-2 border rounded"
            value={localShow.endereco || ""}
            onChange={(e) => updateField("endereco", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Observações</label>
          <textarea
            className="w-full mt-1 p-2 border rounded"
            rows="4"
            value={localShow.obs || ""}
            onChange={(e) => updateField("obs", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Etapa3Local;

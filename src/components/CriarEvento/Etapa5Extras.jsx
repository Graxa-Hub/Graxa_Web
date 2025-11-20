import React from "react";

const Etapa5Extras = ({ extras, setExtras }) => {
  const updateField = (field, value) => {
    setExtras({ ...extras, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Informações Extras</h2>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <div>
          <label className="text-sm">Observações Gerais</label>
          <textarea
            className="w-full p-2 mt-1 border rounded"
            rows="5"
            value={extras.obs || ""}
            onChange={(e) => updateField("obs", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Contatos Importantes</label>
          <textarea
            className="w-full p-2 mt-1 border rounded"
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

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
    <div className="space-y-8">

      {/* BOTÃO SALVAR NO TOPO */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Salvar Extras
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-900">Informações Extras</h2>

      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-gray-100">

        <div>
          <label className="text-sm font-medium text-gray-700">Observações Gerais</label>
          <textarea
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="5"
            value={extras.obs || ""}
            onChange={(e) => updateField("obs", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Contatos Importantes</label>
          <textarea
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

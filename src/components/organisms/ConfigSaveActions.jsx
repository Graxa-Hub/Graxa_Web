import React from "react";
import { Save } from "lucide-react";

export const ConfigSaveActions = ({ handleSave, loading }) => {
  return (
    <div className="flex justify-end">
      <button
        onClick={handleSave}
        className="btn-primary inline-flex items-center gap-2"
        disabled={loading}
      >
        <Save size={16} />
        {loading ? "Salvando..." : "Salvar alterações"}
      </button>
    </div>
  );
};

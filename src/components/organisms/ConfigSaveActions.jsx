import React from "react";
import { Save } from "lucide-react";

export const ConfigSaveActions = ({ handleSave, loading }) => {
    return (
        <div className="flex justify-end pt-4 border-t">
            <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                disabled={loading}
            >
                <Save size={16} />
                {loading ? "Salvando..." : "Salvar alterações"}
            </button>
        </div>
    );
};

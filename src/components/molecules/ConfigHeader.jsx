import { Settings } from "lucide-react";

export const ConfigHeader = () => {
    return (
        <div className="border-b pb-3 flex items-center gap-3">
            <Settings size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold">Configurações do Usuário</h1>
        </div>
    );
};
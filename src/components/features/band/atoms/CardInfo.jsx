import { Users, UserCheck } from "lucide-react";

export function CardInfo({ nome, representante, integrantes, genero }) {
    return (
        <div className="p-4 space-y-2">
            <h3 className="font-bold text-gray-900 text-lg truncate">{nome}</h3>

            {genero && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-full">
                    {genero}
                </span>
            )}

            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <UserCheck className="w-3.5 h-3.5" />
                <span className="truncate">{representante || "Sem representante"}</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Users className="w-3.5 h-3.5" />
                <span>{integrantes || 0} integrante{integrantes !== 1 ? "s" : ""}</span>
            </div>
        </div>
    )
}

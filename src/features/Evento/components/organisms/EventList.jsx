import { MapPin } from "lucide-react";

export const EventList = ({ dadosEvento }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">
                {dadosEvento.nomeEvento}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">{dadosEvento.nomeLocal}</p>
            </div>
        </div>
    )
}
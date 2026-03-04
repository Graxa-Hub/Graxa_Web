import { Edit2 } from "lucide-react";

export const EventEditButton = ({ onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm shadow-md"
        >
            <Edit2 size={16} />
            {label}
        </button>
    )
}
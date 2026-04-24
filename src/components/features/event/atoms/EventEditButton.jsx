import { Edit2 } from "lucide-react";
export const EventEditButton = ({ onClick, label = "Editar" }) => (
    <button onClick={onClick} className="btn-primary flex items-center gap-2 px-5 py-2">
        <Edit2 size={14} />{label}
    </button>
);

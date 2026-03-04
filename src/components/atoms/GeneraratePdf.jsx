import { FileDown } from "lucide-react";

export const GeneratePdf = ({ onClick, disabled, title, label }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            title={title}
        >
            <FileDown size={16} />
            {label}
        </button>
    )
}
import { MoreVertical } from "lucide-react";

export const OptionButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
        >
            <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
    )
}

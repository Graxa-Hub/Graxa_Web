import { MoreVertical } from "lucide-react";
import { ActionMenu } from "../molecules/ActionMenu";

export const List = ({
    title,
    description,
    image,
    isSelected,
    onClick,
    onToggleMenu,
    isMenuOpen,
    menuItems
}) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center w-full gap-4 p-4 bg-white hover:bg-neutral-100 rounded-md shadow-lg transition-all duration-200 border cursor-pointer ${isSelected ? 'border-red-500 border-2' : 'border-gray-200'
                } hover:border-red-300`}
        >
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "/default-turne-image.jpg"; // Garante fallback se falhar
                    }}
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>

            <div className="relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleMenu();
                    }}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
                {/* Renderiza o componente de menu (como o BandShowOptions) diretamente */}
                {menuItems}
            </div>
        </div>
    );
};
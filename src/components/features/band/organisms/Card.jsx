import { DropdownActions } from "../../molecules/DropdownActions";
import { useNavigate } from "react-router-dom";
import { OptionButton } from "../atoms/OptionButton";
import { CardImage } from "../atoms/CardImage";
import { CardInfo } from "../atoms/CardInfo";

export function Card({ banda, onEdit, onDelete, isDropdownOpen, onToggleDropdown, onVisualizar }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/turne/${banda.id}`);
    };

    return (
        <div
            className="group bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer border border-gray-100"
            onClick={handleCardClick}
        >
            <OptionButton
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleDropdown();
                }}
            />

            <DropdownActions
                isOpen={isDropdownOpen}
                entity={banda}
                onView={onVisualizar}
                onEdit={onEdit}
                onDelete={onDelete}
                entityType="banda"
            />

            <CardImage src={banda.imagemUrl} alt={banda.nome} />

            <CardInfo
                nome={banda.nome}
                representante={banda.representante?.nome}
                integrantes={banda.integrantes?.length}
                genero={banda.genero}
            />
        </div>
    );
}

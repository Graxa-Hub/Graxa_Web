import { Eye, Edit, Trash2 } from "lucide-react";
import { ActionMenu } from "../molecules/ActionMenu";
import { useNavigate } from "react-router-dom";
import { OptionButton } from "../atoms/OptionButton";
import { CardImage } from "../atoms/CardImage";
import { CardInfo } from "../atoms/CardInfo";

export function Card({ banda, onEdit, onDelete, isDropdownOpen, onToggleDropdown, onVisualizar }) {
    const navigate = useNavigate();

    const dropdownItems = [
        {
            icon: Eye,
            label: "Visualizar",
            onClick: (e) => {
                e.stopPropagation();
                onVisualizar(banda);
            }
        },
        {
            icon: Edit,
            label: "Editar banda",
            onClick: (e) => {
                e.stopPropagation();
                onEdit(banda);
            }
        },
        {
            icon: Trash2,
            label: "Excluir banda",
            onClick: (e) => {
                e.stopPropagation();
                onDelete(banda);
            }
        }
    ];

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

            <ActionMenu isOpen={isDropdownOpen} items={dropdownItems} />

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

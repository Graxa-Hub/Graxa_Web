import { ActionMenu } from "./ActionMenu";
import { Eye, Edit, Trash2 } from "lucide-react";

/**
 * DropdownActions - Componente reutilizável para dropdown de ações (Visualizar, Editar, Deletar)
 * Design consistente com turnes
 */
export const DropdownActions = ({ isOpen, entity, onView, onEdit, onDelete, entityType = "item" }) => {
    const dropdownItems = [
        {
            icon: Eye,
            label: "Visualizar",
            onClick: (e) => {
                e.stopPropagation();
                onView(entity);
            }
        },
        {
            icon: Edit,
            label: "Editar",
            onClick: (e) => {
                e.stopPropagation();
                onEdit(entity);
            }
        },
        {
            icon: Trash2,
            label: "Excluir",
            onClick: (e) => {
                e.stopPropagation();
                onDelete(entity);
            }
        }
    ];

    return (
        <ActionMenu actions={dropdownItems} />
    );
};

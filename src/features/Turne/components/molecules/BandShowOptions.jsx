import { ActionMenu } from "../../../../components/molecules/ActionMenu";
import { Eye, Edit, Trash2 } from "lucide-react";

export const BandShowOptions = ({ isOpen, entity, onView, onEdit, onDelete, label }) => {
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
            label: `Editar ${label}`,
            onClick: (e) => {
                e.stopPropagation();
                onEdit(entity);
            }
        },
        {
            icon: Trash2,
            label: `Excluir ${label}`,
            onClick: (e) => {
                e.stopPropagation();
                onDelete(entity);
            }
        }
    ]

    return (
        <ActionMenu isOpen={isOpen} items={dropdownItems} />
    )
}
import { ActionMenu } from "./ActionMenu";
import { Eye, Edit, Trash2 } from "lucide-react";

export function BandShowOptions({ entity, onView, onEdit, onDelete, label }) {
  const dropdownItems = [
    {
      icon: Eye,
      label: "Visualizar",
      onClick: (e) => {
        e.stopPropagation();
        onView(entity);
      },
    },
    {
      icon: Edit,
      label: `Editar ${label}`,
      onClick: (e) => {
        e.stopPropagation();
        onEdit(entity);
      },
    },
    {
      icon: Trash2,
      label: `Excluir ${label}`,
      onClick: (e) => {
        e.stopPropagation();
        onDelete(entity);
      },
    },
  ];

  return <ActionMenu actions={dropdownItems} />;
}

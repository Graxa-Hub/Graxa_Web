import { Card } from "./Card";
import { EmptyState } from "../molecules/EmptyState";
import { useNavigate } from "react-router-dom";

export function BandasGrid({
  bandas,
  onEdit,
  onDelete,
  onVisualizar,
  onAddBanda,
  openDropdown,
  onToggleDropdown,
}) {
  const navigate = useNavigate();

  if (bandas.length === 0) {
    return <EmptyState onAdd={onAddBanda} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {bandas.map((banda) => (
        <Card
          key={banda.id}
          banda={banda}
          onClick={() => navigate(`/turne/${banda.id}`)}
          onEdit={onEdit}
          onDelete={onDelete}
          isDropdownOpen={openDropdown === banda.id}
          onToggleDropdown={() => onToggleDropdown(banda.id)}
          onVisualizar={onVisualizar}
        />
      ))}
    </div>
  );
}

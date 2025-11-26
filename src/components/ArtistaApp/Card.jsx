import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { DropdownMenu } from "../../components/DropdownMenu";
import { useNavigate } from "react-router-dom";

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
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden relative cursor-pointer"
      onClick={handleCardClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleDropdown();
        }}
        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
      >
        <MoreVertical className="w-5 h-5 text-gray-700" />
      </button>

      <div className="absolute top-14 right-4 z-30">
        <DropdownMenu isOpen={isDropdownOpen} items={dropdownItems} />
      </div>

      <div className="max-h-80 min-h-80 bg-gray-200 flex items-center justify-center overflow-hidden">
        {banda.imagemUrl ? (
          <img
            src={banda.imagemUrl}
            alt={banda.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=Erro';
            }}
          />
        ) : (
          <span className="text-gray-400 font-semibold">Sem foto</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{banda.nome}</h3>
        <p className="text-xs text-gray-500 mb-1">
          Representante: {banda.representante?.nome || "N/A"}
        </p>
        <p className="text-xs text-gray-400">
          {banda.integrantes?.length || 0} integrante(s)
        </p>
      </div>
    </div>
  );
}

export function CardList({ banda, onEdit, onDelete, onVisualizar }) {
  const navigate = useNavigate();

  const handleEdit = (banda) => {
    navigate(`/turne/${banda.id}`);
  };

  const handleDeleteClick = (banda) => {
    onDelete(banda);
  };

  const toggleDropdown = (bandaId) => {
    // toggle the dropdown for the banda with id bandaId
  };

  const openDropdown = banda.id;

  return (
    <div>
      {banda.map((banda) => (
        <Card
          key={banda.id}
          banda={banda}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isDropdownOpen={openDropdown === banda.id}
          onToggleDropdown={() => toggleDropdown(banda.id)}
          onVisualizar={setBandaVisualizar}
        />
      ))}
    </div>
  );
}
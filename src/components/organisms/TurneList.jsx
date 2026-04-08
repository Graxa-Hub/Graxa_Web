import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { List } from "../molecules/List";
import { EmptyState } from "../molecules/EmptyState";
import { ConfirmModal } from "../molecules/ConfirmModal";
import { BandShowOptions } from "../molecules/BandShowOptions";
import { VisualizarTurneModal } from "../VisualizarTurneModal";

export function TurneList({
  turnes = [],
  onEditTurne,
  onDeleteTurne,
  onCreateTurne,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedTurne, setSelectedTurne] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    turne: null,
  });
  const [turneVisualizar, setTurneVisualizar] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (turneId) => {
    setOpenDropdown(openDropdown === turneId ? null : turneId);
    setSelectedTurne(turneId);
  };

  const handleTurneClick = (turne) => {
    navigate(`/calendario?bandaId=${turne.bandaId}&turneId=${turne.id}`);
  };

  const handleEdit = (turne) => {
    setOpenDropdown(null);
    if (onEditTurne) {
      onEditTurne(turne);
    }
  };

  const handleDeleteClick = (turne) => {
    setOpenDropdown(null);
    setConfirmModal({ isOpen: true, turne });
  };

  const handleConfirmDelete = () => {
    if (confirmModal.turne && onDeleteTurne) {
      onDeleteTurne(confirmModal.turne);
    }
    setConfirmModal({ isOpen: false, turne: null });
  };

  const handleVisualizarTurne = (turne) => {
    setOpenDropdown(null);
    setTurneVisualizar(turne);
  };

  if (turnes.length === 0) {
    return <EmptyState onAdd={onCreateTurne} />;
  }

  return (
    <>
      <div className="space-y-4 w-full mx-auto py-8">
        {turnes.map((turne) => {
          const isSelected = selectedTurne === turne.id;

          return (
            <div key={turne.id} className="relative">
              <List
                title={turne.name}
                description={turne.description}
                image={turne.image}
                isSelected={isSelected}
                onClick={() => handleTurneClick(turne)}
                onOptions={() => toggleDropdown(turne.id)}
              />

              {openDropdown === turne.id && (
                <div
                  className="absolute top-14 right-2 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BandShowOptions
                    entity={turne}
                    onView={handleVisualizarTurne}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    label="Turne"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, turne: null })}
        onConfirm={handleConfirmDelete}
        title="Excluir turne"
        message={`Tem certeza que deseja excluir a turne "${confirmModal.turne?.name}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {turneVisualizar && (
        <VisualizarTurneModal
          turne={turneVisualizar}
          onClose={() => setTurneVisualizar(null)}
        />
      )}
    </>
  );
}

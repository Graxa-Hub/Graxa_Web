import { useState } from 'react'
import { List } from '../molecules/List'
import { EmptyState } from '../molecules/EmptyState'
import { ConfirmModal } from '../molecules/ConfirmModal'
import { useNavigate } from "react-router-dom";
import { VisualizarTurneModal } from "./VisualizarTurneModal";
import { DropdownActions } from '../../molecules/DropdownActions';

export function TurneList({ turnes = [], onEditTurne, onDeleteTurne, onCreateTurne }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [selectedTurne, setSelectedTurne] = useState(null)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    turne: null
  })
  const [turneVisualizar, setTurneVisualizar] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (turneId) => {
    setOpenDropdown(openDropdown === turneId ? null : turneId)
    setSelectedTurne(turneId)
  }

  const handleTurneClick = (turne) => {
    navigate(`/calendario?bandaId=${turne.bandaId}&turneId=${turne.id}`);
  }

  const handleEdit = (turne) => {
    setOpenDropdown(null)
    if (onEditTurne) {
      onEditTurne(turne)
    }
  }

  const handleDeleteClick = (turne) => {
    setOpenDropdown(null)
    setConfirmModal({ isOpen: true, turne: turne })
  }

  const handleConfirmDelete = () => {
    if (confirmModal.turne && onDeleteTurne) {
      onDeleteTurne(confirmModal.turne)
    }
    setConfirmModal({ isOpen: false, turne: null })
  }

  const handleVisualizarTurne = (turne) => {
    setOpenDropdown(null);
    setTurneVisualizar(turne);
  }

  if (turnes.length === 0) {
    return <EmptyState onAdd={onCreateTurne} />
  }

  return (
    <>
      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 mt-8 pb-4">
        <div className="space-y-4 w-full mx-auto">
          {turnes.map((turne) => {
            const isSelected = selectedTurne === turne.id

            return (
              <List
                key={turne.id}
                title={turne.name}
                description={turne.description}
                image={turne.image}
                isSelected={isSelected}
                onClick={() => handleTurneClick(turne)}
                onToggleMenu={() => toggleDropdown(turne.id)}
                isMenuOpen={openDropdown === turne.id}
                menuItems={
                  <DropdownActions
                    isOpen={openDropdown === turne.id}
                    entity={turne}
                    onView={handleVisualizarTurne}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    entityType="turne"
                  />
                }
              />
            )
          })}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, turne: null })}
        onConfirm={handleConfirmDelete}
        title="Excluir turnê"
        message={`Tem certeza que deseja excluir a turnê "${confirmModal.turne?.name}"?`}
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
  )
}
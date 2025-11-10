import React, { useState } from 'react'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import { ButtonPage } from './ButtonPage.Jsx'
import { DropdownMenu } from './DropdownMenu'
import { ConfirmModal } from './ConfirmModal'

export function TurneList({ turnes = [], onEditTurne, onDeleteTurne, onCreateTurne}) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [selectedTurne, setSelectedTurne] = useState(null)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    turne: null
  })

  const toggleDropdown = (turneId) => {
    setOpenDropdown(openDropdown === turneId ? null : turneId)
    setSelectedTurne(turneId)
  }

  const handleTurneClick = (turneId) => {
    setSelectedTurne(turneId)
    setOpenDropdown(null)
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

  if (turnes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full text-center">
        <p className="text-gray-600 mb-6 max-w-md">
          Vixi! Ainda não temos nenhuma turnê criada. Que tal adicionar uma agora?
        </p>
        <ButtonPage text="Criar turne" click={onCreateTurne} />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 flex items-center justify-center flex-col">
        {turnes.map((turne) => {
          const isSelected = selectedTurne === turne.id
          const dropdownItems = [
            { icon: Edit, label: "Editar turne", onClick: () => handleEdit(turne) },
            { icon: Trash2, label: "Excluir turne", onClick: () => handleDeleteClick(turne) }
          ]

          return (
            <div
              key={turne.id}
              onClick={() => handleTurneClick(turne.id)}
              className={`flex items-center gap-4 p-4 bg-white rounded-2xl shadow-2xl w-300 border cursor-pointer ${
                isSelected ? 'border-red-500 border-2' : 'border-gray-200'
              } transition-colors hover:border-red-300`}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={turne.image}
                  alt={turne.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "/default-turne-image.jpg"}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <h3 className="font-medium text-gray-900">{turne.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{turne.description}</p>
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleDropdown(turne.id)
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
                <DropdownMenu isOpen={openDropdown === turne.id} items={dropdownItems} />
              </div>
            </div>
          )
        })}
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
    </>
  )
}
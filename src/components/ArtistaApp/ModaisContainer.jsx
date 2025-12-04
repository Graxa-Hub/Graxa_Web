import React from 'react';
import { AddBandaModal } from './AddBandaModal';
import { ConfirmModal } from '../ConfirmModal';
import { VisualizarBandaModal } from './VisualizarBandaModal';

export function ModaisContainer({
  isModalOpen,
  onCloseModal,
  onBandaCreated,
  criarBanda,
  atualizarBanda,
  adicionarIntegrantes,
  bandaParaEditar,
  confirmModal,
  onCloseConfirmModal,
  onConfirmDelete,
  bandaVisualizar,
  onCloseBandaVisualizar
}) {
  return (
    <>
      {isModalOpen && (
        <AddBandaModal
          onSuccess={onBandaCreated}
          onClose={onCloseModal}
          criarBanda={criarBanda}
          atualizarBanda={atualizarBanda}
          adicionarIntegrantes={adicionarIntegrantes}
          bandaParaEditar={bandaParaEditar}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={onCloseConfirmModal}
        onConfirm={onConfirmDelete}
        title="Excluir banda"
        message={`Tem certeza que deseja excluir a banda "${confirmModal.banda?.nome}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {bandaVisualizar && (
        <VisualizarBandaModal
          banda={bandaVisualizar}
          onClose={onCloseBandaVisualizar}
        />
      )}
    </>
  );
}
import { useState, useCallback } from 'react';
import { useBandas } from './useBandas';

export function useArtistaApp() {
  const { 
    bandas, 
    loading, 
    listarBandas, 
    criarBanda, 
    atualizarBanda, 
    excluirBanda, 
    adicionarIntegrantes 
  } = useBandas();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bandaParaEditar, setBandaParaEditar] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    banda: null
  });
  const [bandaVisualizar, setBandaVisualizar] = useState(null);

  const openModal = useCallback(() => {
    setBandaParaEditar(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setBandaParaEditar(null);
  }, []);

  const onBandaCreated = useCallback(async () => {
    closeModal();
    try {
      await listarBandas();
    } catch (err) {
      console.error("Erro ao atualizar lista de bandas após criação:", err);
    }
  }, [closeModal, listarBandas]);

  const handleEdit = useCallback((banda) => {
    setBandaParaEditar(banda);
    setIsModalOpen(true);
    setOpenDropdown(null);
  }, []);

  const handleDeleteClick = useCallback((banda) => {
    setConfirmModal({ isOpen: true, banda });
    setOpenDropdown(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (confirmModal.banda) {
      try {
        await excluirBanda(confirmModal.banda.id);
        await listarBandas();
      } catch (error) {
        console.error("Erro ao excluir banda:", error);
        alert("Erro ao excluir banda. Tente novamente.");
      }
    }
    setConfirmModal({ isOpen: false, banda: null });
  }, [confirmModal.banda, excluirBanda, listarBandas]);

  const toggleDropdown = useCallback((bandaId) => {
    setOpenDropdown(openDropdown === bandaId ? null : bandaId);
  }, [openDropdown]);

  return {
    // Estados
    bandas,
    loading,
    isModalOpen,
    openDropdown,
    bandaParaEditar,
    confirmModal,
    bandaVisualizar,
    
    // Funções principais
    listarBandas,
    criarBanda,
    atualizarBanda,
    adicionarIntegrantes,
    
    // Handlers
    openModal,
    closeModal,
    onBandaCreated,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    toggleDropdown,
    setBandaVisualizar,
    setConfirmModal
  };
}
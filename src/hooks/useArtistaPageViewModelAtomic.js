import { useCallback, useEffect, useState } from "react";
import { useBandas } from "./useBandas";

export function useArtistaPageViewModelAtomic() {
  const {
    bandas,
    loading,
    pagination,
    buscaAtiva,
    listarBandasPaginadas,
    buscarBandas,
    nextPage,
    prevPage,
    goToPage,
    criarBanda,
    atualizarBanda,
    excluirBanda,
    adicionarIntegrantes,
  } = useBandas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bandaParaEditar, setBandaParaEditar] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, banda: null });
  const [bandaVisualizar, setBandaVisualizar] = useState(null);
  const [selectedBanda, setSelectedBanda] = useState(null);
  const [selectedTurne, setSelectedTurne] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    listarBandasPaginadas();
  }, [listarBandasPaginadas]);

  // ─── Busca ─────────────────────────────────────────────────────────────────
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      buscarBandas(query);
    },
    [buscarBandas]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    buscarBandas("");
  }, [buscarBandas]);

  // ─── Modal ─────────────────────────────────────────────────────────────────
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
      await listarBandasPaginadas();
    } catch (err) {
      console.error("Erro ao atualizar lista de bandas após criação:", err);
    }
  }, [closeModal, listarBandasPaginadas]);

  // ─── Ações ─────────────────────────────────────────────────────────────────
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
        await listarBandasPaginadas();
      } catch (error) {
        console.error("Erro ao excluir banda:", error);
        alert("Erro ao excluir banda. Tente novamente.");
      }
    }
    setConfirmModal({ isOpen: false, banda: null });
  }, [confirmModal.banda, excluirBanda, listarBandasPaginadas]);

  const toggleDropdown = useCallback((bandaId) => {
    setOpenDropdown((prev) => (prev === bandaId ? null : bandaId));
  }, []);

  const handleVisualizar = useCallback((banda) => {
    setBandaVisualizar(banda);
    setOpenDropdown(null);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, banda: null });
  }, []);

  const closeBandaVisualizar = useCallback(() => {
    setBandaVisualizar(null);
  }, []);

  return {
    bandas,
    loading,
    pagination,
    buscaAtiva,
    searchQuery,
    selectedBanda,
    selectedTurne,
    setSelectedBanda,
    setSelectedTurne,
    nextPage,
    prevPage,
    goToPage,
    openDropdown,
    toggleDropdown,
    openModal,
    handleEdit,
    handleDeleteClick,
    handleVisualizar,
    isModalOpen,
    closeModal,
    onBandaCreated,
    criarBanda,
    atualizarBanda,
    adicionarIntegrantes,
    bandaParaEditar,
    confirmModal,
    closeConfirmModal,
    handleConfirmDelete,
    bandaVisualizar,
    closeBandaVisualizar,
    handleSearch,
    handleClearSearch,
  };
}
import { useMemo, useState, useEffect, useCallback } from "react";
import { useBandas } from "../../../hooks/useBandas";
import { useTurnes } from "../../../hooks/useTurnes";
import { useTurneForm } from "../../../hooks/useTurneForm";
import { deletarTurne } from "../../../services/turneService";
import { useParams } from "react-router-dom";

export function useTurneViewModel() {
  const { bandaId } = useParams();
  const { bandas, loading: bandasLoading, listarBandas } = useBandas();
  const {
    turnes,
    loading: turnesLoading,
    pagination,
    listarTurnesPaginadas,
    nextPage,
    prevPage,
    goToPage,
  } = useTurnes();

  const [selectedBand, setSelectedBand] = useState(null);
  const [errorHeader, setErrorHeader] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTurne, setEditingTurne] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await listarBandas();
      await listarTurnesPaginadas(); // Usa DEFAULT_PAGE_SIZE do hook
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (bandaId && bandas.length > 0) {
      const banda = bandas.find((b) => String(b.id) === String(bandaId));
      if (banda) setSelectedBand(banda);
    }
  }, [bandaId, bandas]);

  const filteredTurnes = useMemo(() => {
    if (selectedBand && selectedBand.id) {
      return turnes
        .filter((t) => {
          const bandaTurne = t.bandaId || t.banda?.id || t.raw?.bandaId || t.raw?.banda?.id;
          return bandaTurne === selectedBand.id;
        })
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return turnes.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [turnes, selectedBand]);

  const handleBandSelect = useCallback((banda) => {
    setSelectedBand(banda);
  }, []);

  const handleCreateTurne = useCallback(() => {
    setIsEditMode(false);
    setEditingTurne(null);
    setIsModalOpen(true);
  }, []);

  const handleEditTurne = useCallback((turne) => {
    setIsEditMode(true);
    setEditingTurne(turne);
    setIsModalOpen(true);
  }, []);

  const handleDeleteTurne = useCallback(async (turne) => {
    try {
      await deletarTurne(turne.id);
      await listarTurnesPaginadas(pagination.pageNumber, pagination.pageSize);
    } catch (error) {
      console.error("Erro ao excluir turnê:", error);
      setErrorHeader(error.response?.data?.mensagem || "Erro ao excluir turnê");
    }
  }, [pagination, listarTurnesPaginadas]);

  const handleSuccess = useCallback(async () => {
    setIsModalOpen(false);
    await listarTurnesPaginadas(pagination.pageNumber, pagination.pageSize);
  }, [pagination, listarTurnesPaginadas]);

  const {
    formData,
    errors,
    submitLoading,
    selectedStartDate,
    selectedEndDate,
    imagemAtual,
    bandaSearchText,
    showBandaDropdown,
    setBandaSearchText,
    setShowBandaDropdown,
    handleDateSelect,
    handleFinishTurne,
    handleBandaSelectInModal,
    handleChange,
    validateStep1,
  } = useTurneForm({
    onSuccess: handleSuccess,
    turnesData: filteredTurnes,
    isEditMode,
    editingTurne,
    selectedBand,
  });

  const filteredBandasForm = useMemo(() => {
    if (!bandaSearchText.trim()) return bandas;
    return bandas.filter((banda) =>
      banda.nome.toLowerCase().includes(bandaSearchText.toLowerCase()),
    );
  }, [bandas, bandaSearchText]);

  const isPageLoading = turnesLoading || bandasLoading;

  const closeModal = () => setIsModalOpen(false);

  const modalTitle = isEditMode ? "Editar Turnê" : "Criar Turnê";

  const validateModalStep = (step) => (step === 1 ? validateStep1() : true);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const getSelectedBandaName = () => {
    if (!formData.bandaId) return "";
    const banda = bandas.find((b) => b.id === formData.bandaId);
    return banda ? banda.nome : "";
  };

  const handleInputChange = (field, value) => {
    handleChange(field, value);
  };

  return {
    bandas,
    selectedBand,
    isPageLoading,
    isModalOpen,
    isEditMode,
    errorHeader,
    filteredTurnes,
    pagination,
    formData,
    errors,
    submitLoading,
    selectedStartDate,
    selectedEndDate,
    imagemAtual,
    bandaSearchText,
    showBandaDropdown,
    filteredBandasForm,
    modalTitle,
    handleBandSelect,
    handleCreateTurne,
    handleEditTurne,
    handleDeleteTurne,
    closeModal,
    handleFinishTurne,
    validateModalStep,
    setBandaSearchText,
    setShowBandaDropdown,
    handleBandaSelectInModal,
    handleDateSelect,
    formatDate,
    getSelectedBandaName,
    handleInputChange,
    handleChange,
    nextPage,
    prevPage,
    goToPage,
  };
}

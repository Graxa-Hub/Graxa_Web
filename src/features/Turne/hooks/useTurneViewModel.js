import { useMemo } from "react";
import { useTurnePage } from "../../../hooks/useTurnePage";
import { useTurneForm } from "../../../hooks/useTurneForm";

export function useTurneViewModel() {
  const {
    bandas,
    bandasLoading,
    selectedBand,
    loading,
    isModalOpen,
    isEditMode,
    editingTurne,
    errorHeader,
    filteredTurnes,
    setIsModalOpen,
    handleBandSelect,
    handleCreateTurne,
    handleEditTurne,
    handleDeleteTurne,
    handleSuccess,
  } = useTurnePage();

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

  const isPageLoading = loading || bandasLoading;

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
  };
}

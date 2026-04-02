import React, { useMemo } from "react";
import { Layout } from "../components/templates/Layout";
import { Modal } from "../components/ModalEventos/Modal";
import { TurneList } from "../features/Turne/components/organisms/TurneList";
import { TurneHeader } from "../features/Turne/components/molecules/TurneHeader";
import { TurneMainForm } from "../features/Turne/components/organisms/TurneMainForm";
import { TurneDetailForm } from "../features/Turne/components/organisms/TurneDetailForm";
import { TurneError } from "../features/Turne/components/atoms/TurneError";
import { useTurnePage } from "../hooks/useTurnePage";
import { useTurneForm } from "../hooks/useTurneForm";
import { LoadingState } from "../components/molecules/LoadingState";

export function Turne() {
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

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const getSelectedBandaName = () => {
    if (!formData.bandaId) return "";
    const banda = bandas.find((b) => b.id === formData.bandaId);
    return banda ? banda.nome : "";
  };

  if (loading || bandasLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <LoadingState message="Carregando turnes..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TurneHeader
        bandas={bandas}
        selectedBand={selectedBand}
        onBandSelect={handleBandSelect}
        onAddTurne={handleCreateTurne}
      />

      {errorHeader && <TurneError error={errorHeader} />}

      <TurneList
        turnes={filteredTurnes}
        onEditTurne={handleEditTurne}
        onDeleteTurne={handleDeleteTurne}
        onCreateTurne={handleCreateTurne}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFinish={handleFinishTurne}
        title={isEditMode ? "Editar Turnê" : "Criar Turnê"}
        totalSteps={2}
        size="lg"
        onValidate={(step) => (step === 1 ? validateStep1() : true)}
      >
        {(currentStep) => {
          switch (currentStep) {
            case 1:
              return (
                <TurneMainForm
                  formData={formData}
                  errors={errors}
                  submitLoading={submitLoading}
                  bandaSearchText={bandaSearchText}
                  showBandaDropdown={showBandaDropdown}
                  filteredBandas={filteredBandasForm}
                  selectedStartDate={selectedStartDate}
                  selectedEndDate={selectedEndDate}
                  handleInputChange={(field, value) =>
                    handleChange(field, value)
                  }
                  setBandaSearchText={setBandaSearchText}
                  setShowBandaDropdown={setShowBandaDropdown}
                  handleBandaSelectInModal={handleBandaSelectInModal}
                  handleDateSelect={handleDateSelect}
                  formatDate={formatDate}
                  getSelectedBandaName={getSelectedBandaName}
                />
              );
            case 2:
              return (
                <TurneDetailForm
                  formData={formData}
                  errors={errors}
                  submitLoading={submitLoading}
                  isEditMode={isEditMode}
                  imagemAtual={imagemAtual}
                  handleInputChange={(field, value) =>
                    handleChange(field, value)
                  }
                  handleChange={handleChange}
                />
              );
            default:
              return <div>Etapa não encontrada</div>;
          }
        }}
      </Modal>
    </Layout>
  );
}

import React from "react";
import { Layout } from "../components/templates/Layout";
import { Modal } from "../components/ModalEventos/Modal";
import { TurneList } from "../features/Turne/components/organisms/TurneList";
import { TurneHeader } from "../features/Turne/components/molecules/TurneHeader";
import { TurneFormSteps } from "../features/Turne/components/organisms/TurneFormSteps";
import { TurneError } from "../features/Turne/components/atoms/TurneError";
import { useTurneViewModel } from "../features/Turne/hooks/useTurneViewModel";
import { LoadingState } from "../components/molecules/LoadingState";

export function Turne() {
  const {
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
    handleDateSelect,
    handleBandaSelectInModal,
    formatDate,
    getSelectedBandaName,
    handleInputChange,
    handleChange,
  } = useTurneViewModel();

  if (isPageLoading) {
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
        onClose={closeModal}
        onFinish={handleFinishTurne}
        title={modalTitle}
        totalSteps={2}
        size="lg"
        onValidate={validateModalStep}
      >
        {(currentStep) => (
          <TurneFormSteps
            currentStep={currentStep}
            formData={formData}
            errors={errors}
            submitLoading={submitLoading}
            bandaSearchText={bandaSearchText}
            showBandaDropdown={showBandaDropdown}
            filteredBandas={filteredBandasForm}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            setBandaSearchText={setBandaSearchText}
            setShowBandaDropdown={setShowBandaDropdown}
            handleBandaSelectInModal={handleBandaSelectInModal}
            handleDateSelect={handleDateSelect}
            formatDate={formatDate}
            getSelectedBandaName={getSelectedBandaName}
            handleInputChange={handleInputChange}
            handleChange={handleChange}
            isEditMode={isEditMode}
            imagemAtual={imagemAtual}
          />
        )}
      </Modal>
    </Layout>
  );
}

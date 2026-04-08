import { Modal } from "../ModalEventos/Modal";
import { TurneFormSteps } from "./TurneFormSteps";

export function TurneModalContainer({
  isOpen,
  onClose,
  onFinish,
  title,
  onValidate,
  formData,
  errors,
  submitLoading,
  bandaSearchText,
  showBandaDropdown,
  filteredBandas,
  selectedStartDate,
  selectedEndDate,
  setBandaSearchText,
  setShowBandaDropdown,
  handleBandaSelectInModal,
  handleDateSelect,
  formatDate,
  getSelectedBandaName,
  handleInputChange,
  handleChange,
  isEditMode,
  imagemAtual,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onFinish={onFinish}
      title={title}
      totalSteps={2}
      size="lg"
      onValidate={onValidate}
    >
      {(currentStep) => (
        <TurneFormSteps
          currentStep={currentStep}
          formData={formData}
          errors={errors}
          submitLoading={submitLoading}
          bandaSearchText={bandaSearchText}
          showBandaDropdown={showBandaDropdown}
          filteredBandas={filteredBandas}
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
  );
}

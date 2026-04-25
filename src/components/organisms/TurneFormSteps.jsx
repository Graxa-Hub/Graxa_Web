import { TurneMainForm } from "./TurneMainForm";
import { TurneDetailForm } from "./TurneDetailForm";

export function TurneFormSteps({
  currentStep,
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
  if (currentStep === 1) {
    return (
      <TurneMainForm
        formData={formData}
        errors={errors}
        submitLoading={submitLoading}
        bandaSearchText={bandaSearchText}
        showBandaDropdown={showBandaDropdown}
        filteredBandas={filteredBandas}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        handleInputChange={handleInputChange}
        setBandaSearchText={setBandaSearchText}
        setShowBandaDropdown={setShowBandaDropdown}
        handleBandaSelectInModal={handleBandaSelectInModal}
        handleDateSelect={handleDateSelect}
        formatDate={formatDate}
        getSelectedBandaName={getSelectedBandaName}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <TurneDetailForm
        formData={formData}
        errors={errors}
        submitLoading={submitLoading}
        isEditMode={isEditMode}
        imagemAtual={imagemAtual}
        handleInputChange={handleInputChange}
        handleChange={handleChange}
      />
    );
  }

  return <div>Etapa nao encontrada</div>;
}

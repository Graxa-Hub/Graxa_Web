import { Layout } from "../../../../components/templates/Layout";
import { LoadingState } from "../../../../components/molecules/LoadingState";
import { TurneTopBar } from "../organisms/TurneTopBar";
import { TurneContentSection } from "../organisms/TurneContentSection";
import { TurneModalContainer } from "../organisms/TurneModalContainer";

export function TurnePageTemplate({
  bandas,
  selectedBand,
  isPageLoading,
  isModalOpen,
  isEditMode,
  errorHeader,
  filteredTurnes,
  pagination,
  paginacaoBanda,
  loadingBanda,
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
  nextPage,
  prevPage,
  goToPage,
  nextPageBanda,
  prevPageBanda,
  goToPageBanda,
}) {
  if (isPageLoading) {
    return (
      <Layout showHeader={false} showNotifications={false}>
        <div className="flex-1 flex items-center justify-center">
          <LoadingState message="Carregando turnes..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showHeader={false}
      showNotifications={false}
      containerClassName="!bg-transparent !border-0 !shadow-none !p-0 overflow-visible"
    >
      <TurneTopBar
        bandas={bandas}
        selectedBand={selectedBand}
        onBandSelect={handleBandSelect}
      />

      <TurneContentSection
        bandas={bandas}
        selectedBand={selectedBand}
        onBandSelect={handleBandSelect}
        onAddTurne={handleCreateTurne}
        pagination={pagination}
        paginacaoBanda={paginacaoBanda}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        onGoToPage={goToPage}
        onNextPageBanda={nextPageBanda}
        onPrevPageBanda={prevPageBanda}
        onGoToPageBanda={goToPageBanda}
        loading={isPageLoading}
        loadingBanda={loadingBanda}
        errorHeader={errorHeader}
        turnes={filteredTurnes}
        onEditTurne={handleEditTurne}
        onDeleteTurne={handleDeleteTurne}
      />

      <TurneModalContainer
        isOpen={isModalOpen}
        onClose={closeModal}
        onFinish={handleFinishTurne}
        title={modalTitle}
        onValidate={validateModalStep}
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
    </Layout>
  );
}

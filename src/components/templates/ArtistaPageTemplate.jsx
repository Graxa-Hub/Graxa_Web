import { Layout } from "./Layout";
import { LoadingState } from "../molecules/LoadingState";
import { ArtistaTopBar } from "../organisms/ArtistaTopBar";
import { ArtistaContentSection } from "../organisms/ArtistaContentSection";
import { ModaisContainer } from "../organisms/ModaisContainer";

export function ArtistaPageTemplate({
  bandas,
  loading,
  pagination,
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
}) {
  if (loading && bandas.length === 0) {
    return (
      <Layout showHeader={false} showNotifications={false}>
        <div className="flex-1 flex items-center justify-center">
          <LoadingState message="Carregando artistas..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showHeader={true}
      showNotifications={true}
      containerClassName="!bg-transparent !border-0 !shadow-none !p-0 overflow-visible"
      bandas={bandas}
      bandaSelecionada={selectedBanda}
      turneSelecionada={selectedTurne}
      onBandaChange={setSelectedBanda}
      onTurneChange={setSelectedTurne}
    >

      <ArtistaContentSection
        bandas={bandas}
        loading={loading}
        pagination={pagination}
        onAddBanda={openModal}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onVisualizar={handleVisualizar}
        openDropdown={openDropdown}
        onToggleDropdown={toggleDropdown}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        onGoToPage={goToPage}
      />

      <ModaisContainer
        isModalOpen={isModalOpen}
        onCloseModal={closeModal}
        onBandaCreated={onBandaCreated}
        criarBanda={criarBanda}
        atualizarBanda={atualizarBanda}
        adicionarIntegrantes={adicionarIntegrantes}
        bandaParaEditar={bandaParaEditar}
        confirmModal={confirmModal}
        onCloseConfirmModal={closeConfirmModal}
        onConfirmDelete={handleConfirmDelete}
        bandaVisualizar={bandaVisualizar}
        onCloseBandaVisualizar={closeBandaVisualizar}
      />
    </Layout>
  );
}

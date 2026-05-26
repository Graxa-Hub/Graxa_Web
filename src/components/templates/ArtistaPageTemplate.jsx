import { Layout } from "./Layout";
import { LoadingState } from "../molecules/LoadingState";
import { ArtistaContentSection } from "../organisms/ArtistaContentSection";
import { ModaisContainer } from "../organisms/ModaisContainer";
import { SearchBar } from "../molecules/SearchBar";

export function ArtistaPageTemplate({
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
}) {
  if (loading && bandas.length === 0 && !searchQuery) {
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
      showHeader={false}
      showNotifications={true}
      containerClassName="!bg-transparent !border-0 !shadow-none !p-0 overflow-visible"
      bandas={bandas}
      bandaSelecionada={selectedBanda}
      turneSelecionada={selectedTurne}
      onBandaChange={setSelectedBanda}
      onTurneChange={setSelectedTurne}
    >
      <SearchBar
        placeholder="Buscar artistas..."
        value={searchQuery}
        onChange={handleSearch}
        onClear={handleClearSearch}
        debounce={400}
        loading={loading && !!searchQuery}
        className="mb-6"
      />

      <ArtistaContentSection
        bandas={bandas}
        loading={loading}
        pagination={pagination}
        // Esconde paginação durante busca ativa — os resultados são todos de uma vez
        showPagination={!buscaAtiva}
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

import { useEffect, useState } from "react";
import { Layout } from "../components/templates/Layout";
import { useArtistaApp } from "../hooks/useArtistaApp";
import { LoadingState } from "../components/molecules/LoadingState";
import { ArtistaHeader } from "../features/Banda/components/molecules/ArtistaHeader";
import { BandasGrid } from "../features/Banda/components/organisms/BandasGrid";
import { ModaisContainer } from "../features/Banda/components/organisms/ModaisContainer";
import { Pagination } from "../components/atoms/Pagination";

export function ArtistaApp() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const {
    // Estados
    bandas,
    loading,
    isModalOpen,
    openDropdown,
    bandaParaEditar,
    confirmModal,
    bandaVisualizar,

    // Funções
    listarBandas,
    criarBanda,
    atualizarBanda,
    adicionarIntegrantes,

    // Handlers
    openModal,
    closeModal,
    onBandaCreated,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    toggleDropdown,
    setBandaVisualizar,
    setConfirmModal,
  } = useArtistaApp();

  // Carrega inicial - primeira página de bandas
  useEffect(() => {
    const loadInitialData = async () => {
      const result = await listarBandas(0);
      if (result) {
        setCurrentPage(result.pageNumber ?? 0);
        setTotalPages(result.totalPages ?? 0);
      }
    };
    loadInitialData();
  }, []);

  const handlePaginationChange = async (page) => {
    const result = await listarBandas(page);
    if (result) {
      setCurrentPage(result.pageNumber ?? page);
      setTotalPages(result.totalPages ?? 0);
    }
  };

  if (loading && bandas.length === 0) {
    return <LoadingState />;
  }

  return (
    <Layout>
      <ArtistaHeader onAddBanda={openModal} />

      <div className="mb-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePaginationChange}
          isLoading={loading}
        />
      </div>

      <BandasGrid
        bandas={bandas}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onVisualizar={setBandaVisualizar}
        onAddBanda={openModal}
        openDropdown={openDropdown}
        onToggleDropdown={toggleDropdown}
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
        onCloseConfirmModal={() =>
          setConfirmModal({ isOpen: false, banda: null })
        }
        onConfirmDelete={handleConfirmDelete}
        bandaVisualizar={bandaVisualizar}
        onCloseBandaVisualizar={() => setBandaVisualizar(null)}
      />
    </Layout>
  );
}

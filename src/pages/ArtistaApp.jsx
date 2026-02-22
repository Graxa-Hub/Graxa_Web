import { useEffect } from "react";
import { Layout } from "../components/templates/Layout";
import { useArtistaApp } from "../hooks/useArtistaApp";
import { LoadingState } from "../components/molecules/LoadingState";
import { ArtistaHeader } from "../components/molecules/ArtistaHeader";
import { BandasGrid } from "../components/organisms/BandasGrid";
import { ModaisContainer } from "../components/organisms/ModaisContainer";

export function ArtistaApp() {
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

  useEffect(() => {
    listarBandas();
  }, [listarBandas]);

  if (loading && bandas.length === 0) {
    return <LoadingState />;
  }

  return (
    <Layout>
      <ArtistaHeader onAddBanda={openModal} />
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

import { Layout } from "../components/templates/Layout";
import { useArtista } from "../hooks/useArtista";
import { LoadingState } from "../components/molecules/LoadingState";
import { ArtistaHeader } from "../features/Banda/components/molecules/ArtistaHeader";
import { BandasGrid } from "../features/Banda/components/organisms/BandasGrid";
import { ModaisContainer } from "../features/Banda/components/organisms/ModaisContainer";
import { useNavigate } from "react-router-dom";

export function Artista() {
  const navigate = useNavigate();
  const {
    bandas,
    loading,
    isModalOpen,
    openDropdown,
    bandaParaEditar,
    confirmModal,
    bandaVisualizar,
    criarBanda,
    atualizarBanda,
    adicionarIntegrantes,
    openModal,
    closeModal,
    onBandaCreated,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    toggleDropdown,
    setBandaVisualizar,
    setConfirmModal,
  } = useArtista();

  if (loading && bandas.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <LoadingState message="Carregando artistas..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ArtistaHeader onAddBanda={openModal} />

      <BandasGrid
        bandas={bandas}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onVisualizar={(banda) => navigate(`/turne/${banda.id}`)}
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

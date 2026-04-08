import { Layout } from "../components/templates/Layout";
import { useBandas } from "../hooks/useBandas";
import { LoadingState } from "../components/molecules/LoadingState";
import { ArtistaHeader } from "../features/Banda/components/molecules/ArtistaHeader";
import { BandasGrid } from "../features/Banda/components/organisms/BandasGrid";
import { ModaisContainer } from "../features/Banda/components/organisms/ModaisContainer";
import { Pagination } from "../components/molecules/Pagination";
import { Header } from "../components/organisms/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Artista() {
  const navigate = useNavigate();
  const {
    bandas,
    loading,
    pagination,
    listarBandasPaginadas,
    nextPage,
    prevPage,
    goToPage,
    criarBanda,
    atualizarBanda,
    excluirBanda,
    adicionarIntegrantes,
  } = useBandas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bandaParaEditar, setBandaParaEditar] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    banda: null,
  });
  const [bandaVisualizar, setBandaVisualizar] = useState(null);

  useEffect(() => {
    listarBandasPaginadas(); // Usa DEFAULT_PAGE_SIZE do hook
  }, []);

  const openModal = () => {
    setBandaParaEditar(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBandaParaEditar(null);
  };

  const onBandaCreated = async () => {
    closeModal();
    try {
      await listarBandasPaginadas(); // Usa DEFAULT_PAGE_SIZE do hook
    } catch (err) {
      console.error("Erro ao atualizar lista de bandas apos criacao:", err);
    }
  };

  const handleEdit = (banda) => {
    setBandaParaEditar(banda);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDeleteClick = (banda) => {
    setConfirmModal({ isOpen: true, banda });
    setOpenDropdown(null);
  };

  const handleConfirmDelete = async () => {
    if (confirmModal.banda) {
      try {
        await excluirBanda(confirmModal.banda.id);
        await listarBandasPaginadas(); // Usa DEFAULT_PAGE_SIZE do hook
      } catch (error) {
        console.error("Erro ao excluir banda:", error);
        alert("Erro ao excluir banda. Tente novamente.");
      }
    }
    setConfirmModal({ isOpen: false, banda: null });
  };

  const toggleDropdown = (bandaId) => {
    setOpenDropdown((prev) => (prev === bandaId ? null : bandaId));
  };

  if (loading && bandas.length === 0) {
    return (
      <Layout showHeader={false}>
        <div className="flex-1 flex items-center justify-center">
          <LoadingState message="Carregando artistas..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader={false}>
      {/* Header + Paginação no topo */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <ArtistaHeader onAddBanda={openModal} />
        
        <Pagination
          pagination={pagination}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onGoToPage={goToPage}
          disabled={loading}
        />
      </div>

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

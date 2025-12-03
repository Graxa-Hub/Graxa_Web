import React, { useEffect } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useArtistaApp } from "../hooks/useArtistaApp";

// Componentes específicos
import { LoadingState } from "../components/ArtistaApp/LoadingState";
import { ArtistaHeader } from "../components/ArtistaApp/ArtistaHeader";
import { BandasGrid } from "../components/ArtistaApp/BandasGrid";
import { ModaisContainer } from "../components/ArtistaApp/ModaisContainer";

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
    setConfirmModal
  } = useArtistaApp();

  useEffect(() => {
    listarBandas();
  }, [listarBandas]);

  if (loading && bandas.length === 0) {
    return <LoadingState />;
  }

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 bg-[#f4f5f7] p-4 sm:p-8 sm:pr-20">
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
          onCloseConfirmModal={() => setConfirmModal({ isOpen: false, banda: null })}
          onConfirmDelete={handleConfirmDelete}
          bandaVisualizar={bandaVisualizar}
          onCloseBandaVisualizar={() => setBandaVisualizar(null)}
        />
      </main>
    </Layout>
  );
}
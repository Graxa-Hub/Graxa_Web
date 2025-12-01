import React, { useEffect, useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { ButtonPage } from "../components/ButtonPage";
import { useBandas } from "../hooks/useBandas";
import { ConfirmModal } from "../components/ConfirmModal";
import { VisualizarBandaModal } from "../components/ArtistaApp/VisualizarBandaModal";

// Componentes auxiliares importados
import { EmptyState } from "../components/ArtistaApp/EmptyState";
import { Card } from "../components/ArtistaApp/Card";
import { AddBandaModal } from "../components/ArtistaApp/AddBandaModal";

// ========== Tela Principal ==========
export function ArtistaApp() {
  const {
    bandas,
    loading,
    listarBandas,
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
    listarBandas();
  }, [listarBandas]);

  function openModal() {
    setBandaParaEditar(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setBandaParaEditar(null);
  }

  async function onBandaCreated() {
    closeModal();
    try {
      await listarBandas();
    } catch (err) {
      console.error("Erro ao atualizar lista de bandas após criação:", err);
    }
  }

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
        await listarBandas();
      } catch (error) {
        console.error("Erro ao excluir banda:", error);
        alert("Erro ao excluir banda. Tente novamente.");
      }
    }
    setConfirmModal({ isOpen: false, banda: null });
  };

  const toggleDropdown = (bandaId) => {
    setOpenDropdown(openDropdown === bandaId ? null : bandaId);
  };

  if (loading && bandas.length === 0) {
    return (
      <Layout>
        <Sidebar />
        <main className="flex-1 bg-[#f4f5f7] p-8">
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-semibold text-lg bg-white inline-block px-4 py-2 rounded shadow">
              Bandas
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Gerencie as bandas e seus integrantes.
            </p>
          </div>
          <ButtonPage text="Adicionar banda" click={openModal} />
        </div>

        {bandas.length === 0 ? (
          <EmptyState onAdd={openModal} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bandas.map((banda) => (
              <Card
                key={banda.id}
                banda={banda}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                isDropdownOpen={openDropdown === banda.id}
                onToggleDropdown={() => toggleDropdown(banda.id)}
                onVisualizar={setBandaVisualizar} // ✅ Adicione esta linha
              />
            ))}
          </div>
        )}

        {isModalOpen && (
          <AddBandaModal
            onSuccess={onBandaCreated}
            onClose={closeModal}
            criarBanda={criarBanda}
            atualizarBanda={atualizarBanda}
            adicionarIntegrantes={adicionarIntegrantes}
            bandaParaEditar={bandaParaEditar}
          />
        )}

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, banda: null })}
          onConfirm={handleConfirmDelete}
          title="Excluir banda"
          message={`Tem certeza que deseja excluir a banda "${confirmModal.banda?.nome}"?`}
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
        />

        {bandaVisualizar && (
          <VisualizarBandaModal
            banda={bandaVisualizar}
            onClose={() => setBandaVisualizar(null)}
          />
        )}
      </main>
    </Layout>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "../components/templates/Layout";
import { Modal } from "../components/ModalEventos/Modal";
import { TurneList } from "../features/Turne/components/organisms/TurneList";
import { TurneHeader } from "../features/Turne/components/molecules/TurneHeader";
import { TurneMainForm } from "../features/Turne/components/organisms/TurneMainForm";
import { TurneDetailForm } from "../features/Turne/components/organisms/TurneDetailForm";
import { TurneError } from "../features/Turne/components/atoms/TurneError";
import { Pagination } from "../components/atoms/Pagination";
import { useBandas } from "../hooks/useBandas";
import { useTurnes } from "../hooks/useTurnes";
import { deletarTurne } from "../services/turneService";
import { useTurneForm } from "../hooks/useTurneForm";
import { useParams } from "react-router-dom";

export function Turne() {
  const { bandaId } = useParams();
  const { bandas, loading: bandasLoading, listarBandas } = useBandas();
  const { turnes, loading: turnesLoading, listarTurnes } = useTurnes();

  const [selectedBand, setSelectedBand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTurne, setEditingTurne] = useState(null);
  const [errorHeader, setErrorHeader] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Carrega inicial - bandas e primeira página de turnês
  useEffect(() => {
    const loadInitialData = async () => {
      await listarBandas();
      const result = await listarTurnes(0);
      if (result) {
        setCurrentPage(result.pageNumber ?? 0);
        setTotalPages(result.totalPages ?? 0);
      }
    };
    loadInitialData();
  }, []); // Executa uma única vez na montagem

  // Sincroniza bandaId da URL
  useEffect(() => {
    if (bandaId && bandas.length > 0) {
      const banda = bandas.find((b) => String(b.id) === String(bandaId));
      if (banda) setSelectedBand(banda);
    }
  }, [bandaId, bandas]);

  const filteredTurnes = useMemo(() => {
    if (selectedBand && selectedBand.id) {
      return turnes.filter(
        (t) =>
          t.bandaId === selectedBand.id ||
          t.banda?.id === selectedBand.id ||
          t.raw?.bandaId === selectedBand.id ||
          t.raw?.banda?.id === selectedBand.id
      );
    }
    return turnes;
  }, [turnes, selectedBand]);

  const handleBandSelect = (banda) => {
    setSelectedBand(banda);
  };

  const handleCreateTurne = () => {
    setIsEditMode(false);
    setEditingTurne(null);
    setIsModalOpen(true);
  };

  const handleEditTurne = (turne) => {
    setIsEditMode(true);
    setEditingTurne(turne);
    setIsModalOpen(true);
  };

  const handleDeleteTurne = async (turne) => {
    try {
      await deletarTurne(turne.id);
      const result = await listarTurnes(currentPage);
      if (result) {
        setCurrentPage(result.pageNumber ?? currentPage);
        setTotalPages(result.totalPages ?? 0);
      }
    } catch (error) {
      console.error("Erro ao excluir turnê:", error);
      setErrorHeader(error.response?.data?.mensagem || "Erro ao excluir turnê");
    }
  };

  const handleSuccess = async () => {
    const result = await listarTurnes(currentPage);
    if (result) {
      setCurrentPage(result.pageNumber ?? currentPage);
      setTotalPages(result.totalPages ?? 0);
    }
    setIsModalOpen(false);
  };

  const handlePaginationChange = async (page) => {
    const result = await listarTurnes(page);
    if (result) {
      setCurrentPage(result.pageNumber ?? page);
      setTotalPages(result.totalPages ?? 0);
    }
  };

  const {
    formData,
    errors,
    submitLoading,
    selectedStartDate,
    selectedEndDate,
    imagemAtual,
    bandaSearchText,
    showBandaDropdown,
    setBandaSearchText,
    setShowBandaDropdown,
    handleDateSelect,
    handleFinishTurne,
    handleBandaSelectInModal,
    handleChange,
    validateStep1,
  } = useTurneForm({
    onSuccess: handleSuccess,
    turnesData: filteredTurnes,
    isEditMode,
    editingTurne,
    selectedBand,
  });

  const filteredBandasForm = useMemo(() => {
    if (!bandaSearchText.trim()) return bandas;
    return bandas.filter((banda) =>
      banda.nome.toLowerCase().includes(bandaSearchText.toLowerCase())
    );
  }, [bandas, bandaSearchText]);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const getSelectedBandaName = () => {
    if (!formData.bandaId) return "";
    const banda = bandas.find((b) => b.id === formData.bandaId);
    return banda ? banda.nome : "";
  };

  if (turnesLoading || bandasLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TurneHeader
        bandas={bandas}
        selectedBand={selectedBand}
        onBandSelect={handleBandSelect}
        onAddTurne={handleCreateTurne}
      />

      {errorHeader && <TurneError error={errorHeader} />}

      <div className="mb-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePaginationChange}
          isLoading={turnesLoading}
        />
      </div>

      <TurneList
        turnes={filteredTurnes}
        onEditTurne={handleEditTurne}
        onDeleteTurne={handleDeleteTurne}
        onCreateTurne={handleCreateTurne}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFinish={handleFinishTurne}
        title={isEditMode ? "Editar Turnê" : "Criar Turnê"}
        totalSteps={2}
        size="lg"
        onValidate={(step) => (step === 1 ? validateStep1() : true)}
      >
        {(currentStep) => {
          switch (currentStep) {
            case 1:
              return (
                <TurneMainForm
                  formData={formData}
                  errors={errors}
                  submitLoading={submitLoading}
                  bandaSearchText={bandaSearchText}
                  showBandaDropdown={showBandaDropdown}
                  filteredBandas={filteredBandasForm}
                  selectedStartDate={selectedStartDate}
                  selectedEndDate={selectedEndDate}
                  handleInputChange={(field, value) => handleChange(field, value)}
                  setBandaSearchText={setBandaSearchText}
                  setShowBandaDropdown={setShowBandaDropdown}
                  handleBandaSelectInModal={handleBandaSelectInModal}
                  handleDateSelect={handleDateSelect}
                  formatDate={formatDate}
                  getSelectedBandaName={getSelectedBandaName}
                />
              );
            case 2:
              return (
                <TurneDetailForm
                  formData={formData}
                  errors={errors}
                  submitLoading={submitLoading}
                  isEditMode={isEditMode}
                  imagemAtual={imagemAtual}
                  handleInputChange={(field, value) => handleChange(field, value)}
                  handleChange={handleChange}
                />
              );
            default:
              return <div>Etapa não encontrada</div>;
          }
        }}
      </Modal>
    </Layout>
  );
}

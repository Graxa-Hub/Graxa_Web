import { useMemo, useState, useEffect, useCallback } from "react";
import { useBandas } from "../../../hooks/useBandas";
import { useTurnes } from "../../../hooks/useTurnes";
import { useTurneForm } from "../../../hooks/useTurneForm";
import { deletarTurne, getTurnesPaginadasPorBanda } from "../../../services/turneService";
import { useParams } from "react-router-dom";

export function useTurneViewModel() {
  const { bandaId } = useParams();
  const { bandas, loading: bandasLoading, listarBandas } = useBandas();
  const {
    turnes,
    loading: turnesLoading,
    pagination,
    listarTurnes,
    listarTurnesPaginadas,
    nextPage,
    prevPage,
    goToPage,
  } = useTurnes();

  const [selectedBand, setSelectedBand] = useState(null);
  const [errorHeader, setErrorHeader] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTurne, setEditingTurne] = useState(null);
  const [turnesBandaFiltradas, setTurnesBandaFiltradas] = useState([]);
  const [paginacaoBanda, setPaginacaoBanda] = useState({
    pageNumber: 0,
    pageSize: 1,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });
  const [loadingBanda, setLoadingBanda] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await listarBandas();
      // Carregar turnês paginadas para exibição geral (usa DEFAULT_PAGE_SIZE do hook)
      await listarTurnesPaginadas();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bandaId && bandas.length > 0) {
      const banda = bandas.find((b) => String(b.id) === String(bandaId));
      if (banda) setSelectedBand(banda);
    }
  }, [bandaId, bandas]);

  // Carregar turnês da banda quando selectedBand muda
  useEffect(() => {
    const carregarTurnesDaBanda = async () => {
      if (selectedBand?.id) {
        setLoadingBanda(true);
        try {
          const resultado = await getTurnesPaginadasPorBanda(selectedBand.id, 0, 1);
          setTurnesBandaFiltradas(resultado.content || []);
          setPaginacaoBanda(resultado);
        } catch (error) {
          console.error(`[useTurneViewModel] Erro ao carregar turnês da banda ${selectedBand.id}:`, error);
          setTurnesBandaFiltradas([]);
        } finally {
          setLoadingBanda(false);
        }
      } else {
        // Limpar dados da banda quando "Todas as Bandas" é selecionada
        setLoadingBanda(false);
        setTurnesBandaFiltradas([]);
        setPaginacaoBanda({
          pageNumber: 0,
          pageSize: 1,
          totalPages: 0,
          totalElements: 0,
          first: true,
          last: true,
        });
      }
    };

    carregarTurnesDaBanda();
  }, [selectedBand?.id]);

  const filteredTurnes = useMemo(() => {
    if (selectedBand && selectedBand.id) {
      return turnesBandaFiltradas;
    }
    return turnes.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [turnesBandaFiltradas, turnes, selectedBand]);

  const handleBandSelect = useCallback((banda) => {
    setSelectedBand(banda);
  }, []);

  const handleCreateTurne = useCallback(() => {
    setIsEditMode(false);
    setEditingTurne(null);
    setIsModalOpen(true);
  }, []);

  const handleEditTurne = useCallback((turne) => {
    setIsEditMode(true);
    setEditingTurne(turne);
    setIsModalOpen(true);
  }, []);

  const handleDeleteTurne = useCallback(async (turne) => {
    try {
      await deletarTurne(turne.id);
      if (selectedBand?.id) {
        // Recarregar turnês da banda
        const resultado = await getTurnesPaginadasPorBanda(selectedBand.id, paginacaoBanda.pageNumber, paginacaoBanda.pageSize);
        setTurnesBandaFiltradas(resultado.content || []);
        setPaginacaoBanda(resultado);
      } else {
        // Recarregar turnês gerais com paginação
        await listarTurnesPaginadas(pagination.pageNumber, pagination.pageSize);
      }
    } catch (error) {
      console.error("Erro ao excluir turnê:", error);
      setErrorHeader(error.response?.data?.mensagem || "Erro ao excluir turnê");
    }
  }, [paginacaoBanda, pagination, selectedBand, listarTurnesPaginadas]);

  const nextPageBanda = useCallback(async () => {
    if (selectedBand?.id && paginacaoBanda.pageNumber < paginacaoBanda.totalPages - 1) {
      const novaPage = paginacaoBanda.pageNumber + 1;
      const resultado = await getTurnesPaginadasPorBanda(selectedBand.id, novaPage, paginacaoBanda.pageSize);
      setTurnesBandaFiltradas(resultado.content || []);
      setPaginacaoBanda(resultado);
    }
  }, [selectedBand, paginacaoBanda]);

  const prevPageBanda = useCallback(async () => {
    if (selectedBand?.id && paginacaoBanda.pageNumber > 0) {
      const novaPage = paginacaoBanda.pageNumber - 1;
      const resultado = await getTurnesPaginadasPorBanda(selectedBand.id, novaPage, paginacaoBanda.pageSize);
      setTurnesBandaFiltradas(resultado.content || []);
      setPaginacaoBanda(resultado);
    }
  }, [selectedBand, paginacaoBanda]);

  const goToPageBanda = useCallback(async (page) => {
    if (selectedBand?.id && page >= 0 && page < paginacaoBanda.totalPages) {
      const resultado = await getTurnesPaginadasPorBanda(selectedBand.id, page, paginacaoBanda.pageSize);
      setTurnesBandaFiltradas(resultado.content || []);
      setPaginacaoBanda(resultado);
    }
  }, [selectedBand, paginacaoBanda]);

  const handleSuccess = useCallback(async () => {
    setIsModalOpen(false);
    if (selectedBand?.id) {
      // Recarregar turnês da banda
      const resultado = await getTurnesPaginadasPorBanda(selectedBand.id, paginacaoBanda.pageNumber, paginacaoBanda.pageSize);
      setTurnesBandaFiltradas(resultado.content || []);
      setPaginacaoBanda(resultado);
    } else {
      // Recarregar turnês gerais com paginação
      await listarTurnesPaginadas(pagination.pageNumber, pagination.pageSize);
    }
  }, [paginacaoBanda, pagination, selectedBand, listarTurnesPaginadas]);

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
      banda.nome.toLowerCase().includes(bandaSearchText.toLowerCase()),
    );
  }, [bandas, bandaSearchText]);

  const isPageLoading = turnesLoading || bandasLoading;

  const closeModal = () => setIsModalOpen(false);

  const modalTitle = isEditMode ? "Editar Turnê" : "Criar Turnê";

  const validateModalStep = (step) => (step === 1 ? validateStep1() : true);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const getSelectedBandaName = () => {
    if (!formData.bandaId) return "";
    const banda = bandas.find((b) => b.id === formData.bandaId);
    return banda ? banda.nome : "";
  };

  const handleInputChange = (field, value) => {
    handleChange(field, value);
  };

  return {
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
    handleBandaSelectInModal,
    handleDateSelect,
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
  };
}

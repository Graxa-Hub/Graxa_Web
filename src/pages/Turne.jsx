import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { TurneList } from "../components/TurneList";
import { TurneHeader } from "../components/TurneHeader";
import { Modal } from "../components/ModalEventos/Modal";
import { Input } from "../components/ModalEventos/Input";
import { BandaInput } from "../components/ModalEventos/BandaInput";
import { Calendar } from "../components/Calendar";
import { Textarea } from "../components/Textarea";
import { InputFile } from "../components/InputFile";
import {
  getTurnes,
  criarTurne,
  editarTurne,
  deletarTurne,
} from "../services/turneService";
import {
  adaptTurnesFromBackend,
  adaptTurneFromBackend,
  dateToISO,
} from "../utils/turneAdapter";
import { useBandas } from "../hooks/useBandas";
import { imagemService } from "../services/imagemService";
import { useParams } from "react-router-dom";

export function Turne() {
  const { bandaId } = useParams();
  const { bandas, loading: bandasLoading, listarBandas } = useBandas();
  const [selectedBand, setSelectedBand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTurne, setEditingTurne] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    imagem: null,
    bandaId: null,
  });

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [turnesData, setTurnesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [imagemAtual, setImagemAtual] = useState(null);
  const [imagemCarregada, setImagemCarregada] = useState(false);

  const [bandaSearchText, setBandaSearchText] = useState("");
  const [showBandaDropdown, setShowBandaDropdown] = useState(false);

  // Reset da imagem quando a banda selecionada muda
  useEffect(() => {
    if (!isModalOpen) {
      // Reset apenas quando não estiver no modal (mudança do header dropdown)
      setImagemAtual(null);
      setImagemCarregada(false);
    }
  }, [selectedBand, isModalOpen]);

  // Busca bandas e turnês ao carregar
  useEffect(() => {
    const fetchData = async () => {
      await listarBandas();
      await fetchTurnes();
    };
    fetchData();
  }, [listarBandas]);

  // Carrega a imagem da turnê em edição
  useEffect(() => {
    const carregarImagem = async () => {
      if (editingTurne?.raw?.nomeImagem && !imagemCarregada) {
        const imageUrl = await imagemService(editingTurne.raw.nomeImagem);
        setImagemAtual(imageUrl);
        setImagemCarregada(true);
      }
    };
    carregarImagem();
  }, [editingTurne, imagemCarregada]);

  // Seleciona a banda pelo id da URL assim que as bandas são carregadas
  useEffect(() => {
    listarBandas();
  }, [listarBandas]);

  useEffect(() => {
    if (bandaId && bandas.length > 0) {
      const banda = bandas.find((b) => String(b.id) === String(bandaId));
      if (banda) setSelectedBand(banda);
    }
  }, [bandaId, bandas]);

  const fetchTurnes = async () => {
    try {
      setLoading(true);
      const turnes = await getTurnes();

      const adaptedTurnes = await adaptTurnesFromBackend(turnes);

      setTurnesData(adaptedTurnes);
    } catch (error) {
      console.error("❌ Erro ao carregar turnês:", error);
      setErrors({ geral: "Erro ao carregar turnês" });
    } finally {
      setLoading(false);
    }
  };

  // Filtra turnês com base na banda selecionada
  const filteredTurnes = useMemo(() => {
    if (selectedBand && selectedBand.id) {
      return turnesData
        .filter(
          (turne) =>
            turne.bandaId === selectedBand.id ||
            turne.banda?.id === selectedBand.id ||
            turne.raw?.bandaId === selectedBand.id ||
            turne.raw?.banda?.id === selectedBand.id
        )
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return turnesData.sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );
  }, [turnesData, selectedBand]);

  const filteredBandas = useMemo(() => {
    if (!bandaSearchText.trim()) return bandas;
    return bandas.filter((banda) =>
      banda.nome.toLowerCase().includes(bandaSearchText.toLowerCase())
    );
  }, [bandas, bandaSearchText]);

  const handleBandSelect = (banda) => {
    setSelectedBand(banda);
    setImagemAtual(null);
    setImagemCarregada(false);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da turnê é obrigatório";
    } else {
      const existing = turnesData.find(
        (t) =>
          t.name.toLowerCase() === formData.nome.toLowerCase() &&
          (!isEditMode || t.id !== editingTurne.id)
      );
      if (existing) {
        newErrors.nome = "Já existe uma turnê com este nome";
      }
    }

    if (!selectedStartDate) {
      newErrors.inicio = "Data de início é obrigatória";
    }
    if (!selectedEndDate) {
      newErrors.fim = "Data de fim é obrigatória";
    }
    if (
      selectedStartDate &&
      selectedEndDate &&
      selectedEndDate < selectedStartDate
    ) {
      newErrors.fim = "Data de fim deve ser posterior à data de início";
    }

    if (!formData.bandaId) {
      newErrors.banda = "Selecione uma banda para a turnê";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    if (!isEditMode && !formData.imagem) {
      newErrors.imagem = "Upload da imagem é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTurne = () => {
    setIsEditMode(false);
    setEditingTurne(null);
    setImagemAtual(null);
    setImagemCarregada(false);
    setFormData({
      nome: "",
      descricao: "",
      imagem: null,
      bandaId: selectedBand?.id || null,
    });
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setErrors({});
    setBandaSearchText("");
    setShowBandaDropdown(false);
    setIsModalOpen(true);
  };

  const handleEditTurne = async (turne) => {
    setIsEditMode(true);
    setEditingTurne(turne);
    setImagemAtual(null);
    setImagemCarregada(false);

    setFormData({
      nome: turne.name,
      descricao: turne.description,
      imagem: null,
      bandaId:
        turne.bandaId ||
        turne.banda?.id ||
        turne.raw?.bandaId ||
        turne.raw?.banda?.id ||
        null,
    });

    const [startDay, startMonth, startYear] = turne.startDate.split("/");
    const [endDay, endMonth, endYear] = turne.endDate.split("/");

    setSelectedStartDate(new Date(startYear, startMonth - 1, startDay));
    setSelectedEndDate(new Date(endYear, endMonth - 1, endDay)); // <-- corrigido aqui

    setErrors({});
    setBandaSearchText("");
    setShowBandaDropdown(false);
    setIsModalOpen(true);
  };

  const handleDeleteTurne = async (turne) => {
    try {
      await deletarTurne(turne.id);
      setTurnesData((prev) => prev.filter((t) => t.id !== turne.id));
    } catch (error) {
      console.error("Erro ao excluir turnê:", error);
      setErrors({
        geral: error.response?.data?.mensagem || "Erro ao excluir turnê",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingTurne(null);
    setImagemAtual(null);
    setImagemCarregada(false);
    setErrors({});
    setBandaSearchText("");
    setShowBandaDropdown(false);
  };

  const handleFinishTurne = async () => {
    if (!validateStep2()) {
      return;
    }

    setSubmitLoading(true);
    setErrors({});

    try {
      const payload = {
        nomeTurne: formData.nome,
        dataHoraInicioTurne: dateToISO(selectedStartDate),
        dataHoraFimTurne: dateToISO(selectedEndDate),
        descricao: formData.descricao,
        bandaId: formData.bandaId,
      };

      let response;
      if (isEditMode) {
        response = await editarTurne(editingTurne.id, payload, formData.imagem);
      } else {
        response = await criarTurne(payload, formData.imagem);
      }

      const adaptedTurne = await adaptTurneFromBackend(response);

      if (isEditMode) {
        setTurnesData((prev) =>
          prev.map((t) => (t.id === editingTurne.id ? adaptedTurne : t))
        );
      } else {
        setTurnesData((prev) => [...prev, adaptedTurne]);
      }

      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingTurne(null);
      setImagemAtual(null);
      setImagemCarregada(false);
    } catch (error) {
      const errorMsg =
        error.response?.data?.mensagem || error.response?.data?.message;
      if (errorMsg?.toLowerCase().includes("já existe")) {
        setErrors({ nome: "Já existe uma turnê com este nome" });
      } else {
        setErrors({ geral: errorMsg || "Erro ao salvar turnê" });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }

    if (key === "imagem" && value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemAtual(reader.result);
      };
      reader.readAsDataURL(value);
    } else if (key === "imagem" && value === null) {
      if (editingTurne?.raw?.nomeImagem) {
        buscarImagem(editingTurne.raw.nomeImagem).then(setImagemAtual);
      } else {
        setImagemAtual(null);
      }
    }
  };

  const handleInputChange = (field, value) => {
    handleChange(field, value);
  };

  const handleDateSelect = (date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setErrors((prev) => ({ ...prev, inicio: undefined, fim: undefined }));
    } else if (date >= selectedStartDate) {
      setSelectedEndDate(date);
      setErrors((prev) => ({ ...prev, fim: undefined }));
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setErrors((prev) => ({ ...prev, inicio: undefined, fim: undefined }));
    }
  };

  const handleBandaSelectInModal = (banda) => {
    setFormData((prev) => ({ ...prev, bandaId: banda?.id || null }));
    setBandaSearchText(banda?.nome || "");
    setShowBandaDropdown(false);
    if (errors.banda) {
      setErrors((prev) => ({ ...prev, banda: undefined }));
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const getSelectedBandaName = () => {
    if (!formData.bandaId) return "";
    const banda = bandas.find((b) => b.id === formData.bandaId);
    return banda ? banda.nome : "";
  };

  if (loading || bandasLoading) {
    return (
      <Layout>
        <div className="flex h-screen w-full">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TurneHeader
          selectedBand={selectedBand}
          onBandSelect={handleBandSelect}
          onCreateTurne={handleCreateTurne}
          bandas={bandas}
        />

        {errors.geral && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.geral}
          </div>
        )}

        <div className="flex-1 p-6 overflow-y-auto">
          <TurneList
            turnes={filteredTurnes}
            onEditTurne={handleEditTurne}
            onDeleteTurne={handleDeleteTurne}
            onCreateTurne={handleCreateTurne}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onFinish={handleFinishTurne}
        title={isEditMode ? "Editar Turnê" : "Criar Turnê"}
        totalSteps={2}
        onValidate={(step) => (step === 1 ? validateStep1() : true)}
      >
        {(currentStep) => {
          switch (currentStep) {
            case 1:
              return (
                <div className="flex gap-3">
                  <div className="flex-1 space-y-6">
                    <Input
                      label="Nome da turnê:"
                      placeholder="Chuva dos olhos"
                      value={formData.nome}
                      onChange={(e) =>
                        handleInputChange("nome", e.target.value)
                      }
                      required
                      disabled={submitLoading}
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                    )}

                    <BandaInput
                      label="Banda:"
                      placeholder="Pesquisar banda..."
                      value={getSelectedBandaName()}
                      searchText={bandaSearchText}
                      onSearchChange={(text) => {
                        setBandaSearchText(text);
                        setShowBandaDropdown(true);
                      }}
                      onFocus={() => {
                        setBandaSearchText(getSelectedBandaName());
                        setShowBandaDropdown(true);
                      }}
                      showDropdown={showBandaDropdown}
                      filteredBandas={filteredBandas}
                      onSelectBanda={handleBandaSelectInModal}
                      error={errors.banda}
                      disabled={submitLoading}
                      required
                    />

                    <Input
                      label="Início da turnê:"
                      placeholder="13/03/2021"
                      value={formatDate(selectedStartDate)}
                      readOnly
                      required
                    />
                    {errors.inicio && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.inicio}
                      </p>
                    )}

                    <Input
                      label="Fim da turnê:"
                      placeholder="15/03/2021"
                      value={formatDate(selectedEndDate)}
                      readOnly
                      required
                    />
                    {errors.fim && (
                      <p className="text-red-500 text-sm mt-1">{errors.fim}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center justify-center pt-5">
                    <Calendar
                      selectedStartDate={selectedStartDate}
                      selectedEndDate={selectedEndDate}
                      onDateSelect={handleDateSelect}
                    />
                  </div>
                </div>
              );

            case 2:
              return (
                <div className="flex flex-col gap-6">
                  <div>
                    <Textarea
                      label="Descrição da turnê:"
                      placeholder="Descreva a turnê, objetivos, público-alvo..."
                      value={formData.descricao}
                      onChange={(e) =>
                        handleInputChange("descricao", e.target.value)
                      }
                      rows={8}
                      maxLength={500}
                      disabled={submitLoading}
                    />
                    {errors.descricao && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.descricao}
                      </p>
                    )}
                  </div>

                  <div>
                    <InputFile
                      label="Foto da Turnê"
                      onFileSelect={(file) => handleChange("imagem", file)}
                      currentImage={imagemAtual}
                    />
                    {errors.imagem && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.imagem}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {isEditMode
                        ? "Envie apenas se quiser alterar a imagem atual"
                        : "A imagem é obrigatória para criar uma nova turnê"}
                    </p>
                  </div>
                </div>
              );

            default:
              return <div>Etapa não encontrada</div>;
          }
        }}
      </Modal>
    </Layout>
  );
}

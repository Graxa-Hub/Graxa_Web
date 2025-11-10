import React, { useState, useEffect } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { TurneList } from "../components/TurneList";
import { TurneHeader } from "../components/TurneHeader";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { Calendar } from "../components/Calendar";
import { Textarea } from "../components/Textarea";
import { InputFile } from "../components/InputFile";
import { getTurnes, criarTurne, editarTurne, deletarTurne } from "../services/turneService";
import { adaptTurnesFromBackend, adaptTurneFromBackend, dateToISO } from "../utils/turneAdapter";

export function Turne() {
  const [selectedBand, setSelectedBand] = useState("Boogarins");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTurne, setEditingTurne] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    imagem: null
  });
  
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [turnesData, setTurnesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const bands = ["Boogarins", "Banda 2", "Banda 3"];

  // Busca turnês ao carregar
  useEffect(() => {
    fetchTurnes();
  }, []);

  const fetchTurnes = async () => {
    try {
      setLoading(true);
      const turnes = await getTurnes();
      
      
      
      
      const adaptedTurnes = await adaptTurnesFromBackend(turnes);
      
       
      
      setTurnesData(adaptedTurnes);
    } catch (error) {
      setErrors({ geral: "Erro ao carregar turnês" });
    } finally {
      setLoading(false);
    }
  };


  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da turnê é obrigatório";
    } else {
      // Verifica duplicação
      const existing = turnesData.find(
        (t) => t.name.toLowerCase() === formData.nome.toLowerCase() && 
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
    if (selectedStartDate && selectedEndDate && selectedEndDate < selectedStartDate) {
      newErrors.fim = "Data de fim deve ser posterior à data de início";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    // Imagem obrigatória apenas ao criar
    if (!isEditMode && !formData.imagem) {
      newErrors.imagem = "Upload da imagem é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTurne = () => {
    setIsEditMode(false);
    setEditingTurne(null);
    setFormData({ nome: "", descricao: "", imagem: null });
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEditTurne = (turne) => {
    setIsEditMode(true);
    setEditingTurne(turne);
    setFormData({
      nome: turne.name,
      descricao: turne.description,
      imagem: null
    });
    
    // Converte datas
    const [startDay, startMonth, startYear] = turne.startDate.split('/');
    const [endDay, endMonth, endYear] = turne.endDate.split('/');
    
    setSelectedStartDate(new Date(startYear, startMonth - 1, startDay));
    setSelectedEndDate(new Date(endYear, endMonth - 1, endDay));
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteTurne = async (turne) => {

    try {
      await deletarTurne(turne.id);
      setTurnesData((prev) => prev.filter((t) => t.id !== turne.id));
    } catch (error) {
      console.error("Erro ao excluir turnê:", error);
      setErrors({ geral: error.response?.data?.mensagem || "Erro ao excluir turnê" });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingTurne(null);
    setErrors({});
  };

  const handleFinishTurne = async () => {
    if (!validateStep2()) {
      return;
    }

    setSubmitLoading(true);
    setErrors({});

    try {
      const payload = {
        nome: formData.nome,
        dataInicio: dateToISO(selectedStartDate),
        dataFim: dateToISO(selectedEndDate),
        descricao: formData.descricao
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
    } catch (error) {
      
      const errorMsg = error.response?.data?.mensagem || error.response?.data?.message;
      if (errorMsg?.toLowerCase().includes("já existe")) {
        setErrors({ nome: "Já existe uma turnê com este nome" });
      } else {
        setErrors({ geral: errorMsg || "Erro ao salvar turnê" });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  if (loading) {
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
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TurneHeader
            bands={bands}
            selectedBand={selectedBand}
            onBandSelect={setSelectedBand}
            onCreateTurne={handleCreateTurne}
          />

          {errors.geral && (
            <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.geral}
            </div>
          )}

          <div className="flex-1 p-6 overflow-y-auto">
            <TurneList
              turnes={turnesData}
              onEditTurne={handleEditTurne}
              onDeleteTurne={handleDeleteTurne}
              onCreateTurne={handleCreateTurne}
            />
          </div>
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
                <div className="flex gap-8">
                  <div className="flex-1 space-y-6">
                    <div>
                      <Input
                        label="Nome da turnê:"
                        placeholder="Chuva dos olhos"
                        value={formData.nome}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                        required
                        disabled={submitLoading}
                      />
                      {errors.nome && (
                        <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Início da turnê:"
                        placeholder="13/03/2021"
                        value={formatDate(selectedStartDate)}
                        readOnly
                        required
                      />
                      {errors.inicio && (
                        <p className="text-red-500 text-sm mt-1">{errors.inicio}</p>
                      )}
                    </div>

                    <div>
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
                  </div>

                  <div className="flex-shrink-0">
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
                <div className="flex gap-8">
                  <div className="w-[50%]">
                    <Textarea
                      label="Descrição da turnê:"
                      placeholder="Descreva a turnê, objetivos, público-alvo..."
                      value={formData.descricao}
                      onChange={(e) => handleInputChange("descricao", e.target.value)}
                      rows={10}
                      maxLength={500}
                      disabled={submitLoading}
                    />
                    {errors.descricao && (
                      <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
                    )}
                  </div>

                  <div className="w-[50%]">
                    <InputFile
                      label={`Upload de Imagem${isEditMode ? " (opcional)" : ""}:`}
                      onFileSelect={(file) => handleInputChange("imagem", file)}
                      disabled={submitLoading}
                    />
                    {errors.imagem && (
                      <p className="text-red-500 text-sm mt-1">{errors.imagem}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
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
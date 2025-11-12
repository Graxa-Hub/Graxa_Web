import React, { useState, useEffect, useMemo } from "react";
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
import { useBandas } from "../hooks/useBandas";
import { imagemService } from "../services/imagemService";

export function Turne() {
  const { bandas, loading: bandasLoading, listarBandas } = useBandas();
  const [selectedBand, setSelectedBand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTurne, setEditingTurne] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    imagem: null,
    bandaId: null
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

  const fetchTurnes = async () => {
    try {
      setLoading(true);
      console.log('🔄 Buscando turnês...');
      const turnes = await getTurnes();
      console.log('📥 Turnês do backend:', turnes);
      
      const adaptedTurnes = await adaptTurnesFromBackend(turnes);
      console.log('🔧 Turnês adaptadas:', adaptedTurnes);
      
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
    console.log('🔍 Filtrando turnês...');
    console.log('📊 Total de turnês:', turnesData.length);
    console.log('🎵 Banda selecionada:', selectedBand);
    
    let filtered = turnesData;
    
    if (selectedBand && selectedBand.id) {
      console.log(`🎯 Filtrando por banda ID: ${selectedBand.id} (${selectedBand.nome})`);
      
      filtered = turnesData.filter(turne => {
        const bandaMatch = turne.bandaId === selectedBand.id || 
                          turne.banda?.id === selectedBand.id ||
                          turne.raw?.bandaId === selectedBand.id ||
                          turne.raw?.banda?.id === selectedBand.id;
        
        console.log(`   Turnê "${turne.name}": bandaId=${turne.bandaId}, banda.id=${turne.banda?.id}, match=${bandaMatch}`);
        
        return bandaMatch;
      });
      
      console.log(`✅ Encontradas ${filtered.length} turnê(s) para a banda ${selectedBand.nome}`);
    } else {
      console.log('📋 Mostrando todas as turnês');
    }
    
    // Ordenar alfabeticamente
    const sorted = filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    console.log('📝 Turnês finais ordenadas:', sorted.map(t => ({ name: t.name, bandaId: t.bandaId })));
    
    return sorted;
  }, [turnesData, selectedBand]);

  const filteredBandas = useMemo(() => {
    if (!bandaSearchText.trim()) return bandas;
    return bandas.filter(banda => 
      banda.nome.toLowerCase().includes(bandaSearchText.toLowerCase())
    );
  }, [bandas, bandaSearchText]);

  const handleBandSelect = (banda) => {
    console.log('🎵 Selecionando banda:', banda);
    setSelectedBand(banda);
    // Força reset da imagem quando banda muda
    setImagemAtual(null);
    setImagemCarregada(false);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da turnê é obrigatório";
    } else {
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
      bandaId: selectedBand?.id || null
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
      bandaId: turne.bandaId || turne.banda?.id || turne.raw?.bandaId || turne.raw?.banda?.id || null
    });
    
    const [startDay, startMonth, startYear] = turne.startDate.split('/');
    const [endDay, endMonth, endYear] = turne.endDate.split('/');
    
    setSelectedStartDate(new Date(startYear, startMonth - 1, startDay));
    setSelectedEndDate(new Date(endYear, endMonth - 1, endYear));
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
      setErrors({ geral: error.response?.data?.mensagem || "Erro ao excluir turnê" });
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
        bandaId: formData.bandaId
      };

      console.log('💾 Salvando turnê com payload:', payload);

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

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    
    if (key === 'imagem' && value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemAtual(reader.result);
      };
      reader.readAsDataURL(value);
    } else if (key === 'imagem' && value === null) {
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
    setFormData(prev => ({ ...prev, bandaId: banda?.id || null }));
    setBandaSearchText(banda?.nome || "");
    setShowBandaDropdown(false);
    if (errors.banda) {
      setErrors(prev => ({ ...prev, banda: undefined }));
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  const getSelectedBandaName = () => {
    if (!formData.bandaId) return "";
    const banda = bandas.find(b => b.id === formData.bandaId);
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
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TurneHeader
            selectedBand={selectedBand}
            onBandSelect={handleBandSelect}
            onCreateTurne={handleCreateTurne}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banda: <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Pesquisar banda..."
                          value={showBandaDropdown ? bandaSearchText : getSelectedBandaName()}
                          onChange={(e) => {
                            setBandaSearchText(e.target.value);
                            setShowBandaDropdown(true);
                          }}
                          onFocus={() => {
                            setBandaSearchText(getSelectedBandaName());
                            setShowBandaDropdown(true);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={submitLoading}
                        />
                        
                        {showBandaDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {filteredBandas.length === 0 ? (
                              <div className="px-3 py-2 text-gray-500 text-sm">
                                Nenhuma banda encontrada
                              </div>
                            ) : (
                              filteredBandas.map((banda) => (
                                <button
                                  key={banda.id}
                                  type="button"
                                  onClick={() => handleBandaSelectInModal(banda)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                >
                                  {banda.nome}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      {errors.banda && (
                        <p className="text-red-500 text-sm mt-1">{errors.banda}</p>
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
                      label="Foto da Turnê"
                      onFileSelect={(file) => handleChange("imagem", file)}
                      currentImage={imagemAtual}
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
import React, { useEffect, useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Input } from "../components/Input";
import { InputFile } from "../components/InputFile";
import { Modal } from "../components/Modal";
import { ButtonPage } from "../components/ButtonPage";
import { GeneroCombobox } from "../components/GeneroCombobox";
import { Trash2, Edit, MoreVertical } from "lucide-react";
import { useBandas } from "../hooks/useBandas";
import { useRepresentantes } from "../hooks/useRepresentantes";
import { useArtistas } from "../hooks/useArtistas";
import { DropdownMenu } from "../components/DropdownMenu";
import { ConfirmModal } from "../components/ConfirmModal";

// ========== Tela Principal ==========
export function ArtistaApp() {
  const { 
    bandas, 
    loading, 
    listarBandas, 
    buscarImagem, 
    criarBanda, 
    atualizarBanda, 
    excluirBanda, 
    adicionarIntegrantes 
  } = useBandas();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bandaParaEditar, setBandaParaEditar] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    banda: null
  });

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
      <main className="flex-1 bg-[#f4f5f7] p-8">
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
              <BandaCard
                key={banda.id}
                banda={banda}
                buscarImagem={buscarImagem}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                isDropdownOpen={openDropdown === banda.id}
                onToggleDropdown={() => toggleDropdown(banda.id)}
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
      </main>
    </Layout>
  );
}

// ========== Componentes Auxiliares ==========
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-gray-500 max-w-md mb-6">
        Vixi! Ainda não temos nenhuma banda cadastrada. Que tal adicionar uma
        agora e começar o show?
      </p>
      <ButtonPage text="Adicionar banda" click={onAdd} />
    </div>
  );
}

function BandaCard({ banda, buscarImagem, onEdit, onDelete, isDropdownOpen, onToggleDropdown }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    console.log("Banda completa:", banda); // ← ADICIONE ISSO
    console.log("nomeFoto:", banda.nomeFoto); // ← E ISSO
    
    if (banda.nomeFoto) {
      buscarImagem(banda.nomeFoto).then(url => {
        console.log("URL da imagem carregada:", url); // ← E ISSO
        setImageUrl(url);
      });
    }
  }, [banda.nomeFoto, buscarImagem]);

  const dropdownItems = [
    { icon: Edit, label: "Editar banda", onClick: () => onEdit(banda) },
    { icon: Trash2, label: "Excluir banda", onClick: () => onDelete(banda) }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleDropdown();
        }}
        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-all"
      >
        <MoreVertical className="w-5 h-5 text-gray-700" />
      </button>

      <div className="absolute top-14 right-4 z-30">
        <DropdownMenu isOpen={isDropdownOpen} items={dropdownItems} />
      </div>

      <div className="max-h-80 min-h-80 bg-gray-200 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={banda.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 font-semibold">Sem foto</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{banda.nome}</h3>
        <p className="text-xs text-gray-500 mb-1">
          Representante: {banda.representante?.nome || "N/A"}
        </p>
        <p className="text-xs text-gray-400">
          {banda.integrantes?.length || 0} integrante(s)
        </p>
      </div>
    </div>
  );
}

// ========== Modal ==========
function AddBandaModal({ onSuccess, onClose, criarBanda, atualizarBanda, adicionarIntegrantes, bandaParaEditar }) {
  const isEditMode = !!bandaParaEditar;
  const { buscarImagem } = useBandas();
  const [imagemAtual, setImagemAtual] = useState(null);
  const [imagemCarregada, setImagemCarregada] = useState(false);

  const [draft, setDraft] = useState({
    nome: bandaParaEditar?.nome || "",
    descricao: bandaParaEditar?.descricao || "",
    genero: bandaParaEditar?.genero || "ROCK",
    representanteId: bandaParaEditar?.representante?.id || null,
    foto: null,
    quantidadeIntegrantes: bandaParaEditar?.integrantes?.length || 1,
    integrantes: bandaParaEditar?.integrantes?.map(int => ({
      id: int.id,
      nome: int.nome || "",
      cpf: int.cpf || ""
    })) || [{ nome: "", cpf: "" }],
  });

  useEffect(() => {
    const carregarImagem = async () => {
      if (bandaParaEditar?.nomeFoto && !imagemCarregada) {
        const imageUrl = await buscarImagem(bandaParaEditar.nomeFoto);
        setImagemAtual(imageUrl);
        setImagemCarregada(true);
      }
    };
    carregarImagem();
  }, [bandaParaEditar, buscarImagem, imagemCarregada]);

  const [showNovoRepresentante, setShowNovoRepresentante] = useState(false);
  const [novoRepresentante, setNovoRepresentante] = useState({
    nome: "",
    email: "",
  });

  const { representantes, listarRepresentantes, criarRepresentante } = useRepresentantes();
  const { criarArtista, atualizarArtista, excluirArtista } = useArtistas();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    listarRepresentantes();
  }, [listarRepresentantes]);

  const handleChange = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null }));
    
    if (key === 'foto' && value) {
      // Aviso temporário sobre upload de imagens
      console.warn('⚠️ Upload de imagens está com problema no backend. A banda será criada sem foto.');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemAtual(reader.result);
      };
      reader.readAsDataURL(value);
    } else if (key === 'foto' && value === null) {
      if (bandaParaEditar?.nomeFoto) {
        buscarImagem(bandaParaEditar.nomeFoto).then(setImagemAtual);
      } else {
        setImagemAtual(null);
      }
    }
  };

  const handleIntegranteChange = (index, key, value) => {
    const updated = draft.integrantes.map((integrante, i) =>
      i === index ? { ...integrante, [key]: value } : integrante
    );
    setDraft((d) => ({ ...d, integrantes: updated }));
  };

  const adicionarIntegrante = () => {
    setDraft((d) => ({
      ...d,
      integrantes: [...d.integrantes, { nome: "", cpf: "" }],
      quantidadeIntegrantes: d.integrantes.length + 1
    }));
  };

  const removerIntegrante = async (index) => {
    const integrante = draft.integrantes[index];
    
    // Se é um integrante existente (tem ID), confirmar exclusão
    if (integrante.id) {
      const confirmar = window.confirm(
        `Tem certeza que deseja remover ${integrante.nome} da banda?`
      );
      if (!confirmar) return;

      try {
        // TODO: Implementar endpoint de remover integrante da banda
        // await removerIntegranteDaBanda(bandaParaEditar.id, integrante.id);
        console.log("Remover integrante:", integrante.id);
      } catch (error) {
        console.error("Erro ao remover integrante:", error);
        alert("Erro ao remover integrante. Tente novamente.");
        return;
      }
    }

    // Remove da lista
    const updated = draft.integrantes.filter((_, i) => i !== index);
    setDraft((d) => ({
      ...d,
      integrantes: updated,
      quantidadeIntegrantes: updated.length
    }));
  };

  const handleQuantidadeChange = (quantidade) => {
    const num = Number(quantidade);
    handleChange("quantidadeIntegrantes", num);

    const integrantes = Array.from({ length: num }, (_, i) =>
      draft.integrantes[i] || { nome: "", cpf: "" }
    );
    handleChange("integrantes", integrantes);
  };

  async function handleFinish() {
    try {
      setLoading(true);
      setErrors({});

      if (!draft.nome) {
        setErrors({ nome: "Nome da banda é obrigatório" });
        return;
      }

      if (isEditMode) {
        // Modo Edição
        const dadosAtualizacao = {
          nome: draft.nome,
          descricao: draft.descricao,
          genero: draft.genero,
          representanteId: draft.representanteId,
        };

        await atualizarBanda(bandaParaEditar.id, dadosAtualizacao, draft.foto);
        
        // Atualizar integrantes existentes e criar novos
        for (const integrante of draft.integrantes) {
          if (integrante.id) {
            // Atualizar integrante existente
            await atualizarArtista(integrante.id, {
              nome: integrante.nome,
              cpf: integrante.cpf
            });
          } else if (integrante.nome && integrante.cpf) {
            // Criar novo integrante
            const artistaCriado = await criarArtista({
              nome: integrante.nome,
              cpf: integrante.cpf,
              fotoNome: null,
            });
            await adicionarIntegrantes(bandaParaEditar.id, [artistaCriado.id]);
          }
        }
        
        onSuccess();
        return;
      }

      // Modo Criação
      let representanteId = draft.representanteId;

      if (showNovoRepresentante) {
        if (!novoRepresentante.nome || !novoRepresentante.email) {
          setErrors({ representante: "Preencha todos os campos obrigatórios" });
          return;
        }

        const representanteCriado = await criarRepresentante(novoRepresentante);
        representanteId = representanteCriado.id;
      }

      const bandaCriada = await criarBanda(
        {
          nome: draft.nome,
          descricao: draft.descricao,
          genero: draft.genero,
          representanteId,
        },
        draft.foto
      );

      const integrantesIds = [];
      for (const integrante of draft.integrantes) {
        if (integrante.nome && integrante.cpf) {
          const artistaCriado = await criarArtista({
            nome: integrante.nome,
            cpf: integrante.cpf,
            fotoNome: null,
          });
          integrantesIds.push(artistaCriado.id);
        }
      }

      if (integrantesIds.length > 0) {
        await adicionarIntegrantes(bandaCriada.id, integrantesIds);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao processar banda:", error);
      
      // Mensagem de erro mais amigável
      let errorMessage = "Erro ao processar banda";
      const serverMessage = error.response?.data?.message || error.response?.data?.mensagem;
      
      if (serverMessage) {
        // Se a mensagem contém um caminho de arquivo, é erro de upload
        if (serverMessage.includes('uploads\\') || serverMessage.includes('uploads/')) {
          errorMessage = "Erro ao fazer upload da imagem. Verifique se o servidor tem permissão para salvar arquivos.";
        } else {
          errorMessage = serverMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ geral: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditMode ? "Editar banda" : "Adicionar nova banda"}
      totalSteps={2}
      onFinish={handleFinish}
      loading={loading}
    >
      {(currentStep) => (
        <>
          {currentStep === 1 && (
            <div className="space-y-4">
              {errors.geral && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {errors.geral}
                </div>
              )}

              <Input
                label="Nome da Banda *"
                placeholder="Boogarins"
                value={draft.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                error={errors.nome}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GeneroCombobox
                  value={draft.genero}
                  onChange={(value) => handleChange("genero", value)}
                  error={errors.genero}
                />

                <InputFile
                  label="Foto da Banda"
                  onFileSelect={(file) => handleChange("foto", file)}
                  currentImage={imagemAtual}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={draft.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  placeholder="Descreva a banda..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Representante *
                </label>

                {!showNovoRepresentante ? (
                  <div className="space-y-2">
                    <select
                      value={draft.representanteId || ""}
                      onChange={(e) =>
                        handleChange("representanteId", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um representante</option>
                      {representantes.map((rep) => (
                        <option key={rep.id} value={rep.id}>
                          {rep.nome} - {rep.email}
                        </option>
                      ))}
                    </select>
                    {!isEditMode && (
                      <button
                        type="button"
                        onClick={() => setShowNovoRepresentante(true)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Adicionar novo representante
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <h4 className="font-medium text-sm">Novo Representante</h4>
                    <Input
                      label="Nome *"
                      value={novoRepresentante.nome}
                      onChange={(e) =>
                        setNovoRepresentante({
                          ...novoRepresentante,
                          nome: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Email *"
                      type="email"
                      value={novoRepresentante.email}
                      onChange={(e) =>
                        setNovoRepresentante({
                          ...novoRepresentante,
                          email: e.target.value,
                        })
                      }
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowNovoRepresentante(false)}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      ← Voltar para seleção
                    </button>
                  </div>
                )}
                {errors.representanteId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.representanteId}
                  </p>
                )}
                {errors.representante && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.representante}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Integrantes ({draft.integrantes.length})
                </h3>
                <button
                  type="button"
                  onClick={adicionarIntegrante}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + Adicionar Integrante
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {draft.integrantes.map((integrante, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">
                        Integrante {i + 1}
                        {integrante.id && (
                          <span className="ml-2 text-xs text-green-600">(Cadastrado)</span>
                        )}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removerIntegrante(i)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remover integrante"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      label="Nome"
                      placeholder="Nome completo"
                      value={integrante.nome}
                      onChange={(e) =>
                        handleIntegranteChange(i, "nome", e.target.value)
                      }
                    />
                    <Input
                      label="CPF"
                      placeholder="000.000.000-00"
                      value={integrante.cpf}
                      onChange={(e) =>
                        handleIntegranteChange(i, "cpf", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              {draft.integrantes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum integrante adicionado.</p>
                  <p className="text-sm">Clique em "Adicionar Integrante" para começar.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

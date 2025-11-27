import React, { useState, useEffect } from "react";
import { Input } from "../../components/Input";
import { InputFile } from "../../components/InputFile";
import { Modal } from "../../components/Modal";
import { ComboBox } from "../../components/ComboBox";
import { Trash2 } from "lucide-react";
import { GENEROS } from "../../constants/generos";
import { useRepresentantes } from "../../hooks/useRepresentantes";
import { useArtistas } from "../../hooks/useArtistas";

export function AddBandaModal({ onSuccess, onClose, criarBanda, atualizarBanda, adicionarIntegrantes, bandaParaEditar }) {
  const isEditMode = !!bandaParaEditar;
  const [imagemAtual, setImagemAtual] = useState(bandaParaEditar?.imagemUrl || null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemAtual(reader.result);
      };
      reader.readAsDataURL(value);
    } else if (key === 'foto' && value === null) {
      setImagemAtual(bandaParaEditar?.imagemUrl || null);
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
    if (integrante.id) {
      const confirmar = window.confirm(
        `Tem certeza que deseja remover ${integrante.nome} da banda?`
      );
      if (!confirmar) return;
      try {
        // Aqui pode chamar excluirArtista se quiser remover do backend
      } catch (error) {
        console.error("Erro ao remover integrante:", error);
        alert("Erro ao remover integrante. Tente novamente.");
        return;
      }
    }
    const updated = draft.integrantes.filter((_, i) => i !== index);
    setDraft((d) => ({
      ...d,
      integrantes: updated,
      quantidadeIntegrantes: updated.length
    }));
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
        const dadosAtualizacao = {
          nome: draft.nome,
          descricao: draft.descricao,
          genero: draft.genero,
          representanteId: draft.representanteId,
        };
        await atualizarBanda(bandaParaEditar.id, dadosAtualizacao, draft.foto);
        for (const integrante of draft.integrantes) {
          if (integrante.id) {
            await atualizarArtista(integrante.id, {
              nome: integrante.nome,
              cpf: integrante.cpf
            });
          } else if (integrante.nome && integrante.cpf) {
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
      let representanteId = draft.representanteId;
      if (showNovoRepresentante) {
        if (!novoRepresentante.nome || !novoRepresentante.email) {
          setErrors({ representante: "Preencha todos os campos obrigatórios" });
          return;
        }
        const representanteCriado = await criarRepresentante(novoRepresentante);
        representanteId = representanteCriado.id;
      }
      if (!representanteId) {
        setErrors({ representanteId: "Selecione um representante" });
        return;
      }
      const integrantesValidos = draft.integrantes.filter(
        int => int.nome?.trim() && int.cpf?.trim()
      );
      if (integrantesValidos.length === 0) {
        setErrors({ integrantes: "Adicione pelo menos um integrante com nome e CPF preenchidos" });
        return;
      }
      const cpfs = integrantesValidos.map(int => int.cpf.replace(/\D/g, ''));
      const cpfsDuplicados = cpfs.filter((cpf, index) => cpfs.indexOf(cpf) !== index);
      if (cpfsDuplicados.length > 0) {
        setErrors({ 
          integrantes: `CPF duplicado na lista: ${cpfsDuplicados.join(', ')}` 
        });
        return;
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
      for (let i = 0; i < integrantesValidos.length; i++) {
        const integrante = integrantesValidos[i];
        try {
          const artistaCriado = await criarArtista({
            nome: integrante.nome.trim(),
            cpf: integrante.cpf.replace(/\D/g, ''),
            fotoNome: null,
          });
          integrantesIds.push(artistaCriado.id);
        } catch (error) {
          const errorMsg = error.response?.data?.message || 
                          error.response?.data?.mensagem || 
                          error.message || 
                          'Erro desconhecido';
          if (errorMsg.includes('Unique index') || 
              errorMsg.includes('duplicate') || 
              errorMsg.includes('CPF')) {
            throw new Error(`O CPF ${integrante.cpf} já está cadastrado no sistema`);
          }
          throw new Error(`Erro ao criar integrante "${integrante.nome}": ${errorMsg}`);
        }
      }
      if (integrantesIds.length > 0) {
        await adicionarIntegrantes(bandaCriada.id, integrantesIds);
      }
      onSuccess();
    } catch (error) {
      let errorMessage = "Erro ao processar banda";
      const serverMessage = error.response?.data?.message || error.response?.data?.mensagem;
      if (serverMessage) {
        if (serverMessage.includes('uploads\\') || serverMessage.includes('uploads/')) {
          errorMessage = "Erro ao fazer upload da imagem. Verifique se o servidor tem permissão para salvar arquivos.";
        } else if (serverMessage.includes('Unique index') || serverMessage.includes('duplicate')) {
          errorMessage = "CPF já cadastrado no sistema. Verifique os dados dos integrantes.";
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
                <ComboBox
                  label="Gênero"
                  value={draft.genero}
                  onChange={(value) => handleChange("genero", value)}
                  options={GENEROS}
                  error={errors.genero}
                  placeholder="Selecione um gênero"
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
              {errors.integrantes && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {errors.integrantes}
                </div>
              )}
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
import React, { useEffect, useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Input } from "../components/Input";
import { InputFile } from "../components/InputFile";
import { Modal } from "../components/Modal";
import { ButtonPage } from "../components/ButtonPage";
import { Trash2 } from "lucide-react";
import { useBandas } from "../hooks/useBandas";
import { useRepresentantes } from "../hooks/useRepresentantes";
import { useArtistas } from "../hooks/useArtistas";

// ========== Tela Principal ==========
export function ArtistaApp() {
  const { bandas, loading, listarBandas, buscarImagem, criarBanda, adicionarIntegrantes } = useBandas();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    listarBandas();
  }, [listarBandas]);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function onBandaCreated() {
    await listarBandas();
    closeModal();
  }

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
              />
            ))}
          </div>
        )}

        {isModalOpen && (
          <AddBandaModal
            onSuccess={onBandaCreated}
            onClose={closeModal}
            criarBanda={criarBanda}
            adicionarIntegrantes={adicionarIntegrantes}
          />
        )}
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

function BandaCard({ banda, buscarImagem }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (banda.nomeFoto) {
      buscarImagem(banda.nomeFoto).then(setImageUrl);
    }
  }, [banda.nomeFoto, buscarImagem]);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      <div className="h-min-70 h-fill h-max-100 bg-gray-200 flex items-center justify-center overflow-hidden">
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
function AddBandaModal({ onSuccess, onClose, criarBanda, adicionarIntegrantes }) {
  const [draft, setDraft] = useState({
    nome: "",
    descricao: "",
    genero: "ROCK",
    representanteId: null,
    foto: null,
    quantidadeIntegrantes: 1,
    integrantes: [{ nome: "", cpf: "" }],
  });

  const [showNovoRepresentante, setShowNovoRepresentante] = useState(false);
  const [novoRepresentante, setNovoRepresentante] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
  });

  const { representantes, listarRepresentantes, criarRepresentante } = useRepresentantes();
  const { criarArtista } = useArtistas();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    listarRepresentantes();
  }, [listarRepresentantes]);

  const handleChange = (key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null }));
  };

  const handleIntegranteChange = (index, key, value) => {
    const updated = draft.integrantes.map((integrante, i) =>
      i === index ? { ...integrante, [key]: value } : integrante
    );
    setDraft((d) => ({ ...d, integrantes: updated }));
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

      // Validações
      if (!draft.nome) {
        setErrors({ nome: "Nome da banda é obrigatório" });
        return;
      }

      // 1. Criar representante se necessário
      let representanteId = draft.representanteId;

      if (showNovoRepresentante) {
        if (
          !novoRepresentante.nome ||
          !novoRepresentante.email
        ) {
          setErrors({ representante: "Preencha todos os campos obrigatórios" });
          return;
        }

        const representanteCriado = await criarRepresentante(novoRepresentante);
        representanteId = representanteCriado.id;
      }

      // 2. Criar banda
      const bandaCriada = await criarBanda(
        {
          nome: draft.nome,
          descricao: draft.descricao,
          genero: draft.genero,
          representanteId,
        },
        draft.foto
      );

      // 3. Criar artistas e coletar IDs
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

      // 4. Adicionar integrantes à banda
      if (integrantesIds.length > 0) {
        await adicionarIntegrantes(bandaCriada.id, integrantesIds);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao criar banda:", error);
      setErrors({ geral: error.message || "Erro ao criar banda" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Adicionar nova banda"
      totalSteps={2}
      onFinish={handleFinish}
      loading={loading}
    >
      {(currentStep) => (
        <>
          {/* Step 1: Dados da Banda */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero Musical *
                  </label>
                  <select
                    value={draft.genero}
                    onChange={(e) => handleChange("genero", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ROCK">Rock</option>
                    <option value="POP">Pop</option>
                    <option value="JAZZ">Jazz</option>
                    <option value="BLUES">Blues</option>
                    <option value="ELETRONICA">Eletrônica</option>
                    <option value="HIP_HOP">Hip Hop</option>
                    <option value="SAMBA">Samba</option>
                    <option value="FUNK">Funk</option>
                    <option value="REGGAE">Reggae</option>
                    <option value="MPB">MPB</option>
                  </select>
                </div>

                <InputFile
                  label="Foto da Banda"
                  onFileSelect={(file) => handleChange("foto", file)}
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

              {/* Representante */}
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
                    <button
                      type="button"
                      onClick={() => setShowNovoRepresentante(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Adicionar novo representante
                    </button>
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

          {/* Step 2: Integrantes */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Input
                label="Quantidade de Integrantes"
                type="number"
                min={1}
                max={20}
                value={draft.quantidadeIntegrantes}
                onChange={(e) => handleQuantidadeChange(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {draft.integrantes.map((integrante, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                  >
                    <h4 className="font-medium text-sm">Integrante {i + 1}</h4>
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
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

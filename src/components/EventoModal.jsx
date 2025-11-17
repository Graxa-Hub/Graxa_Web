import React, { useState, useEffect } from "react";
import { Input } from "./Input";
import { InputDate } from "./InputDate";
import { EnderecoForm } from "./EnderecoForm";
import { useBandas } from "../hooks/useBandas";
import { useLocais } from "../hooks/useLocais";
import { useTurnes } from "../hooks/useTurnes";
import { useShows } from "../hooks/useShows";
import { useViagens } from "../hooks/useViagens";
import {
  validateShow,
  validateViagem,
  validateTurne,
} from "../utils/validations";
import {
  mapErrorsToFields,
  SHOW_ERROR_MAP,
  VIAGEM_ERROR_MAP,
} from "../utils/errorMapping";

export function EventoModal({ isOpen, onClose, onFinish }) {
  const [activeTab, setActiveTab] = useState("show");
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({});

  const { bandas, listarBandas } = useBandas();
  const { locais, listarLocais, criarLocal } = useLocais();
  const { turnes, listarTurnes, criarTurne } = useTurnes();
  const { criarShow, adicionarBandas } = useShows();
  const { criarViagem } = useViagens();

  const [showNovoLocal, setShowNovoLocal] = useState(false);
  const [showNovaTurne, setShowNovaTurne] = useState(false);

  const [novoLocal, setNovoLocal] = useState({
    nome: "",
    capacidade: "",
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      pais: "Brasil",
    },
  });

  const [novaTurne, setNovaTurne] = useState({
    nome: "",
    descricao: "",
    bandaId: "",
  });

  const [showData, setShowData] = useState({
    titulo: "",
    descricao: "",
    localId: "",
    turneId: "",
    dataHoraInicio: "",
    dataHoraFim: "",
    bandasIds: [],
  });

  const [viagemData, setViagemData] = useState({
    nomeEvento: "",
    descricao: "",
    tipoViagem: "onibus",
    dataInicio: "",
    dataFim: "",
    turneId: "",
  });

  useEffect(() => {
    if (isOpen) {
      listarBandas();
      listarLocais();
      listarTurnes();
      setFieldErrors({});
    }
  }, [isOpen, listarBandas, listarLocais, listarTurnes]);

  const tabs = [
    { id: "show", label: "Show" },
    { id: "viagem", label: "Viagem" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentStep(1);
    setFieldErrors({});
  };

  const validateAll = () => {
    setFieldErrors({});
    let errors = [];
    let fieldMap = {};

    if (activeTab === "show") {
      errors = validateShow(showData, novoLocal, showNovoLocal);
      fieldMap = SHOW_ERROR_MAP;

      if (showNovaTurne) {
        const turneErrors = validateTurne(novaTurne, bandas);
        errors = [...errors, ...turneErrors];
      }
    } else if (activeTab === "viagem") {
      errors = validateViagem(viagemData);
      fieldMap = VIAGEM_ERROR_MAP;
    }

    const newFieldErrors = mapErrorsToFields(errors, fieldMap);
    setFieldErrors(newFieldErrors);

    return errors.length === 0;
  };

  const handleFinish = async () => {
    if (!validateAll()) {
      const hasStep1Error = Object.keys(fieldErrors).some((key) =>
        [
          "nomeEvento",
          "titulo",
          "bandas",
          "local",
          "nomeLocal",
          "capacidade",
          "logradouro",
          "numero",
          "cidade",
          "estado",
          "cep",
          "origem",
          "destino",
        ].includes(key)
      );
      if (hasStep1Error && currentStep === 2) {
        setCurrentStep(1);
      }
      return;
    }

    if (activeTab === "show") {
      try {
        let localIdFinal = showData.localId;
        let turneIdFinal = showData.turneId || null;

        if (showNovoLocal) {
          const localCriado = await criarLocal(novoLocal);
          localIdFinal = localCriado.id;
        }

        if (showNovaTurne) {
          const turneCriada = await criarTurne(novaTurne);
          turneIdFinal = turneCriada.id;
        }

        const showPayload = {
          nomeEvento: showData.titulo,
          dataInicio: showData.dataHoraInicio,
          dataFim: showData.dataHoraFim,
          descricao: showData.descricao || "",
          turneId: turneIdFinal,
          localId: localIdFinal,
          responsavelId: 1,
        };

        const showCriado = await criarShow(showPayload);

        if (showData.bandasIds && showData.bandasIds.length > 0) {
          await adicionarBandas(showCriado.id, showData.bandasIds);
        }

        console.log("Show criado com sucesso:", showCriado);
        onFinish?.(showCriado);
        onClose();
      } catch (error) {
        console.error("Erro ao criar show:", error);
        setFieldErrors({
          general:
            error.response?.data?.message ||
            "Erro ao cadastrar show. Tente novamente.",
        });
        return;
      }
    } else if (activeTab === "viagem") {
      try {
        const viagemPayload = {
          nomeEvento: viagemData.nomeEvento,
          dataInicio: viagemData.dataInicio,
          dataFim: viagemData.dataFim,
          descricao: viagemData.descricao || "",
          tipoViagem: viagemData.tipoViagem,
          turneId: viagemData.turneId ? Number(viagemData.turneId) : null,
        };

        console.log("Payload da viagem:", viagemPayload);
        const viagemCriada = await criarViagem(viagemPayload);
        console.log("Viagem criada com sucesso:", viagemCriada);
        onFinish?.(viagemCriada);
        onClose();
      } catch (error) {
        console.error("Erro ao criar viagem:", error);
        setFieldErrors({
          general:
            error.response?.data?.message ||
            "Erro ao cadastrar viagem. Tente novamente.",
        });
        return;
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      setFieldErrors({});
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFieldErrors({});
    }
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const renderContent = () => {
    if (activeTab === "show") {
      return (
        <ShowContent
          currentStep={currentStep}
          data={showData}
          setData={setShowData}
          bandas={bandas}
          locais={locais}
          turnes={turnes}
          showNovoLocal={showNovoLocal}
          setShowNovoLocal={setShowNovoLocal}
          novoLocal={novoLocal}
          setNovoLocal={setNovoLocal}
          showNovaTurne={showNovaTurne}
          setShowNovaTurne={setShowNovaTurne}
          novaTurne={novaTurne}
          setNovaTurne={setNovaTurne}
          fieldErrors={fieldErrors}
          clearFieldError={clearFieldError}
        />
      );
    } else {
      return (
        <ViagemContent
          currentStep={currentStep}
          data={viagemData}
          setData={setViagemData}
          turnes={turnes}
          fieldErrors={fieldErrors}
          clearFieldError={clearFieldError}
        />
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl z-10">
          <div className="flex items-center justify-center gap-8 p-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-2 px-4 text-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-red-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === step
                    ? "bg-red-500"
                    : currentStep > step
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {fieldErrors.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-800">{fieldErrors.general}</p>
              </div>
            </div>
          )}

          {renderContent()}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {currentStep === 2 ? "Finalizar" : "Próxima Etapa"}
              </button>
            </div>
          </div>
        </div>
      </div>
      ''
    </div>
  );
}

// ========== COMPONENTE COMBOBOX DE BANDAS ==========
function BandaCombobox({
  bandas = [],
  selectedIds = [],
  onChange,
  error,
  clearError,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const normalize = (s) =>
    (s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const safeBandas = Array.isArray(bandas) ? bandas : [];
  const term = normalize(searchTerm);

  const filteredBandas = safeBandas.filter((banda) =>
    normalize(banda?.nome).includes(term)
  );

  const selectedBandas = safeBandas.filter((banda) =>
    selectedIds.includes(banda.id)
  );

  const handleToggle = (bandaId) => {
    if (selectedIds.includes(bandaId)) {
      onChange(selectedIds.filter((id) => id !== bandaId));
    } else {
      onChange([...selectedIds, bandaId]);
    }
    if (clearError) clearError("bandas");
  };

  const handleRemove = (bandaId) => {
    onChange(selectedIds.filter((id) => id !== bandaId));
    if (clearError) clearError("bandas");
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Bandas do Show <span className="text-red-500">*</span>
      </label>

      {selectedBandas.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedBandas.map((banda) => (
            <span
              key={banda.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
            >
              {banda.nome}
              <button
                type="button"
                onClick={() => handleRemove(banda.id)}
                className="hover:text-red-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar bandas..."
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredBandas.length > 0 ? (
              filteredBandas.map((banda) => (
                <label
                  key={banda.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(banda.id)}
                    onChange={() => handleToggle(banda.id)}
                    className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                  />
                  <span className="text-sm">{banda.nome}</span>
                </label>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm
                  ? "Nenhuma banda encontrada"
                  : "Nenhuma banda cadastrada"}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ========== COMPONENTE COMBOBOX DE LOCAIS ==========
function LocalCombobox({
  locais = [],
  selectedId,
  onChange,
  onNovoLocal,
  error,
  clearError,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const locaisArray = Array.isArray(locais) ? locais : [];

  const filteredLocais = locaisArray.filter(
    (local) =>
      local.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      local.endereco?.cidade
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      local.endereco?.estado?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLocal = locaisArray.find((local) => local.id === selectedId);

  const handleSelect = (localId) => {
    onChange(localId);
    setIsOpen(false);
    setSearchTerm("");
    if (clearError) clearError("local");
  };

  const handleRemove = () => {
    onChange("");
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Local do Show <span className="text-red-500">*</span>
      </label>

      {selectedLocal && (
        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-start">
          <div className="text-sm">
            <p className="font-medium text-blue-900">{selectedLocal.nome}</p>
            {selectedLocal.endereco && (
              <p className="text-blue-700 text-xs mt-1">
                {selectedLocal.endereco.logradouro},{" "}
                {selectedLocal.endereco.numero} -{" "}
                {selectedLocal.endereco.cidade}/{selectedLocal.endereco.estado}
              </p>
            )}
            {selectedLocal.capacidade && (
              <p className="text-blue-600 text-xs mt-1">
                Capacidade: {selectedLocal.capacidade} pessoas
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar local..."
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onNovoLocal();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 border-b border-gray-200 font-medium"
            >
              + Cadastrar novo local
            </button>

            {filteredLocais.length > 0 ? (
              filteredLocais.map((local) => (
                <button
                  key={local.id}
                  type="button"
                  onClick={() => handleSelect(local.id)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {local.nome}
                  </p>
                  {local.endereco && (
                    <p className="text-xs text-gray-600 mt-1">
                      {local.endereco.cidade}/{local.endereco.estado}
                      {local.capacidade && ` • Cap: ${local.capacidade}`}
                    </p>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm
                  ? "Nenhum local encontrado"
                  : "Nenhum local cadastrado"}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ========== MODAL DE SHOW ==========
function ShowContent({
  currentStep,
  data,
  setData,
  bandas = [],
  locais = [],
  turnes = [],
  showNovoLocal,
  setShowNovoLocal,
  novoLocal,
  setNovoLocal,
  showNovaTurne,
  setShowNovaTurne,
  novaTurne,
  setNovaTurne,
  fieldErrors = {},
  clearFieldError,
}) {
  const handleNovoLocalChange = (field, value) => {
    setNovoLocal((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (clearFieldError) clearFieldError(field);
  };

  const handleEnderecoChange = (field, value) => {
    setNovoLocal((prev) => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value,
      },
    }));
    if (clearFieldError) clearFieldError(field);
  };

  const turnesFiltradas = turnes.filter((turne) =>
    data.bandasIds.includes(turne.bandaId)
  );

  console.log("Turnês filtradas:", turnesFiltradas);
  console.log("Primeira turnê:", turnesFiltradas[0]);

  if (currentStep === 1) {
    return (
      <div className="space-y-4">
        <Input
          label="Título do Show"
          value={data.titulo}
          onChange={(e) => {
            setData({ ...data, titulo: e.target.value });
            if (clearFieldError) clearFieldError("titulo");
          }}
          placeholder="Ex: Festival de Rock 2025"
          required
          error={fieldErrors.titulo}
        />

        <BandaCombobox
          bandas={bandas}
          selectedIds={data.bandasIds}
          onChange={(ids) => {
            setData({ ...data, bandasIds: ids });
            if (!ids.includes(data.turneId)) {
              setData((prev) => ({ ...prev, turneId: "" }));
            }
          }}
          error={fieldErrors.bandas}
          clearError={clearFieldError}
        />

        {!showNovoLocal ? (
          <LocalCombobox
            locais={locais}
            selectedId={data.localId}
            onChange={(id) => setData({ ...data, localId: id })}
            onNovoLocal={() => setShowNovoLocal(true)}
            error={fieldErrors.local}
            clearError={clearFieldError}
          />
        ) : (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-900">
                Cadastrar Novo Local
              </h3>
              <button
                type="button"
                onClick={() => setShowNovoLocal(false)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Cancelar
              </button>
            </div>

            <Input
              label="Nome do Local"
              value={novoLocal.nome}
              onChange={(e) => handleNovoLocalChange("nome", e.target.value)}
              placeholder="Ex: Arena Graxa"
              required
              error={fieldErrors.nomeLocal}
            />

            <Input
              label="Capacidade"
              type="text"
              inputMode="numeric"
              value={novoLocal.capacidade}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleNovoLocalChange("capacidade", value);
              }}
              placeholder="Ex: 5000"
              required
              error={fieldErrors.capacidade}
            />

            <EnderecoForm
              endereco={novoLocal.endereco}
              onChange={(field, value) => handleEnderecoChange(field, value)}
              errors={{
                logradouro: fieldErrors.logradouro,
                numero: fieldErrors.numero,
                cidade: fieldErrors.cidade,
                estado: fieldErrors.estado,
                cep: fieldErrors.cep,
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputDate
            label="Data/Hora de Início"
            value={data.dataHoraInicio}
            onChange={(e) => {
              setData({ ...data, dataHoraInicio: e.target.value });
              if (clearFieldError) clearFieldError("dataHoraInicio");
            }}
            required
            error={fieldErrors.dataHoraInicio}
          />

          <InputDate
            label="Data/Hora de Fim"
            value={data.dataHoraFim}
            onChange={(e) => {
              setData({ ...data, dataHoraFim: e.target.value });
              if (clearFieldError) clearFieldError("dataHoraFim");
            }}
            required
            error={fieldErrors.dataHoraFim}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição do Show
        </label>
        <textarea
          value={data.descricao}
          onChange={(e) => setData({ ...data, descricao: e.target.value })}
          placeholder="Descreva os detalhes do show..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {data.bandasIds.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Turnê (Opcional)
          </label>
          <select
            value={data.turneId || ""}
            onChange={(e) => setData({ ...data, turneId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma turnê</option>
            {turnesFiltradas.length > 0 ? (
              turnesFiltradas.map((turne) => (
                <option key={turne.id} value={turne.id}>
                  {turne.nomeTurne || turne.nome}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Nenhuma turnê cadastrada para as bandas selecionadas
              </option>
            )}
          </select>

          <button
            type="button"
            onClick={() => setShowNovaTurne(!showNovaTurne)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            {showNovaTurne ? "Cancelar" : "+ Criar nova turnê"}
          </button>
        </div>
      )}

      {showNovaTurne && (
        <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-900">
            Cadastrar Nova Turnê
          </h3>

          <Input
            label="Nome da Turnê"
            value={novaTurne.nome}
            onChange={(e) => {
              setNovaTurne({ ...novaTurne, nome: e.target.value });
              if (clearFieldError) clearFieldError("nomeTurne");
            }}
            placeholder="Ex: Turnê Nacional 2025"
            required
            error={fieldErrors.nomeTurne}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banda <span className="text-red-500">*</span>
            </label>
            <select
              value={novaTurne.bandaId}
              onChange={(e) => {
                setNovaTurne({ ...novaTurne, bandaId: e.target.value });
                if (clearFieldError) clearFieldError("bandaTurne");
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                fieldErrors.bandaTurne
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <option value="">Selecione uma banda</option>
              {bandas
                .filter((banda) => data.bandasIds.includes(banda.id))
                .map((banda) => (
                  <option key={banda.id} value={banda.id}>
                    {banda.nome}
                  </option>
                ))}
            </select>
            {fieldErrors.bandaTurne && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.bandaTurne}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={novaTurne.descricao}
              onChange={(e) =>
                setNovaTurne({ ...novaTurne, descricao: e.target.value })
              }
              placeholder="Descreva a turnê..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ========== MODAL DE VIAGEM ==========
function ViagemContent({
  currentStep,
  data,
  setData,
  turnes = [],
  fieldErrors = {},
  clearFieldError,
}) {
  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (clearFieldError) clearFieldError(key);
  };

  if (currentStep === 1) {
    return (
      <div className="space-y-4">
        <div>
          <Input
            label="Título da Viagem *"
            placeholder="Viagem para Rio de Janeiro"
            value={data.nomeEvento}
            onChange={(e) => handleChange("nomeEvento", e.target.value)}
            required
            error={fieldErrors.nomeEvento}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Transporte *
          </label>
          <select
            value={data.tipoViagem}
            onChange={(e) => handleChange("tipoViagem", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.tipoViagem
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
          >
            <option value="aereo">✈️ Aéreo</option>
            <option value="onibus">🚌 Ônibus</option>
            <option value="carro">🚗 Carro</option>
            <option value="van">🚐 Van</option>
            <option value="terrestre">🚛 Terrestre (Outro)</option>
          </select>
          {fieldErrors.tipoViagem && (
            <p className="text-red-600 text-sm mt-1">
              {fieldErrors.tipoViagem}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={data.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            placeholder="Informações sobre a viagem..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputDate
              label="Data/Hora Partida *"
              value={data.dataInicio}
              onChange={(e) => handleChange("dataInicio", e.target.value)}
              required
              error={fieldErrors.dataInicio}
            />
          </div>
          <div>
            <InputDate
              label="Data/Hora Chegada *"
              value={data.dataFim}
              onChange={(e) => handleChange("dataFim", e.target.value)}
              required
              error={fieldErrors.dataFim}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Turnê *
          </label>
          <select
            value={data.turneId || ""}
            onChange={(e) => handleChange("turneId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.turneId
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
          >
            <option value="">Selecione uma turnê</option>
            {Array.isArray(turnes) && turnes.length > 0 ? (
              turnes.map((turne) => (
                <option key={turne.id} value={turne.id}>
                  {turne.nomeTurne || turne.nome}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Nenhuma turnê cadastrada
              </option>
            )}
          </select>
          {fieldErrors.turneId && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.turneId}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

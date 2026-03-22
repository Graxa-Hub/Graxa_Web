import React, { useState, useEffect } from "react";
import { Input } from "../../../../components/ModalEventos/Input";
import { InputDate } from "../../../../components/InputDate";
import { EnderecoForm } from "../../../../components/EnderecoForm";
import { useBandas } from "../../../../hooks/useBandas";
import { useLocais } from "../../../../hooks/useLocais";
import { useTurnes } from "../../../../hooks/useTurnes";
import { useShows } from "../../../../hooks/useShows";
import { useViagens } from "../../../../hooks/useViagens";
import { showService } from "../../../../services/showService";
import { viagemService } from "../../../../services/viagemService";
import { validateShow, validateViagem } from "../../../../utils/validations";
import {
  mapErrorsToFields,
  SHOW_ERROR_MAP,
  VIAGEM_ERROR_MAP,
} from "../../../../utils/errorMapping";
import { useAuth } from "../../../../context/AuthContext";

const TOTAL_STEPS = 2; // Altere para o número de steps que quiser futuramente

export function EventoModal({
  isOpen,
  onClose,
  onFinish,
  dataHoraInicial = { inicio: "", fim: "" },
  bandaId, // ✅ Adicione estes dois props
  turneId, // ✅
}) {
  const [activeTab, setActiveTab] = useState("show");
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({});

  const { usuario } = useAuth();
  const responsavelId = usuario?.id || 1;

  const { bandas, listarBandas } = useBandas();
  const { locais, listarLocais, criarLocal } = useLocais();
  const { turnes, listarTurnes } = useTurnes();
  const { criarShow, adicionarBandas } = useShows();
  const { criarViagem } = useViagens();

  const [showNovoLocal, setShowNovoLocal] = useState(false);
  const [eventosExistentes, setEventosExistentes] = useState([]);

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

  const [showData, setShowData] = useState({
    titulo: "",
    descricao: "",
    localId: "",
    turneId: "",
    dataHoraInicio: "",
    dataHoraFim: "",
    bandaId: "",
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
    if (isOpen && dataHoraInicial.inicio) {
      setShowData((prev) => ({
        ...prev,
        dataHoraInicio: dataHoraInicial.inicio,
        dataHoraFim: dataHoraInicial.fim,
      }));

      setViagemData((prev) => ({
        ...prev,
        dataInicio: dataHoraInicial.inicio,
        dataFim: dataHoraInicial.fim,
      }));
    }
  }, [isOpen, dataHoraInicial]);

  useEffect(() => {
    if (isOpen) {
      listarBandas();
      listarLocais();
      listarTurnes();
      carregarEventos();
      setFieldErrors({});
    }
  }, [isOpen]);

  // Inicializa showData e viagemData com bandaId e turneId quando abrir
  useEffect(() => {
    if (isOpen) {
      setShowData((prev) => ({
        ...prev,
        bandaId: bandaId ? String(bandaId) : "",
        turneId: turneId ? String(turneId) : "",
        dataHoraInicio: dataHoraInicial.inicio || "",
        dataHoraFim: dataHoraInicial.fim || "",
      }));

      setViagemData((prev) => ({
        ...prev,
        turneId: turneId ? String(turneId) : "",
        dataInicio: dataHoraInicial.inicio || "",
        dataFim: dataHoraInicial.fim || "",
      }));
    }
  }, [isOpen, bandaId, turneId, dataHoraInicial]);

  useEffect(() => {
    if (!isOpen) {
      setShowData({
        titulo: "",
        descricao: "",
        localId: "",
        turneId: "",
        dataHoraInicio: "",
        dataHoraFim: "",
        bandaId: "",
      });
      setViagemData({
        nomeEvento: "",
        descricao: "",
        tipoViagem: "onibus",
        dataInicio: "",
        dataFim: "",
        turneId: "",
      });
      setNovoLocal({
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
      setShowNovoLocal(false);
      setCurrentStep(1);
      setFieldErrors({});
    }
  }, [isOpen]);

  const carregarEventos = async () => {
    try {
      const [shows, viagens] = await Promise.all([
        showService.listar().catch(() => []),
        viagemService.listar().catch(() => []),
      ]);

      const eventos = [
        ...(shows || [])
          .filter((s) => s.ativo !== false)
          .map((s) => ({
            id: `show-${s.id}`,
            titulo: s.nomeEvento,
            dataInicio: s.dataInicio,
            dataFim: s.dataFim,
            bandasIds: s.bandas?.map((b) => b.id) || [],
          })),
        ...(viagens || [])
          .filter((v) => v.ativo !== false)
          .map((v) => ({
            id: `viagem-${v.id}`,
            titulo: v.nomeEvento,
            dataInicio: v.dataInicio,
            dataFim: v.dataFim,
            bandasIds: v.turne?.bandaId ? [v.turne.bandaId] : [],
          })),
      ];

      setEventosExistentes(eventos);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  };

  const verificarLimitesTurne = (turneId, dataInicio, dataFim) => {
    if (!turneId || !dataInicio || !dataFim) return null;
    const turne = turnes.find((t) => String(t.id) === String(turneId));
    if (!turne || !turne.dataHoraInicioTurne || !turne.dataHoraFimTurne) return null;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const turneInicio = new Date(turne.dataHoraInicioTurne);
    const turneFim = new Date(turne.dataHoraFimTurne);

    // Ajusta para o final do dia da turne para incluir o último dia completo
    turneInicio.setHours(0, 0, 0, 0);
    turneFim.setHours(23, 59, 59, 999);

    if (inicio < turneInicio || fim > turneFim) {
      return {
        temErro: true,
        turneNome: turne.nome,
        turneInicio: turneInicio.toLocaleDateString("pt-BR"),
        turneFim: turneFim.toLocaleDateString("pt-BR"),
      };
    }
    return null;
  };

  const verificarConflito = (bandasIds, dataInicio, dataFim) => {
    if (!bandasIds || bandasIds.length === 0 || !dataInicio || !dataFim) {
      return null;
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      return null;
    }

    const conflitos = eventosExistentes.filter((evento) => {
      const temBandaEmComum = evento.bandasIds.some((bandaId) =>
        bandasIds.includes(bandaId)
      );

      if (!temBandaEmComum) return false;

      const eventoInicio = new Date(evento.dataInicio);
      const eventoFim = new Date(evento.dataFim);

      const temSobreposicao =
        (inicio >= eventoInicio && inicio < eventoFim) ||
        (fim > eventoInicio && fim <= eventoFim) ||
        (inicio <= eventoInicio && fim >= eventoFim);

      return temSobreposicao;
    });

    if (conflitos.length > 0) {
      const nomeBandas = bandas
        .filter((b) => bandasIds.includes(b.id))
        .map((b) => b.nome)
        .join(", ");

      const detalhes = conflitos
        .map((e) => {
          const inicioFormatado = new Date(e.dataInicio).toLocaleString(
            "pt-BR",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          );
          const fimFormatado = new Date(e.dataFim).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          return `• ${e.titulo}\n  De: ${inicioFormatado}\n  Até: ${fimFormatado}`;
        })
        .join("\n\n");

      return {
        temConflito: true,
        quantidade: conflitos.length,
        bandas: nomeBandas,
        detalhes,
      };
    }

    return null;
  };

  const tabs = [
    { id: "show", label: "🎸 Show" },
    { id: "viagem", label: "✈️ Viagem" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentStep(1);
    setFieldErrors({});
  };

  const errorMessages = {
    titulo: "Por favor, preencha o título.",
    bandaId: "Por favor, selecione a banda.",
    local: "Por favor, escolha um local.",
    nomeLocal: "Por favor, preencha o nome do local.",
    capacidade: "Por favor, preencha a capacidade.",
    logradouro: "Por favor, preencha o logradouro.",
    numero: "Por favor, preencha o número.",
    cidade: "Por favor, preencha a cidade.",
    estado: "Por favor, preencha o estado.",
    cep: "Por favor, preencha o CEP.",
    dataHoraInicio: "Por favor, preencha a data e hora de início.",
    dataHoraFim: "Por favor, preencha a data e hora de fim.",
  };

  const validateAll = () => {
    setFieldErrors({});
    let errors = [];
    let fieldMap = {};

    if (activeTab === "show") {
      errors = validateShow(showData, novoLocal, showNovoLocal);
      fieldMap = SHOW_ERROR_MAP;

      // Validação de Limites da Turnê (Show)
      if (showData.turneId && showData.dataHoraInicio && showData.dataHoraFim) {
        const limitesErro = verificarLimitesTurne(showData.turneId, showData.dataHoraInicio, showData.dataHoraFim);
        if (limitesErro) {
          setFieldErrors({
            general: (
              <div>
                <p className="font-semibold text-[var(--accent)] mb-2">
                  ⚠️ Fora do período da turnê!
                </p>
                <div className="text-sm bg-[var(--surface)] p-3 rounded border border-[var(--border)]">
                  O evento deve ocorrer entre <strong>{limitesErro.turneInicio}</strong> e <strong>{limitesErro.turneFim}</strong>.
                </div>
              </div>
            ),
          });
          return false;
        }
      }

      // Conflito de horário (mantenha como está)
      if (
        showData.bandaId.length > 0 &&
        showData.dataHoraInicio &&
        showData.dataHoraFim
      ) {
        const conflito = verificarConflito(
          showData.bandaId,
          showData.dataHoraInicio,
          showData.dataHoraFim
        );
        if (conflito) {
          setFieldErrors({
            general: (
              <div>
                <p className="font-semibold text-[var(--accent)] mb-2">
                  ⚠️ Conflito de horário detectado!
                </p>
                <div className="text-sm whitespace-pre-line bg-[var(--surface)] p-3 rounded border border-[var(--border)] font-mono">
                  {conflito.detalhes}
                </div>
                <p className="text-xs text-[var(--accent)] mt-2">
                  Ajuste as datas ou escolha outras bandas para continuar.
                </p>
              </div>
            ),
          });
          return false;
        }
      }
    } else if (activeTab === "viagem") {
      errors = validateViagem(viagemData);
      fieldMap = VIAGEM_ERROR_MAP;

      // Validação de Limites da Turnê (Viagem) REMOVIDA
      /*
      if (viagemData.turneId && viagemData.dataInicio && viagemData.dataFim) {
        const limitesErro = verificarLimitesTurne(viagemData.turneId, viagemData.dataInicio, viagemData.dataFim);
        if (limitesErro) {
          setFieldErrors({
            general: (
              <div>
                <p className="font-semibold text-[var(--accent)] mb-2">
                  ⚠️ Fora do período da turnê!
                </p>
                <div className="text-sm bg-[var(--surface)] p-3 rounded border border-[var(--border)]">
                  A viagem deve ocorrer entre <strong>{limitesErro.turneInicio}</strong> e <strong>{limitesErro.turneFim}</strong>.
                </div>
              </div>
            ),
          });
          return false;
        }
      }
      */

      if (viagemData.turneId && viagemData.dataInicio && viagemData.dataFim) {
        const turne = turnes.find((t) => t.id === Number(viagemData.turneId));
        if (turne && turne.bandaId) {
          const conflito = verificarConflito(
            [turne.bandaId],
            viagemData.dataInicio,
            viagemData.dataFim
          );

          if (conflito) {
            setFieldErrors({
              general: (
                <div>
                  <p className="font-semibold text-[var(--accent)] mb-2">
                    ⚠️ Conflito de horário detectado!
                  </p>
                  <p className="text-sm text-[var(--accent)] mb-2">
                    A banda <strong>{conflito.bandas}</strong> já possui{" "}
                    {conflito.quantidade} evento(s) agendado(s) que conflita(m)
                    com este horário:
                  </p>
                  <div className="text-sm whitespace-pre-line bg-[var(--surface)] p-3 rounded border border-[var(--border)] font-mono">
                    {conflito.detalhes}
                  </div>
                  <p className="text-xs text-[var(--accent)] mt-2">
                    Ajuste as datas ou escolha outra turnê para continuar.
                  </p>
                </div>
              ),
            });
            return false;
          }
        }
      }
    }

    const newFieldErrors = mapErrorsToFields(errors, fieldMap);
    setFieldErrors(newFieldErrors);

    return errors.length === 0;
  };

  const handleFinish = async () => {
    let errors = [];
    let fieldMap = {};

    if (activeTab === "show") {
      errors = validateShow(showData, novoLocal, showNovoLocal); // <-- só isso!
      fieldMap = SHOW_ERROR_MAP;

      // Validação de Limites da Turnê (Show)
      if (showData.turneId && showData.dataHoraInicio && showData.dataHoraFim) {
        const limitesErro = verificarLimitesTurne(showData.turneId, showData.dataHoraInicio, showData.dataHoraFim);
        if (limitesErro) {
          setFieldErrors({
            general: (
              <div>
                <p className="font-semibold text-[var(--accent)] mb-2">
                  ⚠️ Fora do período da turnê!
                </p>
                <div className="text-sm bg-[var(--surface)] p-3 rounded border border-[var(--border)]">
                  O evento deve ocorrer entre <strong>{limitesErro.turneInicio}</strong> e <strong>{limitesErro.turneFim}</strong>.
                </div>
              </div>
            ),
          });
          return false;
        }
      }

      // Só verifica conflito se bandaId e datas estão preenchidos
      if (
        showData.bandaId.length > 0 &&
        showData.dataHoraInicio &&
        showData.dataHoraFim
      ) {
        const conflito = verificarConflito(
          showData.bandaId,
          showData.dataHoraInicio,
          showData.dataHoraFim
        );
        if (conflito) {
          setFieldErrors({
            general: (
              <div>
                <p className="font-semibold text-[var(--accent)] mb-2">
                  ⚠️ Conflito de horário detectado!
                </p>
                <div className="text-sm whitespace-pre-line bg-[var(--surface)] p-3 rounded border border-[var(--border)] font-mono">
                  {conflito.detalhes}
                </div>
                <p className="text-xs text-[var(--accent)] mt-2">
                  Ajuste as datas ou escolha outras bandas para continuar.
                </p>
              </div>
            ),
          });
          return false;
        }
      }
    } else if (activeTab === "viagem") {
      errors = validateViagem(viagemData);
      fieldMap = VIAGEM_ERROR_MAP;

      // Validação de Limites da Turnê (Viagem) REMOVIDA
      /*
      if (viagemData.turneId && viagemData.dataInicio && viagemData.dataFim) {
        const limitesErro = verificarLimitesTurne(viagemData.turneId, viagemData.dataInicio, viagemData.dataFim);
        if (limitesErro) {
          setFieldErrors({
            general: (
              <div>
                <p className="font-semibold text-[var(--accent)] mb-2">
                  ⚠️ Fora do período da turnê!
                </p>
                <div className="text-sm bg-[var(--surface)] p-3 rounded border border-[var(--border)]">
                  A viagem deve ocorrer entre <strong>{limitesErro.turneInicio}</strong> e <strong>{limitesErro.turneFim}</strong>.
                </div>
              </div>
            ),
          });
          return false;
        }
      }
      */

      if (viagemData.turneId && viagemData.dataInicio && viagemData.dataFim) {
        const turne = turnes.find((t) => t.id === Number(viagemData.turneId));
        if (turne && turne.bandaId) {
          const conflito = verificarConflito(
            [turne.bandaId],
            viagemData.dataInicio,
            viagemData.dataFim
          );

          if (conflito) {
            setFieldErrors({
              general: (
                <div>
                  <p className="font-semibold text-[var(--accent)] mb-2">
                    ⚠️ Conflito de horário detectado!
                  </p>
                  <p className="text-sm text-[var(--accent)] mb-2">
                    A banda <strong>{conflito.bandas}</strong> já possui{" "}
                    {conflito.quantidade} evento(s) agendado(s) que conflita(m)
                    com este horário:
                  </p>
                  <div className="text-sm whitespace-pre-line bg-[var(--surface)] p-3 rounded border border-[var(--border)] font-mono">
                    {conflito.detalhes}
                  </div>
                  <p className="text-xs text-[var(--accent)] mt-2">
                    Ajuste as datas ou escolha outra turnê para continuar.
                  </p>
                </div>
              ),
            });
            return false;
          }
        }
      }
    }

    const newFieldErrors = mapErrorsToFields(errors, fieldMap);
    setFieldErrors(newFieldErrors);

    // Validação dinâmica do step
    const step1Fields = [
      "nomeEvento",
      "titulo",
      "bandas",
      "bandaId",
      "local",
      "nomeLocal",
      "capacidade",
      "logradouro",
      "numero",
      "cidade",
      "estado",
      "cep",
    ];
    const hasStep1Error = errors.some((key) => step1Fields.includes(key));
    if (hasStep1Error && currentStep === TOTAL_STEPS) {
      setCurrentStep(1);
      return;
    }

    if (errors.length > 0) return;

    if (activeTab === "show") {
      try {
        let localIdFinal = showData.localId;

        if (showNovoLocal) {
          const localCriado = await criarLocal(novoLocal);
          localIdFinal = localCriado.id;
          await listarLocais(); // Atualiza a lista para próximos cadastros
        }

        const padDate = (d) => (d && d.length === 16 ? `${d}:00` : d);

        const showPayload = {
          nomeEvento: showData.titulo,
          dataInicio: padDate(showData.dataHoraInicio),
          dataFim: padDate(showData.dataHoraFim),
          descricao: showData.descricao || "",
          turneId: showData.turneId ? Number(showData.turneId) : null,
          localId: localIdFinal, // Deve ser o id do local criado
          responsavelId: responsavelId,
        };

        const showCriado = await criarShow(showPayload);

        if (showData.bandaId) {
          await adicionarBandas(showCriado.id, [Number(showData.bandaId)]);
        }

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
        const padDate = (d) => (d && d.length === 16 ? `${d}:00` : d);

        const viagemPayload = {
          nomeEvento: viagemData.nomeEvento,
          dataInicio: padDate(viagemData.dataInicio),
          dataFim: padDate(viagemData.dataFim),
          descricao: viagemData.descricao || "",
          tipoViagem: viagemData.tipoViagem,
          turneId: viagemData.turneId ? Number(viagemData.turneId) : null,
        };

        const viagemCriada = await criarViagem(viagemPayload);

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
    if (currentStep < TOTAL_STEPS) {
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
          fieldErrors={fieldErrors}
          clearFieldError={clearFieldError}
          errorMessages={errorMessages} // <-- Passe aqui!
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
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "" : "hidden"
        }`}
    >
      <div style={{position:"fixed",inset:0,background:"var(--overlay)"}} onClick={onClose}></div>
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-[var(--radius-md)] shadow-[var(--shadow-card)]">
        <div className="sticky top-0 z-10 bg-[var(--surface-elevated)] border-b border-[var(--border)]">
          <div className="flex items-center justify-center gap-8 p-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-2 px-4 text-lg font-medium transition-all ${activeTab === tab.id
                  ? "text-[var(--text-primary)] border-b-2 border-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-[var(--surface-elevated)]">
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all ${currentStep === step
                  ? "bg-[var(--accent)]"
                  : currentStep > step
                    ? "bg-[var(--success)]"
                    : "bg-[var(--border-strong)]"
                  }`}
              />
            ))}
          </div>

          {fieldErrors.general && (
            <div className="mb-4 p-4 rounded-[var(--radius-sm)]" style={{background:"rgba(200,80,60,0.08)",border:"1px solid rgba(200,80,60,0.3)"}}><div className="">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0" style={{color:"var(--accent)"}}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-[var(--accent)]">{fieldErrors.general}</p>
              </div>
            </div>
            </div>
          )}

          {renderContent()}
        </div>

        <div className="sticky bottom-0 p-5 border-t border-[var(--border)] bg-[var(--surface-elevated)]">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-4 py-2"
            >
              Cancelar
            </button>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="modal-btn-secondary px-6 h-9"
                >
                  Voltar
                </button>
              )}

              <button
                onClick={handleNext}
                className="btn-primary px-6 h-9"
              >
                {currentStep === TOTAL_STEPS ? "Finalizar" : "Próxima Etapa"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== COMPONENTE COMBOBOX DE BANDAS ==========
function BandaCombobox({
  bandas = [],
  selectedId = "",
  onChange,
  error,
  clearError,
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
        Banda do Show <span className="text-[var(--accent)]">*</span>
      </label>
      <select
        value={selectedId || ""}
        onChange={(e) => {
          onChange(e.target.value);
          if (clearError) clearError("bandaId");
        }}
        className={`w-full px-3 py-2 border rounded-[var(--radius-md)]   ${error ? "border-[var(--accent)]" : "border-[var(--border)]"
          }`}
      >
        <option value="">Selecione uma banda</option>
        {bandas.map((banda) => (
          <option key={banda.id} value={String(banda.id)}>
            {banda.nome}
          </option>
        ))}
      </select>
      {error && <p className="text-[var(--accent)] text-xs mt-1">{error}</p>}
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
      <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
        Local do Show <span className="text-[var(--accent)]">*</span>
      </label>

      {selectedLocal && (
        <div className="mb-2 p-3 surface-card flex justify-between items-start">
          <div className="text-sm">
            <p className="font-medium text-[var(--text-primary)]">{selectedLocal.nome}</p>
            {selectedLocal.endereco && (
              <p className="text-xs mt-1 text-[var(--text-secondary)]">
                {selectedLocal.endereco.logradouro},{" "}
                {selectedLocal.endereco.numero} -{" "}
                {selectedLocal.endereco.cidade}/{selectedLocal.endereco.estado}
              </p>
            )}
            {selectedLocal.capacidade && (
              <p className="text-xs mt-1 text-[var(--text-muted)]">
                Capacidade: {selectedLocal.capacidade} pessoas
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
          className={`form-input pr-10 ${error ? "border-[var(--accent)]" : "border-[var(--border)]"
            }`}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
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

      {error && <p className="text-[var(--accent)] text-xs mt-1">{error}</p>}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 surface-card max-h-60 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onNovoLocal();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border-b border-[var(--border)] font-medium"
            >
              + Cadastrar novo local
            </button>

            {filteredLocais.length > 0 ? (
              filteredLocais.map((local) => (
                <button
                  key={local.id}
                  type="button"
                  onClick={() => handleSelect(local.id)}
                  className="w-full px-3 py-2 text-left hover:bg-[var(--surface-hover)] border-b border-[var(--border)] last:border-0"
                >
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {local.nome}
                  </p>
                  {local.endereco && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {local.endereco.cidade}/{local.endereco.estado}
                      {local.capacidade && ` • Cap: ${local.capacidade}`}
                    </p>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-[var(--text-muted)]">
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
  fieldErrors = {},
  clearFieldError,
  errorMessages = {},
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

  // ✅ Filtra turnês pelas bandas selecionadas
  const turnesFiltradas = turnes.filter(
    (turne) => String(turne.banda?.id || turne.bandaId) === String(data.bandaId)
  );

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
          error={fieldErrors.titulo} // <-- borda vermelha se erro
        />
        {fieldErrors.titulo && (
          <p className="text-[var(--accent)] text-xs">{errorMessages.titulo}</p>
        )}

        <BandaCombobox
          bandas={bandas}
          selectedId={data.bandaId}
          onChange={(id) => {
            setData({ ...data, bandaId: id, turneId: "" });
          }}
          error={fieldErrors.bandaId} // <-- borda vermelha se erro
          clearError={clearFieldError}
        />
        {fieldErrors.bandaId && (
          <p className="text-[var(--accent)] text-xs">{fieldErrors.bandaId}</p>
        )}

        {/* Seleção de turnê */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
            Turnê (Opcional)
          </label>
          <select
            value={data.turneId || ""}
            onChange={(e) => setData({ ...data, turneId: e.target.value })}
            className="form-input"
          >
            <option value="">Selecione uma turnê</option>
            {turnesFiltradas.length > 0 ? (
              turnesFiltradas.map((turne) => (
                <option key={turne.id} value={String(turne.id)}>
                  {turne.nomeTurne || turne.nome}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Nenhuma turnê cadastrada para a banda selecionada
              </option>
            )}
          </select>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Para cadastrar uma nova turnê, acesse a página de Turnês
          </p>
        </div>

        {!showNovoLocal ? (
          <LocalCombobox
            locais={locais}
            selectedId={data.localId}
            onChange={(id) => setData({ ...data, localId: id })}
            onNovoLocal={() => setShowNovoLocal(true)}
            error={fieldErrors.local} // <-- borda vermelha se erro
            clearError={clearFieldError}
          />
        ) : (
          <div className="space-y-4 p-4 surface-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Cadastrar Novo Local
              </h3>
              <button
                type="button"
                onClick={() => setShowNovoLocal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm"
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
              error={fieldErrors.nomeLocal} // <-- borda vermelha se erro
            />
            {fieldErrors.nomeLocal && (
              <p className="text-[var(--accent)] text-xs">{fieldErrors.nomeLocal}</p>
            )}

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
            {fieldErrors.capacidade && (
              <p className="text-[var(--accent)] text-xs">{fieldErrors.capacidade}</p>
            )}

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
      </div>
    );
  }

  // ========== Step 2 - Apenas descrição e seleção de turnê ==========
  return (
    <div className="space-y-4">
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
      <div>
        <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
          Descrição do Show
        </label>
        <textarea
          value={data.descricao}
          onChange={(e) => setData({ ...data, descricao: e.target.value })}
          placeholder="Descreva os detalhes do show..."
          rows={4}
          className="form-input resize-none"
        />
      </div>
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
          <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
            Tipo de Transporte *
          </label>
          <select
            value={data.tipoViagem}
            onChange={(e) => handleChange("tipoViagem", e.target.value)}
            className={`w-full px-3 py-2 border rounded-[var(--radius-md)]   ${fieldErrors.tipoViagem
              ? "border-[var(--accent)]"
              : "border-[var(--border)]"
              }`}
          >
            <option value="aereo">✈️ Aéreo</option>
            <option value="onibus">🚌 Ônibus</option>
            <option value="carro">🚗 Carro</option>
            <option value="van">🚐 Van</option>
            <option value="terrestre">🚛 Terrestre (Outro)</option>
          </select>
          {fieldErrors.tipoViagem && (
            <p className="text-[var(--accent)] text-xs mt-1">
              {fieldErrors.tipoViagem}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
            Descrição
          </label>
          <textarea
            value={data.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            placeholder="Informações sobre a viagem..."
            rows={4}
            className="form-input resize-none"
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
          <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
            Turnê *
          </label>
          <select
            value={data.turneId || ""}
            onChange={(e) => handleChange("turneId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-[var(--radius-md)]   ${fieldErrors.turneId
              ? "border-[var(--accent)]"
              : "border-[var(--border)]"
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
            <p className="text-[var(--accent)] text-xs mt-1">{fieldErrors.turneId}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

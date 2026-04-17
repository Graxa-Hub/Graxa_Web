import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShows } from "./useShows";
import { useViagens } from "./useViagens";
import { useAgendaEvento } from "./useAgendaEvento";
import { formatarData, formatarHora } from "../utils/dateFormatters";

export function useVisaoEventoViewModel() {
  const { tipoEvento, id } = useParams();
  const navigate = useNavigate();

  const { buscarShow, loading: loadingShow, error: errorShow } = useShows();
  const {
    buscarViagem,
    loading: loadingViagem,
    error: errorViagem,
  } = useViagens();
  const { agendas, listarPorShow } = useAgendaEvento();

  const [evento, setEvento] = useState(null);
  const [agendaSelecionada, setAgendaSelecionada] = useState(null);

  const loading = tipoEvento === "viagem" ? loadingViagem : loadingShow;
  const erro = tipoEvento === "viagem" ? errorViagem : errorShow;

  useEffect(() => {
    async function buscarEvento() {
      try {
        const dados =
          tipoEvento === "viagem"
            ? await buscarViagem(id)
            : await buscarShow(id);
        setEvento(dados);
      } catch (err) {
        console.error("Erro ao buscar evento:", err);
      }
    }

    if (id && tipoEvento) {
      buscarEvento();
    }
  }, [id, tipoEvento, buscarShow, buscarViagem]);

  useEffect(() => {
    if (id && tipoEvento === "show") {
      listarPorShow(id);
    }
  }, [id, tipoEvento, listarPorShow]);

  const { agendasProcessadas, progresso } = useMemo(() => {
    const agora = new Date();

    const comData = agendas.filter((item) => item.dataHoraInicio);
    const semData = agendas.filter((item) => !item.dataHoraInicio);

    const totalConcluidos = comData.filter((item) => {
      const dataHoraFim = item.dataHoraFim ? new Date(item.dataHoraFim) : null;
      return dataHoraFim && dataHoraFim < agora;
    }).length;

    const totalEventos = agendas.length;
    const progressoCalculado =
      totalEventos > 0 ? Math.round((totalConcluidos / totalEventos) * 100) : 0;

    const eventosPendentes = [];
    const eventosConcluidos = [];

    comData.forEach((item) => {
      const dataHoraFim = item.dataHoraFim ? new Date(item.dataHoraFim) : null;
      const jaPassou = dataHoraFim && dataHoraFim < agora;

      if (jaPassou) {
        eventosConcluidos.push(item);
      } else {
        eventosPendentes.push(item);
      }
    });

    eventosPendentes.sort((a, b) => a.ordem - b.ordem);
    eventosConcluidos.sort((a, b) => b.ordem - a.ordem);

    const agendasOrdenadas = [
      ...eventosPendentes,
      ...semData,
      ...eventosConcluidos,
    ];

    const processadas = agendasOrdenadas.map((item, index) => {
      const temData = !!item.dataHoraInicio;
      const dataHoraInicio = temData ? new Date(item.dataHoraInicio) : null;
      const dataHoraFim = item.dataHoraFim ? new Date(item.dataHoraFim) : null;
      const jaPassou = dataHoraFim && dataHoraFim < agora;
      const eProximo = !jaPassou && index === 0;

      return {
        id: item.id,
        timeStart: dataHoraInicio ? formatarHora(dataHoraInicio) : "-",
        timeEnd: dataHoraFim ? formatarHora(dataHoraFim) : null,
        date: dataHoraInicio ? formatarData(dataHoraInicio) : "Sem data",
        title: item.titulo || "Evento",
        description: item.descricao || "",
        type: item.tipo || "tecnico",
        active: eProximo,
        passed: jaPassou,
        dadosOriginais: item,
      };
    });

    return { agendasProcessadas: processadas, progresso: progressoCalculado };
  }, [agendas]);

  const handleSelecionarAgenda = useCallback((agenda) => {
    setAgendaSelecionada((prev) => {
      if (prev?.id === agenda?.id) return null;
      return agenda || null;
    });
  }, []);

  useEffect(() => {
    if (agendasProcessadas.length > 0 && !agendaSelecionada) {
      setAgendaSelecionada(agendasProcessadas[0]);
    }
  }, [agendasProcessadas, agendaSelecionada]);

  const dadosEvento = useMemo(() => {
    if (!evento) return null;

    const dataInicioEvento = evento.dataInicio
      ? new Date(evento.dataInicio)
      : null;

    return {
      nomeEvento: evento.nomeEvento || "Evento",
      nomeLocal: evento.local?.nome || "Local nao informado",
      dataInfo: dataInicioEvento ? formatarData(dataInicioEvento) : "Sem data",
      cidade: evento.local?.endereco?.cidade || "Sao Paulo",
      lat: -23.5,
      lon: -46.6,
    };
  }, [evento]);

  const handleGerarPdf = useCallback(() => {
    if (tipoEvento !== "show" || !id) {
      alert("PDF disponivel apenas para eventos do tipo Show");
      return;
    }

    navigate(`/relatorio/${id}`);
  }, [tipoEvento, id, navigate]);

  const handleEditarEvento = useCallback(() => {
    if (!tipoEvento || !id) return;
    navigate(`/criar-evento/${tipoEvento}/${id}`);
  }, [tipoEvento, id, navigate]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return {
    tipoEvento,
    id,
    loading,
    erro,
    dadosEvento,
    agendasProcessadas,
    agendaSelecionada,
    progresso,
    handleSelecionarAgenda,
    handleGerarPdf,
    handleEditarEvento,
  };
}

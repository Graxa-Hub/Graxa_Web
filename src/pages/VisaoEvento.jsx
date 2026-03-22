import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/templates/Layout";
import { Edit2, MapPin, FileDown } from "lucide-react";
import { useShows } from "../hooks/useShows";
import { useViagens } from "../hooks/useViagens";
import { useAgendaEvento } from "../hooks/useAgendaEvento";
import { AgendaList } from "../features/Evento/components/VisaoEvento/AgendaList";
import { PainelDireito } from "../features/Evento/components/VisaoEvento/PainelDireito";
import { DiaInfoCard } from "../features/Evento/components/VisaoEvento/DiaInfoCard";
import { formatarData, formatarHora } from "../utils/dateFormatters";

export const VisaoEvento = () => {
  const { tipoEvento, id } = useParams();
  const navigate = useNavigate();
  const { buscarShow, loading: loadingShow, error: errorShow } = useShows();
  const { buscarViagem, loading: loadingViagem, error: errorViagem } = useViagens();
  const { agendas, listarPorShow } = useAgendaEvento();

  const [evento, setEvento] = useState(null);
  const [agendaSelecionada, setAgendaSelecionada] = useState(null);

  const loading = tipoEvento === "viagem" ? loadingViagem : loadingShow;
  const erro = tipoEvento === "viagem" ? errorViagem : errorShow;

  useEffect(() => {
    async function buscarEvento() {
      try {
        const dados = tipoEvento === "viagem" ? await buscarViagem(id) : await buscarShow(id);
        setEvento(dados);
      } catch (err) {
        console.error("Erro ao buscar evento:", err);
      }
    }

    if (id && tipoEvento) buscarEvento();
  }, [id, tipoEvento, buscarShow, buscarViagem]);

  useEffect(() => {
    if (id && tipoEvento === "show") listarPorShow(id);
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
    const progressoCalculado = totalEventos > 0 ? Math.round((totalConcluidos / totalEventos) * 100) : 0;

    const eventosPendentes = [];
    const eventosConcluidos = [];

    comData.forEach((item) => {
      const dataHoraFim = item.dataHoraFim ? new Date(item.dataHoraFim) : null;
      const jaPassou = dataHoraFim && dataHoraFim < agora;
      if (jaPassou) eventosConcluidos.push(item);
      else eventosPendentes.push(item);
    });

    eventosPendentes.sort((a, b) => a.ordem - b.ordem);
    eventosConcluidos.sort((a, b) => b.ordem - a.ordem);

    const agendasOrdenadas = [...eventosPendentes, ...semData, ...eventosConcluidos];

    const processadas = agendasOrdenadas.map((item, index) => {
      const temData = !!item.dataHoraInicio;
      const dataHoraInicio = temData ? new Date(item.dataHoraInicio) : null;
      const dataHoraFim = item.dataHoraFim ? new Date(item.dataHoraFim) : null;
      const jaPassou = dataHoraFim && dataHoraFim < agora;
      const eProximo = !jaPassou && index === 0;

      return {
        id: item.id,
        timeStart: dataHoraInicio ? formatarHora(dataHoraInicio) : "—",
        timeEnd: dataHoraFim ? formatarHora(dataHoraFim) : null,
        date: dataHoraInicio ? formatarData(dataHoraInicio) : "Sem data",
        title: item.titulo || "Evento",
        description: item.descricao || "",
        active: eProximo,
        passed: jaPassou,
        dadosOriginais: item,
      };
    });

    return { agendasProcessadas: processadas, progresso: progressoCalculado };
  }, [agendas]);

  const handleSelecionarAgenda = useCallback(
    (agendaId) => {
      setAgendaSelecionada((prev) => {
        if (prev?.id === agendaId) return null;
        return agendasProcessadas.find((a) => a.id === agendaId);
      });
    },
    [agendasProcessadas],
  );

  const handleGerarPdf = () => {
    if (tipoEvento !== "show" || !id) {
      alert("PDF disponível apenas para eventos do tipo Show");
      return;
    }
    navigate(`/relatorio/${id}`);
  };

  useEffect(() => {
    if (agendasProcessadas.length > 0 && !agendaSelecionada) setAgendaSelecionada(agendasProcessadas[0]);
  }, [agendasProcessadas, agendaSelecionada]);

  const dadosEvento = useMemo(() => {
    if (!evento) return null;
    const dataInicioEvento = evento.dataInicio ? new Date(evento.dataInicio) : null;
    const cidadeExtraida = evento.local?.endereco?.cidade || "São Paulo";
    const nomeLocal = evento.local?.nome || "Local não informado";

    return {
      nomeEvento: evento.nomeEvento || "Evento",
      nomeLocal,
      dataInfo: dataInicioEvento ? formatarData(dataInicioEvento) : "",
      cidade: cidadeExtraida,
      lat: -23.5,
      lon: -46.6,
    };
  }, [evento]);

  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (loading) return <div className="p-6 text-[var(--text-muted)]">Carregando evento...</div>;
  if (erro) return <div className="p-6 text-[var(--accent)]">{erro}</div>;
  if (!dadosEvento) return <div className="p-6 text-[var(--text-muted)]">Evento não encontrado.</div>;

  return (
    <Layout containerClassName="overflow-hidden bg-transparent border-0 shadow-none p-0">
      <div className="flex h-full flex-col gap-4 overflow-hidden">
        <div className="surface-card flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="min-w-[280px] flex-1">
            <div className="mb-2 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {tipoEvento === "show" ? "Show" : "Viagem"}
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{dadosEvento.nomeEvento}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <MapPin className="h-4 w-4 text-[var(--text-muted)]" />
              <p>{dadosEvento.nomeLocal}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGerarPdf}
              disabled={tipoEvento !== "show"}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={tipoEvento !== "show" ? "PDF disponível apenas para Shows" : "Ver Relatório do Evento"}
            >
              <FileDown size={16} />
              Ver Relatório
            </button>
            <button
              onClick={() => navigate(`/criar-evento/${tipoEvento}/${id}`)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Edit2 size={16} />
              Editar Evento
            </button>
            <DiaInfoCard info={dadosEvento.dataInfo} />
          </div>
        </div>

        <div className="grid flex-1 min-h-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(360px,1fr)] overflow-hidden">
          <div className="min-h-0">
            <AgendaList agendas={agendasProcessadas} agendaSelecionada={agendaSelecionada} onSelecionarAgenda={handleSelecionarAgenda} />
          </div>

          <div className="min-h-0">
            <PainelDireito
              agendaSelecionada={agendaSelecionada}
              progresso={progresso}
              cidade={dadosEvento.cidade}
              lat={dadosEvento.lat}
              lon={dadosEvento.lon}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VisaoEvento;

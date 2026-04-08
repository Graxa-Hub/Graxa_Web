import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/templates/Layout";
import { Sidebar } from "../components/organisms/Sidebar";
import { Edit2, MapPin, FileDown } from "lucide-react";
import { useShows } from "../hooks/useShows";
import { useViagens } from "../hooks/useViagens";
import { useAgendaEvento } from "../hooks/useAgendaEvento";
import { AgendaList } from "../features/Evento/components/VisaoEvento/AgendaList";
import { PainelDireito } from "../features/Evento/components/VisaoEvento/PainelDireito";
import { DiaInfoCard } from "../features/Evento/components/VisaoEvento/DiaInfoCard";
import { formatarData, formatarHora } from "../utils/dateFormatters";
import { pdfService } from "../services/pdfService";

export const VisaoEvento = () => {
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
  const [gerandoPdf, setGerandoPdf] = useState(false);

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

    // Separar itens com e sem data
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
      const jáPassou = dataHoraFim && dataHoraFim < agora;

      if (jáPassou) {
        eventosConcluidos.push(item);
      } else {
        eventosPendentes.push(item);
      }
    });

    eventosPendentes.sort((a, b) => a.ordem - b.ordem);
    eventosConcluidos.sort((a, b) => b.ordem - a.ordem);

    // Itens sem data vão ao final como pendentes
    const agendasOrdenadas = [...eventosPendentes, ...semData, ...eventosConcluidos];

    const processadas = agendasOrdenadas.map((item, index) => {
      const temData = !!item.dataHoraInicio;
      const dataHoraInicio = temData ? new Date(item.dataHoraInicio) : null;
      const dataHoraFim = item.dataHoraFim ? new Date(item.dataHoraFim) : null;
      const jáPassou = dataHoraFim && dataHoraFim < agora;
      const éProximo = !jáPassou && index === 0;

      return {
        id: item.id,
        timeStart: dataHoraInicio ? formatarHora(dataHoraInicio) : "—",
        timeEnd: dataHoraFim ? formatarHora(dataHoraFim) : null,
        date: dataHoraInicio ? formatarData(dataHoraInicio) : "Sem data",
        title: item.titulo || "Evento",
        description: item.descricao || "",
        active: éProximo,
        passed: jáPassou,
        dadosOriginais: item,
      };
    });

    return { agendasProcessadas: processadas, progresso: progressoCalculado };
  }, [agendas]);

  const handleSelecionarAgenda = useCallback(
    (agenda) => {
      setAgendaSelecionada((prev) => {
        if (prev?.id === agenda?.id) return null;
        return agenda || null;
      });
    },
    []
  );

  const handleGerarPdf = () => {
    if (tipoEvento !== "show" || !id) {
      alert("PDF disponível apenas para eventos do tipo Show");
      return;
    }

    // Redirecionar para a página de relatório dinâmico com o ID do show
    navigate(`/relatorio/${id}`);
  };

  useEffect(() => {
    if (agendasProcessadas.length > 0 && !agendaSelecionada) {
      setAgendaSelecionada(agendasProcessadas[0]);
    }
  }, [agendasProcessadas.length, agendaSelecionada]);

  const dadosEvento = useMemo(() => {
    if (!evento) return null;

    const dataInicioEvento = evento.dataInicio
      ? new Date(evento.dataInicio)
      : null;
    const cidadeExtraida = evento.local?.endereco?.cidade || "São Paulo";
    const nomeLocal = evento.local?.nome || "Local não informado";

    return {
      nomeEvento: evento.nomeEvento || "Evento",
      nomeLocal: nomeLocal,
      dataInfo: dataInicioEvento ? formatarData(dataInicioEvento) : "",
      cidade: cidadeExtraida,
      lat: -23.5,
      lon: -46.6,
    };
  }, [evento]);

  React.useEffect(() => {
    // Trava o overflow do body ao montar a página
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Restaura ao desmontar
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (loading) return <div className="p-6">Carregando evento...</div>;
  if (erro) return <div className="p-6 text-[var(--accent)]">{erro}</div>;
  if (!dadosEvento) return <div className="p-6">Evento não encontrado.</div>;

  return (
    <Layout className="bg-emerald-50" containerClassName="overflow-hidden" showHeader={false}>

      {/* Componetizar esse bagui aqui -> pode ser VisionEvent  */}
      <div className="flex flex-row justify-between mb-4">
        <div>
          <h1 className="panel-title">
            {dadosEvento.nomeEvento}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">{dadosEvento.nomeLocal}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleGerarPdf}
            disabled={tipoEvento !== "show"}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-elevated)] text-white rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)] transition font-semibold text-sm shadow-[var(--shadow-soft)] disabled:bg-gray-400 disabled:cursor-not-allowed"
            title={
              tipoEvento !== "show"
                ? "PDF disponível apenas para Shows"
                : "Ver Relatório do Evento"
            }
          >
            <FileDown size={16} />
            Ver Relatório
          </button>
          <button
            onClick={() => navigate(`/criar-evento/${tipoEvento}/${id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-elevated)] text-white rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)] transition font-semibold text-sm shadow-[var(--shadow-soft)]"
          >
            <Edit2 size={16} />
            Editar Evento
          </button>
          <DiaInfoCard info={dadosEvento.dataInfo} />
        </div>
      </div>



      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0 overflow-hidden">
        <div className="col-span-2 h-full">
          <AgendaList
            itens={agendasProcessadas}
            selectedId={agendaSelecionada?.id}
            onSelect={handleSelecionarAgenda}
          />
        </div>

        <div className="h-full">
          <PainelDireito
            agendaSelecionada={agendaSelecionada}
            progresso={progresso}
            cidade={dadosEvento.cidade}
            lat={dadosEvento.lat}
            lon={dadosEvento.lon}
          />
        </div>
      </div>
    </Layout>
  );
};

export default VisaoEvento;

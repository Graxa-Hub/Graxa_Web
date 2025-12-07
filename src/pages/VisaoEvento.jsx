import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Edit2 } from "lucide-react";
import { useShows } from "../hooks/useShows";
import { useViagens } from "../hooks/useViagens";
import { useAgendaEvento } from "../hooks/useAgendaEvento";
import { AgendaList } from "../components/VisaoEvento/AgendaList";
import { PainelDireito } from "../components/VisaoEvento/PainelDireito";
import { DiaInfoCard } from "../components/VisaoEvento/DiaInfoCard";
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
        const dados = tipoEvento === "viagem" 
          ? await buscarViagem(id) 
          : await buscarShow(id);
        setEvento(dados);
      } catch (err) {
        console.error("❌ Erro ao buscar evento:", err);
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
    const agendasValidas = agendas.filter(item => item.dataHoraInicio);

    const totalConcluidos = agendasValidas.filter(item => {
      const dataHoraFim = item.dataHoraFim ? new Date(item.dataHoraFim) : null;
      return dataHoraFim && dataHoraFim < agora;
    }).length;

    const totalEventos = agendasValidas.length;
    const progressoCalculado = totalEventos > 0 
      ? Math.round((totalConcluidos / totalEventos) * 100) 
      : 0;

    const eventosPendentes = [];
    const eventosConcluidos = [];

    agendasValidas.forEach((item) => {
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

    const agendasOrdenadas = [...eventosPendentes, ...eventosConcluidos];

    const processadas = agendasOrdenadas.map((item, index) => {
      const dataHoraInicio = new Date(item.dataHoraInicio);
      const dataHoraFim = item.dataHoraFim ? new Date(item.dataHoraFim) : null;
      const jáPassou = dataHoraFim && dataHoraFim < agora;
      const éProximo = !jáPassou && index === 0;

      return {
        id: item.id,
        timeStart: formatarHora(dataHoraInicio),
        timeEnd: dataHoraFim ? formatarHora(dataHoraFim) : null,
        date: formatarData(dataHoraInicio),
        title: item.titulo || "Evento",
        description: item.descricao || "",
        active: éProximo,
        passed: jáPassou,
        dadosOriginais: item
      };
    });

    return { agendasProcessadas: processadas, progresso: progressoCalculado };
  }, [agendas]);

  const handleSelecionarAgenda = useCallback((agendaId) => {
    setAgendaSelecionada(prev => {
      if (prev?.id === agendaId) return null;
      return agendasProcessadas.find(a => a.id === agendaId);
    });
  }, [agendasProcessadas]);

  // ✅ Seleciona automaticamente o primeiro agendamento quando as agendas carregarem
  useEffect(() => {
    if (agendasProcessadas.length > 0 && !agendaSelecionada) {
      setAgendaSelecionada(agendasProcessadas[0]);
    }
  }, [agendasProcessadas, agendaSelecionada]);

  const dadosEvento = useMemo(() => {
    if (!evento) return null;

    const dataInicioEvento = evento.dataInicio ? new Date(evento.dataInicio) : null;
    
    return {
      nomeEvento: evento.nomeEvento || "Evento",
      dataInfo: dataInicioEvento ? formatarData(dataInicioEvento) : "",
      cidade: evento.local?.endereco?.cidade || "São Paulo",
      lat: -23.5,
      lon: -46.6
    };
  }, [evento]);

  if (loading) return <div className="p-6">Carregando evento...</div>;
  if (erro) return <div className="p-6 text-red-600">{erro}</div>;
  if (!dadosEvento) return <div className="p-6">Evento não encontrado.</div>;

  return (
    <Layout>
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen w-full overflow-hidden p-6 bg-green-100">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {dadosEvento.nomeEvento}
          </h1>

          <div className="flex items-center gap-4 mr-10">
            <button
              onClick={() => navigate(`/criar-evento/${tipoEvento}/${id}`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm shadow-md"
            >
              <Edit2 size={16} />
              Editar Evento
            </button>
            <DiaInfoCard info={dadosEvento.dataInfo} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          <AgendaList 
            agendas={agendasProcessadas}
            agendaSelecionada={agendaSelecionada}
            onSelecionarAgenda={handleSelecionarAgenda}
          />

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

import { Layout } from "../templates/Layout";
import { useVisaoEventoViewModel } from "../../hooks/useVisaoEventoViewModel";
import { useNavigate } from "react-router-dom";
import { EventHeader } from "../organisms/EventHeader";
import { AgendaList } from "../organisms/AgendaList";
import { PainelDireito } from "../organisms/PainelDireito";

export const VisaoEvento = () => {
  const navigate = useNavigate();
  
  const handleVoltar = () => {
    navigate("/calendario");
  };
  
  const {
    tipoEvento,
    loading,
    erro,
    dadosEvento,
    agendasProcessadas,
    agendaSelecionada,
    progresso,
    handleSelecionarAgenda,
    handleGerarPdf,
    handleEditarEvento,
  } = useVisaoEventoViewModel();

  if (loading) return <div className="p-6">Carregando evento...</div>;
  if (erro) return <div className="p-6 text-[var(--accent)]">{erro}</div>;
  if (!dadosEvento) return <div className="p-6">Evento não encontrado.</div>;

  return (
    <Layout
      className="bg-[var(--bg)]"
      containerClassName="overflow-hidden"
      showHeader={false}
    >
      <EventHeader
        nomeEvento={dadosEvento.nomeEvento}
        nomeLocal={dadosEvento.nomeLocal}
        dataInfo={dadosEvento.dataInfo}
        tipoEvento={tipoEvento}
        onGerarPdf={handleGerarPdf}
        onEditarEvento={handleEditarEvento}
        onVoltar={handleVoltar}
      />

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

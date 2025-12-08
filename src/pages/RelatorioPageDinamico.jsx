import { CloudRain } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showService } from "../services/showService";
import { alocacaoService } from "../services/alocacaoService";
import { agendaEventoService } from "../services/agendaEventoService";
import { logisticaService } from "../services/logisticaService";
import { formatarData, formatarHora } from "../utils/dateFormatters";

export function RelatorioPageDinamico() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState({
    show: null,
    colaboradores: [],
    agenda: [],
    hoteis: [],
  });

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);

        console.log('[RelatorioPageDinamico] Buscando dados para show:', id);

        // Buscar dados em paralelo com tratamento individual
        const promises = await Promise.allSettled([
          showService.buscarPorId(id),
          alocacaoService.listarPorShow(id).catch(() => []),
          agendaEventoService.listarPorShow(id).catch(() => []),
          logisticaService.listarHoteis(id).catch(() => []),
        ]);

        const [showResult, alocacoesResult, agendaResult, hoteisResult] = promises;

        // Verificar se conseguiu buscar o show (obrigatório)
        if (showResult.status === 'rejected') {
          console.error('[RelatorioPageDinamico] Erro ao buscar show:', showResult.reason);
          alert('Não foi possível carregar os dados do evento');
          setDados({ show: null, colaboradores: [], agenda: [], hoteis: [] });
          return;
        }

        console.log('[RelatorioPageDinamico] Dados carregados:', {
          show: showResult.value,
          colaboradores: alocacoesResult.status === 'fulfilled' ? alocacoesResult.value : [],
          agenda: agendaResult.status === 'fulfilled' ? agendaResult.value : [],
          hoteis: hoteisResult.status === 'fulfilled' ? hoteisResult.value : [],
        });

        setDados({
          show: showResult.value,
          colaboradores: alocacoesResult.status === 'fulfilled' ? alocacoesResult.value : [],
          agenda: agendaResult.status === 'fulfilled' ? agendaResult.value : [],
          hoteis: hoteisResult.status === 'fulfilled' ? hoteisResult.value : [],
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao carregar dados do relatório");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      buscarDados();
    }
  }, [id]);

  const handleGeneratePDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-100/30 flex items-center justify-center">
        <p className="text-xl">Carregando relatório...</p>
      </div>
    );
  }

  const { show, colaboradores, agenda, hoteis } = dados;

  if (!show) {
    return (
      <div className="min-h-screen bg-blue-100/30 flex items-center justify-center">
        <p className="text-xl text-red-600">Evento não encontrado</p>
      </div>
    );
  }

  // Formatar dados
  const dataEvento = show.dataInicio
    ? formatarData(new Date(show.dataInicio))
    : "Data não definida";
  const nomeLocal = show.local?.nome || "Local não definido";
  const enderecoLocal = show.local?.endereco
    ? `${show.local.endereco.logradouro || ""}, ${
        show.local.endereco.numero || ""
      } - ${show.local.endereco.cidade || ""}`
    : "Endereço não definido";

  const nomesColaboradores = colaboradores
    .map((alocacao) => alocacao.colaborador?.nome)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-blue-100/30 py-10">
      {/* Botão para gerar PDF - não aparece no PDF */}
      <div className="fixed top-4 right-4 print:hidden z-50">
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg"
        >
          Gerar PDF
        </button>
      </div>

      {/* Conteúdo do PDF */}
      <div className="px-8">
        {/* Cabeçalho */}
        <div className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-4">
            {show.bandas?.[0]?.nome || "Nome Artístico"}
          </h1>
          <p className="text-center text-black mb-2 text-lg">
            CRONOGRAMA DE HORÁRIO
          </p>
          <p className="text-center text-red-600 font-bold mb-2 text-lg">
            {dataEvento} - {show.nomeEvento || "Nome do Evento"}
          </p>
          <p className="text-center text-blue-600 font-bold text-lg">
            {nomeLocal} - {enderecoLocal}
          </p>
        </div>

        {/* Equipe */}
        <div className="px-8 print:break-inside-avoid">
          <h1 className="text-center text-xl font-bold text-red-400 mb-10">
            EQUIPE
          </h1>
          {colaboradores.length > 0 ? (
            colaboradores.map((alocacao) => (
              <div className="flex gap-2 text-lg" key={alocacao.id}>
                <p className="font-bold">
                  {alocacao.colaborador?.funcao || "Colaborador"}:
                </p>
                <span>
                  {alocacao.colaborador?.nome || "Nome não disponível"}
                </span>
                {alocacao.colaborador?.telefone && (
                  <span> - {alocacao.colaborador.telefone}</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Nenhum colaborador alocado
            </p>
          )}

          {show.bandas && show.bandas.length > 0 && (
            <>
              <p className="mt-5 font-bold text-lg">Banda:</p>
              <p className="text-lg">{nomesColaboradores || "Não informado"}</p>
            </>
          )}
        </div>

        {/* Agenda/Cronograma */}
        <div className="px-8 mt-20 print:break-inside-avoid print:break-before-page">
          <h1 className="text-center text-xl font-bold text-red-400 mb-10">
            CRONOGRAMA DE HORÁRIO
          </h1>

          {agenda.length > 0 ? (
            <ul className="mt-7 text-lg space-y-3">
              {agenda.map((item) => {
                const horaInicio = item.dataHoraInicio
                  ? formatarHora(new Date(item.dataHoraInicio))
                  : "00:00";

                return (
                  <li key={item.id}>
                    <p className="whitespace-nowrap">
                      <span className="font-bold">{horaInicio} - </span>
                      {item.titulo || "Evento"}
                    </p>
                    {item.descricao && (
                      <p className="text-blue-400 ml-16">*{item.descricao}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-gray-500">Nenhum evento agendado</p>
          )}
        </div>

        {/* Hospedagem */}
        {hoteis.length > 0 && (
          <div className="px-8 mt-20">
            {hoteis.map((hotel, index) => (
              <div
                key={hotel.id}
                className="border border-neutral-400 p-4 print:break-inside-avoid mb-4"
              >
                <h1 className="text-center text-xl font-bold text-red-400 mb-8">
                  HOSPEDAGEM {index + 1}
                </h1>
                <h2 className="underline text-lg">
                  {hotel.hotel?.nome || "Hotel não especificado"}
                </h2>
                <h3 className="text-lg">
                  <span className="font-bold">CHECK-IN: </span>
                  {hotel.dataHoraCheckIn
                    ? formatarData(new Date(hotel.dataHoraCheckIn))
                    : "Não definido"}
                </h3>
                <h3 className="text-lg">
                  <span className="font-bold">CHECK-OUT: </span>
                  {hotel.dataHoraCheckOut
                    ? formatarData(new Date(hotel.dataHoraCheckOut))
                    : "Não definido"}
                </h3>
                <h3 className="text-lg">
                  <span className="font-bold">QUARTOS: </span>
                  {hotel.quantidadeQuartos || "Não especificado"}
                </h3>
                {hotel.hotel?.endereco && (
                  <h3 className="text-lg mt-2">
                    <span className="font-bold">ENDEREÇO: </span>
                    {hotel.hotel.endereco.logradouro || ""}{" "}
                    {hotel.hotel.endereco.numero || ""} -{" "}
                    {hotel.hotel.endereco.cidade || ""}
                  </h3>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Observações */}
        <div className="px-8 mt-20">
          <h1 className="text-center text-xl font-bold text-red-400 mb-8">
            OBSERVAÇÕES:
          </h1>
          {show.observacoes && (
            <p className="text-lg whitespace-pre-wrap">{show.observacoes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RelatorioPageDinamico;

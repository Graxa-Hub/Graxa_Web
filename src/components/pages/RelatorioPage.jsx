import { CloudRain, Sun, Cloud, CloudSun, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showService } from "../services/showService";
import { alocacaoService } from "../services/alocacaoService";
import { agendaEventoService } from "../services/agendaEventoService";
import { logisticaService } from "../services/logisticaService";
import { extrasService } from "../services/extrasService";
import { formatarData, formatarHora } from "../utils/dateFormatters";
import { getWeatherForecast, getWeatherDescription } from "../services/weatherService";
import { TIPOS_USUARIO } from "../constants/tipoUsuario";

// Helper: nome legível do tipoUsuario
function labelTipoUsuario(tipo) {
  const found = TIPOS_USUARIO.find((t) => t.value === tipo);
  return found ? found.label : tipo || "Colaborador";
}

// Helper: dia da semana abreviado em pt-BR
function diaSemanaAbrev(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}

export function RelatorioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState({
    show: null,
    colaboradores: [],
    agenda: [],
    hoteis: [],
    voos: [],
    transportes: [],
    extras: null,
    clima: null,
  });

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);

        const [
          showResult,
          alocacoesResult,
          agendaResult,
          hoteisResult,
          voosResult,
          transportesResult,
          extrasResult,
        ] = await Promise.allSettled([
          showService.buscarPorId(id),
          alocacaoService.listarPorShow(id).catch(() => []),
          agendaEventoService.listarPorShow(id).catch(() => []),
          logisticaService.listarHoteis(id).catch(() => []),
          logisticaService.listarVoos(id).catch(() => []),
          logisticaService.listarTransportes(id).catch(() => []),
          extrasService.listarExtras(id).catch(() => null),
        ]);

        if (showResult.status === "rejected") {
          console.error("[RelatorioPage] Erro ao buscar show:", showResult.reason);
          setDados((prev) => ({ ...prev, show: null }));
          return;
        }

        const showData = showResult.value;

        // Filtrar alocações: apenas mais recente por colaborador, ACEITO ou PENDENTE
        const alocacoes = alocacoesResult.status === "fulfilled" ? alocacoesResult.value : [];
        const porColab = {};
        (alocacoes || []).forEach((a) => {
          const cId = a.colaborador?.id;
          if (!cId) return;
          if (!porColab[cId]) {
            porColab[cId] = a;
          } else {
            const dAtual = new Date(a.dataHoraCriacao || 0);
            const dSalva = new Date(porColab[cId].dataHoraCriacao || 0);
            if (dAtual > dSalva) porColab[cId] = a;
          }
        });
        const colabsFiltrados = Object.values(porColab).filter((a) => {
          const st = String(a.status).toUpperCase();
          return (st === "ACEITO" || st === "PENDENTE") && a.colaborador;
        });

        // Buscar clima se local com coordenadas
        let climaData = null;
        const lat = showData?.local?.endereco?.latitude || showData?.local?.latitude;
        const lon = showData?.local?.endereco?.longitude || showData?.local?.longitude;
        if (lat && lon) {
          try {
            climaData = await getWeatherForecast(lat, lon, { forecastDays: 7 });
          } catch (err) {
            console.warn("[RelatorioPage] Clima indisponível:", err);
          }
        }

        // Extras: pode ser array ou objeto
        let extrasData = extrasResult.status === "fulfilled" ? extrasResult.value : null;
        if (Array.isArray(extrasData) && extrasData.length > 0) {
          extrasData = extrasData[0];
        }

        setDados({
          show: showData,
          colaboradores: colabsFiltrados,
          agenda: agendaResult.status === "fulfilled" ? agendaResult.value || [] : [],
          hoteis: hoteisResult.status === "fulfilled" ? hoteisResult.value || [] : [],
          voos: voosResult.status === "fulfilled" ? voosResult.value || [] : [],
          transportes: transportesResult.status === "fulfilled" ? transportesResult.value || [] : [],
          extras: extrasData,
          clima: climaData,
        });
      } catch (error) {
        console.error("[RelatorioPage] Erro geral:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) buscarDados();
  }, [id]);

  const contentRef = useRef(null);

  const handleGeneratePDF = () => {
    // Salvar título original e trocar para o nome do evento
    // Isso faz o Firefox mostrar o nome do evento ao invés de "Graxa" no cabeçalho do print
    const tituloOriginal = document.title;
    const nomeEvento = show?.nomeEvento || "Relatório do Evento";
    document.title = nomeEvento;

    // Imprimir
    window.print();

    // Restaurar título original após print
    setTimeout(() => {
      document.title = tituloOriginal;
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface-hover)]/30 flex items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--info)]" />
        <p className="text-xl">Carregando relatório...</p>
      </div>
    );
  }

  const { show, colaboradores, agenda, hoteis, voos, transportes, extras, clima } = dados;

  if (!show) {
    return (
      <div className="min-h-screen bg-[var(--surface-hover)]/30 flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-[var(--accent)]">Evento não encontrado</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[var(--surface-elevated)] text-white rounded-[var(--radius-md)]"
        >
          Voltar
        </button>
      </div>
    );
  }

  // ===== Dados formatados =====
  const dataEvento = show.dataInicio
    ? formatarData(new Date(show.dataInicio))
    : "Data não definida";

  const diaSemana = show.dataInicio
    ? new Date(show.dataInicio).toLocaleDateString("pt-BR", { weekday: "long" })
    : "";

  const nomeLocal = show.local?.nome || "Local não definido";

  const enderecoLocal = show.local?.endereco
    ? [
      show.local.endereco.logradouro,
      show.local.endereco.numero,
      show.local.endereco.bairro,
      show.local.endereco.cidade,
      show.local.endereco.uf,
    ]
      .filter(Boolean)
      .join(", ")
    : "Endereço não definido";

  const nomeBanda = show.bandas?.[0]?.nome || show.nomeEvento || "Evento";

  // Integrantes das bandas (todos os integrantes de todas as bandas)
  const integrantesBanda = (show.bandas || [])
    .flatMap((b) => b.integrantes || [])
    .map((i) => i.nome)
    .filter(Boolean);

  // Agenda ordenada por hora
  const agendaOrdenada = [...agenda].sort((a, b) => {
    const da = a.dataHoraInicio || "";
    const db = b.dataHoraInicio || "";
    return da.localeCompare(db);
  });

  // ===== Clima processado =====
  const climaDias = [];
  if (clima?.daily) {
    const d = clima.daily;
    const len = d.time?.length || 0;
    for (let i = 0; i < len; i++) {
      const weatherDesc = getWeatherDescription(d.weather_code?.[i]);
      climaDias.push({
        id: i,
        diaSemana: diaSemanaAbrev(d.time[i]),
        dia: new Date(d.time[i]).getDate().toString().padStart(2, "0"),
        tempMax: Math.round(d.temperature_2m_max?.[i] || 0),
        tempMin: Math.round(d.temperature_2m_min?.[i] || 0),
        precipitacao: d.precipitation_sum?.[i] || 0,
        probChuva: d.precipitation_probability_max?.[i] || 0,
        descricao: weatherDesc?.description || "",
      });
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface-hover)]/30 py-10">
      {/* Botão para gerar PDF - não aparece no PDF */}
      <div className="fixed top-4 right-4 print:hidden z-50 flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-[var(--surface-elevated)] text-white font-bold py-2 px-4 rounded shadow-[var(--shadow-soft)]"
        >
          Voltar
        </button>
        <button
          onClick={handleGeneratePDF}
          className="btn-primary py-2 px-4 shadow-[var(--shadow-soft)]"
        >
          Gerar PDF
        </button>
      </div>

      {/* Conteúdo do PDF */}
      <div ref={contentRef} className="max-w-5xl mx-auto px-6">
        {/* ===== CABEÇALHO ===== */}
        <div className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-4">{nomeBanda}</h1>
          <p className="text-center text-black mb-2 text-lg">CRONOGRAMA DE HORÁRIO</p>
          <p className="text-center text-[var(--text-primary)] font-bold mb-2 text-base">
            {dataEvento} - {diaSemana.toUpperCase()} - {show.nomeEvento || "Evento"}
          </p>
          <p className="text-center text-[var(--text-secondary)] font-bold text-base">
            {nomeLocal} - {enderecoLocal}
          </p>
        </div>

        {/* ===== EQUIPE ===== */}
        <div className="px-8 print:break-inside-avoid">
          <h1 className="text-center text-xl font-bold text-red-400 mb-10">EQUIPE</h1>

          {colaboradores.length > 0 ? (
            colaboradores.map((alocacao) => (
              <div className="flex gap-2 text-lg" key={alocacao.id}>
                <p className="font-bold">
                  {labelTipoUsuario(alocacao.colaborador?.tipoUsuario)}:
                </p>
                <span>{alocacao.colaborador?.nome || "Nome não disponível"}</span>
                {alocacao.colaborador?.telefone && (
                  <span> - {alocacao.colaborador.telefone}</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-[var(--text-muted)]">Nenhum colaborador alocado</p>
          )}

          {integrantesBanda.length > 0 && (
            <>
              <p className="mt-5 font-bold text-lg">Banda: <span className="font-normal">{integrantesBanda.join(", ")}</span></p>
            </>
          )}
        </div>

        {/* ===== CRONOGRAMA / AGENDA ===== */}
        <div className="px-8 mt-20 print:break-inside-avoid print:break-before-page">
          <h1 className="text-center text-xl font-bold text-red-400 mb-10">
            CRONOGRAMA DE HORÁRIO
          </h1>

          {/* Info de voos (se houver) */}
          {voos.length > 0 && (
            <div className="mb-6">
              {voos.map((voo) => {
                const origem = voo.origem || "—";
                const destino = voo.destino || "—";
                const cia = voo.ciaAerea || "";
                const codigo = voo.codigoVoo || "";
                const partida = voo.partida
                  ? formatarHora(new Date(voo.partida))
                  : "—";
                const chegada = voo.chegada
                  ? formatarHora(new Date(voo.chegada))
                  : "—";
                const passageiro = voo.colaborador?.nome || "";

                return (
                  <div key={voo.id} className="mb-3">
                    <h2 className="text-[var(--accent)] text-lg">
                      {origem} ✈ {destino}
                      {passageiro && ` | ${passageiro}`}
                    </h2>
                    {(cia || codigo) && (
                      <p className="font-bold bg-yellow-300 underline w-fit text-lg">
                        {cia} {codigo}: {partida} → {chegada}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {agendaOrdenada.length > 0 ? (
            <ul className="mt-7 text-lg space-y-3">
              {agendaOrdenada.map((item) => {
                const horaInicio = item.dataHoraInicio
                  ? formatarHora(new Date(item.dataHoraInicio))
                  : "—:—";
                const horaFim = item.dataHoraFim
                  ? formatarHora(new Date(item.dataHoraFim))
                  : null;

                return (
                  <li key={item.id}>
                    <p className="whitespace-nowrap">
                      <span className="font-bold">
                        {horaInicio}
                        {horaFim ? ` - ${horaFim}` : ""} -{" "}
                      </span>
                      {item.titulo || "Evento"}
                    </p>
                    {item.descricao && (
                      <p className="text-blue-400 ml-16">*{item.descricao}</p>
                    )}
                    {item.tipo === "DESLOCAMENTO" && (item.origem || item.destino) && (
                      <p className="text-[var(--text-muted)] ml-16 text-sm">
                        {item.origem || "—"} → {item.destino || "—"}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-[var(--text-muted)]">Nenhum evento agendado</p>
          )}
        </div>

        {/* ===== HOSPEDAGEM ===== */}
        {hoteis.length > 0 && (
          <div className="px-8 mt-20">
            {hoteis.map((hotel, index) => (
              <div
                key={hotel.id || index}
                className="border border-neutral-400 p-4 print:break-inside-avoid mb-4"
              >
                <h1 className="text-center text-xl font-bold text-red-400 mb-8">
                  HOSPEDAGEM {hoteis.length > 1 ? index + 1 : ""}
                </h1>
                <h2 className="underline text-lg">
                  {hotel.nomeHotel || hotel.hotel?.nome || "Hotel não especificado"}
                </h2>
                {(hotel.endereco || hotel.hotel?.endereco) && (
                  <h3 className="text-lg">
                    <span className="font-bold">ENDEREÇO: </span>
                    {hotel.endereco ||
                      [
                        hotel.hotel?.endereco?.logradouro,
                        hotel.hotel?.endereco?.numero,
                        hotel.hotel?.endereco?.cidade,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                  </h3>
                )}
                {hotel.checkin && (
                  <h3 className="text-lg">
                    <span className="font-bold">CHECK-IN: </span>
                    {formatarData(new Date(hotel.checkin))}{" "}
                    {formatarHora(new Date(hotel.checkin))}
                  </h3>
                )}
                {hotel.checkout && (
                  <h3 className="text-lg">
                    <span className="font-bold">CHECK-OUT: </span>
                    {formatarData(new Date(hotel.checkout))}{" "}
                    {formatarHora(new Date(hotel.checkout))}
                  </h3>
                )}
                {hotel.distanciaAeroportoKm && (
                  <h3 className="text-lg">
                    <span className="font-bold">DISTÂNCIA AEROPORTO: </span>
                    {hotel.distanciaAeroportoKm} km
                  </h3>
                )}
                {hotel.distanciaPalcoKm && (
                  <h3 className="text-lg">
                    <span className="font-bold">DISTÂNCIA PALCO: </span>
                    {hotel.distanciaPalcoKm} km
                  </h3>
                )}
                {hotel.colaborador?.nome && (
                  <h3 className="text-lg mt-2">
                    <span className="font-bold">HÓSPEDE: </span>
                    {hotel.colaborador.nome}
                  </h3>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== TRANSPORTES ===== */}
        {transportes.length > 0 && (
          <div className="px-8 mt-20 print:break-inside-avoid">
            <h1 className="text-center text-xl font-bold text-red-400 mb-10">TRANSPORTES</h1>
            {transportes.map((t) => (
              <div key={t.id} className="mb-4 border-b border-[var(--border)] pb-3">
                <p className="text-lg">
                  <span className="font-bold">{t.tipo ? t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1) : "Transporte"}: </span>
                  {t.destino || "Destino não definido"}
                </p>
                {t.saida && (
                  <p className="text-lg">
                    <span className="font-bold">Saída: </span>
                    {formatarData(new Date(t.saida))} {formatarHora(new Date(t.saida))}
                  </p>
                )}
                {t.motorista && (
                  <p className="text-lg">
                    <span className="font-bold">Motorista: </span>
                    {t.motorista}
                  </p>
                )}
                {t.colaborador?.nome && (
                  <p className="text-lg">
                    <span className="font-bold">Passageiro: </span>
                    {t.colaborador.nome}
                  </p>
                )}
                {t.observacao && (
                  <p className="text-blue-400">*{t.observacao}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== CLIMA ===== */}
        {climaDias.length > 0 && (
          <div className="px-8 mt-20 print:break-inside-avoid">
            <h1 className="text-center text-2xl font-bold text-red-400 mb-10">
              CLIMA DA SEMANA
            </h1>
            <div className="p-4 m-auto">
              <ul>
                {climaDias.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center whitespace-nowrap mb-3"
                  >
                    <p className="w-40 text-xl capitalize">
                      {item.diaSemana}. {item.dia}
                    </p>
                    <p className="w-24 text-xl whitespace-nowrap">
                      <span className="font-bold">{item.tempMax}°</span> / {item.tempMin}°
                    </p>
                    <p>
                      {item.precipitacao > 1 ? (
                        <CloudRain className="text-[var(--info)]" />
                      ) : item.probChuva > 40 ? (
                        <Cloud className="text-[var(--text-muted)]" />
                      ) : item.probChuva > 10 ? (
                        <CloudSun className="text-yellow-500" />
                      ) : (
                        <Sun className="text-yellow-400" />
                      )}
                    </p>
                    <p className="w-32 text-lg text-right">{item.descricao || "—"}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ===== OBSERVAÇÕES ===== */}
        <div className="px-8 mt-20 print:break-inside-avoid">
          <h1 className="text-center text-xl font-bold text-red-400 mb-8">OBSERVAÇÕES</h1>
          {extras?.obs ? (
            <p className="text-lg whitespace-pre-wrap">{extras.obs}</p>
          ) : (
            <p className="text-center text-[var(--text-muted)] italic">Nenhuma observação registrada</p>
          )}
          {extras?.contatos && (
            <>
              <h2 className="font-bold text-lg mt-6">Contatos:</h2>
              <p className="text-lg whitespace-pre-wrap">{extras.contatos}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RelatorioPage;

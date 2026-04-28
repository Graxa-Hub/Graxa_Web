import { Layout } from "./Layout";
import { CalendarioTopBar } from "../organisms/CalendarioTopBar";
import { CalendarioContent } from "../organisms/CalendarioContent";

export function CalendarioPageTemplate({
  bandas,
  turnes,
  bandaSelecionada,
  turneSelecionada,
  setBandaSelecionada,
  setTurneSelecionada,
  mainCalendarApi,
  eventos,
  setMainCalendarApi,
  setEventos,
}) {
  return (
    <Layout showHeader={false}>
      <CalendarioTopBar
        bandas={bandas}
        turnes={turnes}
        bandaSelecionada={bandaSelecionada}
        turneSelecionada={turneSelecionada}
        onBandaChange={setBandaSelecionada}
        onTurneChange={setTurneSelecionada}
      />

      <CalendarioContent
        mainCalendarApi={mainCalendarApi}
        eventos={eventos}
        bandaSelecionada={bandaSelecionada}
        turneSelecionada={turneSelecionada}
        onCalendarApi={setMainCalendarApi}
        onEventosChange={setEventos}
      />
    </Layout>
  );
}

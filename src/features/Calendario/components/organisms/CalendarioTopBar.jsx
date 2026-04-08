import { Header } from "../../../../components/organisms/Header";

export function CalendarioTopBar({
  bandas,
  turnes,
  bandaSelecionada,
  turneSelecionada,
  onBandaChange,
  onTurneChange,
}) {
  return (
    <div className="mb-4">
      <Header
        bandas={bandas}
        turnes={turnes}
        bandaSelecionada={bandaSelecionada}
        turneSelecionada={turneSelecionada}
        onBandaChange={onBandaChange}
        onTurneChange={onTurneChange}
        showBandaSelector={true}
        showTurneSelector={true}
      />
    </div>
  );
}

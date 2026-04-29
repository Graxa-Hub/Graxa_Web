import { Header } from "./Header";
import { useRole } from "../../hooks/useRole";

export function CalendarioTopBar({
  bandas,
  turnes,
  bandaSelecionada,
  turneSelecionada,
  onBandaChange,
  onTurneChange,
}) {
  const { isProducer } = useRole();

  return (
    <div className="mb-4">
      <Header
        bandas={bandas}
        turnes={turnes}
        bandaSelecionada={bandaSelecionada}
        turneSelecionada={turneSelecionada}
        onBandaChange={onBandaChange}
        onTurneChange={onTurneChange}
        showBandaSelector={isProducer()}
        showTurneSelector={isProducer()}
      />
    </div>
  );
}

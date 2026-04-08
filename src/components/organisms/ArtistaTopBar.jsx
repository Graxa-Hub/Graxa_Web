import { Header } from "./Header";
import { Notificacao } from "../Notificacao/Notificacao";

export function ArtistaTopBar({
  bandas,
  selectedBanda,
  selectedTurne,
  onBandaChange,
  onTurneChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <Header
        bandas={bandas}
        turnes={[]}
        bandaSelecionada={selectedBanda}
        turneSelecionada={selectedTurne}
        onBandaChange={onBandaChange}
        onTurneChange={onTurneChange}
        showBandaSelector={true}
        showTurneSelector={true}
      />

      <Notificacao />
    </div>
  );
}

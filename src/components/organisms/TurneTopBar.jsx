import { Header } from "./Header";
import { Notificacao } from "../Notificacao/Notificacao";

export function TurneTopBar({ bandas, selectedBand, onBandSelect }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <Header
        bandas={bandas}
        turnes={[]}
        bandaSelecionada={selectedBand}
        turneSelecionada={null}
        onBandaChange={onBandSelect}
        onTurneChange={() => {}}
        showBandaSelector={true}
        showTurneSelector={false}
      />

      <Notificacao />
    </div>
  );
}

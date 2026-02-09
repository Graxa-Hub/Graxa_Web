import { Notificacao } from "../Notificacao/Notificacao";
import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "./Header";
import { Container } from "./Container";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen overflow-hidden flex">
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0">
        <Header
          circulo="bg-green-500"
          bandaSelecionada={bandaSelecionada}
          turneSelecionada={turneSelecionada}
          onBandaChange={setBandaSelecionada}
          onTurneChange={setTurneSelecionada}
          bandas={bandas}
          turnes={turnes}
        />

        <Container>{children}</Container>
      </main>

      {/* ✅ Componente de notificação fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <Notificacao />
      </div>
    </div>
  );
};

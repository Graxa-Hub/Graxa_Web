import { Notificacao } from "../Notificacao/Notificacao";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen overflow-hidden flex">
      <Sidebar />
      <main className="flex-1 bg-[#f4f5f7] p-4 sm:p-8 sm:pr-20">
        <Header
          circulo="bg-green-500"
          bandaSelecionada={bandaSelecionada}
          turneSelecionada={turneSelecionada}
          onBandaChange={setBandaSelecionada}
          onTurneChange={setTurneSelecionada}
          bandas={bandas}
          turnes={turnes}
        />

        <Container></Container>
        {children}
      </main>

      {/* ✅ Componente de notificação fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <Notificacao />
      </div>
    </div>
  );
};

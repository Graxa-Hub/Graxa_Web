import { useState } from "react";
import { Notificacao } from "../Notificacao/Notificacao";
import { Sidebar } from "../organisms/Sidebar";
import { Header } from "../organisms/Header";
import { Container } from "../atoms/Container";

export const Layout = ({
  children,
  className = "",
  containerClassName = "",
  showHeader = true,
  padding = "",
  showNotifications = true,
  showBandaSelector = true,
  showTurneSelector = true,
  bandas,
  turnes,
  bandaSelecionada,
  turneSelecionada,
  onBandaChange,
  onTurneChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell relative w-full overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className={`app-main w-full min-w-0 ${padding} ${className}`}>
        {showHeader && (
          <Header
            showBandaSelector={showBandaSelector}
            showTurneSelector={showTurneSelector}
            bandas={bandas}
            turnes={turnes}
            bandaSelecionada={bandaSelecionada}
            turneSelecionada={turneSelecionada}
            onBandaChange={onBandaChange}
            onTurneChange={onTurneChange}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        )}

        <Container className={containerClassName}>{children}</Container>
      </main>

      {showNotifications && (
        <div className="fixed top-6 right-6 z-50">
          <Notificacao />
        </div>
      )}
    </div>
  );
};

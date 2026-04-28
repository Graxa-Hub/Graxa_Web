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
}) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className={`app-main ${padding} ${className}`}>
        {showHeader && (
          <Header
            showBandaSelector={showBandaSelector}
            showTurneSelector={showTurneSelector}
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

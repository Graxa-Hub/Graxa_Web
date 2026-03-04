import { Notificacao } from "../Notificacao/Notificacao";
import { Sidebar } from "../organisms/Sidebar";
import { Header } from "../organisms/Header";
import { Container } from "../atoms/Container";

export const Layout = ({ children, className = "bg-blue-100", containerClassName = "", showHeader = true, padding = "p-5", showNotifications = true }) => {
    return (
        <div className="h-screen overflow-hidden flex">
            <Sidebar />
            <main className={`flex-1 flex flex-col ${padding} ${className} h-full min-h-0`}>
                {showHeader && <Header />}

                <Container className={containerClassName}>
                    {children}
                </Container>
            </main>

            {/* ✅ Componente de notificação fixo no canto superior direito */}
            {showNotifications && (
                <div className="fixed top-6 right-6 z-50">
                    <Notificacao />
                </div>
            )}
        </div>
    );
};

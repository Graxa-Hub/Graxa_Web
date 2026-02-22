import { Notificacao } from "../Notificacao/Notificacao";
import { Sidebar } from "../organisms/Sidebar";
import { Header } from "../organisms/Header";
import { Container } from "../atoms/Container";

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen overflow-hidden flex">
            <Sidebar />
            <main className="flex-1 flex flex-col p-5 bg-blue-100 min-h-0">
                <Header />

                <Container>
                    {children}
                </Container>
            </main>

            {/* ✅ Componente de notificação fixo no canto superior direito */}
            <div className="fixed top-6 right-6 z-50">
                <Notificacao />
            </div>
        </div>
    );
};

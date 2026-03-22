import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { imagemService } from "../../services/imagemService";
import { obterFuncao } from "../../utils/tipoUsuarioUtils";

export const SidebarHeader = () => {
    const { usuario } = useAuth();
    const [fotoUrl, setFotoUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const carregarFoto = async () => {
            if (usuario?.fotoNome) {
                setLoading(true);
                try {
                    const url = await imagemService(usuario.fotoNome);
                    setFotoUrl(url);
                } catch (error) {
                    console.error("Erro ao carregar foto do usuário:", error);
                    setFotoUrl(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setFotoUrl(null);
            }
        };

        carregarFoto();
    }, [usuario?.fotoNome]);

    return (
        <header className="flex gap-3 py-4 border-b border-[var(--border)]">
            <div className="h-11 w-11 rounded-full overflow-hidden bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center">
                {loading ? (
                    <div className="animate-pulse bg-[var(--border)] w-full h-full" />
                ) : fotoUrl ? (
                    <img
                        src={fotoUrl}
                        className="w-full h-full object-cover"
                        alt="Foto do usuário"
                        onError={() => setFotoUrl(null)}
                    />
                ) : (
                    <User size={18} className="text-[var(--text-muted)]" />
                )}
            </div>

            <div>
                {usuario ? (
                    <>
                        <h2 className="text-[13px] leading-5 font-semibold text-[var(--text-primary)]">
                            {usuario.nome || "Usuário"}
                        </h2>
                        <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                            {obterFuncao(usuario.tipoUsuario) || "Colaborador"}
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-[var(--text-secondary)]">Não logado</h2>
                        <p className="text-sm text-[var(--text-muted)]">Faça seu login</p>
                    </>
                )}
            </div>
        </header>
    );
};

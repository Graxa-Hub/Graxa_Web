import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export const HomeRedirect = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    useEffect(() => { navigate(usuario ? "/calendario" : "/login"); }, [usuario]);
    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
            <div className="w-12 h-12 border-2 border-[var(--border-hover)] border-t-[var(--accent)] rounded-full animate-spin" />
        </div>
    );
};

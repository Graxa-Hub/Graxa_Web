import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { imagemService } from "../../services/imagemService";
import { obterFuncao } from "../../utils/tipoUsuarioUtils";

export const Header = () => {
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
    <header className="flex gap-3 py-5 border-b border-neutral-300">

      {/* Foto de perfil */}
      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {loading ? (
          <div className="animate-pulse bg-gray-300 w-full h-full" />
        ) : fotoUrl ? (
          <img
            src={fotoUrl}
            className="w-full h-full object-cover"
            alt="Foto do usuário"
            onError={() => setFotoUrl(null)}
          />
        ) : (
          <User className="text-blue-600" />
        )}
      </div>

      {/* Informações */}
      <div>
        {usuario ? (
          <>
            <h2 className="text-blue-700 font-semibold">
              {usuario.nome || "Usuário"}
            </h2>
            <p className="text-sm uppercase text-gray-600">
              {obterFuncao(usuario.tipoUsuario) || "Colaborador"}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-gray-500">Não logado</h2>
            <p className="text-sm text-gray-400">Faça seu login</p>
          </>
        )}
      </div>
    </header>
  );
};

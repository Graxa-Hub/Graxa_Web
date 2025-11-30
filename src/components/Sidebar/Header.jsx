import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

export const Header = ({ usuario }) => {
  const { token } = useAuth();
  const [fotoUrl, setFotoUrl] = useState(null);

  useEffect(() => {
    if (usuario?.fotoNome) {
      setFotoUrl(
        `http://localhost:8080/imagens/download/${usuario.fotoNome}?token=${token}`
      );
    } else {
      setFotoUrl(null);
    }
  }, [usuario, token]);

  return (
    <header className="flex gap-3 py-5 border-b border-neutral-300">
      
      {/* Foto de perfil */}
      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            className="w-full h-full object-cover"
            alt="Foto do usuário"
          />
        ) : (
          <User className="text-blue-600" />
        )}
      </div>

      {/* Informações do usuário */}
      <div>
        {usuario ? (
          <>
            <h2 className="text-blue-700 font-semibold">
              {usuario.nome || "Usuário"}
            </h2>
            <p className="text-sm uppercase text-gray-600">
              {usuario.tipoUsuario || "Usuário"}
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

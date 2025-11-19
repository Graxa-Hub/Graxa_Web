import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Header = ({ usuario }) => {
  return (
    <header className="flex gap-3 py-5 border-b border-neutral-300">
      {/* Foto de perfil */}
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-200 text-white">
        <User />
      </div>

      {/* Informações do usuário */}
      <div>
        {usuario ? (
          <>
            <h2 className="text-blue-700">{usuario.nome || "Usuário"}</h2>
            <p className="text-sm uppercase">
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

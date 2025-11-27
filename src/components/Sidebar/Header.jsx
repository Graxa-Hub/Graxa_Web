import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import React, { useState } from 'react';
import UserConfigModal from '../UserConfigModal';

export const Header = ({ usuario }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header onClick={() => setOpen(true)} className="flex gap-3 py-5 border-b border-neutral-300 cursor-pointer">
        {/* Foto de perfil */}
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-200 text-white overflow-hidden">
          {usuario?.urlFoto || usuario?.foto ? (
            <img src={usuario.urlFoto || usuario.foto} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <User />
          )}
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

      <UserConfigModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

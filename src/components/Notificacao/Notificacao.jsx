import { useState, useMemo } from "react";
import { IconeNotificao } from "./IconeAlt";
import { Modal } from "./Modal";

const notificacaoLista = [
  {
    id: 1,
    text: "Nova banda cadastrada: Boogarins",
    time: "Há 5 minutos",
    read: false,
  },
  {
    id: 2,
    text: "Show adicionado ao calendário",
    time: "Há 1 hora",
    read: false,
  },
  {
    id: 3,
    text: "Viagem confirmada para São Paulo",
    time: "Há 2 horas",
    read: true,
  },
];

export const Notificacao = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Calcula o número de notificações não lidas
  const unreadCount = useMemo(
    () => notificacaoLista.filter((n) => !n.read).length,
    [notificacaoLista]
  );

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão de notificação */}
      <IconeNotificao handleOpen={handleOpen} unreadCount={unreadCount} />

      {/* Modal de notificações */}
      <Modal
        isOpen={isOpen}
        handleClose={handleClose}
        notificacaoLista={notificacaoLista}
      />
    </>
  );
};

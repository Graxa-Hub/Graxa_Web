import React, { useEffect } from "react";

const TourModal = ({ open = false, onClose = () => {} }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const turnes = [
    {
      id: 1,
      nome: "Bacuri",
      descricao: "Something short and simple here",
    },
    {
      id: 2,
      nome: "Bacuri",
      descricao: "Something short and simple here",
    },
    {
      id: 3,
      nome: "Bacuri",
      descricao: "Something short and simple here",
    },
    {
      id: 4,
      nome: "Bacuri",
      descricao: "Something short and simple here",
    },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 " onClick={onClose} aria-hidden="true" />
      <div
        className="absolute z-10 top-21 left-150 bg-white rounded-md p-2 max-w-lg min-w-80 shadow-lg max-h-[calc(100vh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-2 p-2">
          <h2 className="text-xl font-semibold">Turnes</h2>
        </header>
        {turnes.map((turne) => (
          <div
            key={turne.id}
            className="flex gap-3 items-center p-3 rounded-md hover:bg-neutral-50 cursor-pointer"
          >
            <img className="h-13 w-13 bg-green-400 rounded-lg" />
            <div>
              <h3 className="font-semibold text-md">{turne.nome}</h3>
              <p className="text-neutral-500 text-sm">{turne.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourModal;

import React, { useEffect } from "react";

export const ArtistaModal = ({ open = false, onClose = () => {} }) => {
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
      nome: "Michael Jackson",
      imagem: './michaeljackson.jpg',
    },
    {
      id: 2,
      nome: "Maria Gadu",
      imagem: './mariagadu.jpg',
    },
    {
      id: 3,
      nome: "O Neyma",
      imagem: './neymar.jpg',
    },
    {
      id: 4,
      nome: "Xamuel",
      imagem: './xamuel.jpg',
    },
  ];

  const listHasOverflow = turnes.length > 6;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 " onClick={onClose} aria-hidden="true" />
      <div
        className="absolute z-10 top-21 left-150 bg-white rounded-md p-2 shadow-lg max-h-[calc(100vh-2rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-2 p-2">
          <h2 className="text-xl font-semibold">Turnes</h2>
          <p className="text-md text-neutral-500">Serlecione os artista de <br></br>sua preferência:</p>
        </header>
        <div className={`grid grid-cols-2 gap-4 ${listHasOverflow ? "max-h-80 overflow-y-auto pr-1" : ""}`}>
          {turnes.map((turne) => (
            <div
              key={turne.id}
              className="group relative w-full aspect-square overflow-hidden rounded-xl cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <img
                src={turne.imagem}
                alt={turne.nome}
                className="w-40 h-full object-cover transition duration-200 ease-out group-hover:blur-sm group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="px-3 py-1 rounded-md text-white font-semibold text-lg opacity-0 transition duration-200 group-hover:opacity-100 bg-black/40">
                  {turne.nome}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

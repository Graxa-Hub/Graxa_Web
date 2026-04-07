import { AddButton } from "../../../../components/atoms/AddButton";

export const ArtistaHeader = ({ titulo = "Bandas", subtitulo, onAddBanda }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <h2 className="font-bold text-[var(--text-primary)] text-lg">{titulo}</h2>
      {subtitulo && (
        <p className="text-sm text-[var(--text-muted)] mt-1">{subtitulo}</p>
      )}
    </div>

    {typeof onAddBanda === "function" && (
      <AddButton text="Adicionar banda" click={onAddBanda} />
    )}
  </div>
);

import { AddButton } from "../../../../components/atoms/AddButton";

export const TurneHeader = ({ titulo = "Turnes", subtitulo, onAddTurne }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <h2 className="font-bold text-[var(--text-primary)] text-lg">{titulo}</h2>
      {subtitulo && (
        <p className="text-sm text-[var(--text-muted)] mt-1">{subtitulo}</p>
      )}
    </div>

    <div className="flex items-center gap-3 justify-end">
      {typeof onAddTurne === "function" && (
        <AddButton text="Adicionar turne" click={onAddTurne} />
      )}
    </div>
  </div>
);

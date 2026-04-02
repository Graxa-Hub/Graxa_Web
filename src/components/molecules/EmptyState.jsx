import { AddButton } from "../atoms/AddButton";

export function EmptyState({ onAdd }) {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center text-center">
      <p className="text-[var(--text-muted)] max-w-md mb-6">
        Vixi! Ainda não temos nenhuma banda cadastrada. <br /> Que tal adicionar
        uma agora e começar o show?
      </p>
      <AddButton text="Adicionar banda" click={onAdd} />
    </div>
  );
}

import { AddButton } from "../atoms/AddButton";

export function EmptyState({ onAdd }) {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center text-center">
      <p className="text-[var(--text-muted)] max-w-md mb-6">
        Vixi! Ainda não tem nada cadastrado por aqui. <br /> Clique no botão
        abaixo para começar:
      </p>
      <AddButton text="Adicionar Turnê" click={onAdd} />
    </div>
  );
}

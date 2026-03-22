import { AddButton } from "../atoms/AddButton";

export function EmptyState({ onAdd }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <p className="text-[var(--text-muted)] max-w-md mb-6">
                Vixi! Ainda não temos nenhuma banda cadastrada. Que tal adicionar uma
                agora e começar o show?
            </p>
            <AddButton text="Adicionar banda" click={onAdd} />
        </div>
    );
}

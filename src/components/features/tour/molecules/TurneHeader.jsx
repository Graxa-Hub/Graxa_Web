import { AddButton } from '../atoms/AddButton';

export function TurneHeader({ onAddBanda }) {
    return (
        <div className="flex flex-row sm:items-start sm:items-center justify-between gap-4 mb-10">
            <div>
                <h1 className="font-semibold text-lg">
                    Turnês
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    Gerencie as turnês e seus eventos.
                </p>
            </div>
            <div>
                <AddButton text="Adicionar banda" click={onAddBanda} />
            </div>
        </div>
    );
}

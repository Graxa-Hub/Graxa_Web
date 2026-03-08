import React from 'react';
import { AddButton } from "../../../../components/atoms/AddButton";

export function ArtistaHeader({ onAddBanda }) {
    return (
        <div className="flex flex-row sm:items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div>
                <h1 className="font-semibold text-lg">
                    Bandas
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    Gerencie as bandas e seus integrantes.
                </p>
            </div>
            <div>
                <AddButton text="Adicionar banda" click={onAddBanda} />
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { List } from '../../molecules/List';
import { EmptyState } from '../molecules/EmptyState';
import { DropdownActions } from '../../molecules/DropdownActions';
import { useNavigate } from 'react-router-dom';

export function BandasGrid({
    bandas,
    onEdit,
    onDelete,
    onVisualizar,
    onAddBanda,
    openDropdown,
    onToggleDropdown
}) {
    const navigate = useNavigate();
    const [selectedBanda, setSelectedBanda] = useState(null);

    const handleBandaClick = (banda) => {
        setSelectedBanda(banda.id);
        navigate(`/turne/${banda.id}`);
    };

    if (bandas.length === 0) {
        return <EmptyState onAdd={onAddBanda} />;
    }

    return (
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 mt-10 pb-4">
            <div className="space-y-3">
                {bandas.map((banda) => (
                    <List
                        key={banda.id}
                        title={banda.nome}
                        description={banda.descricao || banda.genero || 'Sem descrição'}
                        image={banda.imagemUrl}
                        isSelected={selectedBanda === banda.id}
                        onClick={() => handleBandaClick(banda)}
                        onToggleMenu={() => onToggleDropdown(banda.id)}
                        isMenuOpen={openDropdown === banda.id}
                        menuItems={
                            <DropdownActions
                                isOpen={openDropdown === banda.id}
                                entity={banda}
                                onView={onVisualizar}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                entityType="banda"
                            />
                        }
                    />
                ))}
            </div>
        </div>
    );
}

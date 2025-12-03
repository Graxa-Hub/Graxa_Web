import React from 'react';
import { Card } from './Card';
import { EmptyState } from './EmptyState';

export function BandasGrid({ 
  bandas, 
  onEdit, 
  onDelete, 
  onVisualizar, 
  onAddBanda,
  openDropdown,
  onToggleDropdown 
}) {
  if (bandas.length === 0) {
    return <EmptyState onAdd={onAddBanda} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bandas.map((banda) => (
        <Card
          key={banda.id}
          banda={banda}
          onEdit={onEdit}
          onDelete={onDelete}
          isDropdownOpen={openDropdown === banda.id}
          onToggleDropdown={() => onToggleDropdown(banda.id)}
          onVisualizar={onVisualizar}
        />
      ))}
    </div>
  );
}
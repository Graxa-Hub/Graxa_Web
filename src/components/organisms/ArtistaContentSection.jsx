import { ArtistaHeader } from "../molecules/ArtistaHeader";
import { BandasGrid } from "./BandasGrid";
import { Pagination } from "../molecules/Pagination";

export function ArtistaContentSection({
  bandas,
  loading,
  pagination,
  onAddBanda,
  onEdit,
  onDelete,
  onVisualizar,
  openDropdown,
  onToggleDropdown,
  onNextPage,
  onPrevPage,
  onGoToPage,
}) {
  return (
    <section className="flex-1 flex flex-col min-h-0 surface-card border border-[var(--border)] rounded-[var(--radius-xl)] p-4 md:p-6">
      <ArtistaHeader onAddBanda={onAddBanda} />

      <div className="flex-1 min-h-0 overflow-auto mt-2">
        <BandasGrid
          bandas={bandas}
          onEdit={onEdit}
          onDelete={onDelete}
          onVisualizar={onVisualizar}
          onAddBanda={onAddBanda}
          openDropdown={openDropdown}
          onToggleDropdown={onToggleDropdown}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination
          pagination={pagination}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          onGoToPage={onGoToPage}
          disabled={loading}
        />
      </div>
    </section>
  );
}

import { TurneHeader } from "../molecules/TurneHeader";
import { TurneError } from "../atoms/TurneError";
import { TurneList } from "./TurneList";
import { Pagination } from "../molecules/Pagination";

export function TurneContentSection({
  bandas,
  selectedBand,
  onBandSelect,
  onAddTurne,
  pagination,
  paginacaoBanda,
  onNextPage,
  onPrevPage,
  onGoToPage,
  onNextPageBanda,
  onPrevPageBanda,
  onGoToPageBanda,
  loading,
  loadingBanda,
  errorHeader,
  turnes,
  onEditTurne,
  onDeleteTurne,
}) {
  const currentPagination = selectedBand?.id ? paginacaoBanda : pagination;

  return (
    <section className="flex-1 flex flex-col min-h-0 surface-card border border-[var(--border)] rounded-[var(--radius-xl)] p-4 md:p-6">
      <div>
        <TurneHeader
          bandas={bandas}
          selectedBand={selectedBand}
          onBandSelect={onBandSelect}
          onAddTurne={onAddTurne}
        />
      </div>

      {errorHeader && <TurneError error={errorHeader} />}

      <div className="flex-1 min-h-0 overflow-auto mt-2">
        <TurneList
          turnes={turnes}
          onEditTurne={onEditTurne}
          onDeleteTurne={onDeleteTurne}
          onCreateTurne={onAddTurne}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination
          pagination={currentPagination}
          onNextPage={selectedBand?.id ? onNextPageBanda : onNextPage}
          onPrevPage={selectedBand?.id ? onPrevPageBanda : onPrevPage}
          onGoToPage={selectedBand?.id ? onGoToPageBanda : onGoToPage}
          disabled={loading || loadingBanda}
        />
      </div>
    </section>
  );
}

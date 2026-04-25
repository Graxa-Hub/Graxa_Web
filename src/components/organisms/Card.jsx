import { CardImage } from "../atoms/CardImage";
import { CardInfo } from "../atoms/CardInfo";
import { OptionButton } from "../atoms/OptionButton";

export const Card = ({
  banda,
  onClick,
  onEdit,
  onDelete,
  onVisualizar,
  isDropdownOpen,
  onToggleDropdown,
}) => {
  const hasActions = onEdit || onDelete || onVisualizar;

  return (
    <div
      onClick={onClick}
      className="surface-card overflow-hidden relative cursor-pointer hover:border-[var(--border-hover)] transition-all duration-200 group"
    >
      <CardImage src={banda.imagemUrl} alt={banda.nome} />
      <CardInfo
        nome={banda.nome}
        genero={banda.genero}
        integrantes={banda.integrantes?.length}
      />

      {hasActions && (
        <>
          <OptionButton
            onClick={(e) => {
              e.stopPropagation();
              onToggleDropdown?.();
            }}
          />

          {isDropdownOpen && (
            <div
              className="absolute top-14 right-4 z-30 w-52 max-w-[calc(100%-3rem)] rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                onClick={() => {
                  onVisualizar?.(banda);
                  onToggleDropdown?.();
                }}
              >
                Visualizar dados
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                onClick={() => {
                  onEdit?.(banda);
                  onToggleDropdown?.();
                }}
              >
                Editar dados
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-[var(--surface-hover)] transition-colors"
                onClick={() => {
                  onDelete?.(banda);
                  onToggleDropdown?.();
                }}
              >
                Apagar banda
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

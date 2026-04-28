import { CardImage } from "../atoms/CardImage";
import { CardInfo } from "../atoms/CardInfo";
import { OptionButton } from "../atoms/OptionButton";
import { DropdownActions } from "../molecules/DropdownActions";

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
            <div className="absolute top-14 right-4 z-30">
              <DropdownActions
                isOpen={isDropdownOpen}
                entity={banda}
                onView={onVisualizar}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

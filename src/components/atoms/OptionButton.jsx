import { MoreVertical } from "lucide-react";

export const OptionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-[var(--surface-hover)] hover:bg-[#383838] border border-[var(--border)] rounded-md"
    >
      <MoreVertical className="w-4 h-4 text-[var(--text-secondary)]" />
    </button>
  );
};

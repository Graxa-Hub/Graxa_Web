import { X } from "lucide-react";

export const Header = ({ handleClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">Notificações</h2>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X size={20} className="text-gray-500" />
      </button>
    </div>
  );
};

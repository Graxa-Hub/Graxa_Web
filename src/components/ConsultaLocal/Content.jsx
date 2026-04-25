import { X } from "lucide-react";

export const Content = ({ tipo, onClose }) => {
  const getTitulo = () => {
    switch (tipo) {
      case "aeroporto":
        return "Buscar Aeroporto";
      case "restaurante":
        return "Buscar Restaurante";
      case "rota":
        return "Buscar Rota";
      default:
        return "Buscar";
    }
  };

  const renderFields = () => {
    if (tipo === "rota") {
      return (
        <>
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Endereço de Origem</h2>
            <input
              type="text"
              className="form-input  focus:ring-0"
              placeholder="Digite o endereço de origem"
            />
          </div>
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Endereço de Destino</h2>
            <input
              type="text"
              className="form-input  focus:ring-0"
              placeholder="Digite o endereço de destino"
            />
          </div>
        </>
      );
    }

    return (
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Endereço</h2>
        <input
          type="text"
          className="form-input  focus:ring-0"
          placeholder="Digite o endereço"
        />
      </div>
    );
  };

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex w-full justify-between items-center mb-4 border-b border-neutral-300 pb-2">
        <h2 className="text-lg font-bold">{getTitulo()}</h2>
        <X
          className="scale-70 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] transition-colors"
          onClick={onClose}
        />
      </div>

      {/* Campos */}
      {renderFields()}

      {/* Botão */}
      <button className="w-full bg-[var(--surface-elevated)] text-white py-2 rounded-[var(--radius-sm)] hover:bg-[var(--surface-hover)] transition-colors">
        Buscar
      </button>
    </>
  );
};

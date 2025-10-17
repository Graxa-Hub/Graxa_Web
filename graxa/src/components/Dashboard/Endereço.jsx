// EnderecoModal.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function Endereço({ open, onClose, onResult }) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const result = await getDistance(origem, destino); // chama seu serviço
      onResult?.(result);
      setLoading(false);
    } catch (err) {
      setErro("Não foi possível calcular a rota.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex flex-col items-center justify-start p-6 z-50"
      onClick={onClose}
    >
      <div
        className="flex flex-row justify-between items-center bg-white rounded-full h-10 px-3 w-full max-w-sm shadow-xl ml-25"
        onClick={(e) => e.stopPropagation()}
      >
        <NavLink
          to=""
          className={({ isActive }) =>
            `flex items-center justify-center w-25 p-1 bg-neutral-400 rounded-full
          ${
            isActive
              ? "bg-neutral-300/30 text-white ring-2 ring-white/20"
              : "hover:bg-neutral-300/20 text-neutral-100 hover:text-neutral-200"
          }`
          }
        >
          Aeroporto
        </NavLink>
        <NavLink
          to=""
          className={({ isActive }) =>
            `w-25 p-1 rounded-full flex items-center justify-center text-lg transition-all duration-300
          ${
            isActive
              ? "bg-black  text-white"
              : "hover:bg-neutral text-neutral-100 hover:text-neutral-200 text-black"
          }`
          }
        >
          Hotel
        </NavLink>
        <NavLink
          to=""
          className={({ isActive }) =>
            `flex items-center justify-center w-25 p-1 bg-neutral-400 rounded-full
          ${
            isActive
              ? "bg-neutral-300/30 text-white ring-2 ring-white/20"
              : "hover:bg-neutral-300/20 text-neutral-100 hover:text-neutral-200"
          }`
          }
        >
          Aeroporto
        </NavLink>
      </div>

      <div
        className="bg-white rounded-lg p-4 w-full max-w-sm shadow-xl mt-12 ml-25"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Buscar Aeroporto</h2>
          <p>Ajustar sem margin</p>
          <div
            className="h-6 w-6 flex items-center justify-center rounded-full bg-black
            hover:bg-neutral-200 text-white hover:text-neutral-800 transition-all duration-100 ease-in-out
          "
          >
            <button onClick={onClose} className="text-sm">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-lg font-medium">Origem</label>
            <input
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Endereço da Partida"
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Destino</label>
            <input
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Endereço do Destino"
            />
          </div>
          {erro && <p className="text-red-600 text-sm">{erro}</p>}
          <button
            disabled={loading}
            className="w-full bg-black text-white rounded py-2 hover:bg-neutral-200 hover:text-black transition-all duration-200 ease-in-out"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>
      </div>
    </div>
  );
}

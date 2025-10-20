// EnderecoModal.jsx
import { useState } from "react";

export function Endereço({ open, onClose, onResult }) {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [tab, setTab] = useState("aeroporto"); // aeroporto | hotel | mapa

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
      className="absolute inset-0 bg-black/40 flex flex-col items-center justify-start p-4 z-50"
      onClick={onClose}
    >
      <div
        className="flex flex-row justify-between items-center gap-4 bg-white rounded-full h-10 px-2 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setTab("aeroporto")}
          className={`flex items-center justify-center w-30 px-3 py-1 rounded-full transition-colors duration-300 ${
            tab === "aeroporto"
              ? "text-white bg-black"
              : "text-neutral-900 font-bold hover:bg-neutral-300/60"
          }`}
        >
          Aeroporto
        </button>
        <button
          type="button"
          onClick={() => setTab("hotel")}
          className={`lex items-center justify-center w-30 px-3 py-1 rounded-full transition-colors duration-300 ${
            tab === "hotel"
              ? "text-white bg-black"
              : "text-neutral-900 font-bold hover:bg-neutral-300/60"
          }`}
        >
          Restaurante
        </button>
        <button
          type="button"
          onClick={() => setTab("mapa")}
          className={`lex items-center justify-center w-30 px-3 py-1 rounded-full transition-colors duration-300 ${
            tab === "mapa"
              ? "text-white bg-black"
              : "text-neutral-900 font-bold hover:bg-neutral-300/60"
          }`}
        >
          Hotel
        </button>
      </div>

      <div
        className="bg-white rounded-lg p-4 w-full max-w-sm shadow-xl mt-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">
            {tab === "aeroporto" && "Buscar Aeroporto"}
            {tab === "hotel" && "Buscar Restaurante"}
            {tab === "mapa" && "Buscar Hotel"}
          </h2>
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

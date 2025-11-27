import { useState } from "react";
import { getCoordinates } from "../utils/endereco/geoUtils";
import RainForecast, { RainAlert } from "./RainForecast";

/**
 * Página de teste focada apenas em previsão de chuva
 */
export default function RainForecastPage() {
  const [endereco, setEndereco] = useState("");
  const [coords, setCoords] = useState(null);
  const [buscando, setBuscando] = useState(false);

  const buscarEndereco = async () => {
    if (!endereco) return;

    setBuscando(true);
    try {
      const coordenadas = await getCoordinates(endereco);
      setCoords(coordenadas);
    } catch (err) {
      console.error("Erro ao buscar coordenadas:", err);
      alert(err.message);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          ☔ Previsão de Chuva
        </h1>

        {/* Buscar endereço */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Digite um endereço (ex: São Paulo, SP)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && buscarEndereco()}
            />
            <button
              onClick={buscarEndereco}
              disabled={buscando || !endereco}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {coords && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                📍 {coords.display_name}
              </div>
              <RainAlert latitude={coords.lat} longitude={coords.lon} days={1} />
            </div>
          )}
        </div>

        {/* Resultado - Previsão de Chuva */}
        {coords && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <RainForecast 
              latitude={coords.lat} 
              longitude={coords.lon} 
              days={3} 
            />
          </div>
        )}

        {/* Locais pré-definidos para teste rápido */}
        {!coords && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Teste rápido - Selecione uma cidade:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { nome: "São Paulo, SP", coords: { lat: -23.5505, lon: -46.6333, display_name: "São Paulo, SP" } },
                { nome: "Rio de Janeiro, RJ", coords: { lat: -22.9068, lon: -43.1729, display_name: "Rio de Janeiro, RJ" } },
                { nome: "Belo Horizonte, MG", coords: { lat: -19.9191, lon: -43.9387, display_name: "Belo Horizonte, MG" } },
                { nome: "Curitiba, PR", coords: { lat: -25.4284, lon: -49.2733, display_name: "Curitiba, PR" } },
                { nome: "Porto Alegre, RS", coords: { lat: -30.0346, lon: -51.2177, display_name: "Porto Alegre, RS" } },
                { nome: "Salvador, BA", coords: { lat: -12.9714, lon: -38.5014, display_name: "Salvador, BA" } },
                { nome: "Brasília, DF", coords: { lat: -15.8267, lon: -47.9218, display_name: "Brasília, DF" } },
                { nome: "Fortaleza, CE", coords: { lat: -3.7172, lon: -38.5433, display_name: "Fortaleza, CE" } },
              ].map((cidade) => (
                <button
                  key={cidade.nome}
                  onClick={() => {
                    setCoords(cidade.coords);
                    setEndereco(cidade.nome);
                  }}
                  className="px-4 py-3 bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  {cidade.nome}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

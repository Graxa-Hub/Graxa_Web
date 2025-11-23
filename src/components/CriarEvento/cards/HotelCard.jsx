// src/components/CriarEvento/cards/HotelCard.jsx
import React, { useState } from "react";
import { resolverEndereco } from "../../../utils/endereco/resolverEndereco";
import { calculateDistance } from "../../../utils/endereco/distance";

const HotelCard = ({ hotel, colaboradores, localShow, onChange, onRemove }) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const updateField = (field, value) => {
    onChange({ ...hotel, [field]: value });
  };

  // ======================================================
  // 🚀 BUSCAR COORDENADAS DO HOTEL + CALCULAR DISTÂNCIAS
  // ======================================================
  const handleBuscarEnderecoHotel = async () => {
    if (!hotel.endereco || hotel.endereco.trim().length < 3) {
      setErro("Digite um endereço válido.");
      return;
    }

    if (!localShow?.coordsLocal || !localShow?.aeroportoProximo) {
      setErro("O local do show precisa estar definido antes.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      // 1) Resolver endereço
      const resolved = await resolverEndereco(hotel.endereco);

      if (!resolved.sucesso) {
        setErro(resolved.erro);
        setLoading(false);
        return;
      }

      const coordsHotel = resolved.coords;

      // 2) Distância hotel → show
      const distPalco = calculateDistance(
        coordsHotel.lat,
        coordsHotel.lon,
        localShow.coordsLocal.lat,
        localShow.coordsLocal.lon
      );

      // 3) Distância hotel → aeroporto
      const distAeroporto = calculateDistance(
        coordsHotel.lat,
        coordsHotel.lon,
        localShow.aeroportoProximo.lat,
        localShow.aeroportoProximo.lon
      );

      // 4) Atualizar hotel completo
      onChange({
        ...hotel,
        endereco: resolved.enderecoCompleto,
        coordsHotel,
        distanciaPalcoKm: distPalco.toFixed(1),
        distanciaAeroportoKm: distAeroporto.toFixed(1),
      });
    } catch (e) {
      console.error(e);
      setErro("Erro ao buscar endereço do hotel.");
    }

    setLoading(false);
  };

  // ======================================================
  // SELEÇÃO DE HÓSPEDES
  // ======================================================
  const toggleHospede = (id) => {
    const exists = hotel.hospedes.includes(id);
    const novaLista = exists
      ? hotel.hospedes.filter((h) => h !== id)
      : [...hotel.hospedes, id];

    updateField("hospedes", novaLista);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 space-y-5 border border-gray-100">

      {/* BOTÃO REMOVER */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
      >
        ×
      </button>

      <h3 className="font-bold text-gray-900 text-xl">Hotel</h3>

      {/* NOME DO HOTEL */}
      <input
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Nome do hotel"
        value={hotel.nome}
        onChange={(e) => updateField("nome", e.target.value)}
      />

      {/* ENDEREÇO */}
      <div>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Endereço do hotel"
          value={hotel.endereco}
          onChange={(e) => updateField("endereco", e.target.value)}
        />

        <button
          onClick={handleBuscarEnderecoHotel}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Confirmar Endereço"}
        </button>

        {erro && <p className="text-red-500 text-sm mt-1">{erro}</p>}
      </div>

      {/* CHECKIN/CHECKOUT */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Check-in</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={hotel.checkin}
            onChange={(e) => updateField("checkin", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Check-out</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={hotel.checkout}
            onChange={(e) => updateField("checkout", e.target.value)}
          />
        </div>
      </div>

      {/* DISTÂNCIAS AUTOMÁTICAS */}
      {hotel.distanciaPalcoKm && (
        <p className="text-gray-600">
          🎤 <strong>{hotel.distanciaPalcoKm} km</strong> do local do show
        </p>
      )}

      {hotel.distanciaAeroportoKm && (
        <p className="text-gray-600">
          ✈️ <strong>{hotel.distanciaAeroportoKm} km</strong> do aeroporto
        </p>
      )}

      {/* HÓSPEDES */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Hóspedes</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const selected = hotel.hospedes.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => toggleHospede(c.id)}
                className={`w-full flex justify-between p-3 border rounded-lg transition-colors ${
                  selected ? "bg-green-50 border-green-400 hover:bg-green-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span>{c.nome}</span>
                {selected && (
                  <span className="text-green-600 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
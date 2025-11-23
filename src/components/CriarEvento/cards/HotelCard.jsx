import React, { useState } from "react";
import { resolverEndereco } from "../../../utils/endereco/resolverEndereco";
import { calcDistKm } from "../../../utils/endereco/distance";

const HotelCard = ({ hotel, onChange, colaboradores, localShow }) => {
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const atualizarEnderecoHotel = async () => {
    if (!hotel.endereco || hotel.endereco.length < 3) {
      setErro("Digite um endereço válido.");
      return;
    }

    if (!localShow?.coordsLocal) {
      setErro("Defina primeiro o local do show.");
      return;
    }

    setErro("");
    setLoading(true);

    try {
      // 1) Resolver endereço (CEP ou livre)
      const res = await resolverEndereco(hotel.endereco);
      if (!res.sucesso) {
        setErro(res.erro);
        setLoading(false);
        return;
      }

      const coordsHotel = res.coords;

      // 2) Distância hotel -> show
      const distanciaHotelShow = calcDistKm(
        coordsHotel.lat,
        coordsHotel.lon,
        localShow.coordsLocal.lat,
        localShow.coordsLocal.lon
      );

      // 3) Distância hotel -> aeroporto
      const distanciaHotelAeroporto = calcDistKm(
        coordsHotel.lat,
        coordsHotel.lon,
        localShow.aeroportoProximo.lat,
        localShow.aeroportoProximo.lon
      );

      // 4) Atualiza hotel
      onChange({
        ...hotel,
        endereco: res.enderecoCompleto,
        coordsHotel,
        distanciaHotelShowKm: distanciaHotelShow,
        distanciaHotelAeroportoKm: distanciaHotelAeroporto,
      });

    } catch (e) {
      console.error(e);
      setErro("Erro ao resolver endereço.");
    }

    setLoading(false);
  };

  const toggleHospede = (id) => {
    const already = hotel.hospedes?.includes(id);
    const novaLista = already
      ? hotel.hospedes.filter((x) => x !== id)
      : [...(hotel.hospedes || []), id];

    onChange({ ...hotel, hospedes: novaLista });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Hotel</h3>

      {/* Endereço */}
      <div>
        <input
          className="w-full p-2 border rounded"
          placeholder="CEP ou endereço completo"
          value={hotel.endereco}
          onChange={(e) =>
            onChange({ ...hotel, endereco: e.target.value })
          }
          onBlur={atualizarEnderecoHotel}
        />

        {erro && <p className="text-red-500 text-sm">{erro}</p>}
      </div>

      {/* Informações automáticas */}
      {hotel.distanciaHotelShowKm && (
        <div className="text-sm text-gray-700">
          <p><strong>Distância até o show:</strong> {hotel.distanciaHotelShowKm.toFixed(1)} km</p>
          <p><strong>Distância até aeroporto:</strong> {hotel.distanciaHotelAeroportoKm.toFixed(1)} km</p>
        </div>
      )}

      {/* Check-in/out */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Check-in</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-2 border rounded"
            value={hotel.checkin}
            onChange={(e) => onChange({ ...hotel, checkin: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm">Check-out</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-2 border rounded"
            value={hotel.checkout}
            onChange={(e) => onChange({ ...hotel, checkout: e.target.value })}
          />
        </div>
      </div>

      {/* Hóspedes */}
      <div>
        <label className="text-sm block mb-2">Hóspedes</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const selected = hotel.hospedes?.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => toggleHospede(c.id)}
                className={`w-full flex justify-between p-2 border rounded ${
                  selected ? "bg-green-100 border-green-500" : "bg-gray-50"
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

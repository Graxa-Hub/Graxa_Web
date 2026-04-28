// src/components/CriarEvento/cards/HotelCard.jsx
import React, { useState } from "react";
import { resolverEndereco } from "../../../../../../utils/endereco/resolverEndereco";
import { calculateDistance } from "../../../../../../utils/endereco/distance";

const HotelCard = ({ hotel = {}, colaboradores = [], localShow = {}, onChange, onRemove }) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Helpers para compatibilidade: backend usa nomeHotel/endereco/checkin/checkout
  const get = (field, alt) => {
    if (hotel[field] !== undefined && hotel[field] !== null) return hotel[field];
    if (alt && hotel[alt] !== undefined && hotel[alt] !== null) return hotel[alt];
    return "";
  };

  const updateField = (field, value) => {
    onChange({ ...hotel, [field]: value });
  };

  // ======================================================
  // 🚀 BUSCAR COORDENADAS DO HOTEL + CALCULAR DISTÂNCIAS
  // ======================================================
  const handleBuscarEnderecoHotel = async () => {
    const enderecoAtual = get("endereco", "endereco");
    if (!enderecoAtual || enderecoAtual.trim().length < 3) {
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
      const resolved = await resolverEndereco(enderecoAtual);

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
        distanciaPalcoKm: Number(distPalco.toFixed(1)),
        distanciaAeroportoKm: Number(distAeroporto.toFixed(1)),
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
    const hospedes = Array.isArray(hotel.hospedes) ? hotel.hospedes : [];
    const exists = hospedes.includes(id);
    const novaLista = exists ? hospedes.filter((h) => h !== id) : [...hospedes, id];
    updateField("hospedes", novaLista);
  };

  return (
    <div className="surface-card p-6 space-y-5 relative">

      {/* BOTÃO REMOVER */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-[var(--accent)] hover:text-[var(--accent)] font-bold text-xl"
      >
        ×
      </button>

      <h3 className="font-bold text-[var(--text-primary)] text-base font-semibold">Hotel</h3>

      {/* NOME DO HOTEL */}
      <input
        className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
        placeholder="Nome do hotel"
        value={get("nome", "nomeHotel")}
        onChange={(e) => updateField("nome", e.target.value)}
      />

      {/* ENDEREÇO */}
      <div>
        <input
          className="form-input  focus:ring-0 focus:border-[var(--border-strong)]"
          placeholder="Endereço do hotel"
          value={get("endereco", "endereco")}
          onChange={(e) => updateField("endereco", e.target.value)}
        />

        <button
          onClick={handleBuscarEnderecoHotel}
          className="btn-primary mt-2 text-sm"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Confirmar Endereço"}
        </button>

        {erro && <p className="text-[var(--accent)] text-sm mt-1">{erro}</p>}
      </div>

      {/* CHECKIN/CHECKOUT */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">Check-in</label>
          <input
            type="datetime-local"
            className="form-input mt-1  focus:ring-0 focus:border-[var(--border-strong)]"
            value={get("checkin", "checkin")}
            onChange={(e) => updateField("checkin", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)]">Check-out</label>
          <input
            type="datetime-local"
            className="form-input mt-1  focus:ring-0 focus:border-[var(--border-strong)]"
            value={get("checkout", "checkout")}
            onChange={(e) => updateField("checkout", e.target.value)}
          />
        </div>
      </div>

      {/* DISTÂNCIAS AUTOMÁTICAS */}
      {hotel.distanciaPalcoKm && (
        <p className="text-[var(--text-secondary)]">
          🎤 <strong>{hotel.distanciaPalcoKm} km</strong> do local do show
        </p>
      )}

      {hotel.distanciaAeroportoKm && (
        <p className="text-[var(--text-secondary)]">
          ✈️ <strong>{hotel.distanciaAeroportoKm} km</strong> do aeroporto
        </p>
      )}

      {/* HÓSPEDES */}
      <div>
        <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Hóspedes</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const hospedes = Array.isArray(hotel.hospedes) ? hotel.hospedes : [];
            const selected = hospedes.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => toggleHospede(c.id)}
                className={`w-full flex justify-between p-3 border rounded-[var(--radius-md)] transition-colors ${
                  selected ? "bg-[var(--surface)] border-green-400 hover:bg-[var(--surface-hover)]" : "bg-[var(--surface-hover)] border-[var(--border)] hover:bg-[#383838]"
                }`}
              >
                <span>{c.nome}</span>
                {selected && (
                  <span className="text-[var(--success)]">✓</span>
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

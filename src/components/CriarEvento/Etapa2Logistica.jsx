import React, { useState } from "react";
import HotelCard from "./cards/HotelCard";
import FlightCard from "./cards/FlightCard";
import TransporteCard from "./cards/TransporteCard";
import { ConfirmModal } from "../UI/ConfirmModal";
import { useToast } from "../../hooks/useToast";

import { useHotelEvento } from "../../hooks/useHotel";
import { useVooEvento } from "../../hooks/useFlight";
import { useTransporteEvento } from "../../hooks/useTransporte";

const makeTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const Etapa2Logistica = ({
  hotels,
  flights,
  transports,
  hoteisRaw,
  voosRaw,
  transportesRaw,
  setHotels,
  setFlights,
  setTransports,
  colaboradores,
  localShow
}) => {
  const { remover: removerHotelDB } = useHotelEvento();
  const { remover: removerFlightDB } = useVooEvento();
  const { remover: removerTransporteDB } = useTransporteEvento();
  const { showSuccess, showError } = useToast();

  const [confirmModal, setConfirmModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===========================================================
  // FUNÇÃO DE REMOÇÃO — agora REALMENTE remove do backend
  // ===========================================================
  const confirmarRemocao = async () => {
    if (!confirmModal?.item) return;

    const { kind, item } = confirmModal;

    try {
      setLoading(true);

      // =====================================================================
      // 1️⃣ REMOVER HOTEL (agrupado → vários registros no banco)
      // =====================================================================
      if (kind === "hotel") {
        const registros = [];

        item.hospedes.forEach((colabId) => {
          const match = (hoteisRaw || []).find(
            (hr) =>
              hr.colaboradorId === colabId &&
              String(hr.nomeHotel || "").trim() === String(item.nome || "").trim() &&
              String(hr.endereco || "").trim() === String(item.endereco || "").trim()
          );

          if (match?.id) registros.push(match.id);
        });

        for (const id of registros) {
          await removerHotelDB(id);
        }
      }

      // =====================================================================
      // 2️⃣ REMOVER VOO (agrupado → vários passageiros → vários registros)
      // =====================================================================
      if (kind === "flight") {
        const registros = [];

        item.passageiros.forEach((colabId) => {
          const match = (voosRaw || []).find(
            (vr) =>
              vr.colaboradorId === colabId &&
              String(vr.ciaAerea || "").trim() === String(item.cia || "").trim() &&
              String(vr.codigoVoo || "").trim() === String(item.numero || "").trim()
          );

          if (match?.id) registros.push(match.id);
        });

        for (const id of registros) {
          await removerFlightDB(id);
        }
      }

      // =====================================================================
      // 3️⃣ REMOVER TRANSPORTE (agrupado → vários passageiros → vários registros)
      // =====================================================================
      if (kind === "transporte") {
        const registros = [];

        item.passageiros.forEach((colabId) => {
          const match = (transportesRaw || []).find(
            (tr) =>
              tr.colaboradorId === colabId &&
              String(tr.tipo || "").trim() === String(item.tipo || "").trim()
          );

          if (match?.id) registros.push(match.id);
        });

        for (const id of registros) {
          await removerTransporteDB(id);
        }
      }

      // =====================================================================
      // 4️⃣ SEMPRE remover da UI
      // =====================================================================
      const targetKey = item.tempId || item.id;

      if (kind === "hotel") {
        setHotels((prev) => prev.filter((h) => (h.tempId || h.id) !== targetKey));
      }
      if (kind === "flight") {
        setFlights((prev) => prev.filter((f) => (f.tempId || f.id) !== targetKey));
      }
      if (kind === "transporte") {
        setTransports((prev) => prev.filter((t) => (t.tempId || t.id) !== targetKey));
      }

      showSuccess("Item removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover item de logística:", error);
      showError("Erro ao remover item. Tente novamente.");
    } finally {
      setLoading(false);
      setConfirmModal(null);
    }
  };

  // ===========================================================
  // Abrir modal de confirmação
  // ===========================================================
  const handleRemove = (kind, item) => {
    setConfirmModal({
      kind,
      item,
      title: "Remover item?",
      message: `Tem certeza que deseja remover "${
        item.nome || item.cia || item.tipo || "este item"
      }"? Esta ação não pode ser desfeita.`,
    });
  };

  // ===========================================================
  // ADICIONAR ITEMS
  // ===========================================================
  const addHotel = () =>
    setHotels((prev) => [
      ...prev,
      {
        id: null,
        tempId: makeTempId(),
        nome: "",
        endereco: "",
        checkin: "",
        checkout: "",
        distanciaAeroportoKm: null,
        distanciaPalcoKm: null,
        hospedes: [],
      },
    ]);

  const addFlight = () =>
    setFlights((prev) => [
      ...prev,
      {
        id: null,
        tempId: makeTempId(),
        cia: "",
        numero: "",
        origem: "",
        destino: "",
        saida: "",
        chegada: "",
        passageiros: [],
      },
    ]);

  const addTransporte = () =>
    setTransports((prev) => [
      ...prev,
      {
        id: null,
        tempId: makeTempId(),
        tipo: "",
        saida: "",
        chegada: "",
        responsavel: "",
        passageiros: [],
        observacao: "",
      },
    ]);

  // ===========================================================
  // Updates locais
  // ===========================================================
  const updateHotelAtIndex = (i, updated) =>
    setHotels((prev) => prev.map((h, idx) => (idx === i ? updated : h)));

  const updateFlightAtIndex = (i, updated) =>
    setFlights((prev) => prev.map((f, idx) => (idx === i ? updated : f)));

  const updateTransporteAtIndex = (i, updated) =>
    setTransports((prev) => prev.map((t, idx) => (idx === i ? updated : t)));

  // ===========================================================
  // RENDER
  // ===========================================================
  return (
    <div className="space-y-8">
      <ConfirmModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={confirmarRemocao}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmText="Sim, remover"
        cancelText="Cancelar"
        type="error"
        loading={loading}
      />

      {/* HOSPEDAGEM */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hospedagem</h2>

        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          onClick={addHotel}
        >
          Adicionar Hotel
        </button>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {hotels.map((hotel, index) => (
            <HotelCard
              key={hotel.tempId || hotel.id}
              hotel={hotel}
              colaboradores={colaboradores}
              localShow={localShow}
              onRemove={() => handleRemove("hotel", hotel)}
              onChange={(updated) => updateHotelAtIndex(index, updated)}
            />
          ))}
        </div>
      </section>

      {/* VOOS */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Voos da Equipe</h2>

        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          onClick={addFlight}
        >
          Adicionar Voo
        </button>

        <div className="mt-6 space-y-6">
          {flights.map((flight, index) => (
            <FlightCard
              key={flight.tempId || flight.id}
              flight={flight}
              colaboradores={colaboradores}
              onRemove={() => handleRemove("flight", flight)}
              onChange={(updated) => updateFlightAtIndex(index, updated)}
            />
          ))}
        </div>
      </section>

      {/* TRANSPORTES */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transportes</h2>

        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          onClick={addTransporte}
        >
          Adicionar Transporte
        </button>

        <div className="mt-6 space-y-6">
          {transports.map((t, index) => (
            <TransporteCard
              key={t.tempId || t.id}
              transporte={t}
              colaboradores={colaboradores}
              onRemove={() => handleRemove("transporte", t)}
              onChange={(updated) => updateTransporteAtIndex(index, updated)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Etapa2Logistica;

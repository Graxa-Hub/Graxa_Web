import { useEffect, useState } from "react";
import { Modal } from "./ModalEventos/Modal";
import { useBandas } from "../hooks/useBandas";

export function VisualizarTurneModal({ turne, onClose }) {
  const { buscarBandaPorId } = useBandas();
  const [banda, setBanda] = useState(null);

  useEffect(() => {
    async function fetchBanda() {
      if (turne?.bandaId) {
        try {
          const bandaData = await buscarBandaPorId(turne.bandaId);
          setBanda(bandaData);
        } catch {
          setBanda(null);
        }
      } else if (turne?.banda) {
        setBanda(turne.banda);
      } else {
        setBanda(null);
      }
    }
    fetchBanda();
  }, [turne, buscarBandaPorId]);

  if (!turne) return null;

  return (
    <Modal
      isOpen={!!turne}
      onClose={onClose}
      title={`Detalhes da turnê: ${turne.name}`}
      showFooter={false}
    >
      <div className="space-y-4 p-4 flex flex-col items-center">
        {turne.image && (
          <img
            src={turne.image}
            alt={turne.name}
            className="w-48 h-48 object-cover rounded mb-2"
          />
        )}
        <p>
          <strong>Nome:</strong> {turne.name}
        </p>
        <p>
          <strong>Descrição:</strong> {turne.description}
        </p>
        <p>
          <strong>Banda:</strong> {banda?.nome || "N/A"}
        </p>
        {/* Adicione outros campos relevantes da turnê aqui */}
      </div>
    </Modal>
  );
}

import React, { useEffect, useState } from "react";
import { Modal } from "../../ModalEventos/Modal";
import { useBandas } from "../../../hooks/useBandas";
import { Music, MapPin, Calendar, Globe } from "lucide-react";

export function VisualizarTurneModal({ turne, onClose }) {
  const { buscarBandaPorId } = useBandas();
  const [banda, setBanda] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBanda() {
      if (!turne) return;
      
      setLoading(true);
      try {
        if (turne?.bandaId) {
          const bandaData = await buscarBandaPorId(turne.bandaId);
          setBanda(bandaData);
        } else if (turne?.banda) {
          setBanda(turne.banda);
        } else {
          setBanda(null);
        }
      } catch (error) {
        console.error("Erro ao buscar banda:", error);
        setBanda(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBanda();
  }, [turne, buscarBandaPorId]);

  if (!turne) return null;

  const isAtivo = turne.status === "ativo";

  return (
    <Modal
      isOpen={!!turne}
      onClose={onClose}
      title={`${turne.name}`}
      showFooter={false}
      size="md"
    >
      <div className="space-y-6">
        {/* Imagem e Info Principal */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {turne.image && (
            <div className="w-full md:w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--surface-hover)] border border-[var(--border)] shadow-sm">
              <img
                src={turne.image}
                alt={turne.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 space-y-3">
            {/* Status Badge */}
            {turne.status && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" 
                   style={{
                     backgroundColor: isAtivo ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                     border: isAtivo ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)'
                   }}>
                <div className={`w-2 h-2 rounded-full ${isAtivo ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className={`text-sm font-medium ${isAtivo ? 'text-green-700' : 'text-gray-600'}`}>
                  {isAtivo ? "Ativo" : "Inativo"}
                </span>
              </div>
            )}

            {/* Banda Associada */}
            {banda && (
              <div className="flex items-start gap-3 p-3 bg-[var(--surface-hover)] rounded-lg border border-[var(--border)]">
                <Music className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Banda</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{banda.nome}</p>
                </div>
              </div>
            )}

            {/* Datas */}
            {turne.startDate && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Período</p>
                  <p className="text-sm text-[var(--text-primary)] mt-1">
                    {new Date(turne.startDate).toLocaleDateString("pt-BR")}
                    {turne.endDate && ` - ${new Date(turne.endDate).toLocaleDateString("pt-BR")}`}
                  </p>
                </div>
              </div>
            )}

            {/* Localização */}
            {(turne.location || turne.city || turne.country) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Localização</p>
                  <p className="text-sm text-[var(--text-primary)] mt-1">
                    {turne.city && `${turne.city}${turne.country ? ', ' : ''}`}
                    {turne.country && turne.country}
                    {!turne.city && !turne.country && turne.location}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        {turne.description && (
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">Descrição</p>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--surface-hover)] p-3 rounded-lg border border-[var(--border)]">{turne.description}</p>
          </div>
        )}

        {/* Informações Adicionais em Grid */}
        {(turne.city || turne.country) && (
          <div className="grid grid-cols-2 gap-3">
            {turne.city && (
              <div className="p-3 bg-[var(--surface-card)] border border-[var(--border)] rounded-lg">
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">Cidade</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{turne.city}</p>
              </div>
            )}
            {turne.country && (
              <div className="p-3 bg-[var(--surface-card)] border border-[var(--border)] rounded-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">País</p>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{turne.country}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

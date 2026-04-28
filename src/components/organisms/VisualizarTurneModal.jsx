import React, { useEffect, useState } from "react";
import { Modal } from "../ModalEventos/Modal";
import { useBandas } from "../../hooks/useBandas";
import { Music, Calendar } from "lucide-react";

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
          console.log("📍 Buscando banda pelo ID:", turne.bandaId);
          const bandaData = await buscarBandaPorId(turne.bandaId);
          console.log("✅ Banda encontrada:", bandaData);
          setBanda(bandaData);
        } else if (turne?.banda) {
          console.log("✅ Usando banda já carregada:", turne.banda);
          setBanda(turne.banda);
        } else {
          console.log("⚠️ Nenhuma banda encontrada na turne");
          setBanda(null);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar banda:", error);
        setBanda(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBanda();
  }, [turne, buscarBandaPorId]);

  if (!turne) return null;

  // DEBUG: Verificar os dados da turne
  console.log("🔍 [VisualizarTurneModal] Dados da turne:", {
    name: turne.name,
    startDate: turne.startDate,
    endDate: turne.endDate,
    city: turne.city,
    country: turne.country,
    location: turne.location,
    status: turne.status,
    description: turne.description,
    image: turne.image,
    bandaId: turne.bandaId,
  });

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
            {turne.status ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" 
                   style={{
                     backgroundColor: turne.status === "ativo" ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                     border: turne.status === "ativo" ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)'
                   }}>
                <div className={`w-2 h-2 rounded-full ${turne.status === "ativo" ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className={`text-sm font-medium ${turne.status === "ativo" ? 'text-green-700' : 'text-gray-600'}`}>
                  {turne.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] border-dashed">
                <div className="w-2 h-2 rounded-full bg-[var(--text-muted)]"></div>
                <span className="text-sm font-medium text-[var(--text-muted)]">Status não definido</span>
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
            {(turne.startDate || turne.endDate) ? (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Período</p>
                  <p className="text-sm text-[var(--text-primary)] mt-1">
                    {turne.startDate}
                    {turne.endDate && ` - ${turne.endDate}`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 bg-[var(--surface-hover)] rounded-lg border border-[var(--border)] border-dashed">
                <Calendar className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Período</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Não definido</p>
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
      </div>
    </Modal>
  );
}

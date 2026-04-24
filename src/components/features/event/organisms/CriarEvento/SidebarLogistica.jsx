import React from "react";

const Card = ({ title, children }) => (
  <div className="surface-card p-4 mb-4">
    <h3 className="text-base font-bold text-[var(--text-primary)] border-b pb-1 mb-2">{title}</h3>
    <div className="text-sm text-[var(--text-secondary)]">{children}</div>
  </div>
);

const SidebarDireita = ({
  etapaAtual, // ainda recebo, se quiser usar depois pra highlight, mas não bloqueio mais nada por etapa
  localShow = {},
  selectedRoles = [],
  assignments = {},
  hotels = [],
  flights = [],
  transports = [],
  agenda = [],
  extras = {},
}) => {
  const temLocal = !!localShow.coordsLocal;
  const temEquipe = selectedRoles.length > 0;
  const temLogistica = hotels.length > 0 || flights.length > 0 || transports.length > 0;
  const temAgenda = agenda.length > 0;
  const temExtras = !!(extras.obs || extras.contatos);

  return (
    <aside className="w-80 sidebar-panel overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
        Resumo Rápido
      </h2>

      {/* ========== LOCAL DO EVENTO (sempre que já tiver sido resolvido) ========== */}
      {temLocal && (
        <Card title="Local do Evento">
          <p>
            <strong>Endereço:</strong> {localShow.endereco}
          </p>
          <p>
            <strong>Cidade/UF:</strong> {localShow.cidade} / {localShow.uf}
          </p>

          {localShow.aeroportoProximo && (
            <>
              <p className="mt-2 font-semibold">Aeroporto Próximo</p>
              <p>{localShow.aeroportoProximo.aeroporto?.nome}</p>
              <p>
                {localShow.aeroportoProximo.aeroporto?.distanciaKm} km da cidade
              </p>
            </>
          )}

          {localShow.restaurantesProximos?.length > 0 && (
            <>
              <p className="mt-2 font-semibold">Restaurantes Próximos</p>
              {localShow.restaurantesProximos.map((r, i) => (
                <p key={i}>
                  {r.nome} — {r.distanciaKm} km
                </p>
              ))}
            </>
          )}
        </Card>
      )}

      {/* ========== FUNÇÕES & EQUIPE (mostra sempre que houver funções selecionadas) ========== */}
      {(temEquipe || Object.keys(assignments || {}).length > 0) && (
        <Card title="Equipe Selecionada">
          {selectedRoles.length === 0 && (
            <p className="text-[var(--accent)] italic">Nenhuma função selecionada</p>
          )}

          {selectedRoles.map((roleId) => {
            const pessoa = assignments[roleId];
            // deixa o id mais legível: "tecnico_som" → "TECNICO SOM"
            const labelFuncao = roleId.replace(/_/g, " ").toUpperCase();

            return (
              <p key={roleId} className="mb-1">
                <strong className="text-[var(--text-primary)]">{labelFuncao}:</strong>{" "}
                {pessoa ? pessoa.nome : "— falta escolher"}
              </p>
            );
          })}
        </Card>
      )}

      {/* ========== LOGÍSTICA (hotéis, voos, transportes) ========== */}
      {temLogistica && (
        <Card title="Logística">

          {/* Voos */}
          <p className="font-bold mt-3 mb-1 text-[var(--text-primary)]">Voos</p>
          {flights.length === 0 && <p className="text-[var(--text-muted)] italic">Nenhum voo adicionado</p>}
          {flights.map((f) => (
            <p key={f.id}>
              ✈️ {f.origem || "Origem"} → {f.destino || "Destino"}
            </p>
          ))}

          {/* Transportes */}
          <p className="font-bold mt-3 mb-1 text-[var(--text-primary)]">Transportes</p>
          {transports.length === 0 && <p className="text-[var(--text-muted)] italic">Nenhum transporte</p>}
          {transports.map((t) => (
            <p key={t.id}>
              🚐 {t.tipo || "Transporte"} — {t.saida || "Horário não definido"}
            </p>
          ))}
        </Card>
      )}

      {/* ========== AGENDA ========== */}
      {temAgenda && (
        <Card title="Agenda">
          {agenda.length === 0 && <p>Nenhum item de agenda</p>}
          {agenda.slice(0, 3).map((a, i) => (
            <p key={i}>
              🕒 {a.horario || a.hora || "—"} — {a.titulo || "Sem título"}
            </p>
          ))}
          {agenda.length > 3 && (
            <p className="text-[var(--text-muted)] italic mt-1">
              + {agenda.length - 3} itens adicionais
            </p>
          )}
        </Card>
      )}

      {/* ========== EXTRAS ========== */}
      {temExtras && (
        <Card title="Extras">
          {extras.obs && (
            <p className="mb-2">
              <strong>Observações:</strong> {extras.obs}
            </p>
          )}
          {extras.contatos && (
            <p>
              <strong>Contatos Importantes:</strong> {extras.contatos}
            </p>
          )}
        </Card>
      )}

      {/* fallback caso nada tenha sido preenchido ainda */}
      {!temLocal && !temEquipe && !temLogistica && !temAgenda && !temExtras && (
        <p className="text-sm text-[var(--text-muted)] italic">
          Comece preenchendo as etapas ao lado para ver o resumo aqui. ✨
        </p>
      )}
    </aside>
  );
};

export default SidebarDireita;
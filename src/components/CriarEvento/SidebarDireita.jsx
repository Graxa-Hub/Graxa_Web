import React from "react";

const Card = ({ title, children }) => (
  <div className="bg-white shadow rounded-lg p-4 mb-4">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    <div className="text-sm text-gray-600">{children}</div>
  </div>
);

const SidebarDireita = ({
  etapaAtual,
  localShow,
  selectedRoles,
  assignments,
  hotels,
  flights,
  transports,
  agenda,
  extras,
}) => {
  return (
    <aside className="w-80 bg-gray-50 border-l border-gray-200 p-5 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Resumo Rápido
      </h2>

      {/* ====================== ETAPA 1 — LOCAL DO EVENTO ====================== */}
      {etapaAtual >= 1 && localShow && localShow.coordsLocal && (
        <Card title="Local do Evento">
          <p><strong>Endereço:</strong> {localShow.endereco}</p>
          <p><strong>Cidade/UF:</strong> {localShow.cidade} / {localShow.uf}</p>

          {localShow.aeroportoProximo && (
            <>
              <p className="mt-2 font-semibold">Aeroporto Próximo</p>
              <p>{localShow.aeroportoProximo.nome}</p>
              <p>{localShow.aeroportoProximo.distanciaKm} km</p>
            </>
          )}

          {localShow.restaurantesProximos?.length > 0 && (
            <>
              <p className="mt-2 font-semibold">Restaurantes Próximos</p>
              {localShow.restaurantesProximos.map((r, i) => (
                <p key={i}>{r.nome} — {r.distanciaKm} km</p>
              ))}
            </>
          )}
        </Card>
      )}

      {/* ====================== ETAPA 2 — FUNÇÕES & EQUIPE ====================== */}
      {etapaAtual >= 2 && (
        <Card title="Equipe Selecionada">
          {selectedRoles.length === 0 && (
            <p className="text-red-500">Nenhuma função selecionada</p>
          )}

          {selectedRoles.map((roleId) => {
            const pessoa = assignments[roleId];
            return (
              <p key={roleId} className="mb-1">
                <strong>{roleId.replace("_", " ").toUpperCase()}:</strong>{" "}
                {pessoa ? pessoa.nome : "— falta escolher"}
              </p>
            );
          })}
        </Card>
      )}

      {/* ====================== ETAPA 3 — LOGÍSTICA ====================== */}
      {etapaAtual >= 3 && (
        <Card title="Logística">
          <p className="font-semibold mb-1">Hotéis</p>
          {hotels.length === 0 && <p>Nenhum hotel cadastrado</p>}
          {hotels.map((h) => (
            <p key={h.id}>🏨 {h.nome} — {h.distanciaPalcoKm} km do show</p>
          ))}

          <p className="font-semibold mt-3 mb-1">Voos</p>
          {flights.length === 0 && <p>Nenhum voo adicionado</p>}
          {flights.map((f) => (
            <p key={f.id}>✈️ {f.origem} → {f.destino}</p>
          ))}

          <p className="font-semibold mt-3 mb-1">Transportes</p>
          {transports.length === 0 && <p>Nenhum transporte</p>}
          {transports.map((t) => (
            <p key={t.id}>🚐 {t.tipo} — {t.saida}</p>
          ))}
        </Card>
      )}

      {/* ====================== ETAPA 4 — AGENDA ====================== */}
      {etapaAtual >= 4 && (
        <Card title="Agenda">
          {agenda.length === 0 && <p>Nenhum item de agenda</p>}
          {agenda.slice(0, 3).map((a, i) => (
            <p key={i}>🕒 {a.hora} — {a.titulo}</p>
          ))}
          {agenda.length > 3 && (
            <p className="text-gray-500 mt-1">
              + {agenda.length - 3} itens adicionais
            </p>
          )}
        </Card>
      )}

      {/* ====================== ETAPA 5 — EXTRAS ====================== */}
      {etapaAtual >= 5 && (
        <Card title="Extras">
          {extras?.observacoes ? (
            <p>{extras.observacoes}</p>
          ) : (
            <p>Nenhuma observação</p>
          )}
        </Card>
      )}
    </aside>
  );
};

export default SidebarDireita;

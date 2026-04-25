import React from "react";
import { TIPOS_USUARIO } from "../../../../../constants/tipoUsuario";

const Card = ({ title, children }) => (
  <div className="surface-card p-4 mb-4">
    <h3 className="text-base font-bold text-[var(--text-primary)] border-b pb-1 mb-2">
      {title}
    </h3>
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
  const temLogistica =
    hotels.length > 0 || flights.length > 0 || transports.length > 0;
  const temAgenda = agenda.length > 0;
  const temExtras = !!(extras.obs || extras.contatos);

  return (
    <aside className="w-full overflow-y-auto p-5 bg-[var(--surface)]">
      <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
        Resumo Rápido
      </h2>

      {/* ========== LOCAL DO EVENTO ========== */}
      <Card title="Local do Evento">
        {temLocal ? (
          <>
            <p>
              <strong>Endereço:</strong> {localShow.endereco?.logradouro},{" "}
              {localShow.endereco?.numero} - {localShow.endereco?.bairro}
            </p>
            <p>
              <strong>Cidade/UF:</strong> {localShow.cidade} / {localShow.uf}
            </p>

            {localShow.aeroportoProximo && (
              <>
                <p className="mt-2 font-bold">Aeroporto Próximo:</p>
                <p>{localShow.aeroportoProximo.nome}</p>
                <p>
                  {localShow.aeroportoProximo.distanciaKm} km da cidade
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-[var(--text-muted)] italic">
            Nenhum local selecionado
          </p>
        )}
      </Card>

      {/* ========== RESTAURANTES PRÓXIMOS ========== */}
      <Card title="Restaurantes Próximos">
        {localShow.restaurantesProximos?.length > 0 ? (
          <ul className="space-y-2">
            {localShow.restaurantesProximos.slice(0, 5).map((r, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-[var(--surface-hover)] px-3 py-2 rounded-[var(--radius-sm)]"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <p className="text-[var(--text-primary)] font-medium truncate text-sm">
                    🍽️ {r.nome}
                  </p>
                  {r.endereco && (
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      📍 {r.endereco}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[var(--warning)] font-semibold whitespace-nowrap flex-shrink-0">
                  {r.distanciaKm} km
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--text-muted)] italic">
            Nenhum restaurante encontrado
          </p>
        )}
      </Card>

      {/* ========== FUNÇÕES & EQUIPE ========== */}
      <Card title="Equipe Selecionada">
        {selectedRoles.length === 0 && Object.keys(assignments || {}).length === 0 ? (
          <p className="text-[var(--text-muted)] italic">
            Nenhuma função selecionada
          </p>
        ) : (
          <>
            {selectedRoles.map((roleId) => {
              const tipo = TIPOS_USUARIO.find((t) => t.value === roleId);
              const labelFuncao = tipo
                ? tipo.label
                : roleId.replace(/_/g, " ").toUpperCase();

              const selecionados = assignments[roleId] || [];
              const quantidade = Array.isArray(selecionados)
                ? selecionados.length
                : 0;

              return (
                <p
                  key={roleId}
                  className="mb-1 flex justify-between items-center"
                >
                  <span>
                    <strong className="text-[var(--text-primary)]">
                      {labelFuncao}:
                    </strong>
                  </span>
                  <span className="bg-[var(--surface-hover)] text-[var(--success)] px-3 py-1 rounded-full text-sm font-semibold ml-2">
                    {quantidade} selecionado{quantidade === 1 ? "" : "s"}
                  </span>
                </p>
              );
            })}
          </>
        )}
      </Card>

      {/* ========== LOGÍSTICA (hotéis, voos, transportes) ========== */}
      <Card title="Logística">
        {!temLogistica ? (
          <p className="text-[var(--text-muted)] italic">
            Nenhuma logística cadastrada
          </p>
        ) : (
          <>
            {/* Hotéis */}
            <p className="font-bold mb-1 text-[var(--text-primary)]">Hotéis</p>
            {hotels.length === 0 ? (
              <p className="text-[var(--text-muted)] italic">
                Nenhum hotel cadastrado
              </p>
            ) : (
              hotels.map((h) => (
                <p key={h.id}>
                  🏨 {h.nome || "Sem nome"}{" "}
                  {h.distanciaPalcoKm ? `— ${h.distanciaPalcoKm} km do show` : ""}
                </p>
              ))
            )}

            {/* Voos */}
            <p className="font-bold mt-3 mb-1 text-[var(--text-primary)]">Voos</p>
            {flights.length === 0 ? (
              <p className="text-[var(--text-muted)] italic">
                Nenhum voo adicionado
              </p>
            ) : (
              flights.map((f) => (
                <p key={f.id}>
                  ✈️ {f.origem || "Origem"} → {f.destino || "Destino"}
                </p>
              ))
            )}

            {/* Transportes */}
            <p className="font-bold mt-3 mb-1 text-[var(--text-primary)]">
              Transportes
            </p>
            {transports.length === 0 ? (
              <p className="text-[var(--text-muted)] italic">Nenhum transporte</p>
            ) : (
              transports.map((t) => (
                <p key={t.id}>
                  🚐 {t.tipo || "Transporte"} — {t.saida || "Horário não definido"}
                </p>
              ))
            )}
          </>
        )}
      </Card>

      {/* ========== AGENDA ========== */}
      <Card title="Agenda">
        {!temAgenda ? (
          <p className="text-[var(--text-muted)] italic">
            Nenhum item de agenda
          </p>
        ) : (
          <>
            {agenda.slice(0, 3).map((a, i) => {
              // Extrai HH:mm de dataHoraInicio (formato "YYYY-MM-DDTHH:mm")
              const horario = a.dataHoraInicio
                ? a.dataHoraInicio.substring(11, 16)
                : "—";
              return (
                <p key={i}>
                  🕒 {horario} — {a.titulo || "Sem título"}
                </p>
              );
            })}
            {agenda.length > 3 && (
              <p className="text-[var(--text-muted)] italic mt-1">
                + {agenda.length - 3} itens adicionais
              </p>
            )}
          </>
        )}
      </Card>

      {/* ========== EXTRAS ========== */}
      <Card title="Extras">
        {!temExtras ? (
          <p className="text-[var(--text-muted)] italic">
            Nenhum extra cadastrado
          </p>
        ) : (
          <>
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
          </>
        )}
      </Card>
    </aside>
  );
};

export default SidebarDireita;
